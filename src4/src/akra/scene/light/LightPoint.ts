/// <reference path="../../idl/ILightPoint.ts" />
/// <reference path="../SceneObject.ts" />
/// <reference path="../../math/math.ts" />

/// <reference path="CalculatePlanesForLighting.ts" />
/// <reference path="ShadowCaster.ts" />

module akra.scene.light {

	export class LightPoint extends SceneNode implements ILightPoint {
		protected _isShadowCaster: boolean = false;
		protected _isEnabled: boolean = true;
		protected _iMaxShadowResolution: uint = 256;
		// protected _pLightParameters: ILightParameters = new LightParameters;
		protected _eLightType: ELightTypes;

		//optimized camera frustum for better shadow casting
		protected _pOptimizedCameraFrustum: IFrustum = new geometry.Frustum();

		getParams(): ILightParameters {
			// return this._pLightParameters;
			return null;
		}

		getLightType(): ELightTypes {
			return this._eLightType;
        }

        _setLightType(eType: ELightTypes): void {
            this._eLightType = eType;     
        }

		getOptimizedCameraFrustum(): IFrustum {
			return this._pOptimizedCameraFrustum;
		}

		isEnabled(): boolean {
			return this._isEnabled;
		}

		setEnabled(bValue: boolean): void {
			this._isEnabled = bValue;
		}

		isShadowCaster(): boolean {
			return this._isShadowCaster;
		}

		setShadowCaster(bValue: boolean): void {
			this._isShadowCaster = bValue;
		}

		getLightingDistance(): float {
			return -1.;
		}

		setLightingDistance(fDistance: float): void {
		}

		constructor(pScene: IScene3d, eType: ELightTypes = ELightTypes.UNKNOWN) {
			super(pScene, EEntityTypes.LIGHT);

			this._eLightType = eType;
		}

		create(isShadowCaster: boolean = true, iMaxShadowResolution: int = 256): boolean {
			var isOk: boolean = super.create();

			//есть тени от источника или нет
			this._isShadowCaster = isShadowCaster;
			//мкасимальный размер shadow текстуры
			this._iMaxShadowResolution = iMaxShadowResolution;

			return isOk;
		}

		_prepareForLighting(pCamera: ICamera): boolean {
			debug.warn("pure virtual method");
			return false;
		}

		_calculateShadows(): void {
			debug.critical("NOT IMPLEMENTED!");
		}

		static isLightPoint(pNode: IEntity) {
			return pNode.getType() === EEntityTypes.LIGHT;
        }

        protected _defineLightingInfluence(pShadowCaster: IShadowCaster, pCamera: ICamera, pCameraFrustum: IFrustum = pCamera.getFrustum()): IObjectArray < ISceneObject > {
            var pResult: IObjectArray<ISceneObject> = pShadowCaster.getAffectedObjects();
            pResult.clear();

            //fast test on frustum intersection
            if (!pCameraFrustum.testFrustum(pShadowCaster.getFrustum())) {
                //frustums don't intersecting
                return pResult;
            }

            var pRawResult: IObjectArray<ISceneObject> = pShadowCaster.display(scene.Scene3d.DL_DEFAULT);

            for (var i: int = 0; i < pRawResult.getLength(); i++) {
                var pObject: ISceneObject = pRawResult.value(i);

                if (pCameraFrustum.testRect(pObject.getWorldBounds())) {
                    pResult.push(pObject);
                }
            }

            return pResult;
        }

        protected _defineShadowInfluence(pShadowCaster: IShadowCaster, pCamera: ICamera, pCameraFrustum: IFrustum = pCamera.getFrustum()): IObjectArray < ISceneObject > {
            var pResult: IObjectArray<ISceneObject> = pShadowCaster.getAffectedObjects();
            pResult.clear();

            //fast test on frustum intersection
            if (!pCameraFrustum.testFrustum(pShadowCaster.getFrustum())) {
                //frustums don't intersecting
                pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);
                return pResult;
            }

            var pRawResult: IObjectArray<ISceneObject> = pShadowCaster.display(scene.Scene3d.DL_DEFAULT);

            var pTestArray: IPlane3d[] = LightPoint._pFrustumPlanes;
            var nAdditionalTestLength: int = 0;

            if (pShadowCaster.getProjectionMatrix().isOrthogonalProjection()) {
                nAdditionalTestLength = calculatePlanesForOrthogonalLighting(
                    pShadowCaster.getFrustum(), pShadowCaster.getWorldPosition(),
                    pCameraFrustum, pTestArray);
            }
            else {
                nAdditionalTestLength = calculatePlanesForFrustumLighting(
                    pShadowCaster.getFrustum(), pShadowCaster.getWorldPosition(),
                    pCameraFrustum, pTestArray);
            }

            var v3fMidPoint: IVec3 = Vec3.temp();
            var v3fShadowDir: IVec3 = Vec3.temp();
            var v3fCameraDir: IVec3 = Vec3.temp();

            for (var i: int = 0; i < pRawResult.getLength(); i++) {
                var pObject: ISceneObject = pRawResult.value(i);
                var pWorldBounds: IRect3d = pObject.getWorldBounds();

                //have object shadows?
                if (pObject.getShadow()) {
                    var j: int = 0;
                    for (j = 0; j < nAdditionalTestLength; j++) {
                        var pPlane: IPlane3d = pTestArray[j];

                        if (geometry.classify.planeRect3d(pPlane, pWorldBounds)
                            == EPlaneClassifications.PLANE_FRONT) {
                            break;
                        }
                    }
                    if (j == nAdditionalTestLength) {
                        //discard shadow by distance?

                        pWorldBounds.midPoint(v3fMidPoint);

                        v3fMidPoint.subtract(pShadowCaster.getWorldPosition(), v3fShadowDir);
                        v3fMidPoint.subtract(pCamera.getWorldPosition(), v3fCameraDir);

                        if (v3fCameraDir.dot(v3fShadowDir) > 0 &&
                            pWorldBounds.distanceToPoint(pCamera.getWorldPosition()) >= config.SHADOW_DISCARD_DISTANCE) {
                        }
                        else {
                            pResult.push(pObject);
                        }
                    }
                }
                else {
                    if (pCameraFrustum.testRect(pWorldBounds)) {
                        pResult.push(pObject);
                    }
                }
            }

            return pResult;
		}

        //list of frustum planes with which additional testing must be done.
	    //created just for prevent reallocation
	    static _pFrustumPlanes: IPlane3d[] = new Array(6);/*new geometry.Plane3d[];*/
	}
}

