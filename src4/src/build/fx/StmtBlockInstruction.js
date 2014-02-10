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
        * Represent {stmts}
        * EMPTY_OPERATOR StmtInstruction ... StmtInstruction
        */
        var StmtBlockInstruction = (function (_super) {
            __extends(StmtBlockInstruction, _super);
            function StmtBlockInstruction() {
                _super.call(this);
                this._pInstructionList = [];
                this._eInstructionType = 49 /* k_StmtBlockInstruction */;
            }
            StmtBlockInstruction.prototype.toFinalCode = function () {
                var sCode = "{" + "\n";

                for (var i = 0; i < this._nInstructions; i++) {
                    sCode += "\t" + this._pInstructionList[i].toFinalCode() + "\n";
                }

                sCode += "}";

                return sCode;
            };
            return StmtBlockInstruction;
        })(akra.fx.StmtInstruction);
        fx.StmtBlockInstruction = StmtBlockInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=StmtBlockInstruction.js.map
