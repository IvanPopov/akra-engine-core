import ExprInstruction = require("fx/ExprInstruction");
/*
 * Represent someExpr.id
 * EMPTY_OPERATOR Instruction IdInstruction
 */
class PostfixPointInstruction extends ExprInstruction {
    private _bToFinalFirst: boolean = true;
    private _bToFinalSecond: boolean = true;

    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_PostfixPointInstruction;
    }

    prepareFor(eUsedMode: AEFunctionType) {
        if (!this.getInstructions()[0].isVisible()) {
            this._bToFinalFirst = false;
        }

        if (!this.getInstructions()[1].isVisible()) {
            this._bToFinalSecond = false;
        }

        this.getInstructions()[0].prepareFor(eUsedMode);
        this.getInstructions()[1].prepareFor(eUsedMode);
    }

    toFinalCode(): string {
        var sCode: string = "";

        sCode += this._bToFinalFirst ? this.getInstructions()[0].toFinalCode() : "";
        sCode += this._bToFinalFirst ? "." : "";
        sCode += this._bToFinalSecond ? this.getInstructions()[1].toFinalCode() : "";

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pSubExpr: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[0];
        var pPoint: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];

        pSubExpr.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Undefined);
        pPoint.addUsedData(pUsedDataCollector, eUsedMode);
    }

    isConst(): boolean {
        return (<AIAFXExprInstruction>this.getInstructions()[0]).isConst();
    }
}

export = PostfixPointInstruction;