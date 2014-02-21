/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {
    /**
     * Represent (type) expr
     * EMPTY_OPERATOR VariableTypeInstruction Instruction
     */
    export class CastExprInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null, null];
            this._eInstructionType = EAFXInstructionTypes.k_CastExprInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "";
            sCode += this.getInstructions()[0].toFinalCode();
            sCode += "(";
            sCode += this.getInstructions()[1].toFinalCode();
            sCode += ")";
            return sCode;
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
            pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);

            // pUsedDataCollector[this.getType()._getInstructionID()] = this.getType();
        }

        isConst(): boolean {
            return (<IAFXExprInstruction>this.getInstructions()[1]).isConst();
        }
    }
}

