import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represen boolExpr ? someExpr : someExpr
 * EMPTY_OPERATOR Instruction Instruction Instruction 
 */
class ConditionalExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_ConditionalExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this.getInstructions()[0].toFinalCode();
        sCode += "?";
        sCode += this.getInstructions()[1].toFinalCode();
        sCode += ":";
        sCode += this.getInstructions()[2].toFinalCode();
        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        super.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst() &&
            (<AIAFXExprInstruction>this.getInstructions()[1]).isConst();
    }
}

export = ConditionalExprInstruction;