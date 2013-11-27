/// <reference path="../idl/EEffectErrors.ts" />

import StmtInstruction = require("fx/StmtInstruction");

/**
 * Represent for(forInit forCond ForStep) stmt
 * for ExprInstruction or VarDeclInstruction ExprInstruction ExprInstruction StmtInstruction
 */
class ForStmtInstruction extends StmtInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null, null, null];
        this._eInstructionType = EAFXInstructionTypes.k_ForStmtInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "for(";

        sCode += this.getInstructions()[0].toFinalCode() + ";";
        sCode += this.getInstructions()[1].toFinalCode() + ";";
        sCode += this.getInstructions()[2].toFinalCode() + ")";
        sCode += this.getInstructions()[3].toFinalCode();

        return sCode;
    }

    check(eStage: ECheckStage, pInfo: any = null): boolean {
        var pInstructionList: IAFXInstruction[] = this.getInstructions();

        if (this._nInstructions !== 4) {
            this.setError(EEffectErrors.BAD_FOR_STEP_EMPTY);
            return false;
        }

        if (isNull(pInstructionList[0])) {
            this.setError(EEffectErrors.BAD_FOR_INIT_EMPTY_ITERATOR);
            return false;
        }

        if (pInstructionList[0]._getInstructionType() !== EAFXInstructionTypes.k_VariableDeclInstruction) {
            this.setError(EEffectErrors.BAD_FOR_INIT_EXPR);
            return false;
        }

        if (isNull(pInstructionList[1])) {
            this.setError(EEffectErrors.BAD_FOR_COND_EMPTY);
            return false;
        }

        if (pInstructionList[1]._getInstructionType() !== EAFXInstructionTypes.k_RelationalExprInstruction) {
            this.setError(EEffectErrors.BAD_FOR_COND_RELATION);
            return false;
        }

        if (pInstructionList[2]._getInstructionType() === EAFXInstructionTypes.k_UnaryExprInstruction ||
            pInstructionList[2]._getInstructionType() === EAFXInstructionTypes.k_AssignmentExprInstruction ||
            pInstructionList[2]._getInstructionType() === EAFXInstructionTypes.k_PostfixArithmeticInstruction) {

            var sOperator: string = pInstructionList[2].getOperator();
            if (sOperator !== "++" && sOperator !== "--" &&
                sOperator !== "+=" && sOperator !== "-=") {
                this.setError(EEffectErrors.BAD_FOR_STEP_OPERATOR, { operator: sOperator });
                return false;
            }
        }
        else {
            this.setError(EEffectErrors.BAD_FOR_STEP_EXPRESSION);
            return false;
        }

        return true;
    }

    addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
        eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
        var pForInit: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getInstructions()[0];
        var pForCondition: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
        var pForStep: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[2];
        var pForStmt: IAFXStmtInstruction = <IAFXStmtInstruction>this.getInstructions()[3];

        var pIteratorType: IAFXVariableTypeInstruction = pForInit.getType();

        pUsedDataCollector[pIteratorType._getInstructionID()] = <IAFXTypeUseInfoContainer>{
            type: pIteratorType,
            isRead: false,
            isWrite: true,
            numRead: 0,
            numWrite: 1,
            numUsed: 1
        };

        pForCondition.addUsedData(pUsedDataCollector, eUsedMode);
        pForStep.addUsedData(pUsedDataCollector, eUsedMode);
        pForStmt.addUsedData(pUsedDataCollector, eUsedMode);
    }
}


export = ForStmtInstruction;