/// <reference path="StmtInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent if(expr) stmt or if(expr) stmt else stmt
	 * ( if || if_else ) Expr Stmt [Stmt]
	 */
	export class IfStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null, null];
			this._eInstructionType = EAFXInstructionTypes.k_IfStmtInstruction;
		}

		_toFinalCode(): string {
			var sCode: string = "";
			if (this._getOperator() === "if") {
				sCode += "if(";
				sCode += this._getInstructions()[0]._toFinalCode() + ")";
				sCode += this._getInstructions()[1]._toFinalCode();
			}
			else {
				sCode += "if(";
				sCode += this._getInstructions()[0]._toFinalCode() + ") ";
				sCode += this._getInstructions()[1]._toFinalCode();
				sCode += "else ";
				sCode += this._getInstructions()[2]._toFinalCode();
			}

			return sCode;
		}
	}
}
