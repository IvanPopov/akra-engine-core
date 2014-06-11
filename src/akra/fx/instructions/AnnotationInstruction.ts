/// <reference path="../../idl/IAFXInstruction.ts" />

/// <reference path="Instruction.ts" />

module akra.fx.instructions {

    export class AnnotationInstruction extends Instruction implements IAFXAnnotationInstruction {
        constructor() {
            super();
            this._eInstructionType = EAFXInstructionTypes.k_AnnotationInstruction;
        }
    }

}