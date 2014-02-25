/// <reference path="../../idl/IAFXInstruction.ts" />

/// <reference path="Instruction.ts" />

module akra.fx.instructions {
    export class IdInstruction extends Instruction implements IAFXIdInstruction {
        private _sName: string;
        private _sRealName: string;
        private _isForVarying: boolean = false;

        _isVisible(): boolean {
            return this._getParent()._isVisible();
        }
        /**
         * EMPTY_OPERATOR EMPTY_ARGUMENTS
         */
        constructor() {
            super();
            this._sName = "";
            this._sRealName = "";
            this._eInstructionType = EAFXInstructionTypes.k_IdInstruction;
        }

        _getName(): string {
            return this._sName;
        }

        _getRealName(): string {
            if (this._isForVarying) {
                return "V_" + this._sRealName;
            }
            else {
                return this._sRealName;
            }
        }

        _setName(sName: string): void {
            this._sName = sName;
            this._sRealName = sName;
        }

        _setRealName(sRealName: string): void {
            this._sRealName = sRealName;
        }

        _markAsVarying(bValue: boolean): void {
            this._isForVarying = bValue;
        }

        toString(): string {
            return this._sRealName;
        }

        _toFinalCode(): string {
            return this._getRealName();
        }

        _clone(pRelationMap?: IAFXInstructionMap): IdInstruction {
            var pClonedInstruction: IdInstruction = <IdInstruction>(super._clone(pRelationMap));
            pClonedInstruction._setName(this._sName);
            pClonedInstruction._setRealName(this._sRealName);
            return pClonedInstruction;
        }
    }
}
