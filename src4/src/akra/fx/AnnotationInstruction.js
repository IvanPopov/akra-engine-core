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
        var AnnotationInstruction = (function (_super) {
            __extends(AnnotationInstruction, _super);
            function AnnotationInstruction() {
                _super.call(this);
                this._eInstructionType = akra.EAFXInstructionTypes.k_AnnotationInstruction;
            }
            return AnnotationInstruction;
        })(fx.Instruction);
        fx.AnnotationInstruction = AnnotationInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
