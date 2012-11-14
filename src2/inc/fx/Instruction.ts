#ifndef AFXINSTRUCTION_TS
#define AFXINSTRUCTION_TS

#include "IAFXInstruction.ts"

module akra.fx {

	// export interface IAFXInstructionRoutineMap {
	// 	[priority: uint] : IAFXInstructionRoutine;
	// }

	export class Instruction implements IAFXInstruction{
		protected _sOperatorName: string;
		protected _pInstructionList: IAFXInstruction[];
		protected _pStateMap: IAFXInstructionStateMap;
		// private _pRoutineList: IAFXInstructionRoutine[];
		// private _pRoutineByPriorityMap: IAFXInstructionRoutineMap;
		protected _isStateChange: bool;

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

		get stateMap(): IAFXInstructionStateMap{
			return this._pStateMap;
		}

		set stateMap(pStateMap: IAFXInstructionStateMap){
			this._pStateMap = pStateMap;
		}

		constructor(){
			this._sOperatorName = null;
			this._pInstructionList = null;
			this._pStateMap = null;
			// this._pRoutineList = null;
			// this._pRoutineByPriorityMap = null;
			this._isStateChange = false;
		}

		inline push(pInstruction: IAFXInstruction): void {
			if(!isNull(this._pInstructionList)){
				this._pInstructionList.push(pInstruction);
			}
		}

		inline changeState(sStateName: string, sValue: string): void;
    	inline changeState(iStateIndex: int, sValue: string): void;
    	inline changeState(): void {
    		if(isNull(this._pStateMap)){
    			return;
    		}

    		this._pStateMap[<string>arguments[0]] = <string>arguments[1];
    		this.stateChange();
    	}

    	inline stateChange(): void {
    		this._isStateChange = true;
    	}

    	inline isStateChange(): bool {
    		return this._isStateChange;
    	}

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint): void {
    		//TODO
    	}

