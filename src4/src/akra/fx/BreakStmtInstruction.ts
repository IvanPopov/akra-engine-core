import StmtInstruction = require("fx/StmtInstruction");

/**
 * Reprsernt continue; break; discard;
 * (continue || break || discard) 
 */
class BreakStmtInstruction extends StmtInstruction {
    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_BreakStmtInstruction;
    }

    toFinalCode(): string {
        return this.getOperator() + ";";
    }
}

export = BreakStmtInstruction;