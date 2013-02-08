#ifndef IAFXINSTRUCTION_TS
#define IAFXINSTRUCTION_TS

#include "common.ts"
#include "IParser.ts"

module akra {

    export enum EAFXInstructionTypes {
        k_Instruction = 0,
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
        k_SamplerStateBlockInstruction,
        k_SamplerStateInstruction,
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
        k_SemicolonStmtInstruction,
        k_TechniqueInstruction
    }

    export enum EFunctionType{
        k_Vertex,
        k_Pixel,
        k_Fragment = k_Pixel,
        k_Function
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

    export interface InstructionMap {
        [index: uint]: IAFXInstruction;
    }

	/**
	 * All opertion are represented by: 
	 * operator : arg1 ... argn
	 * Operator and instructions may be empty.
	 */
	export interface IAFXInstruction {
        setParent(pParent: IAFXInstruction): void;
        getParent(): IAFXInstruction;

        setOperator(sOperator: string): void;
        getOperator(): string;

        setInstructions(pInstructionList: IAFXInstruction[]): void;
        getInstructions(): IAFXInstruction[];

        getInstructionType(): EAFXInstructionTypes;
        getInstructionID(): uint;

        check(eStage: ECheckStage): bool;
        getLastError(): IAFXInstructionError;
        setError(eCode: uint, pInfo: any): void;

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
    	toString(): string;
        clone(pRelationMap?: InstructionMap): IAFXInstruction;
    }

    export interface IAFXSimpleInstruction extends IAFXInstruction {
        setValue(sValue: string): void;
        isValue(sValue: string): bool;
    }

    export interface IAFXTypeInstruction extends IAFXInstruction {
        isBase(): bool;
        isArray(): bool;
        isComplex(): bool;
        isWritable(): bool;
        isReadable(): bool;

        _canWrite(isWritable: bool): void;
        _canRead(isReadable: bool): void;
        /**
         * For using in AFXEffect
         */
        isEqual(pType: IAFXTypeInstruction): bool;
        isConst(): bool;

        getHash(): string;
        getStrongHash(): string ;

        hasField(sFieldName: string): bool;
        getField(sFieldName: string, isCreateExpr?: bool): IAFXIdExprInstruction;
        getFieldType(sFieldName: string): IAFXTypeInstruction;
        getFieldNameList(): string[];

        getSize(): uint;

        getLength(): uint;
        getArrayElementType(): IAFXTypeInstruction;
    }

    export interface IAFXVariableTypeInstruction extends IAFXTypeInstruction {
        //type : IAFXUsageTypeInstruction
        //array: IAFXArrayInstruction
        //pointer : IAFXPointerInstruction
        pushInVariableType(pVariableType: IAFXTypeInstruction): bool;
        isolateType(): IAFXVariableTypeInstruction;
        
        addArrayIndex(pExpr: IAFXExprInstruction): void;

        hasUsage(sUsageName: string): bool;

        isPointer(): bool;
        isPointIndex(): bool;

        addPointIndex(): void;
        getPointDim(): uint;
        getPointer(): IAFXVariableDeclInstruction;
        setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void;
        getVideoBuffer():IAFXVariableDeclInstruction;
        hasVideoBuffer(): bool;
        initializePointers(): void;


        wrap(): IAFXVariableTypeInstruction;

        _setNextPointer(pPointer: IAFXVariableDeclInstruction): void;
    }

     export interface IAFXUsageTypeInstruction extends IAFXInstruction {
        //usage: IAFXKeywordInstruction[]
        //type: IAFXTypeInstruction
        
        getTypeInstruction(): IAFXTypeInstruction;
        setTypeInstruction(pType: IAFXTypeInstruction): bool;

        hasUsage(sUsage: string): bool;
        addUsage(sUsage: string): bool;

    }

    export interface IAFXTypedInstruction extends IAFXInstruction{
        getType(): IAFXTypeInstruction;
        setType(pType: IAFXTypeInstruction): void;
    }

    export interface IAFXDeclInstruction extends IAFXTypedInstruction {
        setSemantic(sSemantic: string);
        setAnnotation(pAnnotation: IAFXAnnotationInstruction): void;
        getName(): string;
        getNameId(): IAFXIdInstruction;
    }

    export interface IAFXTypeDeclInstruction extends IAFXDeclInstruction {
    
    }

    export interface IAFXVariableDeclInstruction extends IAFXDeclInstruction {
        hasInitializer(): bool;
        getInitializeExpr(): IAFXExprInstruction;

        getType(): IAFXVariableTypeInstruction;
        setType(pType: IAFXVariableTypeInstruction): void;

        setName(sName: string):void;
    }

    export interface IAFXFunctionDeclInstruction extends IAFXDeclInstruction {
        //getNameId(): IAFXIdInstruction;
        hasImplementation(): bool;
        getArguments(): IAFXTypedInstruction[];
        getNumNeededArguments(): uint;
        getReturnType(): IAFXTypeInstruction;

        // closeArguments(pArguments: IAFXInstruction[]): IAFXTypedInstruction[];
        setFunctionDef(pFunctionDef: IAFXDeclInstruction): void;
        setImplementation(pImplementation: IAFXStmtInstruction): void;
        _usedAsShader(eUsedType: EFunctionType): void;
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
    }

    export interface IAFXKeywordInstruction extends IAFXInstruction {
        setValue(sValue: string): void;
        isValue(sTestValue: string): bool;
    }


    export interface IAFXExprInstruction extends IAFXTypedInstruction {
        evaluate(): bool;
        simplify(): bool;
        getEvalValue(): any;
        isConst(): bool;
    }

    export interface IAFXIdExprInstruction extends IAFXExprInstruction {

    }

    export interface IAFXLiteralInstruction extends IAFXExprInstruction {
        setValue(pValue: any): void;
    }

    export interface IAFXAnnotationInstruction extends IAFXInstruction{

    }

    export interface IAFXStmtInstruction extends IAFXInstruction{
        
    }

    export interface IAFXTechniqueInstruction extends IAFXDeclInstruction{
        addPass(): void;

        setName(sName: string, isComplexName: bool): void;
        getName(): string;
        hasComplexName(): bool;

        getSharedVariables(): IAFXVariableDeclInstruction[];

        _setParseNode(pNode: IParseNode): void;
        _getParseNode(): IParseNode;
    }

}

#endif