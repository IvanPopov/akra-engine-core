/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent someExpr == != < > <= >= someExpr
	 * (==|!=|<|>|<=|>=) Instruction Instruction
	 */
	export class RelationalExprInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_RelationalExprInstruction;
		}

		_toFinalCode(): string {
			var sCode: string = "";
			sCode += this._getInstructions()[0]._toFinalCode();
			sCode += this._getOperator();
			sCode += this._getInstructions()[1]._toFinalCode();
			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
		}

		isConst(): boolean {
			return (<IAFXExprInstruction>this._getInstructions()[0]).isConst() &&
				(<IAFXExprInstruction>this._getInstructions()[1]).isConst();
		}
	}
}

