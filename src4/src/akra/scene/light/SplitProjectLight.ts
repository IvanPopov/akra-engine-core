/// <reference path="../../idl/ITexture.ts" />
/// <reference path="../../idl/IFrustum.ts" />
/// <reference path="../../idl/IResourcePoolManager.ts" />
/// <reference path="../../idl/IRenderTarget.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/classify/classify.ts" />
/// <reference path="../../math/Vec4.ts" />

/// <reference path="CalculatePlanesForLighting.ts" />
/// <reference path="ShadowCaster.ts" />

module akra.scene.light {

	import Color = color.Color;
	import Vec3 = math.Vec3;
	import Mat4 = math.Mat4;

	export class SplitProjectLight extends LightPoint implements ISplitProjectLight {
		protected _pDepthTexture: ITexture = null;
		protected _pColorTexture: ITexture = null;
		protected _pLightParameters: IProjectParameters = new ProjectParameters;
		protected _pSplitShadowCasters: IShadowCaster[] = null;

        protected _nSplitNumber: uint;
        protected _fSplitParameter: float;

        protected _pViewportCoords: IVec4[] = null;
        protected _pSplitPositions: float[] = null;

		constructor(pScene: IScene3d) {
            super(pScene, ELightTypes.SPLIT_PROJECT);
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

            //if we need shadow we use split project otherwise it's just project
            if (bValue) {
                this._setLightType(ELightTypes.SPLIT_PROJECT);
                
                if (isNull(this._pDepthTexture)) {
                    //create textures if we don't have it
                    this.initializeTextures();
                }
            }
            else {
                this._setLightType(ELightTypes.PROJECT);
            }
		}

		getLightingDistance(): float {
			return this._pSplitShadowCasters[0].getFarPlane();
		}

        setLightingDistance(fDistance): void {
            for (var i: uint = 0; i < this._nSplitNumber; i++) {
                //apply to all casters
                this._pSplitShadowCasters[i].setFarPlane(fDistance);
            }
		}

		getShadowCaster(iCaster: uint = 0): IShadowCaster {
			return this._pSplitShadowCasters[iCaster];
		}

		getDepthTexture(): ITexture {
			return this._pDepthTexture;
		}

		getRenderTarget(): IRenderTarget {
			// return this._pDepthTexture.getBuffer().getRenderTarget();
			return this._pColorTexture.getBuffer().getRenderTarget();
        }

        getSplitCount(): uint {
            return this._nSplitNumber;
        }

        getViewportPosition(iSplit: uint): IVec4 {
            return this._pViewportCoords[iSplit];
        }

		create(isShadowCaster: boolean = true, iMaxShadowResolution: uint = 256, nSplitNumber: uint = 4, fSplitParameter: float = 0.5): boolean {
            var isOk: boolean = super.create(isShadowCaster, iMaxShadowResolution);

            //if shadows disabled change type on simple project
            if (!isShadowCaster) {
                this._setLightType(ELightTypes.PROJECT);
            }

            var pCasters: IShadowCaster[] = this._pSplitShadowCasters = new Array(nSplitNumber);
            var pCaster: IShadowCaster;
            var pScene: IScene3d = this._pScene;            

            for (var i: uint = 0; i < nSplitNumber; i++) {
                pCaster = pCasters[i] = pScene._createShadowCaster(this);      

                pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
                pCaster.setInheritance(ENodeInheritance.ALL);
                pCaster.attachToParent(this);
            }

            this._nSplitNumber = nSplitNumber;
            this._fSplitParameter = fSplitParameter;

            this._pSplitPositions = new Array(nSplitNumber);

			if (this.isShadowCaster()) {
				this.initializeTextures();
			}

			return isOk;
        }

