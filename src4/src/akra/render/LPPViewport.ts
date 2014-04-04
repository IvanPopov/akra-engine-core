/// <reference path="../idl/ILPPViewport.ts" />
/// <reference path="Viewport.ts" />
/// <reference path="../scene/Scene3d.ts" />
/// <reference path="DSUniforms.ts" />

module akra.render {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	import Color = color.Color;

	export class LPPViewport extends Viewport implements ILPPViewport {
		private _pNormalBufferTexture: ITexture = null;
		private _pDepthBufferTexture: ITexture = null;

		/** Diffuse and specular */
		private _pLightBufferTextureA: ITexture = null;
		/** Ambient and shadow */
		private _pLightBufferTextureB: ITexture = null;

		private _pViewScreen: IRenderableObject = null;
		private _pLightPoints: IObjectArray<ILightPoint> = null;
		private _v2fTExtureRatio: IVec2 = null;
		private _v2fScreenSize: IVec2 = null;
		private _pLightingUnifoms: UniformMap = {
			omni: [],
			project: [],
			sun: [],
			omniShadows: [],
			projectShadows: [],
			sunShadows: [],
			textures: [],
			samplersOmni: [],
			samplersProject: [],
			samplersSun: []
		};
		
		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}
		
		getType(): EViewportTypes {
			return EViewportTypes.LPPVIEWPORT;
		} 

		getView(): IRenderableObject {
			return this._pViewScreen;
		}

		getDepthTexture(): ITexture {
			return this._pDepthBufferTexture;
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			//common api access
			var pEngine: IEngine = pTarget.getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();

			//renderable for displaying result from deferred textures
			this._pViewScreen = new Screen(pEngine.getRenderer());

			//unique idetifier for creation dependent resources
			var iGuid: int = this.guid;

			//Float point texture must be power of two.
			var iWidth: uint = math.ceilingPowerOfTwo(this.getActualWidth());
			var iHeight: uint = math.ceilingPowerOfTwo(this.getActualHeight());

			//detect max texture resolution correctly
			if (config.WEBGL) {
				iWidth = math.min(iWidth, webgl.maxTextureSize);
				iHeight = math.min(iHeight, webgl.maxTextureSize);
			}

			//create NormalBufferTexture
			var pNormalBufferTexture: ITexture = pResMgr.createTexture("lpp-normal-buffer-" + iGuid);
			var pRenderTarget: IRenderTarget = null;
			var pViewport: IViewport = null;

			pNormalBufferTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
			pRenderTarget = pNormalBufferTexture.getBuffer().getRenderTarget();
			pRenderTarget.setAutoUpdated(false);
			pViewport = pRenderTarget.addViewport(new Viewport(this.getCamera(), "lpp_normal_pass",
				0, 0, this.getActualWidth() / pNormalBufferTexture.getWidth(), this.getActualHeight() / pNormalBufferTexture.getHeight()));

			var pDepthTexture = pResMgr.createTexture(".lpp-depth-buffer-" + iGuid);
			pDepthTexture.create(iWidth, iHeight, 1, null, 0, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			pRenderTarget.attachDepthTexture(pDepthTexture);

			this._pNormalBufferTexture = pNormalBufferTexture;
			this._pDepthBufferTexture = pDepthTexture;

			//create LightMapTexture
			var pLightMapTexture: ITexture = pResMgr.createTexture("lpp-light-bufferA-" + iGuid);
			pLightMapTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
			pRenderTarget = pLightMapTexture.getBuffer().getRenderTarget();
			pRenderTarget.setAutoUpdated(false);
			pViewport = pRenderTarget.addViewport(new Viewport(this.getCamera(), null,
				0, 0, this.getActualWidth() / pLightMapTexture.getWidth(), this.getActualHeight() / pLightMapTexture.getHeight()));

			pViewport.render.connect(this, this._onLightMapRender);

			this._pLightBufferTextureA = pLightMapTexture;

			var pLightMapTexture: ITexture = pResMgr.createTexture("lpp-light-bufferB" + iGuid);
			pLightMapTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_RGBA);
			pRenderTarget = pLightMapTexture.getBuffer().getRenderTarget();
			pRenderTarget.setAutoUpdated(false);
			pViewport = pRenderTarget.addViewport(new Viewport(this.getCamera(), null,
				0, 0, this.getActualWidth() / pLightMapTexture.getWidth(), this.getActualHeight() / pLightMapTexture.getHeight()));

			pViewport.render.connect(this, this._onLightMapRender);

			this._pLightBufferTextureB = pLightMapTexture;

			this._v2fTExtureRatio = new math.Vec2(this.getActualWidth() / pNormalBufferTexture.getWidth(), this.getActualHeight() / pNormalBufferTexture.getHeight());

			//creatin deferred effects

			if (this._pViewScreen.addRenderMethod(".prepare_diffuse_specular", "passA")) {
				var pLPPEffect: IEffect = this._pViewScreen.getRenderMethodByName("passA").getEffect();
				pLPPEffect.addComponent("akra.system.prepare_lpp_lights_base");
				pLPPEffect.addComponent("akra.system.prepare_lpp_lights_omni");

				this._pViewScreen.getRenderMethodByName("passA").setForeign("prepareOnlyPosition", false);
			}
			else {
				logger.critical("Cannot initialize LPPViewport(problem with 'prepare_diffuse_specular' pass)");
			}

			if (this._pViewScreen.addRenderMethod(".prepare_ambient_shadow", "passB")) {
				var pLPPEffect: IEffect = this._pViewScreen.getRenderMethodByName("passB").getEffect();
				pLPPEffect.addComponent("akra.system.prepare_lpp_lights_base");
				pLPPEffect.addComponent("akra.system.prepare_lpp_lights_omni_ambient");

				this._pViewScreen.getRenderMethodByName("passB").setForeign("prepareOnlyPosition", true);
			}
			else {
				logger.critical("Cannot initialize LPPViewport(problem with 'prepare_ambient_shadow' pass)");
			}

			this._v2fScreenSize = new Vec2(this.getActualWidth(), this.getActualHeight());
		}

