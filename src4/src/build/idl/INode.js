/// <reference path="IEntity.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="IMat3.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IQuat4.ts" />
var akra;
(function (akra) {
    (function (ENodeInheritance) {
        ENodeInheritance[ENodeInheritance["NONE"] = 0] = "NONE";

        //inheritance only position
        ENodeInheritance[ENodeInheritance["POSITION"] = 1] = "POSITION";

        //inheritance rotation and scale only
        ENodeInheritance[ENodeInheritance["ROTSCALE"] = 2] = "ROTSCALE";

        //inheritance rotation ans position only
        ENodeInheritance[ENodeInheritance["ROTPOSITION"] = 3] = "ROTPOSITION";

        //inheritance all
        ENodeInheritance[ENodeInheritance["ALL"] = 4] = "ALL";
    })(akra.ENodeInheritance || (akra.ENodeInheritance = {}));
    var ENodeInheritance = akra.ENodeInheritance;
    ;
})(akra || (akra = {}));
//# sourceMappingURL=INode.js.map
