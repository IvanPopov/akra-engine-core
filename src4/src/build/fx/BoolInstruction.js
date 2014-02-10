/// <reference path="ExprInstruction.ts" />
/// <reference path="Effect.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var BoolInstruction = (function (_super) {
            __extends(BoolInstruction, _super);
            /**
            * EMPTY_OPERATOR EMPTY_ARGUMENTS
            */
            function BoolInstruction() {
                _super.call(this);

                this._bValue = true;
                this._pType = akra.fx.Effect.getSystemType("bool").getVariableType();
                this._eInstructionType = 10 /* k_BoolInstruction */;
            }
            BoolInstruction.prototype.setValue = function (bValue) {
                this._bValue = bValue;
            };

            BoolInstruction.prototype.toString = function () {
                return this._bValue;
            };

            BoolInstruction.prototype.toFinalCode = function () {
                if (this._bValue) {
                    return "true";
                } else {
                    return "false";
                }
            };

            BoolInstruction.prototype.evaluate = function () {
                this._pLastEvalResult = this._bValue;
                return true;
            };

            BoolInstruction.prototype.isConst = function () {
                return true;
            };

            BoolInstruction.prototype.clone = function (pRelationMap) {
                var pClonedInstruction = (_super.prototype.clone.call(this, pRelationMap));
                pClonedInstruction.setValue(this._bValue);
                return pClonedInstruction;
            };
            BoolInstruction._pBoolType = null;
            return BoolInstruction;
        })(akra.fx.ExprInstruction);
        fx.BoolInstruction = BoolInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=BoolInstruction.js.map
