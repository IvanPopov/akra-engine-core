/// <reference path="StmtInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent expr;
	 * EMPTY_OPERTOR ExprInstruction 
	 */
	export class ExprStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_ExprStmtInstruction;
		}

		toFinalCode(): string {
			return this.getInstructions()[0].toFinalCode() + ";";
		}
	}
}