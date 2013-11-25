var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/StmtInstruction"], function(require, exports, __StmtInstruction__) {
    var StmtInstruction = __StmtInstruction__;

    /**
    * Represent return expr;
    * return ExprInstruction
    */
    var ReturnStmtInstruction = (function (_super) {
        __extends(ReturnStmtInstruction, _super);
        function ReturnStmtInstruction() {
            _super.call(this);
            this._pPreparedCode = "";
            this._isPositionReturn = false;
            this._isColorReturn = false;
            this._isOnlyReturn = false;
            this._pInstructionList = [null];
            this._sOperatorName = "return";
            this._eInstructionType = 56 /* k_ReturnStmtInstruction */;
        }
        ReturnStmtInstruction.prototype.prepareFor = function (eUsedMode) {
            var pReturn = this.getInstructions()[0];
            if (isNull(pReturn)) {
                return;
            }

            if (eUsedMode === 0 /* k_Vertex */) {
                if (pReturn.getType().isBase()) {
                    this._isPositionReturn = true;
                } else {
                    this._isOnlyReturn = true;
                }
            } else if (eUsedMode === 1 /* k_Pixel */) {
                this._isColorReturn = true;
            }

            for (var i = 0; i < this._nInstructions; i++) {
                this._pInstructionList[i].prepareFor(eUsedMode);
            }
        };

        ReturnStmtInstruction.prototype.toFinalCode = function () {
            if (this._isPositionReturn) {
                return "Out.POSITION=" + this._pInstructionList[0].toFinalCode() + "; return;";
            }
            if (this._isColorReturn) {
                //return "gl_FragColor=" + this._pInstructionList[0].toFinalCode() + "; return;";
                return "resultAFXColor=" + this._pInstructionList[0].toFinalCode() + "; return;";
            }
            if (this._isOnlyReturn) {
                return "return;";
            }

            if (this._nInstructions > 0) {
                return "return " + this._pInstructionList[0].toFinalCode() + ";";
            } else {
                return "return;";
            }
        };
        return ReturnStmtInstruction;
    })(StmtInstruction);

    
    return ReturnStmtInstruction;
});
//# sourceMappingURL=ReturnStmtInstruction.js.map
