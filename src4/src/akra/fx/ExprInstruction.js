var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IAFXInstruction.ts" />
    /// <reference path="../idl/ITexture.ts" />
    /// <reference path="../idl/IAFXSamplerState.ts" />
    /// <reference path="TypedInstruction.ts" />
    (function (fx) {
        var ExprInstruction = (function (_super) {
            __extends(ExprInstruction, _super);
            /**
            * Respresent all kind of instruction
            */
            function ExprInstruction() {
                _super.call(this);
                this._pLastEvalResult = null;
                this._eInstructionType = akra.EAFXInstructionTypes.k_ExprInstruction;
            }
            ExprInstruction.prototype.evaluate = function () {
                return false;
            };

            ExprInstruction.prototype.simplify = function () {
                return false;
            };

            ExprInstruction.prototype.getEvalValue = function () {
                return this._pLastEvalResult;
            };

            ExprInstruction.prototype.isConst = function () {
                return false;
            };

            ExprInstruction.prototype.getType = function () {
                return _super.prototype.getType.call(this);
            };

            ExprInstruction.prototype.clone = function (pRelationMap) {
                return _super.prototype.clone.call(this, pRelationMap);
            };

            ExprInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = akra.EVarUsedMode.k_Undefined; }
                var pInstructionList = this.getInstructions();

                if (akra.isNull(pInstructionList)) {
                    return;
                }

                for (var i = 0; i < this._nInstructions; i++) {
                    pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
                }
            };
            return ExprInstruction;
        })(TypedInstruction);
        fx.ExprInstruction = ExprInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
