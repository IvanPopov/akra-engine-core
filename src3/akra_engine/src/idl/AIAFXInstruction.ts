// AIAFXInstruction interface
// [write description here...]


/// <reference path="AIParser.ts" />
/// <reference path="AIAFXComponent.ts" />
/// <reference path="AIUnique.ts" />
/// <reference path="AIRenderer.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIRenderStateMap.ts" />

// #define EPassState AERenderStates
// #define EPassStateValue AERenderStateValues
// #define IPassStateMap AIRenderStateMap


/// <reference path="AIAFXComposer.ts" />

enum AEAFXInstructionTypes {
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


enum AEFunctionType {
    k_Vertex = 0,
    k_Pixel = 1,
    k_Fragment = 1,
    k_Function = 2,
    k_PassFunction = 3
}

enum AECheckStage {
    CODE_TARGET_SUPPORT, /* Отсутсвуют конструкции не поддерживаемые языком назначения (GLSL) */
    SELF_CONTAINED /* Код замкнут, нет не определенных функций, пассов, техник. Нет мертвых функций. */
    // VALIDATION  /* Код не содерит синтаксиески неправильных выражений, то что не исчерпывается */ 
}

enum AEVarUsedMode {
    k_Read,
    k_Write,
    k_ReadWrite,
    k_Undefined,
    k_Default = k_ReadWrite
}

interface AIAFXInstructionStateMap extends AIStringMap {
}

interface AIAFXInstructionRoutine {
    (): void;
}

interface AIAFXInstructionError {
    code: uint;
    info: any;
}

interface AIAFXInstructionMap {
    [index: uint]: AIAFXInstruction;
}

interface AIAFXSimpleInstructionMap {
    [index: string]: AIAFXSimpleInstruction;
    [index: uint]: AIAFXSimpleInstruction;
}

interface AIAFXIdExprMap {
    [index: string]: AIAFXIdExprInstruction;
}

interface AIAFXVariableTypeMap {
    [index: string]: AIAFXVariableTypeInstruction;
    [index: uint]: AIAFXVariableTypeInstruction;
}

interface AIAFXTypeMap {
    [index: string]: AIAFXTypeInstruction;
    [index: uint]: AIAFXTypeInstruction;
}

interface AIAFXTypeListMap {
    [index: string]: AIAFXTypeInstruction[];
    [index: uint]: AIAFXTypeInstruction[];
}

interface AIAFXTypeDeclMap {
    [index: string]: AIAFXTypeDeclInstruction;
    [index: uint]: AIAFXTypeDeclInstruction;
}

interface AIAFXVariableDeclMap {
    [index: uint]: AIAFXVariableDeclInstruction;
    [index: string]: AIAFXVariableDeclInstruction;
}

interface AIAFXVariableDeclListMap {
    [index: uint]: AIAFXVariableDeclInstruction[];
    [index: string]: AIAFXVariableDeclInstruction[];
}

interface AIAFXVarUsedModeMap {
    [index: string]: AEVarUsedMode;
}

interface AIAFXFunctionDeclMap {
    [index: string]: AIAFXFunctionDeclInstruction;
    [index: uint]: AIAFXFunctionDeclInstruction;
}

interface AIAFXTypeUseInfoContainer {
    type: AIAFXVariableTypeInstruction;
    isRead: boolean;
    isWrite: boolean;
    numRead: uint;
    numWrite: uint;
    numUsed: uint;
}

interface AIAFXTypeUseInfoMap {
    [index: uint]: AIAFXTypeUseInfoContainer;
}

enum AEExtractExprType {
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

enum AEAFXBlendMode {
    k_Shared,
    k_Uniform,
    k_Attribute,
    k_Foreign,
    k_Global,
    k_Varying,
    k_TypeDecl,
    k_VertexOut
}

interface AIAFXImportedTechniqueInfo {
    technique: AIAFXTechniqueInstruction;
    component: AIAFXComponent;
    shift: int;
}

/**
 * All opertion are represented by: 
 * operator : arg1 ... argn
 * Operator and instructions may be empty.
 */
interface AIAFXInstruction extends AIUnique {
    setParent(pParent: AIAFXInstruction): void;
    getParent(): AIAFXInstruction;

    setOperator(sOperator: string): void;
    getOperator(): string;

    setInstructions(pInstructionList: AIAFXInstruction[]): void;
    getInstructions(): AIAFXInstruction[];

    _getInstructionType(): AEAFXInstructionTypes;
    _getInstructionID(): uint;
    _getScope(): uint;
    _setScope(iScope: uint): void;
    _isInGlobalScope(): boolean;

