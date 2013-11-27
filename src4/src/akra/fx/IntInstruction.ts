import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");

class IntInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _iValue: int;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._iValue = 0;
			this._pType = Effect.getSystemType("int").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_IntInstruction;
		}

		/**  */ setValue(iValue: int): void{
			this._iValue = iValue;
		}

		toString(): string {
			return <string><any>this._iValue;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this._iValue.toString();
			return sCode;			
		}

		evaluate(): boolean {
			this._pLastEvalResult = this._iValue;
			return true;
		}

		isConst(): boolean {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._iValue);
			return pClonedInstruction;
		}
	}

export = IntInstruction;