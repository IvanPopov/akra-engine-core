import StmtInstruction = require("fx/StmtInstruction");

/**
 * Represent TypeDecl or VariableDecl or VarStructDecl
 * EMPTY DeclInstruction
 */
class DeclStmtInstruction extends StmtInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_DeclStmtInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        var pVariableList: AIAFXVariableDeclInstruction[] = <AIAFXVariableDeclInstruction[]>this.getInstructions();

        for (var i: uint = 0; i < this._nInstructions; i++) {
            sCode += pVariableList[i].toFinalCode() + ";\n";
        }

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        if (isNull(this.getInstructions()) || this._nInstructions === 0) {
            return;
        }

        if (this.getInstructions()[0]._getInstructionType() === AEAFXInstructionTypes.k_TypeDeclInstruction) {
            return;
        }

        var pVariableList: AIAFXVariableDeclInstruction[] = <AIAFXVariableDeclInstruction[]>this.getInstructions();
        for (var i: uint = 0; i < this._nInstructions; i++) {
            var pVarType: AIAFXVariableTypeInstruction = pVariableList[i].getType();

            pUsedDataCollector[pVarType._getInstructionID()] = <AIAFXTypeUseInfoContainer>{
                type: pVarType,
                isRead: false,
                isWrite: true,
                numRead: 0,
                numWrite: 1,
                numUsed: 1
            };

            if (pVariableList[i].hasInitializer()) {
                pVariableList[i].getInitializeExpr().addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
            }
        }
    }
}

export = DeclStmtInstruction;