    check(eStage: AECheckStage): boolean;
    getLastError(): AIAFXInstructionError;
    setError(eCode: uint, pInfo?: any): void;
    clearError(): void;
    isErrorOccured(): boolean;

    setVisible(isVisible: boolean): void;
    isVisible(): boolean;

    initEmptyInstructions(): void;

    // /**
    //  * Contain states of instruction
    //  */
    // stateMap: AIAFXInstructionStateMap;

    push(pInstruction: AIAFXInstruction, isSetParent?: boolean): void;

    // changeState(sStateName: string, sValue: string): void;
    // changeState(iStateIndex: int, sValue: string): void;

    // stateChange(): void;
    // isStateChange(): boolean;

    addRoutine(fnRoutine: AIAFXInstructionRoutine, iPriority?: uint);
    prepareFor(eUsedType: AEFunctionType): void;

    toString(): string;
    toFinalCode(): string;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXInstruction;
}

interface AIAFXSimpleInstruction extends AIAFXInstruction {
    setValue(sValue: string): void;
    isValue(sValue: string): boolean;
}

interface AIAFXTypeInstruction extends AIAFXInstruction {
    _toDeclString(): string;

    isBuiltIn(): boolean;
    setBuiltIn(isBuiltIn: boolean): void;

    /**
     * Simple tests
     */
    isBase(): boolean;
    isArray(): boolean;
    isNotBaseArray(): boolean;
    isComplex(): boolean;
    isEqual(pType: AIAFXTypeInstruction): boolean;
    isStrongEqual(pType: AIAFXTypeInstruction): boolean;
    isConst(): boolean;

    isSampler(): boolean;
    isSamplerCube(): boolean;
    isSampler2D(): boolean;

    isWritable(): boolean;
    isReadable(): boolean;

    _containArray(): boolean;
    _containSampler(): boolean;
    _containPointer(): boolean;
    _containComplexType(): boolean;
    /**
     * Set private params
     */
    setName(sName: string): void;
    _canWrite(isWritable: boolean): void;
    _canRead(isReadable: boolean): void;

    // markAsUsed(): void;

    /**
     * get type info
     */
    getName(): string;
    getRealName(): string;
    getHash(): string;
    getStrongHash(): string;
    getSize(): uint;
    getBaseType(): AIAFXTypeInstruction;
    getLength(): uint;
    getArrayElementType(): AIAFXTypeInstruction;
    getTypeDecl(): AIAFXTypeDeclInstruction;

    // Fields

    hasField(sFieldName: string): boolean;
    hasFieldWithSematic(sSemantic: string);
    hasAllUniqueSemantics(): boolean;
    hasFieldWithoutSemantic(): boolean;

    getField(sFieldName: string): AIAFXVariableDeclInstruction;
    getFieldBySemantic(sSemantic: string): AIAFXVariableDeclInstruction;
    getFieldType(sFieldName: string): AIAFXVariableTypeInstruction;
    getFieldNameList(): string[];

    /**
     * System
     */
    clone(pRelationMap?: AIAFXInstructionMap): AIAFXTypeInstruction;
    blend(pType: AIAFXTypeInstruction, eMode: AEAFXBlendMode): AIAFXTypeInstruction;
}

interface AIAFXVariableTypeInstruction extends AIAFXTypeInstruction {
    _setCollapsed(bValue: boolean): void;
    _isCollapsed(): boolean;

    /**
     * Simple tests
     */
    isPointer(): boolean;
    isStrictPointer(): boolean;
    isPointIndex(): boolean;

    isFromVariableDecl(): boolean;
    isFromTypeDecl(): boolean;

    isUniform(): boolean;
    isGlobal(): boolean;
    isConst(): boolean;
    isShared(): boolean;
    isForeign(): boolean;

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
    setPadding(iPadding: uint): void;
    pushType(pType: AIAFXTypeInstruction): void;
    addUsage(sUsage: string): void;
    addArrayIndex(pExpr: AIAFXExprInstruction): void;
    addPointIndex(isStrict?: boolean): void;
    setVideoBuffer(pBuffer: AIAFXVariableDeclInstruction): void;
    initializePointers(): void;

    _setPointerToStrict(): void;
    _addPointIndexInDepth(): void;
    _setVideoBufferInDepth(): void;
    _markAsUnverifiable(isUnverifiable: boolean): void;
    _addAttrOffset(pOffset: AIAFXVariableDeclInstruction): void;

    /**
     * Type info
     */
    getPadding(): uint;
    getArrayElementType(): AIAFXVariableTypeInstruction;

    getUsageList(): string[];
    getSubType(): AIAFXTypeInstruction;

