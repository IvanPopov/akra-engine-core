/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/Instruction"], function(require, exports, __Instruction__) {
    var Instruction = __Instruction__;

    var KeywordInstruction = (function (_super) {
        __extends(KeywordInstruction, _super);
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        function KeywordInstruction() {
            _super.call(this);
            this._sValue = "";
            this._eInstructionType = 13 /* k_KeywordInstruction */;
        }
        KeywordInstruction.prototype.setValue = function (sValue) {
            this._sValue = sValue;
        };

        KeywordInstruction.prototype.isValue = function (sTestValue) {
            return this._sValue === sTestValue;
        };

        KeywordInstruction.prototype.toString = function () {
            return this._sValue;
        };

        KeywordInstruction.prototype.toFinalCode = function () {
            return this._sValue;
        };
        return KeywordInstruction;
    })(Instruction);

    
    return KeywordInstruction;
});
//# sourceMappingURL=KeywordInstruction.js.map
