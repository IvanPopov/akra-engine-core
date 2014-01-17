/// <reference path="ExprInstruction.ts" />

module akra.fx {

    /**
     * Represen boolExpr ? someExpr : someExpr
     * EMPTY_OPERATOR Instruction Instruction Instruction 
     */
    export class ConditionalExprInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null, null, null];
            this._eInstructionType = EAFXInstructionTypes.k_ConditionalExprInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "";
            sCode += this.getInstructions()[0].toFinalCode();
            sCode += "?";
            sCode += this.getInstructions()[1].toFinalCode();
            sCode += ":";
            sCode += this.getInstructions()[2].toFinalCode();
            return sCode;
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        isConst(): boolean {
            return (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
                (<IAFXExprInstruction>this.getInstructions()[1]).isConst();
        }
    }
}

