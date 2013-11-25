import ExprInstruction = require("fx/ExprInstruction");

class MemExprInstruction extends ExprInstruction {
    private _pBuffer: AIAFXVariableDeclInstruction = null;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_MemExprInstruction;
    }

    getBuffer(): AIAFXVariableDeclInstruction {
        return this._pBuffer;
    }

    setBuffer(pBuffer: AIAFXVariableDeclInstruction): void {
        this._pBuffer = pBuffer;
        this.setType(pBuffer.getType());
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pBufferType: AIAFXVariableTypeInstruction = this.getBuffer().getType();
        var pInfo: AIAFXTypeUseInfoContainer = pUsedDataCollector[pBufferType._getInstructionID()];

        if (!isDef(pInfo)) {
            pInfo = <AIAFXTypeUseInfoContainer>{
                type: pBufferType,
                isRead: false,
                isWrite: false,
                numRead: 0,
                numWrite: 0,
                numUsed: 0
            }

				pUsedDataCollector[pBufferType._getInstructionID()] = pInfo;
        }
        if (eUsedMode !== AEVarUsedMode.k_Undefined) {
            pInfo.isRead = true;
            pInfo.numRead++;
        }

        pInfo.numUsed++;
    }
}

export = MemExprInstruction;