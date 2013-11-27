var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="ExprInstruction.ts" />
    (function (fx) {
        /**
        * Represent (type) expr
        * EMPTY_OPERATOR VariableTypeInstruction Instruction
        */
        var CastExprInstruction = (function (_super) {
            __extends(CastExprInstruction, _super);
            function CastExprInstruction() {
                _super.call(this);
                this._pInstructionList = [null, null];
                this._eInstructionType = akra.EAFXInstructionTypes.k_CastExprInstruction;
            }
            CastExprInstruction.prototype.toFinalCode = function () {
                var sCode = "";
                sCode += this.getInstructions()[0].toFinalCode();
                sCode += "(";
                sCode += this.getInstructions()[1].toFinalCode();
                sCode += ")";
                return sCode;
            };

            CastExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = akra.EVarUsedMode.k_Undefined; }
                var pSubExpr = this.getInstructions()[1];
                pSubExpr.addUsedData(pUsedDataCollector, akra.EVarUsedMode.k_Read);
                // pUsedDataCollector[this.getType()._getInstructionID()] = this.getType();
            };

            CastExprInstruction.prototype.isConst = function () {
                return (this.getInstructions()[1]).isConst();
            };
            return CastExprInstruction;
        })(fx.ExprInstruction);
        fx.CastExprInstruction = CastExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
