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

		_setValue(fValue: float): void {
			this._fValue = fValue;
		}

		toString(): string {
			return <string><any>this._fValue;
		}

		_toFinalCode(): string {
			var sCode: string = "";
			sCode += this._fValue.toString();
			if (this._fValue % 1 === 0) {
				sCode += ".";
			}
			return sCode;
		}

		_evaluate(): boolean {
			this._pLastEvalResult = this._fValue;
			return true;
		}

		_isConst(): boolean {
			return true;
		}

		_clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super._clone(pRelationMap));
			pClonedInstruction._setValue(this._fValue);
			return pClonedInstruction;
		}
	}
}