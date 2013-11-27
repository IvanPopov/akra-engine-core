/// <reference path="../idl/AIAFXInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fx/Instruction"], function(require, exports, __Instruction__) {
    var Instruction = __Instruction__;

    var AnnotationInstruction = (function (_super) {
        __extends(AnnotationInstruction, _super);
        function AnnotationInstruction() {
            _super.call(this);
            this._eInstructionType = 16 /* k_AnnotationInstruction */;
        }
        return AnnotationInstruction;
    })(Instruction);

    
    return AnnotationInstruction;
});
//# sourceMappingURL=AnnotationInstruction.js.map
