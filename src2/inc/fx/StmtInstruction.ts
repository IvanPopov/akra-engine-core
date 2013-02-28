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
    }

    /**
     * Represent empty statement only semicolon ;
     * ;
     */
    export class SemicolonStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [];
            this._eInstructionType = EAFXInstructionTypes.k_SemicolonStmtInstruction;
        }
    }
}

#endif