		protected initializeTextures(): void {
			var pEngine: IEngine = this.getScene().getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
            var iSize: uint = this._iMaxShadowResolution;

            var iRows: uint, iColomns: uint;

            var iTmp: uint = math.ceilingPowerOfTwo(this._nSplitNumber);
            var fTmp: float = math.log2(iTmp);

            //используется для упаковки нескольких текстур в одну

            iColomns = math.pow(2, math.ceil(fTmp/2)); 
            iRows = iTmp / iColomns;

			// if (!isNull(this._pDepthTexture)){
			// 	this._pDepthTexture.destroyResource();
			// }

			var pDepthTexture: ITexture = this._pDepthTexture =
				pResMgr.createTexture("depth_texture_" + this.guid);
            pDepthTexture.create(iSize * iColomns, iSize * iRows, 1, null, 0,
				0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

			pDepthTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.guid);
            pColorTexture.create(iSize * iColomns, iSize * iRows, 1, null, ETextureFlags.RENDERTARGET,
				0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			this._pColorTexture = pColorTexture;

			//TODO: Multiple render target
			this.getRenderTarget().attachDepthTexture(pDepthTexture);
            this.getRenderTarget().setAutoUpdated(false);

            var fStepX: float = 1. / iColomns;
            var fStepY: float = 1. / iRows;
            var iPositionX: uint, iPositionY: uint;

            var pViewportCoords: IVec4[] = this._pViewportCoords = new Array(this._nSplitNumber);

            for (var i: int = 0; i < this._nSplitNumber; i++) {
                iPositionX = i % iColomns;
                iPositionY = math.floor(i / iColomns);

                pViewportCoords[i] = new math.Vec4(iPositionX * fStepX, iPositionY * fStepY, fStepX, fStepY);

                this.getRenderTarget().addViewport(new render.ShadowViewport(this._pSplitShadowCasters[i], pViewportCoords[i].x, pViewportCoords[i].y, fStepX, fStepY, i)); 
                //указываем в какие части текстуры какой сплит рендерит
            }
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
				//optimize camera frustum and do split
				var pDepthRange: IDepthRange = pCamera.getDepthRange();

				var fFov: float = pCamera.getFOV();
                var fAspect: float = pCamera.getAspect();

                var fNear: float = -pDepthRange.min;
                var fFar: float = -pDepthRange.max;

                if (!this.isShadowCaster()) {
                    var m4fTmp: IMat4 = Mat4.perspective(fFov, fAspect, fNear, fFar, Mat4.temp());
                    this.getOptimizedCameraFrustum().extractFromMatrix(m4fTmp, pCamera.getWorldMatrix());

                    var pResult: IObjectArray<ISceneObject> = this._defineLightingInfluence(pCamera);
                    return (pResult.getLength() !== 0) ? true : false;
                }
                else {

                    var fFNr: float = fFar / fNear; //ratio
                    var fFNs: float = fFar - fNear; //subtract

                    var fSplitParameter: float = this._fSplitParameter;

                    var fSplitNear: float, fSplitFar: float;
                    var fLog: float, fUni: float;

                    fSplitFar = fNear;

                    var nCasted: uint = 0;

                    for (var iSplit: uint = 0; iSplit < this._nSplitNumber; iSplit++) {

                        fLog = fNear * math.pow(fFNr, (iSplit + 1) / this._nSplitNumber);
                        fUni = fNear + fFNs * (iSplit + 1) / this._nSplitNumber;

                        fSplitNear = fSplitFar;
                        fSplitFar = fSplitParameter * fLog + (1. - fSplitParameter) * fUni;

                        this._pSplitPositions[iSplit] = fSplitFar;

                        var m4fTmp: IMat4 = Mat4.perspective(fFov, fAspect, fSplitNear, fSplitFar, Mat4.temp());

                        this.getOptimizedCameraFrustum().extractFromMatrix(m4fTmp, pCamera.getWorldMatrix());

                        var pResult: IObjectArray<ISceneObject> = this._defineShadowInfluence(pCamera, iSplit);
                        if (pResult.getLength() > 0) {
                            nCasted++;
                        }
                    }
                    return (nCasted > 0) ? true : false;
                }
            }
		}

        protected _defineLightingInfluence(pCamera: ICamera): IObjectArray<ISceneObject> {
            //split project now acts like simple project
			var pShadowCaster: IShadowCaster = this._pSplitShadowCasters[0];
			var pCameraFrustum: IFrustum = this.getOptimizedCameraFrustum();

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

        protected _defineShadowInfluence(pCamera: ICamera, iSplit: uint): IObjectArray<ISceneObject> {
			var pShadowCaster: IShadowCaster = this._pSplitShadowCasters[iSplit];
			var pCameraFrustum: IFrustum = this.getOptimizedCameraFrustum();

			var pResult: IObjectArray<ISceneObject> = pShadowCaster.getAffectedObjects();
			pResult.clear();

			//fast test on frustum intersection
			if (!pCameraFrustum.testFrustum(pShadowCaster.getFrustum())) {
				//frustums don't intersecting
				pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);
				return pResult;
			}

			var pRawResult: IObjectArray<ISceneObject> = pShadowCaster.display(scene.Scene3d.DL_DEFAULT);

            var pTestArray: IPlane3d[] = SplitProjectLight._pFrustumPlanes;
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

			pShadowCaster._optimizeProjectionMatrix(pCameraFrustum);

			return pResult;
		}

		//list of frustum planes with which additional testing must be done.
		//created just for prevent reallocation
		static _pFrustumPlanes: IPlane3d[] = new Array(6);/*new geometry.Plane3d[];*/
	}

	for (var i: int = 0; i < 6; i++) {
        SplitProjectLight._pFrustumPlanes[i] = new geometry.Plane3d();
	}

}


