var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction", "fx/Effect"], function(require, exports, __ExprInstruction__, __Effect__) {
    var ExprInstruction = __ExprInstruction__;
    var Effect = __Effect__;

    var StringInstruction = (function (_super) {
        __extends(StringInstruction, _super);
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        function StringInstruction() {
            _super.call(this);
            this._sValue = "";
            this._pType = Effect.getSystemType("string").getVariableType();
            this._eInstructionType = 11 /* k_StringInstruction */;
        }
        StringInstruction.prototype.setValue = function (sValue) {
            this._sValue = sValue;
        };

        StringInstruction.prototype.toString = function () {
            return this._sValue;
        };

        StringInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this._sValue;
            return sCode;
        };

        StringInstruction.prototype.evaluate = function () {
            this._pLastEvalResult = this._sValue;
            return true;
        };

        StringInstruction.prototype.isConst = function () {
            return true;
        };

        StringInstruction.prototype.clone = function (pRelationMap) {
            var pClonedInstruction = (_super.prototype.clone.call(this, pRelationMap));
            pClonedInstruction.setValue(this._sValue);
            return pClonedInstruction;
        };
        StringInstruction._pStringType = null;
        return StringInstruction;
    })(ExprInstruction);

    
    return StringInstruction;
});
//# sourceMappingURL=StringInstruction.js.map
