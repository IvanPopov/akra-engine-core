/// <reference path="../idl/AIAFXInstruction.ts" />
/// <reference path="../idl/AIParser.ts" />
/// <reference path="../idl/AEEffectErrors.ts" />

import debug = require("debug");

import DeclInstruction = require("fx/DeclInstruction");
import ExtractStmtInstruction = require("fx/ExtractStmtInstruction");
import FunctionDefInstruction = require("fx/FunctionDefInstruction");
import IdInstruction = require("fx/IdInstruction");
import Instruction = require("fx/Instruction");
import InstructionCollector = require("fx/InstructionCollector");
import SamplerStateBlockInstruction = require("fx/SamplerStateBlockInstruction");
import StmtBlockInstruction = require("fx/StmtBlockInstruction");
import VariableTypeInstruction = require("fx/VariableTypeInstruction");
import VariableDeclInstruction = require("fx/VariableInstruction");

import Effect = require("fx/Effect");

/**
 * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
 * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
 */
class FunctionDeclInstruction extends DeclInstruction implements AIAFXFunctionDeclInstruction {
    protected _pFunctionDefenition: FunctionDefInstruction = null;
    protected _pImplementation: StmtBlockInstruction = null;
    protected _eFunctionType: AEFunctionType = AEFunctionType.k_Function;

    protected _bUsedAsFunction: boolean = false;
    protected _bUsedAsVertex: boolean = false;
    protected _bUsedAsPixel: boolean = false;
    protected _bCanUsedAsFunction: boolean = true;

    protected _bUsedInVertex: boolean = false;
    protected _bUsedInPixel: boolean = false;

    protected _pParseNode: AIParseNode = null;
    protected _iImplementationScope: uint = Instruction.UNDEFINE_SCOPE;

    protected _isInBlackList: boolean = false;

    protected _pOutVariable: AIAFXVariableDeclInstruction = null;

    //Info about used data
    protected _pUsedFunctionMap: AIAFXFunctionDeclMap = null;
    protected _pUsedFunctionList: AIAFXFunctionDeclInstruction[] = null;

    protected _pAttributeVariableMap: AIAFXVariableDeclMap = null;
    protected _pVaryingVariableMap: AIAFXVariableDeclMap = null;

    protected _pUsedVarTypeMap: AIAFXTypeUseInfoMap = null;

    protected _pSharedVariableMap: AIAFXVariableDeclMap = null;
    protected _pGlobalVariableMap: AIAFXVariableDeclMap = null;
    protected _pUniformVariableMap: AIAFXVariableDeclMap = null;
    protected _pForeignVariableMap: AIAFXVariableDeclMap = null;
    protected _pTextureVariableMap: AIAFXVariableDeclMap = null;

    // protected _pSharedVariableTypeList: AIAFXVariableTypeInstruction[] = null;
    // protected _pGlobalVariableTypeList: AIAFXVariableTypeInstruction[] = null;
    // protected _pUniformVariableTypeList: AIAFXVariableTypeInstruction[] = null;
    // protected _pForeignVariableTypeList: IAFXVariableTypeInstructionnt[] = null;

    protected _pUsedComplexTypeMap: AIAFXTypeMap = null;

    protected _pAttributeVariableKeys: uint[] = null;
    protected _pVaryingVariableKeys: uint[] = null;

    protected _pSharedVariableKeys: uint[] = null;
    protected _pUniformVariableKeys: uint[] = null;
    protected _pForeignVariableKeys: uint[] = null;
    protected _pGlobalVariableKeys: uint[] = null;
    protected _pTextureVariableKeys: uint[] = null;
    protected _pUsedComplexTypeKeys: uint[] = null;

    protected _pVertexShader: AIAFXFunctionDeclInstruction = null;
    protected _pPixelShader: AIAFXFunctionDeclInstruction = null;

    private _pExtSystemTypeList: AIAFXTypeDeclInstruction[] = null;
    private _pExtSystemFunctionList: AIAFXFunctionDeclInstruction[] = null;
    private _pExtSystemMacrosList: AIAFXSimpleInstruction[] = null;


