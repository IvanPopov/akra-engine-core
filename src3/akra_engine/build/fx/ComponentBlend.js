/// <reference path="../idl/AIAFXComponentBlend.ts" />
/// <reference path="../idl/AIAFXComposer.ts" />
/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIMap.ts" />
define(["require", "exports", "debug", "fx/ComponentPassInputBlend"], function(require, exports, __debug__, __ComponentPassInputBlend__) {
    var debug = __debug__;
    

    var ComponentPassInputBlend = __ComponentPassInputBlend__;

    var ALL_PASSES = fx.ALL_PASSES;
    var ANY_PASS = fx.ANY_PASS;
    var ANY_SHIFT = fx.ANY_SHIFT;
    var DEFAULT_SHIFT = fx.DEFAULT_SHIFT;

    var ComponentBlend = (function () {
        function ComponentBlend(pComposer) {
            //UNIQUE();
            this._pComposer = null;
            this._isReady = false;
            this._sHash = "";
            this._bNeedToUpdateHash = false;
            this._pComponentHashMap = null;
            this._pAddedComponentInfoList = null;
            this._iShiftMin = 0;
            this._iShiftMax = 0;
            this._nTotalPasses = 0;
            this._iPostEffectsStart = 0;
            this._pPassesDList = null;
            this._pComponentInputVarBlend = null;
            this._pComposer = pComposer;

            this._pComponentHashMap = {};

            this._pAddedComponentInfoList = [];
        }
        ComponentBlend.prototype._getMinShift = function () {
            return this._iShiftMin;
        };

        ComponentBlend.prototype._getMaxShift = function () {
            return this._iShiftMax;
        };

        ComponentBlend.prototype.isReadyToUse = function () {
            return this._isReady;
        };

        ComponentBlend.prototype.isEmpty = function () {
            return this._pAddedComponentInfoList.length === 0;
        };

        ComponentBlend.prototype.getComponentCount = function () {
            return this._pAddedComponentInfoList.length;
        };

        ComponentBlend.prototype.getTotalPasses = function () {
            return !isNull(this._pPassesDList) ? this._pPassesDList.length : (this._iShiftMax - this._iShiftMin + 1);
        };

        ComponentBlend.prototype.hasPostEffect = function () {
            return this._iPostEffectsStart > 0;
        };

        ComponentBlend.prototype.getPostEffectStartPass = function () {
            return this._iPostEffectsStart;
        };

        ComponentBlend.prototype.getHash = function () {
            if (this._bNeedToUpdateHash) {
                this._sHash = this.calcHash();
                this._bNeedToUpdateHash = false;
            }

            return this._sHash;
        };

        ComponentBlend.prototype.containComponent = function (pComponent, iShift, iPass) {
            var iCorrectShift = iShift;
            var iCorrectPass = iPass;

            if (iShift === DEFAULT_SHIFT) {
                if (pComponent.isPostEffect()) {
                    iCorrectShift = ANY_PASS;
                } else {
                    iCorrectShift = 0;
                }
            }

            if (iCorrectShift !== ANY_SHIFT && iCorrectPass !== ANY_PASS) {
                return this.containComponentHash(pComponent.getHash(iCorrectShift, iCorrectPass));
            } else {
                for (var i = 0; i < this._pAddedComponentInfoList.length; i++) {
                    var pInfo = this._pAddedComponentInfoList[i];

                    if (pInfo.component === pComponent) {
                        if (iCorrectShift === ANY_SHIFT && iCorrectPass === ANY_PASS) {
                            return true;
                        } else if (iCorrectShift === ANY_SHIFT && pInfo.pass === iCorrectPass) {
                            return true;
                        } else if (iCorrectPass === ANY_PASS && pInfo.shift === iCorrectShift) {
                            return true;
                        }
                    }
                }

                return false;
            }
        };

        ComponentBlend.prototype.containComponentHash = function (sComponentHash) {
            return (this._pComponentHashMap[sComponentHash]);
        };

        ComponentBlend.prototype.findAddedComponentInfo = function (pComponent, iShift, iPass) {
            var iCorrectShift = iShift;
            var iCorrectPass = iPass;

            if (iShift === DEFAULT_SHIFT) {
                if (pComponent.isPostEffect()) {
                    iCorrectShift = ANY_PASS;
                } else {
                    iCorrectShift = 0;
                }
            }

            if (iCorrectShift !== ANY_SHIFT && iCorrectPass !== ANY_PASS && !this.containComponentHash(pComponent.getHash(iCorrectShift, iCorrectPass))) {
                return null;
            } else {
                for (var i = 0; i < this._pAddedComponentInfoList.length; i++) {
                    var pInfo = this._pAddedComponentInfoList[i];

                    if (pInfo.component === pComponent) {
                        if (iCorrectShift === ANY_SHIFT && iCorrectPass === ANY_PASS) {
                            return pInfo;
                        } else if (iCorrectShift === ANY_SHIFT && pInfo.pass === iCorrectPass) {
                            return pInfo;
                        } else if (iCorrectPass === ANY_PASS && pInfo.shift === iCorrectShift) {
                            return pInfo;
                        } else if (pInfo.pass === iCorrectPass && pInfo.shift === iCorrectShift) {
                            return pInfo;
                        }
                    }
                }

                return null;
            }
        };

        ComponentBlend.prototype.addComponent = function (pComponent, iShift, iPass) {
            var iPassCount = pComponent.getTotalPasses();

            if (iPass === ALL_PASSES) {
                for (var i = 0; i < iPassCount; i++) {
                    this.addComponent(pComponent, iShift + i, i);
                }

                return;
            } else if (iPass < 0 || iPass >= iPassCount) {
                return;
            }

            var sComponentHash = pComponent.getHash(iShift, iPass);
            if (this.containComponentHash(sComponentHash)) {
                debug.warn("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
                return;
            }

            if (iShift < this._iShiftMin) {
                this._iShiftMin = iShift;
            }

            if (iShift > this._iShiftMax) {
                this._iShiftMax = iShift;
            }

            var pInfo = {
                component: pComponent,
                shift: iShift,
                pass: iPass,
                hash: sComponentHash
            };

            this._pComponentHashMap[sComponentHash] = true;
            this._pAddedComponentInfoList.push(pInfo);

            this._isReady = false;
            this._iPostEffectsStart = 0;
            this._bNeedToUpdateHash = true;
        };

        ComponentBlend.prototype.removeComponent = function (pComponent, iShift, iPass) {
            var sComponentHash = pComponent.getHash(iShift, iPass);
            var iPassCount = pComponent.getTotalPasses();

            if (!this.containComponentHash(sComponentHash)) {
                debug.warn("You try to remove not used component '" + sComponentHash + "' from blend.");
                return;
            }

            if (iPass === ALL_PASSES) {
                for (var i = 0; i < iPassCount; i++) {
                    this.removeComponent(pComponent, iShift + i, i);
                }

                return;
            } else if (iPass < 0 || iPass >= iPassCount) {
                return;
            }

            this._pComponentHashMap[sComponentHash] = false;

            for (var i = 0; i < this._pAddedComponentInfoList.length; i++) {
                var pInfo = this._pAddedComponentInfoList[i];

                if (pInfo.component === pComponent && pInfo.shift === iShift && pInfo.pass === iPass) {
                    this._pAddedComponentInfoList.splice(i, 1);
                    break;
                }
            }

            if (this._iShiftMin === iShift || this._iShiftMax === iShift) {
                this._iShiftMax = 0;
                this._iShiftMin = 0;

                for (var i = 0; i < this._pAddedComponentInfoList.length; i++) {
                    var iTestShift = this._pAddedComponentInfoList[i].shift;

                    if (iTestShift < this._iShiftMin) {
                        this._iShiftMin = iTestShift;
                    }

                    if (iTestShift > this._iShiftMax) {
                        this._iShiftMax = iTestShift;
                    }
                }
            }

            this._isReady = false;
            this._iPostEffectsStart = 0;
            this._bNeedToUpdateHash = true;
        };

        ComponentBlend.prototype.finalizeBlend = function () {
            if (this._isReady) {
                return true;
            }

            this._pPassesDList = [];
            this._pComponentInputVarBlend = [];

            for (var i = 0; i < this._pAddedComponentInfoList.length; i++) {
                var pInfo = this._pAddedComponentInfoList[i];

                var pComponentTechnique = pInfo.component.getTechnique();
                var iShift = pInfo.shift - this._iShiftMin;
                var iPass = pInfo.pass;

                var pPass = pComponentTechnique.getPass(iPass);

                if (!isDef(this._pPassesDList[iShift])) {
                    this._pPassesDList[iShift] = [];
                    this._pComponentInputVarBlend[iShift] = new ComponentPassInputBlend();
                }

                this._pPassesDList[iShift].push(pPass);
                this._pComponentInputVarBlend[iShift].addDataFromPass(pPass);

                if (pInfo.component.isPostEffect()) {
                    if (this._iPostEffectsStart === 0 || iShift < this._iPostEffectsStart) {
                        this._iPostEffectsStart = iShift;
                    }
                }
            }

            for (var i = 0; i < this._pComponentInputVarBlend.length; i++) {
                if (isDef(this._pComponentInputVarBlend[i])) {
                    this._pComponentInputVarBlend[i].finalizeInput();
                } else {
                    this._pComponentInputVarBlend[i] = null;
                    this._pPassesDList[i] = null;
                }
            }

            this._isReady = true;

            return true;
        };

        ComponentBlend.prototype.getPassInputForPass = function (iPass) {
            if (!this._isReady) {
                return null;
            }

            if (iPass < 0 || iPass > this.getTotalPasses() || isNull(this._pComponentInputVarBlend[iPass])) {
                return null;
            }

            return this._pComponentInputVarBlend[iPass].getPassInput();
        };

        ComponentBlend.prototype.getPassListAtPass = function (iPass) {
            if (!this._isReady) {
                return null;
            }

            if (iPass < 0 || iPass > this.getTotalPasses()) {
                return null;
            }

            return this._pPassesDList[iPass];
        };

        ComponentBlend.prototype.clone = function () {
            var pClone = new ComponentBlend(this._pComposer);

            pClone._setDataForClone(this._pAddedComponentInfoList, this._pComponentHashMap, this._iShiftMin, this._iShiftMax);
            return pClone;
        };

        ComponentBlend.prototype._getComponentInfoList = function () {
            return this._pAddedComponentInfoList;
        };

        ComponentBlend.prototype._setDataForClone = function (pComponentInfoList, pComponentHashMap, iShiftMin, iShiftMax) {
            for (var i = 0; i < pComponentInfoList.length; i++) {
                this._pAddedComponentInfoList.push({
                    component: pComponentInfoList[i].component,
                    shift: pComponentInfoList[i].shift,
                    pass: pComponentInfoList[i].pass,
                    hash: pComponentInfoList[i].hash
                });

                this._pComponentHashMap[pComponentInfoList[i].hash] = pComponentHashMap[pComponentInfoList[i].hash];
            }

            this._iShiftMin = iShiftMin;
            this._iShiftMax = iShiftMax;
            this._bNeedToUpdateHash = true;
        };

        ComponentBlend.prototype.calcHash = function () {
            var sHash = "";

            if (this.isEmpty()) {
                return ComponentBlend.EMPTY_BLEND;
            }

            for (var i = 0; i < this._pAddedComponentInfoList.length; i++) {
                sHash += this._pAddedComponentInfoList[i].hash + ":";
            }

            return sHash;
        };

        ComponentBlend.EMPTY_BLEND = "EMPTY_BLEND";
        return ComponentBlend;
    })();

    
    return ComponentBlend;
});
//# sourceMappingURL=ComponentBlend.js.map
