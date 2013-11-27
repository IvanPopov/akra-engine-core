import StmtInstruction = require("fx/StmtInstruction");


/**
 * Represent return expr;
 * return ExprInstruction
 */
class ReturnStmtInstruction extends StmtInstruction {
    private _pPreparedCode: string = "";
    private _isPositionReturn: boolean = false;
    private _isColorReturn: boolean = false;
    private _isOnlyReturn: boolean = false;

    constructor() {
        super();
        this._pInstructionList = [null];
        this._sOperatorName = "return";
        this._eInstructionType = AEAFXInstructionTypes.k_ReturnStmtInstruction;
    }

    prepareFor(eUsedMode: AEFunctionType): void {
        var pReturn: AIAFXTypedInstruction = <AIAFXTypedInstruction>this.getInstructions()[0];
        if (isNull(pReturn)) {
            return;
        }

        if (eUsedMode === AEFunctionType.k_Vertex) {
            if (pReturn.getType().isBase()) {
                this._isPositionReturn = true;
            }
            else {
                this._isOnlyReturn = true;
            }
        }
        else if (eUsedMode === AEFunctionType.k_Pixel) {
            this._isColorReturn = true;
        }

        for (var i: uint = 0; i < this._nInstructions; i++) {
            this._pInstructionList[i].prepareFor(eUsedMode);
        }
    }

    toFinalCode(): string {
        if (this._isPositionReturn) {
            return "Out.POSITION=" + this._pInstructionList[0].toFinalCode() + "; return;";
        }
        if (this._isColorReturn) {
            //return "gl_FragColor=" + this._pInstructionList[0].toFinalCode() + "; return;";
            return "resultAFXColor=" + this._pInstructionList[0].toFinalCode() + "; return;";
        }
        if (this._isOnlyReturn) {
				return "return;"
			}

        if (this._nInstructions > 0) {
            return "return " + this._pInstructionList[0].toFinalCode() + ";";
        }
        else {
            return "return;";
        }
    }
}


export = ReturnStmtInstruction;