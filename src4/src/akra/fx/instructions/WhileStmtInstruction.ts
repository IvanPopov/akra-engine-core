/// <reference path="StmtInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent while(expr) stmt
	 * ( while || do_while) ExprInstruction StmtInstruction
	 */
	export class WhileStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_WhileStmtInstruction;
		}

		toFinalCode(): string {
			var sCode: string = "";
			if (this.getOperator() === "while") {
				sCode += "while(";
				sCode += this.getInstructions()[0].toFinalCode();
				sCode += ")";
				sCode += this.getInstructions()[1].toFinalCode();
			}
			else {
				sCode += "do";
				sCode += this.getInstructions()[1].toFinalCode();
				sCode += "while(";
				sCode += this.getInstructions()[0].toFinalCode();
				sCode += ");";
			}
			return sCode;
		}
	}
}