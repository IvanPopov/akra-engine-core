// AICamera interface
// [write description here...]
/// <reference path="AISceneObject.ts" />
/// <reference path="AIViewport.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AIFrustum.ts" />
/// <reference path="AIObjectArray.ts" />
var AECameraParameters;
(function (AECameraParameters) {
    AECameraParameters[AECameraParameters["CONST_ASPECT"] = 1] = "CONST_ASPECT";
})(AECameraParameters || (AECameraParameters = {}));

var AECameraTypes;
(function (AECameraTypes) {
    AECameraTypes[AECameraTypes["PERSPECTIVE"] = 0] = "PERSPECTIVE";
    AECameraTypes[AECameraTypes["ORTHO"] = 1] = "ORTHO";
    AECameraTypes[AECameraTypes["OFFSET_ORTHO"] = 2] = "OFFSET_ORTHO";
})(AECameraTypes || (AECameraTypes = {}));
//# sourceMappingURL=AICamera.js.map
