/// <reference path="INode.ts" />
/// <reference path="IAnimationController.ts" />
var akra;
(function (akra) {
    (function (ESceneNodeFlags) {
        ESceneNodeFlags[ESceneNodeFlags["FROZEN_PARENT"] = 0] = "FROZEN_PARENT";
        ESceneNodeFlags[ESceneNodeFlags["FROZEN_SELF"] = 1] = "FROZEN_SELF";
        ESceneNodeFlags[ESceneNodeFlags["HIDDEN_PARENT"] = 2] = "HIDDEN_PARENT";
        ESceneNodeFlags[ESceneNodeFlags["HIDDEN_SELF"] = 3] = "HIDDEN_SELF";
    })(akra.ESceneNodeFlags || (akra.ESceneNodeFlags = {}));
    var ESceneNodeFlags = akra.ESceneNodeFlags;
})(akra || (akra = {}));
//# sourceMappingURL=ISceneNode.js.map
