/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="../../idl/parser/IParser.ts" />
/// <reference path="../../idl/EEffectErrors.ts" />

/// <reference path="../../debug.ts" />

/// <reference path="DeclInstruction.ts" />
/// <reference path="ExtractStmtInstruction.ts" />
/// <reference path="FunctionDefInstruction.ts" />
/// <reference path="IdInstruction.ts" />
/// <reference path="Instruction.ts" />
/// <reference path="InstructionCollector.ts" />
/// <reference path="SamplerStateBlockInstruction.ts" />
/// <reference path="StmtBlockInstruction.ts" />
/// <reference path="VariableTypeInstruction.ts" />
/// <reference path="VariableInstruction.ts" />

/// <reference path="../Effect.ts" />

module akra.fx.instructions {

	/**
	 * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
	 * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
	 */
	export class FunctionDeclInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
		protected _pFunctionDefenition: FunctionDefInstruction = null;
		protected _pImplementation: StmtBlockInstruction = null;
		protected _eFunctionType: EFunctionType = EFunctionType.k_Function;

		protected _bUsedAsFunction: boolean = false;
		protected _bUsedAsVertex: boolean = false;
		protected _bUsedAsPixel: boolean = false;
		protected _bCanUsedAsFunction: boolean = true;

		protected _bUsedInVertex: boolean = false;
		protected _bUsedInPixel: boolean = false;

		protected _pParseNode: parser.IParseNode = null;
		protected _iImplementationScope: uint = Instruction.UNDEFINE_SCOPE;

		protected _isInBlackList: boolean = false;

		protected _pOutVariable: IAFXVariableDeclInstruction = null;

		//Info about used data
		protected _pUsedFunctionMap: IAFXFunctionDeclMap = null;
		protected _pUsedFunctionList: IAFXFunctionDeclInstruction[] = null;

		protected _pAttributeVariableMap: IAFXVariableDeclMap = null;
		protected _pVaryingVariableMap: IAFXVariableDeclMap = null;

		protected _pUsedVarTypeMap: IAFXTypeUseInfoMap = null;

		protected _pSharedVariableMap: IAFXVariableDeclMap = null;
		protected _pGlobalVariableMap: IAFXVariableDeclMap = null;
		protected _pUniformVariableMap: IAFXVariableDeclMap = null;
		protected _pForeignVariableMap: IAFXVariableDeclMap = null;
		protected _pTextureVariableMap: IAFXVariableDeclMap = null;

		// protected _pSharedVariableTypeList: IAFXVariableTypeInstruction[] = null;
		// protected _pGlobalVariableTypeList: IAFXVariableTypeInstruction[] = null;
		// protected _pUniformVariableTypeList: IAFXVariableTypeInstruction[] = null;
		// protected _pForeignVariableTypeList: IAFXVariableTypeInstructionnt[] = null;

		protected _pUsedComplexTypeMap: IAFXTypeMap = null;

		protected _pAttributeVariableKeys: uint[] = null;
		protected _pVaryingVariableKeys: uint[] = null;

		protected _pSharedVariableKeys: uint[] = null;
		protected _pUniformVariableKeys: uint[] = null;
		protected _pForeignVariableKeys: uint[] = null;
		protected _pGlobalVariableKeys: uint[] = null;
		protected _pTextureVariableKeys: uint[] = null;
		protected _pUsedComplexTypeKeys: uint[] = null;

		protected _pVertexShader: IAFXFunctionDeclInstruction = null;
		protected _pPixelShader: IAFXFunctionDeclInstruction = null;

