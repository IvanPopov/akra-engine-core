/// <reference path="../idl/IAFXInstruction.ts" />

/// <reference path="DeclInstruction.ts" />

module akra.fx {

    export class TypeDeclInstruction extends DeclInstruction implements IAFXTypeDeclInstruction {
        // EMPTY_OPERATOR VariableTypeInstruction

        constructor() {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_TypeDeclInstruction;
        }

        getType(): IAFXTypeInstruction {
            return <IAFXTypeInstruction>this._pInstructionList[0];
        }

        clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction {
            return <IAFXTypeDeclInstruction>super.clone(pRelationMap);
        }

        toFinalCode(): string {
            return this.getType()._toDeclString() + ";";
        }

        getName(): string {
            return this.getType().getName();
        }

        getRealName(): string {
            return this.getType().getRealName();
        }

        blend(pDecl: IAFXTypeDeclInstruction, eBlendMode: EAFXBlendMode): IAFXTypeDeclInstruction {
            if (pDecl !== this) {
                return null;
            }

            return this;
        }
    }

}
