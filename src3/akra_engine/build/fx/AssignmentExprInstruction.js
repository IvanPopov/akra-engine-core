var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represent someExpr = += -= /= *= %= someExpr
    * (=|+=|-=|*=|/=|%=) Instruction Instruction
    */
    var AssignmentExprInstruction = (function (_super) {
        __extends(AssignmentExprInstruction, _super);
        function AssignmentExprInstruction() {
            _super.call(this);
            this._pInstructionList = [null, null];
            this._eInstructionType = 24 /* k_AssignmentExprInstruction */;
        }
        AssignmentExprInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this.getInstructions()[0].toFinalCode();
            sCode += this.getOperator();
            sCode += this.getInstructions()[1].toFinalCode();
            return sCode;
        };

        AssignmentExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            var sOperator = this.getOperator();
            var pSubExprLeft = this.getInstructions()[0];
            var pSubExprRight = this.getInstructions()[1];

            if (eUsedMode === 0 /* k_Read */ || sOperator !== "=") {
                pSubExprLeft.addUsedData(pUsedDataCollector, 2 /* k_ReadWrite */);
            } else {
                pSubExprLeft.addUsedData(pUsedDataCollector, 1 /* k_Write */);
            }

            pSubExprRight.addUsedData(pUsedDataCollector, 0 /* k_Read */);
        };
        return AssignmentExprInstruction;
    })(ExprInstruction);

    
    return AssignmentExprInstruction;
});
//# sourceMappingURL=AssignmentExprInstruction.js.map
