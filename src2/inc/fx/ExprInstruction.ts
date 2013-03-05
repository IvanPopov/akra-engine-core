#ifndef AFXEXPRINSTRUCTION
#define AFXEXPRINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"
#include "fx/TypeInstruction.ts"

module akra.fx {
	export class ExprInstruction extends TypedInstruction implements IAFXExprInstruction {
		protected _pLastEvalResult: any = null;

		/**
		 * Respresent all kind of instruction
		 */
		constructor(){
			super();
			this._eInstructionType = EAFXInstructionTypes.k_ExprInstruction;
		}

		evaluate(): bool {
			return false;
		}

		simplify(): bool {
			return false;
		}

		getEvalValue(): any {
			return this._pLastEvalResult;
		}

		isConst(): bool {
			return false;
		}

		getType(): IAFXVariableTypeInstruction{
			return <IAFXVariableTypeInstruction>super.getType();
		}	

		clone(pRelationMap?:IAFXInstructionMap): IAFXExprInstruction {
			return <IAFXExprInstruction>super.clone(pRelationMap);
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this.getInstructions();
			
			if(isNull(pInstructionList)){
				return;
			}

			for(var i: uint = 0; i < this._nInstructions; i++){
				pInstructionList[i].addUsedData(pUsedDataCollector, eUsedMode);
			}
		}
	}

