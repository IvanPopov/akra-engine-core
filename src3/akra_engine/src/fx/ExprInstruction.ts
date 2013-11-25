/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AITexture.ts" />
/// <reference path="../idl/AIAFXSamplerState.ts" />

import TypedInstruction = require("fx/TypedInstruction");

class ExprInstruction extends TypedInstruction implements AIAFXExprInstruction {
    protected _pLastEvalResult: any = null;

    /**
     * Respresent all kind of instruction
     */
    constructor() {
        super();
        this._eInstructionType = AEAFXInstructionTypes.k_ExprInstruction;
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

    getType(): AIAFXVariableTypeInstruction {
        return <AIAFXVariableTypeInstruction>super.getType();
    }

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXExprInstruction {
        return <AIAFXExprInstruction>super.clone(pRelationMap);
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pInstructionList: AIAFXAnalyzedInstruction[] = <AIAFXAnalyzedInstruction[]>this.getInstructions();

        if (isNull(pInstructionList)) {
            return;
        }

        for (var i: uint = 0; i < this._nInstructions; i++) {
            pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
        }
    }
}

export = ExprInstruction;