/// <reference path="ExprInstruction.ts" />


module akra.fx.instructions {

    /**
     * Represent someExpr = += -= /= *= %= someExpr
     * (=|+=|-=|*=|/=|%=) Instruction Instruction
     */
    export class AssignmentExprInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null, null];
            this._eInstructionType = EAFXInstructionTypes.k_AssignmentExprInstruction;
        }

        _toFinalCode(): string {
            var sCode: string = "";
            sCode += this._getInstructions()[0]._toFinalCode();
            sCode += this._getOperator();
            sCode += this._getInstructions()[1]._toFinalCode();
            return sCode;
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var sOperator: string = this._getOperator();
            var pSubExprLeft: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];
            var pSubExprRight: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];

            if (eUsedMode === EVarUsedMode.k_Read || sOperator !== "=") {
                pSubExprLeft.addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
            }
            else {
                pSubExprLeft.addUsedData(pUsedDataCollector, EVarUsedMode.k_Write);
            }

            pSubExprRight.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }
    }
}
