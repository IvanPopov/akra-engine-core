import ExprInstruction = require("fx/ExprInstruction");
/**
 * Represent someExpr ++
 * (-- | ++) Instruction
 */
class PostfixArithmeticInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_PostfixArithmeticInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        sCode += this.getInstructions()[0].toFinalCode();
        sCode += this.getOperator();

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pSubExpr: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[0];
        pSubExpr.addUsedData(pUsedDataCollector, AEVarUsedMode.k_ReadWrite);
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst();
    }
}

export = PostfixArithmeticInstruction;