/**
 * @file
 * @brief functions and classes to OcTree
 * @author sss
 *
 * Classes reload:
 * Camera
 */

/**
 * Camera class reprents camera object
 * @ctor
 * @extends SceneNode
 * Constructor
 */
function Camera () {
    Camera.superclass.constructor.apply(this, arguments);

    Enum([
             k_FOV = 0,
             k_ORTHO,
             k_OFFSET_ORTHO
         ], e_Type, a.Camera);
    /**
     * Type. Form enum e_Type
     * @type Int
     */
    this.iType = a.Camera.k_FOV;
    /**
     * View matrix
     * @type Float32Array
     */
    this.m4fView = new Mat4;
    /**
     * internal, un-biased projection matrix
     * @type Float32Array
     */
    this.m4fProj = new Mat4;
    /**
     * Matrix
     * @type Float32Array
     */
    this.m4fUnitProj = new Mat4;
    /**
     * internal, un-biased view+projection matrix
     * @type Float32Array
     */
    this.m4fProjView = new Mat4;
    /**
     * Special matrix for billboarding effects
     * @type Float32Array
     */
    this.m4fBillboard = new Mat4;
    /**
     * Special matrix for sky box effects
     * @type Float32Array
     */
    this.m4fSkyBox = new Mat4;
    /**
     * Biased for use during current render stage
     * @type Float32Array
     */
    this.m4fRenderStageProj = new Mat4;
    /**
     * Biased for use during current render stage
     * @type Float32Array
     */
    this.m4fRenderStageProjView = new Mat4;
    /**
     * Search rect for scene culling
     * @type Rect3d
     */
    this.pSearchRect = new a.Rect3d();
    /**
     * Position
     * @type Float32Array
     */
    this.v3fTargetPos = new Vec3;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fFOV = Math.PI / 5;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fAspect = 640 / 480;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fNearPlane = 0.1;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fFarPlane = 500.0;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fWidth = 0.0;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fHeight = 0.0;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fMinX = 0.0;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fMaxX = 0.0;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fMinY = 0.0;
    /**
     * Attributes for projection matrix
     * @type Float
     */
    this.fMaxY = 0.0;
    /**
     * List of points
     * @type Array<Float32Array>(8)
     */
    this.pv3fFarPlanePoints = new Array(8);
    for (var i = 0; i < 8; ++i) {
        this.pv3fFarPlanePoints[i] = new Vec3;
    }
    /**
     * Frustum
     * @type Frustum
     */
    this.pFrustum = new a.Frustum();

    this._v3fEyePosition = new Vec3();
}
;

EXTENDS(Camera, a.SceneNode);
/**
 * Create camera
 * @treturn Boolean
 */
Camera.prototype.create = function () {
    var result = Camera.superclass.create.apply(this, arguments);

    if (result) {
        this.v3fTargetPos.set(this._m4fLocalMatrix._13, this._m4fLocalMatrix._23,
                 this._m4fLocalMatrix._33);
        this.v3fTargetPos.negate();

        this.setProjParams(this.fFOV, this.fAspect,
                           this.fNearPlane, this.fFarPlane);

        this.recalcMatrices();
    }
    return result;
};
/**
 * Set params
 * @tparam Float fFOV
 * @tparam Float fAspect
 * @tparam Float fNearPlane
 * @tparam Float fFarPlane
 */
Camera.prototype.setProjParams = function (fFOV, fAspect, fNearPlane, fFarPlane) {
    // Set attributes for the projection matrix
    this.fFOV = fFOV;
    this.fAspect = fAspect;
    this.fNearPlane = fNearPlane;
    this.fFarPlane = fFarPlane;
    this.iType = a.Camera.k_FOV;

    // create the regular projection matrix
    Mat4.matrixPerspectiveFovRH(fFOV, fAspect, fNearPlane, fFarPlane, this.m4fProj);

    // create a unit-space matrix 
    // for sky box geometry.
    // this ensures that the 
    // near and far plane enclose 
    // the unit space around the camera
    Mat4.matrixPerspectiveFovRH(fFOV, fAspect, 0.01, 2.0, this.m4fUnitProj);
};
/**
 * Set params
 * @tparam Float fWidth
 * @tparam Float fHeight
 * @tparam Float fNearPlane
 * @tparam Float fFarPlane
 */
