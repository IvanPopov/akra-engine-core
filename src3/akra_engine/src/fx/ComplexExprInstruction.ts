import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent (expr)
 * EMPTY_OPERATOR ExprInstruction
 */
class ComplexExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_ComplexExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        sCode += "(" + this.getInstructions()[0].toFinalCode() + ")";

        return sCode;
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst();
    }

    evaluate(): boolean {
        if ((<AIAFXExprInstruction>this.getInstructions()[0]).evaluate()) {
            this._pLastEvalResult = (<AIAFXExprInstruction>this.getInstructions()[0]).getEvalValue();
            return true;
        }
        else {
            return false;
        }
    }

    // addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
    //				   eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
    // 	var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
    // 	pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
    // }
}

export = ComplexExprInstruction;