    constructor() {
        super();
        this._pInstructionList = [null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_FunctionDeclInstruction;
    }

    toFinalCode(): string {
        var sCode = "";

        sCode += this._pFunctionDefenition.toFinalCode();
        sCode += this._pImplementation.toFinalCode();

        return sCode;
    }

    toFinalDefCode(): string {
        return this._pFunctionDefenition.toFinalCode();
    }

    getType(): AIAFXTypeInstruction {
        return <AIAFXTypeInstruction>this.getReturnType();
    }

    getName(): string {
        return this._pFunctionDefenition.getName();
    }

    getRealName(): string {
        return this._pFunctionDefenition.getRealName();
    }

    getNameId(): AIAFXIdInstruction {
        return this._pFunctionDefenition.getNameId();
    }

    getArguments(): AIAFXVariableDeclInstruction[] {
        return this._pFunctionDefenition.getArguments();
    }

    getNumNeededArguments(): uint {
        return this._pFunctionDefenition.getNumNeededArguments();
    }

    hasImplementation(): boolean {
        return !isNull(this._pImplementation) || !isNull(this._pParseNode);
    }

    getReturnType(): AIAFXVariableTypeInstruction {
        return this._pFunctionDefenition.getReturnType();
    }

    getFunctionType(): AEFunctionType {
        return this._eFunctionType;
    }

    setFunctionType(eFunctionType: AEFunctionType): void {
        this._eFunctionType = eFunctionType;
    }

    _setImplementationScope(iScope: uint): void {
        this._iImplementationScope = iScope;
    }

    _getImplementationScope(): uint {
        return this._iImplementationScope;
    }

    _setParseNode(pNode: AIParseNode): void {
        this._pParseNode = pNode;
    }

    _getParseNode(): AIParseNode {
        return this._pParseNode;
    }

    setFunctionDef(pFunctionDef: AIAFXDeclInstruction): void {
        this._pFunctionDefenition = <FunctionDefInstruction>pFunctionDef;
        this._pInstructionList[0] = pFunctionDef;
        pFunctionDef.setParent(this);
        this._nInstructions = this._nInstructions === 0 ? 1 : this._nInstructions;
    }

    setImplementation(pImplementation: AIAFXStmtInstruction): void {
        this._pImplementation = <StmtBlockInstruction>pImplementation;
        this._pInstructionList[1] = pImplementation;
        pImplementation.setParent(pImplementation);
        this._nInstructions = 2;

        this._pParseNode = null;
    }

    clone(pRelationMap: AIAFXInstructionMap = <AIAFXInstructionMap>{}): AIAFXFunctionDeclInstruction {
        var pClone: FunctionDeclInstruction = <FunctionDeclInstruction>super.clone(pRelationMap);

        if (!isNull(this._pOutVariable)) {
            pClone._setOutVariable(<AIAFXVariableDeclInstruction>pRelationMap[this._pOutVariable._getInstructionID()]);
        }

        var pUsedVarTypeMap: AIAFXTypeUseInfoMap = this.cloneVarTypeUsedMap(this._pUsedVarTypeMap, pRelationMap);
        var pSharedVariableMap: AIAFXVariableDeclMap = this.cloneVarDeclMap(this._pSharedVariableMap, pRelationMap);
        var pGlobalVariableMap: AIAFXVariableDeclMap = this.cloneVarDeclMap(this._pGlobalVariableMap, pRelationMap);
        var pUniformVariableMap: AIAFXVariableDeclMap = this.cloneVarDeclMap(this._pUniformVariableMap, pRelationMap);
        var pForeignVariableMap: AIAFXVariableDeclMap = this.cloneVarDeclMap(this._pForeignVariableMap, pRelationMap);
        var pTextureVariableMap: AIAFXVariableDeclMap = this.cloneVarDeclMap(this._pTextureVariableMap, pRelationMap);
        var pUsedComplexTypeMap: AIAFXTypeMap = this.cloneTypeMap(this._pUsedComplexTypeMap, pRelationMap);

        pClone._setUsedFunctions(this._pUsedFunctionMap, this._pUsedFunctionList);
        pClone._setUsedVariableData(pUsedVarTypeMap,
            pSharedVariableMap,
            pGlobalVariableMap,
            pUniformVariableMap,
            pForeignVariableMap,
            pTextureVariableMap,
            pUsedComplexTypeMap);
        pClone._initAfterClone();

        return pClone;
    }

    _addOutVariable(pVariable: AIAFXVariableDeclInstruction): boolean {
        if (!isNull(this._pOutVariable)) {
            return false;
        }

        if (!pVariable.getType().isEqual(this.getReturnType())) {
            return false;
        }

        this._pOutVariable = pVariable;
        return true;
    }

    _getOutVariable(): AIAFXVariableDeclInstruction {
        return this._pOutVariable;
    }

    _getVertexShader(): AIAFXFunctionDeclInstruction {
        return this._pVertexShader;
    }

    _getPixelShader(): AIAFXFunctionDeclInstruction {
        return this._pPixelShader;
    }

    _markUsedAs(eUsedType: AEFunctionType): void {
        switch (eUsedType) {
            case AEFunctionType.k_Vertex:
                this._bUsedInVertex = true;
                this._bUsedAsVertex = true;
                break;
            case AEFunctionType.k_Pixel:
                this._bUsedInPixel = true;
                this._bUsedAsPixel = true;
                break;
            case AEFunctionType.k_Function:
                this._bUsedAsFunction = true;
                break;
        }
    }

    _isUsedAs(eUsedType: AEFunctionType): boolean {
        switch (eUsedType) {
            case AEFunctionType.k_Vertex:
                return this._bUsedAsVertex;
            case AEFunctionType.k_Pixel:
                return this._bUsedAsPixel;
            case AEFunctionType.k_Function:
                return this._bUsedAsFunction;
        }
    }

    _isUsedAsFunction(): boolean {
        return this._bUsedAsFunction;
    }

    _isUsedAsVertex(): boolean {
        return this._bUsedAsVertex;
    }

    _isUsedAsPixel(): boolean {
        return this._bUsedAsPixel;
    }

    _markUsedInVertex(): void {
        this._bUsedInVertex = true;
    }

    _markUsedInPixel(): void {
        this._bUsedInPixel = true;
    }

    _isUsedInVertex(): boolean {
        return this._bUsedInVertex;
    }

    _isUsedInPixel(): boolean {
        return this._bUsedInPixel;
    }

    _isUsed(): boolean {
        return this._bUsedAsFunction || this._bUsedAsVertex || this._bUsedAsPixel;
    }

    _checkVertexUsage(): boolean {
        return this._isUsedInVertex() ? this._isForVertex() : true;
    }

    _checkPixelUsage(): boolean {
        return this._isUsedInPixel() ? this._isForPixel() : true;
    }

    _checkDefenitionForVertexUsage(): boolean {
        return this._pFunctionDefenition._checkForVertexUsage();
    }

    _checkDefenitionForPixelUsage(): boolean {
        return this._pFunctionDefenition._checkForPixelUsage();
    }

    _canUsedAsFunction(): boolean {
        return this._bCanUsedAsFunction && this._pFunctionDefenition._canUsedAsFunction();
    }

    _notCanUsedAsFunction(): void {
        this._bCanUsedAsFunction = false;
    }

    _addUsedFunction(pFunction: AIAFXFunctionDeclInstruction): boolean {
        if (pFunction._getInstructionType() === AEAFXInstructionTypes.k_SystemFunctionInstruction &&
            !pFunction.isBuiltIn()) {

            this.addExtSystemFunction(pFunction);
            return true;
        }

        if (isNull(this._pUsedFunctionMap)) {
            this._pUsedFunctionMap = <AIAFXFunctionDeclMap>{};
            this._pUsedFunctionList = [];
        }

        var iFuncId: uint = pFunction._getInstructionID();

        if (!isDef(this._pUsedFunctionMap[iFuncId])) {
            this._pUsedFunctionMap[iFuncId] = pFunction;
            this._pUsedFunctionList.push(pFunction);
            return true;
        }

        return false;
    }

    _addUsedVariable(pVariable: AIAFXVariableDeclInstruction): void {

    }

    _getUsedFunctionList(): AIAFXFunctionDeclInstruction[] {
        return this._pUsedFunctionList;
    }

    _isBlackListFunction(): boolean {
        return this._isInBlackList;
    }

    _addToBlackList(): void {
        this._isInBlackList = true;
    }

    _getStringDef(): string {
        return this._pFunctionDefenition._getStringDef();
    }

    _convertToVertexShader(): AIAFXFunctionDeclInstruction {
        var pShader: FunctionDeclInstruction = null;

        if ((!this._canUsedAsFunction() || !this._isUsedAsFunction()) &&
            (!this._isUsedInPixel())) {
            pShader = this;
        }
        else {
            pShader = <FunctionDeclInstruction>this.clone();
        }

        pShader._prepareForVertex();
        this._pVertexShader = pShader;

        return pShader;
    }

    _convertToPixelShader(): AIAFXFunctionDeclInstruction {
        var pShader: FunctionDeclInstruction = null;

        if ((!this._canUsedAsFunction() || !this._isUsedAsFunction()) &&
            (!this._isUsedInVertex())) {
            pShader = this;
        }
        else {
            pShader = <FunctionDeclInstruction>this.clone();
        }

        pShader._prepareForPixel();
        this._pPixelShader = pShader;

        return pShader;
    }

    _prepareForVertex(): void {
        this.setFunctionType(AEFunctionType.k_Vertex);

        var pShaderInputParamList: AIAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
        for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
            var pParamType: AIAFXVariableTypeInstruction = pShaderInputParamList[i].getType();

            if (pParamType.isComplex() &&
                isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) &&
                this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {

                    this.setError(AEEffectTempErrors.BAD_LOCAL_OF_SHADER_INPUT, { funcName: this.getName() });
                return;
            }
        }

        var pOutVariable: AIAFXVariableDeclInstruction = this._getOutVariable();

        if (!isNull(pOutVariable)) {
            if (isDef(this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()]) &&
                this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()].isRead) {

                    this.setError(AEEffectTempErrors.BAD_LOCAL_OF_SHADER_OUTPUT, { funcName: this.getName() });
                return;
            }

