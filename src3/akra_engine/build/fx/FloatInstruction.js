var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/ExprInstruction", "fx/Effect"], function(require, exports, __ExprInstruction__, __Effect__) {
    var ExprInstruction = __ExprInstruction__;
    var Effect = __Effect__;

    var FloatInstruction = (function (_super) {
        __extends(FloatInstruction, _super);
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        function FloatInstruction() {
            _super.call(this);
            this._fValue = 0.0;
            this._pType = Effect.getSystemType("float").getVariableType();
            this._eInstructionType = 9 /* k_FloatInstruction */;
        }
        FloatInstruction.prototype.setValue = function (fValue) {
            this._fValue = fValue;
        };

        FloatInstruction.prototype.toString = function () {
            return this._fValue;
        };

        FloatInstruction.prototype.toFinalCode = function () {
            var sCode = "";
            sCode += this._fValue.toString();
            if (this._fValue % 1 === 0) {
                sCode += ".";
            }
            return sCode;
        };

        FloatInstruction.prototype.evaluate = function () {
            this._pLastEvalResult = this._fValue;
            return true;
        };

        FloatInstruction.prototype.isConst = function () {
            return true;
        };

        FloatInstruction.prototype.clone = function (pRelationMap) {
            var pClonedInstruction = (_super.prototype.clone.call(this, pRelationMap));
            pClonedInstruction.setValue(this._fValue);
            return pClonedInstruction;
        };
        return FloatInstruction;
    })(ExprInstruction);

    
    return FloatInstruction;
});
//# sourceMappingURL=FloatInstruction.js.map