    hasUsage(sUsageName: string): boolean;
    hasVideoBuffer(): boolean;

    getPointDim(): uint;
    getPointer(): AIAFXVariableDeclInstruction;
    getVideoBuffer(): AIAFXVariableDeclInstruction;
    getFieldExpr(sFieldName: string): AIAFXIdExprInstruction;
    getFieldIfExist(sFieldName: string): AIAFXVariableDeclInstruction;

    getSubVarDecls(): AIAFXVariableDeclInstruction[];

    _getFullName(): string;
    _getVarDeclName(): string;
    _getTypeDeclName(): string;

    _getParentVarDecl(): AIAFXVariableDeclInstruction;
    _getParentContainer(): AIAFXVariableDeclInstruction;
    _getMainVariable(): AIAFXVariableDeclInstruction;

    _getMainPointer(): AIAFXVariableDeclInstruction;
    _getUpPointer(): AIAFXVariableDeclInstruction;
    _getDownPointer(): AIAFXVariableDeclInstruction;
    _getAttrOffset(): AIAFXVariableDeclInstruction;

    /**
     * System
     */
    wrap(): AIAFXVariableTypeInstruction;
    clone(pRelationMap?: AIAFXInstructionMap): AIAFXVariableTypeInstruction;
    blend(pVariableType: AIAFXVariableTypeInstruction, eMode: AEAFXBlendMode): AIAFXVariableTypeInstruction;

    _setCloneHash(sHash: string, sStrongHash: string): void;
    _setCloneArrayIndex(pElementType: AIAFXVariableTypeInstruction,
        pIndexExpr: AIAFXExprInstruction, iLength: uint): void;
    _setClonePointeIndexes(nDim: uint, pPointerList: AIAFXVariableDeclInstruction[]): void;
    _setCloneFields(pFieldMap: AIAFXVariableDeclMap): void;

    _setUpDownPointers(pUpPointer: AIAFXVariableDeclInstruction,
        pDownPointer: AIAFXVariableDeclInstruction): void;
}

interface AIAFXTypedInstruction extends AIAFXInstruction {
    getType(): AIAFXTypeInstruction;
    setType(pType: AIAFXTypeInstruction): void;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXTypedInstruction;
}

interface AIAFXDeclInstruction extends AIAFXTypedInstruction {
    setSemantic(sSemantic: string);
    setAnnotation(pAnnotation: AIAFXAnnotationInstruction): void;
    getName(): string;
    getRealName(): string;
    getNameId(): AIAFXIdInstruction;
    getSemantic(): string;

    isBuiltIn(): boolean;
    setBuiltIn(isBuiltIn: boolean): void;

    _isForAll(): boolean;
    _isForPixel(): boolean;
    _isForVertex(): boolean;

    _setForAll(canUse: boolean): void;
    _setForPixel(canUse: boolean): void;
    _setForVertex(canUse: boolean): void;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXDeclInstruction;
}

interface AIAFXTypeDeclInstruction extends AIAFXDeclInstruction {
    clone(pRelationMap?: AIAFXInstructionMap): AIAFXTypeDeclInstruction;
    blend(pDecl: AIAFXTypeDeclInstruction, eBlendMode: AEAFXBlendMode): AIAFXTypeDeclInstruction;
}

interface AIAFXVariableDeclInstruction extends AIAFXDeclInstruction {
    hasInitializer(): boolean;
    getInitializeExpr(): AIAFXInitExprInstruction;
    hasConstantInitializer(): boolean;

    lockInitializer(): void;
    unlockInitializer(): void;

    getDefaultValue(): any;
    prepareDefaultValue(): void;

    getValue(): any;
    setValue(pValue: any): any;

    getType(): AIAFXVariableTypeInstruction;
    setType(pType: AIAFXVariableTypeInstruction): void;

    isUniform(): boolean;
    isField(): boolean;
    isPointer(): boolean;
    isVideoBuffer(): boolean;
    isSampler(): boolean;

    getSubVarDecls(): AIAFXVariableDeclInstruction[];

    isDefinedByZero(): boolean;
    defineByZero(isDefine: boolean): void;

    _setAttrExtractionBlock(pCodeBlock: AIAFXInstruction): void;
    _getAttrExtractionBlock(): AIAFXInstruction;

    _markAsVarying(bValue: boolean): void;
    _markAsShaderOutput(isShaderOutput: boolean): void;
    _isShaderOutput(): boolean;

