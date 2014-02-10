/// <reference path="../../idl/ILightPoint.ts" />
/// <reference path="../SceneObject.ts" />
/// <reference path="../../math/math.ts" />
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
            var LightPoint = (function (_super) {
                __extends(LightPoint, _super);
                function LightPoint(pScene, eType) {
                    if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                    _super.call(this, pScene, 37 /* LIGHT */);
                    this._isShadowCaster = false;
                    this._isEnabled = true;
                    this._iMaxShadowResolution = 256;
                    //optimized camera frustum for better shadow casting
                    this._pOptimizedCameraFrustum = new akra.geometry.Frustum();

                    this._eLightType = eType;
                }
                LightPoint.prototype.getParams = function () {
                    // return this._pLightParameters;
                    return null;
                };

                LightPoint.prototype.getLightType = function () {
                    return this._eLightType;
                };

                LightPoint.prototype.getPptimizedCameraFrustum = function () {
                    return this._pOptimizedCameraFrustum;
                };

                LightPoint.prototype.isEnabled = function () {
                    return this._isEnabled;
                };

                LightPoint.prototype.setEnabled = function (bValue) {
                    this._isEnabled = bValue;
                };

                LightPoint.prototype.isShadowCaster = function () {
                    return this._isShadowCaster;
                };

                LightPoint.prototype.setShadowCaster = function (bValue) {
                    this._isShadowCaster = bValue;
                };

                LightPoint.prototype.getLightingDistance = function () {
                    return -1.;
                };

                LightPoint.prototype.setLightingDistance = function (fDistance) {
                };

                LightPoint.prototype.create = function (isShadowCaster, iMaxShadowResolution) {
                    if (typeof isShadowCaster === "undefined") { isShadowCaster = true; }
                    if (typeof iMaxShadowResolution === "undefined") { iMaxShadowResolution = 256; }
                    var isOk = _super.prototype.create.call(this);

                    //есть тени от источника или нет
                    this._isShadowCaster = isShadowCaster;

                    //мкасимальный размер shadow текстуры
                    this._iMaxShadowResolution = iMaxShadowResolution;

                    return isOk;
                };

                LightPoint.prototype._prepareForLighting = function (pCamera) {
                    akra.debug.warn("pure virtual method");
                    return false;
                };

                LightPoint.prototype._calculateShadows = function () {
                    akra.debug.critical("NOT IMPLEMENTED!");
                };

                LightPoint.isLightPoint = function (pNode) {
                    return pNode.getType() === 37 /* LIGHT */;
                };
                return LightPoint;
            })(akra.scene.SceneNode);
            light.LightPoint = LightPoint;
        })(scene.light || (scene.light = {}));
        var light = scene.light;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=LightPoint.js.map
