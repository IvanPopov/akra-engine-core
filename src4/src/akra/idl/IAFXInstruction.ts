/// <reference path="parser/IParser.ts" />
/// <reference path="IAFXComponent.ts" />
/// <reference path="IUnique.ts" />
/// <reference path="IRenderer.ts" />
/// <reference path="IMap.ts" />
/// <reference path="IAFXComposer.ts" />
/// <reference path="ERenderStateValues.ts" />

module akra {
	export enum EAFXInstructionTypes {
		k_Instruction = 0,
		k_InstructionCollector,
		k_SimpleInstruction,
		k_VariableTypeInstruction,
		k_SystemTypeInstruction,
		k_ComplexTypeInstruction,
		k_TypedInstruction,
		k_DeclInstruction,
		k_IntInstruction,
		k_FloatInstruction,
		k_BoolInstruction,
		k_StringInstruction,
		k_IdInstruction,
		k_KeywordInstruction,
		k_TypeDeclInstruction,
		k_VariableDeclInstruction,
		k_AnnotationInstruction,
		k_UsageTypeInstruction,
		k_BaseTypeInstruction,
		k_StructDeclInstruction,
		k_StructFieldsInstruction,
		k_ExprInstruction,
		k_IdExprInstruction,
		k_ArithmeticExprInstruction,
		k_AssignmentExprInstruction,
		k_RelationalExprInstruction,
		k_LogicalExprInstruction,
		k_ConditionalExprInstruction,
		k_CastExprInstruction,
		k_UnaryExprInstruction,
		k_PostfixIndexInstruction,
		k_PostfixPointInstruction,
		k_PostfixArithmeticInstruction,
		k_PrimaryExprInstruction,
		k_ComplexExprInstruction,
		k_FunctionCallInstruction,
		k_SystemCallInstruction,
		k_ConstructorCallInstruction,
		k_CompileExprInstruction,
		k_InitExprInstruction,
		k_SamplerStateBlockInstruction,
		k_SamplerStateInstruction,
		k_ExtractExprInstruction,
		k_MemExprInstruction,
		k_FunctionDeclInstruction,
		k_ShaderFunctionInstruction,
		k_SystemFunctionInstruction,
		k_FunctionDefInstruction,
		k_StmtInstruction,
		k_StmtBlockInstruction,
		k_ExprStmtInstruction,
		k_BreakStmtInstruction,
		k_WhileStmtInstruction,
		k_ForStmtInstruction,
		k_IfStmtInstruction,
		k_DeclStmtInstruction,
		k_ReturnStmtInstruction,
		k_ExtractStmtInstruction,
		k_SemicolonStmtInstruction,
		k_PassInstruction,
		k_TechniqueInstruction
	}


	export enum EFunctionType {
		k_Vertex = 0,
		k_Pixel = 1,
		k_Fragment = 1,
		k_Function = 2,
		k_PassFunction = 3
	}

	export enum ECheckStage {
		CODE_TARGET_SUPPORT, /* Отсутсвуют конструкции не поддерживаемые языком назначения (GLSL) */
		SELF_CONTAINED /* Код замкнут, нет не определенных функций, пассов, техник. Нет мертвых функций. */
		// VALIDATION  /* Код не содерит синтаксиески неправильных выражений, то что не исчерпывается */ 
	}

	export enum EVarUsedMode {
		k_Read,
		k_Write,
		k_ReadWrite,
		k_Undefined,
		k_Default = k_ReadWrite
	}

	export interface IAFXInstructionStateMap extends IStringMap {
	}

	export interface IAFXInstructionRoutine {
		(): void;
	}

	export interface IAFXInstructionError {
		code: uint;
		info: any;
	}

	export interface IAFXInstructionMap {
		[index: uint]: IAFXInstruction;
	}

	export interface IAFXSimpleInstructionMap {
		[index: string]: IAFXSimpleInstruction;
		[index: uint]: IAFXSimpleInstruction;
	}

	export interface IAFXIdExprMap {
		[index: string]: IAFXIdExprInstruction;
	}

	export interface IAFXVariableTypeMap {
		[index: string]: IAFXVariableTypeInstruction;
		[index: uint]: IAFXVariableTypeInstruction;
	}

	export interface IAFXTypeMap {
		[index: string]: IAFXTypeInstruction;
		[index: uint]: IAFXTypeInstruction;
	}

