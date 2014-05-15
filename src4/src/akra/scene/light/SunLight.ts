/// <refeence path="../idl/ISunLight.ts" />
/// <refeence path="../idl/ITexture.ts" />
/// <refeence path="../idl/IResourcePoolManager.ts" />
/// <refeence path="../idl/IRenderTarget.ts" />
/// <refeence path="../util/ObjectArray.ts" />

/// <reference path="ShadowCaster.ts" />

module akra.scene.light {

	import Vec3 = math.Vec3;
	import Mat4 = math.Mat4;

	import Scene3d = scene.Scene3d;

	export class SunParameters implements ISunParameters {
		eyePosition: IVec3 = new Vec3;
	    sunDir: IVec3 = new Vec3;
	    groundC0: IVec3 = new Vec3;
	    groundC1: IVec3 = new Vec3;
	    hg: IVec3 = new Vec3;
	}

	export class SunLight extends LightPoint implements ISunLight {
		protected _pLightParameters: ISunParameters = new SunParameters;
		protected _pSkyDome: ISceneModel = null;


		protected _pColorTexture: ITexture = null;
		protected _pDepthTexture: ITexture = null;
		protected _pShadowCaster: IShadowCaster;

		getParams(): ISunParameters {
			return this._pLightParameters;
		}

		getSkyDome(): ISceneModel {
			return this._pSkyDome;
		}

		setSkyDome(pSkyDome: ISceneModel): void {
			this._pSkyDome = pSkyDome;
		}

		getLightingDistance(): float{
			return this._pShadowCaster.getFarPlane();
		}

		setLightingDistance(fDistance): void {
			this._pShadowCaster.setFarPlane(fDistance);
		}

		isShadowCaster(): boolean {
			return this._isShadowCaster;
		}

		setShadowCaster(bValue: boolean): void {
			this._isShadowCaster = bValue;
			if (bValue && isNull(this._pDepthTexture)) {
				this.initializeTextures();
			}
		}

		getDepthTexture(): ITexture {
			return this._pDepthTexture;
		}

		getRenderTarget(): IRenderTarget {
			// return this._pDepthTexture.getBuffer().getRenderTarget();
			return this._pColorTexture.getBuffer().getRenderTarget();
		}

		getShadowCaster(): IShadowCaster {
			return this._pShadowCaster;
		}

		constructor (pScene: IScene3d) {
			super(pScene, ELightTypes.SUN);
			this._pShadowCaster = pScene._createShadowCaster(this);
		}

		create(isShadowCaster: boolean = true, iMaxShadowResolution: uint = 256): boolean{
			var isOk: boolean = super.create(isShadowCaster, iMaxShadowResolution);

			var pCaster: IShadowCaster = this._pShadowCaster;

			pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
			pCaster.setOrthoParams(1000., 1000., 0., 1000.);
			pCaster.setInheritance(ENodeInheritance.ALL);
			pCaster.attachToParent(this);

			if (this.isShadowCaster()) {
				this.initializeTextures();
			}

			return isOk;
		}

		_calculateShadows(): void {
			if (this.isEnabled() && this.isShadowCaster()) {

				// LOG(this._pShadowCaster.affectedObjects);
				this.getRenderTarget().update();
			}
		}

		// create(caster: boolean): boolean{
		// 	return super.create(false, 0);
		// };

		_prepareForLighting(pCamera: ICamera): boolean{
			// if(!this.enabled){
			// 	return false;
			// }

			// return true;
			if(!this.isEnabled()){
				return false;
			}
			else{
				/*************************************************************/
				//optimize camera frustum
				var pDepthRange: IDepthRange = pCamera.getDepthRange();

				var fFov: float = pCamera.getFOV();
				var fAspect: float = pCamera.getAspect();

				var m4fTmp: IMat4 = Mat4.perspective(fFov, fAspect, -pDepthRange.min, -pDepthRange.max, Mat4.temp());

				this.getOptimizedCameraFrustum().extractFromMatrix(m4fTmp, pCamera.getWorldMatrix());
				/*************************************************************/

				if(!this.isShadowCaster()){
					var pResult: IObjectArray<ISceneObject> = this._defineLightingInfluence(this._pShadowCaster, pCamera, this.getOptimizedCameraFrustum());
					return (pResult.getLength() === 0) ? false : true;
				}
				else{
					var pResult: IObjectArray<ISceneObject> = this._defineShadowInfluence(this._pShadowCaster, pCamera, this.getOptimizedCameraFrustum());
					// this._pShadowCaster.optimizedProjection.set(this._pShadowCaster.projectionMatrix);
					return (pResult.getLength() === 0) ? false : true;
				}
			}
		}

		updateSunDirection(v3fSunDir: IVec3): void {
			// var m4fMat: IMat4 = Mat4.temp(this.localMatrix);
			// m4fMat.data[__13] = -v3fSunDir.x;
			// m4fMat.data[__23] = -v3fSunDir.y;
			// m4fMat.data[__33] = -v3fSunDir.z;
			//this.localMatrix = Mat4.fromXYZ(Vec3.temp(v3fSunDir.x, v3fSunDir.y, v3fSunDir.z).scale(-1., Vec3.temp()), Mat4.temp()).setTranslation(Vec3.temp(0., 0., 1.));
			
			// var pViewMat = Mat4.temp();

			var pViewMat = Mat4.lookAt(Vec3.temp(0.), Vec3.temp(v3fSunDir).scale(-1.), Vec3.temp(0., 0., 1.), Mat4.temp());

			this.setLocalMatrix(pViewMat.inverse());

			this.getLocalMatrix().setTranslation(v3fSunDir.scale(500., Vec3.temp()));

			//this.localMatrix.setTranslation();
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
		
		static _pTmpPlanePoints: IVec3[] = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
		static _pTmpIndexList: uint[] = [0, 0, 0, 0];
		static _pTmpDirLengthList: float[] = [0.0, 0.0, 0.0, 0.0];
	}
}
