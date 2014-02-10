/// <reference path="ExprInstruction.ts" />
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
        * Represent someExpr ++
        * (-- | ++) Instruction
        */
        var PostfixArithmeticInstruction = (function (_super) {
            __extends(PostfixArithmeticInstruction, _super);
            function PostfixArithmeticInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 32 /* k_PostfixArithmeticInstruction */;
            }
            PostfixArithmeticInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                sCode += this.getInstructions()[0].toFinalCode();
                sCode += this.getOperator();

                return sCode;
            };

            PostfixArithmeticInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                var pSubExpr = this.getInstructions()[0];
                pSubExpr.addUsedData(pUsedDataCollector, 2 /* k_ReadWrite */);
            };

            PostfixArithmeticInstruction.prototype.isConst = function () {
                return this.getInstructions()[0].isConst();
            };
            return PostfixArithmeticInstruction;
        })(akra.fx.ExprInstruction);
        fx.PostfixArithmeticInstruction = PostfixArithmeticInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=PostfixArithmeticInstruction.js.map
