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

		toFinalCode(): string {
			var sCode: string = "";

			// if((<ExprInstruction>this.getInstructions()[0]).getType().getLength() === 0){
			// 	return "";
			// }

			if (!isNull(this._pSamplerArrayDecl) && this._pSamplerArrayDecl.isDefinedByZero()) {
				sCode += this.getInstructions()[0].toFinalCode();
			}
			else {
				sCode += this.getInstructions()[0].toFinalCode();

				if (!(<IAFXExprInstruction>this.getInstructions()[0]).getType()._isCollapsed()) {
					sCode += "[" + this.getInstructions()[1].toFinalCode() + "]";
				}
			}

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
			eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pIndex: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];

			pSubExpr.addUsedData(pUsedDataCollector, eUsedMode);
			pIndex.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);

			if (pSubExpr.getType().isFromVariableDecl() && pSubExpr.getType().isSampler()) {
				this._pSamplerArrayDecl = pSubExpr.getType()._getParentVarDecl();
			}
		}

		isConst(): boolean {
			return (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
				(<IAFXExprInstruction>this.getInstructions()[1]).isConst();
		}
	}
}

