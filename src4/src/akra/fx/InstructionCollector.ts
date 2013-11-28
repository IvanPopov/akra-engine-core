/// <reference path="Instruction.ts" />

module akra.fx {
    export class InstructionCollector extends Instruction {
        constructor() {
            super();
            this._pInstructionList = [];
            this._eInstructionType = EAFXInstructionTypes.k_InstructionCollector;
        }

        toFinalCode(): string {
            var sCode: string = "";
            for (var i: uint = 0; i < this._nInstructions; i++) {
                sCode += this.getInstructions()[i].toFinalCode();
            }

            return sCode;
        }
    }

}