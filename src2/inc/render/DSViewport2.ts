#ifndef DSVIEWPORT_TS
#define DSVIEWPORT_TS
				
#include "IDSViewport.ts"
#include "Viewport.ts"
#include "DSUniforms.ts"
#include "IRenderTechnique.ts"
#include "IRenderPass.ts"
#include "ILightPoint.ts"
#include "IOmniLight.ts"
#include "IProjectLight.ts"
#include "IShadowCaster.ts"
#include "RenderableObject.ts"
#include "info/info.ts"
#include "IEffect.ts"
#include "IScene3d.ts"
#include "util/ObjectArray.ts"
#include "Screen.ts"

#define OPTIMIZED_DEFFERED 1

module akra.render {



	export class DSViewport extends Viewport implements IDSViewport  {
		private _pDefereedColorTextures: ITexture[] = [];
		private _pDeferredDepthTexture: ITexture = null;
		private _pDeferredView: IRenderableObject = null;
		private _pDeferredSkyTexture: ITexture = null;
		//index of lighting display list
		private _pLightDL: int; 

		private _pLightingUnifoms: UniformMap = {
	        omni           	: [],
	        project        	: [],
	        omniShadows    	: [],
	        projectShadows 	: [],
	        textures       	: [],
	        samplersOmni  	: [],
	        samplersProject : []
	    };

	    private _pLightPoints: util.ObjectArray = null;

		constructor(pCamera: ICamera, pTarget: IRenderTarget, csRenderMethod: string = null, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, pTarget, null, fLeft, fTop, fWidth, fHeight, iZIndex);

			var pEngine: IEngine = this.getTarget().getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var pDeferredData: IRenderTarget[] = <IRenderTarget[]>new Array(2);
			var pDeferredTextures: ITexture[] = <ITexture[]>new Array(2);
			var pDepthTexture: ITexture;
			var pDefferedView: IRenderableObject = this._pDeferredView = new Screen(pEngine.getRenderer());
			var iGuid: int = sid();
			var iWidth: uint = math.ceilingPowerOfTwo(this.actualWidth);
    		var iHeight: uint = math.ceilingPowerOfTwo(this.actualHeight);

    		if (info.browser.name === "Firefox") {
		        iWidth 	= math.min(iWidth, 1024);
		        iHeight = math.min(iHeight, 1024);
		    }

			pDepthTexture = this._pDeferredDepthTexture = pResMgr.createTexture("deferred-depth-texture-" + iGuid);
			pDepthTexture.create(iWidth, iHeight, 1, null, 0, 0, 0,
					ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

			for (var i = 0; i < 2; ++ i) {
				pDeferredTextures[i] = this._pDefereedColorTextures[i] = 
					pResMgr.createTexture("deferred-color-texture-" + i + "-" +  iGuid);

				pDeferredTextures[i].create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0, 
					ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);

				pDeferredData[i] = pDeferredTextures[i].getBuffer().getRenderTarget();
				pDeferredData[i].setAutoUpdated(false);
				var pViewport:  IViewport = pDeferredData[i].addViewport(this.getCamera(), "deferred_shading_pass_" + i, 0, 
											0, 0, this.actualWidth / pDeferredTextures[i].width, 
											this.actualHeight / pDeferredTextures[i].height);
				pDeferredData[i].attachDepthTexture(pDepthTexture);

				if (i === 1) {
					pViewport.setDepthParams(true, false, ECompareFunction.EQUAL);
					pViewport.setClearEveryFrame(true, EFrameBufferTypes.COLOR);
				}
			}

			//TODO >>>
			// pResMgr.loadAFXEffect("prepare_deferred_shading.afx");
			// pResMgr.loadAFXEffect("base_deferred_shading.afx");
			// pResMgr.loadAFXEffect("lights_and_shadows_deferred_shading.afx");
			// pResMgr.loadAFXEffect("skybox_deferred_shading.afx");
			// pResMgr.loadAFXEffect("fxaa_deferred_shading.afx");

