/// <reference path="Instruction.ts" />
/// <reference path="ExprInstruction.ts" />
/// <reference path="Effect.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var InitExprInstruction = (function (_super) {
            __extends(InitExprInstruction, _super);
            function InitExprInstruction() {
                _super.call(this);
                this._pConstructorType = null;
                this._isConst = null;
                this._isArray = false;
                this._pInstructionList = [];
                this._eInstructionType = 39 /* k_InitExprInstruction */;
            }
            InitExprInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                if (!akra.isNull(this._pConstructorType)) {
                    sCode += this._pConstructorType.toFinalCode();
                }
                sCode += "(";

                for (var i = 0; i < this._nInstructions; i++) {
                    sCode += this.getInstructions()[i].toFinalCode();

                    if (i !== this._nInstructions - 1) {
                        sCode += ",";
                    }
                }

                sCode += ")";

                return sCode;
            };

            InitExprInstruction.prototype.isConst = function () {
                if (akra.isNull(this._isConst)) {
                    var pInstructionList = this.getInstructions();

                    for (var i = 0; i < pInstructionList.length; i++) {
                        if (!pInstructionList[i].isConst()) {
                            this._isConst = false;
                            break;
                        }
                    }

                    this._isConst = akra.isNull(this._isConst) ? true : false;
                }

                return this._isConst;
            };

            InitExprInstruction.prototype.optimizeForVariableType = function (pType) {
                if ((pType.isNotBaseArray() && pType._getScope() === 0) || (pType.isArray() && this._nInstructions > 1)) {
                    if (pType.getLength() === akra.fx.Instruction.UNDEFINE_LENGTH || (pType.isNotBaseArray() && this._nInstructions !== pType.getLength()) || (!pType.isNotBaseArray() && this._nInstructions !== pType.getBaseType().getLength())) {
                        return false;
                    }

                    if (pType.isNotBaseArray()) {
                        this._isArray = true;
                    }

                    var pArrayElementType = pType.getArrayElementType();
                    var pTestedInstruction = null;
                    var isOk = false;

                    for (var i = 0; i < this._nInstructions; i++) {
                        pTestedInstruction = this.getInstructions()[i];

                        if (pTestedInstruction._getInstructionType() === 39 /* k_InitExprInstruction */) {
                            isOk = pTestedInstruction.optimizeForVariableType(pArrayElementType);
                            if (!isOk) {
                                return false;
                            }
                        } else {
                            if (akra.fx.Effect.isSamplerType(pArrayElementType)) {
                                if (pTestedInstruction._getInstructionType() !== 40 /* k_SamplerStateBlockInstruction */) {
                                    return false;
                                }
                            } else {
                                isOk = pTestedInstruction.getType().isEqual(pArrayElementType);
                                if (!isOk) {
                                    return false;
                                }
                            }
                        }
                    }

                    this._pConstructorType = pType.getBaseType();
                    return true;
                } else {
                    var pFirstInstruction = this.getInstructions()[0];

                    if (this._nInstructions === 1 && pFirstInstruction._getInstructionType() !== 39 /* k_InitExprInstruction */) {
                        if (akra.fx.Effect.isSamplerType(pType)) {
                            if (pFirstInstruction._getInstructionType() === 40 /* k_SamplerStateBlockInstruction */) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        if (pFirstInstruction.getType().isEqual(pType)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else if (this._nInstructions === 1) {
                        return false;
                    }

                    var pInstructionList = this.getInstructions();
                    var pFieldNameList = pType.getFieldNameList();

                    for (var i = 0; i < pInstructionList.length; i++) {
                        var pFieldType = pType.getFieldType(pFieldNameList[i]);
                        if (!pInstructionList[i].optimizeForVariableType(pFieldType)) {
                            return false;
                        }
                    }

                    this._pConstructorType = pType.getBaseType();
                    return true;
                }
            };

            InitExprInstruction.prototype.evaluate = function () {
                if (!this.isConst()) {
                    this._pLastEvalResult = null;
                    return false;
                }

                var pRes = null;

                if (this._isArray) {
                    pRes = new Array(this._nInstructions);

                    for (var i = 0; i < this._nInstructions; i++) {
                        var pEvalInstruction = this.getInstructions()[i];

                        if (pEvalInstruction.evaluate()) {
                            pRes[i] = pEvalInstruction.getEvalValue();
                        }
                    }
                } else if (this._nInstructions === 1) {
                    var pEvalInstruction = this.getInstructions()[0];
                    pEvalInstruction.evaluate();
                    pRes = pEvalInstruction.getEvalValue();
                } else {
                    var pJSTypeCtor = akra.fx.Effect.getExternalType(this._pConstructorType);
                    var pArguments = new Array(this._nInstructions);

                    if (akra.isNull(pJSTypeCtor)) {
                        return false;
                    }

                    try  {
                        if (akra.fx.Effect.isScalarType(this._pConstructorType)) {
                            var pTestedInstruction = this.getInstructions()[1];
                            if (this._nInstructions > 2 || !pTestedInstruction.evaluate()) {
                                return false;
                            }

                            pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
                        } else {
                            for (var i = 0; i < this._nInstructions; i++) {
                                var pTestedInstruction = this.getInstructions()[i];

                                if (pTestedInstruction.evaluate()) {
                                    pArguments[i] = pTestedInstruction.getEvalValue();
                                } else {
                                    return false;
                                }
                            }

                            pRes = new pJSTypeCtor;
                            pRes.set.apply(pRes, pArguments);
                        }
                    } catch (e) {
                        return false;
                    }
                }

                this._pLastEvalResult = pRes;

                return true;
            };
            return InitExprInstruction;
        })(akra.fx.ExprInstruction);
        fx.InitExprInstruction = InitExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=InitExprInstruction.js.map
