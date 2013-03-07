#ifndef AFXINSTRUCTION_TS
#define AFXINSTRUCTION_TS

#include "IAFXInstruction.ts"
#include "fx/EffectErrors.ts"
#include "fx/EffectUtil.ts"
#include "IParser.ts"
#include "fx/Effect.ts"

module akra.fx {
    export function getEffectBaseType(sTypeName: string): SystemTypeInstruction {
    	return !isNull(Effect.pSystemTypes[sTypeName]) ? (Effect.pSystemTypes[sTypeName] || null) : null;
    }

    export function isSamplerType(pType: IAFXVariableTypeInstruction): bool {
    	return pType.isEqual(getEffectBaseType("sampler")) ||
    		   pType.isEqual(getEffectBaseType("sampler2D")) ||
    		   pType.isEqual(getEffectBaseType("samplerCUBE")) ||
    		   pType.isEqual(getEffectBaseType("video_buffer"));
    }

    #define UNDEFINE_LENGTH 0xffffff
    #define UNDEFINE_SIZE 0xffffff
    #define UNDEFINE_SCOPE 0xffffff
    #define UNDEFINE_PADDING 0xffffff
    #define UNDEFINE_NAME "undef"

	export class Instruction implements IAFXInstruction{
		protected _pParentInstruction: IAFXInstruction = null;
		protected _sOperatorName: string = null;
		protected _pInstructionList: IAFXInstruction[] = null;
		protected _nInstructions: uint = 0;
		protected readonly _eInstructionType: EAFXInstructionTypes = 0;
		protected _pLastError: IAFXInstructionError = null;
		protected _bErrorOccured: bool = false;
		protected _iInstructionID: uint = 0;
		protected _iScope: uint = UNDEFINE_SCOPE;
		private static _nInstructionCounter: uint = 0;

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

		inline _getInstructionType(): EAFXInstructionTypes {
			return this._eInstructionType;
		}

		inline _getInstructionID(): uint {
			return this._iInstructionID;
		}

		_getScope(): uint {
			return this._iScope !== UNDEFINE_SCOPE ? this._iScope : 
						!isNull(this.getParent()) ? this.getParent()._getScope() : UNDEFINE_SCOPE;
		}

        inline _setScope(iScope: uint): void {
        	this._iScope = iScope;
        }

        inline _isInGlobalScope(): bool{
        	return this._getScope() === 0;
        }

		inline getLastError(): IAFXInstructionError {
			return this._pLastError;
		}

		inline setError(eCode: uint, pInfo?: any = null): void {
			this._pLastError.code = eCode;
			this._pLastError.info = pInfo;
			this._bErrorOccured = true;
		}

		inline clearError(): void {
			this._bErrorOccured = false;
			this._pLastError.code = 0;
			this._pLastError.info = null;
		}

		inline isErrorOccured(): bool {
			return this._bErrorOccured;
		}

		constructor(){
			this._iInstructionID = Instruction._nInstructionCounter++;
			this._pParentInstruction = null;
			this._sOperatorName = null;
			this._pInstructionList = null;
			this._nInstructions = 0;
			this._eInstructionType = EAFXInstructionTypes.k_Instruction;
			this._pLastError = {code: 0, info: null};
		}

