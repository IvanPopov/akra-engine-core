/// <reference path="ExprInstruction.ts" />
/// <reference path="IdInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var IdExprInstruction = (function (_super) {
            __extends(IdExprInstruction, _super);
            function IdExprInstruction() {
                _super.call(this);
                this._pType = null;
                this._bToFinalCode = true;
                this._isInPassUnifoms = false;
                this._isInPassForeigns = false;
                this._pInstructionList = [null];
                this._eInstructionType = 22 /* k_IdExprInstruction */;
            }
            IdExprInstruction.prototype.isVisible = function () {
                return this._pInstructionList[0].isVisible();
            };

            IdExprInstruction.prototype.getType = function () {
                if (!akra.isNull(this._pType)) {
                    return this._pType;
                } else {
                    var pVar = this._pInstructionList[0];
                    this._pType = pVar.getParent().getType();
                    return this._pType;
                }
            };

            IdExprInstruction.prototype.isConst = function () {
                return this.getType().isConst();
            };

            IdExprInstruction.prototype.evaluate = function () {
                if (this.getType().isForeign()) {
                    var pVal = this.getType()._getParentVarDecl().getValue();
                    if (!akra.isNull(pVal)) {
                        this._pLastEvalResult = pVal;
                        return true;
                    }
                }

                return false;
            };

            IdExprInstruction.prototype.prepareFor = function (eUsedMode) {
                if (!this.isVisible()) {
                    this._bToFinalCode = false;
                }

                if (eUsedMode === 3 /* k_PassFunction */) {
                    var pVarDecl = this.getInstructions()[0].getParent();
                    if (!this.getType()._isUnverifiable() && akra.isNull(pVarDecl.getParent())) {
                        if (pVarDecl.getType().isForeign()) {
                            this._isInPassForeigns = true;
                        } else {
                            this._isInPassUnifoms = true;
                        }
                    }
                }
            };

            IdExprInstruction.prototype.toFinalCode = function () {
                var sCode = "";
                if (this._bToFinalCode) {
                    if (this._isInPassForeigns || this._isInPassUnifoms) {
                        var pVarDecl = this.getInstructions()[0].getParent();
                        if (this._isInPassForeigns) {
                            sCode += "foreigns[\"" + pVarDecl._getNameIndex() + "\"]";
                        } else {
                            sCode += "uniforms[\"" + pVarDecl._getNameIndex() + "\"]";
                        }
                    } else {
                        sCode += this.getInstructions()[0].toFinalCode();
                    }
                }
                return sCode;
            };

            IdExprInstruction.prototype.clone = function (pRelationMap) {
                return _super.prototype.clone.call(this, pRelationMap);
            };

            IdExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                if (!this.getType().isFromVariableDecl()) {
                    return;
                }

                var pInfo = null;
                pInfo = pUsedDataCollector[this.getType()._getInstructionID()];

                if (!akra.isDef(pInfo)) {
                    pInfo = {
                        type: this.getType(),
                        isRead: false,
                        isWrite: false,
                        numRead: 0,
                        numWrite: 0,
                        numUsed: 0
                    };

                    pUsedDataCollector[this.getType()._getInstructionID()] = pInfo;
                }

                if (eUsedMode !== 1 /* k_Write */ && eUsedMode !== 3 /* k_Undefined */) {
                    pInfo.isRead = true;
                    pInfo.numRead++;
                }

                if (eUsedMode === 1 /* k_Write */ || eUsedMode === 2 /* k_ReadWrite */) {
                    pInfo.isWrite = true;
                    pInfo.numWrite++;
                }

                pInfo.numUsed++;
            };
            return IdExprInstruction;
        })(akra.fx.ExprInstruction);
        fx.IdExprInstruction = IdExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=IdExprInstruction.js.map
