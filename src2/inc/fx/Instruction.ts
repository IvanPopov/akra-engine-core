#ifndef AFXINSTRUCTION_TS
#define AFXINSTRUCTION_TS

#include "IAFXInstruction.ts"

module akra.fx {

	export class Instruction implements IAFXInstruction{
		protected _pParentInstruction: IAFXInstruction;
		protected _sOperatorName: string;
		protected _pInstructionList: IAFXInstruction[];

		get parent(): IAFXInstruction{
			return this._pParentInstruction;
		}

		set parent(pParentInstruction: IAFXInstruction){
			this._pParentInstruction = pParentInstruction;
		}

		get operator(): string{
			return this._sOperatorName;
		}

		set operator(sOperator: string){
			this._sOperatorName = sOperator;
		}

		get instructions(): IAFXInstruction[]{
			return this._pInstructionList;
		}

		set instructions(pInstructionList: IAFXInstruction[]){
			this._pInstructionList = pInstructionList;
		}

		constructor(){
			this._pParentInstruction = null;
			this._sOperatorName = null;
			this._pInstructionList = null;
		}

		inline push(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
			if(!isNull(this._pInstructionList)){
				this._pInstructionList.push(pInstruction);
			}
			if(isSetParent){
				pInstruction.parent = this;
			}
		}

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint): void {
    		//TODO
    	}

    	toString(): string {
    		return null;
    	}
	}

	export class IntInstruction extends Instruction {
		private _iValue: int;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._iValue = 0;
		}

		inline setValue(iValue: int): void{
			this._iValue = iValue;
		}

		toString(): string {
			return <string><any>this._iValue;
		}
	}

	export class FloatInstruction extends Instruction {
		private _fValue: float;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._fValue = 0.0;
		}

		inline setValue(fValue: float): void{
			this._fValue = fValue;
		}

		toString(): string {
			return <string><any>this._fValue;
		}
	}

	export class StringInstruction extends Instruction {
		private _sValue: string;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
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

		inline setValue(sValue: string): void{
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
		}
	}

	export class TypeDeclInstruction extends Instruction implements IAFXTypeDeclInstruction {
		// EMPTY_OPERATOR VariableTypeInstruction
		
		constructor() {
			super();
		}	 
	}

	export class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
		// EMPTY_OPERATOR TypeInstruction ArrayInstruction PointerInstruction
		
		constructor() {
			super();
		}	 

		addArrayIndex(): void {

		}

		addPointIndex(): void {

		}

		setVideoBuffer(): void {
			
		}
	}

	export class TypeInstruction extends Instruction implements IAFXTypeInstruction {
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


	export class VariableDeclInstruction extends Instruction implements IAFXVariableDeclInstruction {
		/**
		 * Represent type var_name [= init_expr]
		 * EMPTY_OPERATOR TypeInstruction VariableInitInstruction
		 */
		constructor(){
			super();
		}

		getVariableType(): IAFXVariableTypeInstruction {
			return null;
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