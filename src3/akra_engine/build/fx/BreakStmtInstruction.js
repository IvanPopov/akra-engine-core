var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/StmtInstruction"], function(require, exports, __StmtInstruction__) {
    var StmtInstruction = __StmtInstruction__;

    /**
    * Reprsernt continue; break; discard;
    * (continue || break || discard)
    */
    var BreakStmtInstruction = (function (_super) {
        __extends(BreakStmtInstruction, _super);
        function BreakStmtInstruction() {
            _super.call(this);
            this._pInstructionList = null;
            this._eInstructionType = 51 /* k_BreakStmtInstruction */;
        }
        BreakStmtInstruction.prototype.toFinalCode = function () {
            return this.getOperator() + ";";
        };
        return BreakStmtInstruction;
    })(StmtInstruction);

    
    return BreakStmtInstruction;
});
//# sourceMappingURL=BreakStmtInstruction.js.map
