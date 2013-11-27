import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent + - ! ++ -- expr
 * (+|-|!|++|--|) Instruction
 */
class UnaryExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_UnaryExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        sCode += this.getOperator();
        sCode += this.getInstructions()[0].toFinalCode();
        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        if (this.getOperator() === "++" || this.getOperator() === "--") {
            (<AIAFXExprInstruction>this.getInstructions()[0]).addUsedData(pUsedDataCollector, AEVarUsedMode.k_ReadWrite);
        }
        else {
            (<AIAFXExprInstruction>this.getInstructions()[0]).addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
        }
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst();
    }

    evaluate(): boolean {
        var sOperator: string = this.getOperator();
        var pExpr: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[0];

        if (!pExpr.evaluate()) {
            return;
        }

        var pRes: any = null;

        try {
            pRes = pExpr.getEvalValue();
            switch (sOperator) {
                case "+":
                    pRes = +pRes;
                    break;
                case "-":
                    pRes = -pRes;
                    break;
                case "!":
                    pRes = !pRes;
                    break;
                case "++":
                    pRes = ++pRes;
                    break;
                case "--":
                    pRes = --pRes;
                    break;
            }
        }
        catch (e) {
            return false;
        }

        this._pLastEvalResult = pRes;
        return true;
    }
}

export = UnaryExprInstruction;