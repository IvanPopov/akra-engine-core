/// <reference path="../idl/AIAFXInstruction.ts" />

import Instruction = require("fx/Instruction");

class AnnotationInstruction extends Instruction implements AIAFXAnnotationInstruction {
    constructor() {
        super();
        this._eInstructionType = AEAFXInstructionTypes.k_AnnotationInstruction;
    }
}

export = AnnotationInstruction;