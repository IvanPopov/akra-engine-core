#ifndef AFXSTMTINSTRUCTION
#define AFXSTMTINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"

module akra.fx {
    /**
     * Represent all kind of statements
     */
    export class StmtInstruction extends Instruction  implements IAFXStmtInstruction {
        constructor() {
            super();
            this._eInstructionType = EAFXInstructionTypes.k_StmtInstruction;
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, 
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this.getInstructions();

            if(!isNull(pUsedDataCollector)){
                for(var i: uint = 0; i < this._nInstructions; i++){
                    pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
                }
            }
        }
    }

    /**
     * Represent {stmts}
     * EMPTY_OPERATOR StmtInstruction ... StmtInstruction
     */
    export class StmtBlockInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [];
            this._eInstructionType = EAFXInstructionTypes.k_StmtBlockInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "{" + "\n";
            
            for(var i: uint = 0; i < this._nInstructions; i++){
                sCode += "\t" + this._pInstructionList[i].toFinalCode() + "\n";
            }

            sCode += "}";

            return sCode;
        }
    }

    /**
     * Represent expr;
     * EMPTY_OPERTOR ExprInstruction 
     */
    export class ExprStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_ExprStmtInstruction;
        }

        toFinalCode(): string {
            return this.getInstructions()[0].toFinalCode() + ";";
        }
    }

    /**
     * Reprsernt continue; break; discard;
     * (continue || break || discard) 
     */
    export class BreakStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = null;
            this._eInstructionType = EAFXInstructionTypes.k_BreakStmtInstruction;
        }

        toFinalCode(): string {
            return this.getOperator() + ";";
        }
    }

    /**
     * Represent while(expr) stmt
     * ( while || do_while) ExprInstruction StmtInstruction
     */
    export class WhileStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [null, null];
            this._eInstructionType = EAFXInstructionTypes.k_WhileStmtInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "";
            if(this.getOperator() === "while"){
                sCode += "while(";
                sCode += this.getInstructions()[0].toFinalCode();
                sCode += ")";
                sCode += this.getInstructions()[1].toFinalCode();
            }
            else{
                sCode += "do";
                sCode += this.getInstructions()[1].toFinalCode();
                sCode += "while(";
                sCode += this.getInstructions()[0].toFinalCode();
                sCode += ");";
            }
            return sCode;
        }
    }

    /**
     * Represent for(forInit forCond ForStep) stmt
     * for ExprInstruction or VarDeclInstruction ExprInstruction ExprInstruction StmtInstruction
     */
    export class ForStmtInstruction extends StmtInstruction {
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

        check(eStage: ECheckStage, pInfo: any = null): bool {
            var pInstructionList: IAFXInstruction[] = this.getInstructions();

            if(this._nInstructions !== 4){
                this.setError(EFFECT_BAD_FOR_STEP_EMPTY);
                return false;
            }

            if(isNull(pInstructionList[0])){
                this.setError(EFFECT_BAD_FOR_INIT_EMPTY_ITERATOR);
                return false;
            }

            if(pInstructionList[0]._getInstructionType() !== EAFXInstructionTypes.k_VariableDeclInstruction){
                this.setError(EFFECT_BAD_FOR_INIT_EXPR);
                return false;
            }

            if(isNull(pInstructionList[1])){
                this.setError(EFFECT_BAD_FOR_COND_EMPTY);
                return false;
            }

            if(pInstructionList[1]._getInstructionType() !== EAFXInstructionTypes.k_RelationalExprInstruction){
                this.setError(EFFECT_BAD_FOR_COND_RELATION);
                return false;
            }

            if(pInstructionList[2]._getInstructionType() === EAFXInstructionTypes.k_UnaryExprInstruction ||
               pInstructionList[2]._getInstructionType() === EAFXInstructionTypes.k_AssignmentExprInstruction){
                
                var sOperator: string = pInstructionList[2].getOperator();
                if (sOperator !== "++" && sOperator !== "--" &&
                    sOperator !== "+=" && sOperator !== "-=") {
                    this.setError(EFFECT_BAD_FOR_STEP_OPERATOR, {operator: sOperator});
                    return false;
                }
            }
            else {
                this.setError(EFFECT_BAD_FOR_STEP_EXPRESSION);
                return false;
            }

            return true;
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, 
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
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

    /**
     * Represent if(expr) stmt or if(expr) stmt else stmt
     * ( if || if_else ) Expr Stmt [Stmt]
     */
    export class IfStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [null, null, null];
            this._eInstructionType = EAFXInstructionTypes.k_IfStmtInstruction;
        }

        toFinalCode(): string {
            var sCode: string = "";
            if(this.getOperator() === "if"){
                sCode += "if(";
                sCode += this.getInstructions()[0].toFinalCode() + ")";
                sCode += this.getInstructions()[1].toFinalCode();
            }
            else {
                sCode += "if(";
                sCode += this.getInstructions()[0].toFinalCode() + ") ";
                sCode += this.getInstructions()[1].toFinalCode();
                sCode += "else ";
                sCode += this.getInstructions()[2].toFinalCode();
            }

            return sCode;
        }
    }

    /**
     * Represent TypeDecl or VariableDecl or VarStructDecl
     * EMPTY DeclInstruction
     */
    export class DeclStmtInstruction extends StmtInstruction {
        constructor () {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_DeclStmtInstruction;
        }

        toFinalCode(): string {
            return this._pInstructionList[0].toFinalCode() + ";";
        }

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            if(isNull(this.getInstructions()) || this._nInstructions === 0) {
                return;
            }

            if(this.getInstructions()[0]._getInstructionType() === EAFXInstructionTypes.k_TypeDeclInstruction){
                return;
            }

            var pVariableList: IAFXVariableDeclInstruction[] = <IAFXVariableDeclInstruction[]>this.getInstructions();
            for(var i: uint = 0; i < this._nInstructions; i++){
                var pVarType: IAFXVariableTypeInstruction = pVariableList[i].getType();
                
                pUsedDataCollector[pVarType._getInstructionID()] = <IAFXTypeUseInfoContainer>{
                    type: pVarType,
                    isRead: false,
                    isWrite: true,
                    numRead: 0,
                    numWrite: 1,
                    numUsed: 1
                };

                if(pVariableList[i].hasInitializer()){
                    pVariableList[i].getInitializeExpr().addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
                }
            }            
        }

    }

    /**
     * Represent return expr;
     * return ExprInstruction
     */
    export class ReturnStmtInstruction extends StmtInstruction {
        constructor () {
            super();
            this._pInstructionList = [null];
            this._sOperatorName = "return";
            this._eInstructionType = EAFXInstructionTypes.k_ReturnStmtInstruction;
        }

        toFinalCode(): string {
            if(this._nInstructions > 0){
                return "return " + this._pInstructionList[0].toFinalCode() + ";";
            }
            else {
                return "return;";
            }
        }
    }

    /**
     * Represent empty statement only semicolon ;
     * ;
     */
    export class SemicolonStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = null;
            this._eInstructionType = EAFXInstructionTypes.k_SemicolonStmtInstruction;
        }

        toFinalCode(): string {
            return ";";
        }
    }
}

#endif