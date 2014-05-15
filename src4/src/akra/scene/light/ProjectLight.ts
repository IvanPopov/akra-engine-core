/// <reference path="../../idl/ITexture.ts" />
/// <reference path="../../idl/IFrustum.ts" />
/// <reference path="../../idl/IResourcePoolManager.ts" />
/// <reference path="../../idl/IRenderTarget.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/classify/classify.ts" />

/// <reference path="ShadowCaster.ts" />

module akra.scene.light {

	import Color = color.Color;
	import Vec3 = math.Vec3;
	import Mat4 = math.Mat4;

	export class ProjectParameters implements IProjectParameters {
		ambient: IColor = new Color;
		diffuse: IColor = new Color;
		specular: IColor = new Color;
		attenuation: IVec3 = new Vec3;
	}

	export class ProjectLight extends LightPoint implements IProjectLight {
		protected _pDepthTexture: ITexture = null;
		protected _pColorTexture: ITexture = null;
		protected _pLightParameters: IProjectParameters = new ProjectParameters;
		protected _pShadowCaster: IShadowCaster;

		constructor(pScene: IScene3d) {
			super(pScene, ELightTypes.PROJECT);
			this._pShadowCaster = pScene._createShadowCaster(this);
		}

		getParams(): IProjectParameters {
			return this._pLightParameters;
		}

		isShadowCaster(): boolean {
			return this._isShadowCaster;
		}

		/**
		 * overridden setter isShadow caster,
		 * if depth texture don't created then create depth texture
		 */
		setShadowCaster(bValue: boolean): void {
			this._isShadowCaster = bValue;
			if (bValue && isNull(this._pDepthTexture)) {
				this.initializeTextures();
			}
		}

		getLightingDistance(): float {
			return this._pShadowCaster.getFarPlane();
		}

		setLightingDistance(fDistance): void {
			this._pShadowCaster.setFarPlane(fDistance);
		}

		getShadowCaster(): IShadowCaster {
			return this._pShadowCaster;
		}

		getDepthTexture(): ITexture {
			return this._pDepthTexture;
		}

		getRenderTarget(): IRenderTarget {
			// return this._pDepthTexture.getBuffer().getRenderTarget();
			return this._pColorTexture.getBuffer().getRenderTarget();
		}

		create(isShadowCaster: boolean = true, iMaxShadowResolution: uint = 256): boolean {
			var isOk: boolean = super.create(isShadowCaster, iMaxShadowResolution);

			var pCaster: IShadowCaster = this._pShadowCaster;

			pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
			pCaster.setInheritance(ENodeInheritance.ALL);
			pCaster.attachToParent(this);

			if (this.isShadowCaster()) {
				this.initializeTextures();
			}

			return isOk;
		}

		protected initializeTextures(): void {
			var pEngine: IEngine = this.getScene().getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			// if (!isNull(this._pDepthTexture)){
			// 	this._pDepthTexture.destroyResource();
			// }

			var pDepthTexture: ITexture = this._pDepthTexture =
				pResMgr.createTexture("depth_texture_" + this.guid);
			pDepthTexture.create(iSize, iSize, 1, null, 0,
				0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

			pDepthTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.guid);
			pColorTexture.create(iSize, iSize, 1, null, ETextureFlags.RENDERTARGET,
				0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			this._pColorTexture = pColorTexture;

			// this._pColorTexture = pColorTexture;
			//TODO: Multiple render target
			this.getRenderTarget().attachDepthTexture(pDepthTexture);
			this.getRenderTarget().setAutoUpdated(false);
			this.getRenderTarget().addViewport(new render.ShadowViewport(this._pShadowCaster));
		}

		_calculateShadows(): void {
			if (this.isEnabled() && this.isShadowCaster()) {
				this.getRenderTarget().update();
			}
		}

		_prepareForLighting(pCamera: ICamera): boolean {
			if (!this.isEnabled()) {
				return false;
			}
			else {
				/*************************************************************/
				//optimize camera frustum
				var pDepthRange: IDepthRange = pCamera.getDepthRange();

				var fFov: float = pCamera.getFOV();
				var fAspect: float = pCamera.getAspect();

				var m4fTmp: IMat4 = Mat4.perspective(fFov, fAspect, -pDepthRange.min, -pDepthRange.max, Mat4.temp());

				this.getOptimizedCameraFrustum().extractFromMatrix(m4fTmp, pCamera.getWorldMatrix());
				/*************************************************************/

				if (!this.isShadowCaster()) {
					var pResult: IObjectArray<ISceneObject> = this._defineLightingInfluence(this._pShadowCaster,pCamera,this.getOptimizedCameraFrustum()); 
					return (pResult.getLength() === 0) ? false : true;
				}
				else {
					var pResult: IObjectArray<ISceneObject> = this._defineShadowInfluence(this._pShadowCaster,pCamera,this.getOptimizedCameraFrustum());
					return (pResult.getLength() === 0) ? false : true;
				}
			}
		}
	}
}


