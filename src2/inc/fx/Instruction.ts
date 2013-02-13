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
    #define UNDEFINE_NAME "undef"

	export class Instruction implements IAFXInstruction{
		protected _pParentInstruction: IAFXInstruction = null;
		protected _sOperatorName: string = null;
		protected _pInstructionList: IAFXInstruction[] = null;
		protected _nInstuctions: uint = 0;
		protected readonly _eInstructionType: EAFXInstructionTypes = 0;
		protected _pLastError: IAFXInstructionError = null;
		protected _iInstructionID: uint = 0;
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

		inline getLastError(): IAFXInstructionError {
			return this._pLastError;
		}

		inline setError(eCode: uint, pInfo: any): void {
			this._pLastError.code = eCode;
			this._pLastError.info = pInfo;
		}

		constructor(){
			this._iInstructionID = Instruction._nInstructionCounter++;
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
	}

	export class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
		// EMPTY_OPERATOR TypeInstruction ArrayInstruction PointerInstruction
		private _isWritable: bool = null;
		private _isReadable: bool = null;

		private _sHash: string = "";
		private _sStrongHash: string = "";
		private _isArray: bool = false;
		private _isPointer: bool = false;
		private _isPointIndex: bool = null;
		private _isConst: bool = null;
		private _iLength: uint = UNDEFINE_LENGTH;
		
		private _pArrayIndexExpr: IAFXExprInstruction = null;
		private _pArrayElementType: IAFXVariableTypeInstruction = null;

		private _pFieldIdMap: IAFXIdExprMap = null;
		private _pUsedFieldMap: IAFXVarUsedModeMap = null;

		private _pVideoBuffer: IAFXVariableDeclInstruction = null;
		private _pNextPointIndex: IAFXVariableDeclInstruction = null;
		private _nPointerDim: uint = 0;
		private _pPointerList: IAFXVariableDeclInstruction[] = null;

		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_VariableTypeInstruction;
		}	 

		pushInVariableType(pVariableType: IAFXTypeInstruction): bool {
			if(this._nInstuctions > 0){
				return false;
			}
			else {
				var pUsageType: IAFXUsageTypeInstruction = new UsageTypeInstruction();
				pUsageType.push(pVariableType, false);

				this.push(pUsageType, true);
				return false;
			}
		}

		isolateType(): IAFXVariableTypeInstruction {
			var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			var pUsageType: IAFXUsageTypeInstruction = new UsageTypeInstruction();
			
			pVariableType.push(pUsageType, true);
			pUsageType.push(this, false);

			return pVariableType;
		}

		addArrayIndex(pExpr: IAFXExprInstruction): void {
			//TODO: add support for v[][10]
			
			this._pArrayElementType = new VariableTypeInstruction();
			this._pArrayElementType.push(this._pInstructionList[0], false);
			this._pArrayElementType.setParent(this);

			this._pArrayIndexExpr = pExpr;

			this._iLength = this._pArrayIndexExpr.evaluate() || UNDEFINE_LENGTH;

			this._isArray = true;
		}

		addPointIndex(): void {
			this._nPointerDim++;
			this._isPointer = true;
		}

		getPointDim(): uint {
			return this._nPointerDim || 
				   (this.getSubType()._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction) ? 
				   (<IAFXVariableTypeInstruction>this.getSubType()).getPointDim() : 0; 
		}

		setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void {
			if(this.isPointIndex()){
				(<IAFXVariableTypeInstruction>this._pParentInstruction).setVideoBuffer(pBuffer);
				return;
			}

			this._pVideoBuffer = pBuffer;
			
			if(!this.isComplex()){
				return;
			}

			var pFieldNameList: string[] = this.getFieldNameList();

			for(var i: uint = 0; i < pFieldNameList.length; i++){
				var pFieldType: IAFXVariableTypeInstruction = this.getFieldType(pFieldNameList[i]);
				
				if(pFieldType.isPointer()){
					pFieldType.setVideoBuffer(pBuffer);
				}
			}
		}

		getVideoBuffer(): IAFXVariableDeclInstruction {
			if(this.isPointIndex()) {
				return (<IAFXVariableTypeInstruction>this._pParentInstruction).getVideoBuffer();
			}

			return this._pVideoBuffer;
		}

		hasVideoBuffer(): bool {
			return !isNull(this.getVideoBuffer());
		}

		inline isBase(): bool {
			return this.getSubType().isBase() && this._isArray === false;
		}

		inline isArray(): bool {
			return this._isArray || 
				   (this.getSubType().isArray());
		}

		inline isNotBaseArray(): bool {
			return this._isArray || (this.getSubType().isNotBaseArray());
		}

		inline isComplex(): bool {
			return this.getSubType().isComplex();
		}

		isEqual(pType: IAFXTypeInstruction): bool {
			if (this.isArray() && pType.isArray() && 
				pType._getInstructionType() !== EAFXInstructionTypes.k_SystemTypeInstruction &&
				(this.getLength() !== pType.getLength() ||
				 this.getLength() === UNDEFINE_LENGTH ||
				 pType.getLength() === UNDEFINE_LENGTH)){
				return false;
			}

			if(this.getHash() !== pType.getHash()){
				return false;
			}

			return true;
		}

		inline isConst(): bool {
			if(isNull(this._isConst)){
				this._isConst = (<IAFXUsageTypeInstruction>this._pInstructionList[0]).hasUsage("const");
			}

			return this._isConst;
		}

		isWritable(): bool {
			if(!isNull(this._isWritable)){
				return this._isWritable;
			}

			if(this.isArray() && !this.isBase()){
				this._isWritable = false;
			}
			else {
				this._isWritable = this.getSubType().isWritable();
			}

			return this._isWritable;
		}

		isReadable(): bool {
			if(!isNull(this._isReadable)){
				return this._isReadable;
			}

			if(this.getUsageType().hasUsage("out")){
				this._isReadable = false;
			}
			else{
				this._isReadable = this.getSubType().isReadable();
			}

			return this._isReadable;
		}

		inline _canWrite(isWritable: bool): void {
			this._isWritable = isWritable;
		}

		inline _canRead(isReadable: bool): void {
			this._isReadable = isReadable;
		}

		_containArray(): bool{
			return this.isBase() ? false : (<IAFXVariableTypeInstruction>this.getSubType())._containArray();
		}

        _containSampler(): bool{
        	return this.isBase() ? false : (<IAFXVariableTypeInstruction>this.getSubType())._containSampler();
        }

		isPointer(): bool {
			return this._isPointer || 
				   (this.getSubType()._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction &&
				   	(<IAFXVariableTypeInstruction>this.getSubType()).isPointer());
		}

		isPointIndex(): bool{
			if(isNull(this._isPointIndex)){
				this._isPointIndex = this.isEqual(getEffectBaseType("ptr"));
			}

			return this._isPointIndex;
		}

		getHash(): string {
			if(this._sHash === ""){
				this.calcHash();
			}

			return this._sHash;
		}

		getStrongHash(): string {
			if(this._sStrongHash === "") {
				this.calcStrongHash();
			}

			return this._sStrongHash;
		}

		inline getSubType(): IAFXTypeInstruction {
			return (<IAFXUsageTypeInstruction>this._pInstructionList[0]).getTypeInstruction();
		}

		hasUsage(sUsage: string): bool {
			return (<IAFXUsageTypeInstruction>this._pInstructionList[0]).hasUsage(sUsage);
		}

		hasField(sFieldName: string): bool {
			return this.getSubType().hasField(sFieldName);
		}

		hasFieldWithSematic(sSemantic: string): bool {
			if(!this.isComplex()){
				return false;
			}

			return this.getSubType().hasFieldWithSematic(sSemantic);
		}

		hasAllUniqueSemantics(): bool {
			if(!this.isComplex()){
				return false;
			}

			return this.getSubType().hasAllUniqueSemantics();	
		}

		hasFieldWithoutSemantic(): bool {
			if(!this.isComplex()){
				return false;
			}

			return this.getSubType().hasFieldWithoutSemantic();		
		}

		getField(sFieldName: string, isCreateExpr?: bool): IAFXIdExprInstruction {
			if(!this.hasField(sFieldName)){
				return null;
			}

			if(isNull(this._pFieldIdMap)) {
				this._pFieldIdMap = <IAFXIdExprMap>{};
			}

			if(isDef(this._pFieldIdMap[sFieldName])){
				return this._pFieldIdMap[sFieldName];
			}

			var pUsageType: IAFXUsageTypeInstruction = <IAFXUsageTypeInstruction>this._pInstructionList[0];
			var pSubType: IAFXTypeInstruction = pUsageType.getTypeInstruction();
			var pFieldIdExpr: IAFXIdExprInstruction = pSubType.getField(sFieldName);

			var pFieldType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			pFieldType.pushInVariableType(pFieldIdExpr.getType());
			pFieldType.setParent(this);

			pFieldIdExpr.setType(pFieldType);
			this._pFieldIdMap[sFieldName] = pFieldIdExpr;
			
			return pFieldIdExpr;
		}

		getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
			return <IAFXVariableTypeInstruction>this.getField(sFieldName, false).getType();
		}
 		
 		getFieldNameList(): string[] {
 			return this.getSubType().getFieldNameList();
 		}

 		getBaseType(): IAFXTypeInstruction{
 			return this.getSubType().getBaseType();
 		}

		getPointer(): IAFXVariableDeclInstruction {
			if(!this.isPointer() && !this.hasVideoBuffer()){
				return null;
			}

			if(!isNull(this._pNextPointIndex)){
				return this._pNextPointIndex;
			}

			if(this.isPointIndex()){
				return null;
			}

			this.initializePointers();

			return this._pNextPointIndex;
		}

		initializePointers(): void {
			this._pPointerList = [];

			for(var i:uint = 0; i < this._nPointerDim; i++){
				var pPointer: IAFXVariableDeclInstruction = new VariableDeclInstruction();
				var pPointerType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
				var pPointerId: IAFXIdInstruction = new IdInstruction();

				pPointer.push(pPointerType, true);
				pPointer.push(pPointerId, true);

				pPointerType.pushInVariableType(getEffectBaseType("ptr"));
				pPointerId.setName(UNDEFINE_NAME);

				if(i > 0) {
					(this._pPointerList[i - 1].getType())._setNextPointer(pPointer);
				}

				pPointer.setParent(this);
			}

			this._pNextPointIndex = this._pPointerList[0];
		}

		getSize(): uint {
			if(this._isArray){
				var iSize: uint = this._pArrayElementType.getSize();
				if (this._iLength === UNDEFINE_LENGTH ||
					iSize === UNDEFINE_SIZE){
					return UNDEFINE_SIZE;
				}
				else{
					return iSize * this._iLength;
				}
			}
			else {
				return this.getSubType().getSize();
			}
		}

		getLength(): uint {
			if(!this.isArray()){
				this._iLength = 0;
				return 0;
			}

			if(this._iLength === UNDEFINE_LENGTH){
				var isEval: bool = this._pArrayIndexExpr.evaluate();
				
				if(isEval) {
					this._iLength = <uint>this._pArrayIndexExpr.getEvalValue();
				}
			}

			return this._iLength;
		}

		getArrayElementType(): IAFXVariableTypeInstruction {
			if(!this.isArray()){
				return null;
			}

			if(isNull(this._pArrayElementType)){
				this._pArrayElementType = new VariableTypeInstruction();
				this._pArrayElementType.pushInVariableType(this.getSubType().getArrayElementType());
				this._pArrayElementType.setParent(this);
			}

			return this._pArrayElementType;
		}

		wrap(): IAFXVariableTypeInstruction {
			var pCloneType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			pCloneType.pushInVariableType(this);

			return pCloneType;
		}

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXVariableTypeInstruction {
			if(isDef(pRelationMap[this._getInstructionID()])){
    			return <IAFXVariableTypeInstruction>pRelationMap[this._getInstructionID()];
    		}

    		if(this._pParentInstruction === null || 
    		   !isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) ||
    		   pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction) {
    		   	//pRelationMap[this._getInstructionID()] = this;
    			return this;
    		}

			var pClone: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>super.clone(pRelationMap);

			pClone._canWrite(this._isWritable);
			pClone._canRead(this._isReadable);
			pClone._setCloneHash(this._sHash, this._sStrongHash);
			
			if(this._isArray){
				this._setCloneArrayIndex(this._pArrayElementType.clone(pRelationMap),
										 this._pArrayIndexExpr.clone(pRelationMap),
										 this._iLength);
			}

			if(this._isPointer){
				var pClonePointerList: IAFXVariableDeclInstruction[] = new Array(this._pPointerList.length);
				
				for(var i: uint = 0; i < this._pPointerList.length; i++){
					pClonePointerList[i] = this._pPointerList[i].clone(pRelationMap);
					
					if(i > 0) {
						(pClonePointerList[i - 1].getType())._setNextPointer(pClonePointerList[i]);
					}
				}

				this._setClonePointeIndexes(this._nPointerDim, pClonePointerList);
			}

			if(!isNull(this._pFieldIdMap)){
				var sFieldName: string;
				var pCloneFieldMap: IAFXIdExprMap = <IAFXIdExprMap>{};

				for(sFieldName in this._pFieldIdMap){
					pCloneFieldMap[sFieldName] = this._pFieldIdMap[sFieldName].clone(pRelationMap);
				}

				this._setCloneFields(pCloneFieldMap);
			}

			return pClone;
		}

		inline _setNextPointer(pNextPointIndex: IAFXVariableDeclInstruction): void {
			this._pNextPointIndex = pNextPointIndex;
		}

		_setCloneHash(sHash: string, sStrongHash: string): void {
			this._sHash = sHash;
			this._sStrongHash = sStrongHash;
		}

        _setCloneArrayIndex(pElementType: IAFXVariableTypeInstruction, 
                            pIndexExpr: IAFXExprInstruction, iLength: uint): void {
        	this._isArray = true;
        	this._pArrayElementType = pElementType;
        	this._pArrayIndexExpr = pIndexExpr;
        	this._iLength = iLength;
        }

        _setClonePointeIndexes(nDim: uint, pPointerList: IAFXVariableDeclInstruction[]): void {
        	this._isPointer = true;
        	this._nPointerDim = nDim;
        	this._pPointerList = pPointerList;
        	this._pNextPointIndex = this._pPointerList[0];
        }

        _setCloneFields(pFieldMap: IAFXIdExprMap): void {
        	this._pFieldIdMap = pFieldMap;
        }

		private calcHash(): void {
			var sHash: string = this.getSubType().getHash();
			
			if(this.isArray()){
				sHash += "[";

				var iLength: uint = this.getLength();

				if(iLength === UNDEFINE_LENGTH){
					sHash += "undef"
				}
				else{
					sHash += iLength.toString();
				}

				sHash += "]";
			}

			this._sHash = sHash;
		}

		private calcStrongHash(): void {

		}

		private inline getUsageType(): IAFXUsageTypeInstruction {
			return <IAFXUsageTypeInstruction>this._pInstructionList[0];
		}
	}

	export class UsageTypeInstruction extends Instruction implements IAFXUsageTypeInstruction {
		// EMPTY_OPERATOR KeywordInstruction ... KeywordInstruction IAFXTypeInstruction
		
		private _pUsageList: string[] = null;
		private _pType: IAFXTypeInstruction = null;

		constructor() {
			super();
			this._pUsageList = [];
			this._eInstructionType = EAFXInstructionTypes.k_UsageTypeInstruction;
		}

		inline getTypeInstruction(): IAFXTypeInstruction {
			return this._pType;
		} 

		setTypeInstruction(pType: IAFXTypeInstruction): bool {
			//TODO: check compatibility test for type and usages 
			this._pType = pType;
			return true;
		}

		hasUsage(sUsage: string): bool {
			for(var i: uint = 0; i < this._pUsageList.length; i++) {
				if(this._pUsageList[i] === sUsage){
					return true;
				}
			}

			if(this._pType._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction){
				return (<IAFXVariableTypeInstruction>this._pType).hasUsage(sUsage);
			}

			return false;
		}

		addUsage(sUsage: string): bool {
			//TODO: check compatibility test for usage and usage
			this._pUsageList.push(sUsage);
			return true;
		}	

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXUsageTypeInstruction{
			var pClone: IAFXUsageTypeInstruction = <IAFXUsageTypeInstruction>super.clone(pRelationMap);
			
			for(var i: uint = 0; i < this._pUsageList.length; i++){
				pClone.addUsage(this._pUsageList[i]);
			}

			pClone.setTypeInstruction(this._pType.clone(pRelationMap));

			return pClone;
		}
	}


	export class SystemTypeInstruction extends Instruction implements IAFXTypeInstruction {
		private _sName: string = "";
		private _sRealName: string = "";
		private _pElementType: IAFXTypeInstruction = null;
		private _iLength: uint = 1;
		private _iSize: uint = null;
		private _pFieldIdMap: IAFXIdExprMap = null;
		private _isArray: bool = false;
		private _isWritable: bool = true;
		private _isReadable: bool = true;
		private _pFieldNameList: string[] = null;
		private _pWrapVariableType: IAFXVariableTypeInstruction = null;

		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_SystemTypeInstruction;
			this._pFieldIdMap = {};
			this._pWrapVariableType = new VariableTypeInstruction();
			this._pWrapVariableType.pushInVariableType(this);
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

		addIndex(pType: IAFXTypeInstruction, iLength: uint): void {
			this._pElementType = pType;
			this._iLength = iLength;
			this._iSize = iLength * pType.getSize();
			this._isArray = true;
		}

		addField(sFieldName: string, pType: IAFXTypeInstruction, isWrite?: bool = true,
				 sRealFieldName?: string = sFieldName): void {
			
			var pFieldType: VariableTypeInstruction = new VariableTypeInstruction();
			pFieldType.push(new UsageTypeInstruction(), true);
			pFieldType.getInstructions()[0].push(pType, false);
			pFieldType._canWrite(isWrite);

			var pFieldId: IAFXIdInstruction = new IdInstruction();
			pFieldId.setName(sFieldName);
			pFieldId.setRealName(sRealFieldName);	

			var pFieldIdExpr: IAFXIdExprInstruction = new IdExprInstruction();
			pFieldIdExpr.push(pFieldId, true);
			pFieldIdExpr.setType(pFieldType);
			pFieldIdExpr.setParent(this);

			this._pFieldIdMap[sFieldName] = pFieldIdExpr;

			if(isNull(this._pFieldNameList)){
				this._pFieldNameList = [];
			}

			this._pFieldNameList.push(sFieldName);
		}

		inline isBase(): bool {
			return true;
		}

		inline isArray(): bool {
			return this._isArray;
		}

		inline isNotBaseArray(): bool {
			return false;
		}

		inline isComplex(): bool {
			return false;
		}

		inline isEqual(pType: IAFXTypeInstruction): bool {
			return this.getHash() === pType.getHash();
		}

		inline isConst(): bool {
			return false;
		}

		inline isWritable(): bool {
			return this._isWritable;
		}

		inline isReadable(): bool {
			return this._isReadable;
		}

		inline _canWrite(isWritable: bool): void {
			this._isWritable = isWritable;
		}

		inline _canRead(isReadable: bool): void {
			this._isReadable = isReadable;
		}

		inline getHash(): string {
			return this._sName;
		}

		inline getStrongHash(): string {
			return this._sName;
		}

		//inline getNameId()
		inline hasField(sFieldName: string): bool {
			return isDef(this._pFieldIdMap[sFieldName]);
		}

		hasFieldWithSematic(sSemantic: string): bool {
			return false;
		}

		hasAllUniqueSemantics(): bool {
			return false;
		}

		hasFieldWithoutSemantic(): bool {
			return false;	
		}

		inline getField(sFieldName: string, isCreateExpr?: bool): IAFXIdExprInstruction {
			return isDef(this._pFieldIdMap[sFieldName]) ? this._pFieldIdMap[sFieldName] : null;
		}

		inline getFieldType(sFieldName: string): IAFXTypeInstruction {
			return isDef(this._pFieldIdMap[sFieldName]) ? this._pFieldIdMap[sFieldName].getType() : null;
		}

		inline getFieldNameList(): string[] {
			return this._pFieldNameList;
		}

		inline getSize(): uint {
			return this._iSize;
		}

		inline getBaseType(): IAFXTypeInstruction {
			return this;
		}

		inline getVariableType(): IAFXVariableTypeInstruction {
			return this._pWrapVariableType;
		}

		inline getArrayElementType(): IAFXTypeInstruction {
			return this._pElementType;
		}

		inline getLength(): uint {
			return this._iLength;
		}

		inline clone(pRelationMap?: IAFXInstructionMap): SystemTypeInstruction {
			return this;
		}
	}

	export class ComplexTypeInstruction extends Instruction implements IAFXTypeInstruction {
		private _sName: string = "";
		private _sRealName: string = "";

		private _sHash: string = "";
		private _sStrongHash: string = "";

		private _iSize: uint = 0;

		private _pFieldDeclMap: IAFXVariableDeclMap = null;
		private _pFieldIdMap: IAFXIdExprMap = null;
		private _pFieldDeclList: IAFXVariableDeclInstruction[] = null;
		private _pFieldNameList: string[] = null;

		private _pFieldDeclBySemanticMap: IAFXVariableDeclMap = null;
		private _hasAllUniqueSemantics: bool = true;
		private _hasFieldWithoutSemantic: bool = false;

		private _isContainArray: bool = false;
		private _isContainSampler: bool = false;
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_ComplexTypeInstruction;
		}

		addField(pVariable: IAFXVariableDeclInstruction): void {
			if(isNull(this._pFieldIdMap)){
				this._pFieldIdMap = {};
				this._pFieldDeclMap = {};
				this._pFieldNameList = [];
			}

			var sVarName: string = pVariable.getName();
			this._pFieldDeclMap[sVarName] = pVariable;

			var pVarIdExpr: IAFXIdExprInstruction = new IdExprInstruction();
			pVarIdExpr.push(pVariable.getNameId(), false);
			pVarIdExpr.setType(pVariable.getType());

			this._pFieldIdMap[sVarName] = pVarIdExpr;
			
			if(this._iSize !== UNDEFINE_SIZE){
				var iSize: uint = pVariable.getType().getSize();
				if(iSize !== UNDEFINE_SIZE){
					this._iSize += iSize;
				}
				else{
					this._iSize = UNDEFINE_SIZE;
				}
			}

			this._pFieldNameList.push(sVarName);

			var pType: IAFXVariableTypeInstruction = pVariable.getType();
			
			if(pType.isNotBaseArray() || pType._containArray()){
				this._isContainArray = true;
			}

			if(isSamplerType(pType) || pType._containSampler()){
				this._isContainSampler = true;
			}
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

		inline setWriteMode(isWrite: bool): void {
		}

		inline isBase(): bool {
			return false;
		}

		inline isArray(): bool {
			return false;
		}

		inline isNotBaseArray(): bool {
			return false;
		}

		inline isComplex(): bool {
			return true;
		}

		inline isWritable(): bool {
			return true;
		}

		inline isReadable(): bool {
			return true;
		}

		inline _containArray(): bool {
			return this._isContainArray;
		}

		inline _containSampler(): bool {
			return this._isContainSampler;
		}

		inline _canWrite(): void {
		}

		inline _canRead(): void {
		}

		inline isEqual(pType: IAFXTypeInstruction): bool {
			return this.getHash() === pType.getHash();
		}

		inline isConst(): bool {
			return false;
		}

		getHash(): string {
			if(this._sHash === ""){
				this.calcHash();
			}

			return this._sHash;
		}

		getStrongHash(): string {
			if(this._sStrongHash === ""){
				this.calcStrongHash();
			}

			return this._sStrongHash;
		}

		//inline getNameId()
		inline hasField(sFieldName: string): bool {
			return isDef(this._pFieldDeclMap[sFieldName]);
		}

		hasFieldWithSematic(sSemantic: string): bool {
			if(isNull(this._pFieldDeclBySemanticMap)) {
				this.analyzeSemantics();
			}

			return isDef(this._pFieldDeclBySemanticMap[sSemantic]);
		}

		hasAllUniqueSemantics(): bool {
			if(isNull(this._pFieldDeclBySemanticMap)) {
				this.analyzeSemantics();
			}
			return this._hasAllUniqueSemantics;
		}

		hasFieldWithoutSemantic(): bool {
			if(isNull(this._pFieldDeclBySemanticMap)) {
				this.analyzeSemantics();
			}
			return this._hasFieldWithoutSemantic;	
		}

		inline getField(sFieldName: string, isCreateExpr?: bool = true): IAFXIdExprInstruction {
			if(!isDef(this._pFieldDeclMap[sFieldName])){
				return null;
			}

			// if(isCreateExpr) {
			// 	var pVariable: IAFXVariableDeclInstruction = this._pFieldDeclMap[sFieldName];
			// 	var pVarIdExpr: IAFXIdExprInstruction = new IdExprInstruction();
			// 	var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			// 	pVariableType.pushInVariableType(pVariable.getType());

			// 	pVarIdExpr.push(pVariable.getNameId(), false);
			// 	pVarIdExpr.setType(pVariableType);

			// 	return pVarIdExpr;
			// }
			// else {
			return this._pFieldIdMap[sFieldName];
			// }
		}

		inline getFieldType(sFieldName: string): IAFXTypeInstruction {
			return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
		}

		inline getFieldNameList(): string[] {
			return this._pFieldNameList;
		}

		inline getSize(): uint {
			if(this._iSize === UNDEFINE_SIZE){
				this._iSize = this._calcSize();
			}
			return this._iSize;
		}

		inline getBaseType(): IAFXTypeInstruction {
			return null;
		}

		inline getArrayElementType(): IAFXTypeInstruction {
			return null;
		}

		inline getLength(): uint {
			return 0;
		}

		addFields(pFieldCollector: IAFXInstruction, isSetParent?: bool = true): void {
			this._pFieldDeclList = <IAFXVariableDeclInstruction[]>(pFieldCollector.getInstructions());

			for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
		    	this.addField(this._pFieldDeclList[i]);
		    	this._pFieldDeclList[i].setParent(this);
		    }
		}

		inline clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): ComplexTypeInstruction {
			if(this._pParentInstruction === null || 
    		   !isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) ||
    		   pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction){
    		   	//pRelationMap[this._getInstructionID()] = this;
    			return this;
    		}

    		var pClone: ComplexTypeInstruction = <ComplexTypeInstruction>super.clone(pRelationMap);

    		pClone._setCloneName(this._sName, this._sRealName);
    		pClone._setCloneHash(this._sHash, this._sStrongHash);
    		pClone._setCloneContain(this._isContainArray, this._isContainSampler);

    		var pFieldDeclList: IAFXVariableDeclInstruction[] = new Array(this._pFieldDeclList.length);
    		var pFieldNameList: string[] = new Array(this._pFieldNameList.length);
    		var pFieldDeclMap: IAFXVariableDeclMap = <IAFXVariableDeclMap>{};
    		var pFieldIdMap: IAFXIdExprMap = <IAFXIdExprMap>{};

    		for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
    			var pCloneVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i].clone(pRelationMap);
    			var sVarName: string = pCloneVar.getName();

    			pFieldDeclList[i] = pCloneVar;
    			pFieldNameList[i] = sVarName;
    			pFieldDeclMap[sVarName] = pCloneVar;
    			pFieldIdMap[sVarName] = this._pFieldIdMap[sVarName].clone(pRelationMap);
    		}

    		pClone._setCloneFields(pFieldDeclList, pFieldNameList,
				   				   pFieldDeclMap, pFieldIdMap);
    		pClone.setSize(this._iSize);
    		
			return pClone;
		}

		_setCloneName(sName: string, sRealName: string): void {
			this._sName = sName;
			this._sRealName = sRealName;
		}

		_setCloneHash(sHash: string, sStrongHash: string): void {
			this._sHash = sHash;
			this._sStrongHash = sStrongHash;
		}

		_setCloneContain(isContainArray: bool, isContainSampler: bool): void{
			this._isContainArray = isContainArray;
			this._isContainSampler = isContainSampler;
		}

		_setCloneFields(pFieldDeclList: IAFXVariableDeclInstruction[], pFieldNameList: string[],
				   		pFieldDeclMap: IAFXVariableDeclMap, pFieldIdMap: IAFXIdExprMap): void{
			this._pFieldDeclList = pFieldDeclList;
			this._pFieldNameList = pFieldNameList;
			this._pFieldDeclMap = pFieldDeclMap;
			this._pFieldIdMap = pFieldIdMap;
		}


		_calcSize(): uint {
			var iSize: uint = 0;

			for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
				var iFieldSize: uint = this._pFieldDeclList[i].getType().getSize();

				if(iFieldSize === UNDEFINE_SIZE){
					iSize = UNDEFINE_SIZE;
					break;
				}
				else{
					iSize += iFieldSize;
				}
			}

			return iSize;
		}

		private calcHash(): void {
			var sHash: string = "{";

			for(var i:uint = 0; i < this._pFieldDeclList.length; i++){
				sHash += this._pFieldDeclList[i].getType().getHash() + ";";
			}

			sHash += "}";

			this._sHash = sHash;
		}

		private calcStrongHash(): void {
			var sStrongHash: string = "{";

			for(var i:uint = 0; i < this._pFieldDeclList.length; i++){
				sStrongHash += this._pFieldDeclList[i].getType().getStrongHash() + ";";
			}

			sStrongHash += "}";

			this._sStrongHash = sStrongHash;
		}

		private analyzeSemantics(): void {
			this._pFieldDeclBySemanticMap = <IAFXVariableDeclMap>{};

			for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
				var pVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i];
				var sSemantic: string = pVar.getSemantic();

				if(sSemantic === ""){
					this._hasFieldWithoutSemantic = true;
				}

				if(isDef(this._pFieldDeclBySemanticMap[sSemantic])){
					this._hasAllUniqueSemantics = false;
				}

				this._pFieldDeclBySemanticMap[sSemantic] = pVar;

				this._hasFieldWithoutSemantic = this._hasFieldWithoutSemantic || pVar.getType().hasFieldWithoutSemantic();
				this._hasAllUniqueSemantics = !(this._hasAllUniqueSemantics) ? false : pVar.getType().hasAllUniqueSemantics();
			}

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

	export class IntInstruction extends ExprInstruction implements IAFXLiteralInstruction {
		private _iValue: int;
		/**
		 * EMPTY_OPERATOR EMPTY_ARGUMENTS
		 */
		constructor() {
			super();
			this._iValue = 0;
			this._pType = getEffectBaseType("int");
			this._eInstructionType = EAFXInstructionTypes.k_IntInstruction;
		}

		inline setValue(iValue: int): void{
			this._iValue = iValue;
		}

		toString(): string {
			return <string><any>this._iValue;
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
			this._pType = getEffectBaseType("float");
			this._eInstructionType = EAFXInstructionTypes.k_FloatInstruction;
		}

		inline setValue(fValue: float): void{
			this._fValue = fValue;
		}

		toString(): string {
			return <string><any>this._fValue;
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
			this._pType = getEffectBaseType("bool");
			this._eInstructionType = EAFXInstructionTypes.k_BoolInstruction;
		}

		inline setValue(bValue: bool): void{
			this._bValue = bValue;
		}

		toString(): string {
			return <string><any>this._bValue;
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
			this._pType = getEffectBaseType("string");
			this._eInstructionType = EAFXInstructionTypes.k_StringInstruction;
		}

		inline setValue(sValue: string): void{
			this._sValue = sValue;
		}

		toString(): string {
			return this._sValue;
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
	}

	export class TypeDeclInstruction extends DeclInstruction implements IAFXTypeDeclInstruction {
		// EMPTY_OPERATOR VariableTypeInstruction
		
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_TypeDeclInstruction;
		}

		inline getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this._pInstructionList[0];
		}	 

		clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction {
        	return <IAFXTypeDeclInstruction>super.clone(pRelationMap);
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

		hasInitializer(): bool {
			return false;
		}

		getInitializeExpr(): IAFXExprInstruction {
			return null;
		}

		inline getType(): IAFXVariableTypeInstruction {
			return <IAFXVariableTypeInstruction>this._pInstructionList[0];
		}

        inline setType(pType: IAFXVariableTypeInstruction): void{
        	this._pInstructionList[0] = <IAFXVariableTypeInstruction>pType;
        	pType.setParent(this);

        	if(this._nInstuctions === 0){
        		this._nInstuctions = 1;
        	}
        }

        setName(sName: string):void {
        	var pName: IAFXIdInstruction = new IdInstruction();
        	pName.setName(sName);
        	pName.setParent(this);

        	this._pInstructionList[1] = <IAFXIdInstruction>pName;

        	if(this._nInstuctions < 2) {
        		this._nInstuctions = 2;
        	}
        }

        clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction {
        	return <IAFXVariableDeclInstruction>super.clone(pRelationMap);
        }
	}

	export class AnnotationInstruction extends Instruction implements IAFXAnnotationInstruction {
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_AnnotationInstruction;
		}
	}

	/**
	 * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
	 * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
	 */
	export class FunctionDeclInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
		private _pFunctionDefenition: FunctionDefInstruction = null;
		private _pImplementation: StmtBlockInstruction = null;
		private _eFunctionType: EFunctionType = EFunctionType.k_Function;
		
		private _bUsedAsFunction: bool = false;
		private _bUsedAsVertex: bool = false;
		private _bUsedAsPixel: bool = false;

		private _bUsedInVertex: bool = false;
		private _bUsedInPixel: bool = false;
		
		private _canUsedAsFunction: bool = false;
		private _canUsedAsVertex: bool = false;
		private _canUsedAsPixel: bool = false;
		
		private _pParseNode: IParseNode = null;
		private _iScope: uint = 0;
		private _pUsedFunctionMap: IAFXFunctionDeclMap = null;
		private _pUsedFunctionList: IAFXFunctionDeclInstruction[] = null;
		private _isInBlackList: bool = false;

		constructor() { 
			super();
			this._pInstructionList = [null, null];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDeclInstruction;
		}	

		inline getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this.getReturnType();
		}

		inline getName(): string {
			return this._pFunctionDefenition.getName();
		}
		
		inline getNameId(): IAFXIdInstruction {
			return this._pFunctionDefenition.getNameId();
		}

		getArguments(): IAFXVariableDeclInstruction[] {
			return this._pFunctionDefenition.getArguments();
		}

		inline getNumNeededArguments(): uint {
			return this._pFunctionDefenition.getNumNeededArguments();
		}
		
		inline hasImplementation(): bool {
			return !isNull(this._pImplementation) || !isNull(this._pParseNode);
		}

		inline getReturnType(): IAFXTypeInstruction {
			return this._pFunctionDefenition.getReturnType();
		}

		inline setParseNode(pNode: IParseNode): void {
			this._pParseNode = pNode;
		}

		inline setScope(iScope: uint): void {
			this._iScope = iScope;
		}

		inline getParseNode(): IParseNode {
			return this._pParseNode;
		}

		inline getScope(): uint {
			return this._iScope;
		}

		setFunctionDef(pFunctionDef: IAFXDeclInstruction): void {
			this._pFunctionDefenition = <FunctionDefInstruction>pFunctionDef;
			this._pInstructionList[0] = pFunctionDef;
			pFunctionDef.setParent(this);
			this._nInstuctions = this._nInstuctions === 0 ? 1 : this._nInstuctions;
		}

		setImplementation(pImplementation: IAFXStmtInstruction): void {
			this._pImplementation = <StmtBlockInstruction>pImplementation;
			this._pInstructionList[1] = pImplementation;
			pImplementation.setParent(pImplementation);
			this._nInstuctions = 2;

			this._pParseNode = null;
		}

		clone(pRelationMap?: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXFunctionDeclInstruction {
			return <IAFXFunctionDeclInstruction>super.clone(pRelationMap);
		}

		_usedAs(eUsedType: EFunctionType): void {
			switch(eUsedType){
				case EFunctionType.k_Vertex:
					this._bUsedInVertex = true;
					this._bUsedAsVertex = true;
					break;
				case EFunctionType.k_Pixel:
					this._bUsedInPixel = true;
					this._bUsedAsPixel = true;
					break;
				case EFunctionType.k_Function:
					this._bUsedAsFunction = true;
					break;
			}
		}

		_isUsedAs(eUsedType: EFunctionType): bool {
			switch(eUsedType){
				case EFunctionType.k_Vertex:
					return this._bUsedAsVertex;
				case EFunctionType.k_Pixel:
					return this._bUsedAsPixel;
				case EFunctionType.k_Function:
					return this._bUsedAsFunction;
			}
		}

		_isUsedAsFunction(): bool {
			return this._bUsedAsFunction;
		}

		_isUsedAsVertex(): bool {
			return this._bUsedAsVertex;
		}

		_isUsedAsPixel(): bool {
			return this._bUsedAsPixel;
		}

		_usedInVertex(): void {
			this._bUsedInVertex = true;
		}

		_usedInPixel(): void {
			this._bUsedInPixel = true;
		}

		_isUsedInVertex(): bool {
			return this._bUsedInVertex;
		}

		_isUsedInPixel(): bool {
			return this._bUsedInPixel;
		}

		_isUsed(): bool{
			return this._bUsedAsFunction || this._bUsedAsVertex || this._bUsedAsPixel;
		}

		_checkVertexUsage(): bool {
			return this._usedInVertex() ? this._isForVertex() : true;
		}

		_checkPixelUsage(): bool {
			return this._usedInPixel() ? this._isForPixel() : true;
		}

		_checkDefenitionForVertexUsage(): bool {
			return this._pFunctionDefenition._checkForVertexUsage();
		}

		_checkDefenitionForPixelUsage(): bool {
			return this._pFunctionDefenition._checkForPixelUsage();
		}

		_addUsedFunction(pFunction: IAFXFunctionDeclInstruction): bool {
			if(isNull(this._pUsedFunctionMap)){
				this._pUsedFunctionMap = <IAFXFunctionDeclMap>{};
				this._pUsedFunctionList = [];
			}

			var iFuncId: uint = pFunction._getInstructionID();
			
			if(!isDef(this._pUsedFunctionMap[iFuncId])){
				this._pUsedFunctionMap[iFuncId] = pFunction;
				this._pUsedFunctionList.push(pFunction);
				return true;
			}

			return false;
		}

		_getUsedFunctionList(): IAFXFunctionDeclInstruction[] {
			return this._pUsedFunctionList;
		}

		_isBlackListFunction(): bool {
			return this._isInBlackList;
		}

		_addToBlackList(): void {
			this._isInBlackList = true;
		}

		_getStringDef(): string {
			return this._pFunctionDefenition._getStringDef();
		}
		
		// cloneTo(eConvertTo: EFunctionType): ShaderFunctionInstruction {
		// 	if(eConvertTo === EFunctionType.k_Function) {
		// 		//nothing to do
		// 	}
		// 	return null;
		// }
	}

	export class ShaderFunctionInstruction extends FunctionDeclInstruction {
		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_ShaderFunctionInstruction;
		}


	}

	export class SystemFunctionInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
	    private _pExprTranslator: ExprTemplateTranslator = null;
	    private _pName: IAFXIdInstruction = null;
	    private _pReturnType: VariableTypeInstruction = null;
	    private	_pArguments: IAFXTypedInstruction[] = null;

		constructor(sName: string, pReturnType: IAFXTypeInstruction,
					pExprTranslator: ExprTemplateTranslator,
					pArgumentTypes: IAFXTypeInstruction[]) {
			super();

			this._eInstructionType = EAFXInstructionTypes.k_SystemFunctionInstruction;	
			
			this._pName = new IdInstruction();
			this._pName.setName(sName);
			this._pName.setParent(this);

			this._pReturnType = new VariableTypeInstruction();
			this._pReturnType.pushInVariableType(this._pReturnType);
			this._pReturnType.setParent(this);

			this._pArguments = [];

			for(var i: uint = 0; i < pArgumentTypes.length; i++){
				var pArgument: TypedInstruction = new TypedInstruction();
				pArgument.setType(pArgumentTypes[i]);
				pArgument.setParent(this);

				this._pArguments.push(pArgument);
			}

			this._pExprTranslator = pExprTranslator;
		}

		setExprTranslator(pExprTranslator: ExprTemplateTranslator){
			this._pExprTranslator = pExprTranslator;
		}

		getNameId(): IAFXIdInstruction {
			return this._pName;
		}

		getArguments(): IAFXTypedInstruction[] {
			return this._pArguments;
		}

		inline getNumNeededArguments(): uint {
			return this._pArguments.length;
		}
		
		inline hasImplementation(): bool {
			return true;
		}

		inline getReturnType(): IAFXTypeInstruction {
			return this._pReturnType;
		}

		closeArguments(pArguments: IAFXInstruction[]): IAFXInstruction[]{
			return this._pExprTranslator.toInstructionList(pArguments);
		}

		setFunctionDef(pFunctionDef: IAFXDeclInstruction): void {
		}

		setImplementation(pImplementation: IAFXStmtInstruction): void {
		}

		inline clone(pRelationMap?: IAFXInstructionMap): SystemFunctionInstruction {
			return this;
		}
		
		_usedAs(eUsedType: EFunctionType): void {
		}

		_isUsedAs(eUsedType: EFunctionType): bool{
			return true;
		}

		_isUsedAsFunction(): bool {
			return true;
		}

		_isUsedAsVertex(): bool {
			return true;
		}

		_isUsedAsPixel(): bool {
			return true;
		}

		_usedInVertex(): void {
		}

		_usedInPixel(): void {
		}

		_isUsedInVertex(): bool {
			return null;
		}

		_isUsedInPixel(): bool {
			return null;
		}

		_isUsed(): bool{
			return null;
		}

		_checkVertexUsage(): bool {
			return this._isForVertex();
		}

		_checkPixelUsage(): bool {
			return this._isForPixel();
		}

		_checkDefenitionForVertexUsage(): bool {
			return false;
		}

		_checkDefenitionForPixelUsage(): bool {
			return false;
		}

		_addUsedFunction(pFunction: IAFXFunctionDeclInstruction): bool{
			return false;
		}

		_getUsedFunctionList(): IAFXFunctionDeclInstruction[] {
			return null;
		}

		_isBlackListFunction(): bool {
			return false;
		}

		_addToBlackList(): void {
		}

		_getStringDef(): string {
			return "system_func";
		}

	}

	/**
	 * Represent type func(...args)[:Semantic]
	 * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
	 */
	export class FunctionDefInstruction extends DeclInstruction {
		private _pParameterList: IAFXVariableDeclInstruction[] = null;
		private _pReturnType: IAFXVariableTypeInstruction = null;
		private _pFunctionName: IAFXIdInstruction = null;
		private _nParamsNeeded: uint = 0;
		private _sDefinition: string = "";
		private _isAnalyzedForVertexUsage: bool = false;
		private _isAnalyzedForPixelUsage: bool = false;

		//private _sHash: string = "";

		constructor() {
			super();
			this._pInstructionList = [null, null];
			this._pParameterList = [];
			this._eInstructionType = EAFXInstructionTypes.k_FunctionDefInstruction;
		}

		inline setType(pType: IAFXTypeInstruction): void {
			this.setReturnType(<IAFXVariableTypeInstruction>pType);
		}

		inline getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this.getReturnType();
		}

		inline setReturnType(pReturnType: IAFXVariableTypeInstruction): bool {
			this._pReturnType = pReturnType;
			pReturnType.setParent(this);
			return true;
		}
		inline getReturnType(): IAFXVariableTypeInstruction {
			return this._pReturnType;
		}

		inline setFunctionName(pNameId: IAFXIdInstruction): bool {
			this._pFunctionName = pNameId;
			pNameId.setParent(this);
			return true;
		}

		inline getName(): string {
			return this._pFunctionName.getName();
		}

		inline getNameId(): IAFXIdInstruction {
			return this._pFunctionName;
		}

		inline getArguments(): IAFXVariableDeclInstruction[]{
			return this._pParameterList;
		}

		inline getNumNeededArguments(): uint{
			return this._nParamsNeeded;
		}


		addParameter(pParameter: IAFXVariableDeclInstruction): bool {
			if (this._pParameterList.length > this._nParamsNeeded && 
				!pParameter.hasInitializer()) {

				this.setError(EFFCCT_BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT, 
							  { funcName: this._pFunctionName.getName(),
							  	varName: pParameter.getName() });
				return false;
			}

			this._pParameterList.push(pParameter);
			pParameter.setParent(this);

			if(!pParameter.hasInitializer()){
				this._nParamsNeeded++;
			}

			return true;
		}

		clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): FunctionDefInstruction {
			var pClone: FunctionDefInstruction = <FunctionDefInstruction>super.clone(pRelationMap);

			pClone.setFunctionName(<IAFXIdInstruction>this._pFunctionName.clone(pRelationMap));
			pClone.setReturnType(<IAFXVariableTypeInstruction>this.getReturnType().clone(pRelationMap));

			for(var i: uint = 0; i < this._pParameterList.length; i++){
				pClone.addParameter(this._pParameterList[i].clone(pRelationMap));
			}

			return pClone;
		}

		_getStringDef(): string {
			if(this._sDefinition === ""){
				this._sDefinition = this._pReturnType.getHash() + " " + this.getName() + "(";
				
				for(var i: uint = 0; i < this._pParameterList.length; i++){
					this._sDefinition += this._pParameterList[i].getType().getHash() + ",";
				}
				
				this._sDefinition += ")";
			}

			return this._sDefinition;
		}

		_checkForVertexUsage(): bool {
			if(this._isAnalyzedForVertexUsage){
				return this._isForVertex();
			}

			this._isAnalyzedForVertexUsage = true;

			var isGood: bool = true;
			
			isGood = this.checkReturnTypeForVertexUsage();
			if(!isGood){
				this._setForVertex(false);
				return false;
			}

			isGood = this.checkArgumentsForVertexUsage();
			if(!isGood){
				this._setForVertex(false);
				return false;
			}

			this._setForVertex(true);

			return true;
		}

		_checkForPixelUsage(): bool {
			if(this._isAnalyzedForPixelUsage){
				return this._isForPixel();
			}

			this._isAnalyzedForPixelUsage = true;

			var isGood: bool = true;
			
			isGood = this.checkReturnTypeForPixelUsage();
			if(!isGood){
				this._setForPixel(false);
				return false;
			}

			isGood = this.checkArgumentsForPixelUsage();
			if(!isGood){
				this._setForPixel(false);
				return false;
			}

			this._setForPixel(true);

			return true;
		}

		private checkReturnTypeForVertexUsage(): bool {
			var pReturnType: IAFXVariableTypeInstruction = this._pReturnType;
			var isGood: bool = true;

			if(pReturnType.isComplex()){
				isGood = !pReturnType.hasFieldWithoutSemantic();
				if(!isGood){
					return false;
				}

				isGood = pReturnType.hasAllUniqueSemantics();
				if(!isGood) {
					return false;
				}

				isGood = pReturnType.hasFieldWithSematic("POSITION");
				if(!isGood){
					return false;
				}

				return true;
			}
			else {
				isGood = pReturnType.isEqual(getEffectBaseType("float4"));
				if(!isGood){
					return false;
				}

				isGood = (this.getSemantic() === "POSITION");
				if(!isGood){
					return false;
				}

				return true;
			}
		}

		private checkReturnTypeForPixelUsage(): bool {
			var pReturnType: IAFXVariableTypeInstruction = this._pReturnType;
			var isGood: bool = true;

			isGood = pReturnType.isBase();
			if(!isGood){
				return false;
			}

			isGood = pReturnType.isEqual(getEffectBaseType("float4"));
			if(!isGood){
				return false;
			}

			isGood = this.getSemantic() === "COLOR";
			if(!isGood){
				return false;
			}

			return true;	
		}

		private checkArgumentsForVertexUsage(): bool {
			
			return false;
		}

		private checkArgumentsForPixelUsage(): bool {
			return false;
		}
		// getHash(): string {
		// 	if(this._sHash === "") {
		// 		this.calcHash();
		// 	}

		// 	return this._sHash;
		// }

		// private calcHash(): void {
		// 	var sHash: string = "";
		// 	sHash = this._pFunctionName.getName();
		// 	sHash += "(";
			
		// 	for(var i: uint = 0; i < this._pParameterList.length; i++){
		// 		sHash += this._pParameterList[i]
		// 	}

		// }
	}
	
	// export class BaseTypeInstruction extends Instruction implements IAFXBaseTypeInstruction {
	// 	// EMPTY_OPERATOR IdInstruction
		
	// 	constructor() {
	// 		super();
	// 		this._eInstructionType = EAFXInstructionTypes.k_BaseTypeInstruction;
	// 	}	 
	// }

	// export class StructDeclInstruction extends Instruction implements IAFXStructDeclInstruction {
	// 	// EMPTY_OPERATOR IdInstruction StructFieldsInstruction
		
	// 	constructor() {
	// 		super();
	// 		this._eInstructionType = EAFXInstructionTypes.k_StructDeclInstruction;
	// 	}	 
	// }

	// export class StructFieldsInstruction extends Instruction {
	// 	// EMPTY_OPERATOR VariableDeclInstruction ... VariableDeclInstruction
		
	// 	constructor() {
	// 		super();
	// 		this._eInstructionType = EAFXInstructionTypes.k_StructFieldsInstruction;
	// 	}	 
	// }


	export class ExprInstruction extends TypedInstruction implements IAFXExprInstruction {
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
			return null;
		}

		isConst(): bool {
			return false;
		}

		clone(pRelationMap?:IAFXInstructionMap): IAFXExprInstruction {
			return <IAFXExprInstruction>super.clone(pRelationMap);
		}
	}

	export class IdExprInstruction extends ExprInstruction implements IAFXIdExprInstruction {
		constructor(){
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_IdExprInstruction;
		}

		getType(): IAFXTypeInstruction {
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

		clone(pRelationMap?:IAFXInstructionMap): IAFXIdExprInstruction {
			return <IAFXIdExprInstruction>super.clone(pRelationMap);
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

		setSystemCallFunction(pFunction: IAFXFunctionDeclInstruction): void{
			this._pSystemFunction = <SystemFunctionInstruction>pFunction;
			this.setType(pFunction.getType());
		}

		setInstructions(pInstructionList: IAFXInstruction[]): void {
			this._pInstructionList = pInstructionList;
			for(var i: uint = 0; i < pInstructionList.length; i++){
				pInstructionList[i].setParent(this);
			}
		}

		fillByArguments(pArguments: IAFXInstruction[]): void{
			this.setInstructions(this._pSystemFunction.closeArguments(pArguments));
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

		inline getFunction(): IAFXFunctionDeclInstruction {
			return <IAFXFunctionDeclInstruction>this._pInstructionList[0].getParent();
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