Camera.prototype.setOrthoParams = function (fWidth, fHeight, fNearPlane, fFarPlane) {
    this.fWidth = fWidth;
    this.fHeight = fHeight;
    this.fNearPlane = fNearPlane;
    this.fFarPlane = fFarPlane;
    this.iType = a.Camera.k_ORTHO;

    // create the regular projection matrix
    Mat4.matrixOrthoRH(fWidth, fHeight, fNearPlane, fFarPlane, this.m4fProj);

    // create a unit-space matrix 
    // for sky box geometry.
    // this ensures that the 
    // near and far plane enclose 
    // the unit space around the camera
    Mat4.matrixOrthoRH(fWidth, fHeight, 0.01, 2.0, this.m4fUnitProj);
};
/**
 * Set params
 * @tparam Float fMinX
 * @tparam Float fMaxX
 * @tparam Float fMinY
 * @tparam Float fMaxY
 * @tparam Float fNearPlane
 * @tparam Float fFarPlane
 */
Camera.prototype.setOffsetOrthoParams = function (fMinX, fMaxX, fMinY, fMaxY, fNearPlane, fFarPlane) {
    this.fMinX = fMinX;
    this.fMaxX = fMaxX;
    this.fMinY = fMinY;
    this.fMaxY = fMaxY;
    this.fNearPlane = fNearPlane;
    this.fFarPlane = fFarPlane;
    this.iType = a.Camera.k_OFFSET_ORTHO;

    // create the regular projection matrix
    Mat4.orthogonalProjection(fMinX, fMaxX, fMinY, fMaxY,
                                fNearPlane, fFarPlane, this.m4fProj);

    // create a unit-space matrix 
    // for sky box geometry.
    // this ensures that the 
    // near and far plane enclose 
    // the unit space around the camera
    Mat4.orthogonalProjection(fMinX, fMaxX, fMinY, fMaxY,
                                0.01, 2.0, this.m4fUnitProj);
};
/**
 * Recalc matrices
 */
Camera.prototype.recalcMatrices = function () {

    this.v3fTargetPos.set(
        this._m4fLocalMatrix.pData._13, 
        this._m4fLocalMatrix.pData._23,
        this._m4fLocalMatrix.pData._33);

    this.v3fTargetPos.negate();

    // the camera view matrix is the
    // inverse of the world matrix
    this.m4fView.set(this.inverseWorldMatrix());
    // sky boxes use the inverse 
    // world matrix of the camera (the
    // camera view matrix) without 
    // any translation information.
    this.m4fSkyBox.set(this.m4fView);
    this.m4fSkyBox.pData._14 = 0.0;
    this.m4fSkyBox.pData._24 = 0.0;
    this.m4fSkyBox.pData._34 = 0.0;

    // this is combined with the unit
    // space projection matrix to form
    // the sky box viewing matrix
    this.m4fUnitProj.multiply(this.m4fSkyBox, this.m4fSkyBox);

    // billboard objects use our world matrix
    // without translation
    this.m4fBillboard.set(this.worldMatrix());
    this.m4fBillboard.pData._14 = 0.0;
    this.m4fBillboard.pData._24 = 0.0;
    this.m4fBillboard.pData._34 = 0.0;

    // our view proj matrix is the inverse of our world matrix
    // multiplied by the projection matrix
    this.m4fProj.multiply(this.m4fView, this.m4fProjView);

    var m4fInvProj = Mat4();
    var m4fInvCamera = Mat4();
    
    this.m4fProj.inverse(m4fInvProj);
    this.worldMatrix().multiply(m4fInvProj, m4fInvCamera);

    var v3fWorldPos = Vec3(this.worldPosition());

    var p0 = Vec3(-1.0, 1.0, 1.0);
    var p1 = Vec3(-1.0, -1.0, 1.0);
    var p2 = Vec3(1.0, -1.0, 1.0);
    var p3 = Vec3(1.0, 1.0, 1.0);
    var p4 = Vec3(-1.0, 1.0, 0.0);
    var p5 = Vec3(-1.0, -1.0, 0.0);
    var p6 = Vec3(1.0, -1.0, 0.0);
    var p7 = Vec3(1.0, 1.0, 0.0);

    p0.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[0]);
    p1.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[1]);
    p2.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[2]);
    p3.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[3]);
    p4.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[4]);
    p5.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[5]);
    p6.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[6]);
    p7.vec3TransformCoord(m4fInvCamera, this.pv3fFarPlanePoints[7]);

    // build a box around our frustum
    this.pSearchRect.set(v3fWorldPos.pData.X, v3fWorldPos.pData.X,
                         v3fWorldPos.pData.Y, v3fWorldPos.pData.Y,
                         v3fWorldPos.pData.Z, v3fWorldPos.pData.Z);

    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[0]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[1]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[2]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[3]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[4]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[5]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[6]);
    this.pSearchRect.unionPoint(this.pv3fFarPlanePoints[7]);
    //TODO: FIX THIS
    //this.pSearchRect.expand(25);

