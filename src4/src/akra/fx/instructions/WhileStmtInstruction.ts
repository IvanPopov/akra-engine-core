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

		_toFinalCode(): string {
			var sCode: string = "";
			if (this._getOperator() === "while") {
				sCode += "while(";
				sCode += this._getInstructions()[0]._toFinalCode();
				sCode += ")";
				sCode += this._getInstructions()[1]._toFinalCode();
			}
			else {
				sCode += "do";
				sCode += this._getInstructions()[1]._toFinalCode();
				sCode += "while(";
				sCode += this._getInstructions()[0]._toFinalCode();
				sCode += ");";
			}
			return sCode;
		}
	}
}