    _getNameIndex(): uint;
    _getFullNameExpr(): AIAFXExprInstruction;
    _getFullName(): string;
    _getVideoBufferSampler(): AIAFXVariableDeclInstruction;
    _getVideoBufferHeader(): AIAFXVariableDeclInstruction;
    _getVideoBufferInitExpr(): AIAFXInitExprInstruction;

    setName(sName: string): void;
    setRealName(sName: string): void;
    setVideoBufferRealName(sSampler: string, sHeader: string): void;

    _setCollapsed(bValue: boolean): void;
    _isCollapsed(): boolean;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXVariableDeclInstruction;
    blend(pVariableDecl: AIAFXVariableDeclInstruction, eMode: AEAFXBlendMode): AIAFXVariableDeclInstruction;
}

interface AIAFXFunctionDeclInstruction extends AIAFXDeclInstruction {
    toFinalDefCode(): string;

    //getNameId(): AIAFXIdInstruction;
    hasImplementation(): boolean;
    getArguments(): AIAFXTypedInstruction[];
    getNumNeededArguments(): uint;
    getReturnType(): AIAFXVariableTypeInstruction;
    getFunctionType(): AEFunctionType;
    setFunctionType(eType: AEFunctionType): void;

    _getVertexShader(): AIAFXFunctionDeclInstruction;
    _getPixelShader(): AIAFXFunctionDeclInstruction;

    // closeArguments(pArguments: AIAFXInstruction[]): AIAFXTypedInstruction[];
    setFunctionDef(pFunctionDef: AIAFXDeclInstruction): void;
    setImplementation(pImplementation: AIAFXStmtInstruction): void;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXFunctionDeclInstruction;

    //addUsedVariableType(pType: AIAFXVariableTypeInstruction, eUsedMode: AEVarUsedMode): boolean;

    _addOutVariable(pVariable: AIAFXVariableDeclInstruction): boolean;
    _getOutVariable(): AIAFXVariableDeclInstruction;

    _markUsedAs(eUsedType: AEFunctionType): void;
    _isUsedAs(eUsedType: AEFunctionType): boolean;
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

    _addUsedFunction(pFunction: AIAFXFunctionDeclInstruction): boolean;
    _getUsedFunctionList(): AIAFXFunctionDeclInstruction[];
    _addUsedVariable(pVariable: AIAFXVariableDeclInstruction): void;

    _isBlackListFunction(): boolean;
    _addToBlackList(): void;
    _getStringDef(): string;

    _convertToVertexShader(): AIAFXFunctionDeclInstruction;
    _convertToPixelShader(): AIAFXFunctionDeclInstruction;

    _prepareForVertex(): void;
    _prepareForPixel(): void;

    _generateInfoAboutUsedData(): void;

    _getAttributeVariableMap(): AIAFXVariableDeclMap;
    _getVaryingVariableMap(): AIAFXVariableDeclMap;

    _getSharedVariableMap(): AIAFXVariableDeclMap;
    _getGlobalVariableMap(): AIAFXVariableDeclMap;
    _getUniformVariableMap(): AIAFXVariableDeclMap;
    _getForeignVariableMap(): AIAFXVariableDeclMap;
    _getTextureVariableMap(): AIAFXVariableDeclMap;
    _getUsedComplexTypeMap(): AIAFXTypeMap;

    _getAttributeVariableKeys(): uint[];
    _getVaryingVariableKeys(): uint[];

    _getSharedVariableKeys(): uint[];
    _getUniformVariableKeys(): uint[];
    _getForeignVariableKeys(): uint[];
    _getGlobalVariableKeys(): uint[];
    _getTextureVariableKeys(): uint[];
    _getUsedComplexTypeKeys(): uint[];

    _getExtSystemFunctionList(): AIAFXFunctionDeclInstruction[];
    _getExtSystemMacrosList(): AIAFXSimpleInstruction[];
    _getExtSystemTypeList(): AIAFXTypeDeclInstruction[];
}

interface AIAFXStructDeclInstruction extends AIAFXInstruction {
    //id: AIAFXIdInstruction
    //structFields: IAFXStructInstruction
}

// interface IAFXBaseTypeInstruction extends AIAFXInstruction {
//	 //id: AIAFXIdInstruction
//	 //...
// }

interface AIAFXIdInstruction extends AIAFXInstruction {
    getName(): string;
    getRealName(): string;

    setName(sName: string): void;
    setRealName(sName: string): void;

