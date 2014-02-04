/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="../../idl/ITexture.ts" />
/// <reference path="../../idl/IAFXSamplerState.ts" />

/// <reference path="TypedInstruction.ts" />

module akra.fx.instructions {
    export class ExprInstruction extends TypedInstruction implements IAFXExprInstruction {
        protected _pLastEvalResult: any = null;

        /**
         * Respresent all kind of instruction
         */
        constructor() {
            super();
            this._eInstructionType = EAFXInstructionTypes.k_ExprInstruction;
        }

        evaluate(): boolean {
            return false;
        }

        simplify(): boolean {
            return false;
        }

        getEvalValue(): any {
            return this._pLastEvalResult;
        }

        isConst(): boolean {
            return false;
        }

        getType(): IAFXVariableTypeInstruction {
            return <IAFXVariableTypeInstruction>super.getType();
        }

        clone(pRelationMap?: IAFXInstructionMap): IAFXExprInstruction {
            return <IAFXExprInstruction>super.clone(pRelationMap);
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this.getInstructions();

            if (isNull(pInstructionList)) {
                return;
            }

            for (var i: uint = 0; i < this._nInstructions; i++) {
                pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
            }
        }
    }

}