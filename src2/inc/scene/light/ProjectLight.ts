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
			super(pScene, ELightTypes.PROJECT);
			this._pShadowCaster = pScene._createShadowCaster(this);
		};

		create(isShadowCaster: bool = true, iMaxShadowResolution: uint = 256): bool{
			var isOk: bool = super.create(isShadowCaster, iMaxShadowResolution);

			var pCaster: IShadowCaster = this._pShadowCaster;

			pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
			pCaster.setInheritance(ENodeInheritance.ALL);
			pCaster.attachToParent(this);

			if (this.isShadowCaster) {
				this.initializeTextures();
			}

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

		inline get isShadowCaster(): bool {
			return this._isShadowCaster;
		};

		/**
		 * overridden setter isShadow caster,
		 * if depth texture don't created then create depth texture
		 */
		set isShadowCaster(bValue: bool){
			this._isShadowCaster = bValue;
			if(bValue && isNull(this._pDepthTexture)){
				this.initializeTextures();
			}
		};

		protected initializeTextures(): void {
			var pEngine: IEngine = this.scene.getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			// if (!isNull(this._pDepthTexture)){
			// 	this._pDepthTexture.destroyResource();
			// }

			var pDepthTexture: ITexture = this._pDepthTexture = 
				pResMgr.createTexture("depth_texture_" + this.getGuid());
			pDepthTexture.create(iSize, iSize, 1, null, 0,
				0, 1, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

			pDepthTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			// var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.getGuid());
			// pColorTexture(iSize, iSize, 1, Color.BLACK, 0,
			// 	0, ETextureTypes.TEXTURE_2D, EPixelFormats.LUMINANCE);

			// this._pColorTexture = pColorTexture;
			//TODO: Multiple render target
			// this.getRenderTarget().addViewport(this._pShadowCaster); 
		};

		_calculateShadows(): void {
			if (!this.enabled || !this.isShadowCaster) {
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
					return (pResult.length == 0) ? false : true;
				}
				else{
					var pResult: IObjectArray = this._defineShadowInfluence(pCamera);
					return (pResult.length == 0) ? false : true;
				}
			}
		};

		protected _defineLightingInfluence(pCamera: ICamera): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCaster;
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

		protected _defineShadowInfluence(pCamera: ICamera): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCaster;
			var pCameraFrustum: IFrustum = pCamera.frustum;

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			//fast test on frustum intersection
			if(!pCameraFrustum.testFrustum(pShadowCaster.frustum)){
				//frustums don't intersecting
				return pResult;
			}

			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			var pTestArray: IPlane3d[] = ProjectLight._pFrustumPlanes;
			var pFrustumPlanesKeys: string[] = geometry.Frustum.frustumPlanesKeys;
			var nAdditionalTestLength: int = 0;

			if(pShadowCaster.projectionMatrix.isOrthogonalProjection()){
				//orthogonal projection
				//defining light sight direction;
				
				var pLightFrustumVertices: IVec3[] = pShadowCaster.frustum.frustumVertices;

				var v3fDirection1: IVec3 = vec3(0.);
				var v3fDirection2: IVec3 = vec3(0.);

				var v3fDirection: IVec3 = vec3(0.);

				//nearPlane
				for(var i: int = 0; i<4;i++){
					v3fDirection1.add(pLightFrustumVertices[i]);
				}
				//farPlane
				for(var i: int = 4; i<8;i++){
					v3fDirection2.add(pLightFrustumVertices[i]);
				}

				v3fDirection2.subtract(v3fDirection1, v3fDirection);
				v3fDirection.normalize();

				for(var i: int = 0; i<6; i++){
					var sKey: string = pFrustumPlanesKeys[i];

					var pPlane: IPlane3d = pCameraFrustum[sKey];

					if(v3fDirection.dot(pPlane.normal) >= 0.){
						//adding plane
						
						pTestArray[nAdditionalTestLength].set(pPlane);
						nAdditionalTestLength++;
					}
					else{
						var pPlanePoints = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
						pCameraFrustum.getPlanePoints(sKey, pPlanePoints);

						//find far points;
						var pDirections = new Array(4);

						for(var j: int = 0; j<4; j++){
							pDirections[j] = new Vec3();
							pPlanePoints[j].subtract(this.worldPosition,pDirections[j]);
						}

						var fLength1: float = pDirections[0].length();
						var fLength2: float = pDirections[1].length();
						var fLength3: float = pDirections[2].length();
						var fLength4: float = pDirections[3].length();

						var pTmp1: float[] = [fLength1, fLength2, fLength3, fLength4];

						var pIndex: uint[] = [-1,-1,-1,-1];

						for(var j: uint = 0; j<4;j++){
							var iTest = 3;
							for(var k: uint = 0; k<4;k++){
								if(k == j){
									continue;
								}
								if(pTmp1[j] >= pTmp1[k]){
									iTest--;
								}
							}
							for(var k: uint = 0 ; k<4; k++){
								if(pIndex[iTest] == -1){
									pIndex[iTest] = j;
									break;
								}
								else{
									iTest++;
								}
							}
						}

						var pPoint1: IVec3 = pPlanePoints[pIndex[0]];
						var pPoint2: IVec3 = pPlanePoints[pIndex[1]];

						var pTestPoint1: IVec3 = pPlanePoints[pIndex[2]];
						var pTestPoint2: IVec3 = pPlanePoints[pIndex[3]];

						// console.log(pPoint1, pPoint2, pTestPoint1, pTestPoint2)

						var v3fDir: IVec3 = pPoint2.subtract(pPoint1, vec3());

						var v3fNormal: IVec3 = v3fDir.cross(v3fDirection, vec3()).normalize();

						var pTestPlane: IPlane3d = pTestArray[nAdditionalTestLength];
						pTestPlane.set(v3fNormal, -v3fNormal.dot(pPoint1));

						var pVertices: IVec3[] = pCamera.frustum.frustumVertices;
						var iTest: uint = 0;
						for(var k: int =0; k < 8;k++){
							// console.log(pTestPlane.signedDistance(pVertices[k]));
							if(pTestPlane.signedDistance(pVertices[k]) > 0.1){
								iTest++;
							}
						}

						if(iTest == 6){
							pTestPlane.negate();
						}
						else if(iTest != 0){
							continue;
						}

						nAdditionalTestLength++;

						//pTestPlane.set(v3fNormal, -v3fNormal.dot(pPoint1));
						

						// if(pTestPlane.signedDistance(pTestPoint1) > 0.1 && math.abs(pTestPlane.signedDistance(pTestPoint2)) > 0.1){
						// 	v3fNormal.negate();
							
						// }
					}
				}
			}
			else{
				//frustum projection

				//create list for additional testing
				var v3fLightPosition: IVec3 = this.worldPosition;

				for(var i: int = 0; i<6; i++){
					var sKey: string = pFrustumPlanesKeys[i];

					var pPlane: IPlane3d = pCameraFrustum[sKey];

					var v3fNormal: IVec3 = vec3().set(pPlane.normal);
					var fDistance: float = pPlane.distance;

					if(pPlane.signedDistance(v3fLightPosition) > 0){

						// fDistance = -v3fNormal.dot(v3fLightPosition);

						var pPlanePoints = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
						pCameraFrustum.getPlanePoints(sKey, pPlanePoints);

						//find far points;
						var pDirections = new Array(4);

						for(var j: int = 0; j<4; j++){
							pDirections[j] = new Vec3();
							pPlanePoints[j].subtract(v3fLightPosition,pDirections[j]);
						}

						var fLength1: float = pDirections[0].length();
						var fLength2: float = pDirections[1].length();
						var fLength3: float = pDirections[2].length();
						var fLength4: float = pDirections[3].length();

						var pTmp1: float[] = [fLength1, fLength2, fLength3, fLength4];

						var pIndex: uint[] = [-1,-1,-1,-1];

						for(var j: uint = 0; j<4;j++){
							var iTest = 3;
							for(var k: uint = 0; k<4;k++){
								if(k == j){
									continue;
								}
								if(pTmp1[j] >= pTmp1[k]){
									iTest--;
								}
							}
							for(var k: uint = 0 ; k<4; k++){
								if(pIndex[iTest] == -1){
									pIndex[iTest] = j;
									break;
								}
								else{
									iTest++;
								}
							}
						}

						var pDir1: IVec3 = pDirections[pIndex[0]];
						var pDir2: IVec3 = pDirections[pIndex[1]];

						var pTestPoint1: IVec3 = pPlanePoints[pIndex[2]];
						var pTestPoint2: IVec3 = pPlanePoints[pIndex[3]];

						pDir1.cross(pDir2, v3fNormal).normalize();

						var pTestPlane: IPlane3d = pTestArray[i];
						pTestPlane.set(v3fNormal, -v3fNormal.dot(v3fLightPosition));

						// console.log(pTestPlane.signedDistance(pTestPoint1), pTestPlane.signedDistance(pTestPoint2));

						var fThreshold: float = 0.1;

						if(math.abs(pTestPlane.signedDistance(pTestPoint1)) <= fThreshold && math.abs(pTestPlane.signedDistance(pTestPoint2)) <= fThreshold){
							pTestPlane.set(pPlane.normal, -pPlane.normal.dot(v3fLightPosition)); 
						}
						else if(pTestPlane.signedDistance(pTestPoint1) > 0 && math.abs(pTestPlane.signedDistance(pTestPoint2)) > 0) {
							pTestPlane.negate();
						}
						// console.log(pTestPlane.normal.toString(), pTestPlane.distance);
						// console.log(pTmp1[pIndex[0]], pTmp1[pIndex[1]], pTmp1[pIndex[2]], pTmp1[pIndex[3]]);
					}
					else{
						pTestArray[i].set(v3fNormal, fDistance);
					}
				}				
				nAdditionalTestLength = 6;
			}

			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);
				var pWorldBounds: IRect3d = pObject.worldBounds;

				//have object shadows?
				if(pObject.hasShadows){
					var j:int = 0
					for(j = 0; j<nAdditionalTestLength; j++){
						var pPlane: IPlane3d = pTestArray[j];

						if(geometry.planeClassifyRect3d(pPlane, pWorldBounds) 
								== EPlaneClassifications.PLANE_FRONT){
							break;
						}
					}
					if(j == nAdditionalTestLength){
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
		ProjectLight._pFrustumPlanes[i] = new geometry.Plane3d();
	}
}

#endif
