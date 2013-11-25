import ExprInstruction = require("fx/ExprInstruction");
/**
 * Represent boolExpr && || boolExpr
 * (&& | ||) Instruction Instruction
 */
class LogicalExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_LogicalExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this.getInstructions()[0].toFinalCode();
        sCode += this.getOperator();
        sCode += this.getInstructions()[1].toFinalCode();
        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        super.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst() &&
            (<AIAFXExprInstruction>this.getInstructions()[1]).isConst() &&
            (<AIAFXExprInstruction>this.getInstructions()[2]).isConst();
    }
}


export = LogicalExprInstruction;