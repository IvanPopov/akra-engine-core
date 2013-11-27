/// <reference path="../idl/AIAFXInstruction.ts" />

import DeclInstruction = require("fx/DeclInstruction");

class TypeDeclInstruction extends DeclInstruction implements AIAFXTypeDeclInstruction {
    // EMPTY_OPERATOR VariableTypeInstruction

    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_TypeDeclInstruction;
    }

    getType(): AIAFXTypeInstruction {
        return <AIAFXTypeInstruction>this._pInstructionList[0];
    }

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXTypeDeclInstruction {
        return <AIAFXTypeDeclInstruction>super.clone(pRelationMap);
    }

    toFinalCode(): string {
        return this.getType()._toDeclString() + ";";
    }

    getName(): string {
        return this.getType().getName();
    }

    getRealName(): string {
        return this.getType().getRealName();
    }

    blend(pDecl: AIAFXTypeDeclInstruction, eBlendMode: AEAFXBlendMode): AIAFXTypeDeclInstruction {
        if (pDecl !== this) {
            return null;
        }

        return this;
    }
}

export = TypeDeclInstruction;
