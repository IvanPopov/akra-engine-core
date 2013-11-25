var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /*
    * Represent someExpr.id
    * EMPTY_OPERATOR Instruction IdInstruction
    */
    var PostfixPointInstruction = (function (_super) {
        __extends(PostfixPointInstruction, _super);
        function PostfixPointInstruction() {
            _super.call(this);
            this._bToFinalFirst = true;
            this._bToFinalSecond = true;
            this._pInstructionList = [null, null];
            this._eInstructionType = 31 /* k_PostfixPointInstruction */;
        }
        PostfixPointInstruction.prototype.prepareFor = function (eUsedMode) {
            if (!this.getInstructions()[0].isVisible()) {
                this._bToFinalFirst = false;
            }

            if (!this.getInstructions()[1].isVisible()) {
                this._bToFinalSecond = false;
            }

            this.getInstructions()[0].prepareFor(eUsedMode);
            this.getInstructions()[1].prepareFor(eUsedMode);
        };

        PostfixPointInstruction.prototype.toFinalCode = function () {
            var sCode = "";

            sCode += this._bToFinalFirst ? this.getInstructions()[0].toFinalCode() : "";
            sCode += this._bToFinalFirst ? "." : "";
            sCode += this._bToFinalSecond ? this.getInstructions()[1].toFinalCode() : "";

            return sCode;
        };

        PostfixPointInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            var pSubExpr = this.getInstructions()[0];
            var pPoint = this.getInstructions()[1];

            pSubExpr.addUsedData(pUsedDataCollector, 3 /* k_Undefined */);
            pPoint.addUsedData(pUsedDataCollector, eUsedMode);
        };

        PostfixPointInstruction.prototype.isConst = function () {
            return (this.getInstructions()[0]).isConst();
        };
        return PostfixPointInstruction;
    })(ExprInstruction);

    
    return PostfixPointInstruction;
});
//# sourceMappingURL=PostfixPointInstruction.js.map
