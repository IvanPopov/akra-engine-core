// AIRenderableObject interface
// [write description here...]
/// <reference path="AIRenderTechnique.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIRenderData.ts" />
/// <reference path="AIViewport.ts" />
var AERenderableTypes;
(function (AERenderableTypes) {
    AERenderableTypes[AERenderableTypes["UNKNOWN"] = 0] = "UNKNOWN";

    AERenderableTypes[AERenderableTypes["MESH_SUBSET"] = 1] = "MESH_SUBSET";
    AERenderableTypes[AERenderableTypes["SCREEN"] = 2] = "SCREEN";
    AERenderableTypes[AERenderableTypes["SPRITE"] = 3] = "SPRITE";
})(AERenderableTypes || (AERenderableTypes = {}));
//# sourceMappingURL=AIRenderableObject.js.map
