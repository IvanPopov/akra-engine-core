/// <reference path="../../idl/EEffectErrors.ts" />

/// <reference path="DeclInstruction.ts" />
/// <reference path="../Effect.ts" />

module akra.fx.instructions {

    /**
     * Represent type func(...args)[:Semantic]
     * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
     */
    export class FunctionDefInstruction extends DeclInstruction {
        private _pParameterList: IAFXVariableDeclInstruction[] = null;
        private _pParamListForShaderCompile: IAFXVariableDeclInstruction[] = null;
        private _pParamListForShaderInput: IAFXVariableDeclInstruction[] = null;
        private _bIsComplexShaderInput: boolean = false;

        private _pReturnType: IAFXVariableTypeInstruction = null;
        private _pFunctionName: IAFXIdInstruction = null;
        private _nParamsNeeded: uint = 0;
        private _sDefinition: string = "";
        private _isAnalyzedForVertexUsage: boolean = false;
        private _isAnalyzedForPixelUsage: boolean = false;
        private _bCanUsedAsFunction: boolean = true;

        private _bShaderDef: boolean = false;

        //private _sHash: string = "";

        constructor() {
            super();
            this._pInstructionList = null;
            this._pParameterList = [];
            this._eInstructionType = EAFXInstructionTypes.k_FunctionDefInstruction;
        }

        _toFinalCode(): string {
            var sCode: string = "";

            if (!this.isShaderDef()) {

                sCode += this._pReturnType._toFinalCode();
                sCode += " " + this._pFunctionName._toFinalCode();
                sCode += "(";

                for (var i: uint = 0; i < this._pParameterList.length; i++) {
                    sCode += this._pParameterList[i]._toFinalCode();

                    if (i !== this._pParameterList.length - 1) {
                        sCode += ",";
                    }
                }

                sCode += ")";
            }
            else {
                sCode = "void " + this._pFunctionName._toFinalCode() + "()";
            }

            return sCode;
        }

        _setType(pType: IAFXTypeInstruction): void {
            this.setReturnType(<IAFXVariableTypeInstruction>pType);
        }

        _getType(): IAFXTypeInstruction {
            return <IAFXTypeInstruction>this.getReturnType();
        }

        setReturnType(pReturnType: IAFXVariableTypeInstruction): boolean {
            this._pReturnType = pReturnType;
            pReturnType._setParent(this);
            return true;
        }
        getReturnType(): IAFXVariableTypeInstruction {
            return this._pReturnType;
        }

        setFunctionName(pNameId: IAFXIdInstruction): boolean {
            this._pFunctionName = pNameId;
            pNameId._setParent(this);
            return true;
        }

        _getName(): string {
            return this._pFunctionName._getName();
        }

        _getRealName(): string {
            return this._pFunctionName._getRealName();
        }

        _getNameId(): IAFXIdInstruction {
            return this._pFunctionName;
        }

        getArguments(): IAFXVariableDeclInstruction[] {
            return this._pParameterList;
        }

        getNumNeededArguments(): uint {
            return this._nParamsNeeded;
        }

        markAsShaderDef(isShaderDef: boolean): void {
            this._bShaderDef = isShaderDef;
        }

        isShaderDef(): boolean {
            return this._bShaderDef;
        }

