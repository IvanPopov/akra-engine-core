/// <reference path="StmtInstruction.ts" />

module akra.fx.instructions {

    /**
     * Reprsernt continue; break; discard;
     * (continue || break || discard) 
     */
    export class BreakStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = null;
            this._eInstructionType = EAFXInstructionTypes.k_BreakStmtInstruction;
        }

        toFinalCode(): string {
            return this.getOperator() + ";";
        }
    }

}