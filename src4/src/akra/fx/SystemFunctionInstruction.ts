/// <reference path="../idl/IAFXInstruction.ts" />

/// <reference path="DeclInstruction.ts" />
/// <reference path="VariableTypeInstruction.ts" />
/// <reference path="ExprTemplateTranslator.ts" />
/// <reference path="IdInstruction.ts" />
/// <reference path="TypedInstruction.ts" />

module akra.fx {

    export class SystemFunctionInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
        private _pExprTranslator: ExprTemplateTranslator = null;
        private _pName: IAFXIdInstruction = null;
        private _pReturnType: VariableTypeInstruction = null;
        private _pArguments: IAFXTypedInstruction[] = null;

        private _sDefinition: string = "";
        private _sImplementation: string = "";

        private _pExtSystemTypeList: IAFXTypeDeclInstruction[] = null;
        private _pExtSystemFunctionList: IAFXFunctionDeclInstruction[] = null;
        private _pExtSystemMacrosList: IAFXSimpleInstruction[] = null;

        constructor(sName: string, pReturnType: IAFXTypeInstruction,
            pExprTranslator: ExprTemplateTranslator,
            pArgumentTypes: IAFXTypeInstruction[]) {
            super();

            this._eInstructionType = EAFXInstructionTypes.k_SystemFunctionInstruction;

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

        setUsedSystemData(pTypeList: IAFXTypeDeclInstruction[],
            pFunctionList: IAFXFunctionDeclInstruction[],
            pMacrosList: IAFXSimpleInstruction[]): void {

            this._pExtSystemTypeList = pTypeList;
            this._pExtSystemFunctionList = pFunctionList;
            this._pExtSystemMacrosList = pMacrosList;
        }

        closeSystemDataInfo(): void {
            for (var i: uint = 0; i < this._pExtSystemFunctionList.length; i++) {
                var pFunction: IAFXFunctionDeclInstruction = this._pExtSystemFunctionList[i];

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

        getNameId(): IAFXIdInstruction {
            return this._pName;
        }

        getArguments(): IAFXTypedInstruction[] {
            return this._pArguments;
        }

        getNumNeededArguments(): uint {
            return this._pArguments.length;
        }

        hasImplementation(): boolean {
            return true;
        }

        getType(): IAFXVariableTypeInstruction {
            return this.getReturnType();
        }

        getReturnType(): IAFXVariableTypeInstruction {
            return this._pReturnType;
        }

        getFunctionType(): EFunctionType {
            return EFunctionType.k_Function;
        }

        setFunctionType(eFunctionType: EFunctionType): void {
        }

        closeArguments(pArguments: IAFXInstruction[]): IAFXInstruction[] {
            return this._pExprTranslator.toInstructionList(pArguments);
        }

        setFunctionDef(pFunctionDef: IAFXDeclInstruction): void {
        }

        setImplementation(pImplementation: IAFXStmtInstruction): void {
        }

        clone(pRelationMap?: IAFXInstructionMap): SystemFunctionInstruction {
            return this;
        }

        _addOutVariable(pVariable: IAFXVariableDeclInstruction): boolean {
            return false;
        }

        _getOutVariable(): IAFXVariableDeclInstruction {
            return null;
        }

        _getVertexShader(): IAFXFunctionDeclInstruction {
            return null;
        }

        _getPixelShader(): IAFXFunctionDeclInstruction {
            return null;
        }

        _markUsedAs(eUsedType: EFunctionType): void {
        }

        _isUsedAs(eUsedType: EFunctionType): boolean {
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

        _addUsedFunction(pFunction: IAFXFunctionDeclInstruction): boolean {
            return false;
        }

        _addUsedVariable(pVariable: IAFXVariableDeclInstruction): void {

        }

        _getUsedFunctionList(): IAFXFunctionDeclInstruction[] {
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

        _convertToVertexShader(): IAFXFunctionDeclInstruction {
            return null;
        }

        _convertToPixelShader(): IAFXFunctionDeclInstruction {
            return null;
        }

        _prepareForVertex(): void { }
        _prepareForPixel(): void { }

        addUsedVariableType(pType: IAFXVariableTypeInstruction, eUsedMode: EVarUsedMode): boolean {
            return false;
        }

        _generateInfoAboutUsedData(): void {

        }

        _getAttributeVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getVaryingVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getSharedVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getGlobalVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getUniformVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getForeignVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getTextureVariableMap(): IAFXVariableDeclMap {
            return null;
        }

        _getUsedComplexTypeMap(): IAFXTypeMap {
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

        _getExtSystemFunctionList(): IAFXFunctionDeclInstruction[] {
            return this._pExtSystemFunctionList;
        }

        _getExtSystemMacrosList(): IAFXSimpleInstruction[] {
            return this._pExtSystemMacrosList;
        }

        _getExtSystemTypeList(): IAFXTypeDeclInstruction[] {
            return this._pExtSystemTypeList;
        }

    }
}

