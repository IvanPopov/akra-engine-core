/// <reference path="../idl/IAnimationBase.ts" />
/// <reference path="../idl/IAnimationController.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../guid.ts" />
    /// <reference path="Base.ts" />
    /// <reference path="Container.ts" />
    /// <reference path="Blend.ts" />
    (function (animation) {
        var PlaySignal = (function (_super) {
            __extends(PlaySignal, _super);
            function PlaySignal(pController) {
                _super.call(this, pController, 1 /* BROADCAST */);
            }
            PlaySignal.prototype.emit = function (pAnimation) {
                var pController = this.getSender();
                var pAnimationNext = pController.findAnimation(arguments[0]);
                var pAnimationPrev = pController.getActive();
                var fRealTime = pController.getEngine().getTime();

                if (pAnimationNext && pAnimationNext !== pAnimationPrev) {
                    if (pAnimationPrev) {
                        pAnimationPrev.stop(fRealTime);
                    }

                    pAnimationNext.play(fRealTime);
                    pController._setActiveAnimation(pAnimationNext);

                    _super.prototype.emit.call(this, pAnimationNext, fRealTime);
                }
            };
            return PlaySignal;
        })(akra.Signal);

        var Controller = (function () {
            function Controller(pEngine, sName, iOptions) {
                if (typeof sName === "undefined") { sName = null; }
                if (typeof iOptions === "undefined") { iOptions = 0; }
                this.guid = akra.guid();
                this.name = null;
                this._pAnimations = [];
                this._iOptions = 0;
                this._pActiveAnimation = null;
                this._pTarget = null;
                this.setupSignals();

                this._pEngine = pEngine;
                this.setOptions(iOptions);
                this.name = sName;
            }
            Controller.prototype.getTotalAnimations = function () {
                return this._pAnimations.length;
            };

            Controller.prototype.getActive = function () {
                return this._pActiveAnimation;
            };

            Controller.prototype.getTarget = function () {
                return this._pTarget;
            };

            Controller.prototype.setupSignals = function () {
                this.animationAdded = this.animationAdded || new akra.Signal(this);
                this.play = this.play || new PlaySignal(this);
            };

            Controller.prototype.getEngine = function () {
                return this._pEngine;
            };

            Controller.prototype.setOptions = function (iOptions) {
            };

            Controller.prototype.addAnimation = function (pAnimation) {
                if (this.findAnimation(pAnimation.getName())) {
                    akra.logger.warn("Animation with name <" + pAnimation.getName() + "> already exists in this controller");
                    return false;
                }

                //LOG('animation controller :: add animation >> ', pAnimation.name);
                this._pAnimations.push(pAnimation);
                this._pActiveAnimation = pAnimation;
                if (!akra.isNull(this.getTarget())) {
                    pAnimation.attach(this.getTarget());
                } else {
                    //TODO: detach animation
                }

                this.animationAdded.emit(pAnimation);
            };

            Controller.prototype.removeAnimation = function (pAnimationArg) {
                var pAnimation = this.findAnimation(pAnimationArg);
                var pAnimations = this._pAnimations;

                for (var i = 0; i < pAnimations.length; ++i) {
                    if (pAnimations[i] === pAnimation) {
                        pAnimations.splice(i, 1);
                        akra.logger.log("animation controller :: remove animation >> ", pAnimation.getName());
                        return true;
                    }
                }

                return false;
            };

            Controller.prototype.findAnimation = function (pAnimation) {
                var pAnimations = this._pAnimations;
                var iAnimation;
                var sAnimation;

                if (akra.isString(arguments[0])) {
                    sAnimation = arguments[0];

                    for (var i = 0; i < pAnimations.length; ++i) {
                        if (pAnimations[i].getName() === sAnimation) {
                            return pAnimations[i];
                        }
                    }

                    return null;
                }

                if (typeof arguments[0] === 'number') {
                    iAnimation = arguments[0];
                    return pAnimations[iAnimation] || null;
                }

                return arguments[0];
            };

            Controller.prototype.getAnimation = function (iAnim) {
                return this._pAnimations[iAnim];
            };

            Controller.prototype.setAnimation = function (iAnimation, pAnimation) {
                akra.debug.assert(iAnimation < this._pAnimations.length, 'invalid animation slot');

                this._pAnimations[iAnimation] = pAnimation;
            };

            Controller.prototype.attach = function (pTarget) {
                var pAnimations = this._pAnimations;

                for (var i = 0; i < pAnimations.length; ++i) {
                    if (!pAnimations[i].isAttached() || this.getTarget() !== pTarget) {
                        pAnimations[i].attach(pTarget);
                    }
                }

                if (this.getTarget()) {
                    this.getTarget().getScene().postUpdate.disconnect(this, this.update);
                    //this.disconnect(this.target.scene, SIGNAL(postUpdate), SLOT(update));
                }

                this._pTarget = pTarget;
                this.getTarget().getScene().postUpdate.connect(this, this.update);
                //this.connect(this.target.scene, SIGNAL(postUpdate), SLOT(update));
            };

            Controller.prototype.stop = function () {
                if (this._pActiveAnimation) {
                    this._pActiveAnimation.stop(this._pEngine.getTime());
                }

                this._pActiveAnimation = null;
            };

            Controller.prototype.update = function () {
                var pAnim = this._pActiveAnimation;
                if (!akra.isNull(pAnim)) {
                    if (!pAnim.apply(this._pEngine.getTime())) {
                        // this._pActiveAnimation = null;
                        // pAnim.stop(this._pEngine.time);
                    }
                }
            };

            Controller.prototype._setActiveAnimation = function (pAnim) {
                this._pActiveAnimation = pAnim;
            };

            Controller.prototype.toString = function (bFullInfo) {
                if (typeof bFullInfo === "undefined") { bFullInfo = false; }
                if (akra.config.DEBUG) {
                    var s = "\n";
                    s += "ANIMATION CONTROLLER (total: " + this.getTotalAnimations() + " animations)\n";
                    s += "-----------------------------------------------------\n";

                    for (var i = 0; i < this.getTotalAnimations(); ++i) {
                        s += this.getAnimation(i).toString();
                    }

                    return s;
                }

                return null;
            };

            Controller.PlaySignal = PlaySignal;
            return Controller;
        })();

        function createController(pEngine, sName, iOptions) {
            return new Controller(pEngine, sName, iOptions);
        }
        animation.createController = createController;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Controller.js.map
