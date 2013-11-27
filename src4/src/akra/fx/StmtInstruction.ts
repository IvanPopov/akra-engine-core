/// <reference path="../idl/AIAFXInstruction.ts" />

import Instruction = require("fx/Instruction");

/**
 * Represent all kind of statements
 */
class StmtInstruction extends Instruction implements AIAFXStmtInstruction {
    constructor() {
        super();
        this._eInstructionType = AEAFXInstructionTypes.k_StmtInstruction;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pInstructionList: AIAFXAnalyzedInstruction[] = <AIAFXAnalyzedInstruction[]>this.getInstructions();

        if (!isNull(pUsedDataCollector)) {
            for (var i: uint = 0; i < this._nInstructions; i++) {
                pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
            }
        }
    }
}


export = StmtInstruction;