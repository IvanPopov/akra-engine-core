/// <reference path="../idl/AIAFXInstruction.ts" />

import DeclInstruction = require("fx/DeclInstruction");
import VariableTypeInstruction = require("fx/VariableTypeInstruction");
import ExprTemplateTranslator = require("fx/ExprTemplateTranslator");
import IdInstruction = require("fx/IdInstruction");
import TypedInstruction = require("fx/TypedInstruction");

class SystemFunctionInstruction extends DeclInstruction implements AIAFXFunctionDeclInstruction {
    private _pExprTranslator: ExprTemplateTranslator = null;
    private _pName: AIAFXIdInstruction = null;
    private _pReturnType: VariableTypeInstruction = null;
    private _pArguments: AIAFXTypedInstruction[] = null;

    private _sDefinition: string = "";
    private _sImplementation: string = "";

    private _pExtSystemTypeList: AIAFXTypeDeclInstruction[] = null;
    private _pExtSystemFunctionList: AIAFXFunctionDeclInstruction[] = null;
    private _pExtSystemMacrosList: AIAFXSimpleInstruction[] = null;

    constructor(sName: string, pReturnType: AIAFXTypeInstruction,
        pExprTranslator: ExprTemplateTranslator,
        pArgumentTypes: AIAFXTypeInstruction[]) {
        super();

        this._eInstructionType = AEAFXInstructionTypes.k_SystemFunctionInstruction;

        this._pName = new IdInstruction();
        this._pName.setName(sName);
        this._pName.setParent(this);

        this._pReturnType = new VariableTypeInstruction();
        this._pReturnType.pushType(pReturnType);
        this._pReturnType.setParent(this);

        this._pArguments = [];

        if (!isNull(pArgumentTypes)) {
            for (var i: uint = 0; i < pArgumentTypes.length; i++) {
                var pArgument: TypedInstruction = new TypedInstruction();
                pArgument.setType(pArgumentTypes[i]);
                pArgument.setParent(this);

                this._pArguments.push(pArgument);
            }
        }

        this._pExprTranslator = pExprTranslator;
    }

    setDeclCode(sDefenition: string, sImplementation: string) {
        this._sDefinition = sDefenition;
        this._sImplementation = sImplementation;
    }

    /**
     * Generate code 
     */
    toFinalCode(): string {
        return this._sDefinition + this._sImplementation;
    }

    toFinalDefCode(): string {
        return this._sDefinition;
    }

    setUsedSystemData(pTypeList: AIAFXTypeDeclInstruction[],
        pFunctionList: AIAFXFunctionDeclInstruction[],
        pMacrosList: AIAFXSimpleInstruction[]): void {

        this._pExtSystemTypeList = pTypeList;
        this._pExtSystemFunctionList = pFunctionList;
        this._pExtSystemMacrosList = pMacrosList;
    }

    closeSystemDataInfo(): void {
        for (var i: uint = 0; i < this._pExtSystemFunctionList.length; i++) {
            var pFunction: AIAFXFunctionDeclInstruction = this._pExtSystemFunctionList[i];

            var pTypes = pFunction._getExtSystemTypeList();
            var pMacroses = pFunction._getExtSystemMacrosList();
            var pFunctions = pFunction._getExtSystemFunctionList();

            for (var j: uint = 0; j < pTypes.length; j++) {
                if (this._pExtSystemTypeList.indexOf(pTypes[j]) === -1) {
                    this._pExtSystemTypeList.push(pTypes[j]);
                }
            }

            for (var j: uint = 0; j < pMacroses.length; j++) {
                if (this._pExtSystemMacrosList.indexOf(pMacroses[j]) === -1) {
                    this._pExtSystemMacrosList.push(pMacroses[j]);
                }
            }

            for (var j: uint = 0; j < pFunctions.length; j++) {
                if (this._pExtSystemFunctionList.indexOf(pFunctions[j]) === -1) {
                    this._pExtSystemFunctionList.unshift(pFunctions[j]);
                }
            }
        }
    }

    setExprTranslator(pExprTranslator: ExprTemplateTranslator): void {
        this._pExprTranslator = pExprTranslator;
    }

    getNameId(): AIAFXIdInstruction {
        return this._pName;
    }

