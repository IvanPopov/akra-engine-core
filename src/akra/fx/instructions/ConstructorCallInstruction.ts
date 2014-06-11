/// <reference path="ExprInstruction.ts" />
/// <reference path="../Effect.ts" />

module akra.fx.instructions {

    /**
     * Respresnt ctor(arg1,..., argn)
     * EMPTY_OPERATOR IdInstruction ExprInstruction ... ExprInstruction 
     */
    export class ConstructorCallInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_ConstructorCallInstruction;
        }

        // _isConst
        _toFinalCode(): string {
            var sCode: string = "";

            sCode += this._getInstructions()[0]._toFinalCode();
            sCode += "(";

            for (var i: uint = 1; i < this._nInstructions; i++) {
                sCode += this._getInstructions()[i]._toFinalCode();

                if (i !== this._nInstructions - 1) {
                    sCode += ",";
                }
            }

            sCode += ")";

            return sCode;
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this._getInstructions();
            for (var i: uint = 1; i < this._nInstructions; i++) {
                pInstructionList[i]._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
            }
        }

        _isConst(): boolean {
            for (var i: uint = 1; i < this._nInstructions; i++) {
                if (!(<IAFXExprInstruction>this._getInstructions()[i])._isConst()) {
                    return false;
                }
            }

            return true;
        }

        _evaluate(): boolean {
            if (!this._isConst()) {
                return false;
            }

            var pRes: any = null;
            var pJSTypeCtor: any = Effect.getExternalType(this._getType());
            var pArguments: any[] = new Array(this._nInstructions - 1);

            if (isNull(pJSTypeCtor)) {
                return false;
            }

            try {
                if (Effect.isScalarType(this._getType())) {
                    var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];
                    if (this._nInstructions > 2 || !pTestedInstruction._evaluate()) {
                        return false;
                    }

                    pRes = pJSTypeCtor(pTestedInstruction._getEvalValue());
                }
                else {
                    for (var i: uint = 1; i < this._nInstructions; i++) {
                        var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[i];

                        if (pTestedInstruction._evaluate()) {
                            pArguments[i - 1] = pTestedInstruction._getEvalValue();
                        }
                        else {
                            return false;
                        }
                    }

                    pRes = new pJSTypeCtor;
                    pRes.set.apply(pRes, pArguments);
                }
            }
            catch (e) {
                return false;
            }

            this._pLastEvalResult = pRes;
            return true;
        }
    }
}
