/// <reference path="ExprInstruction.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        /**
        * Represetn compile vs_func(...args)
        * compile IdExprInstruction ExprInstruction ... ExprInstruction
        */
        var CompileExprInstruction = (function (_super) {
            __extends(CompileExprInstruction, _super);
            function CompileExprInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 38 /* k_CompileExprInstruction */;
            }
            CompileExprInstruction.prototype.getFunction = function () {
                return this._pInstructionList[0].getParent().getParent();
            };
            return CompileExprInstruction;
        })(akra.fx.ExprInstruction);
        fx.CompileExprInstruction = CompileExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=CompileExprInstruction.js.map
