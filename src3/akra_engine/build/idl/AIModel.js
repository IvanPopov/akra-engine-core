// AIModel interface
// [write description here...]
/// <reference path="AICollada.ts" />
/// <reference path="AIAnimationBase.ts" />
/// <reference path="AISceneNode.ts" />
/// <reference path="AIScene3d.ts" />
/// <reference path="AISkeleton.ts" />
/// <reference path="AIMesh.ts" />
var AEModelFormats;
(function (AEModelFormats) {
    AEModelFormats[AEModelFormats["UNKNOWN"] = 0] = "UNKNOWN";
    AEModelFormats[AEModelFormats["COLLADA"] = 0x1000] = "COLLADA";
    AEModelFormats[AEModelFormats["OBJ"] = 0x2000] = "OBJ";
})(AEModelFormats || (AEModelFormats = {}));
//# sourceMappingURL=AIModel.js.map
