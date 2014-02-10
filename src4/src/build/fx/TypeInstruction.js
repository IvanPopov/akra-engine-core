/// <reference path="../idl/IAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="DeclInstruction.ts" />
    (function (fx) {
        var TypeDeclInstruction = (function (_super) {
            __extends(TypeDeclInstruction, _super);
            // EMPTY_OPERATOR VariableTypeInstruction
            function TypeDeclInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 14 /* k_TypeDeclInstruction */;
            }
            TypeDeclInstruction.prototype.getType = function () {
                return this._pInstructionList[0];
            };

            TypeDeclInstruction.prototype.clone = function (pRelationMap) {
                return _super.prototype.clone.call(this, pRelationMap);
            };

            TypeDeclInstruction.prototype.toFinalCode = function () {
                return this.getType()._toDeclString() + ";";
            };

            TypeDeclInstruction.prototype.getName = function () {
                return this.getType().getName();
            };

            TypeDeclInstruction.prototype.getRealName = function () {
                return this.getType().getRealName();
            };

            TypeDeclInstruction.prototype.blend = function (pDecl, eBlendMode) {
                if (pDecl !== this) {
                    return null;
                }

                return this;
            };
            return TypeDeclInstruction;
        })(akra.fx.DeclInstruction);
        fx.TypeDeclInstruction = TypeDeclInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=TypeInstruction.js.map
