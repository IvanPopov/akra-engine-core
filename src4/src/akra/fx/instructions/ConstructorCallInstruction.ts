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

        // isConst
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

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this._getInstructions();
            for (var i: uint = 1; i < this._nInstructions; i++) {
                pInstructionList[i].addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
            }
        }

        isConst(): boolean {
            for (var i: uint = 1; i < this._nInstructions; i++) {
                if (!(<IAFXExprInstruction>this._getInstructions()[i]).isConst()) {
                    return false;
                }
            }

            return true;
        }

        evaluate(): boolean {
            if (!this.isConst()) {
                return false;
            }

            var pRes: any = null;
            var pJSTypeCtor: any = Effect.getExternalType(this.getType());
            var pArguments: any[] = new Array(this._nInstructions - 1);

            if (isNull(pJSTypeCtor)) {
                return false;
            }

            try {
                if (Effect.isScalarType(this.getType())) {
                    var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];
                    if (this._nInstructions > 2 || !pTestedInstruction.evaluate()) {
                        return false;
                    }

                    pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
                }
                else {
                    for (var i: uint = 1; i < this._nInstructions; i++) {
                        var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[i];

                        if (pTestedInstruction.evaluate()) {
                            pArguments[i - 1] = pTestedInstruction.getEvalValue();
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
