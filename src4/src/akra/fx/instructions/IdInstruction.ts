/// <reference path="../../idl/IAFXInstruction.ts" />

/// <reference path="Instruction.ts" />

module akra.fx.instructions {
    export class IdInstruction extends Instruction implements IAFXIdInstruction {
        private _sName: string;
        private _sRealName: string;
        private _isForVarying: boolean = false;

        isVisible(): boolean {
            return this.getParent().isVisible();
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

        getName(): string {
            return this._sName;
        }

        getRealName(): string {
            if (this._isForVarying) {
                return "V_" + this._sRealName;
            }
            else {
                return this._sRealName;
            }
        }

        setName(sName: string): void {
            this._sName = sName;
            this._sRealName = sName;
        }

        setRealName(sRealName: string): void {
            this._sRealName = sRealName;
        }

        _markAsVarying(bValue: boolean): void {
            this._isForVarying = bValue;
        }

        toString(): string {
            return this._sRealName;
        }

        toFinalCode(): string {
            return this.getRealName();
        }

        clone(pRelationMap?: IAFXInstructionMap): IdInstruction {
            var pClonedInstruction: IdInstruction = <IdInstruction>(super.clone(pRelationMap));
            pClonedInstruction.setName(this._sName);
            pClonedInstruction.setRealName(this._sRealName);
            return pClonedInstruction;
        }
    }
}