            pOutVariable._markAsShaderOutput(true);
        }

        if (this._pFunctionDefenition.isComplexShaderInput()) {
            pShaderInputParamList[0].setVisible(false);
        }

        this._pImplementation.prepareFor(AEFunctionType.k_Vertex);
        this._pFunctionDefenition.markAsShaderDef(true);
        this.generatesVertexAttrubutes();
        this.generateVertexVaryings();
    }

    _prepareForPixel(): void {
        this.setFunctionType(AEFunctionType.k_Pixel);

        var pShaderInputParamList: AIAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
        for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
            var pParamType: AIAFXVariableTypeInstruction = pShaderInputParamList[i].getType();

            if (pParamType.isComplex() &&
                isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) &&
                this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {

                    this.setError(AEEffectTempErrors.BAD_LOCAL_OF_SHADER_INPUT, { funcName: this.getName() });
                return;
            }
        }

        if (this._pFunctionDefenition.isComplexShaderInput()) {
            pShaderInputParamList[0].setVisible(false);
        }

        this._pImplementation.prepareFor(AEFunctionType.k_Pixel);
        this._pFunctionDefenition.markAsShaderDef(true);

        this.generatePixelVaryings();
    }

    _setOutVariable(pVar: AIAFXVariableDeclInstruction): void {
        this._pOutVariable = pVar;
    }

    _setUsedFunctions(pUsedFunctionMap: AIAFXFunctionDeclMap,
        pUsedFunctionList: AIAFXFunctionDeclInstruction[]): void {
        this._pUsedFunctionMap = pUsedFunctionMap;
        this._pUsedFunctionList = pUsedFunctionList;
    }

    _setUsedVariableData(pUsedVarTypeMap: AIAFXTypeUseInfoMap,
        pSharedVariableMap: AIAFXVariableDeclMap,
        pGlobalVariableMap: AIAFXVariableDeclMap,
        pUniformVariableMap: AIAFXVariableDeclMap,
        pForeignVariableMap: AIAFXVariableDeclMap,
        pTextureVariableMap: AIAFXVariableDeclMap,
        pUsedComplexTypeMap: AIAFXTypeMap): void {
        this._pUsedVarTypeMap = pUsedVarTypeMap;
        this._pSharedVariableMap = pSharedVariableMap;
        this._pGlobalVariableMap = pGlobalVariableMap;
        this._pUniformVariableMap = pUniformVariableMap;
        this._pForeignVariableMap = pForeignVariableMap;
        this._pTextureVariableMap = pTextureVariableMap;
        this._pUsedComplexTypeMap = pUsedComplexTypeMap;
    }

    _initAfterClone(): void {
        this._pFunctionDefenition = <FunctionDefInstruction>this._pInstructionList[0];
        this._pImplementation = <StmtBlockInstruction>this._pInstructionList[1];
    }

    _generateInfoAboutUsedData(): void {
        if (!isNull(this._pUsedVarTypeMap)) {
            return;
        }

        var pUsedData: AIAFXTypeUseInfoMap = <AIAFXTypeUseInfoMap>{};
        this._pImplementation.addUsedData(pUsedData);

        this._pUsedVarTypeMap = pUsedData;

        if (isNull(this._pUsedComplexTypeMap)) {
            this._pSharedVariableMap = <AIAFXVariableDeclMap>{};
            this._pGlobalVariableMap = <AIAFXVariableDeclMap>{};
            this._pUniformVariableMap = <AIAFXVariableDeclMap>{};
            this._pForeignVariableMap = <AIAFXVariableDeclMap>{};
            this._pTextureVariableMap = <AIAFXVariableDeclMap>{};
            this._pUsedComplexTypeMap = <AIAFXTypeMap>{};
        }

        //this.addUsedComplexType(this.getReturnType().getBaseType());

        for (var i in pUsedData) {
            var pAnalyzedInfo: AIAFXTypeUseInfoContainer = pUsedData[i];
            var pAnalyzedType: AIAFXVariableTypeInstruction = pAnalyzedInfo.type;

            if (pAnalyzedType._isInGlobalScope()) {
                this.addGlobalVariableType(pAnalyzedType, pAnalyzedInfo.isWrite, pAnalyzedInfo.isRead);
            }
            else if (pAnalyzedType.isUniform()) {
                this.addUniformParameter(pAnalyzedType);
            }
            else if (pAnalyzedType._getScope() < this._getImplementationScope()) {
                if (!this._isUsedAsFunction()) {
                    if (!isNull(this._getOutVariable()) &&
                        this._getOutVariable().getType() !== pAnalyzedType) {

                        this.addUsedComplexType(pAnalyzedType.getBaseType());
                    }
                }
            }
        }
        if (!isNull(this._pUsedFunctionList)) {
            for (var j: uint = 0; j < this._pUsedFunctionList.length; j++) {
                this.addUsedInfoFromFunction(this._pUsedFunctionList[j]);
            }
        }
    }

    _getAttributeVariableMap(): AIAFXVariableDeclMap {
        return this._pAttributeVariableMap;
    }

    _getVaryingVariableMap(): AIAFXVariableDeclMap {
        return this._pVaryingVariableMap;
    }

    _getSharedVariableMap(): AIAFXVariableDeclMap {
        return this._pSharedVariableMap;
    }

    _getGlobalVariableMap(): AIAFXVariableDeclMap {
        return this._pGlobalVariableMap;
    }

    _getUniformVariableMap(): AIAFXVariableDeclMap {
        return this._pUniformVariableMap;
    }

    _getForeignVariableMap(): AIAFXVariableDeclMap {
        return this._pForeignVariableMap;
    }

    _getTextureVariableMap(): AIAFXVariableDeclMap {
        return this._pTextureVariableMap;
    }

    _getUsedComplexTypeMap(): AIAFXTypeMap {
        return this._pUsedComplexTypeMap;
    }

    _getAttributeVariableKeys(): uint[] {
        if (isNull(this._pAttributeVariableKeys) && !isNull(this._pAttributeVariableMap)) {
            this._pAttributeVariableKeys = <uint[]><any>Object.keys(this._pAttributeVariableMap);
        }

        return this._pAttributeVariableKeys;
    }

    _getVaryingVariableKeys(): uint[] {
        if (isNull(this._pVaryingVariableKeys) && !isNull(this._pVaryingVariableMap)) {
            this._pVaryingVariableKeys = <uint[]><any>Object.keys(this._pVaryingVariableMap);
        }

        return this._pVaryingVariableKeys;
    }


    _getSharedVariableKeys(): uint[] {
        if (isNull(this._pSharedVariableKeys) && !isNull(this._pSharedVariableMap)) {
            this._pSharedVariableKeys = <uint[]><any[]>Object.keys(this._pSharedVariableMap);
        }

        return this._pSharedVariableKeys;
    }

    _getUniformVariableKeys(): uint[] {
        if (isNull(this._pUniformVariableKeys) && !isNull(this._pUniformVariableMap)) {
            this._pUniformVariableKeys = <uint[]><any[]>Object.keys(this._pUniformVariableMap);
        }

        return this._pUniformVariableKeys;
    }

    _getForeignVariableKeys(): uint[] {
        if (isNull(this._pForeignVariableKeys) && !isNull(this._pForeignVariableMap)) {
            this._pForeignVariableKeys = <uint[]><any[]>Object.keys(this._pForeignVariableMap);
        }

        return this._pForeignVariableKeys;
    }

    _getGlobalVariableKeys(): uint[] {
        if (isNull(this._pGlobalVariableKeys) && !isNull(this._pGlobalVariableMap)) {
            this._pGlobalVariableKeys = <uint[]><any[]>Object.keys(this._pGlobalVariableMap);
        }

        return this._pGlobalVariableKeys;
    }

    _getTextureVariableKeys(): uint[] {
        if (isNull(this._pTextureVariableKeys) && !isNull(this._pTextureVariableMap)) {
            this._pTextureVariableKeys = <uint[]><any[]>Object.keys(this._pTextureVariableMap);
        }

        return this._pTextureVariableKeys;
    }

    _getUsedComplexTypeKeys(): uint[] {
        if (isNull(this._pUsedComplexTypeKeys)) {
            this._pUsedComplexTypeKeys = <uint[]><any[]>Object.keys(this._pUsedComplexTypeMap);
        }

        return this._pUsedComplexTypeKeys;
    }

    _getExtSystemFunctionList(): AIAFXFunctionDeclInstruction[] {
        return this._pExtSystemFunctionList;
    }

    _getExtSystemMacrosList(): AIAFXSimpleInstruction[] {
        return this._pExtSystemMacrosList;
    }

    _getExtSystemTypeList(): AIAFXTypeDeclInstruction[] {
        return this._pExtSystemTypeList;
    }

    private generatesVertexAttrubutes(): void {
        var pShaderInputParamList: AIAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
        var isComplexInput: boolean = this._pFunctionDefenition.isComplexShaderInput();

        this._pAttributeVariableMap = <AIAFXVariableDeclMap>{};

        if (isComplexInput) {
            var pContainerVariable: AIAFXVariableDeclInstruction = pShaderInputParamList[0];
            var pContainerType: AIAFXVariableTypeInstruction = pContainerVariable.getType();

            var pAttributeNames: string[] = pContainerType.getFieldNameList();

            for (var i: uint = 0; i < pAttributeNames.length; i++) {
                var pAttr: AIAFXVariableDeclInstruction = pContainerType.getField(pAttributeNames[i]);

                if (!this.isVariableTypeUse(pAttr.getType())) {
                    continue;
                }

                this._pAttributeVariableMap[pAttr._getInstructionID()] = pAttr;
                this.generateExtractBlockForAttribute(pAttr);
            }
        }
        else {
            for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
                var pAttr: AIAFXVariableDeclInstruction = pShaderInputParamList[i];

                if (!this.isVariableTypeUse(pAttr.getType())) {
                    continue;
                }

                this._pAttributeVariableMap[pAttr._getInstructionID()] = pAttr;
                this.generateExtractBlockForAttribute(pAttr);
            }
        }

        this._pAttributeVariableKeys = this._getAttributeVariableKeys();
    }

    private generateVertexVaryings(): void {
        if (isNull(this._getOutVariable())) {
            return;
        }

        this._pVaryingVariableMap = <AIAFXVariableDeclMap>{};

        var pContainerVariable: AIAFXVariableDeclInstruction = this._getOutVariable();
        var pContainerType: AIAFXVariableTypeInstruction = pContainerVariable.getType();


        var pVaryingNames: string[] = pContainerType.getFieldNameList();

        for (var i: uint = 0; i < pVaryingNames.length; i++) {
            var pVarying: AIAFXVariableDeclInstruction = pContainerType.getField(pVaryingNames[i]);

            if (!this.isVariableTypeUse(pVarying.getType())) {
                continue;
            }

            this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
        }

        this._pVaryingVariableKeys = this._getVaryingVariableKeys();
    }

    private generatePixelVaryings(): void {
        var pShaderInputParamList: AIAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
        var isComplexInput: boolean = this._pFunctionDefenition.isComplexShaderInput();

        this._pVaryingVariableMap = <AIAFXVariableDeclMap>{};

        if (isComplexInput) {
            var pContainerVariable: AIAFXVariableDeclInstruction = pShaderInputParamList[0];
            var pContainerType: AIAFXVariableTypeInstruction = pContainerVariable.getType();

            var pVaryingNames: string[] = pContainerType.getFieldNameList();

            for (var i: uint = 0; i < pVaryingNames.length; i++) {
                var pVarying: AIAFXVariableDeclInstruction = pContainerType.getField(pVaryingNames[i]);

                if (!this.isVariableTypeUse(pVarying.getType())) {
                    continue;
                }

                this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
            }
        }
        else {
            for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
                var pVarying: AIAFXVariableDeclInstruction = pShaderInputParamList[i];

                if (!this.isVariableTypeUse(pVarying.getType())) {
                    continue;
                }

                this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
            }
        }

        this._pVaryingVariableKeys = this._getVaryingVariableKeys();
    }

    private cloneVarTypeUsedMap(pMap: AIAFXTypeUseInfoMap, pRelationMap: AIAFXInstructionMap): AIAFXTypeUseInfoMap {
        var pCloneMap: AIAFXTypeUseInfoMap = <AIAFXTypeUseInfoMap>{};

        for (var j in pMap) {
            var pType: AIAFXVariableTypeInstruction = <AIAFXVariableTypeInstruction>(isDef(pRelationMap[j]) ? pRelationMap[j] : pMap[j].type);
            var id: uint = pType._getInstructionID();
            pCloneMap[id] = {
                type: pType,
                isRead: pMap[j].isRead,
                isWrite: pMap[j].isWrite,
                numRead: pMap[j].numRead,
                numWrite: pMap[j].numWrite,
                numUsed: pMap[j].numUsed
            }
			}

        return pCloneMap;
    }

    private cloneVarDeclMap(pMap: AIAFXVariableDeclMap, pRelationMap: AIAFXInstructionMap): AIAFXVariableDeclMap {
        var pCloneMap: AIAFXVariableDeclMap = <AIAFXVariableDeclMap>{};

        for (var i in pMap) {
            var pVar: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>(isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);

            if (!isNull(pVar)) {
                var id: uint = pVar._getInstructionID();
                pCloneMap[id] = pVar;
            }
        }

        return pCloneMap;
    }

    private cloneTypeMap(pMap: AIAFXTypeMap, pRelationMap: AIAFXInstructionMap): AIAFXTypeMap {
        var pCloneMap: AIAFXTypeMap = <AIAFXTypeMap>{};

        for (var i in pMap) {
            var pVar: AIAFXTypeInstruction = <AIAFXTypeInstruction>(isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);
            var id: uint = pVar._getInstructionID();
            pCloneMap[id] = pVar;
        }

        return pCloneMap;
    }

    private addGlobalVariableType(pVariableType: AIAFXVariableTypeInstruction,
        isWrite: boolean, isRead: boolean): void {
        if (!pVariableType.isFromVariableDecl()) {
            return;
        }

        var pVariable: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>pVariableType._getParentVarDecl();
        var pMainVariable: AIAFXVariableDeclInstruction = pVariableType._getMainVariable();
        var iMainVar: uint = pMainVariable._getInstructionID();
        var iVar: uint = pVariable._getInstructionID();

        if (pMainVariable.getType().isShared()) {
            // this._pSharedVariableMap[iVar] = pVariable;
            this._pSharedVariableMap[iMainVar] = pMainVariable;
        }
        else if (pMainVariable.getType().isForeign()) {
            this._pForeignVariableMap[iMainVar] = pMainVariable;
        }
        else if (isWrite || pMainVariable.getType().isConst()) {
            this._pGlobalVariableMap[iMainVar] = pMainVariable;
            if (isDefAndNotNull(this._pUniformVariableMap[iMainVar])) {
                this._pUniformVariableMap[iMainVar] = null;
            }
        }
        else {
            if (!isDef(this._pGlobalVariableMap[iMainVar])) {
                this._pUniformVariableMap[iMainVar] = pMainVariable;

                if (!pMainVariable.getType().isComplex() && pMainVariable.hasConstantInitializer()) {
                    pMainVariable.prepareDefaultValue();
                }
            }
        }

        if (pVariable.isSampler() && pVariable.hasInitializer()) {
            var pInitExpr: AIAFXInitExprInstruction = pVariable.getInitializeExpr();
            var pTexture: AIAFXVariableDeclInstruction = null;
            var pSamplerStates: SamplerStateBlockInstruction = null;

            if (pVariableType.isArray()) {
                var pList: AIAFXInitExprInstruction[] = <AIAFXInitExprInstruction[]>pInitExpr.getInstructions();
                for (var i: uint = 0; i < pList.length; i++) {
                    pSamplerStates = <SamplerStateBlockInstruction>pList[i].getInstructions()[0];
                    pTexture = pSamplerStates.getTexture();

                    if (!isNull(pTexture)) {
                        this._pTextureVariableMap[pTexture._getInstructionID()] = pTexture;
                    }
                }
            }
            else {
                pSamplerStates = <SamplerStateBlockInstruction>pInitExpr.getInstructions()[0];
                pTexture = pSamplerStates.getTexture();

                if (!isNull(pTexture)) {
                    this._pTextureVariableMap[pTexture._getInstructionID()] = pTexture;
                }
            }
        }

        // this.addUsedComplexType(pMainVariable.getType().getBaseType());
    }

    private addUniformParameter(pType: AIAFXVariableTypeInstruction): void {
        var pMainVariable: AIAFXVariableDeclInstruction = pType._getMainVariable();
        var iMainVar: uint = pMainVariable._getInstructionID();

        if (isDef(this._pGlobalVariableMap[iMainVar])) {
            debug.error("UNEXPECTED ERROR WITH UNIFORM_PARAMETER");
        }

        this._pUniformVariableMap[iMainVar] = pMainVariable;
        this.addUsedComplexType(pMainVariable.getType().getBaseType());

        if (!pMainVariable.getType().isComplex() && pMainVariable.hasConstantInitializer()) {
            pMainVariable.prepareDefaultValue();
        }
    }

    private addUsedComplexType(pType: AIAFXTypeInstruction): void {
        if (pType.isBase() || isDef(this._pUsedComplexTypeMap[pType._getInstructionID()])) {
            return;
        }

        this._pUsedComplexTypeMap[pType._getInstructionID()] = pType;

        var pFieldNameList: string[] = pType.getFieldNameList();

        for (var i: uint = 0; i < pFieldNameList.length; i++) {
            this.addUsedComplexType(pType.getFieldType(pFieldNameList[i]).getBaseType());
        }
    }

    private addUsedInfoFromFunction(pFunction: AIAFXFunctionDeclInstruction): void {
        pFunction._generateInfoAboutUsedData();

        var pSharedVarMap: AIAFXVariableDeclMap = pFunction._getSharedVariableMap();
        var pGlobalVarMap: AIAFXVariableDeclMap = pFunction._getGlobalVariableMap();
        var pUniformVarMap: AIAFXVariableDeclMap = pFunction._getUniformVariableMap();
        var pForeignVarMap: AIAFXVariableDeclMap = pFunction._getForeignVariableMap();
        var pTextureVarMap: AIAFXVariableDeclMap = pFunction._getTextureVariableMap();
        var pUsedComplexTypeMap: AIAFXTypeMap = pFunction._getUsedComplexTypeMap();

        for (var j in pSharedVarMap) {
            this._pSharedVariableMap[pSharedVarMap[j]._getInstructionID()] = pSharedVarMap[j];
        }

        for (var j in pForeignVarMap) {
            this._pForeignVariableMap[pForeignVarMap[j]._getInstructionID()] = pForeignVarMap[j];
        }

        for (var j in pTextureVarMap) {
            this._pTextureVariableMap[pTextureVarMap[j]._getInstructionID()] = pTextureVarMap[j];
        }

        for (var j in pGlobalVarMap) {
            this._pGlobalVariableMap[pGlobalVarMap[j]._getInstructionID()] = pGlobalVarMap[j];

            if (isDefAndNotNull(this._pUniformVariableMap[pGlobalVarMap[j]._getInstructionID()])) {
                this._pUniformVariableMap[pGlobalVarMap[j]._getInstructionID()] = null;
            }
        }

        for (var j in pUniformVarMap) {
            if (!isDef(this._pGlobalVariableMap[pUniformVarMap[j]._getInstructionID()])) {
                this._pUniformVariableMap[pUniformVarMap[j]._getInstructionID()] = pUniformVarMap[j];
            }
        }

        for (var j in pUsedComplexTypeMap) {
            this._pUsedComplexTypeMap[pUsedComplexTypeMap[j]._getInstructionID()] = pUsedComplexTypeMap[j];
        }

        this.addExtSystemFunction(pFunction);
    }

    private addExtSystemFunction(pFunction: AIAFXFunctionDeclInstruction): void {
        if (isNull(this._pExtSystemFunctionList)) {
            this._pExtSystemFunctionList = [];
            this._pExtSystemTypeList = [];
            this._pExtSystemMacrosList = [];
        }

        if (pFunction._getInstructionType() === AEAFXInstructionTypes.k_SystemFunctionInstruction) {
            if (this._pExtSystemFunctionList.indexOf(pFunction) !== -1) {
                return;
            }

            this._pExtSystemFunctionList.push(pFunction);
        }

        var pTypes = pFunction._getExtSystemTypeList();
        var pMacroses = pFunction._getExtSystemMacrosList();
        var pFunctions = pFunction._getExtSystemFunctionList();

        if (!isNull(pTypes)) {
            for (var j: uint = 0; j < pTypes.length; j++) {
                if (this._pExtSystemTypeList.indexOf(pTypes[j]) === -1) {
                    this._pExtSystemTypeList.push(pTypes[j]);
                }
            }
        }

        if (!isNull(pMacroses)) {
            for (var j: uint = 0; j < pMacroses.length; j++) {
                if (this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1) {
                    this._pExtSystemMacrosList.push(pMacroses[j]);
                }
            }
        }

        if (!isNull(pFunctions)) {
            for (var j: uint = 0; j < pFunctions.length; j++) {
                if (this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1) {
                    this._pExtSystemFunctionList.unshift(pFunctions[j]);
                }
            }
        }
    }

    private isVariableTypeUse(pVariableType: AIAFXVariableTypeInstruction): boolean {
        var id: uint = pVariableType._getInstructionID();

        if (!isDef(this._pUsedVarTypeMap[id])) {
            return false;
        }

        if (this._pUsedVarTypeMap[id].numUsed === 0) {
            return false;
        }

        return true;
    }

    private generateExtractBlockForAttribute(pAttr: AIAFXVariableDeclInstruction): AIAFXInstruction {
        if (!pAttr.getType().isPointer()) {
            return null;
        }

        var pExtractCollector: AIAFXInstruction = new InstructionCollector();
        var pMainPointer: AIAFXVariableDeclInstruction = pAttr.getType()._getMainPointer();

        pAttr._setAttrExtractionBlock(pExtractCollector);

        this.generateExtractStmtFromPointer(pMainPointer, null, 0, pExtractCollector);

        pAttr.getType().getSubVarDecls();

        return pExtractCollector;

    }

    private generateExtractStmtFromPointer(pPointer: AIAFXVariableDeclInstruction,
        pOffset: AIAFXVariableDeclInstruction,
        iDepth: uint,
        pCollector: AIAFXInstruction): void {
        var pPointerType: AIAFXVariableTypeInstruction = pPointer.getType();
        var pWhatExtracted: AIAFXVariableDeclInstruction = pPointerType._getDownPointer();
        var pWhatExtractedType: AIAFXVariableTypeInstruction = null;

        while (!isNull(pWhatExtracted)) {
            pWhatExtractedType = pWhatExtracted.getType();

            if (!pWhatExtractedType.isPointIndex() && iDepth === 0) {
                pOffset = this.createOffsetForAttr(pWhatExtracted);
            }

            if (!pWhatExtractedType.isComplex()) {
                var pSingleExtract: ExtractStmtInstruction = new ExtractStmtInstruction();
                pSingleExtract.generateStmtForBaseType(
                    pWhatExtracted,
                    pWhatExtractedType.getPointer(),
                    pWhatExtractedType.getVideoBuffer(), 0,
                    pWhatExtractedType.isPointIndex() ? null : pOffset);

                this._addUsedFunction(pSingleExtract.getExtractFunction());
                pCollector.push(pSingleExtract, true);
            }
            else {
                iDepth++;
                this.generateExtractStmtForComplexVar(
                    pWhatExtracted,
                    iDepth <= 1 ? pOffset : null,
                    iDepth, pCollector,
                    pWhatExtractedType.getPointer(),
                    pWhatExtractedType.getVideoBuffer(), 0);
            }

            pWhatExtracted = pWhatExtractedType._getDownPointer();
        }
    }

    private generateExtractStmtForComplexVar(pVarDecl: AIAFXVariableDeclInstruction,
        pOffset: AIAFXVariableDeclInstruction,
        iDepth: uint,
        pCollector: AIAFXInstruction,
        pPointer: AIAFXVariableDeclInstruction,
        pBuffer: AIAFXVariableDeclInstruction,
        iPadding: uint): void {

        var pVarType: AIAFXVariableTypeInstruction = pVarDecl.getType();
        var pFieldNameList: string[] = pVarType.getFieldNameList();
        var pField: AIAFXVariableDeclInstruction = null;
        var pFieldType: AIAFXVariableTypeInstruction = null;
        var pSingleExtract: ExtractStmtInstruction = null;
        var isNeedPadding: boolean = false;

        for (var i: uint = 0; i < pFieldNameList.length; i++) {
            pField = pVarType.getField(pFieldNameList[i]);

            if (isNull(pField)) {
                continue;
            }

            pFieldType = pField.getType();

            if (iDepth <= 1) {
                pOffset = this.createOffsetForAttr(pField);
                isNeedPadding = false;
            }
            else {
                isNeedPadding = true;
            }

            if (pFieldType.isPointer()) {
                var pFieldPointer: AIAFXVariableDeclInstruction = pFieldType._getMainPointer();
                pSingleExtract = new ExtractStmtInstruction();
                pSingleExtract.generateStmtForBaseType(pFieldPointer, pPointer, pFieldType.getVideoBuffer(),
                    isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0,
                    pOffset);

                this._addUsedFunction(pSingleExtract.getExtractFunction());

                pCollector.push(pSingleExtract, true);
                this.generateExtractStmtFromPointer(pFieldPointer, pOffset, iDepth, pCollector);
            }
            else if (pFieldType.isComplex()) {
                iDepth++;
                this.generateExtractStmtForComplexVar(pField, pOffset, iDepth, pCollector,
                    pPointer, pBuffer,
                    isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0);
            }
            else {
                pSingleExtract = new ExtractStmtInstruction();
                pSingleExtract.generateStmtForBaseType(pField, pPointer, pBuffer,
                    isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0,
                    pOffset);

                this._addUsedFunction(pSingleExtract.getExtractFunction());

                pCollector.push(pSingleExtract, true);
            }
        }
    }

    private createOffsetForAttr(pAttr: AIAFXVariableDeclInstruction): AIAFXVariableDeclInstruction {
        var pOffset: AIAFXVariableDeclInstruction = new VariableDeclInstruction();
        var pOffsetType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
        var pOffsetId: AIAFXIdInstruction = new IdInstruction();

        pOffsetType.pushType(Effect.getSystemType("float"));
        pOffsetType.addUsage("uniform");

        pOffsetId.setName("offset");
        pOffsetId.setRealName(pAttr.getRealName() + "_o");

        pOffset.push(pOffsetType, true);
        pOffset.push(pOffsetId, true);

        pOffset.setParent(pAttr);
        pOffset.setSemantic(pAttr.getSemantic());

        pAttr.getType()._addAttrOffset(pOffset);

        return pOffset;
    }


}


export = FunctionDeclInstruction;