//    this.pFrustum.extractFromMatrix(this.m4fViewProj);
    //this.pFrustum.extractFromMatrixGL(this.m4fViewProj);
    
    this._extractFrustumVertices();
    this._calculateFrustumPlanes();

    this.m4fRenderStageProj.set(this.m4fProj);
    this.m4fRenderStageProjView.set(this.m4fProjView);

    //update eye position

    var v4fTemp = Vec4(this._v3fWorldPosition,1.);
    this._v3fEyePosition.set(this.m4fView.multiply(v4fTemp,Vec4()));
};
/**
 * Update
 */
Camera.prototype.update = function () {
    Camera.superclass.update.apply(this, arguments);

    if (this.isWorldMatrixNew()) {
        this.recalcMatrices();
    }
};
/**
 * Apply???
 * @tparam Int iStage
 */
Camera.prototype.applyRenderStageBias = function (iStage) {
    var fZ_bias = iStage > 1 ? 0.001 : 0.0;

    this.m4fRenderStageProj.set(this.m4fProj);
    this.m4fRenderStageProjView.set(this.m4fProjView);

    this.m4fRenderStageProj._34 -= fZ_bias;
    this.m4fRenderStageProjView._34 -= fZ_bias;
};
/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.viewMatrix = function () {
    INLINE();
    return this.m4fView;
};
/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.projectionMatrix = function () {
    INLINE();
    return this.m4fRenderStageProj;
};
/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.projViewMatrix = function () {
    INLINE();
    return this.m4fRenderStageProjView;
};

/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.billboardMatrix = function () {
    INLINE();
    return this.m4fBillboard;
};
/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.skyBoxMatrix = function () {
    INLINE();
    return this.m4fSkyBox;
};
/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.internalProjectionMatrix = function () {
    INLINE();
    return this.m4fProj;
};
/**
 * Getter
 * @treturn Float32Array Matrix
 */
Camera.prototype.internalViewProjMatrix = function () {
    INLINE();
    return this.m4fProjView;
};
/**
 * Getter
 * @treturn Float32Array Vector
 */
Camera.prototype.targetPos = function () {
    INLINE();
    return this.v3fTargetPos;
};
/**
 * Getter
 * @treturn Float
 */
Camera.prototype.fov = function () {
    INLINE();
    return this.fFOV;
};
/**
 * Getter
 * @treturn Float
 */
Camera.prototype.aspect = function () {
    INLINE();
    return this.fAspect;
};
/**
 * Getter
 * @treturn Float
 */
Camera.prototype.nearPlane = function () {
    INLINE();
    return this.fNearPlane;
};
/**
 * Getter
 * @treturn Float
 */
