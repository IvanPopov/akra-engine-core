/// <reference path="IVec3.ts" />
//SLERP <==> slerp for rotation, MATRIX_LINEAR - linear between matrices
var akra;
(function (akra) {
    (function (EAnimationInterpolations) {
        EAnimationInterpolations[EAnimationInterpolations["LINEAR"] = 0] = "LINEAR";
        EAnimationInterpolations[EAnimationInterpolations["SPHERICAL"] = 1] = "SPHERICAL";
    })(akra.EAnimationInterpolations || (akra.EAnimationInterpolations = {}));
    var EAnimationInterpolations = akra.EAnimationInterpolations;
})(akra || (akra = {}));
//# sourceMappingURL=IFrame.js.map
