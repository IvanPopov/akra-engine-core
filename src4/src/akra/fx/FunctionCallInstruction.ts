import ExprInstruction = require("fx/ExprInstruction");

/**
 * Respresnt func(arg1,..., argn)
 * EMPTY_OPERATOR IdExprInstruction ExprInstruction ... ExprInstruction 
 */
class FunctionCallInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_FunctionCallInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        sCode += this.getInstructions()[0].toFinalCode();
        sCode += "(";
        for (var i: uint = 1; i < this._nInstructions; i++) {
            sCode += this.getInstructions()[i].toFinalCode();
            if (i !== this._nInstructions - 1) {
                sCode += ","
				}
        }
        sCode += ")"

			return sCode;
    }

    getFunction(): AIAFXFunctionDeclInstruction {
        return <AIAFXFunctionDeclInstruction>(<AIAFXIdExprInstruction>this._pInstructionList[0]).getType().getParent().getParent();
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pExprList: AIAFXExprInstruction[] = <AIAFXExprInstruction[]>this.getInstructions();
        var pFunction: AIAFXFunctionDeclInstruction = this.getFunction();
        var pArguments: AIAFXVariableDeclInstruction[] = <AIAFXVariableDeclInstruction[]>pFunction.getArguments();

        pExprList[0].addUsedData(pUsedDataCollector, eUsedMode);

        for (var i: uint = 0; i < pArguments.length; i++) {
            if (pArguments[i].getType().hasUsage("out")) {
                pExprList[i + 1].addUsedData(pUsedDataCollector, AEVarUsedMode.k_Write);
            }
            else if (pArguments[i].getType().hasUsage("inout")) {
                pExprList[i + 1].addUsedData(pUsedDataCollector, AEVarUsedMode.k_ReadWrite);
            }
            else {
                pExprList[i + 1].addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
            }
        }
    }
}

export = FunctionCallInstruction;