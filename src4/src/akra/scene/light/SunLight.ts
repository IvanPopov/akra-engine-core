#ifndef SUNLIGHT_TS
#define SUNLIGHT_TS

#include "ISunLight.ts"
#include "ITexture.ts"
#include "IResourcePoolManager.ts"
#include "IRenderTarget.ts"
#include "util/ObjectArray.ts"
#include "util/CalculatePlanesForLighting.ts"

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

		inline get lightingDistance(): float{
			return this._pShadowCaster.farPlane;
		};

		inline set lightingDistance(fDistance){
			this._pShadowCaster.farPlane = fDistance;
		};

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
			var nAdditionalTestLength: int = 0;

			nAdditionalTestLength = util.calculatePlanesForOrthogonalLighting(
											pShadowCaster.frustum, pShadowCaster.worldPosition,
											pCameraFrustum, pTestArray);

			var v3fMidPoint: IVec3 = vec3();
			var v3fShadowDir: IVec3 = vec3();
			var v3fCameraDir: IVec3 = vec3();

			for(var i:int = 0; i<pRawResult.length; i++){
				var pObject: ISceneObject = pRawResult.value(i);
				var pWorldBounds: IRect3d = pObject.worldBounds;

				//have object shadows?
				if(pObject.shadow){
					var j:int = 0;
					for(j = 0; j<nAdditionalTestLength; j++){
						var pPlane: IPlane3d = pTestArray[j];

						if(geometry.planeClassifyRect3d(pPlane, pWorldBounds) 
								== EPlaneClassifications.PLANE_FRONT){
							break;
						}
					}
					if(j == nAdditionalTestLength){

						//discard shadow by distance?

						pWorldBounds.midPoint(v3fMidPoint);

						v3fMidPoint.subtract(pShadowCaster.worldPosition, v3fShadowDir);
						v3fMidPoint.subtract(pCamera.worldPosition, v3fCameraDir);

						if(v3fCameraDir.dot(v3fShadowDir) > 0 &&
							pWorldBounds.distanceToPoint(pCamera.worldPosition) >= SHADOW_DISCARD_DISTANCE){
						}
						else{
							pResult.push(pObject);
						}
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
			this.getRenderTarget().addViewport(new render.ShadowViewport(this._pShadowCaster));
		}
		
		//list of frustum planes with which additional testing must be done.
		//created just for prevent reallocation
		static _pFrustumPlanes: IPlane3d[] = new Array(6);/*new geometry.Plane3d[];*/
		static _pTmpPlanePoints: IVec3[] = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
		static _pTmpIndexList: uint[] = [0, 0, 0, 0];
		static _pTmpDirLengthList: float[] = [0.0, 0.0, 0.0, 0.0];
	}

	for(var i:int = 0; i<6; i++){
		SunLight._pFrustumPlanes[i] = new geometry.Plane3d();
	}
}

#endif
