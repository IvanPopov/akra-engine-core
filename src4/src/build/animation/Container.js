/// <reference path="../idl/IAnimationContainer.ts" />
/// <reference path="../idl/IPositionFrame.ts" />
/// <reference path="../idl/IAnimationBase.ts" />
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
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container(pAnimation, sName) {
                _super.call(this, 3 /* CONTAINER */, sName);
                this._bEnable = true;
                this._fStartTime = 0;
                this._fSpeed = 1.0;
                this._bLoop = false;
                this._pAnimation = null;
                this._bReverse = false;
                //Время учитывающее циклы и прочее.
                this._fTrueTime = 0;
                //реальное время на сцене
                this._fRealTime = 0;
                //время с учетом ускорений
                this._fTime = 0;
                this._bPause = false;
                //определена ли анимация до первого и после последнего кадров
                this._bLeftInfinity = true;
                this._bRightInfinity = true;

                if (pAnimation) {
                    this.setAnimation(pAnimation);
                }
            }
            Container.prototype.setupSignals = function () {
                this.durationUpdated = this.durationUpdated || new akra.Signal(this);
                this.enterFrame = this.enterFrame || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            Container.prototype.getAnimationName = function () {
                return this._pAnimation.getName();
            };

            Container.prototype.getAnimationTime = function () {
                return this._fTrueTime;
            };

            Container.prototype.getTime = function () {
                return this._fTime;
            };

            Container.prototype.setStartTime = function (fRealTime) {
                this._fStartTime = fRealTime;
            };

            Container.prototype.getStartTime = function () {
                return this._fStartTime;
            };

            Container.prototype.setSpeed = function (fSpeed) {
                this._fSpeed = fSpeed;
                this.setDuration(this._pAnimation.getDuration() / fSpeed);

                this.durationUpdated.emit(this.getDuration());
            };

            Container.prototype.getSpeed = function () {
                return this._fSpeed;
            };

            Container.prototype.play = function (fRealTime) {
                this._fRealTime = fRealTime;
                this._fTime = 0;

                this.played.emit(this._fTime);
            };

            Container.prototype.stop = function () {
                this.stoped.emit(this._fTime);
            };

            Container.prototype.attach = function (pTarget) {
                if (!akra.isNull(this._pAnimation)) {
                    this._pAnimation.attach(pTarget);
                    this.grab(this._pAnimation, true);
                }
            };

            Container.prototype.setAnimation = function (pAnimation) {
                akra.debug.assert(!this._pAnimation, "anim. already exists");

                this._pAnimation = pAnimation;
                this.setSpeed(this.getSpeed());

                if (Container.isContainer(pAnimation) || akra.animation.Blend.isBlend(pAnimation)) {
                    pAnimation.durationUpdated.connect(this, this._onDurationUpdate);
                }

                this.grab(pAnimation);
            };

            Container.prototype._onDurationUpdate = function (pAnimation, fDuration) {
                this.setSpeed(this.getSpeed());
            };

            Container.prototype.getAnimation = function () {
                return this._pAnimation;
            };

            Container.prototype.enable = function () {
                this._bEnable = true;
            };

            Container.prototype.disable = function () {
                this._bEnable = false;
            };

            Container.prototype.isEnabled = function () {
                return this._bEnable;
            };

            Container.prototype.leftInfinity = function (bValue) {
                this._bLeftInfinity = bValue;
            };

            Container.prototype.inLeftInfinity = function () {
                return this._bLeftInfinity;
            };

            Container.prototype.inRightInfinity = function () {
                return this._bRightInfinity;
            };

            Container.prototype.rightInfinity = function (bValue) {
                this._bRightInfinity = bValue;
            };

            Container.prototype.useLoop = function (bValue) {
                this._bLoop = bValue;
            };

            Container.prototype.inLoop = function () {
                return this._bLoop;
            };

            Container.prototype.reverse = function (bValue) {
                this._bReverse = bValue;
            };

            Container.prototype.isReversed = function () {
                return this._bReverse;
            };

            Container.prototype.pause = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                this._fRealTime = -1;
                this._bPause = bValue;
            };

            Container.prototype.rewind = function (fRealTime) {
                // console.log("rewind > ", fRealTime);
                this._fTrueTime = 0;
                this._fTime = fRealTime;
            };

            Container.prototype.isPaused = function () {
                return this._bPause;
            };

            Container.prototype.calcTime = function (fRealTime) {
                if (this._bPause) {
                    return;
                }

                //if loop switched and prev. fRealTime less than new fRealTime
                //for ex.: prev real time calced in loop, next - real time from now()
                if (this._fRealTime < 0 || this._fRealTime > fRealTime) {
                    this._fRealTime = fRealTime;
                }

                this._fTime = this._fTime + (fRealTime - this._fRealTime) * this._fSpeed;
                this._fRealTime = fRealTime;

                var fTime = this._fTime;

                if (this._bLoop) {
                    fTime = akra.math.mod(fTime, (this._pAnimation.getDuration()));
                    if (this._bReverse) {
                        fTime = this._pAnimation.getDuration() - fTime;
                    }
                }

                this._fTrueTime = fTime;
            };

            Container.prototype.frame = function (sName, fRealTime) {
                if (!this._bEnable) {
                    return null;
                }

                if (this._fRealTime !== fRealTime) {
                    //only for first bone in list
                    this.calcTime(fRealTime);
                    this.enterFrame.emit(fRealTime, this._fTrueTime);
                }

                if (!this._bLeftInfinity && this._fTrueTime < this.getFirst()) {
                    return null;
                }

                if (!this._bRightInfinity && this._fTrueTime > this.getDuration()) {
                    return null;
                }

                return this._pAnimation.frame(sName, this._fTrueTime);
            };

            Container.isContainer = function (pAnimation) {
                return pAnimation.getType() === 3 /* CONTAINER */;
            };
            return Container;
        })(akra.animation.Base);
        animation.Container = Container;

        function createContainer(pAnimation, sName) {
            return new Container(pAnimation, sName);
        }
        animation.createContainer = createContainer;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Container.js.map
