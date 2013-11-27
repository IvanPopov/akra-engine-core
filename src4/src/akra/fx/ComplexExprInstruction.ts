/// <reference path="ExprInstruction.ts" />

module akra.fx {

    /**
     * Represent (expr)
     * EMPTY_OPERATOR ExprInstruction
     */
    class ComplexExprInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_ComplexExprInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "";

            sCode += "(" + this.getInstructions()[0].toFinalCode() + ")";

            return sCode;
        }

        isConst(): boolean {
            return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
        }

        evaluate(): boolean {
            if ((<IAFXExprInstruction>this.getInstructions()[0]).evaluate()) {
                this._pLastEvalResult = (<IAFXExprInstruction>this.getInstructions()[0]).getEvalValue();
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
}