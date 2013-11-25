/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AITexture.ts" />
/// <reference path="../idl/AIAFXSamplerState.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/TypedInstruction"], function(require, exports, __TypedInstruction__) {
    var TypedInstruction = __TypedInstruction__;

    var ExprInstruction = (function (_super) {
        __extends(ExprInstruction, _super);
        /**
        * Respresent all kind of instruction
        */
        function ExprInstruction() {
            _super.call(this);
            this._pLastEvalResult = null;
            this._eInstructionType = 21 /* k_ExprInstruction */;
        }
        ExprInstruction.prototype.evaluate = function () {
            return false;
        };

        ExprInstruction.prototype.simplify = function () {
            return false;
        };

        ExprInstruction.prototype.getEvalValue = function () {
            return this._pLastEvalResult;
        };

        ExprInstruction.prototype.isConst = function () {
            return false;
        };

        ExprInstruction.prototype.getType = function () {
            return _super.prototype.getType.call(this);
        };

        ExprInstruction.prototype.clone = function (pRelationMap) {
            return _super.prototype.clone.call(this, pRelationMap);
        };

        ExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
            if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
            var pInstructionList = this.getInstructions();

            if (isNull(pInstructionList)) {
                return;
            }

            for (var i = 0; i < this._nInstructions; i++) {
                pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
            }
        };
        return ExprInstruction;
    })(TypedInstruction);

    
    return ExprInstruction;
});
//# sourceMappingURL=ExprInstruction.js.map
