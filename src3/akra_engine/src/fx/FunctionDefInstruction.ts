/// <reference path="../idl/AEEffectErrors.ts" />

import DeclInstruction = require("fx/DeclInstruction");
import Effect = require("fx/Effect");


/**
 * Represent type func(...args)[:Semantic]
 * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
 */
class FunctionDefInstruction extends DeclInstruction {
    private _pParameterList: AIAFXVariableDeclInstruction[] = null;
    private _pParamListForShaderCompile: AIAFXVariableDeclInstruction[] = null;
    private _pParamListForShaderInput: AIAFXVariableDeclInstruction[] = null;
    private _isComplexShaderInput: boolean = false;

    private _pReturnType: AIAFXVariableTypeInstruction = null;
    private _pFunctionName: AIAFXIdInstruction = null;
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
        this._eInstructionType = AEAFXInstructionTypes.k_FunctionDefInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";

        if (!this.isShaderDef()) {

            sCode += this._pReturnType.toFinalCode();
            sCode += " " + this._pFunctionName.toFinalCode();
            sCode += "(";

            for (var i: uint = 0; i < this._pParameterList.length; i++) {
                sCode += this._pParameterList[i].toFinalCode();

                if (i !== this._pParameterList.length - 1) {
                    sCode += ",";
                }
            }

            sCode += ")";
        }
        else {
            sCode = "void " + this._pFunctionName.toFinalCode() + "()";
        }