    	toString(): string {
    		return null;
    	}
	}

	export interface IdInstructionStates extends IAFXInstructionStateMap{
		name: string;
		realName: string;
		isUsed: bool;
	}
	export class IdInstruction extends Instruction {
		protected _pStateMap: IdInstructionStates;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._pStateMap = <IdInstructionStates>{
									name: "",
									realName: "",
									isUsed: false};
		}

		inline setName(sName: string): void{
			this._pStateMap.name = sName;
		}

		inline setRealName(sRealName: string): void{
			this._pStateMap.realName = sRealName;
		}

		toString(): string {
			this._isStateChange = false;
			return this._pStateMap.realName;
		}

	}

	export interface IntInstructionStates extends IAFXInstructionStateMap{
		value: int;
	}
	export class IntInstruction extends Instruction {
		protected _pStateMap: IntInstructionStates;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._pStateMap = <IntInstructionStates>{value: 0};
		}

		inline setValue(iValue: int): void{
			this._pStateMap.value = iValue;
		}

		toString(): string {
			return <string><any>this._pStateMap.value;
		}
	}

	export interface FloatInstructionStates extends IAFXInstructionStateMap{
		value: float;
	}
	export class FloatInstruction extends Instruction {
		protected _pStateMap: FloatInstructionStates;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._pStateMap = <FloatInstructionStates>{value: 0.0};
		}

		inline setValue(fValue: float): void{
			this._pStateMap.value = fValue;
		}

		toString(): string {
			return <string><any>this._pStateMap.value;
		}
	}

	export interface StringInstructionStates extends IAFXInstructionStateMap{
		value: string;
	}
	export class StringInstruction extends Instruction {
		protected _pStateMap: StringInstructionStates;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._pStateMap = <StringInstructionStates>{value: ""};
		}

		inline setValue(sValue: string): void{
			this._pStateMap.value = sValue;
		}

		toString(): string {
			return this._pStateMap.value;
		}
	}

	export interface KeywordInstructionStates extends IAFXInstructionStateMap{
		value: string;
	}
	export class KeywordInstruction extends Instruction {
		protected _pStateMap: KeywordInstructionStates;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._pStateMap = <KeywordInstructionStates>{value: ""};
		}

		inline setValue(sValue: string): void{
			this._pStateMap.value = sValue;
		}

		toString(): string {
			return this._pStateMap.value;
		}
	}


	export class StructDeclInstruction extends Instruction {
		/**
		 * Represent struct typeName {[fields]};
		 * EMPTY_OPERATOR IdInstruction StructInstruction
		 */
		constructor(){
			super();
			this._pInstructionList = [];
			this._pStateMap = <IAFXInstructionStateMap>{};
		}

		toString(): string {
			var sCode: string = "";

			sCode = "struct " + 
					this._pInstructionList[0].toString() + " " + 
					this._pInstructionList[1].toString() + ";";

			return sCode;
		}
	}

	export class StructInstruction extends Instruction {
		/**
		 * Represent {[fields]};
		 * EMPTY_OPERATOR VarDeclInstruction ... VarDeclInstruction
		 */
		constructor(){
			super();
			this._pInstructionList = [];
			this._pStateMap = <IAFXInstructionStateMap>{};
		}

		toString(): string {
			var sCode: string = "{";
			var i: uint = 0;
			var pInstructionList: IAFXInstruction[] = this._pInstructionList;

			for(i = 0; i < pInstructionList.length; i++) {
				sCode += pInstructionList[i].toString() + ";";
			}

			sCode += "}";

			return sCode;
		}
	}

	export class VarDeclInstruction extends Instruction {
		/**
		 * Represent type var_name [= init_expr]
		 * EMPTY_OPERATOR TypeInstruction VariableInitInstruction
		 */
	}

	export class TypeInstruction extends Instruction {
		/**
		 * Represent [usages] IdInstruction
		 * EMPTY_OPERATOR KeywordInstruction ... KeywordInstruction IdInstruction
		 */
	}

	export class VariableInitInstruction extends Instruction {
		/**
		 * Represent varname [ [someIndex] ][ = SomeExpr;]
		 * ('=' || EMPTY_OPERATOR) VariableInstruction ExprInstruction
		 */
	}

	export class VariableInstruction extends Instruction{
		/**
		 * Represent varname [ [someIndex] ]
		 * EMPTY_OPERATOR IdInstruction IndexInstruction ... IndexInstruction
		 */
	}
	export class IndexInstruction extends Instruction {
		/**
		 * Represent [ [someIndex] ]
		 * EMPTY_OPERATOR ExprInstruction
		 */
	}

	export class ExprInstruction extends Instruction {
		/**
		 * Represent someExpr
		 * EMPTY_OPERATOR [SomeOfExprassionInstruction]
		 */
	}

	export class PostfixIndexInstruction extends Instruction {
		/**
		 * Represent someExpr[someIndex]
		 * [] Instruction ExprInstruction
		 */
	}

	export class PostfixPointInstruction extends Instruction {
		/**
		 * Represent someExpr.id
		 * . Instruction IdInstruction
		 */
	}

	export class PostfixArithmeticInstruction extends Instruction {
		/**
		 * Represent someExpr ++
		 * (-- | ++) Instruction
		 */	
	}

	export class ArithmeticExprInstruction extends Instruction {
		/**
		 * Represent someExpr +,/,-,*,% someExpr
		 * (+|-|*|/|%) Instruction Instruction
		 */
	}

	export class RelationExprInstruction extends Instruction {
		/**
		 * Represent someExpr <,>,>=,<=,!=,== someExpr
		 * (<|>|<=|=>|!=|==) Instruction Instruction
		 */
	}

	export class LogicalExprInstruction extends Instruction {
		/**
		 * Represent someExpr &&,|| someExpr
		 * (&& | ||) Instruction Instruction
		 */
	}

	export class FunctionCallInstruction extends Instruction {
		/**
		 * Represent func([params])
		 * call IdInstruction ExprInstruction ... ExprInstruction
		 */	
	}

	export class TypeCastInstruction extends Instruction {
		/**
		 * Represent (type)(Expr)
		 * typeCast IdInstruction ExprInstruction
		 */	
	}

	export class TypeConstructorInstruction extends Instruction {
		/**
		 * Represent type(Expr)
		 * constructor IdInstruction ExprInstruction
		 */	
	}


}

#endif