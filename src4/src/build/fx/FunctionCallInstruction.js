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
        * Respresnt func(arg1,..., argn)
        * EMPTY_OPERATOR IdExprInstruction ExprInstruction ... ExprInstruction
        */
        var FunctionCallInstruction = (function (_super) {
            __extends(FunctionCallInstruction, _super);
            function FunctionCallInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 35 /* k_FunctionCallInstruction */;
            }
            FunctionCallInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                sCode += this.getInstructions()[0].toFinalCode();
                sCode += "(";
                for (var i = 1; i < this._nInstructions; i++) {
                    sCode += this.getInstructions()[i].toFinalCode();
                    if (i !== this._nInstructions - 1) {
                        sCode += ",";
                    }
                }
                sCode += ")";

                return sCode;
            };

            FunctionCallInstruction.prototype.getFunction = function () {
                return this._pInstructionList[0].getType().getParent().getParent();
            };

            FunctionCallInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                var pExprList = this.getInstructions();
                var pFunction = this.getFunction();
                var pArguments = pFunction.getArguments();

                pExprList[0].addUsedData(pUsedDataCollector, eUsedMode);

                for (var i = 0; i < pArguments.length; i++) {
                    if (pArguments[i].getType().hasUsage("out")) {
                        pExprList[i + 1].addUsedData(pUsedDataCollector, 1 /* k_Write */);
                    } else if (pArguments[i].getType().hasUsage("inout")) {
                        pExprList[i + 1].addUsedData(pUsedDataCollector, 2 /* k_ReadWrite */);
                    } else {
                        pExprList[i + 1].addUsedData(pUsedDataCollector, 0 /* k_Read */);
                    }
                }
            };
            return FunctionCallInstruction;
        })(akra.fx.ExprInstruction);
        fx.FunctionCallInstruction = FunctionCallInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=FunctionCallInstruction.js.map
