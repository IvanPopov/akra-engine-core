import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent @ Expr
 * @ Instruction
 */
class PrimaryExprInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_PrimaryExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        sCode += this.getInstructions()[0].toFinalCode();

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pPointerType: AIAFXVariableTypeInstruction = this.getType();
        var pInfo: AIAFXTypeUseInfoContainer = pUsedDataCollector[pPointerType._getInstructionID()];

        if (!isDef(pInfo)) {
            pInfo = <AIAFXTypeUseInfoContainer>{
                type: pPointerType,
                isRead: false,
                isWrite: false,
                numRead: 0,
                numWrite: 0,
                numUsed: 0
            }

				pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
        }

        if (eUsedMode === AEVarUsedMode.k_Read) {
            pInfo.isRead = true;
            pInfo.numRead++;
        }
        else if (eUsedMode === AEVarUsedMode.k_Write) {
            pInfo.isWrite = true;
            pInfo.numWrite++;
        }
        else if (eUsedMode === AEVarUsedMode.k_ReadWrite) {
            pInfo.isRead = true;
            pInfo.isWrite = true;
            pInfo.numRead++;
            pInfo.numWrite++;
        }

        pInfo.numUsed++;
    }
}

export = PrimaryExprInstruction;