        return sCode;
    }

    setType(pType: AIAFXTypeInstruction): void {
        this.setReturnType(<AIAFXVariableTypeInstruction>pType);
    }

    getType(): AIAFXTypeInstruction {
        return <AIAFXTypeInstruction>this.getReturnType();
    }

    setReturnType(pReturnType: AIAFXVariableTypeInstruction): boolean {
        this._pReturnType = pReturnType;
        pReturnType.setParent(this);
        return true;
    }
    getReturnType(): AIAFXVariableTypeInstruction {
        return this._pReturnType;
    }

    setFunctionName(pNameId: AIAFXIdInstruction): boolean {
        this._pFunctionName = pNameId;
        pNameId.setParent(this);
        return true;
    }

    getName(): string {
        return this._pFunctionName.getName();
    }

    getRealName(): string {
        return this._pFunctionName.getRealName();
    }

    getNameId(): AIAFXIdInstruction {
        return this._pFunctionName;
    }

    getArguments(): AIAFXVariableDeclInstruction[] {
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

    addParameter(pParameter: AIAFXVariableDeclInstruction, isStrictModeOn?: boolean): boolean {
        if (this._pParameterList.length > this._nParamsNeeded &&
            !pParameter.hasInitializer()) {

                this.setError(AEEffectErrors.BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT,
                {
                    funcName: this._pFunctionName.getName(),
                    varName: pParameter.getName()
                });
            return false;
        }

        var pParameterType: AIAFXVariableTypeInstruction = pParameter.getType();

        if (pParameterType.isPointer() || pParameterType._containPointer()) {
            if (pParameterType.hasUsage("uniform") ||
                pParameterType.hasUsage("out") ||
                pParameterType.hasUsage("inout")) {

                    this.setError(AEEffectErrors.BAD_FUNCTION_PARAMETER_USAGE,
                    {
                        funcName: this._pFunctionName.getName(),
                        varName: pParameter.getName()
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

            if (pParameterType.isComplex() &&
                !pParameterType.hasFieldWithoutSemantic() &&
                pParameterType.hasAllUniqueSemantics()) {

                if (pParameter.getSemantic() === "" &&
                    pParameterType.hasAllUniqueSemantics() &&
                    !pParameterType.hasFieldWithoutSemantic()) {

                    pParameterType._addPointIndexInDepth();
                }
                else {
                    pParameterType.addPointIndex(false);
                    pParameterType._setVideoBufferInDepth();
                }
            }
            else if (pParameter.getSemantic() !== "") {
                pParameterType.addPointIndex(false);
                pParameterType._setVideoBufferInDepth();
            }
        }

        this._pParameterList.push(pParameter);
        pParameter.setParent(this);

        if (!pParameter.hasInitializer()) {
            this._nParamsNeeded++;
        }

        return true;
    }

    getParameListForShaderInput(): AIAFXVariableDeclInstruction[] {
        return this._pParamListForShaderInput;
    }

    isComplexShaderInput(): boolean {
        return this._isComplexShaderInput;
    }

    clone(pRelationMap: AIAFXInstructionMap = <AIAFXInstructionMap>{}): FunctionDefInstruction {
        var pClone: FunctionDefInstruction = <FunctionDefInstruction>super.clone(pRelationMap);

        pClone.setFunctionName(<AIAFXIdInstruction>this._pFunctionName.clone(pRelationMap));
        pClone.setReturnType(<AIAFXVariableTypeInstruction>this.getReturnType().clone(pRelationMap));

        for (var i: uint = 0; i < this._pParameterList.length; i++) {
            pClone.addParameter(this._pParameterList[i].clone(pRelationMap));
        }

        var pShaderParams: AIAFXVariableDeclInstruction[] = [];
        for (var i: uint = 0; i < this._pParamListForShaderInput.length; i++) {
            pShaderParams.push(this._pParamListForShaderInput[i].clone(pRelationMap));
        }

        pClone._setShaderParams(pShaderParams, this._isComplexShaderInput);
        pClone._setAnalyzedInfo(this._isAnalyzedForVertexUsage,
            this._isAnalyzedForPixelUsage,
            this._bCanUsedAsFunction);

        return pClone;
    }

    _setShaderParams(pParamList: AIAFXVariableDeclInstruction[], isComplexInput: boolean): void {
        this._pParamListForShaderInput = pParamList;
        this._isComplexShaderInput = isComplexInput;
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
            this._sDefinition = this._pReturnType.getHash() + " " + this.getName() + "(";

            for (var i: uint = 0; i < this._pParameterList.length; i++) {
                this._sDefinition += this._pParameterList[i].getType().getHash() + ",";
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
        var pReturnType: AIAFXVariableTypeInstruction = this._pReturnType;
        var isGood: boolean = true;

        if (pReturnType.isEqual(Effect.getSystemType("void"))) {
            return true;
        }

        if (pReturnType.isComplex()) {
            isGood = !pReturnType.hasFieldWithoutSemantic();
            if (!isGood) {
                return false;
            }

            isGood = pReturnType.hasAllUniqueSemantics();
            if (!isGood) {
                return false;
            }

            // isGood = pReturnType.hasFieldWithSematic("POSITION");
            // if(!isGood){
            // 	return false;
            // }

            isGood = !pReturnType._containSampler();
            if (!isGood) {
                return false;
            }

            isGood = !pReturnType._containPointer() && !pReturnType.isPointer();
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
            isGood = pReturnType.isEqual(Effect.getSystemType("float4"));
            if (!isGood) {
                return false;
            }

            isGood = (this.getSemantic() === "POSITION");
            if (!isGood) {
                return false;
            }

            return true;
        }
    }

    private checkReturnTypeForPixelUsage(): boolean {
        var pReturnType: AIAFXVariableTypeInstruction = this._pReturnType;
        var isGood: boolean = true;

        if (pReturnType.isEqual(Effect.getSystemType("void"))) {
            return true;
        }

        isGood = pReturnType.isBase();
        if (!isGood) {
            return false;
        }

        isGood = pReturnType.isEqual(Effect.getSystemType("float4"));
        if (!isGood) {
            return false;
        }

        isGood = this.getSemantic() === "COLOR";
        if (!isGood) {
            return false;
        }

        return true;
    }

    private checkArgumentsForVertexUsage(): boolean {
        var pArguments: AIAFXVariableDeclInstruction[] = this._pParameterList;
        var isAttributeByStruct: boolean = false;
        var isAttributeByParams: boolean = false;
        var isStartAnalyze: boolean = false;

        this._pParamListForShaderInput = [];
        this._pParamListForShaderCompile = [];

        for (var i: uint = 0; i < pArguments.length; i++) {
            var pParam: AIAFXVariableDeclInstruction = pArguments[i];

            if (pParam.isUniform()) {
                this._pParamListForShaderCompile.push(pParam);
                continue;
            }

            if (!isStartAnalyze) {
                if (pParam.getSemantic() === "") {
                    if (pParam.getType().isBase() ||
                        pParam.getType().hasFieldWithoutSemantic() ||
                        !pParam.getType().hasAllUniqueSemantics()) {
                        return false;
                    }

                    isAttributeByStruct = true;
                }
                else if (pParam.getSemantic() !== "") {
                    if (pParam.getType().isComplex() &&
                        (pParam.getType().hasFieldWithoutSemantic() ||
                        !pParam.getType().hasAllUniqueSemantics())) {
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
                if (pParam.getSemantic() === "") {
                    return false;
                }

                if (pParam.getType().isComplex() &&
                    (pParam.getType().hasFieldWithoutSemantic() ||
                    !pParam.getType().hasAllUniqueSemantics())) {
                    return false;
                }
            }

            this._pParamListForShaderInput.push(pParam);
        }

        if (isAttributeByStruct) {
            this._isComplexShaderInput = true;
        }

        return true;
    }

    private checkArgumentsForPixelUsage(): boolean {
        var pArguments: AIAFXVariableDeclInstruction[] = this._pParameterList;
        var isVaryingsByStruct: boolean = false;
        var isVaryingsByParams: boolean = false;
        var isStartAnalyze: boolean = false;

        this._pParamListForShaderInput = [];
        this._pParamListForShaderCompile = [];

        for (var i: uint = 0; i < pArguments.length; i++) {
            var pParam: AIAFXVariableDeclInstruction = pArguments[i];

            if (pParam.isUniform()) {
                this._pParamListForShaderCompile.push(pParam);
                continue;
            }

            if (!isStartAnalyze) {
                if (pParam.getSemantic() === "") {
                    if (pParam.getType().isBase() ||
                        pParam.getType().hasFieldWithoutSemantic() ||
                        !pParam.getType().hasAllUniqueSemantics() ||
                        pParam.getType()._containSampler() ||
                        pParam.getType()._containPointer() ||
                        pParam.getType().isPointer()) {
                        return false;
                    }

                    isVaryingsByStruct = true;
                }
                else if (pParam.getSemantic() !== "") {
                    if (pParam.getType().isStrictPointer() ||
                        pParam.getType()._containPointer() ||
                        pParam.getType()._containSampler() ||
                        Effect.isSamplerType(pParam.getType())) {
                        //LOG(2, pParam.getType().isPointer(),
                        //    pParam.getType()._containPointer(),
                        //    pParam.getType()._containSampler(),
                        //    Effect.isSamplerType(pParam.getType()));
                        return false;
                    }

                    if (pParam.getType().isComplex() &&
                        (pParam.getType().hasFieldWithoutSemantic() ||
                        !pParam.getType().hasAllUniqueSemantics())) {
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
                if (pParam.getSemantic() === "") {
                    return false;
                }

                if (pParam.getType().isStrictPointer() ||
                    pParam.getType()._containPointer() ||
                    pParam.getType()._containSampler() ||
                    Effect.isSamplerType(pParam.getType())) {
                    return false;
                }

                if (pParam.getType().isComplex() &&
                    (pParam.getType().hasFieldWithoutSemantic() ||
                    !pParam.getType().hasAllUniqueSemantics())) {
                    return false;
                }
            }

            this._pParamListForShaderInput.push(pParam);
        }

        if (isVaryingsByStruct) {
            this._isComplexShaderInput = true;
        }

        return true;
    }
    // getHash(): string {
    // 	if(this._sHash === "") {
    // 		this.calcHash();
    // 	}

    // 	return this._sHash;
    // }

    // private calcHash(): void {
    // 	var sHash: string = "";
    // 	sHash = this._pFunctionName.getName();
    // 	sHash += "(";

    // 	for(var i: uint = 0; i < this._pParameterList.length; i++){
    // 		sHash += this._pParameterList[i]
    // 	}

    // }
}


export = FunctionDefInstruction;