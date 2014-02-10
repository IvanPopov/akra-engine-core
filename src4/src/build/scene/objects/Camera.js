/// <reference path="../../idl/IScene3d.ts" />
/// <reference path="../../idl/ICamera.ts" />
/// <reference path="../../idl/IDisplayList.ts" />
/// <reference path="../../idl/IViewport.ts" />
/// <reference path="../../idl/IObjectArray.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        /// <reference path="../../geometry/Frustum.ts" />
        /// <reference path="../../common.ts" />
        /// <reference path="../../math/math.ts" />
        /// <reference path="../../util/ObjectArray.ts" />
        /// <reference path="../SceneObject.ts" />
        (function (objects) {
            var Mat4 = akra.math.Mat4;
            var Mat3 = akra.math.Mat3;
            var Vec3 = akra.math.Vec3;
            var Vec4 = akra.math.Vec4;

            var __13 = akra.math.__13;
            var __23 = akra.math.__23;
            var __33 = akra.math.__33;

            var ECameraFlags;
            (function (ECameraFlags) {
                ECameraFlags[ECameraFlags["k_NewProjectionMatrix"] = 0] = "k_NewProjectionMatrix";
                ECameraFlags[ECameraFlags["k_NewProjectionParams"] = 1] = "k_NewProjectionParams";
            })(ECameraFlags || (ECameraFlags = {}));

            var DLTechnique = (function () {
                function DLTechnique(pList, pCamera) {
                    this._pPrevResult = null;
                    this.list = pList;
                    this.camera = pCamera;
                }
                DLTechnique.prototype.findObjects = function (pResultArray, bQuickSearch) {
                    if (typeof bQuickSearch === "undefined") { bQuickSearch = false; }
                    var pResult = this.list._findObjects(this.camera, pResultArray, bQuickSearch && akra.isDefAndNotNull(this._pPrevResult));

                    if (akra.isNull(this._pPrevResult)) {
                        this._pPrevResult = pResult;
                    }

                    return this._pPrevResult;
                };
                return DLTechnique;
            })();
            objects.DLTechnique = DLTechnique;

            var Camera = (function (_super) {
                __extends(Camera, _super);
                function Camera(pScene, eType) {
                    if (typeof eType === "undefined") { eType = 4 /* CAMERA */; }
                    _super.call(this, pScene, eType);
                    /** camera type */
                    this._eCameraType = 0 /* PERSPECTIVE */;
                    /** camera options */
                    this._iCameraOptions = 0;
                    /** update projection bit flag */
                    this._iUpdateProjectionFlags = 0;
                    /**
                    * View matrix
                    */
                    this._m4fView = new Mat4;
                    /** internal, un-biased projection matrix */
                    this._m4fProj = new Mat4;
                    /** internal, un-biased projection+view matrix */
                    this._m4fProjView = new Mat4;
                    /**
                    * Biased for use during current render stage
                    * @deprecated
                    */
                    //protected _m4fRenderStageProj: IMat4 = new Mat4;
                    /**
                    * @deprecated
                    */
                    //protected _m4fRenderStageProjView: IMat4 = new Mat4;
                    /** Search rect for scene culling */
                    this._pSearchRect = new akra.geometry.Rect3d();
                    /** Position */
                    this._v3fTargetPos = new Vec3;
                    /** Attributes for projection matrix */
                    this._fFOV = akra.math.PI / 5.;
                    this._fAspect = 4. / 3.;
                    this._fNearPlane = 0.1;
                    this._fFarPlane = 500.;
                    this._fWidth = 0.;
                    this._fHeight = 0.;
                    this._fMinX = 0.;
                    this._fMaxX = 0.;
                    this._fMinY = 0.;
                    this._fMaxY = 0.;
                    this._pFrustum = new akra.geometry.Frustum;
                    this._pLastViewport = null;
                    this._pDLTechniques = [];
                    this._pDLResultStorage = [];
                }
                Camera.prototype.setupSignals = function () {
                    this.preRenderScene = this.preRenderScene || new akra.Signal(this);
                    this.postRenderScene = this.postRenderScene || new akra.Signal(this);

                    _super.prototype.setupSignals.call(this);
                };

                Camera.prototype.getViewMatrix = function () {
                    return this._m4fView;
                };

                Camera.prototype.getProjectionMatrix = function () {
                    return this._m4fProj;
                };

                Camera.prototype.getProjViewMatrix = function () {
                    return this._m4fProjView;
                };

                Camera.prototype.getTargetPos = function () {
                    return this._v3fTargetPos;
                };

                Camera.prototype.getViewDistance = function () {
                    return this._fFarPlane - this._fNearPlane;
                };

                Camera.prototype.getSearchRect = function () {
                    return this._pSearchRect;
                };

                Camera.prototype.getFrustum = function () {
                    return this._pFrustum;
                };

                Camera.prototype.getFOV = function () {
                    return this._fFOV;
                };

                Camera.prototype.setFOV = function (fFOV) {
                    this._fFOV = fFOV;
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 1 /* k_NewProjectionParams */);
                };

                Camera.prototype.getAspect = function () {
                    return this._fAspect;
                };

                Camera.prototype.setAspect = function (fAspect) {
                    this._fAspect = fAspect;
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 1 /* k_NewProjectionParams */);
                };

                Camera.prototype.getNearPlane = function () {
                    return this._fNearPlane;
                };

                Camera.prototype.setNearPlane = function (fNearPlane) {
                    this._fNearPlane = fNearPlane;
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 1 /* k_NewProjectionParams */);
                };

                Camera.prototype.getFarPlane = function () {
                    return this._fFarPlane;
                };

                Camera.prototype.setFarPlane = function (fFarPlane) {
                    this._fFarPlane = fFarPlane;
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 1 /* k_NewProjectionParams */);
                };

                Camera.prototype.create = function () {
                    var isOK = _super.prototype.create.call(this);

                    if (isOK) {
                        this._v3fTargetPos.set(this._m4fLocalMatrix.data[__13], this._m4fLocalMatrix.data[__23], this._m4fLocalMatrix.data[__33]);
                        this._v3fTargetPos.negate();

                        this.recalcProjMatrix();
                        this.recalcMatrices();

                        var pScene = this._pScene;

                        pScene.displayListAdded.connect(this, this._addDisplayList);
                        pScene.displayListRemoved.connect(this, this._removeDisplayList);

                        for (var i = 0; i < pScene.getTotalDL(); ++i) {
                            var pList = pScene.getDisplayList(i);

                            if (!akra.isNull(pList)) {
                                this._addDisplayList(pScene, pList, i);
                            }
                        }
                    }

                    return isOK;
                };

                Camera.prototype.isProjParamsNew = function () {
                    return akra.bf.testBit(this._iUpdateProjectionFlags, 1 /* k_NewProjectionParams */);
                };

                Camera.prototype.recalcProjMatrix = function () {
                    switch (this._eCameraType) {
                        case 0 /* PERSPECTIVE */:
                            Mat4.perspective(this._fFOV, this._fAspect, this._fNearPlane, this._fFarPlane, this._m4fProj);
                            break;
                        case 1 /* ORTHO */:
                            Mat4.orthogonalProjection(this._fWidth, this._fHeight, this._fNearPlane, this._fFarPlane, this._m4fProj);
                            break;
                        case 2 /* OFFSET_ORTHO */:
                            Mat4.orthogonalProjectionAsymmetric(this._fMinX, this._fMaxX, this._fMinY, this._fMaxY, this._fNearPlane, this._fFarPlane, this._m4fProj);
                            break;
                    }
                    this._iUpdateProjectionFlags = akra.bf.clearBit(this._iUpdateProjectionFlags, 1 /* k_NewProjectionParams */);
                };

                Camera.prototype.prepareForUpdate = function () {
                    _super.prototype.prepareForUpdate.call(this);
                    //reset culling cache for all display lists
                    // for (var i: int = 0; i < this._pDLTechniques.length; ++ i) {
                    // 	if (this._pDLTechniques[i] != null) {
                    // 		this._pDLTechniques.reset();
                    // 	}
                    // }
                };

                Camera.prototype.display = function (iList) {
                    if (typeof iList === "undefined") { iList = /*DL_DEFAULT*/ 0; }
                    var pObjects = this._pDLTechniques[iList].findObjects(this._pDLResultStorage[iList], !this.isUpdated());

                    return pObjects;
                };

                Camera.prototype._getLastResults = function (iList) {
                    if (typeof iList === "undefined") { iList = 0; }
                    return this._pDLResultStorage[iList] || null;
                };

                Camera.prototype.setParameter = function (eParam, pValue) {
                    if (eParam === 1 /* CONST_ASPECT */ && pValue) {
                        this._iCameraOptions = akra.bf.setAll(this._iCameraOptions, eParam);
                    }
                };

                Camera.prototype.isConstantAspect = function () {
                    return akra.bf.testAny(this._iCameraOptions, 1 /* CONST_ASPECT */);
                };

                Camera.prototype.setProjParams = function (fFOV, fAspect, fNearPlane, fFarPlane) {
                    // Set attributes for the projection matrix
                    this._fFOV = fFOV;
                    this._fAspect = fAspect;
                    this._fNearPlane = fNearPlane;
                    this._fFarPlane = fFarPlane;
                    this._eCameraType = 0 /* PERSPECTIVE */;

                    // create the regular projection matrix
                    Mat4.perspective(fFOV, fAspect, fNearPlane, fFarPlane, this._m4fProj);

                    // create a unit-space matrix
                    // for sky box geometry.
                    // this ensures that the
                    // near and far plane enclose
                    // the unit space around the camera
                    // Mat4.perspective(fFOV, fAspect, 0.01, 2.0, this._m4fUnitProj);
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 0 /* k_NewProjectionMatrix */);
                };

                Camera.prototype.setOrthoParams = function (fWidth, fHeight, fNearPlane, fFarPlane) {
                    this._fWidth = fWidth;
                    this._fHeight = fHeight;
                    this._fNearPlane = fNearPlane;
                    this._fFarPlane = fFarPlane;
                    this._eCameraType = 1 /* ORTHO */;

                    // create the regular projection matrix
                    Mat4.orthogonalProjection(fWidth, fHeight, fNearPlane, fFarPlane, this._m4fProj);

                    // create a unit-space matrix
                    // for sky box geometry.
                    // this ensures that the
                    // near and far plane enclose
                    // the unit space around the camera
                    // Mat4.matrixOrthoRH(fWidth, fHeight, 0.01, 2.0, this._m4fUnitProj);
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 0 /* k_NewProjectionMatrix */);
                };

                Camera.prototype.setOffsetOrthoParams = function (fMinX, fMaxX, fMinY, fMaxY, fNearPlane, fFarPlane) {
                    this._fMinX = fMinX;
                    this._fMaxX = fMaxX;
                    this._fMinY = fMinY;
                    this._fMaxY = fMaxY;
                    this._fNearPlane = fNearPlane;
                    this._fFarPlane = fFarPlane;
                    this._eCameraType = 2 /* OFFSET_ORTHO */;

                    // create the regular projection matrix
                    Mat4.orthogonalProjectionAsymmetric(fMinX, fMaxX, fMinY, fMaxY, fNearPlane, fFarPlane, this._m4fProj);

                    // create a unit-space matrix
                    // for sky box geometry.
                    // this ensures that the
                    // near and far plane enclose
                    // the unit space around the camera
                    // Mat4.orthogonalProjectionorthogonalProjectionAsymmetric(fMinX, fMaxX, fMinY, fMaxY,
                    //                             0.01, 2.0, this._m4fUnitProj);
                    this._iUpdateProjectionFlags = akra.bf.setBit(this._iUpdateProjectionFlags, 0 /* k_NewProjectionMatrix */);
                };

                Camera.prototype.recalcMatrices = function () {
                    this._v3fTargetPos.set(this._m4fLocalMatrix.data[__13], this._m4fLocalMatrix.data[__23], this._m4fLocalMatrix.data[__33]);

                    this._v3fTargetPos.negate();

                    // the camera view matrix is the
                    // inverse of the world matrix
                    this._m4fView.set(this.getInverseWorldMatrix());
                    // sky boxes use the inverse
                    // world matrix of the camera (the
                    // camera view matrix) without
                    // any translation information.
                    //this.m4fSkyBox.set(this.m4fView);
                    // this.m4fSkyBox.data[__14] = 0.0;
                    // this.m4fSkyBox.data[__24] = 0.0;
                    // this.m4fSkyBox.data[__34] = 0.0;
                    // this is combined with the unit
                    // space projection matrix to form
                    // the sky box viewing matrix
                    //this.m4fSkyBox.multiply(this.m4fUnitProj, this.m4fSkyBox);
                    // billboard objects use our world matrix
                    // without translation
                    // this.m4fBillboard.set(this.worldMatrix());
                    // this.m4fBillboard.data[__14] = 0.0;
                    // this.m4fBillboard.data[__24] = 0.0;
                    // this.m4fBillboard.data[__34] = 0.0;
                };

                Camera.prototype.update = function () {
                    var isUpdated = _super.prototype.update.call(this);

                    if (this.isProjParamsNew()) {
                        this.recalcProjMatrix();
                    }

                    if (this.isWorldMatrixNew() || akra.bf.testBit(this._iUpdateProjectionFlags, 0 /* k_NewProjectionMatrix */)) {
                        this._pFrustum.extractFromMatrix(this._m4fProj, this._m4fWorldMatrix, this._pSearchRect);

                        // this._m4fRenderStageProj.set(this._m4fProj);
                        if (this.isWorldMatrixNew()) {
                            this.recalcMatrices();
                        }

                        // our projView matrix is the projection
                        //matrix multiplied by the inverse of our world matrix
                        this._m4fProj.multiply(this._m4fView, this._m4fProjView);
                        isUpdated = true;

                        this._iUpdateProjectionFlags = akra.bf.clearBit(this._iUpdateProjectionFlags, 0 /* k_NewProjectionMatrix */);
                    }

                    return isUpdated;
                };

                // applyRenderStageBias(iStage: int): void {
                //    	var fZ_bias = iStage > 1 ? 0.001 : 0.0;
                //     this._m4fRenderStageProj.set(this._m4fProj);
                //     this._m4fRenderStageProjView.set(this._m4fProjView);
                //     this._m4fRenderStageProj[__34] -= fZ_bias;
                //     this._m4fRenderStageProjView[__34] -= fZ_bias;
                //    }
                Camera.prototype._renderScene = function (pViewport) {
                    //update the pixel display ratio
                    // if (this._eCameraType == ECameraTypes.PERSPECTIVE) {
                    // 	mPixelDisplayRatio = (2. * math.tan(this._fFOV * 0.5)) / pViewport.actualHeight;
                    // }
                    // else {
                    // 	mPixelDisplayRatio = (mTop - mBottom) / vp->getActualHeight();
                    // }
                    //notify prerender scene
                    this.preRenderScene.emit();

                    pViewport.update();

                    //notify postrender scene
                    this.postRenderScene.emit();
                };

                Camera.prototype._keepLastViewport = function (pViewport) {
                    this._pLastViewport = pViewport;
                };
                Camera.prototype._getLastViewport = function () {
                    return this._pLastViewport;
                };
                Camera.prototype._getNumRenderedFaces = function () {
                    return 0;
                };
                Camera.prototype._notifyRenderedFaces = function (nFaces) {
                };

                Camera.prototype.isActive = function () {
                    return this._pLastViewport && this._pLastViewport.getCamera() === this;
                };

                Camera.prototype.toString = function (isRecursive, iDepth) {
                    if (typeof isRecursive === "undefined") { isRecursive = false; }
                    if (typeof iDepth === "undefined") { iDepth = 0; }
                    if (!isRecursive) {
                        return "<camera" + (this._sName ? " " + this._sName : "") + ">" + " height: " + this.getWorldPosition().y;
                    }

                    return _super.prototype.toString.call(this, isRecursive, iDepth);
                };

                Camera.prototype.projectPoint = function (v3fPoint, v3fDestination) {
                    if (!akra.isDef(v3fDestination)) {
                        v3fDestination = v3fPoint;
                    }

                    var m4fView = this.getViewMatrix();
                    var m4fProj = this.getProjectionMatrix();

                    var v4fTmp = Vec4.temp(v3fPoint, 1.);

                    v4fTmp = m4fProj.multiplyVec4(m4fView.multiplyVec4(v4fTmp));

                    if (v4fTmp.w <= 0.) {
                        return null;
                    }

                    v3fDestination.set((v4fTmp.scale(1. / v4fTmp.w)).clone("xyz"));

                    var fX = akra.math.abs(v3fDestination.x);
                    var fY = akra.math.abs(v3fDestination.y);
                    var fZ = akra.math.abs(v3fDestination.z);

                    if (fX > 1 || fY > 1 || fZ > 1) {
                        return null;
                    }

                    return v3fDestination;
                };

                Camera.prototype.getDepthRange = function () {
                    var pDepthRange = this._pLastViewport.getDepthRange();

                    var zNear = this._m4fProj.unprojZ(pDepthRange.min);
                    var zFar = this._m4fProj.unprojZ(pDepthRange.max);

                    return { min: zNear, max: zFar };
                };

                Camera.prototype._addDisplayList = function (pScene, pList, index) {
                    this._pDLTechniques[index] = new DLTechnique(pList, this);
                    this._pDLResultStorage[index] = new akra.util.ObjectArray();
                };

                Camera.prototype._removeDisplayList = function (pScene, pList, index) {
                    this._pDLTechniques[index] = null;
                    this._pDLResultStorage[index] = null;
                };

                Camera.isCamera = function (pNode) {
                    return pNode.getType() >= 4 /* CAMERA */ && pNode.getType() <= 5 /* SHADOW_CASTER */;
                };
                return Camera;
            })(akra.scene.SceneNode);
            objects.Camera = Camera;
        })(scene.objects || (scene.objects = {}));
        var objects = scene.objects;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=Camera.js.map
