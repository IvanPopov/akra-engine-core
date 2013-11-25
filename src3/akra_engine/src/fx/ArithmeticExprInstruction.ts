import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent someExpr + / - * % someExpr
 * (+|-|*|/|%) Instruction Instruction
 */
class ArithmeticExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_ArithmeticExprInstruction;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        super.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
    }

    evaluate(): boolean {
        var pOperands: AIAFXExprInstruction[] = <AIAFXExprInstruction[]>this.getInstructions();
        var pValL: any = pOperands[0].evaluate() ? pOperands[0].getEvalValue() : null;
        var pValR: any = pOperands[1].evaluate() ? pOperands[1].getEvalValue() : null;

        if (isNull(pValL) || isNull(pValR)) {
            return false;
        }

        try {
            switch (this.getOperator()) {
                case "+":
                    this._pLastEvalResult = pValL + pValR;
                    break;
                case "-":
                    this._pLastEvalResult = pValL - pValR;
                    break;
                case "*":
                    this._pLastEvalResult = pValL * pValR;
                    break;
                case "/":
                    this._pLastEvalResult = pValL / pValR;
                    break;
                case "%":
                    this._pLastEvalResult = pValL % pValR;
                    break;
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this.getInstructions()[0].toFinalCode();
        sCode += this.getOperator();
        sCode += this.getInstructions()[1].toFinalCode();
        return sCode;
    }

    isConst(): boolean {
        var pOperands: AIAFXExprInstruction[] = <AIAFXExprInstruction[]>this.getInstructions();
        return pOperands[0].isConst() && pOperands[1].isConst();
    }
}


export = ArithmeticExprInstruction;