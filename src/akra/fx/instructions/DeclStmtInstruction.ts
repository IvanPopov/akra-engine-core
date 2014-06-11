/// <reference path="StmtInstruction.ts" />

module akra.fx.instructions {

    /**
     * Represent TypeDecl or VariableDecl or VarStructDecl
     * EMPTY DeclInstruction
     */
    export class DeclStmtInstruction extends StmtInstruction {
        constructor() {
            super();
            this._pInstructionList = [null];
            this._eInstructionType = EAFXInstructionTypes.k_DeclStmtInstruction;
        }

        _toFinalCode(): string {
            var sCode: string = "";
            var pVariableList: IAFXVariableDeclInstruction[] = <IAFXVariableDeclInstruction[]>this._getInstructions();

            for (var i: uint = 0; i < this._nInstructions; i++) {
                sCode += pVariableList[i]._toFinalCode() + ";\n";
            }

            return sCode;
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            if (isNull(this._getInstructions()) || this._nInstructions === 0) {
                return;
            }

            if (this._getInstructions()[0]._getInstructionType() === EAFXInstructionTypes.k_TypeDeclInstruction) {
                return;
            }

            var pVariableList: IAFXVariableDeclInstruction[] = <IAFXVariableDeclInstruction[]>this._getInstructions();
            for (var i: uint = 0; i < this._nInstructions; i++) {
                var pVarType: IAFXVariableTypeInstruction = pVariableList[i]._getType();

                pUsedDataCollector[pVarType._getInstructionID()] = <IAFXTypeUseInfoContainer>{
                    type: pVarType,
                    isRead: false,
                    isWrite: true,
                    numRead: 0,
                    numWrite: 1,
                    numUsed: 1
                };

                if (pVariableList[i]._hasInitializer()) {
                    pVariableList[i]._getInitializeExpr()._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
                }
            }
        }
    }
}

