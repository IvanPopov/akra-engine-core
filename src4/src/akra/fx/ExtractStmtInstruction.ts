/// <reference path="../idl/IAFXInstruction.ts" />

/// <reference path="ExprInstruction.ts" />
/// <reference path="SimpleInstruction.ts" />
/// <reference path="ExtractExprInstruction.ts" />
/// <reference path="Instruction.ts" />

module akra.fx {

    export class ExtractStmtInstruction extends ExprInstruction {
        private _pExtractInVar: IAFXVariableDeclInstruction = null;
        private _pExtractInExpr: IAFXExprInstruction = null;
        private _pExtactExpr: ExtractExprInstruction = null;

        constructor() {
            super();
            this._pInstructionList = [];
            this._eInstructionType = EAFXInstructionTypes.k_ExtractStmtInstruction;
        }

        generateStmtForBaseType(pVarDecl: IAFXVariableDeclInstruction,
            pPointer: IAFXVariableDeclInstruction,
            pBuffer: IAFXVariableDeclInstruction,
            iPadding: uint, pOffset: IAFXVariableDeclInstruction = null): void {
            var pVarType: IAFXVariableTypeInstruction = pVarDecl.getType();
            var pVarNameExpr: IAFXExprInstruction = pVarDecl._getFullNameExpr();
            if (pVarType.isComplex() || isNull(pVarNameExpr) || pVarType.getSize() === Instruction.UNDEFINE_SIZE) {
                this.setError(EEffectErrors.BAD_EXTRACTING);
                return;
            }

            // var pPointer: IAFXVariableDeclInstruction = isDef(pPointer) ? pPointer : pVarType.getPointer();
            // var pBuffer: IAFXVariableDeclInstruction = isDef(pBuffer) ?  pBuffer : pVarType.getVideoBuffer();
            var pBufferSampler: IAFXVariableDeclInstruction = pBuffer._getVideoBufferSampler();
            var pBufferHeader: IAFXVariableDeclInstruction = pBuffer._getVideoBufferHeader();

            var isArray: boolean = pVarType.isNotBaseArray();
            var iLength: uint = pVarType.getLength();
            var sCodeFragment: string = "";
            var pExtractType: IAFXVariableTypeInstruction = isArray ? pVarType.getArrayElementType() : pVarType;

            if (isArray) {
                if (iLength === Instruction.UNDEFINE_LENGTH) {
                    this.setError(EEffectErrors.BAD_EXTRACTING);
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

            var pExtractType: IAFXVariableTypeInstruction = isArray ? pVarType.getArrayElementType() : pVarType;
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

        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            this._pExtractInExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Write);
            this._pExtactExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        getExtractFunction(): IAFXFunctionDeclInstruction {
            return this._pExtactExpr.getExtractFunction();
        }
    }
}

