/// <reference path="IMap.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="IJoint.ts" />
/// <reference path="IPositionFrame.ts" />
/// <reference path="IAnimationTrack.ts" />
var akra;
(function (akra) {
    (function (EAnimationTypes) {
        EAnimationTypes[EAnimationTypes["ANIMATION"] = 0] = "ANIMATION";
        EAnimationTypes[EAnimationTypes["LIST"] = 1] = "LIST";
        EAnimationTypes[EAnimationTypes["CLIP"] = 2] = "CLIP";
        EAnimationTypes[EAnimationTypes["CONTAINER"] = 3] = "CONTAINER";
        EAnimationTypes[EAnimationTypes["BLEND"] = 4] = "BLEND";
    })(akra.EAnimationTypes || (akra.EAnimationTypes = {}));
    var EAnimationTypes = akra.EAnimationTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IAnimationBase.js.map
