import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");


class StringInstruction extends ExprInstruction implements AIAFXLiteralInstruction {
    private _sValue: string;
    private static _pStringType: AIAFXVariableTypeInstruction = null;

    /**
     * EMPTY_OPERATOR EMPTY_ARGUMENTS
     */
    constructor() {
        super();
        this._sValue = "";
        this._pType = Effect.getSystemType("string").getVariableType();
        this._eInstructionType = AEAFXInstructionTypes.k_StringInstruction;
    }

    setValue(sValue: string): void {
        this._sValue = sValue;
    }

    toString(): string {
        return this._sValue;
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this._sValue;
        return sCode;
    }

    evaluate(): boolean {
        this._pLastEvalResult = this._sValue;
        return true;
    }

    isConst(): boolean {
        return true;
    }

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXLiteralInstruction {
        var pClonedInstruction: AIAFXLiteralInstruction = <AIAFXLiteralInstruction>(super.clone(pRelationMap));
        pClonedInstruction.setValue(this._sValue);
        return pClonedInstruction;
    }
}


export = StringInstruction;