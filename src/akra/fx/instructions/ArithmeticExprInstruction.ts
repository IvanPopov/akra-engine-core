/// <reference path="ExprInstruction.ts" />

module akra.fx.instructions {

    /**
     * Represent someExpr + / - * % someExpr
     * (+|-|*|/|%) Instruction Instruction
     */
    export class ArithmeticExprInstruction extends ExprInstruction {
        constructor() {
            super();
            this._pInstructionList = [null, null];
            this._eInstructionType = EAFXInstructionTypes.k_ArithmeticExprInstruction;
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            super._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        _evaluate(): boolean {
            var pOperands: IAFXExprInstruction[] = <IAFXExprInstruction[]>this._getInstructions();
            var pValL: any = pOperands[0]._evaluate() ? pOperands[0]._getEvalValue() : null;
            var pValR: any = pOperands[1]._evaluate() ? pOperands[1]._getEvalValue() : null;

            if (isNull(pValL) || isNull(pValR)) {
                return false;
            }

            try {
                switch (this._getOperator()) {
                    case "+":
                        this._pLastEvalResult = pValL + pValR;
                        break;
                    case "-":
                        this._pLastEvalResult = pValL - pValR;
                        break;
                    case "*":
                        this._pLastEvalResult = pValL * pValR;
                        break;
                    case "/":
                        this._pLastEvalResult = pValL / pValR;
                        break;
                    case "%":
                        this._pLastEvalResult = pValL % pValR;
                        break;
                }
                return true;
            }
            catch (e) {
                return false;
            }
        }

        _toFinalCode(): string {
            var sCode: string = "";
            sCode += this._getInstructions()[0]._toFinalCode();
            sCode += this._getOperator();
            sCode += this._getInstructions()[1]._toFinalCode();
            return sCode;
        }

        _isConst(): boolean {
            var pOperands: IAFXExprInstruction[] = <IAFXExprInstruction[]>this._getInstructions();
            return pOperands[0]._isConst() && pOperands[1]._isConst();
        }
    }


}