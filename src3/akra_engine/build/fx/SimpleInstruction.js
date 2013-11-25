/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/Instruction"], function(require, exports, __Instruction__) {
    var Instruction = __Instruction__;

    var SimpleInstruction = (function (_super) {
        __extends(SimpleInstruction, _super);
        function SimpleInstruction(sValue) {
            _super.call(this);
            this._sValue = "";
            this._pInstructionList = null;
            this._eInstructionType = 2 /* k_SimpleInstruction */;

            this._sValue = sValue;
        }
        SimpleInstruction.prototype.setValue = function (sValue) {
            this._sValue = sValue;
        };

        SimpleInstruction.prototype.isValue = function (sValue) {
            return (this._sValue === sValue);
        };

        SimpleInstruction.prototype.toString = function () {
            return this._sValue;
        };

        SimpleInstruction.prototype.toFinalCode = function () {
            return this._sValue;
        };

        SimpleInstruction.prototype.clone = function (pRelationMap) {
            var pClone = _super.prototype.clone.call(this, pRelationMap);
            pClone.setValue(this._sValue);
            return pClone;
        };
        return SimpleInstruction;
    })(Instruction);

    
    return SimpleInstruction;
});
//# sourceMappingURL=SimpleInstruction.js.map
