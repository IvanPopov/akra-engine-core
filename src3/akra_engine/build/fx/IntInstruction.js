var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction", "fx/Effect"], function(require, exports, __ExprInstruction__, __Effect__) {
    var ExprInstruction = __ExprInstruction__;
    var Effect = __Effect__;

    var IntInstruction = (function (_super) {
        __extends(IntInstruction, _super);
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        function IntInstruction() {
            _super.call(this);
            this._iValue = 0;
            this._pType = Effect.getSystemType("int").getVariableType();
            this._eInstructionType = 8 /* k_IntInstruction */;
        }
        /** inline */ IntInstruction.prototype.setValue = function (iValue) {
            this._iValue = iValue;
        };

        IntInstruction.prototype.toString = function () {
            return this._iValue;
        };

        IntInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this._iValue.toString();
            return sCode;
        };

        IntInstruction.prototype.evaluate = function () {
            this._pLastEvalResult = this._iValue;
            return true;
        };

        IntInstruction.prototype.isConst = function () {
            return true;
        };

        IntInstruction.prototype.clone = function (pRelationMap) {
            var pClonedInstruction = (_super.prototype.clone.call(this, pRelationMap));
            pClonedInstruction.setValue(this._iValue);
            return pClonedInstruction;
        };
        return IntInstruction;
    })(ExprInstruction);

    
    return IntInstruction;
});
//# sourceMappingURL=IntInstruction.js.map