	export class IntInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _iValue: int;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._iValue = 0;
			this._pType = getEffectBaseType("int").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_IntInstruction;
		}

		inline setValue(iValue: int): void{
			this._iValue = iValue;
		}

		toString(): string {
			return <string><any>this._iValue;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this._iValue.toString();
			return sCode;			
		}

		evaluate(): bool {
			this._pLastEvalResult = this._iValue;
			return true;
		}

		inline isConst(): bool {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._iValue);
			return pClonedInstruction;
		}
	}

	export class FloatInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _fValue: float;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._fValue = 0.0;
			this._pType = getEffectBaseType("float").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_FloatInstruction;
		}

		inline setValue(fValue: float): void{
			this._fValue = fValue;
		}

		toString(): string {
			return <string><any>this._fValue;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this._fValue.toString();
			if(this._fValue % 1 === 0){
				sCode += ".";
			}
			return sCode;			
		}

		evaluate(): bool {
			this._pLastEvalResult = this._fValue;
			return true;
		}

		inline isConst(): bool {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._fValue);
			return pClonedInstruction;
		}
	}

	export class BoolInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _bValue: bool;
		static private _pBoolType: IAFXVariableTypeInstruction = null;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._bValue = true;
			this._pType = getEffectBaseType("bool").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_BoolInstruction;
		}

		inline setValue(bValue: bool): void{
			this._bValue = bValue;
		}

		toString(): string {
			return <string><any>this._bValue;
		}

		toFinalCode(): string {
			if(this._bValue){
				return "true";
			}		
			else {
				return "false";
			}
		}

		evaluate(): bool {
			this._pLastEvalResult = this._bValue;
			return true;
		}

		inline isConst(): bool {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._bValue);
			return pClonedInstruction;
		}
	}

	export class StringInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _sValue: string;
		static private _pStringType: IAFXVariableTypeInstruction = null;

		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._sValue = "";
			this._pType = getEffectBaseType("string").getVariableType();
			this._eInstructionType = EAFXInstructionTypes.k_StringInstruction;
		}

		inline setValue(sValue: string): void{
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this._sValue;
			return sCode;			
		}

		evaluate(): bool {
			this._pLastEvalResult = this._sValue;
			return true;
		}

		inline isConst(): bool {
			return true;
		}

		clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction {
			var pClonedInstruction: IAFXLiteralInstruction = <IAFXLiteralInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setValue(this._sValue);
			return pClonedInstruction;
		}
	}

	export class IdExprInstruction extends ExprInstruction implements IAFXIdExprInstruction {
		private _pType: IAFXVariableTypeInstruction = null;
		
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

		isConst(): bool {
			return this.getType().isConst();
		}

		evaluate(): bool {
			return false;
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			return sCode;			
		}

		clone(pRelationMap?:IAFXInstructionMap): IAFXIdExprInstruction {
			return <IAFXIdExprInstruction>super.clone(pRelationMap);
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			if(!this.getType().isFromVariableDecl()) {
				return;
			}

			var pInfo: IAFXTypeUseInfoContainer = null;
			pInfo = pUsedDataCollector[this.getType()._getInstructionID()];

			if(!isDef(pInfo)){
				pInfo = <IAFXTypeUseInfoContainer>{
					type: this.getType(),
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[this.getType()._getInstructionID()] = pInfo;
			}

			if(eUsedMode !== EVarUsedMode.k_Write && eUsedMode !== EVarUsedMode.k_Undefined){
				pInfo.isRead = true;
				pInfo.numRead++;
			}

			if(eUsedMode === EVarUsedMode.k_Write || eUsedMode === EVarUsedMode.k_ReadWrite) {
				pInfo.isWrite = true;
				pInfo.numWrite++;
			}

			pInfo.numUsed++;
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

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
		}

		evaluate(): bool {
			var pOperands: IAFXExprInstruction[] = <IAFXExprInstruction[]>this.getInstructions();
			var pValL: any = pOperands[0].evaluate() ? pOperands[0].getEvalValue() : null;
			var pValR: any = pOperands[1].evaluate() ? pOperands[1].getEvalValue() : null;

			if(isNull(pValL) || isNull(pValR)){
				return false;
			}

			try{
				switch(this.getOperator()){
					case "+":
						this._pLastEvalResult = pValL + pValR;
						break;
					case "-":
						this._pLastEvalResult = pValL - pValR;
						break;
					case "*":
						this._pLastEvalResult = pValL * pValR;
						break;
					case "/":
						this._pLastEvalResult = pValL / pValR;
						break;
					case "%":
						this._pLastEvalResult = pValL % pValR;
						break;
				}
				return true;
			}
			catch(e){
				return false;
			}
		}

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += this.getOperator();
			sCode += this.getInstructions()[1].toFinalCode();
			return sCode;			
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

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += this.getOperator();
			sCode += this.getInstructions()[1].toFinalCode();
			return sCode;			
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var sOperator: string = this.getOperator();
			var pSubExprLeft: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pSubExprRight: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
			
			if(eUsedMode === EVarUsedMode.k_Read || sOperator !== "="){
				pSubExprLeft.addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
			}
			else {
				pSubExprLeft.addUsedData(pUsedDataCollector, EVarUsedMode.k_Write);
			}

			pSubExprRight.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
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

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += this.getOperator();
			sCode += this.getInstructions()[1].toFinalCode();
			return sCode;			
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
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

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += this.getOperator();
			sCode += this.getInstructions()[1].toFinalCode();
			return sCode;			
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
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

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += "?";
			sCode += this.getInstructions()[1].toFinalCode();
			sCode += ":";
			sCode += this.getInstructions()[2].toFinalCode();
			return sCode;			
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			super.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
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

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += "(";
			sCode += this.getInstructions()[1].toFinalCode();
			sCode += ")";		
			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
			pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);

			// pUsedDataCollector[this.getType()._getInstructionID()] = this.getType();
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

		toFinalCode(): string {
			var sCode: string = "";
			sCode += this.getOperator();
			sCode += this.getInstructions()[0].toFinalCode();	
			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			if(this.getOperator() === "++" || this.getOperator() === "--"){
				(<IAFXExprInstruction>this.getInstructions()[0]).addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
			}
			else {
				(<IAFXExprInstruction>this.getInstructions()[0]).addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
			}
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

		toFinalCode(): string {
			var sCode: string = "";

			sCode += this.getInstructions()[0].toFinalCode();	
			sCode += "[" + this.getInstructions()[1].toFinalCode() + "]";

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pIndex: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];

			pSubExpr.addUsedData(pUsedDataCollector, eUsedMode);
			pIndex.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
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

		toFinalCode(): string {
			var sCode: string = "";
			
			sCode += this.getInstructions()[0].toFinalCode();	
			sCode += "." + this.getInstructions()[1].toFinalCode();

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pPoint: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
			
			pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Undefined);
			pPoint.addUsedData(pUsedDataCollector, eUsedMode);
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

		toFinalCode(): string {
			var sCode: string = "";
			
			sCode += this.getInstructions()[0].toFinalCode();	
			sCode += this.getOperator();

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
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

		toFinalCode(): string {
			var sCode: string = "";
			
			sCode += this.getInstructions()[0].toFinalCode();

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
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

		toFinalCode(): string {
			var sCode: string = "";
			
			sCode += "(" + this.getInstructions()[0].toFinalCode() + ")";

			return sCode;
		}

		// addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
  //                   eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
		// 	var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
		// 	pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
		// }
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

		toFinalCode(): string {
			var sCode: string = "";
			
			sCode += this.getInstructions()[0].toFinalCode();
			sCode += "(";
			for(var i: uint = 1; i < this._nInstructions; i++){
				sCode += this.getInstructions()[1].toFinalCode();
				if(i !== this._nInstructions - 1){
					sCode +=","
				}
			}
			sCode += ")"

			return sCode;
		}

		getFunction(): IAFXFunctionDeclInstruction{
			return <IAFXFunctionDeclInstruction>(<IAFXIdExprInstruction>this._pInstructionList[0]).getType().getParent().getParent();
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pExprList: IAFXExprInstruction[] = <IAFXExprInstruction[]>this.getInstructions();
			var pFunction: IAFXFunctionDeclInstruction = this.getFunction();
			var pArguments: IAFXVariableDeclInstruction[] = <IAFXVariableDeclInstruction[]>pFunction.getArguments();

			pExprList[0].addUsedData(pUsedDataCollector, eUsedMode);

			for(var i:uint = 0; i < pArguments.length; i++){
				if (pArguments[i].getType().hasUsage("out")){
					pExprList[i+1].addUsedData(pUsedDataCollector, EVarUsedMode.k_Write);
				}
				else if(pArguments[i].getType().hasUsage("inout")){
					pExprList[i+1].addUsedData(pUsedDataCollector, EVarUsedMode.k_ReadWrite);
				}
				else {
					pExprList[i+1].addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
				}
			}
		}
	}

	/**
	 * Respresnt system_func(arg1,..., argn)
	 * EMPTY_OPERATOR SimpleInstruction ... SimpleInstruction 
	 */
	export class SystemCallInstruction extends ExprInstruction {
		private _pSystemFunction: SystemFunctionInstruction = null;

		constructor() { 
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_SystemCallInstruction;
		}

		toFinalCode(): string {
			var sCode: string = "";

			for(var i: uint = 0; i < this.getInstructions().length; i++){
				sCode += this.getInstructions()[i].toFinalCode();
			}

			return sCode;
		}

		setSystemCallFunction(pFunction: IAFXFunctionDeclInstruction): void{
			this._pSystemFunction = <SystemFunctionInstruction>pFunction;
			this.setType(pFunction.getType());
		}

		setInstructions(pInstructionList: IAFXInstruction[]): void {
			this._pInstructionList = pInstructionList;
			this._nInstructions = pInstructionList.length;
			for(var i: uint = 0; i < pInstructionList.length; i++){
				pInstructionList[i].setParent(this);
			}
		}

		fillByArguments(pArguments: IAFXInstruction[]): void{
			this.setInstructions(this._pSystemFunction.closeArguments(pArguments));
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this.getInstructions();
			for(var i: uint = 0; i < this._nInstructions; i++){
				if(pInstructionList[i]._getInstructionType() !== EAFXInstructionTypes.k_SimpleInstruction){
					pInstructionList[i].addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
				}
			}
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

		toFinalCode(): string {
			var sCode: string = "";

			sCode += this.getInstructions()[0].toFinalCode();
			sCode += "(";

			for(var i: uint = 1; i < this._nInstructions; i++){
				sCode += this.getInstructions()[i].toFinalCode();
				
				if(i !== this._nInstructions - 1){
					sCode += ",";
				}
			}

			sCode += ")";

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pInstructionList: IAFXAnalyzedInstruction[] = <IAFXAnalyzedInstruction[]>this.getInstructions();
			for(var i: uint = 1; i < this._nInstructions; i++){
				pInstructionList[i].addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);
			}
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

		inline getFunction(): IAFXFunctionDeclInstruction {
			return <IAFXFunctionDeclInstruction>this._pInstructionList[0].getParent().getParent();
		}	
	}

	export class MemExprInstruction extends ExprInstruction {
		private _pBuffer: IAFXVariableDeclInstruction = null;

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_MemExprInstruction;
		}

		getBuffer(): IAFXVariableDeclInstruction{
			return this._pBuffer;
		}

		setBuffer(pBuffer: IAFXVariableDeclInstruction): void {
			this._pBuffer = pBuffer;
			this.setType(pBuffer.getType());
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
					eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pBufferType: IAFXVariableTypeInstruction = this.getBuffer().getType();
			var pInfo: IAFXTypeUseInfoContainer = pUsedDataCollector[pBufferType._getInstructionID()];
			
			if(!isDef(pInfo)){
				pInfo = <IAFXTypeUseInfoContainer>{
					type: pBufferType,
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[pBufferType._getInstructionID()] = pInfo;
			}	
			if(eUsedMode !== EVarUsedMode.k_Undefined){
				pInfo.isRead = true;
				pInfo.numRead++;
			}

			pInfo.numUsed++;
		}
	}

	export class InitExprInstruction extends ExprInstruction implements IAFXInitExprInstruction {
		private _pConstructorType: IAFXTypeInstruction = null;

		constructor(){
			super();
			this._pInstructionList = [];
			this._eInstructionType = EAFXInstructionTypes.k_InitExprInstruction;	
		}

		toFinalCode(): string {
			var sCode: string = "";

			if(!isNull(this._pConstructorType)) {
				sCode += this._pConstructorType.toFinalCode();
			}
			sCode += "(";

			for(var i: uint = 0; i < this._nInstructions; i++){
				sCode += this.getInstructions()[i].toFinalCode();
				
				if(i !== this._nInstructions - 1){
					sCode += ",";
				}
			}

			sCode += ")";

			return sCode;
		}

		optimizeForVariableType(pType: IAFXVariableTypeInstruction): bool {
			if ((pType.isNotBaseArray() && pType._getScope() === 0) || 
				(pType.isArray() && this._nInstructions > 1)){
				if (pType.getLength() === UNDEFINE_LENGTH ||
					this._nInstructions !== pType.getLength()){
					return false;
				}

				var pArrayElementType: IAFXVariableTypeInstruction = pType.getArrayElementType();
				var pTestedInstruction: IAFXExprInstruction = null;
				var isOk: bool = false;

				for(var i: uint = 0; i < this._nInstructions; i++){
					pTestedInstruction = (<IAFXExprInstruction>this.getInstructions()[i]);
					if(pTestedInstruction._getInstructionType() === EAFXInstructionTypes.k_InitExprInstruction){
						isOk = (<IAFXInitExprInstruction>pTestedInstruction).optimizeForVariableType(pArrayElementType);
						if(!isOk){
							return false;
						}
					}
					else {
						if(isSamplerType(pArrayElementType)){
							if(pTestedInstruction._getInstructionType() !== EAFXInstructionTypes.k_SamplerStateBlockInstruction){
								return false;
							}
						}
						else {
							isOk = pTestedInstruction.getType().isEqual(pArrayElementType);
							if(!isOk){
								return false;
							}
						}
					}
				}

				this._pConstructorType = pType.getBaseType();
				return true;
			}
			else {

				var pFirstInstruction: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
				
				if (this._nInstructions === 1 && 
					pFirstInstruction._getInstructionType() !== EAFXInstructionTypes.k_InitExprInstruction){
					
					if(isSamplerType(pType)){
						if(pFirstInstruction._getInstructionType() === EAFXInstructionTypes.k_SamplerStateBlockInstruction){
							return true;
						}
						else {
							return false;
						}
					}

					if(pFirstInstruction.getType().isEqual(pType)){
						return true;
					}
					else {
						return false;
					}
				}
				
				var pInstructionList: IAFXInitExprInstruction[] = <IAFXInitExprInstruction[]>this.getInstructions();
				var pFieldNameList: string[] = pType.getFieldNameList();

				for(var i: uint = 0 ; i < pInstructionList.length; i++){
					var pFieldType: IAFXVariableTypeInstruction = pType.getFieldType(pFieldNameList[i]);
					if(pInstructionList[i].optimizeForVariableType(pFieldType));
				}

				this._pConstructorType = pType.getBaseType();
				return true;
			}
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

		addState(sStateType: string, sStateValue: string): void{
			return;
		}
	}

	export class ExtractExprInstruction extends ExprInstruction {
		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_ExtractExprInstruction;
		}
	}
}

#endif