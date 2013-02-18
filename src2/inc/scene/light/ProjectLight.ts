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

		protected _m4fOptimizdeProj: IMat4 = null;
		//protected _m4fCurrentOptimizedProj: IMat4 = null;

		//list of frustum planes with which additional testing must be done.
		//created just for prevent reallocation
		static protected _pFrustumPlanes: IPlane3d[] = new Array(6);

		constructor (pScene: IScene3d) {
			super(pScene);
			this._eType = EEntityTypes.LIGHT_PROJECT;
		};

		inline get optimizedProjection(): IMat4 {
			return this._m4fOptimizdeProj;
		};

		/*inline get currentOptimizedProjection(): IMat4 {
			return this._m4fCurrentOptimizedProj;
		};*/

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

			if (isShadowCaster) {
				this._m4fOptimizdeProj = new Mat4();
			}

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
			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			var pFrustum: IFrustum = pCamera.frustum;

			var v3fLightPosition: IVec3 = this.worldPosition;
			var iAdditionalTestsLength: uint = 0;

			var pTestArray: IPlane3d[] = ProjectLight._pFrustumPlanes;

			//TODO: this list only optimizing shadow casting
			// in worst case when frustums not intersecting 
			//we cast shadows from all objects con clipping its by camera

			//create list for additional testing

			if(pFrustum.leftPlane.signedDistance(v3fLightPosition) <= 0.){
				pTestArray[iAdditionalTestsLength++] = pFrustum.leftPlane;
			}
			if(pFrustum.rightPlane.signedDistance(v3fLightPosition) <= 0.){
				pTestArray[iAdditionalTestsLength++] = pFrustum.rightPlane;
			}
			if(pFrustum.topPlane.signedDistance(v3fLightPosition) <= 0.){
				pTestArray[iAdditionalTestsLength++] = pFrustum.topPlane;
			}
			if(pFrustum.bottomPlane.signedDistance(v3fLightPosition) <= 0.){
				pTestArray[iAdditionalTestsLength++] = pFrustum.bottomPlane;
			}
			if(pFrustum.nearPlane.signedDistance(v3fLightPosition) <= 0.){
				pTestArray[iAdditionalTestsLength++] = pFrustum.nearPlane;
			}
			if(pFrustum.farPlane.signedDistance(v3fLightPosition) <= 0.){
				pTestArray[iAdditionalTestsLength++] = pFrustum.farPlane;
			}


			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);

				var j:int = 0
				for(j = 0; j<iAdditionalTestsLength; j++){
					var pPlane: IPlane3d = pTestArray[j];

					if(geometry.planeClassifyRect3d(pPlane, pObject.worldBounds) 
							== EPlaneClassifications.PLANE_FRONT){
						break;
					}
				}

				if(j == iAdditionalTestsLength){
					pResult.push(pObject);
				}
			}

			return pRawResult;
		};
	}
}

#endif
