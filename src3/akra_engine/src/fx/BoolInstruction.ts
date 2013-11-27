import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");

class BoolInstruction extends ExprInstruction implements AIAFXLiteralInstruction {
    private _bValue: boolean;
    private static _pBoolType: AIAFXVariableTypeInstruction = null;
    /**
     * EMPTY_OPERATOR EMPTY_ARGUMENTS
     */
    constructor() {
        super();

        this._bValue = true;
        this._pType = Effect.getSystemType("boolean").getVariableType();
        this._eInstructionType = AEAFXInstructionTypes.k_BoolInstruction;
    }

    setValue(bValue: boolean): void {
        this._bValue = bValue;
    }

    toString(): string {
        return <string><any>this._bValue;
    }

    toFinalCode(): string {
        if (this._bValue) {
            return "true";
        }
        else {
            return "false";
        }
    }

    evaluate(): boolean {
        this._pLastEvalResult = this._bValue;
        return true;
    }

    isConst(): boolean {
        return true;
    }

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXLiteralInstruction {
        var pClonedInstruction: AIAFXLiteralInstruction = <AIAFXLiteralInstruction>(super.clone(pRelationMap));
        pClonedInstruction.setValue(this._bValue);
        return pClonedInstruction;
    }
}


export = BoolInstruction;