import StmtInstruction = require("fx/StmtInstruction");

/**
 * Represent if(expr) stmt or if(expr) stmt else stmt
 * ( if || if_else ) Expr Stmt [Stmt]
 */
class IfStmtInstruction extends StmtInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null, null];
        this._eInstructionType = EAFXInstructionTypes.k_IfStmtInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        if (this.getOperator() === "if") {
            sCode += "if(";
            sCode += this.getInstructions()[0].toFinalCode() + ")";
            sCode += this.getInstructions()[1].toFinalCode();
        }
        else {
            sCode += "if(";
            sCode += this.getInstructions()[0].toFinalCode() + ") ";
            sCode += this.getInstructions()[1].toFinalCode();
            sCode += "else ";
            sCode += this.getInstructions()[2].toFinalCode();
        }

        return sCode;
    }
}


export = IfStmtInstruction;