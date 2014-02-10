/// <reference path="../../idl/IShadowCaster.ts" />
/// <reference path="../objects/Camera.ts" />
/// <reference path="../../util/ObjectArray.ts" />
/// <reference path="../../math/Mat4.ts" />
/// <reference path="../../geometry/Rect3d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        (function (light) {
            var Mat4 = akra.math.Mat4;

            var Vec2 = akra.math.Vec2;
            var Vec3 = akra.math.Vec3;
            var Vec4 = akra.math.Vec4;

            var __11 = akra.math.__11;
            var __12 = akra.math.__12;
            var __13 = akra.math.__13;
            var __14 = akra.math.__14;
            var __21 = akra.math.__21;
            var __22 = akra.math.__22;
            var __23 = akra.math.__23;
            var __24 = akra.math.__24;
            var __31 = akra.math.__31;
            var __32 = akra.math.__32;
            var __33 = akra.math.__33;
            var __34 = akra.math.__34;
            var __41 = akra.math.__41;
            var __42 = akra.math.__42;
            var __43 = akra.math.__43;
            var __44 = akra.math.__44;

            var ShadowCaster = (function (_super) {
                __extends(ShadowCaster, _super);
                function ShadowCaster(pLightPoint, iFace) {
                    if (typeof iFace === "undefined") { iFace = 0 /* POSITIVE_X */; }
                    _super.call(this, pLightPoint.getScene(), 5 /* SHADOW_CASTER */);
                    this._pLightPoint = null;
                    this._iFace = 0;
                    this._pAffectedObjects = new akra.util.ObjectArray();
                    this._m4fOptimizedProj = new Mat4();
                    this._isShadowCasted = false;

                    this._pLightPoint = pLightPoint;
                    this._iFace = iFace;
                }
                ShadowCaster.prototype.getLightPoint = function () {
                    return this._pLightPoint;
                };

                ShadowCaster.prototype.getFace = function () {
                    return this._iFace;
                };

                ShadowCaster.prototype.getAffectedObjects = function () {
                    return this._pAffectedObjects;
                };

                ShadowCaster.prototype.getOptimizedProjection = function () {
                    return this._m4fOptimizedProj;
                };

                ShadowCaster.prototype.isShadowCasted = function () {
                    return this._isShadowCasted;
                };

                ShadowCaster.prototype.setShadowCasted = function (isShadowCasted) {
                    this._isShadowCasted = isShadowCasted;
                };

                ShadowCaster.prototype._optimizeProjectionMatrix = function (pEffectiveCameraFrustum) {
                    if (this._pAffectedObjects.getLength() == 0) {
                        this._m4fOptimizedProj.set(this.getProjectionMatrix());
                        return;
                    }

                    var m4fView = this.getViewMatrix();
                    var m4fProj = this.getProjectionMatrix();
                    var m4fProjData = m4fProj.data;

                    var pBox = akra.geometry.Rect3d.temp();

                    var pAffectedObjects = this._pAffectedObjects;

                    var fX0, fX1, fY0, fY1, fZ0, fZ1;
                    var fX, fY, fZ, fW;

                    var fX_Left, fY_Bottom;
                    var fX_Right, fY_Top;
                    var fZ_Near, fZ_Far;

                    //первый бокс должен быть, либо построен по первому элементу, что приводит к усложнению функции
                    //либо записан таким образом (то есть минимально (максимально) возможные значения), тогда можно просто все делать в цикле
                    var fXRes_Left = 1., fXRes_Right = -1, fYRes_Bottom = 1, fYRes_Top = -1, fZRes_Near = 1, fZRes_Far = -1;

                    var fTmp;

                    for (var i = 0; i < pAffectedObjects.getLength(); i++) {
                        var pObject = pAffectedObjects.value(i);

                        if (!pObject.getShadow()) {
                            continue;
                        }

                        pBox.set(pObject.getWorldBounds());
                        pBox.transform(m4fView);

                        fX0 = pBox.x0;
                        fX1 = pBox.x1;
                        fY0 = pBox.y0;
                        fY1 = pBox.y1;
                        fZ0 = pBox.z0;
                        fZ1 = pBox.z1;

                        //z - отрицательное => ближняя к камере грань fZ1, а fZ0 - дальняя
                        //left bottom near
                        fX = m4fProjData[__11] * fX0 + m4fProjData[__12] * fY0 + m4fProjData[__13] * fZ1 + m4fProjData[__14];
                        fY = m4fProjData[__21] * fX0 + m4fProjData[__22] * fY0 + m4fProjData[__23] * fZ1 + m4fProjData[__24];
                        fZ = m4fProjData[__31] * fX0 + m4fProjData[__32] * fY0 + m4fProjData[__33] * fZ1 + m4fProjData[__34];
                        fW = m4fProjData[__41] * fX0 + m4fProjData[__42] * fY0 + m4fProjData[__43] * fZ1 + m4fProjData[__44];

                        if (fW <= 0) {
                            //обходим особые случаи
                            fX = -1;
                            fY = -1;
                            fZ = -1;
                            fW = 1;
                        }

                        fX_Left = fX / fW;
                        fY_Bottom = fY / fW;

                        ////////////////////////////////
                        //z near
                        fZ_Near = fZ / fW;

                        ////////////////////////////////
                        //left bottom far
                        fX = m4fProjData[__11] * fX0 + m4fProjData[__12] * fY0 + m4fProjData[__13] * fZ0 + m4fProjData[__14];
                        fY = m4fProjData[__21] * fX0 + m4fProjData[__22] * fY0 + m4fProjData[__23] * fZ0 + m4fProjData[__24];
                        fZ = m4fProjData[__31] * fX0 + m4fProjData[__32] * fY0 + m4fProjData[__33] * fZ0 + m4fProjData[__34];
                        fW = m4fProjData[__41] * fX0 + m4fProjData[__42] * fY0 + m4fProjData[__43] * fZ0 + m4fProjData[__44];

                        //в этой части особенностей нет, так как w всегда больше нуля, иначе объект будет вне frustum-а
                        fTmp = fX / fW;
                        fX_Left = (fTmp < fX_Left) ? fTmp : fX_Left;

                        fTmp = fY / fW;
                        fY_Bottom = (fTmp < fY_Bottom) ? fTmp : fY_Bottom;

                        ////////////////////////////////
                        //z far
                        fZ_Far = fZ / fW;

                        ////////////////////////////////
                        //right top near
                        fX = m4fProjData[__11] * fX1 + m4fProjData[__12] * fY1 + m4fProjData[__13] * fZ1 + m4fProjData[__14];
                        fY = m4fProjData[__21] * fX1 + m4fProjData[__22] * fY1 + m4fProjData[__23] * fZ1 + m4fProjData[__24];
                        fW = m4fProjData[__41] * fX1 + m4fProjData[__42] * fY1 + m4fProjData[__43] * fZ1 + m4fProjData[__44];

                        if (fW <= 0) {
                            //обходим особые случаи
                            fX = 1;
                            fY = 1;
                            fW = 1;
                        }

                        fX_Right = fX / fW;
                        fY_Top = fY / fW;

                        //right top far
                        fX = m4fProjData[__11] * fX1 + m4fProjData[__12] * fY1 + m4fProjData[__13] * fZ0 + m4fProjData[__14];
                        fY = m4fProjData[__21] * fX1 + m4fProjData[__22] * fY1 + m4fProjData[__23] * fZ0 + m4fProjData[__24];
                        fW = m4fProjData[__41] * fX1 + m4fProjData[__42] * fY1 + m4fProjData[__43] * fZ0 + m4fProjData[__44];

                        //в этой части особенностей нет, так как w всегда больше нуля, иначе объект будет вне frustum-а
                        fTmp = fX / fW;
                        fX_Right = (fTmp > fX_Right) ? fTmp : fX_Right;

                        fTmp = fY / fW;
                        fY_Top = (fTmp > fY_Top) ? fTmp : fY_Top;

                        ////////////////////////////////
                        fXRes_Left = (fX_Left < fXRes_Left) ? fX_Left : fXRes_Left;
                        fXRes_Right = (fX_Right > fXRes_Right) ? fX_Right : fXRes_Right;

                        fYRes_Bottom = (fY_Bottom < fYRes_Bottom) ? fY_Bottom : fYRes_Bottom;
                        fYRes_Top = (fY_Top > fYRes_Top) ? fY_Top : fYRes_Top;

                        fZRes_Near = (fZ_Near < fZRes_Near) ? fZ_Near : fZRes_Near;
                        fZRes_Far = (fZ_Far > fZRes_Far) ? fZ_Far : fZRes_Far;
                    }

                    //test with camera frustum
                    var pCameraBox = this._getBoxForCameraFrustum(pEffectiveCameraFrustum, new akra.geometry.Rect2d());

                    var fCameraMinX = akra.math.max(pCameraBox.x0, -1);
                    var fCameraMaxX = akra.math.min(pCameraBox.x1, 1);

                    var fCameraMinY = akra.math.max(pCameraBox.y0, -1);
                    var fCameraMaxY = akra.math.min(pCameraBox.y1, 1);

                    fXRes_Left = akra.math.max((fXRes_Left < -1 || fXRes_Left == 1) ? -1 : fXRes_Left, fCameraMinX);
                    fXRes_Right = akra.math.min((fXRes_Right > 1 || fXRes_Right == -1) ? 1 : fXRes_Right, fCameraMaxX);

                    fYRes_Bottom = akra.math.max((fYRes_Bottom < -1 || fYRes_Bottom == 1) ? -1 : fYRes_Bottom, fCameraMinY);
                    fYRes_Top = akra.math.min((fYRes_Top > 1 || fYRes_Top == -1) ? 1 : fYRes_Top, fCameraMaxY);

                    fZRes_Near = (fZRes_Near < -1 || fZRes_Near == 1) ? -1 : fZRes_Near;
                    fZRes_Far = (fZRes_Far > 1 || fZRes_Far == -1) ? 1 : fZRes_Far;

                    //optimized parameters
                    var v4fTmp1 = m4fProj.unproj(Vec3.temp(fXRes_Left, fYRes_Bottom, fZRes_Near), Vec4.temp());
                    var v4fTmp2 = m4fProj.unproj(Vec3.temp(fXRes_Right, fYRes_Top, fZRes_Near), Vec4.temp());

                    //////////////////////////
                    fX_Left = v4fTmp1.x;
                    fX_Right = v4fTmp2.x;
                    fY_Bottom = v4fTmp1.y;
                    fY_Top = v4fTmp2.y;
                    fZ_Near = v4fTmp1.z;
                    fZ_Far = m4fProj.unprojZ(fZRes_Far);

                    if (m4fProj.isOrthogonalProjection()) {
                        //ortho-projection
                        Mat4.orthogonalProjectionAsymmetric(fX_Left, fX_Right, fY_Bottom, fY_Top, -fZ_Near, -fZ_Far, this._m4fOptimizedProj);
                    } else {
                        //frustum
                        Mat4.frustum(fX_Left, fX_Right, fY_Bottom, fY_Top, -fZ_Near, -fZ_Far, this._m4fOptimizedProj);
                    }
                };

                ShadowCaster.prototype._getBoxForCameraFrustum = function (pEffectiveCameraFrustum, pDestination) {
                    if (!akra.isDef(pDestination)) {
                        pDestination = new akra.geometry.Rect2d();
                    }
                    var m4fProjView = this.getProjViewMatrix();
                    var pFrusutumVertices = pEffectiveCameraFrustum.getFrustumVertices();

                    var v4fTmp = Vec4.temp();
                    var v2fTmp = Vec2.temp();

                    for (var i = 0; i < 8; i++) {
                        v4fTmp.set(pFrusutumVertices[i], 1.);

                        m4fProjView.multiplyVec4(v4fTmp);

                        v2fTmp.set(v4fTmp.x, v4fTmp.y).scale(akra.math.abs(1. / v4fTmp.w));

                        if (i == 0) {
                            pDestination.set(v2fTmp, v2fTmp);
                        } else {
                            pDestination.unionPoint(v2fTmp);
                        }
                    }

                    return pDestination;
                };

                ShadowCaster.isShadowCaster = function (pEntity) {
                    return !akra.isNull(pEntity) && pEntity.getType() === 5 /* SHADOW_CASTER */;
                };
                return ShadowCaster;
            })(akra.scene.objects.Camera);
            light.ShadowCaster = ShadowCaster;
        })(scene.light || (scene.light = {}));
        var light = scene.light;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=ShadowCaster.js.map
