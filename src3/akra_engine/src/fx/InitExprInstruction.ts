import Instruction = require("fx/Instruction");
import ExprInstruction = require("fx/ExprInstruction");
import Effect = require("fx/Effect");


class InitExprInstruction extends ExprInstruction implements AIAFXInitExprInstruction {
    private _pConstructorType: AIAFXTypeInstruction = null;
    private _isConst: boolean = null;
    private _isArray: boolean = false;

    constructor() {
        super();
        this._pInstructionList = [];
        this._eInstructionType = AEAFXInstructionTypes.k_InitExprInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        if (!isNull(this._pConstructorType)) {
            sCode += this._pConstructorType.toFinalCode();
        }
        sCode += "(";

        for (var i: uint = 0; i < this._nInstructions; i++) {
            sCode += this.getInstructions()[i].toFinalCode();

            if (i !== this._nInstructions - 1) {
                sCode += ",";
            }
        }

        sCode += ")";

        return sCode;
    }

    isConst(): boolean {
        if (isNull(this._isConst)) {
            var pInstructionList: AIAFXExprInstruction[] = <AIAFXExprInstruction[]>this.getInstructions();

            for (var i: uint = 0; i < pInstructionList.length; i++) {
                if (!pInstructionList[i].isConst()) {
                    this._isConst = false;
                    break;
                }
            }

            this._isConst = isNull(this._isConst) ? true : false;
        }

        return this._isConst;
    }

    optimizeForVariableType(pType: AIAFXVariableTypeInstruction): boolean {
        if ((pType.isNotBaseArray() && pType._getScope() === 0) ||
            (pType.isArray() && this._nInstructions > 1)) {


            if (pType.getLength() === Instruction.UNDEFINE_LENGTH ||
                (pType.isNotBaseArray() && this._nInstructions !== pType.getLength()) ||
                (!pType.isNotBaseArray() && this._nInstructions !== pType.getBaseType().getLength())) {

                return false;
            }

            if (pType.isNotBaseArray()) {
                this._isArray = true;
            }

            var pArrayElementType: AIAFXVariableTypeInstruction = pType.getArrayElementType();
            var pTestedInstruction: AIAFXExprInstruction = null;
            var isOk: boolean = false;

            for (var i: uint = 0; i < this._nInstructions; i++) {
                pTestedInstruction = (<AIAFXExprInstruction>this.getInstructions()[i]);

                if (pTestedInstruction._getInstructionType() === AEAFXInstructionTypes.k_InitExprInstruction) {
                    isOk = (<AIAFXInitExprInstruction>pTestedInstruction).optimizeForVariableType(pArrayElementType);
                    if (!isOk) {
                        return false;
                    }
                }
                else {
                    if (Effect.isSamplerType(pArrayElementType)) {
                        if (pTestedInstruction._getInstructionType() !== AEAFXInstructionTypes.k_SamplerStateBlockInstruction) {
                            return false;
                        }
                    }
                    else {
                        isOk = pTestedInstruction.getType().isEqual(pArrayElementType);
                        if (!isOk) {
                            return false;
                        }
                    }
                }
            }

            this._pConstructorType = pType.getBaseType();
            return true;
        }
        else {
            var pFirstInstruction: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[0];

            if (this._nInstructions === 1 &&
                pFirstInstruction._getInstructionType() !== AEAFXInstructionTypes.k_InitExprInstruction) {

                if (Effect.isSamplerType(pType)) {
                    if (pFirstInstruction._getInstructionType() === AEAFXInstructionTypes.k_SamplerStateBlockInstruction) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                if (pFirstInstruction.getType().isEqual(pType)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (this._nInstructions === 1) {
                return false;
            }

            var pInstructionList: AIAFXInitExprInstruction[] = <AIAFXInitExprInstruction[]>this.getInstructions();
            var pFieldNameList: string[] = pType.getFieldNameList();

            for (var i: uint = 0; i < pInstructionList.length; i++) {
                var pFieldType: AIAFXVariableTypeInstruction = pType.getFieldType(pFieldNameList[i]);
                if (!pInstructionList[i].optimizeForVariableType(pFieldType)) {
                    return false;
                }
            }

            this._pConstructorType = pType.getBaseType();
            return true;
        }
    }

    evaluate(): boolean {
        if (!this.isConst()) {
            this._pLastEvalResult = null;
            return false;
        }

        var pRes: any = null;

        if (this._isArray) {
            pRes = new Array(this._nInstructions);

            for (var i: uint = 0; i < this._nInstructions; i++) {
                var pEvalInstruction = (<AIAFXExprInstruction>this.getInstructions()[i]);

                if (pEvalInstruction.evaluate()) {
                    pRes[i] = pEvalInstruction.getEvalValue();
                }
            }
        }
        else if (this._nInstructions === 1) {
            var pEvalInstruction = (<AIAFXExprInstruction>this.getInstructions()[0]);
            pEvalInstruction.evaluate();
            pRes = pEvalInstruction.getEvalValue();
        }
        else {
            var pJSTypeCtor: any = Effect.getExternalType(this._pConstructorType);
            var pArguments: any[] = new Array(this._nInstructions);

            if (isNull(pJSTypeCtor)) {
                return false;
            }

            try {
                if (Effect.isScalarType(this._pConstructorType)) {
                    var pTestedInstruction: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[1];
                    if (this._nInstructions > 2 || !pTestedInstruction.evaluate()) {
                        return false;
                    }

                    pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
                }
                else {
                    for (var i: uint = 0; i < this._nInstructions; i++) {
                        var pTestedInstruction: AIAFXExprInstruction = <AIAFXExprInstruction>this.getInstructions()[i];

                        if (pTestedInstruction.evaluate()) {
                            pArguments[i] = pTestedInstruction.getEvalValue();
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
        }

        this._pLastEvalResult = pRes;

        return true;
    }
}


export = InitExprInstruction;