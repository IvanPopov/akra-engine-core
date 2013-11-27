import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");

class IntInstruction extends ExprInstruction implements AIAFXLiteralInstruction {
		private _iValue: int;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._iValue = 0;
			this._pType = Effect.getSystemType("int").getVariableType();
			this._eInstructionType = AEAFXInstructionTypes.k_IntInstruction;
		}

		/** inline */ setValue(iValue: int): void{
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

		clone(pRelationMap?: AIAFXInstructionMap): AIAFXLiteralInstruction {
			var pClonedInstruction: AIAFXLiteralInstruction = <AIAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._iValue);
			return pClonedInstruction;
		}
	}

export = IntInstruction;