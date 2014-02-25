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

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            super._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        _isConst(): boolean {
            return (<IAFXExprInstruction>this._getInstructions()[0])._isConst() &&
                (<IAFXExprInstruction>this._getInstructions()[1])._isConst();
        }
    }
}