    _markAsVarying(bValue: boolean): void;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXIdInstruction;
}

interface AIAFXKeywordInstruction extends AIAFXInstruction {
    setValue(sValue: string): void;
    isValue(sTestValue: string): boolean;
}

interface AIAFXAnalyzedInstruction extends AIAFXInstruction {
    addUsedData(pUsedDataCollector: AIAFXTypeUseInfoMap, eUsedMode?: AEVarUsedMode): void;
}

interface AIAFXExprInstruction extends AIAFXTypedInstruction, AIAFXAnalyzedInstruction {
    evaluate(): boolean;
    simplify(): boolean;
    getEvalValue(): any;
    isConst(): boolean;
    getType(): AIAFXVariableTypeInstruction;

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXExprInstruction;
}

interface AIAFXInitExprInstruction extends AIAFXExprInstruction {
    optimizeForVariableType(pType: AIAFXVariableTypeInstruction): boolean;
    // getExternalValue(pType: AIAFXVariableTypeInstruction): any;
}

interface AIAFXIdExprInstruction extends AIAFXExprInstruction {
    clone(pRelationMap?: AIAFXInstructionMap): AIAFXIdExprInstruction;
}

interface AIAFXLiteralInstruction extends AIAFXExprInstruction {
    setValue(pValue: any): void;
    clone(pRelationMap?: AIAFXInstructionMap): AIAFXLiteralInstruction;
}

interface AIAFXAnnotationInstruction extends AIAFXInstruction {

}

interface AIAFXStmtInstruction extends AIAFXInstruction, AIAFXAnalyzedInstruction {
}

interface AIAFXPassInstruction extends AIAFXDeclInstruction {
    _addFoundFunction(pNode: AIParseNode, pShader: AIAFXFunctionDeclInstruction, eType: AEFunctionType): void;
    _getFoundedFunction(pNode: AIParseNode): AIAFXFunctionDeclInstruction;
    _getFoundedFunctionType(pNode: AIParseNode): AEFunctionType;
    _setParseNode(pNode: AIParseNode): void;
    _getParseNode(): AIParseNode;
    _markAsComplex(isComplex: boolean): void;
    _addCodeFragment(sCode: string): void;

    _getSharedVariableMapV(): AIAFXVariableDeclMap;
    _getGlobalVariableMapV(): AIAFXVariableDeclMap;
    _getUniformVariableMapV(): AIAFXVariableDeclMap;
    _getForeignVariableMapV(): AIAFXVariableDeclMap;
    _getTextureVariableMapV(): AIAFXVariableDeclMap;
    _getUsedComplexTypeMapV(): AIAFXTypeMap;

    _getSharedVariableMapP(): AIAFXVariableDeclMap;
    _getGlobalVariableMapP(): AIAFXVariableDeclMap;
    _getUniformVariableMapP(): AIAFXVariableDeclMap;
    _getForeignVariableMapP(): AIAFXVariableDeclMap;
    _getTextureVariableMapP(): AIAFXVariableDeclMap;
    _getUsedComplexTypeMapP(): AIAFXTypeMap;

    _getFullUniformMap(): AIAFXVariableDeclMap;
    _getFullForeignMap(): AIAFXVariableDeclMap;
    _getFullTextureMap(): AIAFXVariableDeclMap;


    getVertexShader(): AIAFXFunctionDeclInstruction;
    getPixelShader(): AIAFXFunctionDeclInstruction;

    addShader(pShader: AIAFXFunctionDeclInstruction): void;
    setState(eType: AERenderStates, eValue: AERenderStateValues): void;
    finalizePass(): void;

    isComplexPass(): boolean;
    evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean;

    getState(eType: AERenderStates): AERenderStateValues;
    _getRenderStates(): AIRenderStateMap;
}

interface AIAFXTechniqueInstruction extends AIAFXDeclInstruction {
    setName(sName: string, isComplexName: boolean): void;
    getName(): string;
    hasComplexName(): boolean;

    isPostEffect(): boolean;

    addPass(pPass: AIAFXPassInstruction): void;
    getPassList(): AIAFXPassInstruction[];
    getPass(iPass: uint): AIAFXPassInstruction;

    totalOwnPasses(): uint;
    totalPasses(): uint;

    getSharedVariablesForVertex(): AIAFXVariableDeclInstruction[];
    getSharedVariablesForPixel(): AIAFXVariableDeclInstruction[];

    addTechniqueFromSameEffect(pTechnique: AIAFXTechniqueInstruction, iShift: uint): void;
    addComponent(pComponent: AIAFXComponent, iShift: int): void;

    getFullComponentList(): AIAFXComponent[];
    getFullComponentShiftList(): int[];

    checkForCorrectImports(): boolean;

    setGlobalParams(sProvideNameSpace: string,
        pGloabalImportList: AIAFXImportedTechniqueInfo[]): void;

    finalize(pComposer: AIAFXComposer): void;
}

