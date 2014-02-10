/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="TypedInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var DeclInstruction = (function (_super) {
            __extends(DeclInstruction, _super);
            function DeclInstruction() {
                _super.call(this);
                this._sSemantic = "";
                this._pAnnotation = null;
                this._bForPixel = true;
                this._bForVertex = true;
                this._isBuiltIn = false;
                this._eInstructionType = 7 /* k_DeclInstruction */;
            }
            DeclInstruction.prototype.setSemantic = function (sSemantic) {
                this._sSemantic = sSemantic;
            };

            DeclInstruction.prototype.setAnnotation = function (pAnnotation) {
                this._pAnnotation = pAnnotation;
            };

            DeclInstruction.prototype.getName = function () {
                return "";
            };

            DeclInstruction.prototype.getRealName = function () {
                return "";
            };

            DeclInstruction.prototype.getNameId = function () {
                return null;
            };

            DeclInstruction.prototype.getSemantic = function () {
                return this._sSemantic;
            };

            DeclInstruction.prototype.isBuiltIn = function () {
                return this._isBuiltIn;
            };

            DeclInstruction.prototype.setBuiltIn = function (isBuiltIn) {
                this._isBuiltIn = isBuiltIn;
            };

            DeclInstruction.prototype._isForAll = function () {
                return this._bForVertex && this._bForPixel;
            };
            DeclInstruction.prototype._isForPixel = function () {
                return this._bForPixel;
            };
            DeclInstruction.prototype._isForVertex = function () {
                return this._bForVertex;
            };

            DeclInstruction.prototype._setForAll = function (canUse) {
                this._bForVertex = canUse;
                this._bForPixel = canUse;
            };
            DeclInstruction.prototype._setForPixel = function (canUse) {
                this._bForPixel = canUse;
            };
            DeclInstruction.prototype._setForVertex = function (canUse) {
                this._bForVertex = canUse;
            };

            DeclInstruction.prototype.clone = function (pRelationMap) {
                if (typeof pRelationMap === "undefined") { pRelationMap = {}; }
                var pClonedInstruction = (_super.prototype.clone.call(this, pRelationMap));
                pClonedInstruction.setSemantic(this._sSemantic);
                pClonedInstruction.setAnnotation(this._pAnnotation);
                return pClonedInstruction;
            };
            return DeclInstruction;
        })(akra.fx.TypedInstruction);
        fx.DeclInstruction = DeclInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=DeclInstruction.js.map
