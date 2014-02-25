/// <reference path="../../idl/IAFXInstruction.ts" />

/// <reference path="Instruction.ts" />

module akra.fx.instructions {

    export class TypedInstruction extends Instruction implements IAFXTypedInstruction {
        protected _pType: IAFXTypeInstruction;

        constructor() {
            super();
            this._pType = null;
            this._eInstructionType = EAFXInstructionTypes.k_TypedInstruction;
        }

        _getType(): IAFXTypeInstruction {
            return this._pType;
        }

        _setType(pType: IAFXTypeInstruction): void {
            this._pType = pType;
        }

        _clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXTypedInstruction {
            var pClonedInstruction: IAFXTypedInstruction = <IAFXTypedInstruction>(super._clone(pRelationMap));
            if (!isNull(this._getType())) {
                pClonedInstruction._setType(this._getType()._clone(pRelationMap));
            }
            return pClonedInstruction;
        }
    }

}