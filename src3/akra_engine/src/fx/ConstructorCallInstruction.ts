import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");

/**
 * Respresnt ctor(arg1,..., argn)
 * EMPTY_OPERATOR IdInstruction ExprInstruction ... ExprInstruction 
 */
class ConstructorCallInstruction extends ExprInstruction {
    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_ConstructorCallInstruction;
    }

    // isConst
    toFinalCode(): string {
        var sCode: string = "";

        sCode += this.getInstructions()[0].toFinalCode();
        sCode += "(";

        for (var i: uint = 1; i < this._nInstructions; i++) {
            sCode += this.getInstructions()[i].toFinalCode();

            if (i !== this._nInstructions - 1) {
                sCode += ",";
            }
        }

        sCode += ")";

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        var pInstructionList: AIAFXAnalyzedInstruction[] = <AIAFXAnalyzedInstruction[]>this.getInstructions();
        for (var i: uint = 1; i < this._nInstructions; i++) {
            pInstructionList[i].addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
        }
    }

    isConst(): boolean {
        for (var i: uint = 1; i < this._nInstructions; i++) {
            if (!(<AIAFXExprInstruction>this.getInstructions()[i]).isConst()) {
                return false;
            }
        }

        return true;
    }

    evaluate(): boolean {
        if (!this.isConst()) {
            return false;
        }

        var pRes: any = null;
        var pJSTypeCtor: any = Effect.getExternalType(this.getType());
        var pArguments: any[] = new Array(this._nInstructions - 1);

        if (isNull(pJSTypeCtor)) {
            return false;
        }

        try {
            if (Effect.isScalarType(this.getType())) {
                var pTestedInstruction: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];
                if (this._nInstructions > 2 || !pTestedInstruction.evaluate()) {
                    return false;
                }

                pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
            }
            else {
                for (var i: uint = 1; i < this._nInstructions; i++) {
                    var pTestedInstruction: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[i];

                    if (pTestedInstruction.evaluate()) {
                        pArguments[i - 1] = pTestedInstruction.getEvalValue();
                    }
                    else {
                        return false;
                    }
                }

                pRes = new pJSTypeCtor;
                pRes.set.apply(pRes, pArguments);
            }
        }
        catch (e) {
            return false;
        }

        this._pLastEvalResult = pRes;
        return true;
    }
}

export = ConstructorCallInstruction;