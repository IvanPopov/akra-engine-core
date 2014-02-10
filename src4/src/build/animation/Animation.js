/// <reference path="../idl/IAnimation.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IPositionFrame.ts" />
/// <reference path="../idl/IAnimationTrack.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../debug.ts" />
    /// <reference path="Base.ts" />
    (function (animation) {
        var Animation = (function (_super) {
            __extends(Animation, _super);
            function Animation(sName) {
                _super.call(this, 0 /* ANIMATION */, sName);
                this._pTracks = [];
            }
            Animation.prototype.getTotalTracks = function () {
                return this._pTracks.length;
            };

            Animation.prototype.push = function (pTrack) {
                this._pTracks.push(pTrack);
                this._fDuration = akra.math.max(this._fDuration, pTrack.getDuration());
                this._fFirst = akra.math.min(this.getFirst(), pTrack.getFirst());
                this.addTarget(pTrack.getTargetName());
            };

            Animation.prototype.attach = function (pTarget) {
                var pPointer;
                var pTracks = this._pTracks;

                for (var i = 0; i < pTracks.length; ++i) {
                    if (!pTracks[i].bind(pTarget)) {
                        akra.logger.log("cannot bind animation track [", i, "] to joint <", pTracks[i].getTarget(), ">");
                    } else {
                        pPointer = this.setTarget(pTracks[i].getTargetName(), pTracks[i].getTarget());
                        pPointer.track = pTracks[i];
                    }
                }
            };

            Animation.prototype.getTracks = function () {
                return this._pTracks;
            };

            Animation.prototype.getTrack = function (i) {
                return this._pTracks[i];
            };

            Animation.prototype.frame = function (sName, fTime) {
                var pPointer = this.getTargetByName(sName);

                if (!pPointer || !pPointer.track) {
                    return null;
                }

                return pPointer.track.frame(akra.math.clamp(fTime, 0, this._fDuration));
            };

            Animation.prototype.extend = function (pAnimation) {
                var pTracks = pAnimation.getTracks();

                for (var i = 0; i < pTracks.length; ++i) {
                    if (!this.getTarget(pTracks[i].getTargetName())) {
                        this.push(pTracks[i]);
                    }
                }
            };

            Animation.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = _super.prototype.toString.call(this);
                    s += "total tracks : " + this.getTotalTracks() + "\n";

                    for (var i = 0; i < this.getTotalTracks(); ++i) {
                        s += "\t" + i + ". " + this.getTrack(i) + "\n";
                    }

                    return s;
                }

                return null;
            };

            Animation.isAnimation = function (pAnimation) {
                return pAnimation.getType() === 0 /* ANIMATION */;
            };
            return Animation;
        })(akra.animation.Base);
        animation.Animation = Animation;

        function createAnimation(sName) {
            return new Animation(sName);
        }
        animation.createAnimation = createAnimation;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Animation.js.map
