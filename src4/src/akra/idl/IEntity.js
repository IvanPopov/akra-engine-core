/// <reference path="IExplorerFunc.ts" />
/// <reference path="IReferenceCounter.ts" />
var akra;
(function (akra) {
    (function (EEntityTypes) {
        EEntityTypes[EEntityTypes["UNKNOWN"] = 0] = "UNKNOWN";
        EEntityTypes[EEntityTypes["NODE"] = 1] = "NODE";

        EEntityTypes[EEntityTypes["JOINT"] = 2] = "JOINT";

        EEntityTypes[EEntityTypes["SCENE_NODE"] = 3] = "SCENE_NODE";

        EEntityTypes[EEntityTypes["CAMERA"] = 4] = "CAMERA";
        EEntityTypes[EEntityTypes["SHADOW_CASTER"] = 5] = "SHADOW_CASTER";

        EEntityTypes[EEntityTypes["MODEL_ENTRY"] = 6] = "MODEL_ENTRY";

        EEntityTypes[EEntityTypes["LIGHT"] = 37] = "LIGHT";

        EEntityTypes[EEntityTypes["SCENE_OBJECT"] = 64] = "SCENE_OBJECT";

        EEntityTypes[EEntityTypes["MODEL"] = 65] = "MODEL";

        EEntityTypes[EEntityTypes["TERRAIN"] = 66] = "TERRAIN";
        EEntityTypes[EEntityTypes["TERRAIN_ROAM"] = 67] = "TERRAIN_ROAM";
        EEntityTypes[EEntityTypes["TERRAIN_SECTION"] = 68] = "TERRAIN_SECTION";
        EEntityTypes[EEntityTypes["TERRAIN_SECTION_ROAM"] = 69] = "TERRAIN_SECTION_ROAM";

        EEntityTypes[EEntityTypes["TEXT3D"] = 70] = "TEXT3D";
        EEntityTypes[EEntityTypes["SPRITE"] = 71] = "SPRITE";
        EEntityTypes[EEntityTypes["EMITTER"] = 72] = "EMITTER";

        EEntityTypes[EEntityTypes["UI_NODE"] = 100] = "UI_NODE";

        // UI_HTMLNODE,
        // UI_DNDNODE,
        // UI_COMPONENT,
        // UI_BUTTON,
        // UI_LABEL,
        // UI_TREE,
        EEntityTypes[EEntityTypes["OBJECTS_LIMIT"] = 128] = "OBJECTS_LIMIT";
    })(akra.EEntityTypes || (akra.EEntityTypes = {}));
    var EEntityTypes = akra.EEntityTypes;
})(akra || (akra = {}));
