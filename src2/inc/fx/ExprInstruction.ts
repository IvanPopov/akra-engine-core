#ifndef AFXEXPRINSTRUCTION
#define AFXEXPRINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"
#include "fx/TypeInstruction.ts"
#include "ITexture.ts"
#include "IAFXSamplerState.ts"

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
			this._pType = Effect.getSystemType("int").getVariableType();
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
			this._pType = Effect.getSystemType("float").getVariableType();
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
			this._pType = Effect.getSystemType("bool").getVariableType();
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
			this._pType = Effect.getSystemType("string").getVariableType();
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
		private _bToFinalCode: bool = true;
		private _isInPassUnifoms: bool = false;
		private _isInPassForeigns: bool = false;

		inline isVisible(): bool {
			return this._pInstructionList[0].isVisible();
		}

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
			if(this.getType().isForeign()){
				var pVal = this.getType()._getParentVarDecl().getValue();
				if(!isNull(pVal)){
					this._pLastEvalResult = pVal;
					return true;
				}		
			}

			return false;
		}

		prepareFor(eUsedMode: EFunctionType): void {
			if(!this.isVisible()){
				this._bToFinalCode = false;
			}

			if(eUsedMode === EFunctionType.k_PassFunction){
				var pVarDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getInstructions()[0].getParent();
				if(!this.getType()._isUnverifiable() && isNull(pVarDecl.getParent())){
					if(pVarDecl.getType().isForeign()){
						this._isInPassForeigns = true;
					}
					else {
						this._isInPassUnifoms = true;
					}
				}
			}
		}

		toFinalCode(): string {
			var sCode: string = "";
			if(this._bToFinalCode){
				if(this._isInPassForeigns){
					sCode += "foreigns[\"" + this.getInstructions()[0].toFinalCode() + "\"]";
				}
				else if(this._isInPassUnifoms){
					sCode += "uniforms[\"" + this.getInstructions()[0].toFinalCode() + "\"]";
				}
				else {
					sCode += this.getInstructions()[0].toFinalCode();
				}
			}
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

		isConst(): bool {
			var pOperands: IAFXExprInstruction[] = <IAFXExprInstruction[]>this.getInstructions();
			return pOperands[0].isConst() && pOperands[1].isConst();
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

		isConst(): bool {
			return  (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
					(<IAFXExprInstruction>this.getInstructions()[1]).isConst();
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

		isConst(): bool {
			return  (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
					(<IAFXExprInstruction>this.getInstructions()[1]).isConst() && 
					(<IAFXExprInstruction>this.getInstructions()[2]).isConst();
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

		isConst(): bool {
			return (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
					(<IAFXExprInstruction>this.getInstructions()[1]).isConst();
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

		isConst(): bool {
			return (<IAFXExprInstruction>this.getInstructions()[1]).isConst();
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

        isConst(): bool {
        	return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
        }	
	}

	/**
	 * Represent someExpr[someIndex]
	 * EMPTY_OPERATOR Instruction ExprInstruction
	 */
	export class PostfixIndexInstruction extends ExprInstruction {
		private _pSamplerArrayDecl: IAFXVariableDeclInstruction = null;

		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixIndexInstruction;
		}

		toFinalCode(): string {
			var sCode: string = "";

			if(!isNull(this._pSamplerArrayDecl) && this._pSamplerArrayDecl.isDefinedByZero()){
				sCode += this.getInstructions()[0].toFinalCode();	
			}
			else {
				sCode += this.getInstructions()[0].toFinalCode();	
				
				if(!(<IAFXExprInstruction>this.getInstructions()[0]).getType()._isCollapsed()){
					sCode += "[" + this.getInstructions()[1].toFinalCode() + "]";
				}
			}

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pIndex: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];

			pSubExpr.addUsedData(pUsedDataCollector, eUsedMode);
			pIndex.addUsedData(pUsedDataCollector, EVarUsedMode.k_Read);

			if(pSubExpr.getType().isFromVariableDecl() && pSubExpr.getType().isSampler()){
				this._pSamplerArrayDecl = pSubExpr.getType()._getParentVarDecl();
			}
        }

        isConst(): bool {
        	return  (<IAFXExprInstruction>this.getInstructions()[0]).isConst() &&
        			(<IAFXExprInstruction>this.getInstructions()[1]).isConst();
        }
	}

	/*
	 * Represent someExpr.id
	 * EMPTY_OPERATOR Instruction IdInstruction
	 */
	export class PostfixPointInstruction extends ExprInstruction {
		private _bToFinalFirst: bool = true;
		private _bToFinalSecond: bool = true;

		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_PostfixPointInstruction;
		}

		prepareFor(eUsedMode: EFunctionType){
			if(!this.getInstructions()[0].isVisible()){
				this._bToFinalFirst = false;
			}

			if(!this.getInstructions()[1].isVisible()){
				this._bToFinalSecond = false;
			}

			this.getInstructions()[0].prepareFor(eUsedMode);
			this.getInstructions()[1].prepareFor(eUsedMode);
		}

		toFinalCode(): string {
			var sCode: string = "";
			
			sCode += this._bToFinalFirst ? this.getInstructions()[0].toFinalCode() : "";	
			sCode += this._bToFinalFirst ? "." : "";
			sCode += this._bToFinalSecond ? this.getInstructions()[1].toFinalCode(): "";

			return sCode;
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pSubExpr: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[0];
			var pPoint: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
			
			pSubExpr.addUsedData(pUsedDataCollector, EVarUsedMode.k_Undefined);
			pPoint.addUsedData(pUsedDataCollector, eUsedMode);
        }

        isConst(): bool {
        	return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
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

		isConst(): bool {
			return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
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
			var pPointerType: IAFXVariableTypeInstruction = this.getType();
			var pInfo: IAFXTypeUseInfoContainer = pUsedDataCollector[pPointerType._getInstructionID()];

			if(!isDef(pInfo)){
				pInfo = <IAFXTypeUseInfoContainer>{
					type: pPointerType,
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
			}
			
			if(eUsedMode === EVarUsedMode.k_Read){
				pInfo.isRead = true;
				pInfo.numRead++;
			}
			else if(eUsedMode === EVarUsedMode.k_Write){
				pInfo.isWrite = true;
				pInfo.numWrite++;
			}
			else if(eUsedMode === EVarUsedMode.k_ReadWrite){
				pInfo.isRead = true;
				pInfo.isWrite = true;
				pInfo.numRead++;
				pInfo.numWrite++;
			}
			
			pInfo.numUsed++;
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

		isConst(): bool {
			return (<IAFXExprInstruction>this.getInstructions()[0]).isConst();
		}

		evaluate(): bool {
			if((<IAFXExprInstruction>this.getInstructions()[0]).evaluate()){
				this._pLastEvalResult = (<IAFXExprInstruction>this.getInstructions()[0]).getEvalValue();
				return true;
			}
			else {
				return false;
			}
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
				sCode += this.getInstructions()[i].toFinalCode();
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
		private _pSamplerDecl: IAFXVariableDeclInstruction = null;

		constructor() { 
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_SystemCallInstruction;
		}

		toFinalCode(): string {
			if(!isNull(this._pSamplerDecl) && this._pSamplerDecl.isDefinedByZero()){
				return "vec4(0.)";
			} 
			
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
					if((<IAFXExprInstruction>pInstructionList[i]).getType().isSampler()){
						this._pSamplerDecl = (<IAFXExprInstruction>pInstructionList[i]).getType()._getParentVarDecl();
					}
				}
			}
		}

		clone(pRelationMap?: IAFXInstructionMap): SystemCallInstruction{
			var pClone: SystemCallInstruction = <SystemCallInstruction>super.clone(pRelationMap);
			
			pClone.setSystemCallFunction(this._pSystemFunction);

			return pClone;
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

		// isConst
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

		isConst(): bool {
			for(var i: uint = 1; i < this._nInstructions; i++){
				if(!(<IAFXExprInstruction>this.getInstructions()[i]).isConst()){
					return false;
				}
			}

			return true;
		}

		evaluate(): bool {
			if(!this.isConst()){
				return false;
			}

			var pRes: any = null;
			var pJSTypeCtor: any = Effect.getExternalType(this.getType());
			var pArguments: any[] = new Array(this._nInstructions - 1);

			if(isNull(pJSTypeCtor)){
				return false;
			}

			try{
				if(Effect.isScalarType(this.getType())){
					var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
					if(this._nInstructions > 2 || !pTestedInstruction.evaluate()){
						return false;
					}

					pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
				}
				else {
					for(var i: uint = 1; i < this._nInstructions; i++){
						var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[i];
					
						if(pTestedInstruction.evaluate()){
							pArguments[i-1] = pTestedInstruction.getEvalValue();
						}
						else {
							return false;
						}
					}

					pRes = new pJSTypeCtor;
					pRes.set.apply(pRes, pArguments);
				}
			}
			catch(e){
				return false;
			}
			
			this._pLastEvalResult = pRes;
			return true;
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
		private _isConst: bool = null;
		private _isArray: bool = false;

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

		isConst(): bool {
			if(isNull(this._isConst)){
				var pInstructionList: IAFXExprInstruction[] = <IAFXExprInstruction[]>this.getInstructions();
				
				for(var i: uint = 0; i < pInstructionList.length; i++){
					if(!pInstructionList[i].isConst()){
						this._isConst = false;
						break;
					}
				}

				this._isConst = isNull(this._isConst) ? true : false;
			}
			
			return this._isConst;
		}

		optimizeForVariableType(pType: IAFXVariableTypeInstruction): bool {
			if ((pType.isNotBaseArray() && pType._getScope() === 0) || 
				(pType.isArray() && this._nInstructions > 1)){


				if (pType.getLength() === UNDEFINE_LENGTH ||
					(pType.isNotBaseArray() && this._nInstructions !== pType.getLength()) ||
					(!pType.isNotBaseArray() && this._nInstructions !== pType.getBaseType().getLength())){

					return false;
				}

				if(pType.isNotBaseArray()){
					this._isArray = true;
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
						if(Effect.isSamplerType(pArrayElementType)){
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
					
					if(Effect.isSamplerType(pType)){
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
				else if(this._nInstructions === 1){
					return false;
				}
				
				var pInstructionList: IAFXInitExprInstruction[] = <IAFXInitExprInstruction[]>this.getInstructions();
				var pFieldNameList: string[] = pType.getFieldNameList();

				for(var i: uint = 0 ; i < pInstructionList.length; i++){
					var pFieldType: IAFXVariableTypeInstruction = pType.getFieldType(pFieldNameList[i]);
					if(!pInstructionList[i].optimizeForVariableType(pFieldType)) {
						return false;
					}
				}

				this._pConstructorType = pType.getBaseType();
				return true;
			}
		}

		evaluate(): bool {
			if(!this.isConst()){
				this._pLastEvalResult = null;
				return false;
			}

			var pRes: any = null;

			if(this._isArray){
				pRes = new Array(this._nInstructions);

				for(var i: uint = 0; i < this._nInstructions; i++){
					var pEvalInstruction = (<IAFXExprInstruction>this.getInstructions()[i]);
					
					if(pEvalInstruction.evaluate()){
						pRes[i] = pEvalInstruction.getEvalValue();
					}
				}
			}
			else if(this._nInstructions === 1){
				var pEvalInstruction = (<IAFXExprInstruction>this.getInstructions()[0]);
				pEvalInstruction.evaluate();
				pRes = pEvalInstruction.getEvalValue();
			}
			else {
				var pJSTypeCtor: any = Effect.getExternalType(this._pConstructorType);
				var pArguments: any[] = new Array(this._nInstructions);

				if(isNull(pJSTypeCtor)){
					return false;
				}

				try{
					if(Effect.isScalarType(this._pConstructorType)){
						var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[1];
						if(this._nInstructions > 2 || !pTestedInstruction.evaluate()){
							return false;
						}

						pRes = pJSTypeCtor(pTestedInstruction.getEvalValue());
					}
					else {
						for(var i: uint = 0; i < this._nInstructions; i++){
							var pTestedInstruction: IAFXExprInstruction = <IAFXExprInstruction>this.getInstructions()[i];
						
							if(pTestedInstruction.evaluate()){
								pArguments[i] = pTestedInstruction.getEvalValue();
							}
							else {
								return false;
							}
						}

						pRes = new pJSTypeCtor;
						pRes.set.apply(pRes, pArguments);
					}
				}
				catch(e){
					return false;
				}
			}

			this._pLastEvalResult = pRes;

			return true;
		}
	}
	/**
	 * Represetn sampler_state { states }
	 */
	export class SamplerStateBlockInstruction extends ExprInstruction {
		private _pTexture: IAFXVariableDeclInstruction = null;
		private _pSamplerParams: any = null;

		constructor() { 
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_SamplerStateBlockInstruction;
		}	

		addState(sStateType: string, sStateValue: string): void{
			if(isNull(this._pSamplerParams)){
				this._pSamplerParams = {};
			}

			this._pSamplerParams[sStateType] = sStateValue;
			return;
		}

		setTexture(pTexture: IAFXVariableDeclInstruction): void {
			this._pTexture = pTexture;
		}

		inline getTexture(): IAFXVariableDeclInstruction {
			return this._pTexture;
		}

		inline isConst(): bool {
			return true;
		}

		evaluate(): bool {
			var pSamplerState: IAFXSamplerState = {
				texture: null,
				textureName: "",

				wrap_s: 0,
				wrap_t: 0,

				mag_filter: 0,
				min_filter: 0
			};

			if(!isNull(this._pTexture)){
				pSamplerState.textureName = this._pTexture.getRealName();
			}

			if(!isNull(this._pSamplerParams)){
				if(isDef(this._pSamplerParams["ADDRESSU"])){
					pSamplerState.wrap_s = SamplerStateBlockInstruction.convertWrapMode(this._pSamplerParams["ADDRESSU"]);
				}

				if(isDef(this._pSamplerParams["ADDRESSV"])){
					pSamplerState.wrap_t = SamplerStateBlockInstruction.convertWrapMode(this._pSamplerParams["ADDRESSV"]);
				}

				if(isDef(this._pSamplerParams["MAGFILTER"])){
					pSamplerState.mag_filter = SamplerStateBlockInstruction.convertFilters(this._pSamplerParams["MAGFILTER"]);
				}

				if(isDef(this._pSamplerParams["MINFILTER"])){
					pSamplerState.min_filter = SamplerStateBlockInstruction.convertFilters(this._pSamplerParams["MINFILTER"]);
				}
			}


			this._pLastEvalResult = pSamplerState;

			return true;
		}

		static convertWrapMode(sState: string): ETextureWrapModes {
			switch (sState) {
	            case "WRAP":
	            	return ETextureWrapModes.REPEAT;
	            case "CLAMP":
	            	return ETextureWrapModes.CLAMP_TO_EDGE;
	            case "MIRROR":
	            	return ETextureWrapModes.MIRRORED_REPEAT;

	            default:
	            	return 0;
			}
		}

		static convertFilters(sState: string): ETextureFilters {
			switch (sState) {
	            case "NEAREST":
	            	return ETextureFilters.NEAREST;
                case "LINEAR":
                	return ETextureFilters.LINEAR;
                case "NEAREST_MIPMAP_NEAREST":
                	return ETextureFilters.NEAREST_MIPMAP_NEAREST;
                case "LINEAR_MIPMAP_NEAREST":
                	return ETextureFilters.LINEAR_MIPMAP_NEAREST;
                case "NEAREST_MIPMAP_LINEAR":
                	return ETextureFilters.NEAREST_MIPMAP_LINEAR;
                case "LINEAR_MIPMAP_LINEAR":
                	return ETextureFilters.LINEAR_MIPMAP_LINEAR;

	            default:
	            	return 0;
			}
		}
	}


	export class ExtractExprInstruction extends ExprInstruction {
		private _eExtractExprType: EExtractExprType = 0;
		private _pPointer: IAFXVariableDeclInstruction = null;
        private _pBuffer: IAFXVariableDeclInstruction = null;
        private _pOffsetVar: IAFXVariableDeclInstruction = null;
        private _sPaddingExpr: string = "";

        private _sExtractFunction: string = "";
        private _bNeedSecondBracket: bool = false;

		constructor(){
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_ExtractExprInstruction;
		}

		getExtractFunction(): IAFXFunctionDeclInstruction {
			var pFunction: IAFXFunctionDeclInstruction = null;

            switch(this._eExtractExprType){
				case EExtractExprType.k_Header:
					pFunction = Effect.findSystemFunction("extractHeader", null);
					break;
        
				case EExtractExprType.k_Float:
				case EExtractExprType.k_Int:
				case EExtractExprType.k_Bool:
					pFunction = Effect.findSystemFunction("extractFloat", null);
					break;

				case EExtractExprType.k_Float2:
				case EExtractExprType.k_Int2:
				case EExtractExprType.k_Bool2:
					pFunction = Effect.findSystemFunction("extractFloat2", null);
					break;

				case EExtractExprType.k_Float3:
				case EExtractExprType.k_Int3:
				case EExtractExprType.k_Bool3:
					pFunction = Effect.findSystemFunction("extractFloat3", null);
					break;

				case EExtractExprType.k_Float4:
				case EExtractExprType.k_Int4:
				case EExtractExprType.k_Bool4:
					pFunction = Effect.findSystemFunction("extractFloat4", null);
					break;

				case EExtractExprType.k_Float4x4:
					pFunction = Effect.findSystemFunction("extractFloat4x4", null);
					break;
            }

            return pFunction;
        }

		initExtractExpr(pExtractType: IAFXVariableTypeInstruction,
					    pPointer: IAFXVariableDeclInstruction,
					    pBuffer: IAFXVariableDeclInstruction,
					    sPaddingExpr: string, pOffsetVar: IAFXVariableDeclInstruction): void {
			
			this._pPointer = pPointer;
			this._pBuffer = pBuffer;
			this._sPaddingExpr = sPaddingExpr;
			this._pOffsetVar = pOffsetVar;
			this.setType(pExtractType);

            if (pExtractType.isEqual(Effect.getSystemType("float"))) {
            	this._eExtractExprType = EExtractExprType.k_Float;
                this._sExtractFunction += "A_extractFloat(";
            }
            else if(pExtractType.isEqual(Effect.getSystemType("ptr"))){
                this._eExtractExprType = EExtractExprType.k_Float;
                this._sExtractFunction += "A_extractFloat(";
            }
            else if(pExtractType.isEqual(Effect.getSystemType("video_buffer_header"))){
            	this._eExtractExprType = EExtractExprType.k_Header;
            	this._sExtractFunction += "A_extractTextureHeader(";
            }
            else if (pExtractType.isEqual(Effect.getSystemType("bool"))){
                this._eExtractExprType = EExtractExprType.k_Bool;
                this._sExtractFunction += "bool(A_extractFloat(";
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("int"))) {
            	this._eExtractExprType = EExtractExprType.k_Int;
                this._sExtractFunction += ("int(A_extractFloat(");
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("float2"))) {
            	this._eExtractExprType = EExtractExprType.k_Float2;
                this._sExtractFunction += ("A_extractVec2(");
            }
            else if (pExtractType.isEqual(Effect.getSystemType("float3"))) {
            	this._eExtractExprType = EExtractExprType.k_Float3;
                this._sExtractFunction += ("A_extractVec3(");
            }
            else if (pExtractType.isEqual(Effect.getSystemType("float4"))) {
            	this._eExtractExprType = EExtractExprType.k_Float4;
                this._sExtractFunction += ("A_extractVec4(");
            }
            else if (pExtractType.isEqual(Effect.getSystemType("int2"))) {
            	this._eExtractExprType = EExtractExprType.k_Int2;
                this._sExtractFunction += ("ivec2(A_extractVec2(");
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("int3"))) {
            	this._eExtractExprType = EExtractExprType.k_Int3;
                this._sExtractFunction += ("ivec3(A_extractVec3(");
                this._bNeedSecondBracket = true;  
            }
            else if (pExtractType.isEqual(Effect.getSystemType("int4"))) {
            	this._eExtractExprType = EExtractExprType.k_Int4;
                this._sExtractFunction += ("ivec4(A_extractVec4(");
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("bool2"))) {
            	this._eExtractExprType = EExtractExprType.k_Bool2;
                this._sExtractFunction += ("bvec2(A_extractVec2(");
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("bool3"))) {
            	this._eExtractExprType = EExtractExprType.k_Bool3;
                this._sExtractFunction += ("bvec3(A_extractVec3(");
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("bool4"))) {
            	this._eExtractExprType = EExtractExprType.k_Bool4;
                this._sExtractFunction += ("bvec4(A_extractVec4(");
                this._bNeedSecondBracket = true;
            }
            else if (pExtractType.isEqual(Effect.getSystemType("float4x4"))) {
            	this._eExtractExprType = EExtractExprType.k_Float4x4;
                this._sExtractFunction += ("A_extractMat4(");
            }
            else {
                this.setError(EFFECT_UNSUPPORTED_EXTRACT_BASE_TYPE, { typeName: pExtractType.getHash() });
            }
		}

		addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap,
                    eUsedMode?: EVarUsedMode = EVarUsedMode.k_Undefined): void {
			var pPointerType: IAFXVariableTypeInstruction = this._pPointer.getType();
			var pBufferType: IAFXVariableTypeInstruction = this._pBuffer.getType();

			var pInfo: IAFXTypeUseInfoContainer = pUsedDataCollector[pPointerType._getInstructionID()];

			if(!isDef(pInfo)){
				pInfo = <IAFXTypeUseInfoContainer>{
					type: pPointerType,
					isRead: false,
					isWrite: false,
					numRead: 0,
					numWrite: 0,
					numUsed: 0
				}

				pUsedDataCollector[pPointerType._getInstructionID()] = pInfo;
			}

			pInfo.isRead = true;
			pInfo.numRead++;
			pInfo.numUsed++;

			pInfo = pUsedDataCollector[pBufferType._getInstructionID()];

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

			pInfo.isRead = true;
			pInfo.numRead++;
			pInfo.numUsed++;	   
        }

		toFinalCode(): string {
			var sCode: string = "";

			if(this._pBuffer.isDefinedByZero()){
				switch(this._eExtractExprType){
					case EExtractExprType.k_Header:
						sCode = "A_TextureHeader(0.,0.,0.,0.)";
						break;

					case EExtractExprType.k_Float:
						sCode = "0.";
						break;
					case EExtractExprType.k_Int:
						sCode = "0";
						break;
					case EExtractExprType.k_Bool:
						sCode = "false";
						break;

					case EExtractExprType.k_Float2:
						sCode = "vec2(0.)";
						break;
					case EExtractExprType.k_Int2:
						sCode = "ivec2(0)";
						break;
					case EExtractExprType.k_Bool2:
						sCode = "bvec2(false)";
						break;

					case EExtractExprType.k_Float3:
						sCode = "vec3(0.)";
						break;
					case EExtractExprType.k_Int3:
						sCode = "ivec3(0)";
						break;
					case EExtractExprType.k_Bool3:
						sCode = "bvec3(false)";
						break;

					case EExtractExprType.k_Float4:
						sCode = "vec4(0.)";
						break;
					case EExtractExprType.k_Int4:
						sCode = "ivec4(0)";
						break;
					case EExtractExprType.k_Bool4:
						sCode = "bvec4(false)";
						break;

					case EExtractExprType.k_Float4x4:
						sCode = "mat4(0.)";
						break;
				}
			}
			else {
				sCode = this._sExtractFunction;
				sCode += this._pBuffer._getVideoBufferSampler().getNameId().toFinalCode();
				sCode += "," + this._pBuffer._getVideoBufferHeader().getNameId().toFinalCode();
				if(this._eExtractExprType !== EExtractExprType.k_Header) {
					sCode += "," + this._pPointer.getNameId().toFinalCode() + this._sPaddingExpr;

					if(!isNull(this._pOffsetVar)){
						sCode += "+" + this._pOffsetVar.getNameId().toFinalCode();	
					}	
				}
				sCode += ")";
				if(this._bNeedSecondBracket){
					sCode += ")";
				}
			}

			return sCode;
		}

		clone(pRelationMap?: IAFXInstructionMap): ExtractExprInstruction {
			var pClone: ExtractExprInstruction = <ExtractExprInstruction>super.clone(pRelationMap);
			pClone._setCloneParams(this._pPointer.clone(pRelationMap), this._pBuffer, this._eExtractExprType,
								   this._sPaddingExpr, this._sExtractFunction, this._bNeedSecondBracket);
			return pClone;
		}

		_setCloneParams(pPointer: IAFXVariableDeclInstruction,
						pBuffer: IAFXVariableDeclInstruction,
						eExtractExprType: EExtractExprType,
						sPaddingExpr: string,
						sExtractFunction: string,
						bNeedSecondBracket: bool): void {
			this._pPointer = pPointer;
			this._pBuffer = pBuffer;
			this._eExtractExprType = eExtractExprType;
			this._sPaddingExpr = sPaddingExpr;
			this._sExtractFunction = sExtractFunction;
			this._bNeedSecondBracket = bNeedSecondBracket;
		}
	}
}

#endif