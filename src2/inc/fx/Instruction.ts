#ifndef AFXINSTRUCTION_TS
#define AFXINSTRUCTION_TS

#include "IAFXInstruction.ts"

module akra.fx {
    export interface IdExprMap {
        [index: string]: IAFXIdExprInstruction;
    }

    export interface VariableTypeMap {
    	[index: string]: IAFXVariableTypeInstruction;
    }

    export interface TypeMap {
    	[index: string]: IAFXTypeInstruction;
    }


	export class Instruction implements IAFXInstruction{
		protected _pParentInstruction: IAFXInstruction = null;
		protected _sOperatorName: string = null;
		protected _pInstructionList: IAFXInstruction[] = null;
		protected _nInstuctions: uint = 0;
		protected readonly _eInstructionType: EAFXInstructionTypes = 0;
		protected _pLastError: IAFXInstructionError = null;

		inline getParent(): IAFXInstruction{
			return this._pParentInstruction;
		}

		inline setParent(pParentInstruction: IAFXInstruction): void {
			this._pParentInstruction = pParentInstruction;
		}

		inline getOperator(): string {
			return this._sOperatorName;
		}

		inline setOperator(sOperator: string): void {
			this._sOperatorName = sOperator;
		}

		inline getInstructions(): IAFXInstruction[] {
			return this._pInstructionList;
		}

		inline setInstructions(pInstructionList: IAFXInstruction[]): void{
			this._pInstructionList = pInstructionList;
		}

		inline getInstructionType(): EAFXInstructionTypes {
			return this._eInstructionType;
		}

		inline getLastError(): IAFXInstructionError {
			return this._pLastError;
		}

		constructor(){
			this._pParentInstruction = null;
			this._sOperatorName = null;
			this._pInstructionList = null;
			this._nInstuctions = 0;
			this._eInstructionType = EAFXInstructionTypes.k_Instruction;
			this._pLastError = {code: 0, info: null};
		}

		push(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
			if(!isNull(this._pInstructionList)){
				this._pInstructionList[this._nInstuctions] = pInstruction;
				this._nInstuctions += 1;
			}
			if(isSetParent &&  !isNull(pInstruction)){
				pInstruction.setParent(this);
			}
		}

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint): void {
    		//TODO
    	}

    	/**
    	 * Проверка валидности инструкции
    	 */
    	check(eStage: ECheckStage, pInfo: any = null): bool {
    		return true;
    	}

    	/**
    	 * Подготовка интсрукции к дальнейшему анализу
    	 */
    	prepare(): bool {
    		return true;
    	}

