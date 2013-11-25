import ExprInstruction = require("fx/ExprInstruction");

/**
  * Represetn compile vs_func(...args)
  * compile IdExprInstruction ExprInstruction ... ExprInstruction
  */
class CompileExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_CompileExprInstruction;
    }

    getFunction(): AIAFXFunctionDeclInstruction {
        return <AIAFXFunctionDeclInstruction>this._pInstructionList[0].getParent().getParent();
    }
}

export = CompileExprInstruction;