		push(pInstruction: IAFXInstruction, isSetParent?: bool = false): void {
			if(!isNull(this._pInstructionList)){
				this._pInstructionList[this._nInstructions] = pInstruction;
				this._nInstructions += 1;
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
    		if(this._bErrorOccured){
    			return false;
    		}
    		else {
    			return true;
    		}
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

    	toFinalCode(): string {
    		return "";
    	}

    	clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXInstruction {
    		if(isDef(pRelationMap[this._getInstructionID()])){
    			return pRelationMap[this._getInstructionID()];
    		}

    		var pNewInstruction: IAFXInstruction = new this["constructor"]();
    		var pParent: IAFXInstruction = this.getParent() || null;

    		if(!isNull(pParent) && isDef(pRelationMap[pParent._getInstructionID()])){
    			pParent = pRelationMap[pParent._getInstructionID()];
    		}

    		pNewInstruction.setParent(pParent);
    		pRelationMap[this._getInstructionID()] = pNewInstruction;

    		for(var i: uint = 0; i < this._pInstructionList.length; i++){
    			pNewInstruction.push(this._pInstructionList[i].clone(pRelationMap));
    		}

    		pNewInstruction.setOperator(this.getOperator());

    		return pNewInstruction;
    	}
	}

	export class InstructionCollector extends Instruction {
		constructor(){
			super();
			this._pInstructionList = [];
			this._eInstructionType = EAFXInstructionTypes.k_InstructionCollector;
		}

		toFinalCode(): string {
    		var sCode: string = "";
    		for(var i: uint = 0; i < this._nInstructions; i++){
    			sCode += this.getInstructions()[i].toFinalCode();
    		}

    		return sCode;
    	}
	}

	export class SimpleInstruction extends Instruction implements IAFXSimpleInstruction{
		private _sValue: string = "";
		
		constructor(sValue: string){
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_SimpleInstruction;

			this._sValue = sValue;
		}

		inline setValue(sValue: string): void {
			this._sValue = sValue;
		}

		inline isValue(sValue: string): bool {
			return (this._sValue === sValue);
		}

		toString(): string{
			return this._sValue;
		}

		toFinalCode(): string{
			return this._sValue;
		}
	}

	

	export class TypedInstruction extends Instruction implements IAFXTypedInstruction {
		protected _pType: IAFXTypeInstruction;

		constructor(){
			super();
			this._pType = null;
			this._eInstructionType = EAFXInstructionTypes.k_TypedInstruction;
		}

		getType(): IAFXTypeInstruction {
			return this._pType;
		}

		setType(pType: IAFXTypeInstruction): void {
			this._pType = pType;
		}

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXTypedInstruction {
			var pClonedInstruction: IAFXTypedInstruction = <IAFXTypedInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setType(this._pType.clone(pRelationMap));
			return pClonedInstruction;
		}
	}

	

	export class DeclInstruction extends TypedInstruction implements IAFXDeclInstruction {
		protected _sSemantic: string = "";
		protected _pAnnotation: IAFXAnnotationInstruction = null;
		protected _bForPixel: bool = true;
		protected _bForVertex: bool = true;

		constructor(){
			super();
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

		inline getSemantic(): string {
			return this._sSemantic;
		}

		inline _isForAll(): bool{
			return this._bForVertex && this._bForPixel;
		}
        inline _isForPixel(): bool{
        	return this._bForPixel;
        }
        inline _isForVertex(): bool{
        	return this._bForVertex;
        }

        inline _setForAll(canUse: bool): void{
        	this._bForVertex = canUse;
        	this._bForPixel = canUse;
        }
        inline _setForPixel(canUse: bool): void{
    	    this._bForPixel = canUse;
    	}
        inline _setForVertex(canUse: bool): void{
        	this._bForVertex = canUse;
        }

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXDeclInstruction {
			var pClonedInstruction: IAFXDeclInstruction = <IAFXDeclInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setSemantic(this._sSemantic);
			pClonedInstruction.setAnnotation(this._pAnnotation);
			return pClonedInstruction;
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
			this._sRealName = sName + "R";
		}

		inline setRealName(sRealName: string): void{
			this._sRealName = sRealName;
		}

		toString(): string {
			return this._sRealName;
		}

		toFinalCode(): string {
			return this._sRealName;
		}

		clone(pRelationMap?: IAFXInstructionMap): IdInstruction {
			var pClonedInstruction: IdInstruction = <IdInstruction>(super.clone(pRelationMap));
			pClonedInstruction.setName(this._sName);
			pClonedInstruction.setRealName(this._sRealName);
			return pClonedInstruction;
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

		inline isValue(sTestValue: string): bool {
			return this._sValue === sTestValue;
		}

		toString(): string {
			return this._sValue;
		}

		toFinalCode(): string{
			return this._sValue;
		}
	}


	export class AnnotationInstruction extends Instruction implements IAFXAnnotationInstruction {
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_AnnotationInstruction;
		}
	}

	

	export class TechniqueInstruction extends DeclInstruction implements IAFXTechniqueInstruction {
		private _sName: string = "";
		private _hasComplexName: bool = false;
		private _pParseNode: IParseNode = null;
		private _pSharedVariableList: IAFXVariableDeclInstruction[] = null;

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_TechniqueInstruction;
			this._pSharedVariableList = [];
		}

		setName(sName: string, isComplexName: bool): void {
			this._sName = sName;
			this._hasComplexName = isComplexName;
		}

		getName(): string {
			return this._sName;
		}

        hasComplexName(): bool{
        	return this._hasComplexName;
        }

        getSharedVariables(): IAFXVariableDeclInstruction[] {
        	return this._pSharedVariableList;
        }

        _setParseNode(pNode: IParseNode): void{
        	this._pParseNode = pNode;
        }
        
        _getParseNode(): IParseNode{
        	return this._pParseNode;
        }

		addPass(): void {

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