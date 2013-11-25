/// <reference path="../idl/AIAFXInstruction.ts" />

import Instruction = require("fx/Instruction");

class TypedInstruction extends Instruction implements AIAFXTypedInstruction {
    protected _pType: AIAFXTypeInstruction;

    constructor() {
        super();
        this._pType = null;
        this._eInstructionType = AEAFXInstructionTypes.k_TypedInstruction;
    }

    getType(): AIAFXTypeInstruction {
        return this._pType;
    }

    setType(pType: AIAFXTypeInstruction): void {
        this._pType = pType;
    }

    clone(pRelationMap: AIAFXInstructionMap = <AIAFXInstructionMap>{}): AIAFXTypedInstruction {
        var pClonedInstruction: AIAFXTypedInstruction = <AIAFXTypedInstruction>(super.clone(pRelationMap));
        if (!isNull(this.getType())) {
            pClonedInstruction.setType(this.getType().clone(pRelationMap));
        }
        return pClonedInstruction;
    }
}

export = TypedInstruction;