/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

    /**
     * Represent (expr)
     * EMPTY_OPERATOR ExprInstruction
     */
    export class ComplexExprInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_ComplexExprInstruction;
        }

        _toFinalCode(): string {
            var sCode: string = "";

            sCode += "(" + this._getInstructions()[0]._toFinalCode() + ")";

            return sCode;
        }

        isConst(): boolean {
            return (<IAFXExprInstruction>this._getInstructions()[0]).isConst();
        }

        evaluate(): boolean {
            if ((<IAFXExprInstruction>this._getInstructions()[0]).evaluate()) {
                this._pLastEvalResult = (<IAFXExprInstruction>this._getInstructions()[0]).getEvalValue();
                return true;
            }
            else {
                return false;
            }
        }

        // addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
        //				   eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
        // 	var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];
        // 	pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        // }
    }
}