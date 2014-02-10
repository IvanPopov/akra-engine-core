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
        * Represent (expr)
        * EMPTY_OPERATOR ExprInstruction
        */
        var ComplexExprInstruction = (function (_super) {
            __extends(ComplexExprInstruction, _super);
            function ComplexExprInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 34 /* k_ComplexExprInstruction */;
            }
            ComplexExprInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                sCode += "(" + this.getInstructions()[0].toFinalCode() + ")";

                return sCode;
            };

            ComplexExprInstruction.prototype.isConst = function () {
                return this.getInstructions()[0].isConst();
            };

            ComplexExprInstruction.prototype.evaluate = function () {
                if (this.getInstructions()[0].evaluate()) {
                    this._pLastEvalResult = this.getInstructions()[0].getEvalValue();
                    return true;
                } else {
                    return false;
                }
            };
            return ComplexExprInstruction;
        })(akra.fx.ExprInstruction);
        fx.ComplexExprInstruction = ComplexExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ComplexExprInstruction.js.map
