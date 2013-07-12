#ifndef SUNLIGHT_TS
#define SUNLIGHT_TS

#include "ISunLight.ts"
#include "ITexture.ts"
#include "IResourcePoolManager.ts"
#include "IRenderTarget.ts"
#include "util/ObjectArray.ts"

module akra.scene.light {

	export struct SunParameters implements ISunParameters {
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

		inline get params(): ISunParameters {
			return this._pLightParameters;
		}

		inline get skyDome(): ISceneModel {
			return this._pSkyDome;
		}

		inline set skyDome(pSkyDome: ISceneModel) {
			this._pSkyDome = pSkyDome;
		}

		constructor (pScene: IScene3d) {
			super(pScene, ELightTypes.SUN);
			this._pShadowCaster = pScene._createShadowCaster(this);
		}

		create(isShadowCaster: bool = true, iMaxShadowResolution: uint = 256): bool{
			var isOk: bool = super.create(isShadowCaster, iMaxShadowResolution);

			var pCaster: IShadowCaster = this._pShadowCaster;

			pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
			pCaster.setOrthoParams(1000., 1000., 0., 1000.);
			pCaster.setInheritance(ENodeInheritance.ALL);
			pCaster.attachToParent(this);

			if (this.isShadowCaster) {
				this.initializeTextures();
			}

			return isOk;
		};

		inline getDepthTexture(): ITexture {
			return this._pDepthTexture;
		}

		inline getRenderTarget(): IRenderTarget {
			// return this._pDepthTexture.getBuffer().getRenderTarget();
			return this._pColorTexture.getBuffer().getRenderTarget();
		}

		inline getShadowCaster(): IShadowCaster {
			return this._pShadowCaster;
		}

		inline get isShadowCaster(): bool {
			return this._isShadowCaster;
		}

		set isShadowCaster(bValue: bool){
			this._isShadowCaster = bValue;
			if(bValue && isNull(this._pDepthTexture)){
				this.initializeTextures();
			}
		}

		_calculateShadows(): void {
			if (this.enabled && this.isShadowCaster) {

				// LOG(this._pShadowCaster.affectedObjects);
				this.getRenderTarget().update();
			}
		}

		// create(caster: bool): bool{
		// 	return super.create(false, 0);
		// };

		_prepareForLighting(pCamera: ICamera): bool{
			// if(!this.enabled){
			// 	return false;
			// }

			// return true;
			if(!this.enabled){
				return false;
			}
			else{
				/*************************************************************/
				//optimize camera frustum
				var pDepthRange: IDepthRange = pCamera.getDepthRange();

				var fFov: float = pCamera.fov;
				var fAspect: float = pCamera.aspect;

				var m4fTmp: IMat4 = Mat4.perspective(fFov, fAspect, -pDepthRange.min, -pDepthRange.max, mat4());

				this.optimizedCameraFrustum.extractFromMatrix(m4fTmp, pCamera.worldMatrix);
				/*************************************************************/

				if(!this.isShadowCaster){
					var pResult: IObjectArray = this._defineLightingInfluence(pCamera);
					return (pResult.length == 0) ? false : true;
				}
				else{
					var pResult: IObjectArray = this._defineShadowInfluence(pCamera);
					// this._pShadowCaster.optimizedProjection.set(this._pShadowCaster.projectionMatrix);
					return (pResult.length == 0) ? false : true;
				}
			}
		}

		protected _defineLightingInfluence(pCamera: ICamera): IObjectArray{
			var pShadowCaster: IShadowCaster = this._pShadowCaster;
			var pCameraFrustum: IFrustum = this.optimizedCameraFrustum;

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			// fast test on frustum intersection
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
			var pCameraFrustum: IFrustum = this.optimizedCameraFrustum;

			var pResult: IObjectArray = pShadowCaster.affectedObjects;
			pResult.clear();

			// fast test on frustum intersection
			if(!pCameraFrustum.testFrustum(pShadowCaster.frustum)){
				//frustums don't intersecting
				pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);
				// pShadowCaster.optimizedProjection.set(pShadowCaster.projectionMatrix);
				return pResult;
			}

			var pRawResult: IObjectArray = pShadowCaster.display(DL_DEFAULT);

			var pTestArray: IPlane3d[] = SunLight._pFrustumPlanes;
			var pFrustumPlanesKeys: string[] = geometry.Frustum.frustumPlanesKeys;
			var nAdditionalTestLength: int = 0;

			//orthogonal projection
			//defining light sight direction;
			//TODO: rewrite additional testing
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

			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);
				var pWorldBounds: IRect3d = pObject.worldBounds;

				//have object shadows?
				if(pObject.hasShadow){
					var j:int = 0;
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

			pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);

			return pResult;
		};

		updateSunDirection(v3fSunDir: IVec3): void {
			// var m4fMat: IMat4 = mat4(this.localMatrix);
			// m4fMat.data[__13] = -v3fSunDir.x;
			// m4fMat.data[__23] = -v3fSunDir.y;
			// m4fMat.data[__33] = -v3fSunDir.z;
			//this.localMatrix = Mat4.fromXYZ(vec3(v3fSunDir.x, v3fSunDir.y, v3fSunDir.z).scale(-1., vec3()), mat4()).setTranslation(vec3(0., 0., 1.));
			
			// var pViewMat = mat4();

			var pViewMat = Mat4.lookAt(vec3(0.), vec3(v3fSunDir).scale(-1.), vec3(0., 0., 1.), mat4());

			this.localMatrix = pViewMat.inverse();

			this.localMatrix.setTranslation(v3fSunDir.scale(500., vec3()));

			//this.localMatrix.setTranslation();
		}

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
								 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

			pDepthTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.getGuid());
			pColorTexture.create(iSize, iSize, 1, null, ETextureFlags.RENDERTARGET, 
						  0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			this._pColorTexture = pColorTexture;

			// this._pColorTexture = pColorTexture;
			//TODO: Multiple render target
			this.getRenderTarget().attachDepthTexture(pDepthTexture); 
			this.getRenderTarget().setAutoUpdated(false);
			this.getRenderTarget().addViewport(this._pShadowCaster, EViewportTypes.SHADOWVIEWPORT);
		}
		
		//list of frustum planes with which additional testing must be done.
		//created just for prevent reallocation
		static _pFrustumPlanes: IPlane3d[] = new Array(6);/*new geometry.Plane3d[];*/
	}

	for(var i:int = 0; i<6; i++){
		SunLight._pFrustumPlanes[i] = new geometry.Plane3d();
	}
}

#endif