        addParameter(pParameter: IAFXVariableDeclInstruction, isStrictModeOn?: boolean): boolean {
            if (this._pParameterList.length > this._nParamsNeeded &&
                !pParameter._hasInitializer()) {

                this._setError(EEffectErrors.BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT,
                    {
                        funcName: this._pFunctionName._getName(),
                        varName: pParameter._getName()
                    });
                return false;
            }

            var pParameterType: IAFXVariableTypeInstruction = pParameter._getType();

            if (pParameterType._isPointer() || pParameterType._containPointer()) {
                if (pParameterType._hasUsage("uniform") ||
                    pParameterType._hasUsage("out") ||
                    pParameterType._hasUsage("inout")) {

                    this._setError(EEffectErrors.BAD_FUNCTION_PARAMETER_USAGE,
                        {
                            funcName: this._pFunctionName._getName(),
                            varName: pParameter._getName()
                        });
                    return false;
                }

                this._isAnalyzedForVertexUsage = false;
                this._isAnalyzedForPixelUsage = true;

                this._setForPixel(false);
                this._bCanUsedAsFunction = false;
                pParameterType._setVideoBufferInDepth();
            }
            else if (!isStrictModeOn) {

                if (pParameterType._isComplex() &&
                    !pParameterType._hasFieldWithoutSemantic() &&
                    pParameterType._hasAllUniqueSemantics()) {

                    if (pParameter._getSemantic() === "" &&
                        pParameterType._hasAllUniqueSemantics() &&
                        !pParameterType._hasFieldWithoutSemantic()) {

                        pParameterType._addPointIndexInDepth();
                    }
                    else {
                        pParameterType._addPointIndex(false);
                        pParameterType._setVideoBufferInDepth();
                    }
                }
                else if (pParameter._getSemantic() !== "") {
                    pParameterType._addPointIndex(false);
                    pParameterType._setVideoBufferInDepth();
                }
            }

            this._pParameterList.push(pParameter);
            pParameter._setParent(this);

            if (!pParameter._hasInitializer()) {
                this._nParamsNeeded++;
            }

            return true;
        }

        getParameListForShaderInput(): IAFXVariableDeclInstruction[] {
            return this._pParamListForShaderInput;
        }

        isComplexShaderInput(): boolean {
            return this._bIsComplexShaderInput;
        }

        _clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): FunctionDefInstruction {
            var pClone: FunctionDefInstruction = <FunctionDefInstruction>super._clone(pRelationMap);

            pClone.setFunctionName(<IAFXIdInstruction>this._pFunctionName._clone(pRelationMap));
            pClone.setReturnType(<IAFXVariableTypeInstruction>this.getReturnType()._clone(pRelationMap));

            for (var i: uint = 0; i < this._pParameterList.length; i++) {
                pClone.addParameter(this._pParameterList[i]._clone(pRelationMap));
            }

            var pShaderParams: IAFXVariableDeclInstruction[] = [];
            for (var i: uint = 0; i < this._pParamListForShaderInput.length; i++) {
                pShaderParams.push(this._pParamListForShaderInput[i]._clone(pRelationMap));
            }

            pClone._setShaderParams(pShaderParams, this._bIsComplexShaderInput);
            pClone._setAnalyzedInfo(this._isAnalyzedForVertexUsage,
                this._isAnalyzedForPixelUsage,
                this._bCanUsedAsFunction);

            return pClone;
        }

        _setShaderParams(pParamList: IAFXVariableDeclInstruction[], isComplexInput: boolean): void {
            this._pParamListForShaderInput = pParamList;
            this._bIsComplexShaderInput = isComplexInput;
        }

        _setAnalyzedInfo(isAnalyzedForVertexUsage: boolean,
            isAnalyzedForPixelUsage: boolean,
            bCanUsedAsFunction: boolean): void {
            this._isAnalyzedForVertexUsage = isAnalyzedForVertexUsage;
            this._isAnalyzedForPixelUsage = isAnalyzedForPixelUsage;
            this._bCanUsedAsFunction = bCanUsedAsFunction;
        }

        _getStringDef(): string {
            if (this._sDefinition === "") {
                this._sDefinition = this._pReturnType._getHash() + " " + this._getName() + "(";

                for (var i: uint = 0; i < this._pParameterList.length; i++) {
                    this._sDefinition += this._pParameterList[i]._getType()._getHash() + ",";
                }

                this._sDefinition += ")";
            }

            return this._sDefinition;
        }

        _canUsedAsFunction(): boolean {
            return this._bCanUsedAsFunction;
        }

