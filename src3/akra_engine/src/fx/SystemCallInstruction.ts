import ExprInstruction = require("fx/ExprInstruction");
import SystemFunctionInstruction = require("fx/SystemFunctionInstruction");

/**
 * Respresnt system_func(arg1,..., argn)
 * EMPTY_OPERATOR SimpleInstruction ... SimpleInstruction 
 */
class SystemCallInstruction extends ExprInstruction {
    private _pSystemFunction: SystemFunctionInstruction = null;
    private _pSamplerDecl: AIAFXVariableDeclInstruction = null;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_SystemCallInstruction;
    }

    toFinalCode(): string {
        if (!isNull(this._pSamplerDecl) && this._pSamplerDecl.isDefinedByZero()) {
            return "vec4(0.)";
        }

        var sCode: string = "";

        for (var i: uint = 0; i < this.getInstructions().length; i++) {
            sCode += this.getInstructions()[i].toFinalCode();
        }

        return sCode;
    }

    setSystemCallFunction(pFunction: AIAFXFunctionDeclInstruction): void {
        this._pSystemFunction = <SystemFunctionInstruction>pFunction;
        this.setType(pFunction.getType());
    }

    setInstructions(pInstructionList: AIAFXInstruction[]): void {
        this._pInstructionList = pInstructionList;
        this._nInstructions = pInstructionList.length;
        for (var i: uint = 0; i < pInstructionList.length; i++) {
            pInstructionList[i].setParent(this);
        }
    }

    fillByArguments(pArguments: AIAFXInstruction[]): void {
        this.setInstructions(this._pSystemFunction.closeArguments(pArguments));
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pInstructionList: AIAFXAnalyzedInstruction[] = <AIAFXAnalyzedInstruction[]>this.getInstructions();
        for (var i: uint = 0; i < this._nInstructions; i++) {
            if (pInstructionList[i]._getInstructionType() !== AEAFXInstructionTypes.k_SimpleInstruction) {
                pInstructionList[i].addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
                if ((<AIAFXExprInstruction>pInstructionList[i]).getType().isSampler()) {
                    this._pSamplerDecl = (<AIAFXExprInstruction>pInstructionList[i]).getType()._getParentVarDecl();
                }
            }
        }
    }

    clone(pRelationMap?: AIAFXInstructionMap): SystemCallInstruction {
        var pClone: SystemCallInstruction = <SystemCallInstruction>super.clone(pRelationMap);

        pClone.setSystemCallFunction(this._pSystemFunction);

        return pClone;
    }

}

export = SystemCallInstruction;