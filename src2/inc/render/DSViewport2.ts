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

module akra.render {

	export class DSViewport extends Viewport implements IDSViewport  {
		private _pDefferedColorTextures: ITexture[];
		private _pDeferredDepthTexture: ITexture;
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

	    private _pLightPoints: ILightPoint[] = null;

		constructor(pCamera: ICamera, pTarget: IRenderTarget, csRenderMethod: string = null, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, pTarget, null, fLeft, fTop, fWidth, fHeight, iZIndex);

			var pEngine: IEngine = this.getTarget().getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var pDeferredData: IRenderTarget[] = <IRenderTarget[]>new Array(2);
			var pDeferredTextures: ITexture[] = <ITexture[]>new Array(2);
			var pDepthTexture: ITexture;
			var pDefferedView: IRenderableObject = this._pDeferredView = new render.RenderableObject();
			var iGuid: int = sid();
			var iWidth: uint = math.ceilingPowerOfTwo(this.actualWidth);
    		var iHeight: uint = math.ceilingPowerOfTwo(this.actualHeight);

    		if (info.browser.name === "Firefox") {
		        iWidth 	= math.min(iWidth, 1024);
		        iHeight = math.min(iHeight, 1024);
		    }

			pDepthTexture = this._pDeferredDepthTexture = pResMgr.createTexture("deferred-depth-texture-" + iGuid);
			pDepthTexture.create(iWidth, iHeight, 1, null, 0, 0,
					ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH);

			for (var i = 0; i < 2; ++ i) {
				pDeferredTextures[i] = this._pDefferedColorTextures[i] = 
					pResMgr.createTexture("deferred-color-texture-" + i + "-" +  iGuid);
				pDeferredTextures[i].create(iWidth, iHeight, 1, null, 0, 0, 
					ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);

				pDeferredData[i] = pDeferredTextures[i].getBuffer().getRenderTarget();
				pDeferredData[i].addViewport(this.getCamera(), "deferred_shading_pass_" + i);

				pDeferredData[i].attachDepthTexture(pDepthTexture);
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
			pDSEffect.addComponent("akra.system.skybox", 1);

			pDSMethod.effect = pDSEffect;
			pDefferedView.renderMethod = pDSMethod;

			

			this.connect(pDefferedView.getTechnique(), SIGNAL(render), SLOT(_onRender));
		}

		update (): bool {
			
			this.prepareForDeferredShading();

			var pLights: ILightPoint[] = <ILightPoint[]><any>this.getCamera().display(DL_LIGHTING);
		    
		    for (var i: int = 0; i < pLights.length; i++) {
		        pLights[i]._calculateShadows();
		    }

		    this._pLightPoints = pLights;

		    //prepare deferred textures
			this._pDefferedColorTextures[0].getBuffer().getRenderTarget().update();
			this._pDefferedColorTextures[1].getBuffer().getRenderTarget().update();

			//render defferred
			this._pDeferredView.render();	

			return true;
		}

		prepareForDeferredShading(): void {
			var pNodeList: IObjectArray = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.length; ++ i) {
				var pRenderable: IRenderableObject = pNodeList.value(i).getRenderable();

				if (pRenderable) {
					for (var j: int = 0; j < 2; ++ j) {
						var sMethod: string = "deferred_shading_pass_" + j;
						var pMethod: IRenderMethod = pRenderable.getRenderMethod(sMethod);
						var pTechCurr: IRenderTechnique = pRenderable.getTechnique();
						var pTechnique: IRenderTechnique = pRenderable.getTechnique(sMethod);

						if (isNull(pTechnique) || pTechCurr.modified >= pTechnique.modified) {
							if (!pRenderable.addRenderMethod(pRenderable.getRenderMethod(), sMethod)) {
								CRITICAL("cannot clone active render method");
							}
							
							pTechnique = pRenderable.getTechnique(sMethod);

							for (var k: int = 0; k < pTechnique.totalPasses; ++ k) {
								var pPass: IRenderPass = pTechnique.getPass(k);
								
								if (isNull(pPass.getRenderTarget())) {
									pPass.data.blend("akra.system.prepareForDeferredShading.pass" + j);
								}
							}
						}
					}
				}
			};		
		}

		setSkybox(pSkyTexture: ITexture): bool {
			if (pSkyTexture.textureType !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			this._pDeferredSkyTexture = pSkyTexture;

			return true;
		}

		setFXAA(bValue: bool = true): void {
			var pEffect: IEffect = this._pDeferredView.renderMethod.effect;
			
			if (bValue) {
				pEffect.addComponent("akra.system.fxaa", 2);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 2);
			}
		}




		destroy(): void {
			super.destroy();
			
			this._pDeferredDepthTexture.destroyResource();

			this._pDefferedColorTextures[0].destroyResource();
			this._pDefferedColorTextures[1].destroyResource();

			this._pDeferredView.destroy();
			this._pDeferredView = null;

			this._pDeferredSkyTexture = null;
		}



