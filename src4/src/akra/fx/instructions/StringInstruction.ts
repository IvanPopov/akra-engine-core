/// <reference path="ExprInstruction.ts" />
/// <reference path="../Effect.ts" />

module akra.fx.instructions {

	export class StringInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _sValue: string;
		private static _pStringType: IAFXVariableTypeInstruction = null;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
			this._pType = Effect.getSystemType("string").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_StringInstruction;
		}

		setValue(sValue: string): void {
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this._sValue;
			return sCode;
		}

		evaluate(): boolean {
			this._pLastEvalResult = this._sValue;
			return true;
		}

		isConst(): boolean {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._sValue);
			return pClonedInstruction;
		}
	}
}
