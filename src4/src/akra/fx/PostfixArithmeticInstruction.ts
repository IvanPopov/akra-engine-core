import ExprInstruction = require("fx/ExprInstruction");
/**
 * Represent someExpr ++
 * (-- | ++) Instruction
 */
class PostfixArithmeticInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = EAFXInstructionTypes.k_PostfixArithmeticInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        sCode += this.getInstructions()[0].toFinalCode();
        sCode += this.getOperator();

        return sCode;
    }

    addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
        eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
        var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
        pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
    }

    isConst(): boolean {
        return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
    }
}

export = PostfixArithmeticInstruction;