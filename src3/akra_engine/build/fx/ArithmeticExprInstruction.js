var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represent someExpr + / - * % someExpr
    * (+|-|*|/|%) Instruction Instruction
    */
    var ArithmeticExprInstruction = (function (_super) {
        __extends(ArithmeticExprInstruction, _super);
        function ArithmeticExprInstruction() {
            _super.call(this);
            this._pInstructionList = [null, null];
            this._eInstructionType = 23 /* k_ArithmeticExprInstruction */;
        }
        ArithmeticExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            _super.prototype.addUsedData.call(this, pUsedDataCollector, 0 /* k_Read */);
        };

        ArithmeticExprInstruction.prototype.evaluate = function () {
            var pOperands = this.getInstructions();
            var pValL = pOperands[0].evaluate() ? pOperands[0].getEvalValue() : null;
            var pValR = pOperands[1].evaluate() ? pOperands[1].getEvalValue() : null;

            if (isNull(pValL) || isNull(pValR)) {
                return false;
            }

            try  {
                switch (this.getOperator()) {
                    case "+":
                        this._pLastEvalResult = pValL + pValR;
                        break;
                    case "-":
                        this._pLastEvalResult = pValL - pValR;
                        break;
                    case "*":
                        this._pLastEvalResult = pValL * pValR;
                        break;
                    case "/":
                        this._pLastEvalResult = pValL / pValR;
                        break;
                    case "%":
                        this._pLastEvalResult = pValL % pValR;
                        break;
                }
                return true;
            } catch (e) {
                return false;
            }
        };

        ArithmeticExprInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this.getInstructions()[0].toFinalCode();
            sCode += this.getOperator();
            sCode += this.getInstructions()[1].toFinalCode();
            return sCode;
        };

        ArithmeticExprInstruction.prototype.isConst = function () {
            var pOperands = this.getInstructions();
            return pOperands[0].isConst() && pOperands[1].isConst();
        };
        return ArithmeticExprInstruction;
    })(ExprInstruction);

    
    return ArithmeticExprInstruction;
});
//# sourceMappingURL=ArithmeticExprInstruction.js.map
