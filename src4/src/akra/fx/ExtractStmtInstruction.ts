/// <reference path="../idl/AIAFXInstruction.ts" />

import ExprInstruction = require("fx/ExprInstruction");
import SimpleInstruction = require("fx/SimpleInstruction");
import ExtractExprInstruction = require("fx/ExtractExprInstruction");
import Instruction = require("fx/Instruction");

class ExtractStmtInstruction extends ExprInstruction {
    private _pExtractInVar: AIAFXVariableDeclInstruction = null;
    private _pExtractInExpr: AIAFXExprInstruction = null;
    private _pExtactExpr: ExtractExprInstruction = null;

    constructor() {
        super();
        this._pInstructionList = [];
        this._eInstructionType = AEAFXInstructionTypes.k_ExtractStmtInstruction;
    }

    generateStmtForBaseType(pVarDecl: AIAFXVariableDeclInstruction,
        pPointer: AIAFXVariableDeclInstruction,
        pBuffer: AIAFXVariableDeclInstruction,
        iPadding: uint, pOffset: AIAFXVariableDeclInstruction = null): void {
        var pVarType: AIAFXVariableTypeInstruction = pVarDecl.getType();
        var pVarNameExpr: AIAFXExprInstruction = pVarDecl._getFullNameExpr();
            if (pVarType.isComplex() || isNull(pVarNameExpr) || pVarType.getSize() === Instruction.UNDEFINE_SIZE) {
            this.setError(AEEffectErrors.BAD_EXTRACTING);
            return;
        }

        // var pPointer: IAFXVariableDeclInstruction = isDef(pPointer) ? pPointer : pVarType.getPointer();
        // var pBuffer: IAFXVariableDeclInstruction = isDef(pBuffer) ?  pBuffer : pVarType.getVideoBuffer();
        var pBufferSampler: AIAFXVariableDeclInstruction = pBuffer._getVideoBufferSampler();
        var pBufferHeader: AIAFXVariableDeclInstruction = pBuffer._getVideoBufferHeader();

        var isArray: boolean = pVarType.isNotBaseArray();
        var iLength: uint = pVarType.getLength();
        var sCodeFragment: string = "";
        var pExtractType: AIAFXVariableTypeInstruction = isArray ? pVarType.getArrayElementType() : pVarType;

        if (isArray) {
            if (iLength === Instruction.UNDEFINE_LENGTH) {
                this.setError(AEEffectErrors.BAD_EXTRACTING);
                return;
            }

            sCodeFragment = "for(int i=0;i<" + iLength.toString() + ";i++){";
            this.push(new SimpleInstruction(sCodeFragment), true);
        }

        this.push(pVarNameExpr, false);


        if (isArray) {
            sCodeFragment = "[i]=";
        }
        else {
            sCodeFragment = "=";
        }

        this.push(new SimpleInstruction(sCodeFragment), true);

        var pExtractType: AIAFXVariableTypeInstruction = isArray ? pVarType.getArrayElementType() : pVarType;
        var pExtractExpr: ExtractExprInstruction = new ExtractExprInstruction();
        var sPaddingExpr: string = "";

        if (iPadding > 0) {
            sPaddingExpr = "+" + iPadding.toString() + ".0";
        }
        else {
            sPaddingExpr = "";
        }

        if (isArray) {
            sPaddingExpr += "+float(i*" + pExtractType.getSize().toString() + ")";
        }

        pExtractExpr.initExtractExpr(pExtractType, pPointer, pBuffer, sPaddingExpr, pOffset);

        if (pExtractExpr.isErrorOccured()) {
            this.setError(pExtractExpr.getLastError().code, pExtractExpr.getLastError().info);
            return;
        }

        this.push(pExtractExpr, true);

        sCodeFragment = ";";

        if (isArray) {
            sCodeFragment += "}";
        }

        this.push(new SimpleInstruction(sCodeFragment), true);

        this._pExtactExpr = pExtractExpr;
        this._pExtractInVar = pVarDecl;
        this._pExtractInExpr = pVarNameExpr;
    }

    toFinalCode(): string {
        var sCode: string = "";

        for (var i: uint = 0; i < this._nInstructions; i++) {
            sCode += this.getInstructions()[i].toFinalCode();
        }

        return sCode;
    }

    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap,
        eUsedMode: AEVarUsedMode = AEVarUsedMode.k_Undefined): void {
        this._pExtractInExpr.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Write);
        this._pExtactExpr.addUsedData(pUsedDataCollector, AEVarUsedMode.k_Read);
    }

    getExtractFunction(): AIAFXFunctionDeclInstruction {
        return this._pExtactExpr.getExtractFunction();
    }
}

export = ExtractStmtInstruction;