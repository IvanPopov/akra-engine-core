/// <reference path="../idl/AEEffectErrors.ts" />

import StmtInstruction = require("fx/StmtInstruction");

/**
 * Represent for(forInit forCond ForStep) stmt
 * for ExprInstruction or VarDeclInstruction ExprInstruction ExprInstruction StmtInstruction
 */
class ForStmtInstruction extends StmtInstruction {
    constructor() {
        super();
        this._pInstructionList = [null, null, null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_ForStmtInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "for(";

        sCode += this.getInstructions()[0].toFinalCode() + ";";
        sCode += this.getInstructions()[1].toFinalCode() + ";";
        sCode += this.getInstructions()[2].toFinalCode() + ")";
        sCode += this.getInstructions()[3].toFinalCode();

        return sCode;
    }

    check(eStage: AECheckStage, pInfo: any = null): boolean {
        var pInstructionList: AIAFXInstruction[] = this.getInstructions();

        if (this._nInstructions !== 4) {
            this.setError(AEEffectErrors.BAD_FOR_STEP_EMPTY);
            return false;
        }

        if (isNull(pInstructionList[0])) {
            this.setError(AEEffectErrors.BAD_FOR_INIT_EMPTY_ITERATOR);
            return false;
        }

        if (pInstructionList[0]._getInstructionType() !== AEAFXInstructionTypes.k_VariableDeclInstruction) {
            this.setError(AEEffectErrors.BAD_FOR_INIT_EXPR);
            return false;
        }

        if (isNull(pInstructionList[1])) {
            this.setError(AEEffectErrors.BAD_FOR_COND_EMPTY);
            return false;
        }

        if (pInstructionList[1]._getInstructionType() !== AEAFXInstructionTypes.k_RelationalExprInstruction) {
            this.setError(AEEffectErrors.BAD_FOR_COND_RELATION);
            return false;
        }

        if (pInstructionList[2]._getInstructionType() === AEAFXInstructionTypes.k_UnaryExprInstruction ||
            pInstructionList[2]._getInstructionType() === AEAFXInstructionTypes.k_AssignmentExprInstruction ||
            pInstructionList[2]._getInstructionType() === AEAFXInstructionTypes.k_PostfixArithmeticInstruction) {

            var sOperator: string = pInstructionList[2].getOperator();
            if (sOperator !== "++" && sOperator !== "--" &&
                sOperator !== "+=" && sOperator !== "-=") {
                this.setError(AEEffectErrors.BAD_FOR_STEP_OPERATOR, { operator: sOperator });
                return false;
            }
        }
        else {
            this.setError(AEEffectErrors.BAD_FOR_STEP_EXPRESSION);
            return false;
        }

        return true;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pForInit: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>this.getInstructions()[0];
        var pForCondition: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];
        var pForStep: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[2];
        var pForStmt: AIAFXStmtInstruction = <AIAFXStmtInstruction>this.getInstructions()[3];

        var pIteratorType: AIAFXVariableTypeInstruction = pForInit.getType();

        pUsedDataCollector[pIteratorType._getInstructionID()] = <AIAFXTypeUseInfoContainer>{
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