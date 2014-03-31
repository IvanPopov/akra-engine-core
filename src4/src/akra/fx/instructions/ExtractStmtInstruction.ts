/// <reference path="../../idl/IAFXInstruction.ts" />

/// <reference path="ExprInstruction.ts" />
/// <reference path="SimpleInstruction.ts" />
/// <reference path="ExtractExprInstruction.ts" />
/// <reference path="Instruction.ts" />

module akra.fx.instructions {

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
            var pVarType: IAFXVariableTypeInstruction = pVarDecl._getType();
            var pVarNameExpr: IAFXExprInstruction = pVarDecl._getFullNameExpr();
            if (pVarType._isComplex() || isNull(pVarNameExpr) || pVarType._getSize() === Instruction.UNDEFINE_SIZE) {
                this._setError(EEffectErrors.BAD_EXTRACTING);
                return;
            }

            // var pPointer: IAFXVariableDeclInstruction = isDef(pPointer) ? pPointer : pVarType._getPointer();
            // var pBuffer: IAFXVariableDeclInstruction = isDef(pBuffer) ?  pBuffer : pVarType._getVideoBuffer();
            var pBufferSampler: IAFXVariableDeclInstruction = pBuffer._getVideoBufferSampler();
            var pBufferHeader: IAFXVariableDeclInstruction = pBuffer._getVideoBufferHeader();

            var isArray: boolean = pVarType._isNotBaseArray();
            var iLength: uint = pVarType._getLength();
            var sCodeFragment: string = "";
            var pExtractType: IAFXVariableTypeInstruction = isArray ? pVarType._getArrayElementType() : pVarType;

            if (isArray) {
                if (iLength === Instruction.UNDEFINE_LENGTH) {
                    this._setError(EEffectErrors.BAD_EXTRACTING);
                    return;
                }

                sCodeFragment = "for(int i=0;i<" + iLength.toString() + ";i++){";
                this._push(new SimpleInstruction(sCodeFragment), true);
            }

            this._push(pVarNameExpr, false);


            if (isArray) {
                sCodeFragment = "[i]=";
            }
            else {
                sCodeFragment = "=";
            }

            this._push(new SimpleInstruction(sCodeFragment), true);

            var pExtractType: IAFXVariableTypeInstruction = isArray ? pVarType._getArrayElementType() : pVarType;
            var pExtractExpr: ExtractExprInstruction = new ExtractExprInstruction();
            var sPaddingExpr: string = "";

            if (iPadding > 0) {
                sPaddingExpr = "+" + iPadding.toString() + ".0";
            }
            else {
                sPaddingExpr = "";
            }

            if (isArray) {
                sPaddingExpr += "+float(i*" + pExtractType._getSize().toString() + ")";
            }

            pExtractExpr.initExtractExpr(pExtractType, pPointer, pBuffer, sPaddingExpr, pOffset);

            if (pExtractExpr._isErrorOccured()) {
                this._setError(pExtractExpr._getLastError().code, pExtractExpr._getLastError().info);
                return;
            }

            this._push(pExtractExpr, true);

            sCodeFragment = ";";

            if (isArray) {
                sCodeFragment += "}";
            }

            this._push(new SimpleInstruction(sCodeFragment), true);

            this._pExtactExpr = pExtractExpr;
            this._pExtractInVar = pVarDecl;
            this._pExtractInExpr = pVarNameExpr;
        }

        _toFinalCode(): string {
            var sCode: string = "";

            for (var i: uint = 0; i < this._nInstructions; i++) {
                sCode += this._getInstructions()[i]._toFinalCode();
            }

            return sCode;
        }

        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
            eUsedMode: EVarUsedMode = EVarUsedMode.k_Undefined): void {
            this._pExtractInExpr._addUsedData(pUsedDataCollector, EVarUsedMode.k_Write);
            this._pExtactExpr._addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
        }

        getExtractFunction(): IAFXFunctionDeclInstruction {
            return this._pExtactExpr.getExtractFunction();
        }
    }
}

