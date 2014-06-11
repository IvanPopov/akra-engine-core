/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent someExpr ++
	 * (-- | ++) Instruction
	 */
	export class PostfixArithmeticInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixArithmeticInstruction;
		}

		_toFinalCode(): string {
			var sCode: string = "";

			sCode += this._getInstructions()[0]._toFinalCode();
			sCode += this._getOperator();

			return sCode;
		}

		_addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];
			pSubExpr._addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
		}

		_isConst(): boolean {
			return (<IAFXExprInstruction>this._getInstructions()[0])._isConst();
		}
	}
}

