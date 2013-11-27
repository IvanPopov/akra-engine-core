var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represent + - ! ++ -- expr
    * (+|-|!|++|--|) Instruction
    */
    var UnaryExprInstruction = (function (_super) {
        __extends(UnaryExprInstruction, _super);
        function UnaryExprInstruction() {
            _super.call(this);
            this._pInstructionList = [null];
            this._eInstructionType = 29 /* k_UnaryExprInstruction */;
        }
        UnaryExprInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this.getOperator();
            sCode += this.getInstructions()[0].toFinalCode();
            return sCode;
        };

        UnaryExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            if (this.getOperator() === "++" || this.getOperator() === "--") {
                (this.getInstructions()[0]).addUsedData(pUsedDataCollector, 2 /* k_ReadWrite */);
            } else {
                (this.getInstructions()[0]).addUsedData(pUsedDataCollector, 0 /* k_Read */);
            }
        };

        UnaryExprInstruction.prototype.isConst = function () {
            return (this.getInstructions()[0]).isConst();
        };

        UnaryExprInstruction.prototype.evaluate = function () {
            var sOperator = this.getOperator();
            var pExpr = this.getInstructions()[0];

            if (!pExpr.evaluate()) {
                return;
            }

            var pRes = null;

            try  {
                pRes = pExpr.getEvalValue();
                switch (sOperator) {
                    case "+":
                        pRes = +pRes;
                        break;
                    case "-":
                        pRes = -pRes;
                        break;
                    case "!":
                        pRes = !pRes;
                        break;
                    case "++":
                        pRes = ++pRes;
                        break;
                    case "--":
                        pRes = --pRes;
                        break;
                }
            } catch (e) {
                return false;
            }

            this._pLastEvalResult = pRes;
            return true;
        };
        return UnaryExprInstruction;
    })(ExprInstruction);

    
    return UnaryExprInstruction;
});
//# sourceMappingURL=UnaryExprInstruction.js.map
