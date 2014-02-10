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
        /**
        * Respresnt ctor(arg1,..., argn)
        * EMPTY_OPERATOR IdInstruction ExprInstruction ... ExprInstruction
        */
        var ConstructorCallInstruction = (function (_super) {
            __extends(ConstructorCallInstruction, _super);
            function ConstructorCallInstruction() {
                _super.call(this);
                this._pInstructionList = [null];
                this._eInstructionType = 37 /* k_ConstructorCallInstruction */;
            }
            // isConst
            ConstructorCallInstruction.prototype.toFinalCode = function () {
                var sCode = "";

                sCode += this.getInstructions()[0].toFinalCode();
                sCode += "(";

                for (var i = 1; i < this._nInstructions; i++) {
                    sCode += this.getInstructions()[i].toFinalCode();

                    if (i !== this._nInstructions - 1) {
                        sCode += ",";
                    }
                }

                sCode += ")";

                return sCode;
            };

            ConstructorCallInstruction.prototype.addUsedData = function (pUsedDataCollector, eUsedMode) {
                if (typeof eUsedMode === "undefined") { eUsedMode = 3 /* k_Undefined */; }
                var pInstructionList = this.getInstructions();
                for (var i = 1; i < this._nInstructions; i++) {
                    pInstructionList[i].addUsedData(pUsedDataCollector, 0 /* k_Read */);
                }
            };

            ConstructorCallInstruction.prototype.isConst = function () {
                for (var i = 1; i < this._nInstructions; i++) {
                    if (!this.getInstructions()[i].isConst()) {
                        return false;
                    }
                }

                return true;
            };

            ConstructorCallInstruction.prototype.evaluate = function () {
                if (!this.isConst()) {
                    return false;
                }

                var pRes = null;
                var pJSTypeCtor = akra.fx.Effect.getExternalType(this.getType());
                var pArguments = new Array(this._nInstructions - 1);

                if (akra.isNull(pJSTypeCtor)) {
                    return false;
                }

                try  {
                    if (akra.fx.Effect.isScalarType(this.getType())) {
                        var pTestedInstruction = this.getInstructions()[1];
                        if (this._nInstructions > 2 || !pTestedInstruction.evaluate()) {
                            return false;
                        }

                        pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
                    } else {
                        for (var i = 1; i < this._nInstructions; i++) {
                            var pTestedInstruction = this.getInstructions()[i];

                            if (pTestedInstruction.evaluate()) {
                                pArguments[i - 1] = pTestedInstruction.getEvalValue();
                            } else {
                                return false;
                            }
                        }

                        pRes = new pJSTypeCtor;
                        pRes.set.apply(pRes, pArguments);
                    }
                } catch (e) {
                    return false;
                }

                this._pLastEvalResult = pRes;
                return true;
            };
            return ConstructorCallInstruction;
        })(akra.fx.ExprInstruction);
        fx.ConstructorCallInstruction = ConstructorCallInstruction;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=ConstructorCallInstruction.js.map
