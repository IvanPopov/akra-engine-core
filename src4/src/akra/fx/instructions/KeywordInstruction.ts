/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="Instruction.ts" />

module akra.fx.instructions {
	export class KeywordInstruction extends Instruction implements IAFXKeywordInstruction {
		private _sValue: string;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
			this._eInstructionType = EAFXInstructionTypes.k_KeywordInstruction;
		}

		_setValue(sValue: string): void {
			this._sValue = sValue;
		}

		_isValue(sTestValue: string): boolean {
			return this._sValue === sTestValue;
		}

		toString(): string {
			return this._sValue;
		}

		_toFinalCode(): string {
			return this._sValue;
		}
	}
}