		setCamera(pCamera: ICamera): boolean {
			var isOk = super.setCamera(pCamera);
			this._pNormalBufferTexture.getBuffer().getRenderTarget().getViewport(0).setCamera(pCamera);
			return isOk;
		}

		_updateDimensions(bEmitEvent: boolean = true): void {
			super._updateDimensions(false);

			if (isDefAndNotNull(this._pNormalBufferTexture)) {
				this._pNormalBufferTexture.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				this._pNormalBufferTexture.getBuffer().getRenderTarget().getViewport(0)
					.setDimensions(0., 0., this.getActualWidth() / this._pNormalBufferTexture.getWidth(), this.getActualHeight() / this._pNormalBufferTexture.getHeight());

				this._pLightBufferTextureA.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				this._pLightBufferTextureA.getBuffer().getRenderTarget().getViewport(0)
					.setDimensions(0., 0., this.getActualWidth() / this._pLightBufferTextureA.getWidth(), this.getActualHeight() / this._pLightBufferTextureA.getHeight());

				this._pLightBufferTextureB.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
				this._pLightBufferTextureB.getBuffer().getRenderTarget().getViewport(0)
					.setDimensions(0., 0., this.getActualWidth() / this._pLightBufferTextureB.getWidth(), this.getActualHeight() / this._pLightBufferTextureB.getHeight());

				this._v2fTExtureRatio.set(this.getActualWidth() / this._pNormalBufferTexture.getWidth(), this.getActualHeight() / this._pNormalBufferTexture.getHeight());
				this._v2fScreenSize.set(this.getActualWidth(), this.getActualHeight());

				this._pDepthBufferTexture.reset(math.ceilingPowerOfTwo(this.getActualWidth()), math.ceilingPowerOfTwo(this.getActualHeight()));
			}

			if (bEmitEvent) {
				this.viewportDimensionsChanged.emit();
			}
		}