		_onRender(pTechnique: IRenderTechnique, iPass: uint): void {
			switch (iPass) {
				case 2:
					var pLightUniforms: UniformMap = this._pLightingUnifoms;
					var pLightPoints: ILightPoint[] = this._pLightPoints;
					var pCamera: ICamera = this.getCamera();
					var pDepthTexture: ITexture = this._pDeferredDepthTexture;
					var pDeferredTextures: ITexture[] = this._pDefferedColorTextures;

					this.createLightingUniforms(pCamera, pLightPoints, pLightUniforms);

					pTechnique.setState("lights.omni", pLightUniforms.omni.length);
					pTechnique.setState("lights.project", pLightUniforms.project.length);
					pTechnique.setState("lights.omniShadows", pLightUniforms.omniShadows.length);
					pTechnique.setState("lights.projectShadows", pLightUniforms.projectShadows.length);

					pTechnique.setForeign("nOmni", pLightUniforms.omni.length);
				    pTechnique.setForeign("nProject", pLightUniforms.project.length);
				    pTechnique.setForeign("nOmniShadows", pLightUniforms.omniShadows.length);
				    pTechnique.setForeign("nProjectShadows", pLightUniforms.projectShadows.length);

				    pTechnique.setStruct("points_omni", pLightUniforms.omni);
				    pTechnique.setStruct("points_project", pLightUniforms.project);
				    pTechnique.setStruct("points_omni_shadows", pLightUniforms.omniShadows);
				    pTechnique.setStruct("points_project_shadows", pLightUniforms.projectShadows);

				    for (var i: int = 0; i < pLightUniforms.textures.length; i++) {
				        pTechnique.setTextureBySemantics("TEXTURE" + i, pLightUniforms.textures[i]);
				    }

				    pTechnique.setShadowSamplerArray("project_shadow_sampler", pLightUniforms.samplersProject);
    				pTechnique.setShadowSamplerArray("omni_shadow_sampler", pLightUniforms.samplersOmni);

    				pTechnique.setVec2BySemantic("SCREEN_TEXTURE_RATIO",
                                     vec2(this.actualWidth / pDepthTexture.width, this.actualHeight / pDepthTexture.height));
				    
				    pTechnique.setTextureBySemantics("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				    pTechnique.setTextureBySemantics("DEFERRED_TEXTURE1", pDeferredTextures[1]);
				    pTechnique.setTextureBySemantics("SCENE_DEPTH_TEXTURE", pDepthTexture);

					break;
				//case 1;
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

		private createLightingUniforms(pCamera: ICamera, pLightPoints: ILightPoint[], pUniforms: UniformMap): void {
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
		        pLight = pLightPoints[i];

		        if (!pLight.isEnabled()) {
		            continue;
		        }
		        
		        v4fLightPosition.set(pLight.worldPosition, 1.);
		        pCameraView.multiplyVec4(v4fLightPosition, v4fTemp)
		        v3fLightTransformPosition.set(v4fTemp.x, v4fTemp.y, v4fTemp.z);

		        if (pLight.type === <int>EEntityTypes.LIGHT_OMNI_DIRECTIONAL) {
		        	
		        	pOmniLight = <IOmniLight>pLight;

		            if (pLight.isShadowCaster()) {
		                pUniformData = uniformOmniShadow();
		                (<UniformOmniShadow>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                
		                var pDepthCube: ITexture[] 					= pOmniLight.getDepthTextureCube();
		                var pShadowCasterCube: IShadowCasterCube 	= pOmniLight.getShadowCaster();
		                var pOptimizedProjCube: IMat4[] 			= pOmniLight.optimizedProjectionCube;
		                
		                for (j = 0; j < 6; ++ j) {
		                    pShadowCaster = pShadowCasterCube[j];
		                    m4fToLightSpace = pShadowCaster.viewMatrix.multiply(pCamera.worldMatrix, mat4());
		                    pUniforms.textures.push(pDepthCube[j]);
		                    sTexture = "TEXTURE" + (pUniforms.textures.length - 1);
		                    
		                    (<UniformOmniShadow>pUniformData).setSampler(sTexture, j);
		                    pUniforms.samplersOmni.push((<UniformOmniShadow>pUniformData).SHADOW_SAMPLER[j]);
		                    (<UniformOmniShadow>pUniformData).setMatrix(m4fToLightSpace,pOptimizedProjCube[j], j);
		                }

		                pUniforms.omniShadows.push(<UniformOmniShadow>pUniformData);
		            }
		            else {
		                pUniformData = uniformOmni();
		                (<UniformOmni>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                pUniforms.omni.push(<UniformOmni>pUniformData);
		            }
		        }
		        else if (pLight.type === <int>EEntityTypes.LIGHT_PROJECT) {
		        	pProjectLight = <IProjectLight>pLight;

		            if (pLight.isShadowCaster()) {
		                pUniformData = uniformProjectShadow();
		                (<UniformProjectShadow>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                
		                pShadowCaster = pProjectLight.getShadowCaster();
		                m4fToLightSpace = pShadowCaster.viewMatrix.multiply(pCamera.worldMatrix, mat4());
		                pUniforms.textures.push(pProjectLight.getDepthTexture());
		                sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

		                (<UniformProjectShadow>pUniformData).setSampler(sTexture);
		                pUniforms.samplersProject.push((<UniformProjectShadow>pUniformData).SHADOW_SAMPLER);
		                (<UniformProjectShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.projectionMatrix, pProjectLight.optimizedProjection);
		                pUniforms.projectShadows.push(<UniformProjectShadow>pUniformData);
		            }
		            else {
		                pUniformData = uniformProject();
		                (<UniformProject>pUniformData).setLightData(pLight.params, v3fLightTransformPosition);
		                pShadowCaster = pProjectLight.getShadowCaster();
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

