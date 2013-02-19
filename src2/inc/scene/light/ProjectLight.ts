#ifndef PROJECTLIGHT_TS
#define PROJECTLIGHT_TS

#include "ITexture.ts"
#include "IFrustum.ts"
#include "IResourcePoolManager.ts"
#include "IRenderTarget.ts"
#include "ShadowCaster.ts"
#include "util/ObjectArray.ts"
#include "geometry/Plane3d.ts"
#include "geometry/classifications.ts"

module akra.scene.light {
	export class ProjectLight extends LightPoint implements IProjectLight {
		protected _pDepthTexture: ITexture = null;
		// protected _pColorTexture: ITexture = null;
		protected _pShadowCaster: IShadowCaster;

		constructor (pScene: IScene3d) {
			super(pScene);
			this._eType = EEntityTypes.LIGHT_PROJECT;
		};

		create(isShadowCaster: bool = true): bool {
			var isOk: bool = super.create();

			this.isShadowCaster = isShadowCaster;

			this._pShadowCaster = new ShadowCaster(this);
			var pCaster: IShadowCaster = this._pShadowCaster;
			
			if (!pCaster.create()) {
				ERROR("cannot create shadow caster");
				return false;
			}

			pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
			pCaster.setInheritance(ENodeInheritance.ALL);
			pCaster.attachToParent(this);

			this.initializeTextures();

			return isOk;
		};

		inline getDepthTexture(): ITexture {
			return this._pDepthTexture;
		};

		inline getRenderTarget(): IRenderTarget {
			return this._pDepthTexture.getBuffer().getRenderTarget();
		};

		inline getShadowCaster(): IShadowCaster {
			return this._pShadowCaster;
		};

		private initializeTextures(): void {
			if (!this.isShadowCaster) {
				return;
			}

			var pEngine: IEngine = this.scene.getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			if (this._pDepthTexture) {
				this._pDepthTexture.destroyResource();
			}

			var pDepthTexture: ITexture = this._pDepthTexture = 
				pResMgr.createTexture("depth_texture_" + this.getGuid());
			pDepthTexture.create(iSize, iSize, 1, Color.BLACK, 0,
				0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH);

			pDepthTexture.setParameter(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setParameter(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setParameter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setParameter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			// var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.getGuid());
			// pColorTexture(iSize, iSize, 1, Color.BLACK, 0,
			// 	0, ETextureTypes.TEXTURE_2D, EPixelFormats.LUMINANCE);

			// this._pColorTexture = pColorTexture;

			this.getRenderTarget().addViewport(this._pShadowCaster); //TODO: Multiple render target
		};

		_calculateShadows(): void {
			if (!this._isEnabled || !this.isShadowCaster) {
				return;
			}

			this.getRenderTarget().update();
		};

		_prepareForLighting(pCamera: ICamera): bool{
			if(!this.enabled){
				return false;
			}
			else{
				if(!this.isShadowCaster){
					var pResult: IObjectArray = this._defineLightingInfluence(pCamera);
					console.warn(pResult);
					return (pResult.length == 0) ? false : true;
				}
				else{
					var pResult: IObjectArray = this._defineShadowInfluence(pCamera);
					console.warn(pResult);
					return (pResult.length == 0) ? false : true;
				}
			}
		};

		protected _defineLightingInfluence(pCamera: ICamera): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCaster;
			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			var pFrustum: IFrustum = pCamera.frustum;

			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);

				if(pFrustum.testRect(pObject.worldBounds)){
					pResult.push(pObject);
				}
			}

			return pResult;
		};

		protected _defineShadowInfluence(pCamera: ICamera): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCaster;
			var pCameraFrustum: IFrustum = pCamera.frustum;

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			if(!pCameraFrustum.testFrustum(pShadowCaster.frustum)){
				//frustums don't intersecting
				return pResult;
			}

			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			var v3fLightPosition: IVec3 = this.worldPosition;

			var pTestArray: IPlane3d[] = ProjectLight._pFrustumPlanes;

			//works only for projection and don't work for ortho projection

			if(pShadowCaster.projectionMatrix.data[__44] == 1){
				//orthogonal projection
				;
			}
			else{
				//pShadowCaster.projectionMatrix.data[__43] == -1
				//frustum projection

				//create list for additional testing
				var pFrustumPlanesKeys: string[] = geometry.Frustum.frustumPlanesKeys;
				for(var i: int = 0; i<6; i++){
					var sKey: string = pFrustumPlanesKeys[i];

					var pPlane: IPlane3d = pCameraFrustum[sKey];

					var v3fNormal: IVec3 = pPlane.normal;
					var fDistance: float = pPlane.distance;

					if(pPlane.signedDistance(v3fLightPosition) <= 0){
						fDistance = -v3fNormal.dot(v3fLightPosition);
					}

					pTestArray[i].set(v3fNormal, fDistance);
				}

				for(var i:int = 0; i<pRawResult.length; i++){
					var pObject: ISceneObject = pRawResult.value(i);
					var pWorldBounds: IRect3d = pObject.worldBounds;

					//have object shadows?
					if(pObject.hasShadows){
						var j:int = 0
						for(j = 0; j<6; j++){
							var pPlane: IPlane3d = pTestArray[j];

							if(geometry.planeClassifyRect3d(pPlane, pWorldBounds) 
									== EPlaneClassifications.PLANE_FRONT){
								break;
							}
						}

						if(j == 6){
							pResult.push(pObject);
						}	
					}
					else{
						if(pCameraFrustum.testRect(pWorldBounds)){
							pResult.push(pObject);
						}
					}
					
				}
			}

			pShadowCaster._optimizeProjectionMatrix();

			return pResult;
		};

		//list of frustum planes with which additional testing must be done.
		//created just for prevent reallocation
		static _pFrustumPlanes: IPlane3d[] = new Array(6);/*new geometry.Plane3d[];*/
	}

	for(var i:int = 0; i<6; i++){
		ProjectLight._pFrustumPlanes[i] = new geometry.Plane3d();
	}
}

#endif