    	toString(): string {
    		return null;
    	}
	}

	export class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
		// EMPTY_OPERATOR TypeInstruction ArrayInstruction PointerInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_VariableTypeInstruction;
		}	 

		addArrayIndex(pExpr: IAFXExprInstruction): void {

		}

		addPointIndex(): void {

		}

		setVideoBuffer(pBuffer: IAFXIdInstruction): void {
			
		}

		isEqual(pType: IAFXTypeInstruction): bool {
			return false;
		}

		isBase(): bool {
			return false;
		}

		isArray(): bool {
			return false;
		}

		isPointer(): bool {
			return false;
		}

		hasField(sFieldName: string): bool {
			return false;
		}

		getField(sFieldName: string, isCreateExpr: bool): IAFXIdExprInstruction {
			return null;
		}

		getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
			return null;
		}

		getPointerType(): IAFXVariableTypeInstruction {
			return null;
		}

		getSize(): uint {
			return 1;
		}

		getLength(): uint {
			return 0;
		}

		getArrayElementType(): IAFXVariableTypeInstruction {
			return null;
		}
	}

	export class SystemTypeInstruction extends Instruction implements IAFXTypeInstruction {
		private _sName: string = "";
		private _sRealName: string = "";
		private _pElementType: IAFXVariableTypeInstruction = null;
		private _iLength: uint = 1;
		private _iSize: uint = null;
		private _pFieldMap: IdExprMap = null;
		private _isArray: bool = false;

		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_SystemTypeInstruction;
			this._pFieldMap = {};
		}

		inline setName(sName: string): void {
			this._sName = sName;
		}

		inline setRealName(sRealName: string): void {
			this._sRealName = sRealName;
		}

		inline setSize(iSize: uint): void {
			this._iSize = iSize;
		}

		addIndex(pType: IAFXVariableTypeInstruction, iLength: uint): void {
			this._pElementType = pType;
			this._iLength = iLength;
			this._iSize = iLength * pType.getSize();
			this._isArray = true;
		}

		addField(sFieldName: string, pType: IAFXVariableTypeInstruction,
				 sRealFieldName?: string = sFieldName): void {
			
			var pFieldId: IAFXIdInstruction = new IdInstruction();
			pFieldId.setName(sFieldName);
			pFieldId.setRealName(sRealFieldName);	

			var pFieldIdExpr: IAFXIdExprInstruction = new IdExprInstruction();
			pFieldIdExpr.push(pFieldId, true);
			pFieldIdExpr.setType(pType);
			pFieldIdExpr.setParent(this);

			this._pFieldMap[sFieldName] = pFieldIdExpr;
		}

		inline isBase(): bool {
			return true;
		}

		inline isArray(): bool {
			return this._isArray;
		}

		isEqual(pType: IAFXTypeInstruction): bool {
			return false;
		}

		//inline getNameId()
		inline hasField(sFieldName: string): bool {
			return isDef(this._pFieldMap[sFieldName]);
		}

		inline getField(sFieldName: string): IAFXIdExprInstruction {
			return isDef(this._pFieldMap[sFieldName]) ? this._pFieldMap[sFieldName] : null;
		}

		inline getFieldType(sFieldName: string): IAFXTypeInstruction {
			return isDef(this._pFieldMap[sFieldName]) ? this._pFieldMap[sFieldName].getType() : null;
		}

		inline getSize(): uint {
			return this._iSize;
		}

		inline getArrayElementType(): IAFXVariableTypeInstruction {
			return this._pElementType;
		}

		inline getLength(): uint {
			return this._iLength;
		}
	}

	export class TypedInstruction extends Instruction implements IAFXTypedInstruction {
		protected _pType: IAFXVariableTypeInstruction;

		constructor(){
			super();
			this._pType = null;
			this._eInstructionType = EAFXInstructionTypes.k_TypedInstruction;
		}

		getType(): IAFXVariableTypeInstruction {
			return this._pType;
		}

		setType(pType: IAFXVariableTypeInstruction): void {
			this._pType = pType;
		}
	}

	export class DeclInstruction extends TypedInstruction implements IAFXDeclInstruction {
		protected _sSemantic: string;
		protected _pAnnotation: IAFXAnnotationInstruction;

		constructor(){
			super();
			this._sSemantic = "";
			this._eInstructionType = EAFXInstructionTypes.k_DeclInstruction;
		}

		setSemantic(sSemantic: string): void {
			this._sSemantic = sSemantic;
		}

		setAnnotation(pAnnotation: IAFXAnnotationInstruction): void {
			this._pAnnotation = pAnnotation;
		}

		getName(): string {
			return "";
		}

		getNameId(): IAFXIdInstruction {
			return null;
		}
	}

	export class IntInstruction extends TypedInstruction implements IAFXLiteralInstruction {
		private _iValue: int;
		static private _pIntType: IAFXVariableTypeInstruction = null;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._iValue = 0;
			this._pType = IntInstruction._pIntType;
			this._eInstructionType = EAFXInstructionTypes.k_IntInstruction;
		}

		inline setValue(iValue: int): void{
			this._iValue = iValue;
		}

		toString(): string {
			return <string><any>this._iValue;
		}
	}

	export class FloatInstruction extends TypedInstruction implements IAFXLiteralInstruction {
		private _fValue: float;
		static private _pFloatType: IAFXVariableTypeInstruction = null;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._fValue = 0.0;
			this._pType = FloatInstruction._pFloatType;
			this._eInstructionType = EAFXInstructionTypes.k_FloatInstruction;
		}

		inline setValue(fValue: float): void{
			this._fValue = fValue;
		}

		toString(): string {
			return <string><any>this._fValue;
		}
	}

	export class BoolInstruction extends TypedInstruction implements IAFXLiteralInstruction {
		private _bValue: bool;
		static private _pBoolType: IAFXVariableTypeInstruction = null;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._bValue = true;
			this._pType = BoolInstruction._pBoolType;
			this._eInstructionType = EAFXInstructionTypes.k_BoolInstruction;
		}

		inline setValue(bValue: bool): void{
			this._bValue = bValue;
		}

		toString(): string {
			return <string><any>this._bValue;
		}
	}

	export class StringInstruction extends TypedInstruction implements IAFXLiteralInstruction {
		private _sValue: string;
		static private _pStringType: IAFXVariableTypeInstruction = null;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
			this._pType = StringInstruction._pStringType;
			this._eInstructionType = EAFXInstructionTypes.k_StringInstruction;
		}

		inline setValue(sValue: string): void{
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
		}
	}

	export class IdInstruction extends Instruction implements IAFXIdInstruction {
		private _sName: string;
		private _sRealName: string;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sName = "";
			this._sRealName = "";
			this._eInstructionType = EAFXInstructionTypes.k_IdInstruction;
		}

		inline getName(): string{
			return this._sName;
		}

		inline getRealName(): string{
			return this._sRealName;
		}

		inline setName(sName: string): void{
			this._sName = sName;
		}

		inline setRealName(sRealName: string): void{
			this._sRealName = sRealName;
		}

		toString(): string {
			return this._sRealName;
		}

	}

	export class KeywordInstruction extends Instruction implements IAFXKeywordInstruction {
		private _sValue: string;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
			this._eInstructionType = EAFXInstructionTypes.k_KeywordInstruction;
		}

		inline setValue(sValue: string): void {
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
		}
	}

	export class TypeDeclInstruction extends DeclInstruction implements IAFXTypeDeclInstruction {
		// EMPTY_OPERATOR VariableTypeInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_TypeDeclInstruction;
		}	 
	}

	export class VariableDeclInstruction extends DeclInstruction implements IAFXVariableDeclInstruction {
		/**
		 * Represent type var_name [= init_expr]
		 * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
		 */
		constructor(){
			super();
			this._eInstructionType = EAFXInstructionTypes.k_VariableDeclInstruction;
		}
	}

	export class AnnotationInstruction extends Instruction implements IAFXAnnotationInstruction {
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_AnnotationInstruction;
		}
	}

	export class UsageTypeInstruction extends Instruction implements IAFXUsageTypeInstruction {
		// EMPTY_OPERATOR KeywordInstruction ... KeywordInstruction IAFXTypeInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_UsageTypeInstruction;
		}	 
	}

	export class BaseTypeInstruction extends Instruction implements IAFXBaseTypeInstruction {
		// EMPTY_OPERATOR IdInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_BaseTypeInstruction;
		}	 
	}

	export class StructDeclInstruction extends Instruction implements IAFXStructDeclInstruction {
		// EMPTY_OPERATOR IdInstruction StructFieldsInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_StructDeclInstruction;
		}	 
	}

	export class StructFieldsInstruction extends Instruction {
		// EMPTY_OPERATOR VariableDeclInstruction ... VariableDeclInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_StructFieldsInstruction;
		}	 
	}


	export class ExprInstruction extends TypedInstruction implements IAFXExprInstruction {
		/**
		 * Respresent all kind of instruction
		 */
		constructor(){
			super();
			this._eInstructionType = EAFXInstructionTypes.k_ExprInstruction;
		}
	}

	export class IdExprInstruction extends ExprInstruction implements IAFXIdExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_IdExprInstruction;
		}

		getType(): IAFXVariableTypeInstruction {
			if(!isNull(this._pType)){
				return this._pType;
			}
			else{
				var pVar: IdInstruction = <IdInstruction>this._pInstructionList[0];
				this._pType = (<IAFXVariableDeclInstruction>pVar.getParent()).getType();
				return this._pType;
			}
		}
	}

	/**
 	 * Represent someExpr + / - * % someExpr
 	 * (+|-|*|/|%) Instruction Instruction
 	 */
	export class ArithmeticExprInstruction extends ExprInstruction {
		
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_ArithmeticExprInstruction;
		}
	}
	/**
 	 * Represent someExpr = += -= /= *= %= someExpr
 	 * (=|+=|-=|*=|/=|%=) Instruction Instruction
 	 */
	export class AssignmentExprInstruction extends ExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_AssignmentExprInstruction;
		}
	}
	/**
 	 * Represent someExpr == != < > <= >= someExpr
 	 * (==|!=|<|>|<=|>=) Instruction Instruction
 	 */
	export class RelationalExprInstruction extends ExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_RelationalExprInstruction;
		}
	}
	/**
 	 * Represent boolExpr && || boolExpr
 	 * (&& | ||) Instruction Instruction
 	 */
	export class LogicalExprInstruction extends ExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_LogicalExprInstruction;
		}
	}
	/**
	 * Represen boolExpr ? someExpr : someExpr
	 * EMPTY_OPERATOR Instruction Instruction Instruction 
	 */
	export class ConditionalExprInstruction extends ExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null, null, null];
			this._eInstructionType = EAFXInstructionTypes.k_ConditionalExprInstruction;
		}
	}
	/**
	 * Represent (type) expr
	 * EMPTY_OPERATOR VariableTypeInstruction Instruction
	 */
	export class CastExprInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_CastExprInstruction;
		}	
	}

	/**
	 * Represent + - ! ++ -- expr
	 * (+|-|!|++|--|) Instruction
	 */
	export class UnaryExprInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_UnaryExprInstruction;
		}	
	}

	/**
	 * Represent someExpr[someIndex]
	 * EMPTY_OPERATOR Instruction ExprInstruction
	 */
	export class PostfixIndexInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixIndexInstruction;
		}	
	}

	/*
	 * Represent someExpr.id
	 * EMPTY_OPERATOR Instruction IdInstruction
	 */
	export class PostfixPointInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixPointInstruction;
		}	
	}

	/**
	 * Represent someExpr ++
	 * (-- | ++) Instruction
	 */	
	export class PostfixArithmeticInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixArithmeticInstruction;
		}	
	}

	/**
	 * Represent @ Expr
	 * @ Instruction
	 */
	export class PrimaryExprInstruction extends ExprInstruction {
		constructor() { 
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_PrimaryExprInstruction;
		}
	}

	/**
	 * Represent (expr)
	 * EMPTY_OPERATOR ExprInstruction
	 */
	export class ComplexExprInstruction extends ExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_ComplexExprInstruction;
		}
	}

	/**
	 * Respresnt func(arg1,..., argn)
	 * EMPTY_OPERATOR IdExprInstruction ExprInstruction ... ExprInstruction 
	 */
	export class FunctionCallInstruction extends ExprInstruction {
		constructor() { 
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionCallInstruction;
		}	
	}

	/**
	 * Respresnt ctor(arg1,..., argn)
	 * EMPTY_OPERATOR IdInstruction ExprInstruction ... ExprInstruction 
	 */
	export class ConstructorCallInstruction extends ExprInstruction {
		constructor() { 
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_ConstructorCallInstruction;
		}	
	}

	/**
	 * Represetn compile vs_func(...args)
	 * compile IdExprInstruction ExprInstruction ... ExprInstruction
	 */
	export class CompileExprInstruction extends ExprInstruction{
		constructor() { 
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_CompileExprInstruction;
		}	
	}

	/**
	 * Represetn sampler_state { states }
	 * sampler_state IdExprInstruction ExprInstruction ... ExprInstruction
	 */
	export class SamplerStateBlockInstruction extends ExprInstruction {
		constructor() { 
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_SamplerStateBlockInstruction;
		}	
	}

	export class SamplerStateInstruction extends ExprInstruction {
		constructor() { 
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_SamplerStateInstruction;
		}	
	}

	/**
	 * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
	 * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
	 */
	export class FunctionDeclInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
		constructor() { 
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDeclInstruction;
		}	

		getNameId(): IAFXIdInstruction {
			return null;
		}

		getHash(): string{
			return "";
		}
		
		hasImplementation(): bool {
			return false;
		}
	}

	/**
	 * Represent type func(...args)[:Semantic]
	 * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
	 */
	export class FunctionDefInstruction extends DeclInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDefInstruction;
		}
	}

	/**
	 * Represent all kind of statements
	 */
	export class StmtInstruction extends Instruction  implements IAFXStmtInstruction {
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_StmtInstruction;
		}
	}

	/**
	 * Represent {stmts}
	 * EMPTY_OPERATOR StmtInstruction ... StmtInstruction
	 */
	export class StmtBlockInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [];
			this._eInstructionType = EAFXInstructionTypes.k_StmtBlockInstruction;
		}
	}

	/**
	 * Represent expr;
	 * EMPTY_OPERTOR ExprInstruction 
	 */
	export class ExprStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_ExprStmtInstruction;
		}
	}

	/**
	 * Reprsernt continue; break; discard;
	 * (continue || break || discard) 
	 */
	export class BreakStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_BreakStmtInstruction;
		}
	}

	/**
	 * Represent while(expr) stmt
	 * ( while || do_while) ExprInstruction StmtInstruction
	 */
	export class WhileStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_WhileStmtInstruction;
		}
	}

	/**
	 * Represent for(forInit forCond ForStep) stmt
	 * for ExprInstruction or VarDeclInstruction ExprInstruction ExprInstruction StmtInstruction
	 */
	export class ForStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null, null, null];
			this._eInstructionType = EAFXInstructionTypes.k_ForStmtInstruction;
		}
	}

	/**
	 * Represent if(expr) stmt or if(expr) stmt else stmt
	 * ( if || if_else ) Expr Stmt [Stmt]
	 */
	export class IfStmtInstruction extends StmtInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null, null];
			this._eInstructionType = EAFXInstructionTypes.k_IfStmtInstruction;
		}
	}

	/**
	 * Represent TypeDecl or VariableDecl or VarStructDecl
	 * EMPTY DeclInstruction
	 */
	export class DeclStmtInstruction extends StmtInstruction {
		constructor () {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_DeclStmtInstruction;
		}
	}

	/**
	 * Represent return expr;
	 * return ExprInstruction
	 */
	export class ReturnStmtInstruction extends StmtInstruction {
		constructor () {
			super();
			this._pInstructionList = [null];
			this._sOperatorName = "return";
			this._eInstructionType = EAFXInstructionTypes.k_ReturnStmtInstruction;
		}
	}

	/**
	 * Represent empty statement only semicolon ;
	 * ;
	 */
	 export class SemicolonStmtInstruction extends StmtInstruction {
	 	constructor() {
	 		super();
	 		this._pInstructionList = [];
	 		this._eInstructionType = EAFXInstructionTypes.k_SemicolonStmtInstruction;
	 	}
	 }

	// export class TypeInstruction extends Instruction {
	// 	/**
	// 	 * Represent [usages] IdInstruction
	// 	 * EMPTY_OPERATOR KeywordInstruction ... KeywordInstruction IdInstruction
	// 	 */
	// }

	// export class VariableInitInstruction extends Instruction {
	// 	/**
	// 	 * Represent varname [ [someIndex] ][ = SomeExpr;]
	// 	 * ('=' || EMPTY_OPERATOR) VariableInstruction ExprInstruction
	// 	 */
	// }

	// export class VariableInstruction extends Instruction{
	// 	/**
	// 	 * Represent varname [ [someIndex] ]
	// 	 * EMPTY_OPERATOR IdInstruction IndexInstruction ... IndexInstruction
	// 	 */
	// }
	// export class IndexInstruction extends Instruction {
	// 	/**
	// 	 * Represent [ [someIndex] ]
	// 	 * EMPTY_OPERATOR ExprInstruction
	// 	 */
	// }

	// export class ExprInstruction extends Instruction {
	// 	/**
	// 	 * Represent someExpr
	// 	 * EMPTY_OPERATOR [SomeOfExprassionInstruction]
	// 	 */
	// }

	

	// export class ArithmeticExprInstruction extends Instruction {
	// 	/**
	// 	 * Represent someExpr +,/,-,*,% someExpr
	// 	 * (+|-|*|/|%) Instruction Instruction
	// 	 */
	// }

	// export class RelationExprInstruction extends Instruction {
	// 	/**
	// 	 * Represent someExpr <,>,>=,<=,!=,== someExpr
	// 	 * (<|>|<=|=>|!=|==) Instruction Instruction
	// 	 */
	// }

	// export class LogicalExprInstruction extends Instruction {
	// 	/**
	// 	 * Represent someExpr &&,|| someExpr
	// 	 * (&& | ||) Instruction Instruction
	// 	 */
	// }

	// export class FunctionCallInstruction extends Instruction {
	// 	/**
	// 	 * Represent func([params])
	// 	 * call IdInstruction ExprInstruction ... ExprInstruction
	// 	 */	
	// }

	// export class TypeCastInstruction extends Instruction {
	// 	/**
	// 	 * Represent (type)(Expr)
	// 	 * typeCast IdInstruction ExprInstruction
	// 	 */	
	// }

	// export class TypeConstructorInstruction extends Instruction {
	// 	/**
	// 	 * Represent type(Expr)
	// 	 * constructor IdInstruction ExprInstruction
	// 	 */	
	// }


}

#endif