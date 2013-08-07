#ifndef IAFXINSTRUCTION_TS
#define IAFXINSTRUCTION_TS

#include "common.ts"
#include "IParser.ts"
#include "IAFXComponent.ts"
#include "IUnique.ts"
#include "IRenderer.ts"

#define EPassState ERenderStates
#define EPassStateValue ERenderStateValues
#define IPassStateMap IRenderStateMap

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


    export enum EFunctionType{
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
	
    export interface IAFXInstructionStateMap extends StringMap{
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
        [index: string] : IAFXTypeInstruction[];
        [index: uint] : IAFXTypeInstruction[];
    }

    export interface IAFXTypeDeclMap {
        [index: string] : IAFXTypeDeclInstruction;
        [index: uint] : IAFXTypeDeclInstruction;
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
        isRead: bool;
        isWrite: bool;
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

	/**
	 * All opertion are represented by: 
	 * operator : arg1 ... argn
	 * Operator and instructions may be empty.
	 */
	export interface IAFXInstruction extends IUnique {
        setParent(pParent: IAFXInstruction): void;
        getParent(): IAFXInstruction;

        setOperator(sOperator: string): void;
        getOperator(): string;

        setInstructions(pInstructionList: IAFXInstruction[]): void;
        getInstructions(): IAFXInstruction[];

        _getInstructionType(): EAFXInstructionTypes;
        _getInstructionID(): uint;
        _getScope(): uint;
        _setScope(iScope: uint): void;
        _isInGlobalScope(): bool;

        check(eStage: ECheckStage): bool;
        getLastError(): IAFXInstructionError;
        setError(eCode: uint, pInfo?: any): void;
        clearError(): void;
        isErrorOccured(): bool;

        setVisible(isVisible: bool): void;
        isVisible(): bool;

        initEmptyInstructions(): void;

    	// /**
    	//  * Contain states of instruction
    	//  */
    	// stateMap: IAFXInstructionStateMap;

    	push(pInstruction: IAFXInstruction, isSetParent?: bool): void;

    	// changeState(sStateName: string, sValue: string): void;
    	// changeState(iStateIndex: int, sValue: string): void;

    	// stateChange(): void;
    	// isStateChange(): bool;

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint);
        prepareFor(eUsedType: EFunctionType): void;

    	toString(): string;
        toFinalCode(): string;

        clone(pRelationMap?: IAFXInstructionMap): IAFXInstruction;
    }

    export interface IAFXSimpleInstruction extends IAFXInstruction {
        setValue(sValue: string): void;
        isValue(sValue: string): bool;
    }

    export interface IAFXTypeInstruction extends IAFXInstruction {
        _toDeclString(): string;

        isBuiltIn(): bool;
        setBuiltIn(isBuiltIn: bool): void;

        /**
         * Simple tests
         */
        isBase(): bool;
        isArray(): bool;
        isNotBaseArray(): bool;
        isComplex(): bool;
        isEqual(pType: IAFXTypeInstruction): bool;
        isStrongEqual(pType: IAFXTypeInstruction): bool;
        isConst(): bool;

        isSampler(): bool;
        isSamplerCube(): bool;
        isSampler2D(): bool;

        isWritable(): bool;
        isReadable(): bool;

        _containArray(): bool;
        _containSampler(): bool;
        _containPointer(): bool;
        _containComplexType(): bool;
        /**
         * Set private params
         */
        setName(sName: string): void;
        _canWrite(isWritable: bool): void;
        _canRead(isReadable: bool): void;

        // markAsUsed(): void;
        
        /**
         * get type info
         */
        getName(): string;
        getRealName(): string;
        getHash(): string;
        getStrongHash(): string;
        getSize(): uint;
        getBaseType(): IAFXTypeInstruction;
        getLength(): uint;
        getArrayElementType(): IAFXTypeInstruction;
        getTypeDecl(): IAFXTypeDeclInstruction;

        // Fields

        hasField(sFieldName: string): bool;
        hasFieldWithSematic(sSemantic: string);
        hasAllUniqueSemantics(): bool;
        hasFieldWithoutSemantic(): bool;
        
        getField(sFieldName: string): IAFXVariableDeclInstruction;
        getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
        getFieldType(sFieldName: string): IAFXVariableTypeInstruction;
        getFieldNameList(): string[];

        /**
         * System
         */
        clone(pRelationMap?: IAFXInstructionMap): IAFXTypeInstruction;
        blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction;
    }

    export interface IAFXVariableTypeInstruction extends IAFXTypeInstruction {       
        _setCollapsed(bValue: bool): void;
        _isCollapsed(): bool;
        
        /**
         * Simple tests
         */
        isPointer(): bool;
        isStrictPointer(): bool;
        isPointIndex(): bool;

        isFromVariableDecl(): bool;
        isFromTypeDecl(): bool;

        isUniform(): bool;
        isGlobal(): bool;
        isConst(): bool;
        isShared(): bool;
        isForeign(): bool;

        _isTypeOfField(): bool;
        _isUnverifiable(): bool;

        // /**
        //  * set type info
        //  */
        // _markUsedForWrite(): bool;
        // _markUsedForRead(): bool;
        // _goodForRead(): bool;

        // _markAsField(): void;

        /**
         * init api
         */
        setPadding(iPadding: uint): void;
        pushType(pType: IAFXTypeInstruction): void;
        addUsage(sUsage: string): void;
        addArrayIndex(pExpr: IAFXExprInstruction): void;
        addPointIndex(isStrict?:bool): void;
        setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void;
        initializePointers(): void;

        _setPointerToStrict(): void;
        _addPointIndexInDepth(): void;
        _setVideoBufferInDepth(): void;
        _markAsUnverifiable(isUnverifiable: bool): void;
        _addAttrOffset(pOffset: IAFXVariableDeclInstruction): void;

        /**
         * Type info
         */
        getPadding(): uint;
        getArrayElementType(): IAFXVariableTypeInstruction;

        getUsageList(): string[];
        getSubType(): IAFXTypeInstruction;

        hasUsage(sUsageName: string): bool;
        hasVideoBuffer(): bool;

        getPointDim(): uint;
        getPointer(): IAFXVariableDeclInstruction;
        getVideoBuffer():IAFXVariableDeclInstruction;
        getFieldExpr(sFieldName: string): IAFXIdExprInstruction;
        getFieldIfExist(sFieldName: string): IAFXVariableDeclInstruction;

        getSubVarDecls(): IAFXVariableDeclInstruction[];

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
        wrap(): IAFXVariableTypeInstruction;
        clone(pRelationMap?: IAFXInstructionMap): IAFXVariableTypeInstruction;
        blend(pVariableType: IAFXVariableTypeInstruction, eMode: EAFXBlendMode): IAFXVariableTypeInstruction;

        _setCloneHash(sHash: string, sStrongHash: string): void;
        _setCloneArrayIndex(pElementType: IAFXVariableTypeInstruction, 
                            pIndexExpr: IAFXExprInstruction, iLength: uint): void;
        _setClonePointeIndexes(nDim: uint, pPointerList: IAFXVariableDeclInstruction[]): void;
        _setCloneFields(pFieldMap: IAFXVariableDeclMap): void;      

        _setUpDownPointers(pUpPointer: IAFXVariableDeclInstruction,
                           pDownPointer: IAFXVariableDeclInstruction): void; 
    }

    export interface IAFXTypedInstruction extends IAFXInstruction{
        getType(): IAFXTypeInstruction;
        setType(pType: IAFXTypeInstruction): void;

        clone(pRelationMap?: IAFXInstructionMap): IAFXTypedInstruction;
    }

    export interface IAFXDeclInstruction extends IAFXTypedInstruction {
        setSemantic(sSemantic: string);
        setAnnotation(pAnnotation: IAFXAnnotationInstruction): void;
        getName(): string;
        getRealName(): string;
        getNameId(): IAFXIdInstruction;
        getSemantic(): string;

        isBuiltIn(): bool;
        setBuiltIn(isBuiltIn: bool): void;

        _isForAll(): bool;
        _isForPixel(): bool;
        _isForVertex(): bool;

        _setForAll(canUse: bool): void;
        _setForPixel(canUse: bool): void;
        _setForVertex(canUse: bool): void;

        clone(pRelationMap?: IAFXInstructionMap): IAFXDeclInstruction;
    }

    export interface IAFXTypeDeclInstruction extends IAFXDeclInstruction {
        clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction;
        blend(pDecl: IAFXTypeDeclInstruction, eBlendMode: EAFXBlendMode): IAFXTypeDeclInstruction;
    }

    export interface IAFXVariableDeclInstruction extends IAFXDeclInstruction {
        hasInitializer(): bool;
        getInitializeExpr(): IAFXInitExprInstruction;
        hasConstantInitializer(): bool;
        
        lockInitializer(): void;
        unlockInitializer(): void;
        
        getDefaultValue(): any;
        prepareDefaultValue(): void;
        
        getValue(): any;
        setValue(pValue: any): any;

        getType(): IAFXVariableTypeInstruction;
        setType(pType: IAFXVariableTypeInstruction): void;

        isUniform(): bool;
        isField(): bool;
        isPointer(): bool;
        isVideoBuffer(): bool;
        isSampler(): bool;
        
        getSubVarDecls(): IAFXVariableDeclInstruction[];

        isDefinedByZero(): bool;
        defineByZero(isDefine: bool): void;

        _setAttrExtractionBlock(pCodeBlock: IAFXInstruction): void;
        _getAttrExtractionBlock(): IAFXInstruction;

        _markAsVarying(bValue: bool): void;
        _markAsShaderOutput(isShaderOutput: bool): void;
        _isShaderOutput(): bool;

        _getNameIndex(): uint;
        _getFullNameExpr(): IAFXExprInstruction;
        _getFullName(): string;
        _getVideoBufferSampler(): IAFXVariableDeclInstruction;
        _getVideoBufferHeader(): IAFXVariableDeclInstruction;
        _getVideoBufferInitExpr(): IAFXInitExprInstruction;

        setName(sName: string): void;
        setRealName(sName: string): void;
        setVideoBufferRealName(sSampler: string, sHeader: string): void;

        _setCollapsed(bValue: bool): void;
        _isCollapsed(): bool;

        clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction;
        blend(pVariableDecl: IAFXVariableDeclInstruction, eMode: EAFXBlendMode): IAFXVariableDeclInstruction;
    }

    export interface IAFXFunctionDeclInstruction extends IAFXDeclInstruction {
        toFinalDefCode(): string;

        //getNameId(): IAFXIdInstruction;
        hasImplementation(): bool;
        getArguments(): IAFXTypedInstruction[];
        getNumNeededArguments(): uint;
        getReturnType(): IAFXVariableTypeInstruction;
        getFunctionType(): EFunctionType;
        setFunctionType(eType: EFunctionType): void;

        _getVertexShader(): IAFXFunctionDeclInstruction;
        _getPixelShader(): IAFXFunctionDeclInstruction;

        // closeArguments(pArguments: IAFXInstruction[]): IAFXTypedInstruction[];
        setFunctionDef(pFunctionDef: IAFXDeclInstruction): void;
        setImplementation(pImplementation: IAFXStmtInstruction): void;

        clone(pRelationMap?: IAFXInstructionMap): IAFXFunctionDeclInstruction;

        //addUsedVariableType(pType: IAFXVariableTypeInstruction, eUsedMode: EVarUsedMode): bool;
        
        _addOutVariable(pVariable: IAFXVariableDeclInstruction): bool;
        _getOutVariable(): IAFXVariableDeclInstruction;

        _markUsedAs(eUsedType: EFunctionType): void;
        _isUsedAs(eUsedType: EFunctionType): bool;
        _isUsedAsFunction(): bool;
        _isUsedAsVertex(): bool;
        _isUsedAsPixel(): bool;
        _isUsed(): bool;
        _markUsedInVertex(): void;
        _markUsedInPixel(): void;
        _isUsedInVertex(): bool;
        _isUsedInPixel(): bool;
        _checkVertexUsage(): bool;
        _checkPixelUsage(): bool;

        _checkDefenitionForVertexUsage(): bool;
        _checkDefenitionForPixelUsage(): bool;

        _canUsedAsFunction(): bool;
        _notCanUsedAsFunction(): void;

        _addUsedFunction(pFunction: IAFXFunctionDeclInstruction): bool;
        _getUsedFunctionList(): IAFXFunctionDeclInstruction[];
        _addUsedVariable(pVariable: IAFXVariableDeclInstruction): void;
        
        _isBlackListFunction(): bool;
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
    //     //id: IAFXIdInstruction
    //     //...
    // }

    export interface IAFXIdInstruction extends IAFXInstruction {
        getName(): string;
        getRealName(): string;

        setName(sName: string): void;
        setRealName(sName: string): void;

        _markAsVarying(bValue: bool): void;

        clone(pRelationMap?: IAFXInstructionMap): IAFXIdInstruction;
    }

    export interface IAFXKeywordInstruction extends IAFXInstruction {
        setValue(sValue: string): void;
        isValue(sTestValue: string): bool;
    }

    export interface IAFXAnalyzedInstruction extends IAFXInstruction {
        addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }

    export interface IAFXExprInstruction extends IAFXTypedInstruction, IAFXAnalyzedInstruction {
        evaluate(): bool;
        simplify(): bool;
        getEvalValue(): any;
        isConst(): bool;
        getType(): IAFXVariableTypeInstruction;
        
        clone(pRelationMap?: IAFXInstructionMap): IAFXExprInstruction;
    }

    export interface IAFXInitExprInstruction extends IAFXExprInstruction {
        optimizeForVariableType(pType: IAFXVariableTypeInstruction): bool;
        // getExternalValue(pType: IAFXVariableTypeInstruction): any;
    }

    export interface IAFXIdExprInstruction extends IAFXExprInstruction {
        clone(pRelationMap?: IAFXInstructionMap): IAFXIdExprInstruction;
    }

    export interface IAFXLiteralInstruction extends IAFXExprInstruction {
        setValue(pValue: any): void;
        clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
    }

    export interface IAFXAnnotationInstruction extends IAFXInstruction{

    }

    export interface IAFXStmtInstruction extends IAFXInstruction, IAFXAnalyzedInstruction{ 
    }

    export interface IAFXPassInstruction extends IAFXDeclInstruction {
        _addFoundFunction(pNode: IParseNode, pShader: IAFXFunctionDeclInstruction, eType: EFunctionType): void;
        _getFoundedFunction(pNode: IParseNode): IAFXFunctionDeclInstruction;
        _getFoundedFunctionType(pNode: IParseNode): EFunctionType;
        _setParseNode(pNode: IParseNode): void;
        _getParseNode(): IParseNode;
        _markAsComplex(isComplex: bool): void;
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


        getVertexShader(): IAFXFunctionDeclInstruction;
        getPixelShader(): IAFXFunctionDeclInstruction;

        addShader(pShader: IAFXFunctionDeclInstruction): void;
        setState(eType: EPassState, eValue: EPassStateValue): void;
        finalizePass(): void;

        isComplexPass(): bool;
        evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): bool;

        getState(eType: EPassState): EPassStateValue;
    }

    export interface IAFXTechniqueInstruction extends IAFXDeclInstruction{
        setName(sName: string, isComplexName: bool): void;
        getName(): string;
        hasComplexName(): bool;

        addPass(pPass: IAFXPassInstruction): void;
        getPassList(): IAFXPassInstruction[];
        getPass(iPass: uint): IAFXPassInstruction;

        totalOwnPasses(): uint;
        totalPasses(): uint;

        getSharedVariablesForVertex(): IAFXVariableDeclInstruction[];
        getSharedVariablesForPixel(): IAFXVariableDeclInstruction[];

        addComponent(pComponent: IAFXComponent, iShift: int): void;
        
        getComponentList(): IAFXComponent[];
        getComponentListShift(): int[];

        getFullComponentList(): IAFXComponent[];
        getFullComponentShiftList(): int[];

        checkForCorrectImports(): bool;
        finalizeTechnique(sProvideNameSpace: string, 
                          pGloabalComponentList: IAFXComponent[],
                          pGloabalComponentShiftList: int[]): void;
    }

}

#endif