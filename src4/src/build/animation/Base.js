/// <reference path="../idl/IAnimationBase.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IPositionFrame.ts" />
/// <reference path="../idl/IAnimationTrack.ts" />
var akra;
(function (akra) {
    /// <reference path="../config/config.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../scene/Joint.ts" />
    (function (animation) {
        var Joint = akra.scene.Joint;

        var Base = (function () {
            function Base(eType, sName) {
                if (typeof sName === "undefined") { sName = null; }
                this.guid = akra.guid();
                this._pTargetMap = {};
                this._pTargetList = [];
                this._fDuration = 0.0;
                //first ever frame time of all targets
                this._fFirst = akra.MAX_UINT32;
                this.extra = null;
                this.setupSignals();

                this._sName = sName || ("animation-" + "-" + this.guid);
                this._eType = eType;
            }
            Base.prototype.setupSignals = function () {
                this.played = this.played || new akra.Signal(this);
                this.stoped = this.stoped || new akra.Signal(this);
                this.renamed = this.renamed || new akra.Signal(this);
            };

            Base.prototype.getType = function () {
                return this._eType;
            };

            Base.prototype.getDuration = function () {
                return this._fDuration;
            };

            Base.prototype.getFirst = function () {
                return this._fFirst;
            };

            Base.prototype.setDuration = function (fValue) {
                // LOG("new duration(", this.name, ") > " + fValue);
                this._fDuration = fValue;
            };

            Base.prototype.getName = function () {
                return this._sName;
            };

            Base.prototype.setName = function (sName) {
                if (sName == this._sName) {
                    return;
                }

                this._sName = sName;
                this.renamed.emit(sName);
            };

            Base.prototype.play = function (fRealTime) {
                this.played.emit(fRealTime);
            };

            Base.prototype.stop = function (fRealTime) {
                this.stoped.emit(fRealTime);
            };

            Base.prototype.isAttached = function () {
                if (this._pTargetList.length) {
                    return akra.isDefAndNotNull(this._pTargetList[0].target);
                }

                return false;
            };

            Base.prototype.attach = function (pTarget) {
                akra.debug.error("method AnimationBase::attach() must be overwritten.");
            };

            Base.prototype.frame = function (sName, fRealTime) {
                return null;
            };

            Base.prototype.apply = function (fRealTime) {
                var pTargetList = this._pTargetList;
                var pTarget = null;
                var pFrame = null;
                var pTransform = null;
                var bAffected = false;

                for (var i = 0; i < pTargetList.length; ++i) {
                    pFrame = this.frame(pTargetList[i].name, fRealTime);
                    pTarget = pTargetList[i].target;

                    if (!pFrame || !pTarget) {
                        continue;
                    }

                    pTransform = pFrame.toMatrix();
                    pTarget.setLocalMatrix(pTransform);
                    bAffected = true;
                }

                // console.log(bAffected);
                return bAffected;
            };

            Base.prototype.addTarget = function (sName, pTarget) {
                if (typeof pTarget === "undefined") { pTarget = null; }
                //pTarget = pTarget || null;
                var pPointer = this._pTargetMap[sName];

                if (pPointer) {
                    pPointer.target = pTarget || pPointer.target || null;
                    return pPointer;
                }

                pPointer = {
                    target: pTarget,
                    index: this._pTargetList.length,
                    name: sName
                };

                this._pTargetList.push(pPointer);
                this._pTargetMap[sName] = pPointer;

                return pPointer;
            };

            Base.prototype.setTarget = function (sName, pTarget) {
                var pPointer = this._pTargetMap[sName];
                pPointer.target = pTarget;
                return pPointer;
            };

            Base.prototype.getTarget = function (sTargetName) {
                return this._pTargetMap[sTargetName];
            };

            Base.prototype.getTargetList = function () {
                return this._pTargetList;
            };

            Base.prototype.getTargetByName = function (sName) {
                return this._pTargetMap[sName];
            };

            Base.prototype.targetNames = function () {
                var pTargets = this._pTargetList;
                var pTargetNames = [];

                for (var i = 0; i < pTargets.length; ++i) {
                    pTargetNames.push(pTargets[i].name);
                }

                return pTargetNames;
            };

            Base.prototype.targetList = function () {
                var pTargets = this._pTargetList;
                var pTargetList = [];

                for (var i = 0; i < pTargets.length; ++i) {
                    pTargetList.push(pTargets[i].target);
                }

                return pTargetList;
            };

            Base.prototype.jointList = function () {
                var pTargets = this._pTargetList;
                var pJointList = [];

                for (var i = 0; i < pTargets.length; ++i) {
                    if (Joint.isJoint(pTargets[i].target)) {
                        pJointList.push(pTargets[i].target);
                    }
                }

                return pJointList;
            };

            Base.prototype.grab = function (pAnimationBase, bRewrite) {
                if (typeof bRewrite === "undefined") { bRewrite = true; }
                var pAdoptTargets = pAnimationBase.getTargetList();

                for (var i = 0; i < pAdoptTargets.length; ++i) {
                    if (!pAdoptTargets[i].target) {
                        continue;
                    }

                    if (bRewrite || !this.getTarget(pAdoptTargets[i].name)) {
                        this.addTarget(pAdoptTargets[i].name, pAdoptTargets[i].target);
                    }
                }

                this._fFirst = akra.math.min(this.getFirst(), pAnimationBase.getFirst());
            };

            Base.prototype.createAnimationMask = function () {
                var pTargets = this.targetNames();
                var pMask = {};

                for (var i = 0; i < pTargets.length; ++i) {
                    pMask[pTargets[i]] = 1.0;
                }

                return pMask;
            };

            Base.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = "\n";
                    s += "name         : " + this.getName() + "\n";
                    s += "duration     : " + this.getDuration() + " sec\n";
                    s += "total targets: " + this.targetList().length.toString() + "\n";
                    return s;
                }

                return null;
            };
            return Base;
        })();
        animation.Base = Base;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Base.js.map
