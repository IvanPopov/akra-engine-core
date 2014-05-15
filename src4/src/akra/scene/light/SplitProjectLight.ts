/// <reference path="../../idl/ITexture.ts" />
/// <reference path="../../idl/IFrustum.ts" />
/// <reference path="../../idl/IResourcePoolManager.ts" />
/// <reference path="../../idl/IRenderTarget.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../geometry/Plane3d.ts" />
/// <reference path="../../geometry/classify/classify.ts" />
/// <reference path="../../math/Vec4.ts" />

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

                    //act like simple project
                    var pResult: IObjectArray<ISceneObject> = this._defineLightingInfluence(this._pSplitShadowCasters[0], pCamera, this.getOptimizedCameraFrustum());
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

                        var pResult: IObjectArray<ISceneObject> = this._defineShadowInfluence(this._pSplitShadowCasters[iSplit], pCamera, this.getOptimizedCameraFrustum());
                        if (pResult.getLength() > 0) {
                            nCasted++;
                        }
                    }
                    return (nCasted > 0) ? true : false;
                }
            }
		}
	}
}