			var pDSMethod: IRenderMethod  	= pResMgr.createRenderMethod(".deferred_shading");
			var pDSEffect: IEffect 			= pResMgr.createEffect(".deferred_shading");

			// pDSEffect.addComponent("akra.system.prepareForDeferredShading");
			pDSEffect.addComponent("akra.system.deferredShading");
			pDSEffect.addComponent("akra.system.omniLighting");
			pDSEffect.addComponent("akra.system.projectLighting");
			pDSEffect.addComponent("akra.system.omniShadowsLighting");
			pDSEffect.addComponent("akra.system.projectShadowsLighting");
			pDSEffect.addComponent("akra.system.skybox", 1, 0);

			pDSMethod.effect = pDSEffect;
			pDefferedView.getTechnique().setMethod(pDSMethod);
			pDefferedView.getTechnique()._setGlobalPostEffectsFrom(1);

			// LOG(pEngine.getComposer(), pDefferedView.getTechnique().totalPasses);
			// pDefferedView.renderMethod = pDSMethod;

			this.setClearEveryFrame(false);
			// this.backgroundColor.set(Color.CYAN);
			this.setDepthParams(false, false, 0);			

			this.setFXAA(true);
			this.connect(pDefferedView.getTechnique(), SIGNAL(render), SLOT(_onRender), EEventTypes.UNICAST);
		}

		_updateDimensions(): void {
			super._updateDimensions();

			var pDeferredTextures: ITexture[] = this._pDefereedColorTextures;

			if (isDefAndNotNull(this._pDeferredDepthTexture)) {
				this._pDeferredDepthTexture.reset(math.ceilingPowerOfTwo(this.actualWidth), math.ceilingPowerOfTwo(this.actualHeight));
				for (var i = 0; i < 2; ++ i) {
					pDeferredTextures[i].reset(math.ceilingPowerOfTwo(this.actualWidth), math.ceilingPowerOfTwo(this.actualHeight));
					pDeferredTextures[i].getBuffer().getRenderTarget().getViewport(0)
						.setDimensions(0., 0., this.actualWidth / pDeferredTextures[i].width, this.actualHeight / pDeferredTextures[i].height)
				}
			}
		}

		_updateImpl (): void {
			this.prepareForDeferredShading();

			var pLights: util.ObjectArray = <util.ObjectArray>this.getCamera().display(DL_LIGHTING);
		    
		    for (var i: int = 0; i < pLights.length; i++) {
		        pLights.value(i)._calculateShadows();
		    }

		    this._pLightPoints = pLights;

		    //prepare deferred textures
// #ifndef OPTIMIZED_DEFFERED
			this._pDefereedColorTextures[0].getBuffer().getRenderTarget().update();
			this._pDefereedColorTextures[1].getBuffer().getRenderTarget().update();
// #else
// 			var pNodeList: IObjectArray = this.getCamera().display();
// 			for (var i: int = 0; i < pNodeList.length; ++ i) {
// 				var pRenderable: IRenderableObject = pNodeList.value(i).getRenderable();
// 				pRenderable.render(this._pDefereedColorTextures[i].getBuffer().getRenderTarget().getViewport(0), null, pNodeList.value(i));
// 			}

// 			this.getTarget().getRenderer().executeQueue();
// #endif
			//render deferred
			
			this.newFrame();
			this._pDeferredView.render(this);
		}

