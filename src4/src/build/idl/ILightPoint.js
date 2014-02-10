/// <reference path="ISceneNode.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IFrustum.ts" />
var akra;
(function (akra) {
    (function (ELightTypes) {
        ELightTypes[ELightTypes["UNKNOWN"] = 0] = "UNKNOWN";
        ELightTypes[ELightTypes["PROJECT"] = 1] = "PROJECT";
        ELightTypes[ELightTypes["OMNI"] = 2] = "OMNI";
        ELightTypes[ELightTypes["SUN"] = 3] = "SUN";
    })(akra.ELightTypes || (akra.ELightTypes = {}));
    var ELightTypes = akra.ELightTypes;
})(akra || (akra = {}));
//# sourceMappingURL=ILightPoint.js.map
