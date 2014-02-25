/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

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

		_prepareFor(eUsedMode: EFunctionType) {
			if (!this._getInstructions()[0]._isVisible()) {
				this._bToFinalFirst = false;
			}

			if (!this._getInstructions()[1]._isVisible()) {
				this._bToFinalSecond = false;
			}

			this._getInstructions()[0]._prepareFor(eUsedMode);
			this._getInstructions()[1]._prepareFor(eUsedMode);
		}

		_toFinalCode(): string {
			var sCode: string = "";

			sCode += this._bToFinalFirst ? this._getInstructions()[0]._toFinalCode() : "";
			sCode += this._bToFinalFirst ? "." : "";
			sCode += this._bToFinalSecond ? this._getInstructions()[1]._toFinalCode() : "";

			return sCode;
		}

		_addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];
			var pPoint: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];

			pSubExpr._addUsedData(pUsedDataCollector, EVarUsedMode.k_Undefined);
			pPoint._addUsedData(pUsedDataCollector, eUsedMode);
		}

		_isConst(): boolean {
			return (<IAFXExprInstruction>this._getInstructions()[0])._isConst();
		}
	}
}

