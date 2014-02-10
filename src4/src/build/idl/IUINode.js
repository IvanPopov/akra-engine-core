/// <reference path="IEntity.ts" />
/// <reference path="IPoint.ts" />
/// <reference path="IOffset.ts" />
/// <reference path="IUILayout.ts" />
/// <reference path="IUI.ts" />
var akra;
(function (akra) {
    (function (EUINodeTypes) {
        EUINodeTypes[EUINodeTypes["UNKNOWN"] = 0] = "UNKNOWN";
        EUINodeTypes[EUINodeTypes["HTML"] = 1] = "HTML";
        EUINodeTypes[EUINodeTypes["DND"] = 2] = "DND";

        EUINodeTypes[EUINodeTypes["LAYOUT"] = 3] = "LAYOUT";

        EUINodeTypes[EUINodeTypes["COMPONENT"] = 4] = "COMPONENT";
    })(akra.EUINodeTypes || (akra.EUINodeTypes = {}));
    var EUINodeTypes = akra.EUINodeTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IUINode.js.map