Camera.prototype.farPlane = function () {
    INLINE();
    return this.fFarPlane;
};
/**
 * Getter
 * @treturn Float
 */
Camera.prototype.viewDistance = function () {
    INLINE();
    return (this.fFarPlane - this.fNearPlane);
};
/**
 * Getter
 * @treturn Rect3d
 */
Camera.prototype.searchRect = function () {
    INLINE();
    return this.pSearchRect;
};
/**
 * Getter
 * @treturn Array<Float32Array>[8]
 */
Camera.prototype.farPlanePoints = function () {
    INLINE();
    return this.pv3fFarPlanePoints;
};
/**
 * Getter
 * @treturn Frustum
 */
Camera.prototype.frustum = function () {
    INLINE();
    return this.pFrustum;
};
Camera.prototype.eyePosition = function () {
    return this._v3fEyePosition;
}
Ifdef (__DEBUG);

Camera.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        return '<camera' + (this._sName? ' ' + this._sName: '') + '>';
    }

    return SceneNode.prototype.toString.call(this, isRecursive, iDepth);
}
 
Endif ();

Camera.prototype.lookAt = function() {
    var v3fFrom, v3fCenter, v3fUp;

    if (arguments.length < 3) {
        v3fFrom = this.worldPosition();
        v3fCenter = arguments[0];
        v3fUp = arguments[1];
    }
    else {
        v3fFrom = arguments[0];
        v3fCenter = arguments[1];
        v3fUp = arguments[2];
    }

    v3fUp = v3fUp || Vec3(0, 1, 0);

    var v3fParentPos = this.parent().worldPosition().pData;
    var m4fTemp = Mat4.lookAt(v3fFrom, v3fCenter, v3fUp, Mat4()).inverse();
    var pData = m4fTemp.pData;

    switch(this._iInheritance){
        case a.Scene.k_inheritAll : 
            this._pParent.inverseWorldMatrix().mult(m4fTemp,m4fTemp);
            m4fTemp.toQuat4(this._qRotation);
            this.setPosition(pData._14, pData._24, pData._34);    
            break;
        case a.Scene.k_inheritRotScaleOnly : 
            var m3fTemp = m4fTemp.toMat3();
            m3fTemp = this._pParent.inverseWorldMatrix().toMat3().mult(m3fTemp,Mat3());
            m3fTemp.toQuat4(this._qRotation);
            this.setPosition(pData._14, pData._24, pData._34);
            break;
        default :
            m4fTemp.toQuat4(this._qRotation);
            this.setPosition(pData._14 - v3fParentPos.X, pData._24 - v3fParentPos.Y,
                                pData._34 - v3fParentPos.Z);
    }
};


function unproj(m4fProj,v4fScreen,v4fDestination){
    if(!v4fDestination){
        v4fDestination = new Vec4();
    }

    var pData1 = m4fProj.pData;
    var pData2 = v4fScreen.pData;
    var pDataDestination = v4fDestination.pData;
  
    var z = -pData1._34/(pData1._33 + pData2.Z);
    var y = (-pData2.Y * z - pData1._23*z)/pData1._22;
    var x = (-pData2.X * z - pData1._13*z)/pData1._11;
  
    pDataDestination.X = x;
    pDataDestination.Y = y;
    pDataDestination.Z = z;
    pDataDestination.W = 1;

    return v4fDestination;
};

