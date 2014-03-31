/// <reference path="ExprInstruction.ts" />
/// <reference path="../Effect.ts" />

module akra.fx.instructions {
    export class IntInstruction extends ExprInstruction implements IAFXLiteralInstruction {
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

        _setValue(iValue: int): void {
            this._iValue = iValue;
        }

        toString(): string {
            return <string><any>this._iValue;
        }

        _toFinalCode(): string {
            var sCode: string = "";
            sCode += this._iValue.toString();
            return sCode;
        }

        _evaluate(): boolean {
            this._pLastEvalResult = this._iValue;
            return true;
        }

        _isConst(): boolean {
            return true;
        }

        _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
            var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super._clone(pRelationMap));
            pClonedInstruction._setValue(this._iValue);
            return pClonedInstruction;
        }
    }
}

