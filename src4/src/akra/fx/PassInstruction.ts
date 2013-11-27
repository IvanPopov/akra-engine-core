/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AERenderStates.ts" />
/// <reference path="../idl/AERenderStateValues.ts" />


import render = require("render");
import DeclInstruction = require("fx/DeclInstruction");



class PassInstruction extends DeclInstruction implements AIAFXPassInstruction {
    private _pTempNodeList: AIParseNode[] = null;
    private _pTempFoundedFuncList: AIAFXFunctionDeclInstruction[] = null;
    private _pTempFoundedFuncTypeList: AEFunctionType[] = null;
    private _pParseNode: AIParseNode = null;

    private _sFunctionCode: string = "";

    private _isComlexPass: boolean = false;
    private _pShadersMap: AIAFXFunctionDeclMap = null;
    private _fnPassFunction: { (engine: any, foreigtn: any, uniforms: any): void; } = null;

    private _pVertexShader: AIAFXFunctionDeclInstruction = null;
    private _pPixelShader: AIAFXFunctionDeclInstruction = null;
    private _pPassStateMap: AIMap<AERenderStateValues> = null;


    private _pSharedVariableMapV: AIAFXVariableDeclMap = null;
    private _pGlobalVariableMapV: AIAFXVariableDeclMap = null;
    private _pUniformVariableMapV: AIAFXVariableDeclMap = null;
    private _pForeignVariableMapV: AIAFXVariableDeclMap = null;
    private _pTextureVariableMapV: AIAFXVariableDeclMap = null;
    private _pUsedComplexTypeMapV: AIAFXTypeMap = null;

    private _pSharedVariableMapP: AIAFXVariableDeclMap = null;
    private _pGlobalVariableMapP: AIAFXVariableDeclMap = null;
    private _pUniformVariableMapP: AIAFXVariableDeclMap = null;
    private _pForeignVariableMapP: AIAFXVariableDeclMap = null;
    private _pTextureVariableMapP: AIAFXVariableDeclMap = null;
    private _pUsedComplexTypeMapP: AIAFXTypeMap = null;