        _checkForVertexUsage(): boolean {
            if (this._isAnalyzedForVertexUsage) {
                return this._isForVertex();
            }

            this._isAnalyzedForVertexUsage = true;

            var isGood: boolean = true;

            isGood = this.checkReturnTypeForVertexUsage();
            if (!isGood) {
                this._setForVertex(false);
                return false;
            }

            isGood = this.checkArgumentsForVertexUsage();
            if (!isGood) {
                this._setForVertex(false);
                return false;
            }

            this._setForVertex(true);

            return true;
        }

        _checkForPixelUsage(): boolean {
            if (this._isAnalyzedForPixelUsage) {
                return this._isForPixel();
            }

            this._isAnalyzedForPixelUsage = true;

            var isGood: boolean = true;

            isGood = this.checkReturnTypeForPixelUsage();
            if (!isGood) {
                this._setForPixel(false);
                return false;
            }

            isGood = this.checkArgumentsForPixelUsage();
            if (!isGood) {
                this._setForPixel(false);
                return false;
            }

            this._setForPixel(true);

            return true;
        }

        private checkReturnTypeForVertexUsage(): boolean {
            var pReturnType: IAFXVariableTypeInstruction = this._pReturnType;
            var isGood: boolean = true;

            if (pReturnType._isEqual(Effect.getSystemType("void"))) {
                return true;
            }

            if (pReturnType._isComplex()) {
                isGood = !pReturnType._hasFieldWithoutSemantic();
                if (!isGood) {
                    return false;
                }

                isGood = pReturnType._hasAllUniqueSemantics();
                if (!isGood) {
                    return false;
                }

                // isGood = pReturnType._hasFieldWithSematic("POSITION");
                // if(!isGood){
                // 	return false;
                // }

                isGood = !pReturnType._containSampler();
                if (!isGood) {
                    return false;
                }

                isGood = !pReturnType._containPointer() && !pReturnType._isPointer();
                if (!isGood) {
                    return false;
                }

                isGood = !pReturnType._containComplexType();
                if (!isGood) {
                    return false;
                }

                return true;
            }
            else {
                isGood = pReturnType._isEqual(Effect.getSystemType("float4"));
                if (!isGood) {
                    return false;
                }

                isGood = (this._getSemantic() === "POSITION");
                if (!isGood) {
                    return false;
                }

                return true;
            }
        }

        private checkReturnTypeForPixelUsage(): boolean {
            var pReturnType: IAFXVariableTypeInstruction = this._pReturnType;
            var isGood: boolean = true;

            if (pReturnType._isEqual(Effect.getSystemType("void"))) {
                return true;
            }

            isGood = pReturnType._isBase();
            if (!isGood) {
                return false;
            }

            isGood = pReturnType._isEqual(Effect.getSystemType("float4"));
            if (!isGood) {
                return false;
            }

            isGood = this._getSemantic() === "COLOR";
            if (!isGood) {
                return false;
            }

            return true;
        }

        private checkArgumentsForVertexUsage(): boolean {
            var pArguments: IAFXVariableDeclInstruction[] = this._pParameterList;
            var isAttributeByStruct: boolean = false;
            var isAttributeByParams: boolean = false;
            var isStartAnalyze: boolean = false;

            this._pParamListForShaderInput = [];
            this._pParamListForShaderCompile = [];

            for (var i: uint = 0; i < pArguments.length; i++) {
                var pParam: IAFXVariableDeclInstruction = pArguments[i];

                if (pParam._isUniform()) {
                    this._pParamListForShaderCompile.push(pParam);
                    continue;
                }

                if (!isStartAnalyze) {
                    if (pParam._getSemantic() === "") {
                        if (pParam._getType()._isBase() ||
                            pParam._getType()._hasFieldWithoutSemantic() ||
                            !pParam._getType()._hasAllUniqueSemantics()) {
                            return false;
                        }

                        isAttributeByStruct = true;
                    }
                    else if (pParam._getSemantic() !== "") {
                        if (pParam._getType()._isComplex() &&
                            (pParam._getType()._hasFieldWithoutSemantic() ||
                            !pParam._getType()._hasAllUniqueSemantics())) {
                            return false;
                        }

                        isAttributeByParams = true;
                    }

                    isStartAnalyze = true;
                }
                else if (isAttributeByStruct) {
                    return false;
                }
                else if (isAttributeByParams) {
                    if (pParam._getSemantic() === "") {
                        return false;
                    }

                    if (pParam._getType()._isComplex() &&
                        (pParam._getType()._hasFieldWithoutSemantic() ||
                        !pParam._getType()._hasAllUniqueSemantics())) {
                        return false;
                    }
                }

                this._pParamListForShaderInput.push(pParam);
            }

            if (isAttributeByStruct) {
                this._bIsComplexShaderInput = true;
            }

            return true;
        }

