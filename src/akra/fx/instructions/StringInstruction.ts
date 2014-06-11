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

		_setValue(sValue: string): void {
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
		}

		_toFinalCode(): string {
			var sCode: string = "";
			sCode += this._sValue;
			return sCode;
		}

		_evaluate(): boolean {
			this._pLastEvalResult = this._sValue;
			return true;
		}

		_isConst(): boolean {
			return true;
		}

		_clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super._clone(pRelationMap));
			pClonedInstruction._setValue(this._sValue);
			return pClonedInstruction;
		}
	}
}
