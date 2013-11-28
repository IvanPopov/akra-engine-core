/// <reference path="ExprInstruction.ts" />

module akra.fx {

	/*
	 * Represent someExpr.id
	 * EMPTY_OPERATOR Instruction IdInstruction
	 */
	export class PostfixPointInstruction extends ExprInstruction {
		private _bToFinalFirst: boolean = true;
		private _bToFinalSecond: boolean = true;

		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixPointInstruction;
		}

		prepareFor(eUsedMode: EFunctionType) {
			if (!this.getInstructions()[0].isVisible()) {
				this._bToFinalFirst = false;
			}

			if (!this.getInstructions()[1].isVisible()) {
				this._bToFinalSecond = false;
			}

			this.getInstructions()[0].prepareFor(eUsedMode);
			this.getInstructions()[1].prepareFor(eUsedMode);
		}

		toFinalCode(): string {
			var sCode: string = "";

			sCode += this._bToFinalFirst ? this.getInstructions()[0].toFinalCode() : "";
			sCode += this._bToFinalFirst ? "." : "";
			sCode += this._bToFinalSecond ? this.getInstructions()[1].toFinalCode() : "";

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pPoint: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];

			pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Undefined);
			pPoint.addUsedData(pUsedDataCollector, eUsedMode);
		}

		isConst(): boolean {
			return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
		}
	}
}