		prepareForDeferredShading(): void {
#ifndef OPTIMIZED_DEFFERED
			var pNodeList: IObjectArray = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.length; ++ i) {
				var pRenderable: IRenderableObject = pNodeList.value(i).getRenderable();

				if (pRenderable) {
					for (var j: int = 0; j < 2; ++ j) {
						var sMethod: string = "deferred_shading_pass_" + j;
						var pMethod: IRenderMethod = pRenderable.getRenderMethod(sMethod);
						var pTechCurr: IRenderTechnique = pRenderable.getTechniqueDefault();
						var pTechnique: IRenderTechnique = pRenderable.getTechnique(sMethod);

						if (isNull(pTechnique) || pTechCurr.modified > pTechnique.modified) {
							if (!pRenderable.addRenderMethod(pRenderable.getRenderMethod(), sMethod)) {
								CRITICAL("cannot clone active render method");
							}

							pTechnique = pRenderable.getTechnique(sMethod);
							pTechnique._syncTable(pTechCurr);

							for (var k: int = 0; k < pTechnique.totalPasses; ++ k) {
								var pPass: IRenderPass = pTechnique.getPass(k);
								
								if (isNull(pPass.getRenderTarget())) {
									pPass.blend("akra.system.prepareForDeferredShading", j);
								}
							}
						}
					}
				}
			};
#else
			var pNodeList: IObjectArray = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.length; ++ i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.totalRenderable; k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var pTechCurr: IRenderTechnique = pRenderable.getTechniqueDefault();

					for (var j: int = 0; j < 2; j++) {
						var sMethod: string = "deferred_shading_pass_" + j;
						var pTechnique: IRenderTechnique = pRenderable.getTechnique(sMethod);

						if (isNull(pTechnique) || pTechCurr.modified > pTechnique.modified) {
							if (!pRenderable.addRenderMethod(pRenderable.getRenderMethod(), sMethod)) {
								CRITICAL("cannot clone active render method");
							}

							pTechnique = pRenderable.getTechnique(sMethod);
							pTechnique._syncTable(pTechCurr);

							if(j === 0){
								pTechnique._blockPass(1);
							}
							else {
								pTechnique._blockPass(0);
							}

							if(pTechnique.totalPasses > j){
								var pPass: IRenderPass = pTechnique.getPass(j);
								pPass.blend("akra.system.prepareForDeferredShading", j);
							}

						}
					}
				}


				// for(var j: uint = 0; j < pTechCurr.totalPasses; j++){
				// 	if(!pTechCurr.hasComponent("akra.system.prepareForDeferredShading", j, j)){
				// 		pTechCurr.getPass(j).blend("akra.system.prepareForDeferredShading", j);
				// 	}
				// }

				// pTechCurr.getPass(0).setRenderTarget(this._pDefereedColorTextures[0].getBuffer().getRenderTarget());
				// pTechCurr.getPass(1).setRenderTarget(this._pDefereedColorTextures[1].getBuffer().getRenderTarget());
			};
