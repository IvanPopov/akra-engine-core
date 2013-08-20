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
#include "util/DepthRange.ts"
#include "Screen.ts"

#define OPTIMIZED_DEFFERED 1

module akra.render {

	var pDepthPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_DEPTH, new Uint8Array(4 * 1));
	var pFloatColorPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_RGBA, new Uint8Array(4 * 4));
	var pColor: IColor = new Color(0);

	export class DSViewport extends Viewport implements IDSViewport  {
		private _pDeferredEffect: IEffect = null;
		private _pDeferredColorTextures: ITexture[] = [];
		private _pDeferredDepthTexture: ITexture = null;
		private _pDeferredView: IRenderableObject = null;
		private _pDeferredSkyTexture: ITexture = null;
		//index of lighting display list
		private _pLightDL: int; 

		private _pLightingUnifoms: UniformMap = {
	        omni           	: [],
	        project        	: [],
	        sun				: [],
	        omniShadows    	: [],
	        projectShadows 	: [],
	        sunShadows 		: [],
	        textures       	: [],
	        samplersOmni  	: [],
	        samplersProject : [],
	        samplersSun		: []
	    };

	    private _pLightPoints: util.ObjectArray = null;

	    inline get type(): EViewportTypes { return EViewportTypes.DSVIEWPORT; }

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

			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			for (var i = 0; i < 2; ++ i) {
				pDeferredTextures[i] = this._pDeferredColorTextures[i] = 
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

			var pDSMethod: IRenderMethod  	= pResMgr.createRenderMethod(".deferred_shading");
			var pDSEffect: IEffect 			= this._pDeferredEffect = pResMgr.createEffect(".deferred_shading");

			pDSEffect.addComponent("akra.system.deferredShading");
			pDSEffect.addComponent("akra.system.omniLighting");
			pDSEffect.addComponent("akra.system.projectLighting");
			pDSEffect.addComponent("akra.system.omniShadowsLighting");
			pDSEffect.addComponent("akra.system.projectShadowsLighting");
			pDSEffect.addComponent("akra.system.sunLighting");
			pDSEffect.addComponent("akra.system.sunShadowsLighting");
			// pDSEffect.addComponent("akra.system.color_maps");
			pDSEffect.addComponent("akra.system.skybox", 1, 0);

			pDSMethod.effect = pDSEffect;
			pDefferedView.getTechnique().setMethod(pDSMethod);
			pDefferedView.getTechnique()._setGlobalPostEffectsFrom(1);			

			this.setClearEveryFrame(false);
			this.setDepthParams(false, false, 0);			

			this.setFXAA(true);

			var pSeeTextureMethod: IRenderMethod  	= pResMgr.createRenderMethod(".see_texture");
			var pSeeTextureEffect: IEffect 			= pResMgr.createEffect(".see_texture");
			pSeeTextureEffect.addComponent("akra.system.texture_to_screen");
			pSeeTextureMethod.effect = pSeeTextureEffect;
			pDefferedView.addRenderMethod(pSeeTextureMethod, ".see_texture");

			// this._pDeferredView.switchRenderMethod(null);
		}

		inline get effect(): IEffect {
			return this._pDeferredEffect;
		}

		inline get depth(): ITexture {
			return this._pDeferredDepthTexture;
		}

		inline get view(): IRenderableObject {
			return this._pDeferredView;
		}

		setCamera(pCamera: ICamera): bool {
			var isOk = super.setCamera(pCamera);
			this._pDeferredColorTextures[0].getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
			this._pDeferredColorTextures[1].getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
			return isOk;
		}

		_updateDimensions(): void {
			super._updateDimensions();

			var pDeferredTextures: ITexture[] = this._pDeferredColorTextures;

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

		    //prepare deferred textures
// #ifndef OPTIMIZED_DEFFERED
			this._pDeferredColorTextures[0].getBuffer().getRenderTarget().update();
			this._pDeferredColorTextures[1].getBuffer().getRenderTarget().update();

			this._pCamera._keepLastViewport(this);

			var pLights: util.ObjectArray = <util.ObjectArray>this.getCamera().display(DL_LIGHTING);
		    
		    for (var i: int = 0; i < pLights.length; i++) {
		        pLights.value(i)._calculateShadows();
		    }

		    this._pLightPoints = pLights;
// #else
// 			var pNodeList: IObjectArray = this.getCamera().display();
// 			for (var i: int = 0; i < pNodeList.length; ++ i) {
// 				var pRenderable: IRenderableObject = pNodeList.value(i).getRenderable();
// 				pRenderable.render(this._pDeferredColorTextures[i].getBuffer().getRenderTarget().getViewport(0), null, pNodeList.value(i));
// 			}

// 			this.getTarget().getRenderer().executeQueue();
// #endif
			//render deferred
			
			this._pDeferredView.render(this, this._bSeeDepth ? ".see_texture": null);
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
					var iTotalPasses: uint = pTechCurr.totalPasses;

					for (var j: int = 0; j < iTotalPasses; j++) {
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

				// pTechCurr.getPass(0).setRenderTarget(this._pDeferredColorTextures[0].getBuffer().getRenderTarget());
				// pTechCurr.getPass(1).setRenderTarget(this._pDeferredColorTextures[1].getBuffer().getRenderTarget());
			};
#endif		
		}

		inline getSkybox(): ITexture { return this._pDeferredSkyTexture; }

		

		getDepth(x: int, y: int): float {
			ASSERT(x < this.actualWidth && y < this.actualHeight, "invalid pixel: {" + x + ", " + y + "}");
			
			var pDepthTexture: ITexture = this._pDeferredDepthTexture;

			//depth texture has POT sized, but viewport not;
			//depth texture attached to left bottom angle of viewport
			y = y + (pDepthTexture.height - this.actualHeight);
			pDepthPixel.left = x;
			pDepthPixel.top = y;
			pDepthPixel.right = x + 1;
			pDepthPixel.bottom = y + 1;

			pDepthTexture.getBuffer(0, 0).readPixels(pDepthPixel);

			return pDepthPixel.getColorAt(pColor, 0, 0).r;
		}

		protected _getDepthRangeImpl(): IDepthRange{
			var pRange: IDepthRange = util.getDepthRange(this._pDeferredDepthTexture);
			//[0,1] -> [-1, 1]
			pRange.min = pRange.min * 2. - 1.;
			pRange.max = pRange.max * 2. - 1.;

			return pRange;
		}
		
		inline getRenderId(x: int, y: int): int {
			return this._getDeferredTex1Value(x, y).a;
		}

		_getDeferredTex1Value(x: int, y: int): IColor {
			ASSERT(x < this.actualWidth && y < this.actualHeight, "invalid pixel: {" + x + ", " + y + "}");
			
			var pColorTexture: ITexture = this._pDeferredColorTextures[0];

			//depth texture has POT sized, but viewport not;
			//depth texture attached to left bottom angle of viewport
			y = y + (pColorTexture.height - this.actualHeight);
			pFloatColorPixel.left = x;
			pFloatColorPixel.top = y;
			pFloatColorPixel.right = x + 1;
			pFloatColorPixel.bottom = y + 1;
			console.log(">>>>");
			pColorTexture.getBuffer(0, 0).readPixels(pFloatColorPixel);
			console.log("<<<<");
			// LOG(pFloatColorPixel.data);
			return pFloatColorPixel.getColorAt(pColor, 0, 0);
		}

		setSkybox(pSkyTexture: ITexture): bool {
			if (pSkyTexture.textureType !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			this._pDeferredSkyTexture = pSkyTexture;

			this.addedSkybox(pSkyTexture);

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

		setOutlining(bValue: bool = true): void {
			var pEffect: IEffect = this._pDeferredView.getTechnique().getMethod().effect;
			
			if (bValue) {
				pEffect.addComponent("akra.system.outline", 1, 0);
			}
			else {
				pEffect.delComponent("akra.system.outline", 1, 0);
			}
		}

		isFXAA(): bool {
			return false;
		}


		destroy(): void {
			super.destroy();
			
			this._pDeferredDepthTexture.destroyResource();

			this._pDeferredColorTextures[0].destroyResource();
			this._pDeferredColorTextures[1].destroyResource();

			this._pDeferredView.destroy();
			this._pDeferredView = null;

			this._pDeferredSkyTexture = null;
		}

		private _bSeeDepth: bool = false;
		seeDepthTexture(): void {
			this._bSeeDepth = !this._bSeeDepth;

			if(this._bSeeDepth){
				this._pDeferredView.switchRenderMethod(".see_texture");
			}
			else {
				this._pDeferredView.switchRenderMethod(null);
			}
		}


		render(
			pTechnique: IRenderTechnique, 
			iPass: uint, 
			pRenderable: IRenderableObject, 
			pSceneObject: ISceneObject): void {
			
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pDepthTexture: ITexture = this._pDeferredDepthTexture;
			var pDeferredTextures: ITexture[] = this._pDeferredColorTextures;

			if(this._bSeeDepth){
				var pSun: ISunLight = this._pLightPoints.value(0);

				pPass.setTexture("TEXTURE0", pSun.getDepthTexture());
				super.render(pTechnique, iPass, pRenderable, pSceneObject);
				return;
			}



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
				    pPass.setForeign("nSun", pLightUniforms.sun.length);
				    pPass.setForeign("nSunShadows", pLightUniforms.sunShadows.length);

				    pPass.setStruct("points_omni", pLightUniforms.omni);
				    pPass.setStruct("points_project", pLightUniforms.project);
				    pPass.setStruct("points_omni_shadows", pLightUniforms.omniShadows);
				    pPass.setStruct("points_project_shadows", pLightUniforms.projectShadows);
				    pPass.setStruct("points_sun", pLightUniforms.sun);
				    pPass.setStruct("points_sun_shadows", pLightUniforms.sunShadows);

				    for (var i: int = 0; i < pLightUniforms.textures.length; i++) {
				        pPass.setTexture("TEXTURE" + i, pLightUniforms.textures[i]);
				    }

				    pPass.setUniform("PROJECT_SHADOW_SAMPLER", pLightUniforms.samplersProject);
	    			pPass.setUniform("OMNI_SHADOW_SAMPLER", pLightUniforms.samplersOmni);
	    			pPass.setUniform("SUN_SHADOW_SAMPLER", pLightUniforms.samplersSun);

    				pPass.setUniform("MIN_SHADOW_VALUE", 0.5);
    				pPass.setUniform("SHADOW_CONSTANT", 5.e+2);

    				pPass.setUniform("SCREEN_TEXTURE_RATIO",
                                     vec2(this.actualWidth / pDepthTexture.width, this.actualHeight / pDepthTexture.height));
				    
				    pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				    pPass.setTexture("DEFERRED_TEXTURE1", pDeferredTextures[1]);
				    pPass.setTexture("SCENE_DEPTH_TEXTURE", pDepthTexture);

				 //    pPass.setUniform("SAMPLER_TEXTURE0", <IAFXSamplerState>{ 
					// 	textureName: "DEFERRED_TEXTURE0",
					// 	texture: null,
					// 	wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	mag_filter: ETextureFilters.NEAREST,
					// 	min_filter: ETextureFilters.NEAREST
					// });

					// pPass.setUniform("SAMPLER_TEXTURE1", <IAFXSamplerState>{ 
					// 	textureName: "DEFERRED_TEXTURE1",
					// 	texture: null,
					// 	wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	mag_filter: ETextureFilters.NEAREST,
					// 	min_filter: ETextureFilters.NEAREST
					// });

					// pPass.setUniform("SAMPLER_SCENE_DEPTH", <IAFXSamplerState>{ 
					// 	textureName: "SCENE_DEPTH_TEXTURE",
					// 	texture: null,
					// 	wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	mag_filter: ETextureFilters.LINEAR,
					// 	min_filter: ETextureFilters.LINEAR
					// });

					break;
				case 1:
					pPass.setTexture("DEFERRED_TEXTURE0", pDeferredTextures[0]);
				    pPass.setTexture("SKYBOX_TEXTURE", this._pDeferredSkyTexture);
				    
				    pPass.setUniform("SCREEN_TEXTURE_RATIO",
                                     vec2(this.actualWidth / pDepthTexture.width, this.actualHeight / pDepthTexture.height));

				 //    pPass.setUniform("SAMPLER_SKYBOX", <IAFXSamplerState>{ 
					// 	textureName: "SKYBOX_TEXTURE",
					// 	texture: null,
					// 	wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	mag_filter: ETextureFilters.LINEAR,
					// 	min_filter: ETextureFilters.LINEAR
					// });

					// pPass.setUniform("SAMPLER_TEXTURE0", <IAFXSamplerState>{ 
					// 	textureName: "DEFERRED_TEXTURE0",
					// 	texture: null,
					// 	wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
					// 	mag_filter: ETextureFilters.NEAREST,
					// 	min_filter: ETextureFilters.NEAREST
					// });

					break;
			}

			super.render(pTechnique, iPass, pRenderable, pSceneObject);
		}

		private inline resetUniforms(): void {
			var pUniforms = this._pLightingUnifoms;
			pUniforms.omni.clear();
		    pUniforms.project.clear();
		    pUniforms.sun.clear();
		    pUniforms.omniShadows.clear();
		    pUniforms.projectShadows.clear();
		    pUniforms.sunShadows.clear();
		    pUniforms.textures.clear();
		    pUniforms.samplersProject.clear();
		    pUniforms.samplersOmni.clear();
		    pUniforms.samplersSun.clear();
		}

		private createLightingUniforms(pCamera: ICamera, pLightPoints: IObjectArray, pUniforms: UniformMap): void {
			var pLight: ILightPoint;
			var pOmniLight: IOmniLight;
			var pProjectLight: IProjectLight;
			var pSunLight: ISunLight;
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
		    var pEngine: IEngine = this.getTarget().getRenderer().getEngine();

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
		                (<UniformOmniShadow>pUniformData).setLightData(<IOmniParameters>pLight.params, v3fLightTransformPosition);
		                
		                var pDepthCube: ITexture[]				= pOmniLight.getDepthTextureCube();
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
		                (<UniformOmni>pUniformData).setLightData(<IOmniParameters>pLight.params, v3fLightTransformPosition);
		                pUniforms.omni.push(<UniformOmni>pUniformData);
		            }
		        }
		        else if (pLight.lightType === ELightTypes.PROJECT) {
		        	pProjectLight = <IProjectLight>pLight;
		        	pShadowCaster = pProjectLight.getShadowCaster();

		            if (pLight.isShadowCaster && pShadowCaster.isShadowCasted) {
		                pUniformData = uniformProjectShadow();
		                (<UniformProjectShadow>pUniformData).setLightData(<IProjectParameters>pLight.params, v3fLightTransformPosition);
		                
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
		                (<UniformProject>pUniformData).setLightData(<IProjectParameters>pLight.params, v3fLightTransformPosition);
		                m4fShadow = pShadowCaster.projViewMatrix.multiply(pCamera.worldMatrix, mat4());
		                (<UniformProject>pUniformData).setMatrix(m4fShadow);
		                pUniforms.project.push(<UniformProject>pUniformData);
		            }

		        }
		        else if (pLight.lightType === ELightTypes.SUN) {
		        	pSunLight = <ISunLight>pLight;
		        	pShadowCaster = pSunLight.getShadowCaster();

		        	if (pLight.isShadowCaster) {
		        		pUniformData = uniformSunShadow();
			        	var pSkyDome: ISceneModel = pSunLight.skyDome;
			        	var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
			        	(<UniformSunShadow>pUniformData).setLightData(<ISunParameters>pLight.params, iSkyDomeId);
			        	pUniforms.sunShadows.push(<UniformSunShadow>pUniformData);

			        	pUniforms.textures.push(pSunLight.getDepthTexture());
		            	sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

		            	(<UniformSunShadow>pUniformData).setSampler(sTexture);
		            	pUniforms.samplersSun.push((<UniformSunShadow>pUniformData).SHADOW_SAMPLER);

		            	m4fToLightSpace = pShadowCaster.viewMatrix.multiply(pCamera.worldMatrix, mat4());
		            	(<UniformSunShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.optimizedProjection);

		        	}
		        	else {
			        	pUniformData = uniformSun();
			        	var pSkyDome: ISceneModel = pSunLight.skyDome;
			        	var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
			        	(<UniformSun>pUniformData).setLightData(<ISunParameters>pLight.params, iSkyDomeId);
			        	pUniforms.sun.push(<UniformSun>pUniformData);
		        	}
		        }
		        else {
		        	CRITICAL("Invalid light point type detected.");
		        }
		    }
		}

		BROADCAST(addedSkybox, CALL(pSkyTexture));
	}
}

#endif