		private _pExtSystemTypeList: IAFXTypeDeclInstruction[] = null;
		private _pExtSystemFunctionList: IAFXFunctionDeclInstruction[] = null;
		private _pExtSystemMacrosList: IAFXSimpleInstruction[] = null;


		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDeclInstruction;
		}

		_toFinalCode(): string {
			var sCode = "";

			sCode += this._pFunctionDefenition._toFinalCode();
			sCode += this._pImplementation._toFinalCode();

			return sCode;
		}

		toFinalDefCode(): string {
			return this._pFunctionDefenition._toFinalCode();
		}

		getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this.getReturnType();
		}

		getName(): string {
			return this._pFunctionDefenition.getName();
		}

		getRealName(): string {
			return this._pFunctionDefenition.getRealName();
		}

		getNameId(): IAFXIdInstruction {
			return this._pFunctionDefenition.getNameId();
		}

		getArguments(): IAFXVariableDeclInstruction[] {
			return this._pFunctionDefenition.getArguments();
		}

		getNumNeededArguments(): uint {
			return this._pFunctionDefenition.getNumNeededArguments();
		}

		hasImplementation(): boolean {
			return !isNull(this._pImplementation) || !isNull(this._pParseNode);
		}

		getReturnType(): IAFXVariableTypeInstruction {
			return this._pFunctionDefenition.getReturnType();
		}

		getFunctionType(): EFunctionType {
			return this._eFunctionType;
		}

		setFunctionType(eFunctionType: EFunctionType): void {
			this._eFunctionType = eFunctionType;
		}

		_setImplementationScope(iScope: uint): void {
			this._iImplementationScope = iScope;
		}

		_getImplementationScope(): uint {
			return this._iImplementationScope;
		}

		_setParseNode(pNode: parser.IParseNode): void {
			this._pParseNode = pNode;
		}

		_getParseNode(): parser.IParseNode {
			return this._pParseNode;
		}

		setFunctionDef(pFunctionDef: IAFXDeclInstruction): void {
			this._pFunctionDefenition = <FunctionDefInstruction>pFunctionDef;
			this._pInstructionList[0] = pFunctionDef;
			pFunctionDef._setParent(this);
			this._nInstructions = this._nInstructions === 0 ? 1 : this._nInstructions;
		}

		setImplementation(pImplementation: IAFXStmtInstruction): void {
			this._pImplementation = <StmtBlockInstruction>pImplementation;
			this._pInstructionList[1] = pImplementation;
			pImplementation._setParent(pImplementation);
			this._nInstructions = 2;

			this._pParseNode = null;
		}

		_clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXFunctionDeclInstruction {
			var pClone: FunctionDeclInstruction = <FunctionDeclInstruction>super._clone(pRelationMap);

			if (!isNull(this._pOutVariable)) {
				pClone._setOutVariable(<IAFXVariableDeclInstruction>pRelationMap[this._pOutVariable._getInstructionID()]);
			}

			var pUsedVarTypeMap: IAFXTypeUseInfoMap = this.cloneVarTypeUsedMap(this._pUsedVarTypeMap, pRelationMap);
			var pSharedVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pSharedVariableMap, pRelationMap);
			var pGlobalVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pGlobalVariableMap, pRelationMap);
			var pUniformVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pUniformVariableMap, pRelationMap);
			var pForeignVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pForeignVariableMap, pRelationMap);
			var pTextureVariableMap: IAFXVariableDeclMap = this.cloneVarDeclMap(this._pTextureVariableMap, pRelationMap);
			var pUsedComplexTypeMap: IAFXTypeMap = this.cloneTypeMap(this._pUsedComplexTypeMap, pRelationMap);

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

		_addOutVariable(pVariable: IAFXVariableDeclInstruction): boolean {
			if (!isNull(this._pOutVariable)) {
				return false;
			}

			if (!pVariable.getType()._isEqual(this.getReturnType())) {
				return false;
			}

			this._pOutVariable = pVariable;
			return true;
		}

		_getOutVariable(): IAFXVariableDeclInstruction {
			return this._pOutVariable;
		}

		_getVertexShader(): IAFXFunctionDeclInstruction {
			return this._pVertexShader;
		}

		_getPixelShader(): IAFXFunctionDeclInstruction {
			return this._pPixelShader;
		}

		_markUsedAs(eUsedType: EFunctionType): void {
			switch (eUsedType) {
				case EFunctionType.k_Vertex:
					this._bUsedInVertex = true;
					this._bUsedAsVertex = true;
					break;
				case EFunctionType.k_Pixel:
					this._bUsedInPixel = true;
					this._bUsedAsPixel = true;
					break;
				case EFunctionType.k_Function:
					this._bUsedAsFunction = true;
					break;
			}
		}

		_isUsedAs(eUsedType: EFunctionType): boolean {
			switch (eUsedType) {
				case EFunctionType.k_Vertex:
					return this._bUsedAsVertex;
				case EFunctionType.k_Pixel:
					return this._bUsedAsPixel;
				case EFunctionType.k_Function:
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

		_addUsedFunction(pFunction: IAFXFunctionDeclInstruction): boolean {
			if (pFunction._getInstructionType() === EAFXInstructionTypes.k_SystemFunctionInstruction &&
				!pFunction.isBuiltIn()) {

				this.addExtSystemFunction(pFunction);
				return true;
			}

			if (isNull(this._pUsedFunctionMap)) {
				this._pUsedFunctionMap = <IAFXFunctionDeclMap>{};
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

		_addUsedVariable(pVariable: IAFXVariableDeclInstruction): void {

		}

		_getUsedFunctionList(): IAFXFunctionDeclInstruction[] {
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

		_convertToVertexShader(): IAFXFunctionDeclInstruction {
			var pShader: FunctionDeclInstruction = null;

			if ((!this._canUsedAsFunction() || !this._isUsedAsFunction()) &&
				(!this._isUsedInPixel())) {
				pShader = this;
			}
			else {
				pShader = <FunctionDeclInstruction>this._clone();
			}

			pShader._prepareForVertex();
			this._pVertexShader = pShader;

			return pShader;
		}

		_convertToPixelShader(): IAFXFunctionDeclInstruction {
			var pShader: FunctionDeclInstruction = null;

			if ((!this._canUsedAsFunction() || !this._isUsedAsFunction()) &&
				(!this._isUsedInVertex())) {
				pShader = this;
			}
			else {
				pShader = <FunctionDeclInstruction>this._clone();
			}

			pShader._prepareForPixel();
			this._pPixelShader = pShader;

			return pShader;
		}

		_prepareForVertex(): void {
			this.setFunctionType(EFunctionType.k_Vertex);

			var pShaderInputParamList: IAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
			for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
				var pParamType: IAFXVariableTypeInstruction = pShaderInputParamList[i].getType();

				if (pParamType._isComplex() &&
					isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) &&
					this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {

					this._setError(EEffectTempErrors.BAD_LOCAL_OF_SHADER_INPUT, { funcName: this.getName() });
					return;
				}
			}

			var pOutVariable: IAFXVariableDeclInstruction = this._getOutVariable();

			if (!isNull(pOutVariable)) {
				if (isDef(this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()]) &&
					this._pUsedVarTypeMap[pOutVariable.getType()._getInstructionID()].isRead) {

					this._setError(EEffectTempErrors.BAD_LOCAL_OF_SHADER_OUTPUT, { funcName: this.getName() });
					return;
				}

				pOutVariable._markAsShaderOutput(true);
			}

			if (this._pFunctionDefenition.isComplexShaderInput()) {
				pShaderInputParamList[0]._setVisible(false);
			}

			this._pImplementation._prepareFor(EFunctionType.k_Vertex);
			this._pFunctionDefenition.markAsShaderDef(true);
			this.generatesVertexAttrubutes();
			this.generateVertexVaryings();
		}

		_prepareForPixel(): void {
			this.setFunctionType(EFunctionType.k_Pixel);

			var pShaderInputParamList: IAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
			for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
				var pParamType: IAFXVariableTypeInstruction = pShaderInputParamList[i].getType();

				if (pParamType._isComplex() &&
					isDef(this._pUsedVarTypeMap[pParamType._getInstructionID()]) &&
					this._pUsedVarTypeMap[pParamType._getInstructionID()].isRead) {

					this._setError(EEffectTempErrors.BAD_LOCAL_OF_SHADER_INPUT, { funcName: this.getName() });
					return;
				}
			}

			if (this._pFunctionDefenition.isComplexShaderInput()) {
				pShaderInputParamList[0]._setVisible(false);
			}

			this._pImplementation._prepareFor(EFunctionType.k_Pixel);
			this._pFunctionDefenition.markAsShaderDef(true);

			this.generatePixelVaryings();
		}

		_setOutVariable(pVar: IAFXVariableDeclInstruction): void {
			this._pOutVariable = pVar;
		}

		_setUsedFunctions(pUsedFunctionMap: IAFXFunctionDeclMap,
			pUsedFunctionList: IAFXFunctionDeclInstruction[]): void {
			this._pUsedFunctionMap = pUsedFunctionMap;
			this._pUsedFunctionList = pUsedFunctionList;
		}

		_setUsedVariableData(pUsedVarTypeMap: IAFXTypeUseInfoMap,
			pSharedVariableMap: IAFXVariableDeclMap,
			pGlobalVariableMap: IAFXVariableDeclMap,
			pUniformVariableMap: IAFXVariableDeclMap,
			pForeignVariableMap: IAFXVariableDeclMap,
			pTextureVariableMap: IAFXVariableDeclMap,
			pUsedComplexTypeMap: IAFXTypeMap): void {
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

			var pUsedData: IAFXTypeUseInfoMap = <IAFXTypeUseInfoMap>{};
			this._pImplementation.addUsedData(pUsedData);

			this._pUsedVarTypeMap = pUsedData;

			if (isNull(this._pUsedComplexTypeMap)) {
				this._pSharedVariableMap = <IAFXVariableDeclMap>{};
				this._pGlobalVariableMap = <IAFXVariableDeclMap>{};
				this._pUniformVariableMap = <IAFXVariableDeclMap>{};
				this._pForeignVariableMap = <IAFXVariableDeclMap>{};
				this._pTextureVariableMap = <IAFXVariableDeclMap>{};
				this._pUsedComplexTypeMap = <IAFXTypeMap>{};
			}

			//this.addUsedComplexType(this.getReturnType()._getBaseType());

			for (var i in pUsedData) {
				var pAnalyzedInfo: IAFXTypeUseInfoContainer = pUsedData[i];
				var pAnalyzedType: IAFXVariableTypeInstruction = pAnalyzedInfo.type;

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

							this.addUsedComplexType(pAnalyzedType._getBaseType());
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

		_getAttributeVariableMap(): IAFXVariableDeclMap {
			return this._pAttributeVariableMap;
		}

		_getVaryingVariableMap(): IAFXVariableDeclMap {
			return this._pVaryingVariableMap;
		}

		_getSharedVariableMap(): IAFXVariableDeclMap {
			return this._pSharedVariableMap;
		}

		_getGlobalVariableMap(): IAFXVariableDeclMap {
			return this._pGlobalVariableMap;
		}

		_getUniformVariableMap(): IAFXVariableDeclMap {
			return this._pUniformVariableMap;
		}

		_getForeignVariableMap(): IAFXVariableDeclMap {
			return this._pForeignVariableMap;
		}

		_getTextureVariableMap(): IAFXVariableDeclMap {
			return this._pTextureVariableMap;
		}

		_getUsedComplexTypeMap(): IAFXTypeMap {
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

		_getExtSystemFunctionList(): IAFXFunctionDeclInstruction[] {
			return this._pExtSystemFunctionList;
		}

		_getExtSystemMacrosList(): IAFXSimpleInstruction[] {
			return this._pExtSystemMacrosList;
		}

		_getExtSystemTypeList(): IAFXTypeDeclInstruction[] {
			return this._pExtSystemTypeList;
		}

		private generatesVertexAttrubutes(): void {
			var pShaderInputParamList: IAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
			var isComplexInput: boolean = this._pFunctionDefenition.isComplexShaderInput();

			this._pAttributeVariableMap = <IAFXVariableDeclMap>{};

			if (isComplexInput) {
				var pContainerVariable: IAFXVariableDeclInstruction = pShaderInputParamList[0];
				var pContainerType: IAFXVariableTypeInstruction = pContainerVariable.getType();

				var pAttributeNames: string[] = pContainerType._getFieldNameList();

				for (var i: uint = 0; i < pAttributeNames.length; i++) {
					var pAttr: IAFXVariableDeclInstruction = pContainerType._getField(pAttributeNames[i]);

					if (!this.isVariableTypeUse(pAttr.getType())) {
						continue;
					}

					this._pAttributeVariableMap[pAttr._getInstructionID()] = pAttr;
					this.generateExtractBlockForAttribute(pAttr);
				}
			}
			else {
				for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
					var pAttr: IAFXVariableDeclInstruction = pShaderInputParamList[i];

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

			this._pVaryingVariableMap = <IAFXVariableDeclMap>{};

			var pContainerVariable: IAFXVariableDeclInstruction = this._getOutVariable();
			var pContainerType: IAFXVariableTypeInstruction = pContainerVariable.getType();


			var pVaryingNames: string[] = pContainerType._getFieldNameList();

			for (var i: uint = 0; i < pVaryingNames.length; i++) {
				var pVarying: IAFXVariableDeclInstruction = pContainerType._getField(pVaryingNames[i]);

				if (!this.isVariableTypeUse(pVarying.getType())) {
					continue;
				}

				this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
			}

			this._pVaryingVariableKeys = this._getVaryingVariableKeys();
		}

		private generatePixelVaryings(): void {
			var pShaderInputParamList: IAFXVariableDeclInstruction[] = this._pFunctionDefenition.getParameListForShaderInput();
			var isComplexInput: boolean = this._pFunctionDefenition.isComplexShaderInput();

			this._pVaryingVariableMap = <IAFXVariableDeclMap>{};

			if (isComplexInput) {
				var pContainerVariable: IAFXVariableDeclInstruction = pShaderInputParamList[0];
				var pContainerType: IAFXVariableTypeInstruction = pContainerVariable.getType();

				var pVaryingNames: string[] = pContainerType._getFieldNameList();

				for (var i: uint = 0; i < pVaryingNames.length; i++) {
					var pVarying: IAFXVariableDeclInstruction = pContainerType._getField(pVaryingNames[i]);

					if (!this.isVariableTypeUse(pVarying.getType())) {
						continue;
					}

					this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
				}
			}
			else {
				for (var i: uint = 0; i < pShaderInputParamList.length; i++) {
					var pVarying: IAFXVariableDeclInstruction = pShaderInputParamList[i];

					if (!this.isVariableTypeUse(pVarying.getType())) {
						continue;
					}

					this._pVaryingVariableMap[pVarying._getInstructionID()] = pVarying;
				}
			}

			this._pVaryingVariableKeys = this._getVaryingVariableKeys();
		}

		private cloneVarTypeUsedMap(pMap: IAFXTypeUseInfoMap, pRelationMap: IAFXInstructionMap): IAFXTypeUseInfoMap {
			var pCloneMap: IAFXTypeUseInfoMap = <IAFXTypeUseInfoMap>{};

			for (var j in pMap) {
				var pType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>(isDef(pRelationMap[j]) ? pRelationMap[j] : pMap[j].type);
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

		private cloneVarDeclMap(pMap: IAFXVariableDeclMap, pRelationMap: IAFXInstructionMap): IAFXVariableDeclMap {
			var pCloneMap: IAFXVariableDeclMap = <IAFXVariableDeclMap>{};

			for (var i in pMap) {
				var pVar: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>(isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);

				if (!isNull(pVar)) {
					var id: uint = pVar._getInstructionID();
					pCloneMap[id] = pVar;
				}
			}

			return pCloneMap;
		}

		private cloneTypeMap(pMap: IAFXTypeMap, pRelationMap: IAFXInstructionMap): IAFXTypeMap {
			var pCloneMap: IAFXTypeMap = <IAFXTypeMap>{};

			for (var i in pMap) {
				var pVar: IAFXTypeInstruction = <IAFXTypeInstruction>(isDef(pRelationMap[i]) ? pRelationMap[i] : pMap[i]);
				var id: uint = pVar._getInstructionID();
				pCloneMap[id] = pVar;
			}

			return pCloneMap;
		}

		private addGlobalVariableType(pVariableType: IAFXVariableTypeInstruction,
			isWrite: boolean, isRead: boolean): void {
			if (!pVariableType._isFromVariableDecl()) {
				return;
			}

			var pVariable: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>pVariableType._getParentVarDecl();
			var pMainVariable: IAFXVariableDeclInstruction = pVariableType._getMainVariable();
			var iMainVar: uint = pMainVariable._getInstructionID();
			var iVar: uint = pVariable._getInstructionID();

			if (pMainVariable.getType().isShared()) {
				// this._pSharedVariableMap[iVar] = pVariable;
				this._pSharedVariableMap[iMainVar] = pMainVariable;
			}
			else if (pMainVariable.getType().isForeign()) {
				this._pForeignVariableMap[iMainVar] = pMainVariable;
			}
			else if (isWrite || pMainVariable.getType()._isConst()) {
				this._pGlobalVariableMap[iMainVar] = pMainVariable;
				if (isDefAndNotNull(this._pUniformVariableMap[iMainVar])) {
					this._pUniformVariableMap[iMainVar] = null;
				}
			}
			else {
				if (!isDef(this._pGlobalVariableMap[iMainVar])) {
					this._pUniformVariableMap[iMainVar] = pMainVariable;

					if (!pMainVariable.getType()._isComplex() && pMainVariable.hasConstantInitializer()) {
						pMainVariable.prepareDefaultValue();
					}
				}
			}

			if (pVariable.isSampler() && pVariable.hasInitializer()) {
				var pInitExpr: IAFXInitExprInstruction = pVariable.getInitializeExpr();
				var pTexture: IAFXVariableDeclInstruction = null;
				var pSamplerStates: SamplerStateBlockInstruction = null;

				if (pVariableType._isArray()) {
					var pList: IAFXInitExprInstruction[] = <IAFXInitExprInstruction[]>pInitExpr._getInstructions();
					for (var i: uint = 0; i < pList.length; i++) {
						pSamplerStates = <SamplerStateBlockInstruction>pList[i]._getInstructions()[0];
						pTexture = pSamplerStates.getTexture();

						if (!isNull(pTexture)) {
							this._pTextureVariableMap[pTexture._getInstructionID()] = pTexture;
						}
					}
				}
				else {
					pSamplerStates = <SamplerStateBlockInstruction>pInitExpr._getInstructions()[0];
					pTexture = pSamplerStates.getTexture();

					if (!isNull(pTexture)) {
						this._pTextureVariableMap[pTexture._getInstructionID()] = pTexture;
					}
				}
			}

			// this.addUsedComplexType(pMainVariable.getType()._getBaseType());
		}

		private addUniformParameter(pType: IAFXVariableTypeInstruction): void {
			var pMainVariable: IAFXVariableDeclInstruction = pType._getMainVariable();
			var iMainVar: uint = pMainVariable._getInstructionID();

			if (isDef(this._pGlobalVariableMap[iMainVar])) {
				debug.error("UNEXPECTED ERROR WITH UNIFORM_PARAMETER");
			}

			this._pUniformVariableMap[iMainVar] = pMainVariable;
			this.addUsedComplexType(pMainVariable.getType()._getBaseType());

			if (!pMainVariable.getType()._isComplex() && pMainVariable.hasConstantInitializer()) {
				pMainVariable.prepareDefaultValue();
			}
		}

		private addUsedComplexType(pType: IAFXTypeInstruction): void {
			if (pType._isBase() || isDef(this._pUsedComplexTypeMap[pType._getInstructionID()])) {
				return;
			}

			this._pUsedComplexTypeMap[pType._getInstructionID()] = pType;

			var pFieldNameList: string[] = pType._getFieldNameList();

			for (var i: uint = 0; i < pFieldNameList.length; i++) {
				this.addUsedComplexType(pType._getFieldType(pFieldNameList[i])._getBaseType());
			}
		}

		private addUsedInfoFromFunction(pFunction: IAFXFunctionDeclInstruction): void {
			pFunction._generateInfoAboutUsedData();

			var pSharedVarMap: IAFXVariableDeclMap = pFunction._getSharedVariableMap();
			var pGlobalVarMap: IAFXVariableDeclMap = pFunction._getGlobalVariableMap();
			var pUniformVarMap: IAFXVariableDeclMap = pFunction._getUniformVariableMap();
			var pForeignVarMap: IAFXVariableDeclMap = pFunction._getForeignVariableMap();
			var pTextureVarMap: IAFXVariableDeclMap = pFunction._getTextureVariableMap();
			var pUsedComplexTypeMap: IAFXTypeMap = pFunction._getUsedComplexTypeMap();

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

		private addExtSystemFunction(pFunction: IAFXFunctionDeclInstruction): void {
			if (isNull(this._pExtSystemFunctionList)) {
				this._pExtSystemFunctionList = [];
				this._pExtSystemTypeList = [];
				this._pExtSystemMacrosList = [];
			}

			if (pFunction._getInstructionType() === EAFXInstructionTypes.k_SystemFunctionInstruction) {
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

		private isVariableTypeUse(pVariableType: IAFXVariableTypeInstruction): boolean {
			var id: uint = pVariableType._getInstructionID();

			if (!isDef(this._pUsedVarTypeMap[id])) {
				return false;
			}

			if (this._pUsedVarTypeMap[id].numUsed === 0) {
				return false;
			}

			return true;
		}

		private generateExtractBlockForAttribute(pAttr: IAFXVariableDeclInstruction): IAFXInstruction {
			if (!pAttr.getType()._isPointer()) {
				return null;
			}

			var pExtractCollector: IAFXInstruction = new InstructionCollector();
			var pMainPointer: IAFXVariableDeclInstruction = pAttr.getType()._getMainPointer();

			pAttr._setAttrExtractionBlock(pExtractCollector);

			this.generateExtractStmtFromPointer(pMainPointer, null, 0, pExtractCollector);

			pAttr.getType().getSubVarDecls();

			return pExtractCollector;

		}

		private generateExtractStmtFromPointer(pPointer: IAFXVariableDeclInstruction,
			pOffset: IAFXVariableDeclInstruction,
			iDepth: uint,
			pCollector: IAFXInstruction): void {
			var pPointerType: IAFXVariableTypeInstruction = pPointer.getType();
			var pWhatExtracted: IAFXVariableDeclInstruction = pPointerType._getDownPointer();
			var pWhatExtractedType: IAFXVariableTypeInstruction = null;

			while (!isNull(pWhatExtracted)) {
				pWhatExtractedType = pWhatExtracted.getType();

				if (!pWhatExtractedType._isPointIndex() && iDepth === 0) {
					pOffset = this.createOffsetForAttr(pWhatExtracted);
				}

				if (!pWhatExtractedType._isComplex()) {
					var pSingleExtract: ExtractStmtInstruction = new ExtractStmtInstruction();
					pSingleExtract.generateStmtForBaseType(
						pWhatExtracted,
						pWhatExtractedType.getPointer(),
						pWhatExtractedType.getVideoBuffer(), 0,
						pWhatExtractedType._isPointIndex() ? null : pOffset);

					this._addUsedFunction(pSingleExtract.getExtractFunction());
					pCollector._push(pSingleExtract, true);
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

		private generateExtractStmtForComplexVar(pVarDecl: IAFXVariableDeclInstruction,
			pOffset: IAFXVariableDeclInstruction,
			iDepth: uint,
			pCollector: IAFXInstruction,
			pPointer: IAFXVariableDeclInstruction,
			pBuffer: IAFXVariableDeclInstruction,
			iPadding: uint): void {

			var pVarType: IAFXVariableTypeInstruction = pVarDecl.getType();
			var pFieldNameList: string[] = pVarType._getFieldNameList();
			var pField: IAFXVariableDeclInstruction = null;
			var pFieldType: IAFXVariableTypeInstruction = null;
			var pSingleExtract: ExtractStmtInstruction = null;
			var isNeedPadding: boolean = false;

			for (var i: uint = 0; i < pFieldNameList.length; i++) {
				pField = pVarType._getField(pFieldNameList[i]);

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

				if (pFieldType._isPointer()) {
					var pFieldPointer: IAFXVariableDeclInstruction = pFieldType._getMainPointer();
					pSingleExtract = new ExtractStmtInstruction();
					pSingleExtract.generateStmtForBaseType(pFieldPointer, pPointer, pFieldType.getVideoBuffer(),
						isNeedPadding ? (iPadding + pFieldType.getPadding()) : 0,
						pOffset);

					this._addUsedFunction(pSingleExtract.getExtractFunction());

					pCollector._push(pSingleExtract, true);
					this.generateExtractStmtFromPointer(pFieldPointer, pOffset, iDepth, pCollector);
				}
				else if (pFieldType._isComplex()) {
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

					pCollector._push(pSingleExtract, true);
				}
			}
		}

		private createOffsetForAttr(pAttr: IAFXVariableDeclInstruction): IAFXVariableDeclInstruction {
			var pOffset: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pOffsetType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			var pOffsetId: IAFXIdInstruction = new IdInstruction();

			pOffsetType.pushType(Effect.getSystemType("float"));
			pOffsetType.addUsage("uniform");

			pOffsetId.setName("offset");
			pOffsetId.setRealName(pAttr.getRealName() + "_o");

			pOffset._push(pOffsetType, true);
			pOffset._push(pOffsetId, true);

			pOffset._setParent(pAttr);
			pOffset.setSemantic(pAttr.getSemantic());

			pAttr.getType()._addAttrOffset(pOffset);

			return pOffset;
		}
	}
}

