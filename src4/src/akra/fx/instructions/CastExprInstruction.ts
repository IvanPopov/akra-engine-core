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

        _toFinalCode(): string {
            var sCode: string = "";
            sCode += this._getInstructions()[0]._toFinalCode();
            sCode += "(";
            sCode += this._getInstructions()[1]._toFinalCode();
            sCode += ")";
            return sCode;
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[1];
            pSubExpr._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);

            // pUsedDataCollector[this._getType()._getInstructionID()] = this._getType();
        }

        _isConst(): boolean {
            return (<IAFXExprInstruction>this._getInstructions()[1])._isConst();
        }
    }
}