Camera.prototype._extractFrustumVertices = function() {
    'use strict';

    var m4fProj = this.m4fProj;

    this._v4fLeftBottomNear = new Vec4();
    unproj(m4fProj,Vec4(-1,-1,-1,1),this._v4fLeftBottomNear);

    this._v4fRightBottomNear = new Vec4();
    unproj(m4fProj,Vec4(1,-1,-1,1),this._v4fRightBottomNear);

    this._v4fLeftTopNear = new Vec4();
    unproj(m4fProj,Vec4(-1,1,-1,1),this._v4fLeftTopNear);

    this._v4fRightTopNear = new Vec4();
    unproj(m4fProj,Vec4(1,1,-1,1),this._v4fRightTopNear);

    this._v4fLeftBottomFar = new Vec4();
    unproj(m4fProj,Vec4(-1,-1,1,1),this._v4fLeftBottomFar);

    this._v4fRightBottomFar = new Vec4();
    unproj(m4fProj,Vec4(1,-1,1,1),this._v4fRightBottomFar);

    this._v4fLeftTopFar = new Vec4();
    unproj(m4fProj,Vec4(-1,1,1,1),this._v4fLeftTopFar);

    this._v4fRightTopFar = new Vec4();
    unproj(m4fProj,Vec4(1,1,1,1),this._v4fRightTopFar);
};

