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

        _isConst(): boolean {
            return (<IAFXExprInstruction>this._getInstructions()[0])._isConst();
        }

        _evaluate(): boolean {
            if ((<IAFXExprInstruction>this._getInstructions()[0])._evaluate()) {
                this._pLastEvalResult = (<IAFXExprInstruction>this._getInstructions()[0])._getEvalValue();
                return true;
            }
            else {
                return false;
            }
        }

        // _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
        //				   eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
        // 	var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this._getInstructions()[0];
        // 	pSubExpr._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        // }
    }
}