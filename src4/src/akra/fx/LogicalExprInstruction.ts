import ExprInstruction = require("fx/ExprInstruction");
/**
 * Represent boolExpr && || boolExpr
 * (&& | ||) Instruction Instruction
 */
class LogicalExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = EAFXInstructionTypes.k_LogicalExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this.getInstructions()[0].toFinalCode();
        sCode += this.getOperator();
        sCode += this.getInstructions()[1].toFinalCode();
        return sCode;
    }

    addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
        eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
        super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
    }

    isConst(): boolean {
        return (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
            (<IAFXExprInstruction>this.getInstructions()[1]).isConst() &&
            (<IAFXExprInstruction>this.getInstructions()[2]).isConst();
    }
}


export = LogicalExprInstruction;