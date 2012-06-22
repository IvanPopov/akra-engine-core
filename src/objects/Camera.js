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
    this.m4fView = Mat4.create();
    /**
     * internal, un-biased projection matrix
     * @type Float32Array
     */
    this.m4fProj = Mat4.create();
    /**
     * Matrix
     * @type Float32Array
     */
    this.m4fUnitProj = Mat4.create();
    /**
     * internal, un-biased view+projection matrix
     * @type Float32Array
     */
    this.m4fViewProj = Mat4.create();
    /**
     * Special matrix for billboarding effects
     * @type Float32Array
     */
    this.m4fBillboard = Mat4.create();
    /**
     * Special matrix for sky box effects
     * @type Float32Array
     */
    this.m4fSkyBox = Mat4.create();
    /**
     * Biased for use during current render stage
     * @type Float32Array
     */
    this.m4fRenderStageProj = Mat4.create();
    /**
     * Biased for use during current render stage
     * @type Float32Array
     */
    this.m4fRenderStageViewProj = Mat4.create();
    /**
     * Search rect for scene culling
     * @type Rect3d
     */
    this.pSearchRect = new a.Rect3d();
    /**
     * Position
     * @type Float32Array
     */
    this.v3fTargetPos = Vec3.create();
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
        this.pv3fFarPlanePoints[i] = Vec3.create();
    }
    /**
     * Frustum
     * @type Frustum
     */
    this.pFrustum = new a.Frustum();
}
;
a.extend(Camera, SceneNode);
/**
 * Create camera
 * @treturn Boolean
 */
Camera.prototype.create = function () {
    var result = Camera.superclass.create.apply(this, arguments);

    if (result) {
        Vec3.set(this._m4fLocalMatrix._13, this._m4fLocalMatrix._23,
                 this._m4fLocalMatrix._33, this.v3fTargetPos);
        Vec3.negate(this.v3fTargetPos);

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
    Mat4.matrixOrthoOffCenterRH(fMinX, fMaxX, fMinY, fMaxY,
                                fNearPlane, fFarPlane, this.m4fProj);

    // create a unit-space matrix 
    // for sky box geometry.
    // this ensures that the 
    // near and far plane enclose 
    // the unit space around the camera
    Mat4.matrixOrthoOffCenterRH(fMinX, fMaxX, fMinY, fMaxY,
                                0.01, 2.0, this.m4fUnitProj);
};
/**
 * Recalc matrices
 */
Camera.prototype.recalcMatrices = function () {

    Vec3.set(this._m4fLocalMatrix._13, this._m4fLocalMatrix._23,
             this._m4fLocalMatrix._33, this.v3fTargetPos);
    Vec3.negate(this.v3fTargetPos);

    // the camera view matrix is the
    // inverse of the world matrix
    Mat4.set(this.inverseWorldMatrix(), this.m4fView);

    // sky boxes use the inverse 
    // world matrix of the camera (the
    // camera view matrix) without 
    // any translation information.
    Mat4.set(this.m4fView, this.m4fSkyBox);
    this.m4fSkyBox._14 = 0.0;
    this.m4fSkyBox._24 = 0.0;
    this.m4fSkyBox._34 = 0.0;

    // this is combined with the unit
    // space projection matrix to form
    // the sky box viewing matrix
    Mat4.multiply(this.m4fSkyBox, this.m4fUnitProj, this.m4fSkyBox);

    // billboard objects use our world matrix
    // without translation
    Mat4.set(this.worldMatrix(), this.m4fBillboard);
    this.m4fBillboard._14 = 0.0;
    this.m4fBillboard._24 = 0.0;
    this.m4fBillboard._34 = 0.0;

    // our view proj matrix is the inverse of our world matrix
    // multiplied by the projection matrix
    Mat4.multiply(this.m4fProj, this.m4fView, this.m4fViewProj);

    var m4fInvProj = Mat4.create();
    var m4fInvCamera = Mat4.create();
    Mat4.inverse(this.m4fProj, m4fInvProj);
    Mat4.multiply(this.worldMatrix(), m4fInvProj, m4fInvCamera);

    var v3fWorldPos = Vec3.create(this.worldPosition());

    var p0 = new Vector3;
    var p1 = new Vector3;
    var p2 = new Vector3;
    var p3 = new Vector3;
    var p4 = new Vector3;
    var p5 = new Vector3;
    var p6 = new Vector3;
    var p7 = new Vector3;

    Vec3.set(-1.0, 1.0, 1.0, p0);
    Vec3.set(-1.0, -1.0, 1.0, p1);
    Vec3.set(1.0, -1.0, 1.0, p2);
    Vec3.set(1.0, 1.0, 1.0, p3);
    Vec3.set(-1.0, 1.0, 0.0, p4);
    Vec3.set(-1.0, -1.0, 0.0, p5);
    Vec3.set(1.0, -1.0, 0.0, p6);
    Vec3.set(1.0, 1.0, 0.0, p7);

    Vec3.vec3TransformCoord(p0, m4fInvCamera, this.pv3fFarPlanePoints[0]);
    Vec3.vec3TransformCoord(p1, m4fInvCamera, this.pv3fFarPlanePoints[1]);
    Vec3.vec3TransformCoord(p2, m4fInvCamera, this.pv3fFarPlanePoints[2]);
    Vec3.vec3TransformCoord(p3, m4fInvCamera, this.pv3fFarPlanePoints[3]);
    Vec3.vec3TransformCoord(p4, m4fInvCamera, this.pv3fFarPlanePoints[4]);
    Vec3.vec3TransformCoord(p5, m4fInvCamera, this.pv3fFarPlanePoints[5]);
    Vec3.vec3TransformCoord(p6, m4fInvCamera, this.pv3fFarPlanePoints[6]);
    Vec3.vec3TransformCoord(p7, m4fInvCamera, this.pv3fFarPlanePoints[7]);

    // build a box around our frustum
    this.pSearchRect.set(v3fWorldPos.X, v3fWorldPos.X,
                         v3fWorldPos.Y, v3fWorldPos.Y,
                         v3fWorldPos.Z, v3fWorldPos.Z);

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
    this.pFrustum.extractFromMatrixGL(this.m4fViewProj);

    Mat4.set(this.m4fProj, this.m4fRenderStageProj);
    Mat4.set(this.m4fViewProj, this.m4fRenderStageViewProj);
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

    Mat4.set(this.m4fProj, this.m4fRenderStageProj);
    Mat4.set(this.m4fViewProj, this.m4fRenderStageViewProj);

    this.m4fRenderStageProj._34 -= fZ_bias;
    this.m4fRenderStageViewProj._34 -= fZ_bias;
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
Camera.prototype.viewProjMatrix = function () {
    INLINE();
    return this.m4fRenderStageViewProj;
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
    return this.m4fViewProj;
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
a.Camera = Camera;