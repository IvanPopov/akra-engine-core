import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent someExpr = += -= /= *= %= someExpr
 * (=|+=|-=|*=|/=|%=) Instruction Instruction
 */
class AssignmentExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_AssignmentExprInstruction;
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
        var sOperator: string = this.getOperator();
        var pSubExprLeft: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[0];
        var pSubExprRight: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];

        if (eUsedMode === AEVarUsedMode.k_Read || sOperator !== "=") {
            pSubExprLeft.addUsedData(pUsedDataCollector, AEVarUsedMode.k_ReadWrite);
        }
        else {
            pSubExprLeft.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Write);
        }

        pSubExprRight.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
    }
}


export = AssignmentExprInstruction;