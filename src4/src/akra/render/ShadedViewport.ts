/// <reference path="../idl/IViewport3D.ts" />

/// <reference path="Viewport3D.ts" />
/// <reference path="LightingUniforms.ts" />

module akra.render {
	import Color = color.Color;

	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	export class ShadedViewport extends Viewport3D implements IShadedViewport {
		protected _pLightingUnifoms: UniformMap = {
			omni: [],
			project: [],
			sun: [],
			omniShadows: [],
			projectShadows: [],
			sunShadows: [],
			textures: [],
			samplersOmni: [],
			samplersProject: [],
			samplersSun: [],

			omniRestricted: []
		};

		protected _pLightPoints: IObjectArray<ILightPoint> = null;
		protected _pTextureForTransparentObjects: ITexture = null;

		private _eShadingModel: EShadingModel = EShadingModel.PHONG;
		private _pDefaultEnvMap: ITexture = null;

		private _isTransparencySupported: boolean = true;

		private _isShadowEnabled: boolean = true;
		private _bManualUpdateForLightUniforms: boolean = false;

		private _pDepthBufferTexture: ITexture = null;

		getDepthTexture(): ITexture {
			return this._pDepthBufferTexture;
		}

		protected setDepthTexture(pTexture: ITexture): void {
			this._pDepthBufferTexture = pTexture;
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

		setTransparencySupported(bEnable: boolean): void {
			this._isTransparencySupported = bEnable;
		}

		isTransparencySupported(): boolean {
			return this._isTransparencySupported;
		}

		setShadowEnabled(bValue: boolean): void {
			this._isShadowEnabled = bValue;
		}

		isShadowEnabled(): boolean {
			return this._isShadowEnabled;
		}

		_setLightUniformsManual(bValue: boolean, pUniformsMap?: any): void {
			this._bManualUpdateForLightUniforms = bValue;

			if (bValue && isDefAndNotNull(pUniformsMap)) {
				this._pLightingUnifoms = pUniformsMap;
			}
			else if (!bValue) {
				this._pLightingUnifoms = {
					omni: [],
					project: [],
					sun: [],
					omniShadows: [],
					projectShadows: [],
					sunShadows: [],
					textures: [],
					samplersOmni: [],
					samplersProject: [],
					samplersSun: [],

					omniRestricted: []
				};
			}
		}

		protected _isManualUpdateForLightUniforms(): boolean {
			return this._bManualUpdateForLightUniforms;
		}

		protected createLightingUniforms(pCamera: ICamera, pLightPoints: IObjectArray<ILightPoint>, pUniforms: UniformMap): void {
			if (this._bManualUpdateForLightUniforms) {
				return;
			}

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
			//var sTexture: string = "TEXTURE";
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

					if (this.isShadowEnabled() && pLight.isShadowCaster()) {
						pUniformData = UniformOmniShadow.temp();
						(<UniformOmniShadow>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);

						var pDepthCube: ITexture[] = pOmniLight.getDepthTextureCube();
						var pShadowCasterCube: IShadowCaster[] = pOmniLight.getShadowCaster();

						for (j = 0; j < 6; ++j) {
							pShadowCaster = pShadowCasterCube[j];
							m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
							pUniforms.textures.push(pDepthCube[j]);
							//sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

							(<UniformOmniShadow>pUniformData).setSampler(pDepthCube[j], j);
							pUniforms.samplersOmni.push((<UniformOmniShadow>pUniformData).SHADOW_SAMPLER[j]);
							(<UniformOmniShadow>pUniformData).setMatrix(m4fToLightSpace, pShadowCaster.getOptimizedProjection(), j);
						}

						pUniforms.omniShadows.push(<UniformOmniShadow>pUniformData);
					}
					else {
						if (pLight.isRestricted()) {
							pUniformData = UniformOmniRestricted.temp();
							(<UniformOmniRestricted>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);

							m4fToLightSpace = pLight.getInverseWorldMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
							(<UniformOmniRestricted>pUniformData).setRestrictedData(pLight.getRestrictedLocalBounds(), m4fToLightSpace);
							pUniforms.omniRestricted.push(<UniformOmniRestricted>pUniformData);
						}
						else {
							pUniformData = UniformOmni.temp();
							(<UniformOmni>pUniformData).setLightData(<IOmniParameters>pLight.getParams(), v3fLightTransformPosition);
							pUniforms.omni.push(<UniformOmni>pUniformData);
						}
					}
				}
				else if (pLight.getLightType() === ELightTypes.PROJECT) {
					pProjectLight = <IProjectLight>pLight;
					pShadowCaster = pProjectLight.getShadowCaster();

					if (this.isShadowEnabled() && pLight.isShadowCaster() && pShadowCaster.isShadowCasted()) {
						pUniformData = UniformProjectShadow.temp();
						(<UniformProjectShadow>pUniformData).setLightData(<IProjectParameters>pLight.getParams(), v3fLightTransformPosition);

						m4fToLightSpace = pShadowCaster.getViewMatrix().multiply(pCamera.getWorldMatrix(), Mat4.temp());
						pUniforms.textures.push(pProjectLight.getDepthTexture());
						//sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

						(<UniformProjectShadow>pUniformData).setSampler(pProjectLight.getDepthTexture());
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

					if (this.isShadowEnabled() && pLight.isShadowCaster()) {
						pUniformData = UniformSunShadow.temp();
						var pSkyDome: ISceneModel = pSunLight.getSkyDome();
						var iSkyDomeId: int = pEngine.getComposer()._calcRenderID(pSkyDome, pSkyDome.getRenderable(0), false);
						(<UniformSunShadow>pUniformData).setLightData(<ISunParameters>pLight.getParams(), iSkyDomeId);
						pUniforms.sunShadows.push(<UniformSunShadow>pUniformData);

						pUniforms.textures.push(pSunLight.getDepthTexture());
						//sTexture = "TEXTURE" + (pUniforms.textures.length - 1);

						(<UniformSunShadow>pUniformData).setSampler(pSunLight.getDepthTexture());
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

		protected resetUniforms(): void {
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

			pUniforms.omniRestricted.clear();
		}

		protected initTextureForTransparentObjects(): void {
			var pResMgr: IResourcePoolManager = this.getTarget().getRenderer().getEngine().getResourceManager();
			var pTexture: ITexture = pResMgr.createTexture("lpp-trasparency-texture-" + this.guid);
			var pDepthTexture: ITexture = this.getDepthTexture();

			pTexture.create(pDepthTexture.getWidth(), pDepthTexture.getHeight(), 1, null, ETextureFlags.RENDERTARGET, 0, 0,
				ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			var pRenderTarget: IRenderTarget = pTexture.getBuffer().getRenderTarget();
			pRenderTarget.attachDepthTexture(pDepthTexture);

			pRenderTarget.setAutoUpdated(false);

			var pViewport: IForwardViewport = new ForwardViewport(this.getCamera(), 0, 0, this.getActualWidth() / pDepthTexture.getWidth(), this.getActualHeight() / pDepthTexture.getHeight());
			pViewport._renderOnlyTransparentObjects(true);
			pRenderTarget.addViewport(pViewport);

			pViewport.setClearEveryFrame(true, EFrameBufferTypes.COLOR);
			pViewport.setBackgroundColor(new color.Color(0, 0, 0, 0));

			this._pTextureForTransparentObjects = pTexture;
			pViewport.setShadingModel(this.getShadingModel());
			pViewport.setDefaultEnvironmentMap(this.getDefaultEnvironmentMap());

			pViewport._setLightUniformsManual(true, this._pLightingUnifoms);
		}

	}
}