/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

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

        _toFinalCode(): string {
            var sCode: string = "";
            sCode += this._getInstructions()[0]._toFinalCode();
            sCode += "?";
            sCode += this._getInstructions()[1]._toFinalCode();
            sCode += ":";
            sCode += this._getInstructions()[2]._toFinalCode();
            return sCode;
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        isConst(): boolean {
            return (<IAFXExprInstruction>this._getInstructions()[0]).isConst() &&
                (<IAFXExprInstruction>this._getInstructions()[1]).isConst();
        }
    }
}

