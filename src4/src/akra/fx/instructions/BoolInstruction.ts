/// <reference path="ExprInstruction.ts" />
/// <reference path="../Effect.ts" />

module akra.fx.instructions {
    export class BoolInstruction extends ExprInstruction implements IAFXLiteralInstruction {
        private _bValue: boolean;
        private static _pBoolType: IAFXVariableTypeInstruction = null;
        /**
         * EMPTY_OPERATOR EMPTY_ARGUMENTS
         */
        constructor() {
            super();

            this._bValue = true;
            this._pType = Effect.getSystemType("bool").getVariableType();
            this._eInstructionType = EAFXInstructionTypes.k_BoolInstruction;
        }

        setValue(bValue: boolean): void {
            this._bValue = bValue;
        }

        toString(): string {
            return <string><any>this._bValue;
        }

        _toFinalCode(): string {
            if (this._bValue) {
                return "true";
            }
            else {
                return "false";
            }
        }

        evaluate(): boolean {
            this._pLastEvalResult = this._bValue;
            return true;
        }

        isConst(): boolean {
            return true;
        }

        _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
            var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super._clone(pRelationMap));
            pClonedInstruction.setValue(this._bValue);
            return pClonedInstruction;
        }
    }
}

