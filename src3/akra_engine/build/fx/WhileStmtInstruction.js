var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/StmtInstruction"], function(require, exports, __StmtInstruction__) {
    var StmtInstruction = __StmtInstruction__;

    /**
    * Represent while(expr) stmt
    * ( while || do_while) ExprInstruction StmtInstruction
    */
    var WhileStmtInstruction = (function (_super) {
        __extends(WhileStmtInstruction, _super);
        function WhileStmtInstruction() {
            _super.call(this);
            this._pInstructionList = [null, null];
            this._eInstructionType = 52 /* k_WhileStmtInstruction */;
        }
        WhileStmtInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            if (this.getOperator() === "while") {
                sCode += "while(";
                sCode += this.getInstructions()[0].toFinalCode();
                sCode += ")";
                sCode += this.getInstructions()[1].toFinalCode();
            } else {
                sCode += "do";
                sCode += this.getInstructions()[1].toFinalCode();
                sCode += "while(";
                sCode += this.getInstructions()[0].toFinalCode();
                sCode += ");";
            }
            return sCode;
        };
        return WhileStmtInstruction;
    })(StmtInstruction);

    
    return WhileStmtInstruction;
});
//# sourceMappingURL=WhileStmtInstruction.js.map
