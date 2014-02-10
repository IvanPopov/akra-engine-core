/// <reference path="ICollada.ts" />
/// <reference path="IAnimationBase.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="IScene3d.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IMesh.ts" />
var akra;
(function (akra) {
    (function (EModelFormats) {
        EModelFormats[EModelFormats["UNKNOWN"] = 0] = "UNKNOWN";
        EModelFormats[EModelFormats["COLLADA"] = 0x1000] = "COLLADA";
        EModelFormats[EModelFormats["OBJ"] = 0x2000] = "OBJ";
    })(akra.EModelFormats || (akra.EModelFormats = {}));
    var EModelFormats = akra.EModelFormats;
})(akra || (akra = {}));
//# sourceMappingURL=IModel.js.map
