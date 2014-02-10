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
        * Represent if(expr) stmt or if(expr) stmt else stmt
        * ( if || if_else ) Expr Stmt [Stmt]
        */
        var IfStmtInstruction = (function (_super) {
            __extends(IfStmtInstruction, _super);
            function IfStmtInstruction() {
                _super.call(this);
                this._pInstructionList = [null, null, null];
                this._eInstructionType = 54 /* k_IfStmtInstruction */;
            }
            IfStmtInstruction.prototype.toFinalCode = function () {
                var sCode = "";
                if (this.getOperator() === "if") {
                    sCode += "if(";
                    sCode += this.getInstructions()[0].toFinalCode() + ")";
                    sCode += this.getInstructions()[1].toFinalCode();
                } else {
                    sCode += "if(";
                    sCode += this.getInstructions()[0].toFinalCode() + ") ";
                    sCode += this.getInstructions()[1].toFinalCode();
                    sCode += "else ";
                    sCode += this.getInstructions()[2].toFinalCode();
                }

                return sCode;
            };
            return IfStmtInstruction;
        })(akra.fx.StmtInstruction);
        fx.IfStmtInstruction = IfStmtInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=IfStmtInstruction.js.map