    getArguments(): AIAFXTypedInstruction[] {
        return this._pArguments;
    }

    getNumNeededArguments(): uint {
        return this._pArguments.length;
    }

    hasImplementation(): boolean {
        return true;
    }

    getType(): AIAFXVariableTypeInstruction {
        return this.getReturnType();
    }

    getReturnType(): AIAFXVariableTypeInstruction {
        return this._pReturnType;
    }

    getFunctionType(): AEFunctionType {
        return AEFunctionType.k_Function;
    }

    setFunctionType(eFunctionType: AEFunctionType): void {
    }

    closeArguments(pArguments: AIAFXInstruction[]): AIAFXInstruction[] {
        return this._pExprTranslator.toInstructionList(pArguments);
    }

    setFunctionDef(pFunctionDef: AIAFXDeclInstruction): void {
    }

    setImplementation(pImplementation: AIAFXStmtInstruction): void {
    }

    clone(pRelationMap?: AIAFXInstructionMap): SystemFunctionInstruction {
        return this;
    }

    _addOutVariable(pVariable: AIAFXVariableDeclInstruction): boolean {
        return false;
    }

    _getOutVariable(): AIAFXVariableDeclInstruction {
        return null;
    }

    _getVertexShader(): AIAFXFunctionDeclInstruction {
        return null;
    }

    _getPixelShader(): AIAFXFunctionDeclInstruction {
        return null;
    }

    _markUsedAs(eUsedType: AEFunctionType): void {
    }

    _isUsedAs(eUsedType: AEFunctionType): boolean {
        return true;
    }

    _isUsedAsFunction(): boolean {
        return true;
    }

    _isUsedAsVertex(): boolean {
        return true;
    }

    _isUsedAsPixel(): boolean {
        return true;
    }

    _markUsedInVertex(): void {
    }

    _markUsedInPixel(): void {
    }

    _isUsedInVertex(): boolean {
        return null;
    }

    _isUsedInPixel(): boolean {
        return null;
    }

    _isUsed(): boolean {
        return null;
    }

    _checkVertexUsage(): boolean {
        return this._isForVertex();
    }

    _checkPixelUsage(): boolean {
        return this._isForPixel();
    }

    _checkDefenitionForVertexUsage(): boolean {
        return false;
    }

    _checkDefenitionForPixelUsage(): boolean {
        return false;
    }

    _canUsedAsFunction(): boolean {
        return true;
    }

    _notCanUsedAsFunction(): void { }

    _addUsedFunction(pFunction: AIAFXFunctionDeclInstruction): boolean {
        return false;
    }

    _addUsedVariable(pVariable: AIAFXVariableDeclInstruction): void {

    }

    _getUsedFunctionList(): AIAFXFunctionDeclInstruction[] {
        return null;
    }

    _isBlackListFunction(): boolean {
        return false;
    }

    _addToBlackList(): void {
    }

    _getStringDef(): string {
        return "system_func";
    }

    _convertToVertexShader(): AIAFXFunctionDeclInstruction {
        return null;
    }

    _convertToPixelShader(): AIAFXFunctionDeclInstruction {
        return null;
    }

    _prepareForVertex(): void { }
    _prepareForPixel(): void { }

    addUsedVariableType(pType: AIAFXVariableTypeInstruction, eUsedMode: AEVarUsedMode): boolean {
        return false;
    }

    _generateInfoAboutUsedData(): void {

    }

    _getAttributeVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getVaryingVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getSharedVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getGlobalVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getUniformVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getForeignVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getTextureVariableMap(): AIAFXVariableDeclMap {
        return null;
    }

    _getUsedComplexTypeMap(): AIAFXTypeMap {
        return null;
    }

    _getAttributeVariableKeys(): uint[] {
        return null;
    }

    _getVaryingVariableKeys(): uint[] {
        return null;
    }

    _getSharedVariableKeys(): uint[] {
        return null;
    }

    _getUniformVariableKeys(): uint[] {
        return null;
    }

    _getForeignVariableKeys(): uint[] {
        return null;
    }

    _getGlobalVariableKeys(): uint[] {
        return null;
    }

    _getTextureVariableKeys(): uint[] {
        return null;
    }

    _getUsedComplexTypeKeys(): uint[] {
        return null;
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

}

export = SystemFunctionInstruction;