	export interface IAFXTypeListMap {
		[index: string]: IAFXTypeInstruction[];
		[index: uint]: IAFXTypeInstruction[];
	}

	export interface IAFXTypeDeclMap {
		[index: string]: IAFXTypeDeclInstruction;
		[index: uint]: IAFXTypeDeclInstruction;
	}

	export interface IAFXVariableDeclMap {
		[index: uint]: IAFXVariableDeclInstruction;
		[index: string]: IAFXVariableDeclInstruction;
	}

	export interface IAFXVariableDeclListMap {
		[index: uint]: IAFXVariableDeclInstruction[];
		[index: string]: IAFXVariableDeclInstruction[];
	}

	export interface IAFXVarUsedModeMap {
		[index: string]: EVarUsedMode;
	}

	export interface IAFXFunctionDeclMap {
		[index: string]: IAFXFunctionDeclInstruction;
		[index: uint]: IAFXFunctionDeclInstruction;
	}

	export interface IAFXTypeUseInfoContainer {
		type: IAFXVariableTypeInstruction;
		isRead: boolean;
		isWrite: boolean;
		numRead: uint;
		numWrite: uint;
		numUsed: uint;
	}

	export interface IAFXTypeUseInfoMap {
		[index: uint]: IAFXTypeUseInfoContainer;
	}

	export enum EExtractExprType {
		k_Header,

		k_Float,
		k_Int,
		k_Bool,

		k_Float2,
		k_Int2,
		k_Bool2,

		k_Float3,
		k_Int3,
		k_Bool3,

		k_Float4,
		k_Int4,
		k_Bool4,

		k_Float4x4
	}

	export enum EAFXBlendMode {
		k_Shared,
		k_Uniform,
		k_Attribute,
		k_Foreign,
		k_Global,
		k_Varying,
		k_TypeDecl,
		k_VertexOut
	}

	export interface IAFXImportedTechniqueInfo {
		technique: IAFXTechniqueInstruction;
		component: IAFXComponent;
		shift: int;
	}

	/**
	 * All opertion are represented by: 
	 * operator : arg1 ... argn
	 * Operator and instructions may be empty.
	 */
	export interface IAFXInstruction {

		_setParent(pParent: IAFXInstruction): void;
		_getParent(): IAFXInstruction;

		_setOperator(sOperator: string): void;
		_getOperator(): string;

		_setInstructions(pInstructionList: IAFXInstruction[]): void;
		_getInstructions(): IAFXInstruction[];

		_getInstructionType(): EAFXInstructionTypes;
		_getInstructionID(): uint;
		_getScope(): uint;
		_setScope(iScope: uint): void;
		_isInGlobalScope(): boolean;

		_check(eStage: ECheckStage): boolean;
		_getLastError(): IAFXInstructionError;
		_setError(eCode: uint, pInfo?: any): void;
		_clearError(): void;
		_isErrorOccured(): boolean;

		_setVisible(isVisible: boolean): void;
		_isVisible(): boolean;

		_initEmptyInstructions(): void;

		// /**
		//  * Contain states of instruction
		//  */
		// stateMap: IAFXInstructionStateMap;

		_push(pInstruction: IAFXInstruction, isSetParent?: boolean): void;

		// changeState(sStateName: string, sValue: string): void;
		// changeState(iStateIndex: int, sValue: string): void;

		// stateChange(): void;
		// isStateChange(): boolean;

		_addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint);
		_prepareFor(eUsedType: EFunctionType): void;