        private checkArgumentsForPixelUsage(): boolean {
            var pArguments: IAFXVariableDeclInstruction[] = this._pParameterList;
            var isVaryingsByStruct: boolean = false;
            var isVaryingsByParams: boolean = false;
            var isStartAnalyze: boolean = false;

            this._pParamListForShaderInput = [];
            this._pParamListForShaderCompile = [];

            for (var i: uint = 0; i < pArguments.length; i++) {
                var pParam: IAFXVariableDeclInstruction = pArguments[i];

                if (pParam._isUniform()) {
                    this._pParamListForShaderCompile.push(pParam);
                    continue;
                }

                if (!isStartAnalyze) {
                    if (pParam._getSemantic() === "") {
                        if (pParam._getType()._isBase() ||
                            pParam._getType()._hasFieldWithoutSemantic() ||
                            !pParam._getType()._hasAllUniqueSemantics() ||
                            pParam._getType()._containSampler() ||
                            pParam._getType()._containPointer() ||
                            pParam._getType()._isPointer()) {
                            return false;
                        }

                        isVaryingsByStruct = true;
                    }
                    else if (pParam._getSemantic() !== "") {
                        if (pParam._getType()._isStrictPointer() ||
                            pParam._getType()._containPointer() ||
                            pParam._getType()._containSampler() ||
                            Effect.isSamplerType(pParam._getType())) {
                            //LOG(2, pParam._getType()._isPointer(),
                            //    pParam._getType()._containPointer(),
                            //    pParam._getType()._containSampler(),
                            //    Effect.isSamplerType(pParam._getType()));
                            return false;
                        }

                        if (pParam._getType()._isComplex() &&
                            (pParam._getType()._hasFieldWithoutSemantic() ||
                            !pParam._getType()._hasAllUniqueSemantics())) {
                            return false;
                        }

                        isVaryingsByParams = true;
                    }

                    isStartAnalyze = true;
                }
                else if (isVaryingsByStruct) {
                    return false;
                }
                else if (isVaryingsByParams) {
                    if (pParam._getSemantic() === "") {
                        return false;
                    }

                    if (pParam._getType()._isStrictPointer() ||
                        pParam._getType()._containPointer() ||
                        pParam._getType()._containSampler() ||
                        Effect.isSamplerType(pParam._getType())) {
                        return false;
                    }

                    if (pParam._getType()._isComplex() &&
                        (pParam._getType()._hasFieldWithoutSemantic() ||
                        !pParam._getType()._hasAllUniqueSemantics())) {
                        return false;
                    }
                }

                this._pParamListForShaderInput.push(pParam);
            }

            if (isVaryingsByStruct) {
                this._bIsComplexShaderInput = true;
            }

            return true;
        }
        // _getHash(): string {
        // 	if(this._sHash === "") {
        // 		this.calcHash();
        // 	}

        // 	return this._sHash;
        // }

        // private calcHash(): void {
        // 	var sHash: string = "";
        // 	sHash = this._pFunctionName._getName();
        // 	sHash += "(";

        // 	for(var i: uint = 0; i < this._pParameterList.length; i++){
        // 		sHash += this._pParameterList[i]
        // 	}

        // }
    }
}