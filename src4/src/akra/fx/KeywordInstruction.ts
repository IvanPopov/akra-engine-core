/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="Instruction.ts" />

module akra.fx {
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

		setValue(sValue: string): void {
			this._sValue = sValue;
		}

		isValue(sTestValue: string): boolean {
			return this._sValue === sTestValue;
		}

		toString(): string {
			return this._sValue;
		}

		toFinalCode(): string {
			return this._sValue;
		}
	}
}