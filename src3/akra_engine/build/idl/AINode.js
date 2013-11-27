// AINode interface
// [write description here...]
/// <reference path="AIEntity.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIMat3.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIQuat4.ts" />
var AENodeInheritance;
(function (AENodeInheritance) {
    AENodeInheritance[AENodeInheritance["NONE"] = 0] = "NONE";

    //inheritance only position
    AENodeInheritance[AENodeInheritance["POSITION"] = 1] = "POSITION";

    //inheritance rotation and scale only
    AENodeInheritance[AENodeInheritance["ROTSCALE"] = 2] = "ROTSCALE";

    //inheritance rotation ans position only
    AENodeInheritance[AENodeInheritance["ROTPOSITION"] = 3] = "ROTPOSITION";

    //inheritance all
    AENodeInheritance[AENodeInheritance["ALL"] = 4] = "ALL";
})(AENodeInheritance || (AENodeInheritance = {}));
;
//# sourceMappingURL=AINode.js.map
