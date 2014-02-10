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
        * Represent empty statement only semicolon ;
        * ;
        */
        var SemicolonStmtInstruction = (function (_super) {
            __extends(SemicolonStmtInstruction, _super);
            function SemicolonStmtInstruction() {
                _super.call(this);
                this._pInstructionList = null;
                this._eInstructionType = 58 /* k_SemicolonStmtInstruction */;
            }
            SemicolonStmtInstruction.prototype.toFinalCode = function () {
                return ";";
            };
            return SemicolonStmtInstruction;
        })(akra.fx.StmtInstruction);
        fx.SemicolonStmtInstruction = SemicolonStmtInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=SemicolonStmtInstruction.js.map
