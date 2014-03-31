/// <reference path="../../idl/IAFXInstruction.ts" />

/// <reference path="Instruction.ts" />

module akra.fx.instructions {

    /**
     * Represent all kind of statements
     */
    export class StmtInstruction extends Instruction implements IAFXStmtInstruction {
        constructor() {
            super();
            this._eInstructionType = EAFXInstructionTypes.k_StmtInstruction;
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this._getInstructions();

            if (!isNull(pUsedDataCollector)) {
                for (var i: uint = 0; i < this._nInstructions; i++) {
                    pInstructionList[i]._addUsedData(pUsedDataCollector, eUsedMode);
                }
            }
        }
    }

}