Camera.prototype._calculateFrustumPlanes = function() {
    'use strict';

    //нормали всех плоскостей frustum-а смотрят наружу

    var m4fCameraWorld = this._m4fWorldMatrix;
    var pFrustum = this.pFrustum;

    var v4fLeftBottomNearData = m4fCameraWorld.multiply(this._v4fLeftBottomNear,Vec4()).pData;
    var v4fRightBottomNearData = m4fCameraWorld.multiply(this._v4fRightBottomNear,Vec4()).pData;
    var v4fLeftTopNearData = m4fCameraWorld.multiply(this._v4fLeftTopNear,Vec4()).pData;
    var v4fRightTopNearData = m4fCameraWorld.multiply(this._v4fRightTopNear,Vec4()).pData;

    var v4fLeftBottomFarData = m4fCameraWorld.multiply(this._v4fLeftBottomFar,Vec4()).pData;
    var v4fRightBottomFarData = m4fCameraWorld.multiply(this._v4fRightBottomFar,Vec4()).pData;
    var v4fLeftTopFarData = m4fCameraWorld.multiply(this._v4fLeftTopFar,Vec4()).pData;
    var v4fRightTopFarData = m4fCameraWorld.multiply(this._v4fRightTopFar,Vec4()).pData;

    var x1,y1,z1; //первый вектор
    var x2,y2,z2; //второй вектор
    var x3,y3,z3; //векторное произведение
    var fLength,fInvLength; //длина скалярного произведения

    var pDirectionLTNLBN = Vec3().pData;//LTNLBN - left top near - left bottom near; //from - to
    var pDirectionLTNRTN = Vec3().pData;//LTNRTN - left top near - right top near;
    var pDirectionLTNLTF = Vec3().pData;//LTNLTF - left top near - left top far;
    var pDirectionRBFRTF = Vec3().pData;//RBFRTF - right bottom far - right top far;
    var pDirectionRBFRBN = Vec3().pData;//RBFRBN - right bottom far - right bottom near;
    var pDirectionRBFLBF = Vec3().pData;//RBFLBF - right bottom far - left bottom far;

    pDirectionLTNLBN.X = v4fLeftBottomNearData.X - v4fLeftTopNearData.X;
    pDirectionLTNLBN.Y = v4fLeftBottomNearData.Y - v4fLeftTopNearData.Y;
    pDirectionLTNLBN.Z = v4fLeftBottomNearData.Z - v4fLeftTopNearData.Z;

    pDirectionLTNRTN.X = v4fRightTopNearData.X - v4fLeftTopNearData.X;
    pDirectionLTNRTN.Y = v4fRightTopNearData.Y - v4fLeftTopNearData.Y;
    pDirectionLTNRTN.Z = v4fRightTopNearData.Z - v4fLeftTopNearData.Z;

    pDirectionLTNLTF.X = v4fLeftTopFarData.X - v4fLeftTopNearData.X;
    pDirectionLTNLTF.Y = v4fLeftTopFarData.Y - v4fLeftTopNearData.Y;
    pDirectionLTNLTF.Z = v4fLeftTopFarData.Z - v4fLeftTopNearData.Z;

    pDirectionRBFRTF.X = v4fRightTopFarData.X - v4fRightBottomFarData.X;
    pDirectionRBFRTF.Y = v4fRightTopFarData.Y - v4fRightBottomFarData.Y;
    pDirectionRBFRTF.Z = v4fRightTopFarData.Z - v4fRightBottomFarData.Z;

    pDirectionRBFRBN.X = v4fRightBottomNearData.X - v4fRightBottomFarData.X;
    pDirectionRBFRBN.Y = v4fRightBottomNearData.Y - v4fRightBottomFarData.Y;
    pDirectionRBFRBN.Z = v4fRightBottomNearData.Z - v4fRightBottomFarData.Z;

    pDirectionRBFLBF.X = v4fLeftBottomFarData.X - v4fRightBottomFarData.X;
    pDirectionRBFLBF.Y = v4fLeftBottomFarData.Y - v4fRightBottomFarData.Y;
    pDirectionRBFLBF.Z = v4fLeftBottomFarData.Z - v4fRightBottomFarData.Z;

    /////////////////////////////////////////

    var testPoint1 = v4fLeftTopNearData;
    var testPoint2 = v4fRightBottomFarData;

    /////////////////////////////////////////

    //near plane
    x1 = pDirectionLTNLBN.X;
    y1 = pDirectionLTNLBN.Y;
    z1 = pDirectionLTNLBN.Z;

    x2 = pDirectionLTNRTN.X;
    y2 = pDirectionLTNRTN.Y;
    z2 = pDirectionLTNRTN.Z;

    //normal
    x3 = y1*z2 - z1*y2;
    y3 = z1*x2 - x1*z2;
    z3 = x1*y2 - y1*x2;

    fLength = Math.sqrt(x3*x3 + y3*y3 + z3*z3);
    fInvLength = 1/fLength;

    x3 *= fInvLength;
    y3 *= fInvLength;
    z3 *= fInvLength;

    var v3fNormalNearData = pFrustum.nearPlane.v3fNormal.pData;
    v3fNormalNearData.X = x3;
    v3fNormalNearData.Y = y3;
    v3fNormalNearData.Z = z3;
    //constant
    pFrustum.nearPlane.fDistance = -(testPoint1.X*x3 + testPoint1.Y*y3 + testPoint1.Z*z3);

    /////////////////////////////////////////

    //left plane
    x1 = pDirectionLTNLTF.X;
    y1 = pDirectionLTNLTF.Y;
    z1 = pDirectionLTNLTF.Z;

    x2 = pDirectionLTNLBN.X;
    y2 = pDirectionLTNLBN.Y;
    z2 = pDirectionLTNLBN.Z;

    //normal
    x3 = y1*z2 - z1*y2;
    y3 = z1*x2 - x1*z2;
    z3 = x1*y2 - y1*x2;

    fLength = Math.sqrt(x3*x3 + y3*y3 + z3*z3);
    fInvLength = 1/fLength;

    x3 *= fInvLength;
    y3 *= fInvLength;
    z3 *= fInvLength;

    var v3fNormalLeftData = pFrustum.leftPlane.v3fNormal.pData;
    v3fNormalLeftData.X = x3;
    v3fNormalLeftData.Y = y3;
    v3fNormalLeftData.Z = z3;
    //constant
    pFrustum.leftPlane.fDistance = -(testPoint1.X*x3 + testPoint1.Y*y3 + testPoint1.Z*z3);

    /////////////////////////////////////////

    //top plane
    x1 = pDirectionLTNRTN.X;
    y1 = pDirectionLTNRTN.Y;
    z1 = pDirectionLTNRTN.Z;

    x2 = pDirectionLTNLTF.X;
    y2 = pDirectionLTNLTF.Y;
    z2 = pDirectionLTNLTF.Z;

    //normal
    x3 = y1*z2 - z1*y2;
    y3 = z1*x2 - x1*z2;
    z3 = x1*y2 - y1*x2;

    fLength = Math.sqrt(x3*x3 + y3*y3 + z3*z3);
    fInvLength = 1/fLength;

    x3 *= fInvLength;
    y3 *= fInvLength;
    z3 *= fInvLength;

    var v3fNormalTopData = pFrustum.topPlane.v3fNormal.pData;
    v3fNormalTopData.X = x3;
    v3fNormalTopData.Y = y3;
    v3fNormalTopData.Z = z3;
    //constant
    pFrustum.topPlane.fDistance = -(testPoint1.X*x3 + testPoint1.Y*y3 + testPoint1.Z*z3);

    /////////////////////////////////////////
    
    //right plane
    x1 = pDirectionRBFRTF.X;
    y1 = pDirectionRBFRTF.Y;
    z1 = pDirectionRBFRTF.Z;

    x2 = pDirectionRBFRBN.X;
    y2 = pDirectionRBFRBN.Y;
    z2 = pDirectionRBFRBN.Z;

    //normal
    x3 = y1*z2 - z1*y2;
    y3 = z1*x2 - x1*z2;
    z3 = x1*y2 - y1*x2;

    fLength = Math.sqrt(x3*x3 + y3*y3 + z3*z3);
    fInvLength = 1/fLength;

    x3 *= fInvLength;
    y3 *= fInvLength;
    z3 *= fInvLength;

    var v3fNormalRightData = pFrustum.rightPlane.v3fNormal.pData;
    v3fNormalRightData.X = x3;
    v3fNormalRightData.Y = y3;
    v3fNormalRightData.Z = z3;
    //constant
    pFrustum.rightPlane.fDistance = -(testPoint2.X*x3 + testPoint2.Y*y3 + testPoint2.Z*z3);

    /////////////////////////////////////////
    
    //bottom plane
    x1 = pDirectionRBFRBN.X;
    y1 = pDirectionRBFRBN.Y;
    z1 = pDirectionRBFRBN.Z;

    x2 = pDirectionRBFLBF.X;
    y2 = pDirectionRBFLBF.Y;
    z2 = pDirectionRBFLBF.Z;

    //normal
    x3 = y1*z2 - z1*y2;
    y3 = z1*x2 - x1*z2;
    z3 = x1*y2 - y1*x2;

    fLength = Math.sqrt(x3*x3 + y3*y3 + z3*z3);
    fInvLength = 1/fLength;

    x3 *= fInvLength;
    y3 *= fInvLength;
    z3 *= fInvLength;

    var v3fNormalBottomData = pFrustum.bottomPlane.v3fNormal.pData;
    v3fNormalBottomData.X = x3;
    v3fNormalBottomData.Y = y3;
    v3fNormalBottomData.Z = z3;
    //constant
    pFrustum.bottomPlane.fDistance = -(testPoint2.X*x3 + testPoint2.Y*y3 + testPoint2.Z*z3);

    /////////////////////////////////////////
    
    //far plane
    x1 = pDirectionRBFLBF.X;
    y1 = pDirectionRBFLBF.Y;
    z1 = pDirectionRBFLBF.Z;

    x2 = pDirectionRBFRTF.X;
    y2 = pDirectionRBFRTF.Y;
    z2 = pDirectionRBFRTF.Z;

    //normal
    x3 = y1*z2 - z1*y2;
    y3 = z1*x2 - x1*z2;
    z3 = x1*y2 - y1*x2;

    fLength = Math.sqrt(x3*x3 + y3*y3 + z3*z3);
    fInvLength = 1/fLength;

    x3 *= fInvLength;
    y3 *= fInvLength;
    z3 *= fInvLength;

    var v3fNormalFarData = pFrustum.farPlane.v3fNormal.pData;
    v3fNormalFarData.X = x3;
    v3fNormalFarData.Y = y3;
    v3fNormalFarData.Z = z3;
    //constant
    pFrustum.farPlane.fDistance = -(testPoint2.X*x3 + testPoint2.Y*y3 + testPoint2.Z*z3);
};

a.Camera = Camera;