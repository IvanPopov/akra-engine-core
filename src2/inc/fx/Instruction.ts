#ifndef AFXINSTRUCTION_TS
#define AFXINSTRUCTION_TS

#include "IAFXInstruction.ts"

module akra.fx {

	export class Instruction implements IAFXInstruction{
		protected _pParentInstruction: IAFXInstruction;
		protected _sOperatorName: string;
		protected _pInstructionList: IAFXInstruction[];
		protected _nInstuctions: uint;

		getParent(): IAFXInstruction{
			return this._pParentInstruction;
		}

		setParent(pParentInstruction: IAFXInstruction): void {
			this._pParentInstruction = pParentInstruction;
		}

		getOperator(): string {
			return this._sOperatorName;
		}

		setOperator(sOperator: string): void {
			this._sOperatorName = sOperator;
		}

		getInstructions(): IAFXInstruction[] {
			return this._pInstructionList;
		}

		setInstructions(pInstructionList: IAFXInstruction[]): void{
			this._pInstructionList = pInstructionList;
		}

		constructor(){
			this._pParentInstruction = null;
			this._sOperatorName = null;
			this._pInstructionList = null;
			this._nInstuctions = 0;
		}

		push(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
			if(!isNull(this._pInstructionList)){
				this._pInstructionList[this._nInstuctions] = pInstruction;
				this._nInstuctions += 1;
			}
			if(isSetParent){
				pInstruction.setParent(this);
			}
		}

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint): void {
    		//TODO
    	}

    	toString(): string {
    		return null;
    	}
	}

	export class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
		// EMPTY_OPERATOR TypeInstruction ArrayInstruction PointerInstruction
		
		constructor() {
			super();
		}	 

		addArrayIndex(pExpr: IAFXExprInstruction): void {

		}

		addPointIndex(): void {

		}

		setVideoBuffer(pBuffer: IAFXIdInstruction): void {
			
		}

		isEqual(pType: IAFXVariableTypeInstruction): bool {
			return false;
		}

		isBase(): bool {
			return false;
		}
	}

	export class TypedInstruction extends Instruction implements IAFXTypedInstruction {
		protected _pType: IAFXVariableTypeInstruction;

		constructor(){
			super();
			this._pType = null;
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

		constructor(){
			super();
			this._sSemantic = "";
		}

		setSemantic(sSemantic: string): void {
			this._sSemantic = sSemantic;
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
		}	 
	}

	export class VariableDeclInstruction extends DeclInstruction implements IAFXVariableDeclInstruction {
		/**
		 * Represent type var_name [= init_expr]
		 * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
		 */
		constructor(){
			super();
		}
	}

	export class UsageTypeInstruction extends Instruction implements IAFXUsageTypeInstruction {
		// EMPTY_OPERATOR KeywordInstruction ... KeywordInstruction IdInstruction
		
		constructor() {
			super();
		}	 
	}

	export class BaseTypeInstruction extends Instruction implements IAFXBaseTypeInstruction {
		// EMPTY_OPERATOR IdInstruction
		
		constructor() {
			super();
		}	 
	}

	export class StructDeclInstruction extends Instruction implements IAFXStructDeclInstruction {
		// EMPTY_OPERATOR IdInstruction StructFieldsInstruction
		
		constructor() {
			super();
		}	 
	}

	export class StructFieldsInstruction extends Instruction {
		// EMPTY_OPERATOR VariableDeclInstruction ... VariableDeclInstruction
		
		constructor() {
			super();
		}	 
	}


	export class ExprInstruction extends TypedInstruction implements IAFXExprInstruction {
		/**
		 * Respresent all kind of instruction
		 */
		constructor(){
			super();
		}
	}

	export class IdExprInstruction extends ExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null];
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
		}	
	}

	/**
	 * Represent + - ! ++ -- expr
	 * (+|-|!|++|--|) VariableTypeInstruction Instruction
	 */
	export class UnaryExprInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = [null, null];
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

	// export class PostfixIndexInstruction extends Instruction {
	// 	/**
	// 	 * Represent someExpr[someIndex]
	// 	 * [] Instruction ExprInstruction
	// 	 */
	// }

	// export class PostfixPointInstruction extends Instruction {
	// 	*
	// 	 * Represent someExpr.id
	// 	 * . Instruction IdInstruction
		 
	// }

	// export class PostfixArithmeticInstruction extends Instruction {
	// 	/**
	// 	 * Represent someExpr ++
	// 	 * (-- | ++) Instruction
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