var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/StmtInstruction"], function(require, exports, __StmtInstruction__) {
    var StmtInstruction = __StmtInstruction__;

    /**
    * Represent expr;
    * EMPTY_OPERTOR ExprInstruction
    */
    var ExprStmtInstruction = (function (_super) {
        __extends(ExprStmtInstruction, _super);
        function ExprStmtInstruction() {
            _super.call(this);
            this._pInstructionList = [null];
            this._eInstructionType = 50 /* k_ExprStmtInstruction */;
        }
        ExprStmtInstruction.prototype.toFinalCode = function () {
            return this.getInstructions()[0].toFinalCode() + ";";
        };
        return ExprStmtInstruction;
    })(StmtInstruction);

    
    return ExprStmtInstruction;
});
//# sourceMappingURL=ExprStmtInstruction.js.map
