/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/Instruction"], function(require, exports, __Instruction__) {
    var Instruction = __Instruction__;

    /**
    * Represent all kind of statements
    */
    var StmtInstruction = (function (_super) {
        __extends(StmtInstruction, _super);
        function StmtInstruction() {
            _super.call(this);
            this._eInstructionType = 48 /* k_StmtInstruction */;
        }
        StmtInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            var pInstructionList = this.getInstructions();

            if (!isNull(pUsedDataCollector)) {
                for (var i = 0; i < this._nInstructions; i++) {
                    pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
                }
            }
        };
        return StmtInstruction;
    })(Instruction);

    
    return StmtInstruction;
});
//# sourceMappingURL=StmtInstruction.js.map
