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

        _evaluate(): boolean {
            return false;
        }

        _simplify(): boolean {
            return false;
        }

        _getEvalValue(): any {
            return this._pLastEvalResult;
        }

        _isConst(): boolean {
            return false;
        }

        _getType(): IAFXVariableTypeInstruction {
            return <IAFXVariableTypeInstruction>super._getType();
        }

        _clone(pRelationMap?: IAFXInstructionMap): IAFXExprInstruction {
            return <IAFXExprInstruction>super._clone(pRelationMap);
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this._getInstructions();

            if (isNull(pInstructionList)) {
                return;
            }

            for (var i: uint = 0; i < this._nInstructions; i++) {
                pInstructionList[i]._addUsedData(pUsedDataCollector, eUsedMode);
            }
        }
    }

}