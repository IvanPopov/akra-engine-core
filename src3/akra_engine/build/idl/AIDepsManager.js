// AIDepsManager interface
// [write description here...]
/// <reference path="AIEventProvider.ts" />
var AEDependenceStatuses;
(function (AEDependenceStatuses) {
    AEDependenceStatuses[AEDependenceStatuses["NOT_LOADED"] = 0] = "NOT_LOADED";
    AEDependenceStatuses[AEDependenceStatuses["LOADING"] = 1] = "LOADING";
    AEDependenceStatuses[AEDependenceStatuses["CHECKING"] = 2] = "CHECKING";
    AEDependenceStatuses[AEDependenceStatuses["UNPACKING"] = 3] = "UNPACKING";
    AEDependenceStatuses[AEDependenceStatuses["LOADED"] = 4] = "LOADED";
})(AEDependenceStatuses || (AEDependenceStatuses = {}));
//# sourceMappingURL=AIDepsManager.js.map
