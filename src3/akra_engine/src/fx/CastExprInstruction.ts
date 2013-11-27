import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent (type) expr
 * EMPTY_OPERATOR VariableTypeInstruction Instruction
 */
class CastExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_CastExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this.getInstructions()[0].toFinalCode();
        sCode += "(";
        sCode += this.getInstructions()[1].toFinalCode();
        sCode += ")";
        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pSubExpr: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];
        pSubExpr.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);

        // pUsedDataCollector[this.getType()._getInstructionID()] = this.getType();
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[1]).isConst();
    }
}

export = CastExprInstruction;