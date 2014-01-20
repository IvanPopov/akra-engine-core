/// <reference path="StmtInstruction.ts" />

module akra.fx {

    /**
     * Represent {stmts}
     * EMPTY_OPERATOR StmtInstruction ... StmtInstruction
     */
    export class StmtBlockInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [];
            this._eInstructionType = EAFXInstructionTypes.k_StmtBlockInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "{" + "\n";

            for (var i: uint = 0; i < this._nInstructions; i++) {
                sCode += "\t" + this._pInstructionList[i].toFinalCode() + "\n";
            }

            sCode += "}";

            return sCode;
        }
    }
}