var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IAFXInstruction.ts" />
    /// <reference path="Instruction.ts" />
    (function (fx) {
        var TypedInstruction = (function (_super) {
            __extends(TypedInstruction, _super);
            function TypedInstruction() {
                _super.call(this);
                this._pType = null;
                this._eInstructionType = akra.EAFXInstructionTypes.k_TypedInstruction;
            }
            TypedInstruction.prototype.getType = function () {
                return this._pType;
            };

            TypedInstruction.prototype.setType = function (pType) {
                this._pType = pType;
            };

            TypedInstruction.prototype.clone = function (pRelationMap) {
                if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
                var pClonedInstruction = (_super.prototype.clone.call(this, pRelationMap));
                if (!akra.isNull(this.getType())) {
                    pClonedInstruction.setType(this.getType().clone(pRelationMap));
                }
                return pClonedInstruction;
            };
            return TypedInstruction;
        })(fx.Instruction);
        fx.TypedInstruction = TypedInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