		toString(): string;
		_toFinalCode(): string;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXInstruction;
	}

	export interface IAFXSimpleInstruction extends IAFXInstruction {
		_setValue(sValue: string): void;
		_isValue(sValue: string): boolean;
	}

	export interface IAFXTypeInstruction extends IAFXInstruction {
		_toDeclString(): string;

		_isBuiltIn(): boolean;
		_setBuiltIn(isBuiltIn: boolean): void;

		/**
		 * Simple tests
		 */
		_isBase(): boolean;
		_isArray(): boolean;
		_isNotBaseArray(): boolean;
		_isComplex(): boolean;
		_isEqual(pType: IAFXTypeInstruction): boolean;
		_isStrongEqual(pType: IAFXTypeInstruction): boolean;
		_isConst(): boolean;

		_isSampler(): boolean;
		_isSamplerCube(): boolean;
		_isSampler2D(): boolean;

		_isWritable(): boolean;
		_isReadable(): boolean;

		_containArray(): boolean;
		_containSampler(): boolean;
		_containPointer(): boolean;
		_containComplexType(): boolean;
		/**
		 * Set private params
		 */
		_setName(sName: string): void;
		_canWrite(isWritable: boolean): void;
		_canRead(isReadable: boolean): void;

		// markAsUsed(): void;

		/**
		 * get type info
		 */
		_getName(): string;
		_getRealName(): string;
		_getHash(): string;
		_getStrongHash(): string;
		_getSize(): uint;
		_getBaseType(): IAFXTypeInstruction;
		_getLength(): uint;
		_getArrayElementType(): IAFXTypeInstruction;
		_getTypeDecl(): IAFXTypeDeclInstruction;

		// Fields

		_hasField(sFieldName: string): boolean;
		_hasFieldWithSematic(sSemantic: string);
		_hasAllUniqueSemantics(): boolean;
		_hasFieldWithoutSemantic(): boolean;

		_getField(sFieldName: string): IAFXVariableDeclInstruction;
		_getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
		_getFieldType(sFieldName: string): IAFXVariableTypeInstruction;
		_getFieldNameList(): string[];

		/**
		 * System
		 */
		_clone(pRelationMap?: IAFXInstructionMap): IAFXTypeInstruction;
		_blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction;
	}

	export interface IAFXVariableTypeInstruction extends IAFXTypeInstruction {
		_setCollapsed(bValue: boolean): void;
		_isCollapsed(): boolean;

		/**
		 * Simple tests
		 */
		_isPointer(): boolean;
		_isStrictPointer(): boolean;
		_isPointIndex(): boolean;

		_isFromVariableDecl(): boolean;
		_isFromTypeDecl(): boolean;

		_isUniform(): boolean;
		_isGlobal(): boolean;
		_isConst(): boolean;
		_isShared(): boolean;
		_isForeign(): boolean;

		_isTypeOfField(): boolean;
		_isUnverifiable(): boolean;

		// /**
		//  * set type info
		//  */
		// _markUsedForWrite(): boolean;
		// _markUsedForRead(): boolean;
		// _goodForRead(): boolean;

		// _markAsField(): void;

		/**
		 * init api
		 */
		_setPadding(iPadding: uint): void;
		_pushType(pType: IAFXTypeInstruction): void;
		_addUsage(sUsage: string): void;
		_addArrayIndex(pExpr: IAFXExprInstruction): void;
		_addPointIndex(isStrict?: boolean): void;
		_setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void;
		_initializePointers(): void;

		_setPointerToStrict(): void;
		_addPointIndexInDepth(): void;
		_setVideoBufferInDepth(): void;
		_markAsUnverifiable(isUnverifiable: boolean): void;
		_addAttrOffset(pOffset: IAFXVariableDeclInstruction): void;

		/**
		 * Type info
		 */
		_getPadding(): uint;
		_getArrayElementType(): IAFXVariableTypeInstruction;

		_getUsageList(): string[];
		_getSubType(): IAFXTypeInstruction;

		_hasUsage(sUsageName: string): boolean;
		_hasVideoBuffer(): boolean;

		_getPointDim(): uint;
		_getPointer(): IAFXVariableDeclInstruction;
		_getVideoBuffer(): IAFXVariableDeclInstruction;
		_getFieldExpr(sFieldName: string): IAFXIdExprInstruction;
		_getFieldIfExist(sFieldName: string): IAFXVariableDeclInstruction;

		_getSubVarDecls(): IAFXVariableDeclInstruction[];

		_getFullName(): string;
		_getVarDeclName(): string;
		_getTypeDeclName(): string;

		_getParentVarDecl(): IAFXVariableDeclInstruction;
		_getParentContainer(): IAFXVariableDeclInstruction;
		_getMainVariable(): IAFXVariableDeclInstruction;

		_getMainPointer(): IAFXVariableDeclInstruction;
		_getUpPointer(): IAFXVariableDeclInstruction;
		_getDownPointer(): IAFXVariableDeclInstruction;
		_getAttrOffset(): IAFXVariableDeclInstruction;

		/**
		 * System
		 */
		_wrap(): IAFXVariableTypeInstruction;
		_clone(pRelationMap?: IAFXInstructionMap): IAFXVariableTypeInstruction;
		_blend(pVariableType: IAFXVariableTypeInstruction, eMode: EAFXBlendMode): IAFXVariableTypeInstruction;

		_setCloneHash(sHash: string, sStrongHash: string): void;
		_setCloneArrayIndex(pElementType: IAFXVariableTypeInstruction,
			pIndexExpr: IAFXExprInstruction, iLength: uint): void;
		_setClonePointeIndexes(nDim: uint, pPointerList: IAFXVariableDeclInstruction[]): void;
		_setCloneFields(pFieldMap: IAFXVariableDeclMap): void;

		_setUpDownPointers(pUpPointer: IAFXVariableDeclInstruction,
			pDownPointer: IAFXVariableDeclInstruction): void;
	}

	export interface IAFXTypedInstruction extends IAFXInstruction {
		_getType(): IAFXTypeInstruction;
		_setType(pType: IAFXTypeInstruction): void;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXTypedInstruction;
	}

	export interface IAFXDeclInstruction extends IAFXTypedInstruction {
		_setSemantic(sSemantic: string);
		_setAnnotation(pAnnotation: IAFXAnnotationInstruction): void;
		_getName(): string;
		_getRealName(): string;
		_getNameId(): IAFXIdInstruction;
		_getSemantic(): string;

		_isBuiltIn(): boolean;
		_setBuiltIn(isBuiltIn: boolean): void;

		_isForAll(): boolean;
		_isForPixel(): boolean;
		_isForVertex(): boolean;

		_setForAll(canUse: boolean): void;
		_setForPixel(canUse: boolean): void;
		_setForVertex(canUse: boolean): void;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXDeclInstruction;
	}

	export interface IAFXTypeDeclInstruction extends IAFXDeclInstruction {
		_clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction;
		_blend(pDecl: IAFXTypeDeclInstruction, eBlendMode: EAFXBlendMode): IAFXTypeDeclInstruction;
	}

	export interface IAFXVariableDeclInstruction extends IAFXDeclInstruction {
		_hasInitializer(): boolean;
		_getInitializeExpr(): IAFXInitExprInstruction;
		_hasConstantInitializer(): boolean;

		_lockInitializer(): void;
		_unlockInitializer(): void;

		_getDefaultValue(): any;
		_prepareDefaultValue(): void;

		_getValue(): any;
		_setValue(pValue: any): any;

		_getType(): IAFXVariableTypeInstruction;
		_setType(pType: IAFXVariableTypeInstruction): void;

		_isUniform(): boolean;
		_isField(): boolean;
		_isPointer(): boolean;
		_isVideoBuffer(): boolean;
		_isSampler(): boolean;

		_getSubVarDecls(): IAFXVariableDeclInstruction[];

		_isDefinedByZero(): boolean;
		_defineByZero(isDefine: boolean): void;

		_setAttrExtractionBlock(pCodeBlock: IAFXInstruction): void;
		_getAttrExtractionBlock(): IAFXInstruction;

		_markAsVarying(bValue: boolean): void;
		_markAsShaderOutput(isShaderOutput: boolean): void;
		_isShaderOutput(): boolean;

		_getNameIndex(): uint;
		_getFullNameExpr(): IAFXExprInstruction;
		_getFullName(): string;
		_getVideoBufferSampler(): IAFXVariableDeclInstruction;
		_getVideoBufferHeader(): IAFXVariableDeclInstruction;
		_getVideoBufferInitExpr(): IAFXInitExprInstruction;

		_setName(sName: string): void;
		_setRealName(sName: string): void;
		_setVideoBufferRealName(sSampler: string, sHeader: string): void;

		_setCollapsed(bValue: boolean): void;
		_isCollapsed(): boolean;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction;
		_blend(pVariableDecl: IAFXVariableDeclInstruction, eMode: EAFXBlendMode): IAFXVariableDeclInstruction;
	}

	export interface IAFXFunctionDeclInstruction extends IAFXDeclInstruction {
		_toFinalDefCode(): string;

		//_getNameId(): IAFXIdInstruction;
		_hasImplementation(): boolean;
		_getArguments(): IAFXTypedInstruction[];
		_getNumNeededArguments(): uint;
		_getReturnType(): IAFXVariableTypeInstruction;
		_getFunctionType(): EFunctionType;
		_setFunctionType(eType: EFunctionType): void;

		_getVertexShader(): IAFXFunctionDeclInstruction;
		_getPixelShader(): IAFXFunctionDeclInstruction;

		// closeArguments(pArguments: IAFXInstruction[]): IAFXTypedInstruction[];
		_setFunctionDef(pFunctionDef: IAFXDeclInstruction): void;
		_setImplementation(pImplementation: IAFXStmtInstruction): void;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXFunctionDeclInstruction;

		//addUsedVariableType(pType: IAFXVariableTypeInstruction, eUsedMode: EVarUsedMode): boolean;

		_addOutVariable(pVariable: IAFXVariableDeclInstruction): boolean;
		_getOutVariable(): IAFXVariableDeclInstruction;

		_markUsedAs(eUsedType: EFunctionType): void;
		_isUsedAs(eUsedType: EFunctionType): boolean;
		_isUsedAsFunction(): boolean;
		_isUsedAsVertex(): boolean;
		_isUsedAsPixel(): boolean;
		_isUsed(): boolean;
		_markUsedInVertex(): void;
		_markUsedInPixel(): void;
		_isUsedInVertex(): boolean;
		_isUsedInPixel(): boolean;
		_checkVertexUsage(): boolean;
		_checkPixelUsage(): boolean;

		_checkDefenitionForVertexUsage(): boolean;
		_checkDefenitionForPixelUsage(): boolean;

		_canUsedAsFunction(): boolean;
		_notCanUsedAsFunction(): void;

		_addUsedFunction(pFunction: IAFXFunctionDeclInstruction): boolean;
		_getUsedFunctionList(): IAFXFunctionDeclInstruction[];
		_addUsedVariable(pVariable: IAFXVariableDeclInstruction): void;

		_isBlackListFunction(): boolean;
		_addToBlackList(): void;
		_getStringDef(): string;

		_convertToVertexShader(): IAFXFunctionDeclInstruction;
		_convertToPixelShader(): IAFXFunctionDeclInstruction;

		_prepareForVertex(): void;
		_prepareForPixel(): void;

		_generateInfoAboutUsedData(): void;

		_getAttributeVariableMap(): IAFXVariableDeclMap;
		_getVaryingVariableMap(): IAFXVariableDeclMap;

		_getSharedVariableMap(): IAFXVariableDeclMap;
		_getGlobalVariableMap(): IAFXVariableDeclMap;
		_getUniformVariableMap(): IAFXVariableDeclMap;
		_getForeignVariableMap(): IAFXVariableDeclMap;
		_getTextureVariableMap(): IAFXVariableDeclMap;
		_getUsedComplexTypeMap(): IAFXTypeMap;

		_getAttributeVariableKeys(): uint[];
		_getVaryingVariableKeys(): uint[];

		_getSharedVariableKeys(): uint[];
		_getUniformVariableKeys(): uint[];
		_getForeignVariableKeys(): uint[];
		_getGlobalVariableKeys(): uint[];
		_getTextureVariableKeys(): uint[];
		_getUsedComplexTypeKeys(): uint[];

		_getExtSystemFunctionList(): IAFXFunctionDeclInstruction[];
		_getExtSystemMacrosList(): IAFXSimpleInstruction[];
		_getExtSystemTypeList(): IAFXTypeDeclInstruction[];
	}

	export interface IAFXStructDeclInstruction extends IAFXInstruction {
		//id: IAFXIdInstruction
		//structFields: IAFXStructInstruction
	}

	// export interface IAFXBaseTypeInstruction extends IAFXInstruction {
	//	 //id: IAFXIdInstruction
	//	 //...
	// }

	export interface IAFXIdInstruction extends IAFXInstruction {
		_getName(): string;
		_getRealName(): string;

		_setName(sName: string): void;
		_setRealName(sName: string): void;

		_markAsVarying(bValue: boolean): void;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXIdInstruction;
	}

	export interface IAFXKeywordInstruction extends IAFXInstruction {
		_setValue(sValue: string): void;
		_isValue(sTestValue: string): boolean;
	}

	export interface IAFXAnalyzedInstruction extends IAFXInstruction {
		_addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
	}

	export interface IAFXExprInstruction extends IAFXTypedInstruction, IAFXAnalyzedInstruction {
		_evaluate(): boolean;
		_simplify(): boolean;
		_getEvalValue(): any;
		_isConst(): boolean;
		_getType(): IAFXVariableTypeInstruction;

		_clone(pRelationMap?: IAFXInstructionMap): IAFXExprInstruction;
	}

	export interface IAFXInitExprInstruction extends IAFXExprInstruction {
		_optimizeForVariableType(pType: IAFXVariableTypeInstruction): boolean;
		// getExternalValue(pType: IAFXVariableTypeInstruction): any;
	}

	export interface IAFXIdExprInstruction extends IAFXExprInstruction {
		_clone(pRelationMap?: IAFXInstructionMap): IAFXIdExprInstruction;
	}

	export interface IAFXLiteralInstruction extends IAFXExprInstruction {
		_setValue(pValue: any): void;
		_clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
	}

	export interface IAFXAnnotationInstruction extends IAFXInstruction {
	}

	export interface IAFXStmtInstruction extends IAFXInstruction, IAFXAnalyzedInstruction {
	}

	export interface IAFXPassInstruction extends IAFXDeclInstruction {
		_addFoundFunction(pNode: parser.IParseNode, pShader: IAFXFunctionDeclInstruction, eType: EFunctionType): void;
		_getFoundedFunction(pNode: parser.IParseNode): IAFXFunctionDeclInstruction;
		_getFoundedFunctionType(pNode: parser.IParseNode): EFunctionType;
		_setParseNode(pNode: parser.IParseNode): void;
		_getParseNode(): parser.IParseNode;
		_markAsComplex(isComplex: boolean): void;
		_addCodeFragment(sCode: string): void;

		_getSharedVariableMapV(): IAFXVariableDeclMap;
		_getGlobalVariableMapV(): IAFXVariableDeclMap;
		_getUniformVariableMapV(): IAFXVariableDeclMap;
		_getForeignVariableMapV(): IAFXVariableDeclMap;
		_getTextureVariableMapV(): IAFXVariableDeclMap;
		_getUsedComplexTypeMapV(): IAFXTypeMap;

		_getSharedVariableMapP(): IAFXVariableDeclMap;
		_getGlobalVariableMapP(): IAFXVariableDeclMap;
		_getUniformVariableMapP(): IAFXVariableDeclMap;
		_getForeignVariableMapP(): IAFXVariableDeclMap;
		_getTextureVariableMapP(): IAFXVariableDeclMap;
		_getUsedComplexTypeMapP(): IAFXTypeMap;

		_getFullUniformMap(): IAFXVariableDeclMap;
		_getFullForeignMap(): IAFXVariableDeclMap;
		_getFullTextureMap(): IAFXVariableDeclMap;

		_getVertexShader(): IAFXFunctionDeclInstruction;
		_getPixelShader(): IAFXFunctionDeclInstruction;
		
		_addOwnUsedForignVariable(pVarDecl: IAFXVariableDeclInstruction): void;
		_addShader(pShader: IAFXFunctionDeclInstruction): void;
		_setState(eType: ERenderStates, eValue: ERenderStateValues): void;
		_finalizePass(): void;

		_isComplexPass(): boolean;
		_evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean;

		_getState(eType: ERenderStates): ERenderStateValues;
		_getRenderStates(): IMap<ERenderStateValues>;
	}

	export interface IAFXTechniqueInstruction extends IAFXDeclInstruction {
		_setName(sName: string, isComplexName: boolean): void;
		_getName(): string;
		_hasComplexName(): boolean;

		_isPostEffect(): boolean;

		_addPass(pPass: IAFXPassInstruction): void;
		_getPassList(): IAFXPassInstruction[];
		_getPass(iPass: uint): IAFXPassInstruction;

		_totalOwnPasses(): uint;
		_totalPasses(): uint;

		_getSharedVariablesForVertex(): IAFXVariableDeclInstruction[];
		_getSharedVariablesForPixel(): IAFXVariableDeclInstruction[];

		_addTechniqueFromSameEffect(pTechnique: IAFXTechniqueInstruction, iShift: uint): void;
		_addComponent(pComponent: IAFXComponent, iShift: int): void;

		_getFullComponentList(): IAFXComponent[];
		_getFullComponentShiftList(): int[];

		_checkForCorrectImports(): boolean;

		_setGlobalParams(sProvideNameSpace: string,
			pGloabalImportList: IAFXImportedTechniqueInfo[]): void;

		_finalize(pComposer: IAFXComposer): void;
	}

	export interface IAFXVariableBlendInfo {
		varList: IAFXVariableDeclInstruction[];
		blendType: IAFXVariableTypeInstruction;
		name: string;
		nameIndex: uint;
	}

	export interface IAFXVariableBlendInfoMap {
		[index: uint]: IAFXVariableBlendInfo;
	}

	export interface IAFXFunctionDeclListMap {
		[functionName: string]: IAFXFunctionDeclInstruction[];
	}
}
