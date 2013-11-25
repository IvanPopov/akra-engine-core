import StmtInstruction = require("fx/StmtInstruction");

/**
 * Represent expr;
 * EMPTY_OPERTOR ExprInstruction 
 */
class ExprStmtInstruction extends StmtInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_ExprStmtInstruction;
    }

    toFinalCode(): string {
        return this.getInstructions()[0].toFinalCode() + ";";
    }
}


export = ExprStmtInstruction;