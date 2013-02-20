#ifndef AFXTYPEINSTRUCTION
#define AFXTYPEINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"
#include "fx/Effect.ts"

module akra.fx {
	export class TypeDeclInstruction extends DeclInstruction implements IAFXTypeDeclInstruction {
		// EMPTY_OPERATOR VariableTypeInstruction
		
		constructor() {
			super();
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_TypeDeclInstruction;
		}

		inline getType(): IAFXTypeInstruction {
			return <IAFXTypeInstruction>this._pInstructionList[0];
		}	 

		clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction {
        	return <IAFXTypeDeclInstruction>super.clone(pRelationMap);
        }

        inline getName(): string {
        	return this.getType().getName();
        }
	}

	export class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
		// EMPTY_OPERATOR TypeInstruction ArrayInstruction PointerInstruction
		private _sName: string = "";
		private _isWritable: bool = null;
		private _isReadable: bool = null;

		private _bUsedForWrite: bool = false;
		private _bUsedForRead: bool = false;

		private _sHash: string = "";
		private _sStrongHash: string = "";
		private _isArray: bool = false;
		private _isPointer: bool = false;
		private _isStrictPointer: bool = false;
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
			this._pInstructionList = [null];
			this._eInstructionType = EAFXInstructionTypes.k_VariableTypeInstruction;
		}	 

		setName(sName: string): void {
			this._sName = sName;
		}

		getName(): string {
			return this._sName;
		}

		pushInVariableType(pVariableType: IAFXTypeInstruction): bool {
			if(this._nInstuctions > 0){
				return false;
			}
			else {
				var pUsageType: IAFXUsageTypeInstruction = new UsageTypeInstruction();
				pUsageType.setTypeInstruction(pVariableType, false);

				this.push(pUsageType, true);
				return false;
			}
		}

		isolateType(): IAFXVariableTypeInstruction {
			var pVariableType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			var pUsageType: IAFXUsageTypeInstruction = new UsageTypeInstruction();
			
			pVariableType.push(pUsageType, true);
			pUsageType.setTypeInstruction(this, false);

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

		addPointIndex(isStrict?: bool = true): void {
			this._nPointerDim++;
			this._isPointer = true;
			if(isStrict){
				this._isStrictPointer = true;
			}
		}

		_addPointIndexInDepth(): void {
			if(!this.isComplex()){
				return;
			}

			var pFieldNameList: string[] = this.getFieldNameList();

			for(var i: uint = 0; i < pFieldNameList.length; i++){
				var pFieldType: IAFXVariableTypeInstruction = this.getFieldType(pFieldNameList[i]);
				if(!pFieldType.isPointer()){
					pFieldType.addPointIndex(false);
					pFieldType._setVideoBufferInDepth();
				}				
			}
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

		_setVideoBufferInDepth(): void {
			if(this.isPointer()){
				this.setVideoBuffer(Effect.createVideoBufferVariable());
			}
			else if(this.isComplex() && this._containPointer()){
				var pFieldNameList: string[] = this.getFieldNameList();

				for(var i: uint = 0; i < pFieldNameList.length; i++){
					var pFieldType: IAFXVariableTypeInstruction = this.getFieldType(pFieldNameList[i]);
					
					pFieldType._setVideoBufferInDepth();
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
			if (this.isNotBaseArray() && pType.isNotBaseArray() && 
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

		isFromVariableDecl(): bool {
			var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

			if(eParentType === EAFXInstructionTypes.k_VariableDeclInstruction){
				return true;
			}
			else if(eParentType === EAFXInstructionTypes.k_VariableTypeInstruction){
				return (<IAFXVariableTypeInstruction>this.getParent()).isFromVariableDecl();
			}
			else {
				return false;
			}
		}

        isFromTypeDecl(): bool {
        	var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

			if(eParentType === EAFXInstructionTypes.k_TypeDeclInstruction){
				return true;
			}
			else if(eParentType === EAFXInstructionTypes.k_VariableTypeInstruction){
				return (<IAFXVariableTypeInstruction>this.getParent()).isFromVariableDecl();
			}
			else {
				return false;
			}
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

        _containPointer(): bool{
        	return this.isBase() ? false : (<IAFXVariableTypeInstruction>this.getSubType())._containSampler();
        }

		isPointer(): bool {
			return this._isPointer || 
				   (this.getSubType()._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction &&
				   	(<IAFXVariableTypeInstruction>this.getSubType()).isPointer());
		}

		isStrictPointer(): bool {
			return this._isStrictPointer ||
					(this.getSubType()._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction &&
				   	(<IAFXVariableTypeInstruction>this.getSubType()).isStrictPointer());
		}

		_setPointerToStrict(): void {
			this._isStrictPointer = true;
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

		_usedForWrite(): bool{
			if(!this.isWritable()){
				return false;
			}

			this._bUsedForWrite = true;
			return true;
		}

        _usedForRead(): bool {
        	if(!this.isReadable()){
        		return false;
        	}

        	this._bUsedForRead = true;
        	return true;
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
			if(!this.isPointer() && !this.hasVideoBuffer() &&
				!this.isPointIndex()){
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
			if(this.isNotBaseArray()){
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
			if(!this.isNotBaseArray()){
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
			
			if(this.isNotBaseArray()){
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

		setTypeInstruction(pType: IAFXTypeInstruction, isSetParent?: bool = false): bool {
			//TODO: check compatibility test for type and usages 
			this._pType = pType;
			if(isSetParent) {
				pType.setParent(this);
			}
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

		inline getName(): string {
			return this._sName;
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
			pFieldType.pushInVariableType(pType);
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
		private _isContainPointer: bool = false;
		
		constructor() {
			super();
			this._pInstructionList = [];
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

			if(pType.isPointer() || pType._containPointer()){
				this._isContainPointer = true;
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

		inline getName(): string {
			return this._sName;
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

		inline _containPointer(): bool {
			return this._isContainPointer;
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
				if(this._hasAllUniqueSemantics && pVar.getType().isComplex()){
					this._hasAllUniqueSemantics = pVar.getType().hasAllUniqueSemantics();
				}
			}

		}
	}
}

#endif