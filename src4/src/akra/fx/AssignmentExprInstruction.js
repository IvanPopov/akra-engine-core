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
        * Represent someExpr = += -= /= *= %= someExpr
        * (=|+=|-=|*=|/=|%=) Instruction Instruction
        */
        var AssignmentExprInstruction = (function (_super) {
            __extends(AssignmentExprInstruction, _super);
            function AssignmentExprInstruction() {
                _super.call(this);
                this._pInstructionList = [null, null];
                this._eInstructionType = akra.EAFXInstructionTypes.k_AssignmentExprInstruction;
            }
            AssignmentExprInstruction.prototype.toFinalCode = function () {
                var sCode = "";
                sCode += this.getInstructions()[0].toFinalCode();
                sCode += this.getOperator();
                sCode += this.getInstructions()[1].toFinalCode();
                return sCode;
            };

            AssignmentExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = akra.EVarUsedMode.k_Undefined; }
                var sOperator = this.getOperator();
                var pSubExprLeft = this.getInstructions()[0];
                var pSubExprRight = this.getInstructions()[1];

                if (eUsedMode === akra.EVarUsedMode.k_Read || sOperator !== "=") {
                    pSubExprLeft.addUsedData(pUsedDataCollector, akra.EVarUsedMode.k_ReadWrite);
                } else {
                    pSubExprLeft.addUsedData(pUsedDataCollector, akra.EVarUsedMode.k_Write);
                }

                pSubExprRight.addUsedData(pUsedDataCollector, akra.EVarUsedMode.k_Read);
            };
            return AssignmentExprInstruction;
        })(fx.ExprInstruction);
        fx.AssignmentExprInstruction = AssignmentExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
