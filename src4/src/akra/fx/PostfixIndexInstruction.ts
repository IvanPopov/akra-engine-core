import ExprInstruction = require("fx/ExprInstruction");

/**
 * Represent someExpr[someIndex]
 * EMPTY_OPERATOR Instruction ExprInstruction
 */
class PostfixIndexInstruction extends ExprInstruction {
    private _pSamplerArrayDecl: AIAFXVariableDeclInstruction = null;

    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_PostfixIndexInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        // if((<ExprInstruction>this.getInstructions()[0]).getType().getLength() === 0){
        // 	return "";
        // }

        if (!isNull(this._pSamplerArrayDecl) && this._pSamplerArrayDecl.isDefinedByZero()) {
            sCode += this.getInstructions()[0].toFinalCode();
        }
        else {
            sCode += this.getInstructions()[0].toFinalCode();

            if (!(<AIAFXExprInstruction>this.getInstructions()[0]).getType()._isCollapsed()) {
                sCode += "[" + this.getInstructions()[1].toFinalCode() + "]";
            }
        }

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pSubExpr: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[0];
        var pIndex: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];

        pSubExpr.addUsedData(pUsedDataCollector, eUsedMode);
        pIndex.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);

        if (pSubExpr.getType().isFromVariableDecl() && pSubExpr.getType().isSampler()) {
            this._pSamplerArrayDecl = pSubExpr.getType()._getParentVarDecl();
        }
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst() &&
            (<AIAFXExprInstruction>this.getInstructions()[1]).isConst();
    }
}

export = PostfixIndexInstruction;