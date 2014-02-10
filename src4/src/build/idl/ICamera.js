/// <reference path="ISceneObject.ts" />
/// <reference path="IViewport.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="IFrustum.ts" />
/// <reference path="IObjectArray.ts" />
var akra;
(function (akra) {
    (function (ECameraParameters) {
        ECameraParameters[ECameraParameters["CONST_ASPECT"] = 1] = "CONST_ASPECT";
    })(akra.ECameraParameters || (akra.ECameraParameters = {}));
    var ECameraParameters = akra.ECameraParameters;

    (function (ECameraTypes) {
        ECameraTypes[ECameraTypes["PERSPECTIVE"] = 0] = "PERSPECTIVE";
        ECameraTypes[ECameraTypes["ORTHO"] = 1] = "ORTHO";
        ECameraTypes[ECameraTypes["OFFSET_ORTHO"] = 2] = "OFFSET_ORTHO";
    })(akra.ECameraTypes || (akra.ECameraTypes = {}));
    var ECameraTypes = akra.ECameraTypes;
})(akra || (akra = {}));
//# sourceMappingURL=ICamera.js.map
