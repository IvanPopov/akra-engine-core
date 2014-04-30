/// <reference path="../idl/IForwardViewport.ts" />
/// <reference path="Viewport.ts" />
/// <reference path="../scene/Scene3d.ts" />
/// <reference path="LightingUniforms.ts" />

module akra.render {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	import Color = color.Color;

	var pDepthPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_DEPTH, new Uint8Array(4 * 1));
	var pFloatColorPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_RGBA, new Uint8Array(4 * 4));
	var pColor: IColor = new Color(0);

	export class ForwardViewport extends Viewport implements IForwardViewport {
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;

		/** Buffer with objectID */
		private _pTextureWithObjectID: ITexture = null;
		/** Depth buffer of scene */
		private _pDepthBufferTexture: ITexture = null;
		/** Texture with result of rendereingd(for global posteffects) */
		private _pResultTexture: ITexture = null;

		private _pViewScreen: IRenderableObject = null;
		private _pLightPoints: IObjectArray<ILightPoint> = null;
		private _v2fTextureRatio: IVec2 = null;
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

		private _pSkyboxTexture: ITexture = null;

		private _eShadingModel: EShadingModel = EShadingModel.PHONG;
		private _pDefaultEnvMap: ITexture = null;

		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}

		protected setupSignals(): void {
			this.addedSkybox = this.addedSkybox || new Signal(this);

			super.setupSignals();
		}
		
		getType(): EViewportTypes {
			return EViewportTypes.FORWARDVIEWPORT;
		} 

		getView(): IRenderableObject {
			return this._pViewScreen;
		}

		getDepthTexture(): ITexture {
			return this._pDepthBufferTexture;
		}

		getEffect(): IEffect {
			return this.getView().getRenderMethodDefault().getEffect();
		}

		getSkybox(): ITexture {
			return this._pSkyboxTexture;
		}

		getTextureWithObjectID(): ITexture {
			return this._pTextureWithObjectID;
		}

		getLightSources(): IObjectArray<ILightPoint> {
			return this._pLightPoints;
		}

		setShadingModel(eModel: EShadingModel) {
			this._eShadingModel = eModel;
		}

		getShadingModel(): EShadingModel {
			return this._eShadingModel;
		}

		setDefaultEnvironmentMap(pEnvMap: ITexture): void {
			this._pDefaultEnvMap = pEnvMap;
		}

		getDefaultEnvironmentMap(): ITexture {
			return this._pDefaultEnvMap;
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

			//this.createNormalBufferRenderTarget(iWidth, iHeight);
			//this.createLightBuffersRenderTargets(iWidth, iHeight);
			//this.createResultLPPRenderTarget(iWidth, iHeight);

			//this._v2fTextureRatio = new math.Vec2(this.getActualWidth() / this._pNormalBufferTexture.getWidth(), this.getActualHeight() / this._pNormalBufferTexture.getHeight());
			this._v2fScreenSize = new Vec2(this.getActualWidth(), this.getActualHeight());

			//this.prepareRenderMethods();

			this.setClearEveryFrame(true, EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH);
			this.setBackgroundColor(color.ZERO);
			this.setDepthParams(true, true, ECompareFunction.LESS);

			this.setFXAA(true);
		}

		_getRenderId(x: int, y: int): int {
			return 0;
		}

		_updateImpl(): void {
			var pRenderer: IRenderer = this.getTarget().getRenderer();

			this.prepareForForwardShading();
			this._pCamera._keepLastViewport(this);

			//render light map
			var pLights: IObjectArray<ILightPoint> = <IObjectArray<any>>this.getCamera().display(scene.Scene3d.DL_LIGHTING);

			for (var i: int = 0; i < pLights.getLength(); i++) {
				pLights.value(i)._calculateShadows();
			}

			this._pLightPoints = pLights;
			this.createLightingUniforms(this.getCamera(), this._pLightPoints, this._pLightingUnifoms);
			this._pCamera._keepLastViewport(this);
			this.renderAsNormal("forwardShading", this.getCamera());
			//this.renderAsNormal("apply_lpp_shading", this.getCamera());
		}

		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(true);
		}

		setSkybox(pSkyTexture: ITexture): boolean {
			if (pSkyTexture.getTextureType() !== ETextureTypes.TEXTURE_CUBE_MAP) {
				return null;
			}

			var pEffect: IEffect = this.getEffect();

			if (pSkyTexture) {
				pEffect.addComponent("akra.system.skybox", 1, 0);
			}
			else {
				pEffect.delComponent("akra.system.skybox", 1, 0);
			}

			this._pSkyboxTexture = pSkyTexture;

			this.addedSkybox.emit(pSkyTexture);

			return true;
		}

		setFXAA(bValue: boolean = true): void {
			var pEffect: IEffect = this.getEffect();

			if (bValue) {
				pEffect.addComponent("akra.system.fxaa", 2, 0);
			}
			else {
				pEffect.delComponent("akra.system.fxaa", 2, 0);
			}
		}

		isFXAA(): boolean {
			return this.getEffect().hasComponent("akra.system.fxaa");
		}

		highlight(a): void {
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			var pLightUniforms: UniformMap = this._pLightingUnifoms;
			var pLightPoints: IObjectArray<ILightPoint> = this._pLightPoints;
			var pCamera: ICamera = this.getCamera();

			//if (pRenderable["transparency"]) {
			//	pPass.setRenderState
			//}

			pPass.setForeign("NUM_OMNI", pLightUniforms.omni.length);
			pPass.setForeign("NUM_OMNI_SHADOWS", pLightUniforms.omniShadows.length);
			pPass.setForeign("NUM_PROJECT", pLightUniforms.project.length);
			pPass.setForeign("NUM_PROJECT_SHADOWS", pLightUniforms.projectShadows.length);
			pPass.setForeign("NUM_SUN", pLightUniforms.sun.length);
			pPass.setForeign("NUM_SUN_SHADOWS", pLightUniforms.sunShadows.length);

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

			//pPass.setUniform("SCREEN_TEXTURE_RATIO", this._v2fTextureRatio);

			pPass.setForeign("IS_USED_PNONG", this.getShadingModel() === EShadingModel.PHONG);
			pPass.setForeign("IS_USED_BLINN_PNONG", this.getShadingModel() === EShadingModel.BLINNPHONG);
			pPass.setForeign("IS_USED_PBS_SIMPLE", this.getShadingModel() === EShadingModel.PBS_SIMPLE);
			pPass.setForeign("SKIP_ALPHA", false);

			if (isDefAndNotNull(this.getDefaultEnvironmentMap())) {
				pPass.setForeign("IS_USED_PBS_REFLECTIONS", true);
				pPass.setTexture("ENVMAP", this.getDefaultEnvironmentMap());
			}
			else {
				pPass.setForeign("IS_USED_PBS_REFLECTIONS", false);
			}
		}

		private prepareForForwardShading(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var pTechCurr: IRenderTechnique = pRenderable.getTechniqueDefault();

					var sMethod: string = "forwardShading";
					var pTechnique: IRenderTechnique = null;

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(pRenderable.getRenderMethodByName(), sMethod)) {
							logger.critical("cannot create render method for first pass of LPP");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						pTechnique.render._syncSignal(pTechCurr.render);
						pTechnique.addComponent("akra.system.applyForwardShading");
						pTechnique.addComponent("akra.system.omniLighting");
						pTechnique.addComponent("akra.system.projectLighting");
						pTechnique.addComponent("akra.system.omniShadowsLighting");
						pTechnique.addComponent("akra.system.projectShadowsLighting");
						pTechnique.addComponent("akra.system.sunLighting");
						pTechnique.addComponent("akra.system.sunShadowsLighting");
						pTechnique.addComponent("akra.system.pbsReflection");
					}
				}
			}
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