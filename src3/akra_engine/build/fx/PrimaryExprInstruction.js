var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction"], function(require, exports, __ExprInstruction__) {
    var ExprInstruction = __ExprInstruction__;

    /**
    * Represent @ Expr
    * @ Instruction
    */
    var PrimaryExprInstruction = (function (_super) {
        __extends(PrimaryExprInstruction, _super);
        function PrimaryExprInstruction() {
            _super.call(this);
            this._pInstructionList = [null];
            this._eInstructionType = 33 /* k_PrimaryExprInstruction */;
        }
        PrimaryExprInstruction.prototype.toFinalCode = function () {
            var sCode = "";

            sCode += this.getInstructions()[0].toFinalCode();

            return sCode;
        };

        PrimaryExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            var pPointerType = this.getType();
            var pInfo = pUsedDataCollector[pPointerType._getInstructionID()];

            if (!isDef(pInfo)) {
                pInfo = {
                    type: pPointerType,
                    isRead: false,
                    isWrite: false,
                    numRead: 0,
                    numWrite: 0,
                    numUsed: 0
                };

                pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
            }

            if (eUsedMode === 0 /* k_Read */) {
                pInfo.isRead = true;
                pInfo.numRead++;
            } else if (eUsedMode === 1 /* k_Write */) {
                pInfo.isWrite = true;
                pInfo.numWrite++;
            } else if (eUsedMode === 2 /* k_ReadWrite */) {
                pInfo.isRead = true;
                pInfo.isWrite = true;
                pInfo.numRead++;
                pInfo.numWrite++;
            }

            pInfo.numUsed++;
        };
        return PrimaryExprInstruction;
    })(ExprInstruction);

    
    return PrimaryExprInstruction;
});
//# sourceMappingURL=PrimaryExprInstruction.js.map
