/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../common.ts" />
var akra;
(function (akra) {
    (function (fx) {
        var Instruction = (function () {
            function Instruction() {
                this._pParentInstruction = null;
                this._sOperatorName = null;
                this._pInstructionList = null;
                this._nInstructions = 0;
                this._eInstructionType = 0;
                this._pLastError = null;
                this._bErrorOccured = false;
                this._iInstructionID = 0;
                this._iScope = Instruction.UNDEFINE_SCOPE;
                this._isVisible = true;
                this._iInstructionID = Instruction._nInstructionCounter++;
                this._pParentInstruction = null;
                this._sOperatorName = null;
                this._pInstructionList = null;
                this._nInstructions = 0;
                this._eInstructionType = 0 /* k_Instruction */;
                this._pLastError = { code: 0, info: null };
            }
            Instruction.prototype.getParent = function () {
                return this._pParentInstruction;
            };

            Instruction.prototype.setParent = function (pParentInstruction) {
                this._pParentInstruction = pParentInstruction;
            };

            Instruction.prototype.getOperator = function () {
                return this._sOperatorName;
            };

            Instruction.prototype.setOperator = function (sOperator) {
                this._sOperatorName = sOperator;
            };

            Instruction.prototype.getInstructions = function () {
                return this._pInstructionList;
            };

            Instruction.prototype.setInstructions = function (pInstructionList) {
                this._pInstructionList = pInstructionList;
            };

            Instruction.prototype._getInstructionType = function () {
                return this._eInstructionType;
            };

            Instruction.prototype._getInstructionID = function () {
                return this._iInstructionID;
            };

            Instruction.prototype._getScope = function () {
                return this._iScope !== Instruction.UNDEFINE_SCOPE ? this._iScope : !akra.isNull(this.getParent()) ? this.getParent()._getScope() : Instruction.UNDEFINE_SCOPE;
            };

            Instruction.prototype._setScope = function (iScope) {
                this._iScope = iScope;
            };

            Instruction.prototype._isInGlobalScope = function () {
                return this._getScope() === 0;
            };

            Instruction.prototype.getLastError = function () {
                return this._pLastError;
            };

            Instruction.prototype.setError = function (eCode, pInfo) {
                if (typeof pInfo === "undefined") { pInfo = null; }
                this._pLastError.code = eCode;
                this._pLastError.info = pInfo;
                this._bErrorOccured = true;
            };

            Instruction.prototype.clearError = function () {
                this._bErrorOccured = false;
                this._pLastError.code = 0;
                this._pLastError.info = null;
            };

            Instruction.prototype.isErrorOccured = function () {
                return this._bErrorOccured;
            };

            Instruction.prototype.setVisible = function (isVisible) {
                this._isVisible = isVisible;
            };

            Instruction.prototype.isVisible = function () {
                return this._isVisible;
            };

            Instruction.prototype.initEmptyInstructions = function () {
                this._pInstructionList = [];
            };

            Instruction.prototype.push = function (pInstruction, isSetParent) {
                if (typeof isSetParent === "undefined") { isSetParent = false; }
                if (!akra.isNull(this._pInstructionList)) {
                    this._pInstructionList[this._nInstructions] = pInstruction;
                    this._nInstructions += 1;
                }
                if (isSetParent && !akra.isNull(pInstruction)) {
                    pInstruction.setParent(this);
                }
            };

            Instruction.prototype.addRoutine = function (fnRoutine, iPriority) {
                //TODO
            };

            Instruction.prototype.prepareFor = function (eUsedType) {
                if (!akra.isNull(this._pInstructionList) && this._nInstructions > 0) {
                    for (var i = 0; i < this._nInstructions; i++) {
                        this._pInstructionList[i].prepareFor(eUsedType);
                    }
                }
            };

            /**
            * Проверка валидности инструкции
            */
            Instruction.prototype.check = function (eStage, pInfo) {
                if (typeof pInfo === "undefined") { pInfo = null; }
                if (this._bErrorOccured) {
                    return false;
                } else {
                    return true;
                }
            };

            /**
            * Подготовка интсрукции к дальнейшему анализу
            */
            Instruction.prototype.prepare = function () {
                return true;
            };

            Instruction.prototype.toString = function () {
                return null;
            };

            Instruction.prototype.toFinalCode = function () {
                return "";
            };

            Instruction.prototype.clone = function (pRelationMap) {
                if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
                if (akra.isDef(pRelationMap[this._getInstructionID()])) {
                    return pRelationMap[this._getInstructionID()];
                }

                var pNewInstruction = new this["constructor"]();
                var pParent = this.getParent() || null;

                if (!akra.isNull(pParent) && akra.isDef(pRelationMap[pParent._getInstructionID()])) {
                    pParent = pRelationMap[pParent._getInstructionID()];
                }

                pNewInstruction.setParent(pParent);
                pRelationMap[this._getInstructionID()] = pNewInstruction;

                if (!akra.isNull(this._pInstructionList) && akra.isNull(pNewInstruction.getInstructions())) {
                    pNewInstruction.initEmptyInstructions();
                }

                for (var i = 0; i < this._nInstructions; i++) {
                    pNewInstruction.push(this._pInstructionList[i].clone(pRelationMap));
                }

                pNewInstruction.setOperator(this.getOperator());

                return pNewInstruction;
            };
            Instruction._nInstructionCounter = 0;

            Instruction.UNDEFINE_LENGTH = 0xffffff;
            Instruction.UNDEFINE_SIZE = 0xffffff;
            Instruction.UNDEFINE_SCOPE = 0xffffff;
            Instruction.UNDEFINE_PADDING = 0xffffff;
            Instruction.UNDEFINE_NAME = "undef";
            return Instruction;
        })();
        fx.Instruction = Instruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=Instruction.js.map