#endif		
		}

		setSkybox(pSkyTexture: ITexture): bool {
			if (pSkyTexture.textureType !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			this._pDeferredSkyTexture = pSkyTexture;

			return true;
		}

		setFXAA(bValue: bool = true): void {
			var pEffect: IEffect = this._pDeferredView.getTechnique().getMethod().effect;
			
			if (bValue) {
				pEffect.addComponent("akra.system.fxaa", 2, 0);
				this._pDeferredView.getTechnique()._setGlobalPostEffectsFrom(2);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 2, 0);
				this._pDeferredView.getTechnique()._setGlobalPostEffectsFrom(1);
			}
		}




		destroy(): void {
			super.destroy();
			
			this._pDeferredDepthTexture.destroyResource();

			this._pDefereedColorTextures[0].destroyResource();
			this._pDefereedColorTextures[1].destroyResource();

			this._pDeferredView.destroy();
			this._pDeferredView = null;

			this._pDeferredSkyTexture = null;
		}



		_onRender(pTechnique: IRenderTechnique, iPass: uint): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pDepthTexture: ITexture = this._pDeferredDepthTexture;
			var pDeferredTextures: ITexture[] = this._pDefereedColorTextures;

			switch (iPass) {
				case 0:
					var pLightUniforms: UniformMap = this._pLightingUnifoms;
					var pLightPoints: util.ObjectArray = this._pLightPoints;
					var pCamera: ICamera = this.getCamera();

					this.createLightingUniforms(pCamera, pLightPoints, pLightUniforms);

					// LOG(pLightUniforms);
					
					pPass.setForeign("nOmni", pLightUniforms.omni.length);
				    pPass.setForeign("nProject", pLightUniforms.project.length);
				    pPass.setForeign("nOmniShadows", pLightUniforms.omniShadows.length);
				    pPass.setForeign("nProjectShadows", pLightUniforms.projectShadows.length);

				    pPass.setStruct("points_omni", pLightUniforms.omni);
				    pPass.setStruct("points_project", pLightUniforms.project);
				    pPass.setStruct("points_omni_shadows", pLightUniforms.omniShadows);
				    pPass.setStruct("points_project_shadows", pLightUniforms.projectShadows);

				    for (var i: int = 0; i < pLightUniforms.textures.length; i++) {
				        pPass.setTexture("TEXTURE" + i, pLightUniforms.textures[i]);
				    }

				    pPass.setUniform("PROJECT_SHADOW_SAMPLER", pLightUniforms.samplersProject);
    				pPass.setUniform("OMNI_SHADOW_SAMPLER", pLightUniforms.samplersOmni);

    				pPass.setUniform("MIN_SHADOW_VALUE", 0.5);
    				pPass.setUniform("SHADOW_CONSTANT", 5.e+2);

    				pPass.setUniform("SCREEN_TEXTURE_RATIO",
                                     vec2(this.actualWidth / pDepthTexture.width, this.actualHeight / pDepthTexture.height));
				    
				    pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				    pPass.setTexture("DEFERRED_TEXTURE1", pDeferredTextures[1]);
				    pPass.setTexture("SCENE_DEPTH_TEXTURE", pDepthTexture);

				    pPass.setUniform("SAMPLER_TEXTURE0", <IAFXSamplerState>{ 
						textureName: "DEFERRED_TEXTURE0",
						texture: null,
						wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
						wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
						mag_filter: ETextureFilters.NEAREST,
						min_filter: ETextureFilters.NEAREST
					});

					pPass.setUniform("SAMPLER_TEXTURE1", <IAFXSamplerState>{ 
						textureName: "DEFERRED_TEXTURE1",
						texture: null,
						wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
						wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
						mag_filter: ETextureFilters.NEAREST,
						min_filter: ETextureFilters.NEAREST
					});

					pPass.setUniform("SAMPLER_SCENE_DEPTH", <IAFXSamplerState>{ 
						textureName: "SCENE_DEPTH_TEXTURE",
						texture: null,
						wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
						wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
						mag_filter: ETextureFilters.LINEAR,
						min_filter: ETextureFilters.LINEAR
					});

					break;
				case 1:
					pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				    pPass.setTexture("SKYBOX_TEXTURE", this._pDeferredSkyTexture);
				    
				    pPass.setUniform("SCREEN_TEXTURE_RATIO",
                                     vec2(this.actualWidth / pDepthTexture.width, this.actualHeight / pDepthTexture.height));

				    pPass.setUniform("SAMPLER_SKYBOX", <IAFXSamplerState>{ 
						textureName: "SKYBOX_TEXTURE",
						texture: null,
						wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
						wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
						mag_filter: ETextureFilters.LINEAR,
						min_filter: ETextureFilters.LINEAR
					});

					pPass.setUniform("SAMPLER_TEXTURE0", <IAFXSamplerState>{ 
						textureName: "DEFERRED_TEXTURE0",
						texture: null,
						wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
						wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
						mag_filter: ETextureFilters.NEAREST,
						min_filter: ETextureFilters.NEAREST
					});

					break;
			}
		}

		private inline resetUniforms(): void {
			var pUniforms = this._pLightingUnifoms;
			pUniforms.omni.clear();
		    pUniforms.project.clear();
		    pUniforms.omniShadows.clear();
		    pUniforms.projectShadows.clear();
		    pUniforms.textures.clear();
		    pUniforms.samplersProject.clear();
		    pUniforms.samplersOmni.clear();
		}

		private createLightingUniforms(pCamera: ICamera, pLightPoints: IObjectArray, pUniforms: UniformMap): void {
			var pLight: ILightPoint;
			var pOmniLight: IOmniLight;
			var pProjectLight: IProjectLight;
		    var i: int, j: int;
		    var pUniformData: IUniform;
		    var pCameraView: IMat4 = pCamera.viewMatrix;

		    var v4fLightPosition: IVec4 = vec4();
		    var v3fLightTransformPosition: IVec3 = vec3();
		    var v4fTemp: IVec4 = vec4();

		    var pShadowCaster: IShadowCaster;
		    var m4fShadow: IMat4, m4fToLightSpace: IMat4;

		    var iLastTextureIndex: int = 0;
		    var sTexture: string = "TEXTURE";

		    this.resetUniforms();

		    for (i = 0; i < pLightPoints.length; i++) {
		        pLight = pLightPoints.value(i);

		        //all cameras in list already enabled
		        // if (!pLight.enabled) {
		        //     continue;
		        // }
		        
		        v4fLightPosition.set(pLight.worldPosition, 1.);
		        pCameraView.multiplyVec4(v4fLightPosition, v4fTemp);
		        v3fLightTransformPosition.set(v4fTemp.x, v4fTemp.y, v4fTemp.z);

		        if (pLight.lightType === ELightTypes.OMNI) {
		        	
		        	pOmniLight = <IOmniLight>pLight;

		            if (pLight.isShadowCaster) {
		                pUniformData = uniformOmniShadow();
		                (<UniformOmniShadow>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                
		                var pDepthCube: ITexture[] 					= pOmniLight.getDepthTextureCube();
		                var pShadowCasterCube: IShadowCaster[] 	= pOmniLight.getShadowCaster();
		                
		                for (j = 0; j < 6; ++ j) {
		                    pShadowCaster = pShadowCasterCube[j];
		                    m4fToLightSpace = pShadowCaster.viewMatrix.multiply(pCamera.worldMatrix, mat4());
		                    pUniforms.textures.push(pDepthCube[j]);
		                    sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
		                    
		                    (<UniformOmniShadow>pUniformData).setSampler(sTexture, j);
		                    pUniforms.samplersOmni.push((<UniformOmniShadow>pUniformData).SHADOW_SAMPLER[j]);
		                    (<UniformOmniShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.optimizedProjection, j);
		                }

		                pUniforms.omniShadows.push(<UniformOmniShadow>pUniformData);
		            }
		            else {
		                pUniformData = uniformOmni();
		                (<UniformOmni>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                pUniforms.omni.push(<UniformOmni>pUniformData);
		            }
		        }
		        else if (pLight.lightType === ELightTypes.PROJECT) {
		        	pProjectLight = <IProjectLight>pLight;
		        	pShadowCaster = pProjectLight.getShadowCaster();

		            if (pLight.isShadowCaster && pShadowCaster.isShadowCasted) {
		                pUniformData = uniformProjectShadow();
		                (<UniformProjectShadow>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                
		                m4fToLightSpace = pShadowCaster.viewMatrix.multiply(pCamera.worldMatrix, mat4());
		                pUniforms.textures.push(pProjectLight.getDepthTexture());
		                sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

		                (<UniformProjectShadow>pUniformData).setSampler(sTexture);
		                pUniforms.samplersProject.push((<UniformProjectShadow>pUniformData).SHADOW_SAMPLER);
		                (<UniformProjectShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.projectionMatrix, pShadowCaster.optimizedProjection);
		                pUniforms.projectShadows.push(<UniformProjectShadow>pUniformData);
		            }
		            else {
		                pUniformData = uniformProject();
		                (<UniformProject>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                m4fShadow = pShadowCaster.projViewMatrix.multiply(pCamera.worldMatrix, mat4());
		                (<UniformProject>pUniformData).setMatrix(m4fShadow);
		                pUniforms.project.push(<UniformProject>pUniformData);
		            }

		        }
		        else {
		        	CRITICAL("Invalid light point type detected.");
		        }
		    }
		}
	}
}

#endif