    private _pFullUniformVariableMap: AIAFXVariableDeclMap = null;
    private _pFullForeignVariableMap: AIAFXVariableDeclMap = null;
    private _pFullTextureVariableMap: AIAFXVariableDeclMap = null;


    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_PassInstruction;
    }

    _addFoundFunction(pNode: AIParseNode, pShader: AIAFXFunctionDeclInstruction, eType: AEFunctionType): void {
        if (isNull(this._pTempNodeList)) {
            this._pTempNodeList = [];
            this._pTempFoundedFuncList = [];
            this._pTempFoundedFuncTypeList = [];
        }

        this._pTempNodeList.push(pNode);
        this._pTempFoundedFuncList.push(pShader);
        this._pTempFoundedFuncTypeList.push(eType);
    }

    _getFoundedFunction(pNode: AIParseNode): AIAFXFunctionDeclInstruction {
        if (isNull(this._pTempNodeList)) {
            return null;
        }

        for (var i: uint = 0; i < this._pTempNodeList.length; i++) {
            if (this._pTempNodeList[i] === pNode) {
                return this._pTempFoundedFuncList[i];
            }
        }

        return null;
    }

    _getFoundedFunctionType(pNode: AIParseNode): AEFunctionType {
        if (isNull(this._pTempNodeList)) {
            return null;
        }

        for (var i: uint = 0; i < this._pTempNodeList.length; i++) {
            if (this._pTempNodeList[i] === pNode) {
                return this._pTempFoundedFuncTypeList[i];
            }
        }

        return null;
    }

    _setParseNode(pNode: AIParseNode): void {
        this._pParseNode = pNode;
    }

    _getParseNode(): AIParseNode {
        return this._pParseNode;
    }

    _addCodeFragment(sCode: string): void {
        if (this.isComplexPass()) {
            this._sFunctionCode += sCode;
        }
    }

    _markAsComplex(isComplex: boolean): void {
        this._isComlexPass = isComplex;
    }

    _getSharedVariableMapV(): AIAFXVariableDeclMap {
        return this._pSharedVariableMapV;
    }

    _getGlobalVariableMapV(): AIAFXVariableDeclMap {
        return this._pGlobalVariableMapV;
    }

    _getUniformVariableMapV(): AIAFXVariableDeclMap {
        return this._pUniformVariableMapV;
    }

    _getForeignVariableMapV(): AIAFXVariableDeclMap {
        return this._pForeignVariableMapV;
    }

    _getTextureVariableMapV(): AIAFXVariableDeclMap {
        return this._pTextureVariableMapV;
    }

    _getUsedComplexTypeMapV(): AIAFXTypeMap {
        return this._pUsedComplexTypeMapV;
    }

    _getSharedVariableMapP(): AIAFXVariableDeclMap {
        return this._pSharedVariableMapP;
    }

    _getGlobalVariableMapP(): AIAFXVariableDeclMap {
        return this._pGlobalVariableMapP;
    }

    _getUniformVariableMapP(): AIAFXVariableDeclMap {
        return this._pUniformVariableMapP;
    }

    _getForeignVariableMapP(): AIAFXVariableDeclMap {
        return this._pForeignVariableMapP;
    }

    _getTextureVariableMapP(): AIAFXVariableDeclMap {
        return this._pTextureVariableMapP;
    }

    _getUsedComplexTypeMapP(): AIAFXTypeMap {
        return this._pUsedComplexTypeMapP;
    }

    _getFullUniformMap(): AIAFXVariableDeclMap {
        return this._pFullUniformVariableMap;
    }

    _getFullForeignMap(): AIAFXVariableDeclMap {
        return this._pFullForeignVariableMap;
    }

    _getFullTextureMap(): AIAFXVariableDeclMap {
        return this._pFullTextureVariableMap;
    }


    isComplexPass(): boolean {
        return this._isComlexPass;
    }

    getVertexShader(): AIAFXFunctionDeclInstruction {
        return this._pVertexShader;
    }

    getPixelShader(): AIAFXFunctionDeclInstruction {
        return this._pPixelShader;
    }

    addShader(pShader: AIAFXFunctionDeclInstruction): void {
        var isVertex: boolean = pShader.getFunctionType() === AEFunctionType.k_Vertex;

        if (this.isComplexPass()) {
            if (isNull(this._pShadersMap)) {
                this._pShadersMap = <AIAFXFunctionDeclMap>{};
            }
            var iShader: uint = pShader._getInstructionID();
            this._pShadersMap[iShader] = pShader;

            var sCode: string = isVertex ? "this._pVertexShader=" : "this._pPixelShader=";
            sCode += "this._pShadersMap[" + iShader.toString() + "];"
				this._addCodeFragment(sCode);
        }
        else {
            if (isVertex) {
                this._pVertexShader = pShader;
            }
            else {
                this._pPixelShader = pShader;
            }
        }
    }

    setState(eType: AERenderStates, eValue: AERenderStateValues): void {
        if (isNull(this._pPassStateMap)) {
            this._pPassStateMap = render.createRenderStateMap();
        }

        if (this.isComplexPass()) {
            this._addCodeFragment("this._pPassStateMap[" + eType + "]=" + eValue + ";");
        }
        else {
            this._pPassStateMap[eType] = eValue;
        }
    }

    finalizePass(): void {
        if (this.isComplexPass()) {
            this._fnPassFunction = <any>(new Function("engine", "foreigns", "uniforms", this._sFunctionCode));
        }

        this.generateInfoAboutUsedVaraibles();

        this._pTempNodeList = null;
        this._pTempFoundedFuncList = null;
        this._pTempFoundedFuncTypeList = null;
        this._pParseNode = null;
        this._sFunctionCode = "";
    }

    evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean {
        if (this.isComplexPass()) {
            this._pVertexShader = null;
            this._pPixelShader = null;
            this.clearPassStates();

            this._fnPassFunction.call(this, pEngineStates, pForeigns, pUniforms);
        }

        return true;
    }

    getState(eType: AERenderStates): AERenderStateValues {
        return !isNull(this._pPassStateMap) ? this._pPassStateMap[eType] : AERenderStateValues.UNDEF;
    }

    _getRenderStates(): AIMap<AERenderStateValues> {
        return this._pPassStateMap;
    }

    private clearPassStates(): void {
        if (!isNull(this._pPassStateMap)) {
            this._pPassStateMap[AERenderStates.BLENDENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.CULLFACEENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.ZENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.ZWRITEENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.DITHERENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.SCISSORTESTENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.STENCILTESTENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.POLYGONOFFSETFILLENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.CULLFACE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.FRONTFACE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.SRCBLEND] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.DESTBLEND] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.ZFUNC] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.ALPHABLENDENABLE] = AERenderStateValues.UNDEF;
            this._pPassStateMap[AERenderStates.ALPHATESTENABLE] = AERenderStateValues.UNDEF;
        }
    }

    private generateInfoAboutUsedVaraibles(): void {
        if (isNull(this._pSharedVariableMapV)) {
            this._pSharedVariableMapV = <AIAFXVariableDeclMap>{};
            this._pGlobalVariableMapV = <AIAFXVariableDeclMap>{};
            this._pUniformVariableMapV = <AIAFXVariableDeclMap>{};
            this._pForeignVariableMapV = <AIAFXVariableDeclMap>{};
            this._pTextureVariableMapV = <AIAFXVariableDeclMap>{};
            this._pUsedComplexTypeMapV = <AIAFXTypeMap>{};

            this._pSharedVariableMapP = <AIAFXVariableDeclMap>{};
            this._pGlobalVariableMapP = <AIAFXVariableDeclMap>{};
            this._pUniformVariableMapP = <AIAFXVariableDeclMap>{};
            this._pForeignVariableMapP = <AIAFXVariableDeclMap>{};
            this._pTextureVariableMapP = <AIAFXVariableDeclMap>{};
            this._pUsedComplexTypeMapP = <AIAFXTypeMap>{};

            this._pFullUniformVariableMap = <AIAFXVariableDeclMap>{};
            this._pFullForeignVariableMap = <AIAFXVariableDeclMap>{};
            this._pFullTextureVariableMap = <AIAFXVariableDeclMap>{};
        }

        if (this.isComplexPass()) {
            for (var i in this._pShadersMap) {
                this.addInfoAbouUsedVariablesFromFunction(this._pShadersMap[i]);
            }
        }
        else {
            if (!isNull(this._pVertexShader)) {
                this.addInfoAbouUsedVariablesFromFunction(this._pVertexShader);
            }
            if (!isNull(this._pPixelShader)) {
                this.addInfoAbouUsedVariablesFromFunction(this._pPixelShader);
            }
        }
    }

    private addInfoAbouUsedVariablesFromFunction(pFunction: AIAFXFunctionDeclInstruction): void {
        var pSharedVars: AIAFXVariableDeclMap = pFunction._getSharedVariableMap();
        var pGlobalVars: AIAFXVariableDeclMap = pFunction._getGlobalVariableMap();
        var pUniformVars: AIAFXVariableDeclMap = pFunction._getUniformVariableMap();
        var pForeignVars: AIAFXVariableDeclMap = pFunction._getForeignVariableMap();
        var pTextureVars: AIAFXVariableDeclMap = pFunction._getTextureVariableMap();
        var pTypes: AIAFXTypeMap = pFunction._getUsedComplexTypeMap();


        var pSharedVarsTo: AIAFXVariableDeclMap = null;
        var pGlobalVarsTo: AIAFXVariableDeclMap = null;
        var pUniformVarsTo: AIAFXVariableDeclMap = null;
        var pForeignVarsTo: AIAFXVariableDeclMap = null;
        var pTextureVarsTo: AIAFXVariableDeclMap = null;
        var pTypesTo: AIAFXTypeMap = null;

        if (pFunction.getFunctionType() === AEFunctionType.k_Vertex) {
            pSharedVarsTo = this._pSharedVariableMapV;
            pGlobalVarsTo = this._pGlobalVariableMapV;
            pUniformVarsTo = this._pUniformVariableMapV;
            pForeignVarsTo = this._pForeignVariableMapV;
            pTextureVarsTo = this._pTextureVariableMapV;
            pTypesTo = this._pUsedComplexTypeMapV;
        }
        else {
            pSharedVarsTo = this._pSharedVariableMapP;
            pGlobalVarsTo = this._pGlobalVariableMapP;
            pUniformVarsTo = this._pUniformVariableMapP;
            pForeignVarsTo = this._pForeignVariableMapP;
            pTextureVarsTo = this._pTextureVariableMapP;
            pTypesTo = this._pUsedComplexTypeMapP;
        }

        for (var i in pSharedVars) {
            if (!isNull(pSharedVars[i]) && !pSharedVars[i].isField()) {
                pSharedVarsTo[i] = pSharedVars[i];
            }
        }
        for (var i in pGlobalVars) {
            if (!isNull(pGlobalVars[i])) {
                pGlobalVarsTo[i] = pGlobalVars[i];
            }
        }
        for (var i in pUniformVars) {
            if (!isNull(pUniformVars[i])) {
                pUniformVarsTo[i] = pUniformVars[i];
                this._pFullUniformVariableMap[i] = pUniformVars[i];
            }
        }
        for (var i in pForeignVars) {
            if (!isNull(pForeignVars[i])) {
                pForeignVarsTo[i] = pForeignVars[i];
                this._pFullForeignVariableMap[i] = pForeignVars[i];
            }
        }
        for (var i in pTextureVars) {
            if (!isNull(pTextureVars[i])) {
                pTextureVarsTo[i] = pTextureVars[i];
                this._pFullTextureVariableMap[i] = pTextureVars[i];
            }
        }
        for (var i in pTypes) {
            if (!isNull(pTypes[i])) {
                pTypesTo[i] = pTypes[i];
            }
        }
    }

    static POST_EFFECT_SEMANTIC = "POST_EFFECT";
}


export = PassInstruction;