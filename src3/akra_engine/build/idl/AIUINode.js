// AIUINode interface
// [write description here...]
/// <reference path="AIEntity.ts" />
/// <reference path="AIPoint.ts" />
/// <reference path="AIOffset.ts" />
/// <reference path="AIUILayout.ts" />
/// <reference path="AIUI.ts" />
var AEUINodeTypes;
(function (AEUINodeTypes) {
    AEUINodeTypes[AEUINodeTypes["UNKNOWN"] = 0] = "UNKNOWN";
    AEUINodeTypes[AEUINodeTypes["HTML"] = 1] = "HTML";
    AEUINodeTypes[AEUINodeTypes["DND"] = 2] = "DND";

    AEUINodeTypes[AEUINodeTypes["LAYOUT"] = 3] = "LAYOUT";

    AEUINodeTypes[AEUINodeTypes["COMPONENT"] = 4] = "COMPONENT";
})(AEUINodeTypes || (AEUINodeTypes = {}));
//# sourceMappingURL=AIUINode.js.map
