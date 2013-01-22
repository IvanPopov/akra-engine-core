#ifndef IAFXINSTRUCTION_TS
#define IAFXINSTRUCTION_TS

#include "common.ts"

module akra {

    export enum EAFXInstructionTypes {
        k_Instruction = 0,
        k_VariableTypeInstruction,
        k_SystemTypeInstruction,
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
        k_ConstructorCallInstruction,
        k_CompileExprInstruction,
        k_SamplerStateBlockInstruction,
        k_SamplerStateInstruction,
        k_FunctionDeclInstruction,
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
        k_SemicolonStmtInstruction
    }

    export enum ECheckStage {
        CODE_TARGET_SUPPORT, /* Отсутсвуют конструкции не поддерживаемые языком назначения (GLSL) */ 
        SELF_CONTAINED /* Код замкнут, нет не определенных функций, пассов, техник. Нет мертвых функций. */
        // VALIDATION  /* Код не содерит синтаксиески неправильных выражений, то что не исчерпывается */ 
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

        check(eStage: ECheckStage): bool;
        getLastError(): IAFXInstructionError;

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
    }

    export interface IAFXTypeInstruction extends IAFXInstruction {
        isBase(): bool;
        isArray(): bool;
        isEqual(pType: IAFXTypeInstruction): bool;

        hasField(sFieldName: string): bool;
        getField(sFieldName: string, isCreateExpr: bool): IAFXIdExprInstruction;
        getFieldType(sFieldName: string): IAFXTypeInstruction;

        getSize(): uint;

        getLength(): uint;
        getArrayElementType(): IAFXTypeInstruction;
    }

    export interface IAFXVariableTypeInstruction extends IAFXTypeInstruction {
        //type : IAFXUsageTypeInstruction
        //array: IAFXArrayInstruction
        //pointer : IAFXPointerInstruction
        addArrayIndex(pExpr: IAFXExprInstruction): void;

        isPointer(): bool;

        addPointIndex(): void;
        getPointerType(): IAFXVariableTypeInstruction;
        setVideoBuffer(pBuffer: IAFXIdInstruction): void;
    }

    export interface IAFXTypedInstruction extends IAFXInstruction {
        getType(): IAFXVariableTypeInstruction;
        setType(pType: IAFXVariableTypeInstruction): void;
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

    }

    export interface IAFXFunctionDeclInstruction extends IAFXDeclInstruction {
        //getNameId(): IAFXIdInstruction;
        hasImplementation(): bool;
        getHash(): string;
    }

    export interface IAFXUsageTypeInstruction extends IAFXInstruction {
        //usage: IAFXKeywordInstruction[]
        //type: IAFXTypeInstruction
    }

    export interface IAFXStructDeclInstruction extends IAFXInstruction {
        //id: IAFXIdInstruction
        //structFields: IAFXStructInstruction
    }

    export interface IAFXBaseTypeInstruction extends IAFXInstruction {
        //id: IAFXIdInstruction
        //...
    }

    export interface IAFXIdInstruction extends IAFXInstruction {
        getName(): string;
        getRealName(): string;

        setName(sName: string): void;
        setRealName(sName: string): void;
    }

    export interface IAFXKeywordInstruction extends IAFXInstruction {
        setValue(sValue: string): void;
    }


    export interface IAFXExprInstruction extends IAFXTypedInstruction {

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

}

#endif