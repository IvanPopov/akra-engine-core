/// <reference path="ExprInstruction.ts" />
/// <reference path="../Effect.ts" />


module akra.fx.instructions {
	export class FloatInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _fValue: float;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._fValue = 0.0;
			this._pType = Effect.getSystemType("float").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_FloatInstruction;
		}

		setValue(fValue: float): void {
			this._fValue = fValue;
		}

		toString(): string {
			return <string><any>this._fValue;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this._fValue.toString();
			if (this._fValue % 1 === 0) {
				sCode += ".";
			}
			return sCode;
		}

		evaluate(): boolean {
			this._pLastEvalResult = this._fValue;
			return true;
		}

		isConst(): boolean {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._fValue);
			return pClonedInstruction;
		}
	}
}