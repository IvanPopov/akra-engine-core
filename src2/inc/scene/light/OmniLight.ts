#ifndef OMNILIGHT_TS
#define OMNILIGHT_TS

#include "ITexture.ts"
#include "ShadowCaster.ts"

module akra.scene.light {
	export class OmniLight extends LightPoint implements IOmniLight {
		protected _pDepthTextureCube: ITexture[] = null;
		protected _pColorTextureCube: ITexture[] = null;

		protected _pShadowCasterCube: IShadowCaster[] = null;

		constructor (pScene: IScene3d) {
			super(pScene, ELightTypes.OMNI);

			this._pShadowCasterCube = new Array(6);
			
			for(var i: int = 0; i<6; i++){
				this._pShadowCasterCube[i] = pScene._createShadowCaster(this, i);
			}
		}

		create(isShadowCaster: bool = true, iMaxShadowResolution: uint = 256): bool {
			var isOk: bool = super.create(isShadowCaster, iMaxShadowResolution);

			var pCasterCube: IShadowCaster[] = this._pShadowCasterCube;
			var pCaster: IShadowCaster;
			
			for (var i = 0; i < 6; i++) {
	            pCaster = pCasterCube[i];
				pCaster.setInheritance(ENodeInheritance.ALL);
				pCaster.attachToParent(this);
	            pCaster.setProjParams(math.PI / 2, 1, 0.01, 1000);
	            pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
	        }

	        //POSITIVE_X
	        pCasterCube[0].localMatrix = mat4(
	            [ 0, 0, 1, 0, /*first column, not row!*/
	              0, 1, 0, 0,
	              -1, 0, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //NEGATIVE_X
	        pCasterCube[1].localMatrix = mat4(
	            [ 0, 0, -1, 0, /*first column, not row!*/
	              0, 1, 0, 0,
	              1, 0, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //POSITIVE_Y
	        pCasterCube[2].localMatrix = mat4(
	            [ 1, 0, 0, 0, /*first column, not row!*/
	              0, 0, 1, 0,
	              0, -1, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //NEGATIVE_Y
	        pCasterCube[3].localMatrix = mat4(
	            [ 1, 0, 0, 0, /*first column, not row!*/
	              0, 0, -1, 0,
	              0, 1, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //POSITIVE_Z
	        pCasterCube[4].localMatrix = mat4(
	            [ -1, 0, 0, 0, /*first column, not row!*/
	              0, 1, 0, 0,
	              0, 0, -1, 0,
	              0, 0, 0, 1
	            ]);

	        //NEGATIVE_Z
	        pCasterCube[5].localMatrix = mat4(
	            [ 1, 0, 0, 0, /*first column, not row!*/
	              0, 1, 0, 0,
	              0, 0, 1, 0,
	              0, 0, 0, 1
	            ]);

	        if (this.isShadowCaster) {
				this.initializeTextures();
			}

			return isOk;
		};

		inline getDepthTextureCube(): ITexture[] {
			return this._pDepthTextureCube;
		};

		inline getRenderTarget(iFace: uint): IRenderTarget {
			// return this._pDepthTextureCube[iFace].getBuffer().getRenderTarget();
			return this._pColorTextureCube[iFace].getBuffer().getRenderTarget();
		};

		inline getShadowCaster(): IShadowCaster[] {
			return this._pShadowCasterCube;
		};

		inline get isShadowCaster(): bool {
			return this._isShadowCaster;
		};

		/**
		 * overridden setter isShadow caster,
		 * if depth textures don't created then create depth textures
		 */
		set isShadowCaster(bValue: bool){
			this._isShadowCaster = bValue;
			if(bValue && isNull(this._pDepthTextureCube)){
				this.initializeTextures();
			}
		};

		protected initializeTextures(): void {
			var pEngine: IEngine = this.scene.getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			this._pDepthTextureCube = new Array(6);
			this._pColorTextureCube = new Array(6);

			for (var i: int = 0; i < 6; ++ i) {

				// if (this._pDepthTextureCube[i]) {
				// 	this._pDepthTextureCube[i].destroyResource();
				// }

				var pDepthTexture: ITexture = this._pDepthTextureCube[i] = 
					pResMgr.createTexture("depth_texture_" + i + "_" + this.getGuid());
				pDepthTexture.create(iSize, iSize, 1, null, 0,
									 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

				pDepthTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
				pDepthTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
				pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
				pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

				var pColorTexture: ITexture = this._pColorTextureCube[i] = 
					pResMgr.createTexture("light_color_texture_" + i + "_" + this.getGuid());
				pColorTexture.create(iSize, iSize, 1, null, ETextureFlags.RENDERTARGET, 
						  			 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

				//TODO: Multiple render target
				this.getRenderTarget(i).attachDepthTexture(pDepthTexture); 
				this.getRenderTarget(i).addViewport(this._pShadowCasterCube[i], EViewportTypes.SHADOWVIEWPORT);
				this.getRenderTarget(i).setAutoUpdated(false);
			}
		};

		_calculateShadows(): void {
			if (this.enabled && this.isShadowCaster) {
				for(var i: uint = 0; i<6; i++){
					this.getRenderTarget(i).update();
				}
			}
		};

		_prepareForLighting(pCamera: ICamera): bool{
			if(!this.enabled){
				return false;
			}
			else{
				var haveInfluence: bool = false;
				if(!this.isShadowCaster){
					for(var i=0; i<6; i++){
						var pResult: IObjectArray = this._defineLightingInfluence(pCamera, i);
						if(pResult.length != 0){
							haveInfluence = true;
						}
					}
					return haveInfluence;
				}
				else{
					for(var i=0; i<6; i++){
						var pResult: IObjectArray = this._defineShadowInfluence(pCamera, i);
						if(pResult.length != 0){
							haveInfluence = true;
						}
					}
					return haveInfluence;
				}
			}
		};

		protected _defineLightingInfluence(pCamera: ICamera, iFace: int): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCasterCube[iFace];
			var pCameraFrustum: IFrustum = pCamera.frustum;

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			//fast test on frustum intersection
			if(!pCameraFrustum.testFrustum(pShadowCaster.frustum)){
				//frustums don't intersecting
				return pResult;
			}

			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);

				if(pCameraFrustum.testRect(pObject.worldBounds)){
					pResult.push(pObject);
				}
			}

			return pResult;
		};

		protected _defineShadowInfluence(pCamera: ICamera, iFace: int): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCasterCube[iFace];
			var pCameraFrustum: IFrustum = pCamera.frustum;

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			//fast test on frustum intersection
			if(!pCameraFrustum.testFrustum(pShadowCaster.frustum)){
				//frustums don't intersecting
				return pResult;
			}

			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			var v3fLightPosition: IVec3 = this.worldPosition;

			var pTestArray: IPlane3d[] = OmniLight._pFrustumPlanes;

			//frustum projection

			//create list for additional testing
			var pFrustumPlanesKeys: string[] = geometry.Frustum.frustumPlanesKeys;
			for(var i: int = 0; i<6; i++){
				var sKey: string = pFrustumPlanesKeys[i];

				var pPlane: IPlane3d = pCameraFrustum[sKey];

				var v3fNormal: IVec3 = pPlane.normal;
				var fDistance: float = pPlane.distance;

				if(pPlane.signedDistance(v3fLightPosition) > 0){
					fDistance = -v3fNormal.dot(v3fLightPosition);
				}

				pTestArray[i].set(v3fNormal, fDistance);
			}

			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);
				var pWorldBounds: IRect3d = pObject.worldBounds;

				//have object shadows?
				if(pObject.hasShadow){
					var j:int = 0;
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

			pShadowCaster._optimizeProjectionMatrix();

			return pResult;
		};

		//list of frustum planes with which additional testing must be done.
		//created just for prevent reallocation
		static _pFrustumPlanes: IPlane3d[] = new Array(6);/*new geometry.Plane3d[];*/
	}

	for(var i:int = 0; i<6; i++){
		OmniLight._pFrustumPlanes[i] = new geometry.Plane3d();
	}
}

#endif