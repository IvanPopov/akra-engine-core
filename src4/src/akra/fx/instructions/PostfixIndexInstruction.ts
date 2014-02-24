/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

	/**
	 * Represent someExpr[someIndex]
	 * EMPTY_OPERATOR Instruction ExprInstruction
	 */
	export class PostfixIndexInstruction extends ExprInstruction {
		private _pSamplerArrayDecl: IAFXVariableDeclInstruction = null;

		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixIndexInstruction;
		}

		_toFinalCode(): string {
			var sCode: string = "";

			// if((<ExprInstruction>this._getInstructions()[0]).getType()._getLength() === 0){
			// 	return "";
			// }

			if (!isNull(this._pSamplerArrayDecl) && this._pSamplerArrayDecl.isDefinedByZero()) {
				sCode += this._getInstructions()[0]._toFinalCode();
			}
			else {
				sCode += this._getInstructions()[0]._toFinalCode();

				if (!(<IAFXExprInstruction>this._getInstructions()[0]).getType()._isCollapsed()) {
					sCode += "[" + this._getInstructions()[1]._toFinalCode() + "]";
				}
			}

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];
			var pIndex: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];

			pSubExpr.addUsedData(pUsedDataCollector, eUsedMode);
			pIndex.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);

			if (pSubExpr.getType()._isFromVariableDecl() && pSubExpr.getType()._isSampler()) {
				this._pSamplerArrayDecl = pSubExpr.getType()._getParentVarDecl();
			}
		}

		isConst(): boolean {
			return (<IAFXExprInstruction>this._getInstructions()[0]).isConst() &&
				(<IAFXExprInstruction>this._getInstructions()[1]).isConst();
		}
	}
}

