import ExprInstruction = require("fx/ExprInstruction");
import IdInstruction = require("fx/IdInstruction");

class IdExprInstruction extends ExprInstruction implements AIAFXIdExprInstruction {
    protected  _pType: AIAFXVariableTypeInstruction = null;

    private _bToFinalCode: boolean = true;
    private _isInPassUnifoms: boolean = false;
    private _isInPassForeigns: boolean = false;

    isVisible(): boolean {
        return this._pInstructionList[0].isVisible();
    }

    constructor() {
        super();
        this._pInstructionList = [null];
        this._eInstructionType = AEAFXInstructionTypes.k_IdExprInstruction;
    }

    getType(): AIAFXVariableTypeInstruction {
        if (!isNull(this._pType)) {
            return this._pType;
        }
        else {
            var pVar: IdInstruction = <IdInstruction>this._pInstructionList[0];
            this._pType = (<AIAFXVariableDeclInstruction>pVar.getParent()).getType();
            return this._pType;
        }
    }

    isConst(): boolean {
        return this.getType().isConst();
    }

    evaluate(): boolean {
        if (this.getType().isForeign()) {
            var pVal = this.getType()._getParentVarDecl().getValue();
            if (!isNull(pVal)) {
                this._pLastEvalResult = pVal;
                return true;
            }
        }

        return false;
    }

    prepareFor(eUsedMode: AEFunctionType): void {
        if (!this.isVisible()) {
            this._bToFinalCode = false;
        }

        if (eUsedMode === AEFunctionType.k_PassFunction) {
            var pVarDecl: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>this.getInstructions()[0].getParent();
            if (!this.getType()._isUnverifiable() && isNull(pVarDecl.getParent())) {
                if (pVarDecl.getType().isForeign()) {
                    this._isInPassForeigns = true;
                }
                else {
                    this._isInPassUnifoms = true;
                }
            }
        }
    }

    toFinalCode(): string {
        var sCode: string = "";
        if (this._bToFinalCode) {
            if (this._isInPassForeigns || this._isInPassUnifoms) {
                var pVarDecl: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>this.getInstructions()[0].getParent();
                if (this._isInPassForeigns) {
                    sCode += "foreigns[\"" + pVarDecl._getNameIndex() + "\"]";
                }
                else {
                    sCode += "uniforms[\"" + pVarDecl._getNameIndex() + "\"]";
                }
            }
            else {
                sCode += this.getInstructions()[0].toFinalCode();
            }
        }
        return sCode;
    }

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXIdExprInstruction {
        return <AIAFXIdExprInstruction>super.clone(pRelationMap);
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        if (!this.getType().isFromVariableDecl()) {
            return;
        }

        var pInfo: AIAFXTypeUseInfoContainer = null;
        pInfo = pUsedDataCollector[this.getType()._getInstructionID()];

        if (!isDef(pInfo)) {
            pInfo = <AIAFXTypeUseInfoContainer>{
                type: this.getType(),
                isRead: false,
                isWrite: false,
                numRead: 0,
                numWrite: 0,
                numUsed: 0
            }

				pUsedDataCollector[this.getType()._getInstructionID()] = pInfo;
        }

        if (eUsedMode !== AEVarUsedMode.k_Write && eUsedMode !== AEVarUsedMode.k_Undefined) {
            pInfo.isRead = true;
            pInfo.numRead++;
        }

        if (eUsedMode === AEVarUsedMode.k_Write || eUsedMode === AEVarUsedMode.k_ReadWrite) {
            pInfo.isWrite = true;
            pInfo.numWrite++;
        }

        pInfo.numUsed++;
    }
}

export = IdExprInstruction;