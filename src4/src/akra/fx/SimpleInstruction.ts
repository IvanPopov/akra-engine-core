/// <reference path="../idl/IAFXInstruction.ts" />

import Instruction = require("fx/Instruction");

class SimpleInstruction extends Instruction implements IAFXSimpleInstruction {
    private _sValue: string = "";

    constructor(sValue: string) {
        super();
        this._pInstructionList = null;
        this._eInstructionType = EAFXInstructionTypes.k_SimpleInstruction;

        this._sValue = sValue;
    }

    setValue(sValue: string): void {
        this._sValue = sValue;
    }

    isValue(sValue: string): boolean {
        return (this._sValue === sValue);
    }

    toString(): string {
        return this._sValue;
    }

    toFinalCode(): string {
        return this._sValue;
    }

    clone(pRelationMap?: IAFXInstructionMap): SimpleInstruction {
        var pClone: SimpleInstruction = <SimpleInstruction>super.clone(pRelationMap);
        pClone.setValue(this._sValue);
        return pClone;
    }
}


export = SimpleInstruction;