		_updateImpl(): void {
			this.prepareForLPPShading();
			//prepare normal buffer texture
			this._pNormalBufferTexture.getBuffer().getRenderTarget().update();

			//camera last viewport changed, because camera used in normal buffer textures updating
			this._pCamera._keepLastViewport(this);

			//render light map
			var pLights: IObjectArray<ILightPoint> = <IObjectArray<any>>this.getCamera().display(scene.Scene3d.DL_LIGHTING);

			//for (var i: int = 0; i < pLights.getLength(); i++) {
			//	pLights.value(i)._calculateShadows();
			//}

			this._pLightPoints = pLights;

			//render deferred
			this._pViewScreen.render(this._pLightBufferTextureA.getBuffer().getRenderTarget().getViewport(0), "passA");
			this._pLightBufferTextureA.getBuffer().getRenderTarget().getRenderer().executeQueue(false);

			this._pViewScreen.render(this._pLightBufferTextureB.getBuffer().getRenderTarget().getViewport(0), "passB");
			this._pLightBufferTextureB.getBuffer().getRenderTarget().getRenderer().executeQueue(false);

			this._pCamera._keepLastViewport(this);

			this.renderAsNormal("apply_lpp_shading", this.getCamera());
		}

		private prepareForLPPShading(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var sMethod: string = "lpp_normal_pass";
					var pTechnique: IRenderTechnique = null;

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(sMethod, sMethod)) {
							logger.critical("cannot create render method for first pass of LPP");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						//pTechnique.addComponent("akra.system.mesh_geometry");
						pTechnique.addComponent("akra.system.prepare_lpp_geometry");

						pTechnique.getMethod().setSurfaceMaterial(pRenderable.getTechniqueDefault().getMethod().getSurfaceMaterial());
					}

