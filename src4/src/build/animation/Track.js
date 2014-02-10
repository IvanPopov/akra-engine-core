/// <reference path="../idl/IAnimationTrack.ts" />
/// <reference path="../idl/IScene.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IMat4.ts" />
/// <reference path="../idl/ISkeleton.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="Parameter.ts" />
    (function (animation) {
        var Track = (function (_super) {
            __extends(Track, _super);
            function Track(sTarget) {
                if (typeof sTarget === "undefined") { sTarget = null; }
                _super.call(this);
                this._sTarget = null;
                this._pTarget = null;
                this._sTarget = sTarget;
            }
            Track.prototype.getTarget = function () {
                return this._pTarget;
            };

            Track.prototype.getTargetName = function () {
                return this._sTarget;
            };

            Track.prototype.setTargetName = function (sValue) {
                this._sTarget = sValue;
            };

            Track.prototype.keyFrame = function (fTime, pMatrix) {
                var pFrame;

                if (arguments.length > 1) {
                    pFrame = new akra.animation.PositionFrame(fTime, pMatrix);
                } else {
                    pFrame = arguments[0];
                }

                return _super.prototype.keyFrame.call(this, pFrame);
            };

            Track.prototype.bind = function (pJoint, pSkeleton) {
                var pNode = null, pRootNode;

                var sJoint;

                switch (arguments.length) {
                    case 2:
                        //bind by pair <String joint, Skeleton skeleton>
                        sJoint = pJoint;

                        this._sTarget = sJoint;
                        pNode = pSkeleton.findJoint(sJoint);
                        break;
                    default:
                        //bind by <Skeleton skeleton>
                        if (!akra.isDef(arguments[0].getType())) {
                            if (this._sTarget == null) {
                                return false;
                            }

                            pSkeleton = arguments[0];
                            pNode = pSkeleton.findJoint(this._sTarget);
                        } else {
                            pRootNode = arguments[0];
                            pNode = pRootNode.findEntity(this.getTargetName());
                        }
                }

                this._pTarget = pNode;

                return akra.isDefAndNotNull(pNode);
            };

            Track.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = "target: " + this.getTargetName() + ", from: " + this.getFirst() + "sec. , duration: " + this.getDuration() + " sec. , frames: " + this.getTotalFrames();
                    return s;
                }

                return null;
            };
            return Track;
        })(akra.animation.Parameter);

        function createTrack(sTarget) {
            if (typeof sTarget === "undefined") { sTarget = null; }
            return new Track(sTarget);
        }
        animation.createTrack = createTrack;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Track.js.map
