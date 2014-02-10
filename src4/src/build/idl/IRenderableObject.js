/// <reference path="IRenderTechnique.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IViewport.ts" />
var akra;
(function (akra) {
    (function (ERenderableTypes) {
        ERenderableTypes[ERenderableTypes["UNKNOWN"] = 0] = "UNKNOWN";

        ERenderableTypes[ERenderableTypes["MESH_SUBSET"] = 1] = "MESH_SUBSET";
        ERenderableTypes[ERenderableTypes["SCREEN"] = 2] = "SCREEN";
        ERenderableTypes[ERenderableTypes["SPRITE"] = 3] = "SPRITE";
    })(akra.ERenderableTypes || (akra.ERenderableTypes = {}));
    var ERenderableTypes = akra.ERenderableTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IRenderableObject.js.map
