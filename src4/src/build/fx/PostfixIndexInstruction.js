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
        * Represent someExpr[someIndex]
        * EMPTY_OPERATOR Instruction ExprInstruction
        */
        var PostfixIndexInstruction = (function (_super) {
            __extends(PostfixIndexInstruction, _super);
            function PostfixIndexInstruction() {
                _super.call(this);
                this._pSamplerArrayDecl = null;
                this._pInstructionList = [null, null];
                this._eInstructionType = 30 /* k_PostfixIndexInstruction */;
            }
            PostfixIndexInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                // if((<ExprInstruction>this.getInstructions()[0]).getType().getLength() === 0){
                // 	return "";
                // }
                if (!akra.isNull(this._pSamplerArrayDecl) && this._pSamplerArrayDecl.isDefinedByZero()) {
                    sCode += this.getInstructions()[0].toFinalCode();
                } else {
                    sCode += this.getInstructions()[0].toFinalCode();

                    if (!this.getInstructions()[0].getType()._isCollapsed()) {
                        sCode += "[" + this.getInstructions()[1].toFinalCode() + "]";
                    }
                }

                return sCode;
            };

            PostfixIndexInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                var pSubExpr = this.getInstructions()[0];
                var pIndex = this.getInstructions()[1];

                pSubExpr.addUsedData(pUsedDataCollector, eUsedMode);
                pIndex.addUsedData(pUsedDataCollector, 0 /* k_Read */);

                if (pSubExpr.getType().isFromVariableDecl() && pSubExpr.getType().isSampler()) {
                    this._pSamplerArrayDecl = pSubExpr.getType()._getParentVarDecl();
                }
            };

            PostfixIndexInstruction.prototype.isConst = function () {
                return this.getInstructions()[0].isConst() && this.getInstructions()[1].isConst();
            };
            return PostfixIndexInstruction;
        })(akra.fx.ExprInstruction);
        fx.PostfixIndexInstruction = PostfixIndexInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=PostfixIndexInstruction.js.map
