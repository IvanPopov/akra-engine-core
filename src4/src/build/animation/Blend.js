/// <reference path="../idl/IAnimationBlend.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="Base.ts" />
    /// <reference path="Frame.ts" />
    (function (animation) {
        var Blend = (function (_super) {
            __extends(Blend, _super);
            function Blend(sName) {
                _super.call(this, 4 /* BLEND */, sName);
                this.duration = 0;
                this._pAnimationList = [];
            }
            Blend.prototype.setupSignals = function () {
                this.weightUpdated = this.weightUpdated || new akra.Signal(this);
                this.durationUpdated = this.durationUpdated || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            Blend.prototype.getTotalAnimations = function () {
                return this._pAnimationList.length;
            };

            Blend.prototype.play = function (fRealTime) {
                var pAnimationList = this._pAnimationList;
                var n = pAnimationList.length;

                for (var i = 0; i < n; ++i) {
                    pAnimationList[i].realTime = fRealTime;
                    pAnimationList[i].time = fRealTime * pAnimationList[i].acceleration;
                }

                this.played.emit(fRealTime);
            };

            Blend.prototype.stop = function () {
                this.stoped.emit(0.);
            };

            Blend.prototype.attach = function (pTarget) {
                var pAnimationList = this._pAnimationList;

                for (var i = 0; i < pAnimationList.length; ++i) {
                    var pAnim = pAnimationList[i].animation;
                    pAnim.attach(pTarget);
                    this.grab(pAnim, true);
                }
            };

            Blend.prototype.addAnimation = function (pAnimation, fWeight, pMask) {
                akra.debug.assert(akra.isDef(pAnimation), 'animation must be setted.');

                this._pAnimationList.push(null);
                var iAnimation = this._pAnimationList.length - 1;

                if (this.setAnimation(iAnimation, pAnimation, fWeight, pMask)) {
                    return iAnimation;
                }

                return -1;
            };

            Blend.prototype.setAnimation = function (iAnimation, pAnimation, fWeight, pMask) {
                if (typeof fWeight === "undefined") { fWeight = 1.0; }
                if (typeof pMask === "undefined") { pMask = null; }
                akra.debug.assert(iAnimation <= this._pAnimationList.length, 'invalid animation slot: ' + iAnimation + '/' + this._pAnimationList.length);

                var pPointer = this._pAnimationList[iAnimation];
                var pAnimationList = this._pAnimationList;

                if (!pAnimation) {
                    if (akra.isDefAndNotNull(pAnimationList[iAnimation])) {
                        pAnimationList[iAnimation] = null;
                        this.updateDuration();
                        return true;
                    }

                    return false;
                }

                if (!pPointer) {
                    pPointer = {
                        animation: pAnimation,
                        weight: fWeight,
                        mask: pMask,
                        acceleration: 1.0,
                        time: 0.0,
                        realTime: 0.0
                    };

                    if (akra.animation.Container.isContainer(pAnimation) || Blend.isBlend(pAnimation)) {
                        pAnimation.durationUpdated.connect(this, this._onDurationUpdate);
                    }

                    if (iAnimation == this._pAnimationList.length) {
                        pAnimationList.push(pPointer);
                    } else {
                        pAnimationList[iAnimation] = pPointer;
                    }
                } else {
                    return false;
                }

                this.grab(pAnimation);
                this.updateDuration();

                return true;
            };

            Blend.prototype.swapAnimations = function (i, j) {
                var pAnimationList = this._pAnimationList;
                var pPointerA = pAnimationList[i];
                var pPointerB = pAnimationList[j];

                if (!akra.isDefAndNotNull(pPointerA) || !akra.isDefAndNotNull(pPointerB)) {
                    return false;
                }

                pAnimationList[i] = pPointerB;
                pAnimationList[j] = pPointerA;

                return true;
            };

            Blend.prototype.removeAnimation = function (i) {
                if (this.setAnimation(i, null)) {
                    this._pAnimationList.splice(i, 1);
                    return true;
                }

                return false;
            };

            Blend.prototype._onDurationUpdate = function (pAnimation, fDuration) {
                this.updateDuration();
            };

            Blend.prototype.updateDuration = function () {
                var fWeight = 0;
                var fSumm = 0;
                var pAnimationList = this._pAnimationList;
                var n = pAnimationList.length;

                for (var i = 0; i < n; ++i) {
                    if (pAnimationList[i] === null) {
                        continue;
                    }

                    fSumm += pAnimationList[i].weight * pAnimationList[i].animation.getDuration();
                    fWeight += pAnimationList[i].weight;
                }

                if (fWeight === 0) {
                    this.duration = 0;
                } else {
                    this.duration = fSumm / fWeight;

                    for (var i = 0; i < n; ++i) {
                        if (pAnimationList[i] === null) {
                            continue;
                        }

                        pAnimationList[i].acceleration = pAnimationList[i].animation.getDuration() / this.duration;
                        //trace(pAnimationList[i].animation.name, '> acceleration > ', pAnimationList[i].acceleration);
                    }
                }

                this.durationUpdated.emit(this.duration);
            };

            Blend.prototype.getAnimationIndex = function (sName) {
                var pAnimationList = this._pAnimationList;

                for (var i = 0; i < pAnimationList.length; i++) {
                    if (pAnimationList[i].animation.getName() === sName) {
                        return i;
                    }
                }
                ;

                return -1;
            };

            Blend.prototype.getAnimation = function (animation) {
                var iAnimation = akra.isString(animation) ? this.getAnimationIndex(animation) : animation;
                return this._pAnimationList[iAnimation].animation;
            };

            Blend.prototype.getAnimationWeight = function (animation) {
                var iAnimation = animation;
                if (akra.isString(animation)) {
                    iAnimation = this.getAnimationIndex(animation);
                }

                return this._pAnimationList[iAnimation].weight;
            };

            Blend.prototype.setWeights = function () {
                var pWeight = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    pWeight[_i] = arguments[_i + 0];
                }
                var fWeight;
                var isModified = false;
                var pAnimationList = this._pAnimationList;

                for (var i = 0; i < arguments.length; ++i) {
                    fWeight = arguments[i];

                    if (fWeight < 0 || fWeight === null || !pAnimationList[i]) {
                        continue;
                    }

                    if (pAnimationList[i].weight !== fWeight) {
                        pAnimationList[i].weight = fWeight;
                        isModified = true;
                    }
                }

                if (isModified) {
                    this.updateDuration();
                }

                return true;
            };

            Blend.prototype.setWeightSwitching = function (fWeight, iAnimationFrom, iAnimationTo) {
                var pAnimationList = this._pAnimationList;
                var isModified = false;
                var fWeightInv = 1. - fWeight;

                if (!pAnimationList[iAnimationFrom] || !pAnimationList[iAnimationTo]) {
                    return false;
                }

                if (pAnimationList[iAnimationFrom].weight !== fWeightInv) {
                    pAnimationList[iAnimationFrom].weight = fWeightInv;
                    isModified = true;
                }

                if (pAnimationList[iAnimationTo].weight !== fWeight) {
                    pAnimationList[iAnimationTo].weight = fWeight;
                    isModified = true;
                }

                if (isModified) {
                    this.updateDuration();
                }

                return true;
            };

            Blend.prototype.setAnimationWeight = function (animation, fWeight) {
                var pAnimationList = this._pAnimationList;

                if (arguments.length === 1) {
                    fWeight = arguments[0];

                    for (var i = 0; i < pAnimationList.length; i++) {
                        pAnimationList[i].weight = fWeight;
                        this.weightUpdated.emit(i, fWeight);
                    }

                    this.updateDuration();
                } else {
                    var iAnimation = akra.isString(animation) ? this.getAnimationIndex(animation) : animation;

                    //trace('set weight for animation: ', iAnimation, 'to ', fWeight);
                    if (pAnimationList[iAnimation].weight !== fWeight) {
                        pAnimationList[iAnimation].weight = fWeight;
                        this.updateDuration();
                        this.weightUpdated.emit(iAnimation, fWeight);
                    }
                }

                return true;
            };

            Blend.prototype.setAnimationMask = function (animation, pMask) {
                var iAnimation = akra.isString(animation) ? this.getAnimationIndex(animation) : animation;

                this._pAnimationList[iAnimation].mask = pMask;

                return true;
            };

            Blend.prototype.getAnimationMask = function (animation) {
                var iAnimation = akra.isString(animation) ? this.getAnimationIndex(animation) : animation;

                return this._pAnimationList[iAnimation].mask;
            };

            Blend.prototype.getAnimationAcceleration = function (animation) {
                var iAnimation = akra.isString(animation) ? this.getAnimationIndex(animation) : animation;

                return this._pAnimationList[iAnimation].acceleration;
            };

            Blend.prototype.createAnimationMask = function (iAnimation) {
                if (arguments.length === 0) {
                    return _super.prototype.createAnimationMask.call(this);
                }

                if (typeof arguments[0] === 'string') {
                    iAnimation = this.getAnimationIndex(arguments[0]);
                }

                var pAnimation = this._pAnimationList[iAnimation].animation;
                return pAnimation.createAnimationMask();
            };

            Blend.prototype.frame = function (sName, fRealTime) {
                var pAnimationList = this._pAnimationList;
                var pResultFrame = akra.animation.PositionFrame.temp();
                var pFrame;
                var pMask;
                var pPointer;
                var fAcceleration;

                var fBoneWeight;
                var fWeight;
                var iAnim = 0;

                for (var i = 0; i < pAnimationList.length; i++) {
                    pPointer = pAnimationList[i];

                    if (!pPointer) {
                        continue;
                    }

                    fAcceleration = pPointer.acceleration;
                    pMask = pPointer.mask;
                    fBoneWeight = 1.0;

                    //для того чтобы циклы используемые выше работали корректно
                    if (fRealTime < pPointer.realTime) {
                        pPointer.time = 0;
                        pPointer.realTime = 0;
                    }

                    pPointer.time = pPointer.time + (fRealTime - pPointer.realTime) * fAcceleration;
                    pPointer.realTime = fRealTime;

                    if (pMask) {
                        fBoneWeight = akra.isDef(pMask[sName]) ? pMask[sName] : 1.0;
                    }

                    fWeight = fBoneWeight * pPointer.weight;

                    if (fWeight > 0.0) {
                        pFrame = pPointer.animation.frame(sName, pPointer.time);

                        if (pFrame) {
                            iAnim++;

                            //first, if 1
                            pResultFrame.add(pFrame.mult(fWeight), iAnim === 1);
                        }
                    }
                }

                if (pResultFrame.weight === 0.0) {
                    return null;
                }

                return pResultFrame.normilize();
            };

            Blend.isBlend = function (pAnimation) {
                return pAnimation.getType() === 4 /* BLEND */;
            };
            return Blend;
        })(akra.animation.Base);
        animation.Blend = Blend;

        function createBlend(sName) {
            return new Blend(sName);
        }
        animation.createBlend = createBlend;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Blend.js.map