					sMethod = "apply_lpp_shading";

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(sMethod, sMethod)) {
							logger.critical("cannot create render method for first pass of LPP");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						//pTechnique.addComponent("akra.system.mesh_geometry");
						pTechnique.addComponent("akra.system.mesh_texture_full");
						pTechnique.addComponent("akra.system.apply_lpp_shading");

						pTechnique.getMethod().setSurfaceMaterial(pRenderable.getTechniqueDefault().getMethod().getSurfaceMaterial());
					}
				}
			}
		}

		_onLightMapRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setTexture("LPP_DEPTH_BUFFER_TEXTURE", this._pDepthBufferTexture);
			pPass.setTexture("LPP_NORMAL_BUFFER_TEXTURE", this._pNormalBufferTexture);
			pPass.setUniform("SCREEN_TEXTURE_RATIO", this._v2fTExtureRatio);

			var pLightUniforms: UniformMap = this._pLightingUnifoms;
			var pLightPoints: IObjectArray<ILightPoint> = this._pLightPoints;
			var pCamera: ICamera = this.getCamera();

			this.createLightingUniforms(pCamera, pLightPoints, pLightUniforms);

			pPass.setForeign("nOmni", pLightUniforms.omni.length);
			pPass.setStruct("points_omni", pLightUniforms.omni);
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setUniform("SCREEN_TEXTURE_RATIO", this._v2fTExtureRatio);
			pPass.setTexture("LPP_LIGHT_BUFFER_A", this._pLightBufferTextureA);
			pPass.setTexture("LPP_LIGHT_BUFFER_B", this._pLightBufferTextureB);
			pPass.setUniform("SCREEN_SIZE", this._v2fScreenSize);

			super._onRender(pTechnique, iPass, pRenderable, pSceneObject);

		}

		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(false);
		}

		protected createLightingUniforms(pCamera: ICamera, pLightPoints: IObjectArray<ILightPoint>, pUniforms: UniformMap): void {
			var pLight: ILightPoint;
			var pOmniLight: IOmniLight;
			var pProjectLight: IProjectLight;
			var pSunLight: ISunLight;
			var i: int, j: int;
			var pUniformData: IUniform;
			var pCameraView: IMat4 = pCamera.getViewMatrix();

			var v4fLightPosition: IVec4 = Vec4.temp();
			var v3fLightTransformPosition: IVec3 = Vec3.temp();
			var v4fTemp: IVec4 = Vec4.temp();

			var pShadowCaster: IShadowCaster;
			var m4fShadow: IMat4, m4fToLightSpace: IMat4;

			var iLastTextureIndex: int = 0;
			var sTexture: string = "TEXTURE";
			var pEngine: IEngine = this.getTarget().getRenderer().getEngine();

			this.resetUniforms();

			for (i = 0; i < pLightPoints.getLength(); i++) {
				pLight = pLightPoints.value(i);

				//all cameras in list already enabled
				// if (!pLight.enabled) {
				//     continue;
				// }

				v4fLightPosition.set(pLight.getWorldPosition(), 1.);
				pCameraView.multiplyVec4(v4fLightPosition, v4fTemp);
				v3fLightTransformPosition.set(v4fTemp.x, v4fTemp.y, v4fTemp.z);

				if (pLight.getLightType() === ELightTypes.OMNI) {

					pOmniLight = <IOmniLight>pLight;

					if (pLight.isShadowCaster()) {
						pUniformData = UniformOmniShadow.temp();
						(<UniformOmniShadow>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);

						var pDepthCube: ITexture[] = pOmniLight.getDepthTextureCube();
						var pShadowCasterCube: IShadowCaster[] = pOmniLight.getShadowCaster();

						for (j = 0; j < 6; ++j) {
							pShadowCaster = pShadowCasterCube[j];
							m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
							pUniforms.textures.push(pDepthCube[j]);
							sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

							(<UniformOmniShadow>pUniformData).setSampler(sTexture, j);
							pUniforms.samplersOmni.push((<UniformOmniShadow>pUniformData).SHADOW_SAMPLER[j]);
							(<UniformOmniShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection(), j);
						}

						pUniforms.omniShadows.push(<UniformOmniShadow>pUniformData);
					}
					else {
						pUniformData = UniformOmni.temp();
						(<UniformOmni>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);
						pUniforms.omni.push(<UniformOmni>pUniformData);
					}
				}
				else if (pLight.getLightType() === ELightTypes.PROJECT) {
					pProjectLight = <IProjectLight>pLight;
					pShadowCaster = pProjectLight.getShadowCaster();

					if (pLight.isShadowCaster() && pShadowCaster.isShadowCasted()) {
						pUniformData = UniformProjectShadow.temp();
						(<UniformProjectShadow>pUniformData).setLightData(<IProjectParameters>pLight.getParams(), v3fLightTransformPosition);

						m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						pUniforms.textures.push(pProjectLight.getDepthTexture());
						sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

						(<UniformProjectShadow>pUniformData).setSampler(sTexture);
						pUniforms.samplersProject.push((<UniformProjectShadow>pUniformData).SHADOW_SAMPLER);
						(<UniformProjectShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getProjectionMatrix(), pShadowCaster.getOptimizedProjection());
						pUniforms.projectShadows.push(<UniformProjectShadow>pUniformData);
					}
					else {
						pUniformData = UniformProject.temp();
						(<UniformProject>pUniformData).setLightData(<IProjectParameters>pLight.getParams(), v3fLightTransformPosition);
						m4fShadow = pShadowCaster.getProjViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						(<UniformProject>pUniformData).setMatrix(m4fShadow);
						pUniforms.project.push(<UniformProject>pUniformData);
					}

				}
				else if (pLight.getLightType() === ELightTypes.SUN) {
					pSunLight = <ISunLight>pLight;
					pShadowCaster = pSunLight.getShadowCaster();

					if (pLight.isShadowCaster()) {
						pUniformData = UniformSunShadow.temp();
						var pSkyDome: ISceneModel = pSunLight.getSkyDome();
						var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
						(<UniformSunShadow>pUniformData).setLightData(<ISunParameters>pLight.getParams(), iSkyDomeId);
						pUniforms.sunShadows.push(<UniformSunShadow>pUniformData);

						pUniforms.textures.push(pSunLight.getDepthTexture());
						sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

						(<UniformSunShadow>pUniformData).setSampler(sTexture);
						pUniforms.samplersSun.push((<UniformSunShadow>pUniformData).SHADOW_SAMPLER);

						m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						(<UniformSunShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection());

					}
					else {
						pUniformData = UniformSun.temp();
						var pSkyDome: ISceneModel = pSunLight.getSkyDome();
						var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
						(<UniformSun>pUniformData).setLightData(<ISunParameters>pLight.getParams(), iSkyDomeId);
						pUniforms.sun.push(<UniformSun>pUniformData);
					}
				}
				else {
					logger.critical("Invalid light point type detected.");
				}
			}
		}

		private resetUniforms(): void {
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
	}
}