var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="Base.ts" />
    (function (animation) {
        var Clip = (function (_super) {
            __extends(Clip, _super);
            function Clip() {
                _super.apply(this, arguments);
            }
            Clip.isClip = function (pAnimation) {
                return pAnimation.type === akra.EAnimationTypes.CLIP;
            };
            return Clip;
        })(animation.Base);
        animation.Clip = Clip;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
