var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represent someExpr == != < > <= >= someExpr
    * (==|!=|<|>|<=|>=) Instruction Instruction
    */
    var RelationalExprInstruction = (function (_super) {
        __extends(RelationalExprInstruction, _super);
        function RelationalExprInstruction() {
            _super.call(this);
            this._pInstructionList = [null, null];
            this._eInstructionType = 25 /* k_RelationalExprInstruction */;
        }
        RelationalExprInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this.getInstructions()[0].toFinalCode();
            sCode += this.getOperator();
            sCode += this.getInstructions()[1].toFinalCode();
            return sCode;
        };

        RelationalExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            _super.prototype.addUsedData.call(this, pUsedDataCollector, 0 /* k_Read */);
        };

        RelationalExprInstruction.prototype.isConst = function () {
            return (this.getInstructions()[0]).isConst() && (this.getInstructions()[1]).isConst();
        };
        return RelationalExprInstruction;
    })(ExprInstruction);

    
    return RelationalExprInstruction;
});
//# sourceMappingURL=RelationalExprInstruction.js.map