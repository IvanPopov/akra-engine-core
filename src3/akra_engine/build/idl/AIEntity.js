// AIEntity interface
// [write description here...]
/// <reference path="AIExplorerFunc.ts" />
/// <reference path="AIReferenceCounter.ts" />
var AEEntityTypes;
(function (AEEntityTypes) {
    AEEntityTypes[AEEntityTypes["UNKNOWN"] = 0] = "UNKNOWN";
    AEEntityTypes[AEEntityTypes["NODE"] = 1] = "NODE";

    AEEntityTypes[AEEntityTypes["JOINT"] = 2] = "JOINT";

    AEEntityTypes[AEEntityTypes["SCENE_NODE"] = 3] = "SCENE_NODE";

    AEEntityTypes[AEEntityTypes["CAMERA"] = 4] = "CAMERA";
    AEEntityTypes[AEEntityTypes["SHADOW_CASTER"] = 5] = "SHADOW_CASTER";

    AEEntityTypes[AEEntityTypes["MODEL_ENTRY"] = 6] = "MODEL_ENTRY";

    AEEntityTypes[AEEntityTypes["LIGHT"] = 37] = "LIGHT";

    AEEntityTypes[AEEntityTypes["SCENE_OBJECT"] = 64] = "SCENE_OBJECT";

    AEEntityTypes[AEEntityTypes["MODEL"] = 65] = "MODEL";

    AEEntityTypes[AEEntityTypes["TERRAIN"] = 66] = "TERRAIN";
    AEEntityTypes[AEEntityTypes["TERRAIN_ROAM"] = 67] = "TERRAIN_ROAM";
    AEEntityTypes[AEEntityTypes["TERRAIN_SECTION"] = 68] = "TERRAIN_SECTION";
    AEEntityTypes[AEEntityTypes["TERRAIN_SECTION_ROAM"] = 69] = "TERRAIN_SECTION_ROAM";

    AEEntityTypes[AEEntityTypes["TEXT3D"] = 70] = "TEXT3D";
    AEEntityTypes[AEEntityTypes["SPRITE"] = 71] = "SPRITE";
    AEEntityTypes[AEEntityTypes["EMITTER"] = 72] = "EMITTER";

    AEEntityTypes[AEEntityTypes["UI_NODE"] = 100] = "UI_NODE";

    // UI_HTMLNODE,
    // UI_DNDNODE,
    // UI_COMPONENT,
    // UI_BUTTON,
    // UI_LABEL,
    // UI_TREE,
    AEEntityTypes[AEEntityTypes["OBJECTS_LIMIT"] = 128] = "OBJECTS_LIMIT";
})(AEEntityTypes || (AEEntityTypes = {}));
//# sourceMappingURL=AIEntity.js.map
