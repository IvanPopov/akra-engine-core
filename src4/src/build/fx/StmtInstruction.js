/// <reference path="../idl/IAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="Instruction.ts" />
    (function (fx) {
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

                if (!akra.isNull(pUsedDataCollector)) {
                    for (var i = 0; i < this._nInstructions; i++) {
                        pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
                    }
                }
            };
            return StmtInstruction;
        })(akra.fx.Instruction);
        fx.StmtInstruction = StmtInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=StmtInstruction.js.map
