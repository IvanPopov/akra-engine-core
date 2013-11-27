/// <reference path="../idl/IAFXInstruction.ts" />

/// <reference path="Instruction.ts" />

module akra.fx {

    export class TypedInstruction extends Instruction implements IAFXTypedInstruction {
        protected _pType: IAFXTypeInstruction;

        constructor() {
            super();
            this._pType = null;
            this._eInstructionType = EAFXInstructionTypes.k_TypedInstruction;
        }

        getType(): IAFXTypeInstruction {
            return this._pType;
        }

        setType(pType: IAFXTypeInstruction): void {
            this._pType = pType;
        }

        clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXTypedInstruction {
            var pClonedInstruction: IAFXTypedInstruction = <IAFXTypedInstruction>(super.clone(pRelationMap));
            if (!isNull(this.getType())) {
                pClonedInstruction.setType(this.getType().clone(pRelationMap));
            }
            return pClonedInstruction;
        }
    }

}