/// <reference path="../idl/EEffectErrors.ts" />
/// <reference path="StmtInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        /**
        * Represent for(forInit forCond ForStep) stmt
        * for ExprInstruction or VarDeclInstruction ExprInstruction ExprInstruction StmtInstruction
        */
        var ForStmtInstruction = (function (_super) {
            __extends(ForStmtInstruction, _super);
            function ForStmtInstruction() {
                _super.call(this);
                this._pInstructionList = [null, null, null, null];
                this._eInstructionType = 53 /* k_ForStmtInstruction */;
            }
            ForStmtInstruction.prototype.toFinalCode = function () {
                var sCode = "for(";

                sCode += this.getInstructions()[0].toFinalCode() + ";";
                sCode += this.getInstructions()[1].toFinalCode() + ";";
                sCode += this.getInstructions()[2].toFinalCode() + ")";
                sCode += this.getInstructions()[3].toFinalCode();

                return sCode;
            };

            ForStmtInstruction.prototype.check = function (eStage, pInfo) {
                if (typeof pInfo === "undefined") { pInfo = null; }
                var pInstructionList = this.getInstructions();

                if (this._nInstructions !== 4) {
                    this.setError(2239 /* BAD_FOR_STEP_EMPTY */);
                    return false;
                }

                if (akra.isNull(pInstructionList[0])) {
                    this.setError(2232 /* BAD_FOR_INIT_EMPTY_ITERATOR */);
                    return false;
                }

                if (pInstructionList[0]._getInstructionType() !== 15 /* k_VariableDeclInstruction */) {
                    this.setError(2231 /* BAD_FOR_INIT_EXPR */);
                    return false;
                }

                if (akra.isNull(pInstructionList[1])) {
                    this.setError(2233 /* BAD_FOR_COND_EMPTY */);
                    return false;
                }

                if (pInstructionList[1]._getInstructionType() !== 25 /* k_RelationalExprInstruction */) {
                    this.setError(2238 /* BAD_FOR_COND_RELATION */);
                    return false;
                }

                if (pInstructionList[2]._getInstructionType() === 29 /* k_UnaryExprInstruction */ || pInstructionList[2]._getInstructionType() === 24 /* k_AssignmentExprInstruction */ || pInstructionList[2]._getInstructionType() === 32 /* k_PostfixArithmeticInstruction */) {
                    var sOperator = pInstructionList[2].getOperator();
                    if (sOperator !== "++" && sOperator !== "--" && sOperator !== "+=" && sOperator !== "-=") {
                        this.setError(2240 /* BAD_FOR_STEP_OPERATOR */, { operator: sOperator });
                        return false;
                    }
                } else {
                    this.setError(2241 /* BAD_FOR_STEP_EXPRESSION */);
                    return false;
                }

                return true;
            };

            ForStmtInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                var pForInit = this.getInstructions()[0];
                var pForCondition = this.getInstructions()[1];
                var pForStep = this.getInstructions()[2];
                var pForStmt = this.getInstructions()[3];

                var pIteratorType = pForInit.getType();

                pUsedDataCollector[pIteratorType._getInstructionID()] = {
                    type: pIteratorType,
                    isRead: false,
                    isWrite: true,
                    numRead: 0,
                    numWrite: 1,
                    numUsed: 1
                };

                pForCondition.addUsedData(pUsedDataCollector, eUsedMode);
                pForStep.addUsedData(pUsedDataCollector, eUsedMode);
                pForStmt.addUsedData(pUsedDataCollector, eUsedMode);
            };
            return ForStmtInstruction;
        })(akra.fx.StmtInstruction);
        fx.ForStmtInstruction = ForStmtInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ForStmtInstruction.js.map
