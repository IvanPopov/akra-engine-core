var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represen boolExpr ? someExpr : someExpr
    * EMPTY_OPERATOR Instruction Instruction Instruction
    */
    var ConditionalExprInstruction = (function (_super) {
        __extends(ConditionalExprInstruction, _super);
        function ConditionalExprInstruction() {
            _super.call(this);
            this._pInstructionList = [null, null, null];
            this._eInstructionType = 27 /* k_ConditionalExprInstruction */;
        }
        ConditionalExprInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this.getInstructions()[0].toFinalCode();
            sCode += "?";
            sCode += this.getInstructions()[1].toFinalCode();
            sCode += ":";
            sCode += this.getInstructions()[2].toFinalCode();
            return sCode;
        };

        ConditionalExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            _super.prototype.addUsedData.call(this, pUsedDataCollector, 0 /* k_Read */);
        };

        ConditionalExprInstruction.prototype.isConst = function () {
            return (this.getInstructions()[0]).isConst() && (this.getInstructions()[1]).isConst();
        };
        return ConditionalExprInstruction;
    })(ExprInstruction);

    
    return ConditionalExprInstruction;
});
//# sourceMappingURL=ConditionalExprInstruction.js.map
