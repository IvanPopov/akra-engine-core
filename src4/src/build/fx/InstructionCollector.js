/// <reference path="Instruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var InstructionCollector = (function (_super) {
            __extends(InstructionCollector, _super);
            function InstructionCollector() {
                _super.call(this);
                this._pInstructionList = [];
                this._eInstructionType = 1 /* k_InstructionCollector */;
            }
            InstructionCollector.prototype.toFinalCode = function () {
                var sCode = "";
                for (var i = 0; i < this._nInstructions; i++) {
                    sCode += this.getInstructions()[i].toFinalCode();
                }

                return sCode;
            };
            return InstructionCollector;
        })(akra.fx.Instruction);
        fx.InstructionCollector = InstructionCollector;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=InstructionCollector.js.map
