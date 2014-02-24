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

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        evaluate(): boolean {
            var pOperands: IAFXExprInstruction[] = <IAFXExprInstruction[]>this._getInstructions();
            var pValL: any = pOperands[0].evaluate() ? pOperands[0].getEvalValue() : null;
            var pValR: any = pOperands[1].evaluate() ? pOperands[1].getEvalValue() : null;

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

        isConst(): boolean {
            var pOperands: IAFXExprInstruction[] = <IAFXExprInstruction[]>this._getInstructions();
            return pOperands[0].isConst() && pOperands[1].isConst();
        }
    }


}