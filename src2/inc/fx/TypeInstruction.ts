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

        toFinalCode(): string {
			return this.getType()._toDeclString() + ";";
		}

        inline getName(): string {
        	return this.getType().getName();
        }

        inline getRealName(): string {
        	return this.getType().getRealName();
        }

        blend(pDecl: IAFXTypeDeclInstruction, eBlendMode: EAFXBlendMode): IAFXTypeDeclInstruction {
        	if(pDecl !== this){
        		return null;
        	}

        	return this;
        }
	}

	export class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
		private _pSubType: IAFXTypeInstruction = null;
		private _pUsageList: string[] = null;

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
		private _isUniform: bool = null;
		private _isGlobal: bool = null;
		private _isConst: bool = null;
		private _isShared: bool = null;
		private _isForeign: bool = null;
		private _iLength: uint = UNDEFINE_LENGTH;
		private _isNeedToUpdateLength: bool = false;

		// private $length = 0;
		// inline get _iLength() {
		// 	return this.$length;
		// }

		// inline set _iLength(n: int) {
		// 	if (n === null) {
		// 		LOG(__CALLSTACK__);
		// 	}
		// 	this.$length = n;
		// }

		private _isFromVariableDecl: bool = null;
		private _isFromTypeDecl: bool = null;
		private _isField: bool = false;
		
		private _pArrayIndexExpr: IAFXExprInstruction = null;
		private _pArrayElementType: IAFXVariableTypeInstruction = null;

		private _pFieldDeclMap: IAFXVariableDeclMap = null;
		private _pFieldDeclBySemanticMap: IAFXVariableDeclMap = null;
		private _pFieldIdMap: IAFXIdExprMap = null;
		private _pUsedFieldMap: IAFXVarUsedModeMap = null;

		private _pVideoBuffer: IAFXVariableDeclInstruction = null;
		private _pMainPointIndex: IAFXVariableDeclInstruction = null;
		private _pUpPointIndex: IAFXVariableDeclInstruction = null;
		private _pDownPointIndex: IAFXVariableDeclInstruction = null;
		private _nPointDim: uint = 0;
		private _pPointerList: IAFXVariableDeclInstruction[] = null;
		private _iPadding: uint = UNDEFINE_PADDING;

		private _pSubDeclList: IAFXVariableDeclInstruction[] = null;
		private _pAttrOffset: IAFXVariableDeclInstruction = null;

		private _bUnverifiable: bool = false;

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_VariableTypeInstruction;
		}	 

		toFinalCode(): string {
			var sCode: string = "";
			if(!isNull(this._pUsageList)){
				if(!this.isShared()){
					for(var i: uint = 0; i < this._pUsageList.length; i++){
						sCode += this._pUsageList[i] + " ";
					}
				}
			}

			sCode += this.getSubType().toFinalCode();

			return sCode;
		}

		_toDeclString(): string {
			return this.getSubType()._toDeclString();
		}

		isBuiltIn(): bool {
			return false;
		}

        setBuiltIn(isBuiltIn: bool): void {
        }

		//-----------------------------------------------------------------//
		//----------------------------SIMPLE TESTS-------------------------//
		//-----------------------------------------------------------------//

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
			if(this._isUnverifiable()){
				return true;
			}

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

		isStrongEqual(pType: IAFXTypeInstruction): bool {
			if(!this.isEqual(pType) || this.getStrongHash() !== pType.getStrongHash()){
				return false;
			}

			return true;
		}

		isSampler(): bool {
			return this.getSubType().isSampler();
		}

		isSamplerCube(): bool {
			return this.getSubType().isSamplerCube();
		}

        isSampler2D(): bool {
        	return this.getSubType().isSampler2D();
        }
		
		isWritable(): bool {
			if(!isNull(this._isWritable)){
				return this._isWritable;
			}

			if ((this.isArray() && !this.isBase()) ||
				this.isForeign() || this.isUniform()){
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

			if(this.hasUsage("out")){
				this._isReadable = false;
			}
			else{
				this._isReadable = this.getSubType().isReadable();
			}

			return this._isReadable;
		}

		_containArray(): bool {
			return this.getSubType()._containArray();
		}

        _containSampler(): bool {
        	return this.getSubType()._containSampler();
        }

        _containPointer(): bool {
        	return this.getSubType()._containPointer();
        }

        _containComplexType(): bool {
        	return this.getSubType()._containComplexType();
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

		isPointIndex(): bool{
			if(isNull(this._isPointIndex)){
				this._isPointIndex = this.isStrongEqual(getEffectBaseType("ptr"));
			}

			return this._isPointIndex;
		}

		isFromVariableDecl(): bool {
			if(!isNull(this._isFromVariableDecl)){
				return this._isFromVariableDecl;
			}

			if(isNull(this.getParent())){
				this._isFromVariableDecl = false;
			}
			else {
				var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

				if(eParentType === EAFXInstructionTypes.k_VariableDeclInstruction){
					this._isFromVariableDecl = true;
				}
				else if(eParentType === EAFXInstructionTypes.k_VariableTypeInstruction){
					this._isFromVariableDecl = (<IAFXVariableTypeInstruction>this.getParent()).isFromVariableDecl();
				}
				else {
					this._isFromVariableDecl = false;
				}
			}

			return this._isFromVariableDecl;
		}

        isFromTypeDecl(): bool {
        	if(!isNull(this._isFromTypeDecl)){
				return this._isFromTypeDecl;
			}

        	if(isNull(this.getParent())){
				this._isFromTypeDecl = false;
			}
			else {
	        	var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

				if(eParentType === EAFXInstructionTypes.k_TypeDeclInstruction){
					this._isFromTypeDecl = true;
				}
				else if(eParentType === EAFXInstructionTypes.k_VariableTypeInstruction){
					this._isFromTypeDecl = (<IAFXVariableTypeInstruction>this.getParent()).isFromVariableDecl();
				}
				else {
					this._isFromTypeDecl = false;
				}
			}

			return this._isFromTypeDecl;
        }

        isUniform(): bool {
        	if(isNull(this._isUniform)){
				this._isUniform = this.hasUsage("uniform");
			}

			return this._isUniform;
        }

        isGlobal(): bool {
        	if(isNull(this._isGlobal)){
				this._isGlobal = this._getScope() === 0;
			}

			return this._isGlobal;
        }

        isConst(): bool {
			if(isNull(this._isConst)){
				this._isConst = this.hasUsage("const");
			}

			return this._isConst;
		}

        isShared(): bool {
        	if(isNull(this._isShared)){
				this._isShared = this.hasUsage("shared");
			}

			return this._isShared;
        }

        isForeign(): bool {
        	if(isNull(this._isForeign)){
				this._isForeign = this.hasUsage("foreign");
			}

			return this._isForeign;
        }

        _isTypeOfField(): bool {
        	if(isNull(this.getParent())){
        		return false;
        	}
        	
        	if(this.getParent()._getInstructionType() === EAFXInstructionTypes.k_VariableDeclInstruction){
        		var pParentDecl: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getParent();
        		return pParentDecl.isField();
        	}

        	return false;
        }

        inline _isUnverifiable(): bool {
        	return this._bUnverifiable;
        }

        //-----------------------------------------------------------------//
		//----------------------------SET TYPE INFO------------------------//
		//-----------------------------------------------------------------//
	
		setName(sName: string): void {
			this._sName = sName;
		}

		inline _canWrite(isWritable: bool): void {
			this._isWritable = isWritable;
		}

		inline _canRead(isReadable: bool): void {
			this._isReadable = isReadable;
		}

		//-----------------------------------------------------------------//
		//----------------------------INIT API-----------------------------//
		//-----------------------------------------------------------------//
		inline setPadding(iPadding: uint): void { 
			this._iPadding = iPadding;
		}

		pushType(pType: IAFXTypeInstruction): void {
			var eType: EAFXInstructionTypes = pType._getInstructionType();

			if (eType === EAFXInstructionTypes.k_SystemTypeInstruction || 
				eType === EAFXInstructionTypes.k_ComplexTypeInstruction){
				this._pSubType = pType;
			}
			else {
				var pVarType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>pType;
				if(!pVarType.isNotBaseArray() && !pVarType.isPointer()){
					var pUsageList: string[] = pVarType.getUsageList();
					if(!isNull(pUsageList)){
						for(var i: uint = 0; i < pUsageList.length; i++){
							this.addUsage(pUsageList[i]);
						}
					}

					this._pSubType = pVarType.getSubType();
				}
				else{
					this._pSubType = pType;
				}
			}

		}

		addUsage(sUsage: string): void {
			if(isNull(this._pUsageList)){
				this._pUsageList = [];
			}
			
			if(!this.hasUsage(sUsage)){
				this._pUsageList.push(sUsage);
			}
		}

		addArrayIndex(pExpr: IAFXExprInstruction): void {
			//TODO: add support for v[][10]
			
			this._pArrayElementType = new VariableTypeInstruction();
			this._pArrayElementType.pushType(this.getSubType());
			if(!isNull(this._pUsageList)){
				for(var i: uint = 0; i < this._pUsageList.length; i++){
					this._pArrayElementType.addUsage(this._pUsageList[i]);
				}
			}
			this._pArrayElementType.setParent(this);

			this._pArrayIndexExpr = pExpr;

			this._iLength = this._pArrayIndexExpr.evaluate() ? this._pArrayIndexExpr.getEvalValue() : UNDEFINE_LENGTH;

			this._isArray = true;

			if(this._iLength === UNDEFINE_LENGTH){
				this._isNeedToUpdateLength = true;
			}
		}

		addPointIndex(isStrict?: bool = true): void {
			this._nPointDim++;
			this._isPointer = true;
			if(isStrict){
				this._isStrictPointer = true;
			}
		}

		setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void {
			if(this.isPointIndex()){
				(<IAFXVariableDeclInstruction>this.getParent().getParent()).getType().setVideoBuffer(pBuffer);
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

		initializePointers(): void {
			this._pPointerList = [];
			var pDownPointer: IAFXVariableDeclInstruction = this._getParentVarDecl();

			for(var i:uint = 0; i < this.getPointDim(); i++){
				var pPointer: IAFXVariableDeclInstruction = new VariableDeclInstruction();
				var pPointerType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
				var pPointerId: IAFXIdInstruction = new IdInstruction();

				pPointer.push(pPointerType, true);
				pPointer.push(pPointerId, true);

				pPointerType.pushType(getEffectBaseType("ptr"));
				pPointerId.setName(UNDEFINE_NAME);
				pPointerId.setName(this._getParentVarDecl().getName() + "_pointer_" + i.toString());

				if(i > 0) {
					(this._pPointerList[i - 1].getType())._setUpDownPointers(pPointer, pDownPointer);
					pDownPointer = this._pPointerList[i - 1];
				}
				else{
					pPointerType._setUpDownPointers(null, pDownPointer);
				}

				pPointer.setParent(this._getParentVarDecl());
				this._pPointerList.push(pPointer);
			}
			
			this._pPointerList[this._pPointerList.length - 1].getType()._setUpDownPointers(null, pDownPointer);
			this._pUpPointIndex = this._pPointerList[0];
			this._pMainPointIndex = this._pPointerList[this._pPointerList.length - 1];
		}

		_setPointerToStrict(): void {
			this._isStrictPointer = true;
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

		inline _markAsUnverifiable(isUnverifiable: bool): void {
        	this._bUnverifiable = true;
        }

        _addAttrOffset(pOffset: IAFXVariableDeclInstruction): void {
            this._pAttrOffset = pOffset;
        }


		//-----------------------------------------------------------------//
		//----------------------------GET TYPE INFO------------------------//
		//-----------------------------------------------------------------//	

		getName(): string {
			return this._sName;
		}

		inline getRealName(): string {
			return this.getBaseType().getRealName();
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

		getSize(): uint {
			if(this.isPointer() || this.isPointIndex()){
				return 1;
			}

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

		getBaseType(): IAFXTypeInstruction{
 			return this.getSubType().getBaseType();
 		}

		getLength(): uint {
			if(!this.isNotBaseArray()){
				this._iLength = 0;
				return 0;
			}

			if(this.isNotBaseArray() && !this._isArray){
				this._iLength = this.getSubType().getLength();
			}
			else if(this._iLength === UNDEFINE_LENGTH || this._isNeedToUpdateLength){
				var isEval: bool = this._pArrayIndexExpr.evaluate();
				
				if(isEval) {
					var iValue: uint = <uint>this._pArrayIndexExpr.getEvalValue();
					this._iLength = isInt(iValue) ? iValue : UNDEFINE_LENGTH;
				}
			}

			return this._iLength;
		}

		getPadding(): uint {
			return this.isPointIndex() ? this._getDownPointer().getType().getPadding() : this._iPadding;
		}

		getArrayElementType(): IAFXVariableTypeInstruction {
			if(this._isUnverifiable()){
				return this;
			}

			if(!this.isArray()){
				return null;
			}

			if(isNull(this._pArrayElementType)){
				this._pArrayElementType = new VariableTypeInstruction();
				this._pArrayElementType.pushType(this.getSubType().getArrayElementType());
				if(!isNull(this._pUsageList)){
					for(var i: uint = 0; i <  this._pUsageList.length; i++){
						this._pArrayElementType.addUsage(this._pUsageList[i]);
					}
				}
				this._pArrayElementType.setParent(this);
			}

			return this._pArrayElementType;
		}

		getTypeDecl(): IAFXTypeDeclInstruction {
			if(!this.isFromTypeDecl()){
				return null;
			}

			var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

			if(eParentType === EAFXInstructionTypes.k_TypeDeclInstruction){
				return <IAFXTypeDeclInstruction>this.getParent();
			}
			else {
				return (<IAFXTypeInstruction>this.getParent()).getTypeDecl();
			}
		}

		hasField(sFieldName: string): bool {
			return this._isUnverifiable() ? true : this.getSubType().hasField(sFieldName);
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

		getField(sFieldName: string): IAFXVariableDeclInstruction {
			if(!this.hasField(sFieldName)){
				return null;
			}

			if(isNull(this._pFieldDeclMap)) {
				this._pFieldDeclMap = <IAFXVariableDeclMap>{};
			}

			if(isDef(this._pFieldDeclMap[sFieldName])){
				return this._pFieldDeclMap[sFieldName];
			}

			var pField: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			
			if(!this._isUnverifiable()){
				var pSubField: IAFXVariableDeclInstruction = this.getSubType().getField(sFieldName);

				var pFieldType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
				pFieldType.pushType(pSubField.getType());
				if(!this.isBase()){
					pFieldType.setPadding(pSubField.getType().getPadding());
				}
				pField.push(pFieldType, true);
				pField.push(pSubField.getNameId(), false);
				pField.setSemantic(pSubField.getSemantic());
			}
			else {
				var pFieldName: IAFXIdInstruction = new IdInstruction();

				pFieldName.setName(sFieldName);
				pFieldName.setRealName(sFieldName);

				pField.push(this, false);
				pField.push(pFieldName, true);
			}

			pField.setParent(this);

			this._pFieldDeclMap[sFieldName] = pField;
			
			return pField;
		}

		inline getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
			if(this.hasFieldWithSematic(sSemantic)){
				return null;
			}

			if(isNull(this._pFieldDeclBySemanticMap)) {
				this._pFieldDeclBySemanticMap = <IAFXVariableDeclMap>{};
			}

			if(isDef(this._pFieldDeclBySemanticMap[sSemantic])){
				return this._pFieldDeclBySemanticMap[sSemantic];
			}

			var pField: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pSubField: IAFXVariableDeclInstruction = this.getSubType().getFieldBySemantic(sSemantic);

			var pFieldType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			pFieldType.pushType(pSubField.getType());
			if(!this.isBase()){
				pFieldType.setPadding(pSubField.getType().getPadding());
			}
			pField.push(pFieldType, true);
			pField.push(pSubField.getNameId(), false);


			pField.setParent(this);

			this._pFieldDeclBySemanticMap[sSemantic] = pField;
			
			return pField;
		}

		getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
			return <IAFXVariableTypeInstruction>this.getField(sFieldName).getType();
		}
 		
 		getFieldNameList(): string[] {
 			return this.getSubType().getFieldNameList();
 		}


 		inline getUsageList(): string[] {
 			return this._pUsageList;
 		}

		inline getSubType(): IAFXTypeInstruction {
			return this._pSubType;
		}

		hasUsage(sUsageName: string): bool {
			if(isNull(this._pUsageList)){
				return false;
			}

			for(var i: uint = 0; i < this._pUsageList.length; i++){
				if(this._pUsageList[i] === sUsageName){
					return true;
				}
			}

			if(!isNull(this.getSubType()) && this.getSubType()._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction){
				return (<IAFXVariableTypeInstruction>this.getSubType()).hasUsage(sUsageName);
			}

			return false;
		}

		hasVideoBuffer(): bool {
			return !isNull(this.getVideoBuffer());
		}

		getPointDim(): uint {
			return this._nPointDim || 
				   ((this.getSubType()._getInstructionType() === EAFXInstructionTypes.k_VariableTypeInstruction) ? 
				   (<IAFXVariableTypeInstruction>this.getSubType()).getPointDim() : 0); 
		}

		getPointer(): IAFXVariableDeclInstruction {
			if (!this.isFromVariableDecl() ||
				!(this.isPointer() || this.isPointIndex()) || !this.hasVideoBuffer()){
				return null;
			}

			if(!isNull(this._pUpPointIndex)){
				return this._pUpPointIndex;
			}

			if(this.isPointIndex()){
				return null;
			}

			this.initializePointers();

			return this._pUpPointIndex;
		}

		getVideoBuffer(): IAFXVariableDeclInstruction {
			if(this.isPointIndex()) {
				return (<IAFXVariableDeclInstruction>this.getParent().getParent()).getType().getVideoBuffer();
			}

			return this._pVideoBuffer;
		}

		getFieldExpr(sFieldName: string): IAFXIdExprInstruction {
			if(!this.hasField(sFieldName)){
				return null;
			}
			var pField: IAFXVariableDeclInstruction = this.getField(sFieldName);
			var pExpr: IAFXIdExprInstruction = new IdExprInstruction();
			pExpr.push(pField.getNameId(), false);
			pExpr.setType(pField.getType());

			return pExpr;
		}

		getFieldIfExist(sFieldName: string): IAFXVariableDeclInstruction {
			if(isNull(this._pFieldDeclMap) && isDef(this._pFieldDeclMap[sFieldName])){
				return this._pFieldDeclMap[sFieldName];
			}
			else {
				return null;
			}
		}

		getSubVarDecls(): IAFXVariableDeclInstruction[] {
			if(!this.isComplex() && !this.isPointer()){
				return null;
			}

			if(isNull(this._pSubDeclList)){
				this.generateSubDeclList(); 
			}
			return this._pSubDeclList;
		}

		_getFullName(): string {
			if(!this.isFromVariableDecl()){
				return "Not from variable decl";
			}

			var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

			if(eParentType === EAFXInstructionTypes.k_VariableDeclInstruction){
				return (<IAFXVariableDeclInstruction>this.getParent())._getFullName();
			}
			else{
				return (<IAFXVariableTypeInstruction>this.getParent())._getFullName();
			}
		}		

        _getVarDeclName(): string {
        	if(!this.isFromVariableDecl()){
        		return "";
        	}

        	var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

			if(eParentType === EAFXInstructionTypes.k_VariableDeclInstruction){
				return (<IAFXVariableDeclInstruction>this.getParent()).getName();
			}
			else{
				return (<IAFXVariableTypeInstruction>this.getParent())._getVarDeclName();
			}
        }

        _getTypeDeclName(): string {
        	if(!this.isFromVariableDecl()){
        		return "";
        	}

        	var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

			if(eParentType === EAFXInstructionTypes.k_VariableDeclInstruction){
				return (<IAFXTypeDeclInstruction>this.getParent()).getName();
			}
			else{
				return (<IAFXVariableTypeInstruction>this.getParent())._getTypeDeclName();
			}
        }

        _getParentVarDecl(): IAFXVariableDeclInstruction {
        	if(!this.isFromVariableDecl()){
        		return null;
        	}

        	var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();
        	
        	if(eParentType === EAFXInstructionTypes.k_VariableDeclInstruction){
        		return <IAFXVariableDeclInstruction>this.getParent();
        	}
        	else {
        		return (<IAFXVariableTypeInstruction>this.getParent())._getParentVarDecl();
        	}
        }

        _getParentContainer(): IAFXVariableDeclInstruction {
        	if(!this.isFromVariableDecl() || !this._isTypeOfField()){
        		return null;
        	}
        	
        	var pContainerType: IAFXVariableTypeInstruction = <IAFXVariableTypeInstruction>this._getParentVarDecl().getParent();
        	if(!pContainerType.isFromVariableDecl()){
        		return null;
        	}

        	return pContainerType._getParentVarDecl();
        }

        _getMainVariable(): IAFXVariableDeclInstruction{
        	if(!this.isFromVariableDecl()){
        		return null;
        	}

        	if(this._isTypeOfField()){
        		return (<IAFXVariableTypeInstruction>this.getParent().getParent())._getMainVariable();
        	}
        	else {
        		return (<IAFXVariableDeclInstruction>this._getParentVarDecl());
        	}
        }

        _getMainPointer(): IAFXVariableDeclInstruction{
        	if(isNull(this._pMainPointIndex)){
        		if(isNull(this.getPointer())){
        			this._pMainPointIndex = this._getParentVarDecl()
        		}
        		else{
        			this._pMainPointIndex = this._getUpPointer().getType()._getMainPointer();
        		}
        	}

        	return this._pMainPointIndex;
        }

        _getUpPointer(): IAFXVariableDeclInstruction {
        	return this._pUpPointIndex;
        }

        _getDownPointer(): IAFXVariableDeclInstruction {
        	return this._pDownPointIndex;
        }

        _getAttrOffset(): IAFXVariableDeclInstruction {
            return this._pAttrOffset;
        }

        //-----------------------------------------------------------------//
		//----------------------------SYSTEM-------------------------------//
		//-----------------------------------------------------------------//		

		wrap(): IAFXVariableTypeInstruction {
			var pCloneType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			pCloneType.pushType(this);

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
			
			pClone.pushType(this._pSubType.clone(pRelationMap));
			if(!isNull(this._pUsageList)){
				for(var i: uint = 0; i < this._pUsageList.length; i++){
					pClone.addUsage(this._pUsageList[i]);
				}
			}
			
			pClone._canWrite(this._isWritable);
			pClone._canRead(this._isReadable);
			pClone._setCloneHash(this._sHash, this._sStrongHash);
			pClone.setPadding(this.getPadding());
			
			if(this._isArray){
				this._setCloneArrayIndex(this._pArrayElementType.clone(pRelationMap),
										 this._pArrayIndexExpr.clone(pRelationMap),
										 this._iLength);
			}

			if(this._isPointer){
				var pClonePointerList: IAFXVariableDeclInstruction[] = null;
				if(!isNull(this._pPointerList)){
					pClonePointerList = new Array(this._pPointerList.length);
					var pDownPointer: IAFXVariableDeclInstruction = pClone._getParentVarDecl();

					for(var i: uint = 0; i < this._pPointerList.length; i++){
						pClonePointerList[i] = this._pPointerList[i].clone(pRelationMap);
						
						if(i > 0) {
							(pClonePointerList[i - 1].getType())._setUpDownPointers(pClonePointerList[i], pDownPointer);
							pDownPointer = pClonePointerList[i - 1];
						}
						else{
							pClonePointerList[0].getType()._setUpDownPointers(null, pDownPointer);
						}
					}

					pClonePointerList[pClonePointerList.length - 1].getType()._setUpDownPointers(null, pDownPointer);
				}

				this._setClonePointeIndexes(this.getPointDim(), pClonePointerList);				
			}

			if(!isNull(this._pFieldDeclMap)){
				var sFieldName: string = "";
				var pCloneFieldMap: IAFXVariableDeclMap= <IAFXVariableDeclMap>{};

				for(sFieldName in this._pFieldDeclMap){
					pCloneFieldMap[sFieldName] = this._pFieldDeclMap[sFieldName].clone(pRelationMap);
				}

				this._setCloneFields(pCloneFieldMap);
			}

			return pClone;
		}

		blend(pType: IAFXVariableTypeInstruction, eMode: EAFXBlendMode): IAFXVariableTypeInstruction {
			if(this === pType){
				return this;
			}

			if(eMode === EAFXBlendMode.k_Global){
				return null;
			}

			if (this.isComplex() !== pType.isComplex() ||
				(this.isNotBaseArray() !== pType.isNotBaseArray()) || 
				(this.isPointer() !== pType.isPointer())) {
				return null;
			}

			if (this.isNotBaseArray() || this.getLength() === UNDEFINE_LENGTH ||
				this.getLength() !== pType.getLength()){
				return null;
			}

			var pBlendBaseType: IAFXTypeInstruction = this.getBaseType().blend(pType.getBaseType(), eMode);
			if(isNull(pBlendBaseType)){
				return null;
			}

			var pBlendType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
			pBlendType.pushType(pBlendBaseType);

			if(this.isNotBaseArray()){
				var iLength: uint = this.getLength();
				var pLengthExpr: IntInstruction = new IntInstruction();
				pLengthExpr.setValue(iLength);
				pBlendType.addArrayIndex(pLengthExpr);
			}

			return pBlendType;

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
        	this._nPointDim = nDim;
        	this._pPointerList = pPointerList;
        	if(!isNull(this._pPointerList)){
        		this._pUpPointIndex = this._pPointerList[0];
        	}
        }

        _setCloneFields(pFieldMap: IAFXVariableDeclMap): void {
        	this._pFieldDeclMap = pFieldMap;
        }

        inline _setUpDownPointers(pUpPointIndex: IAFXVariableDeclInstruction,
        						  pDownPointIndex: IAFXVariableDeclInstruction ): void {
			this._pUpPointIndex = pUpPointIndex;
			this._pDownPointIndex = pDownPointIndex;
		}

		private calcHash(): void {
			var sHash: string = this.getSubType().getHash();
			
			if(this._isArray){
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
			var sStrongHash: string = this.getSubType().getStrongHash();
			
			if(this._isArray){
				sStrongHash += "[";

				var iLength: uint = this.getLength();

				if(iLength === UNDEFINE_LENGTH){
					sStrongHash += "undef"
				}
				else{
					sStrongHash += iLength.toString();
				}

				sStrongHash += "]";
			}
			if(this.isPointer()){
				for(var i: uint = 0; i < this.getPointDim(); i++){
					sStrongHash = "@" + sStrongHash;
				}
			}


			this._sStrongHash = sStrongHash;
		}

		private generateSubDeclList(): void {
			if(!this.isComplex() && !this.isPointer()){
				return;
			}

			var pDeclList: IAFXVariableDeclInstruction[] = [];
			var i: uint = 0;

			if(this.isPointer()){
				if(!isNull(this._pAttrOffset)){
					pDeclList.push(this._pAttrOffset);
				}

				if(isNull(this._getUpPointer())){
					this.initializePointers();
				}

				for(i = 0; i < this._pPointerList.length; i++){
					pDeclList.push(this._pPointerList[i]);
				}
			}

			if(this.isComplex()){
				var pFieldNameList: string[] = this.getFieldNameList();

				for(i = 0; i < pFieldNameList.length; i++){
					var pField: IAFXVariableDeclInstruction = this.getField(pFieldNameList[i]);
					var pFieldSubDeclList: IAFXVariableDeclInstruction[] = pField.getSubVarDecls();

					if(!isNull(pFieldSubDeclList)){
						for(var j: uint = 0; j < pFieldSubDeclList.length; j++){
							pDeclList.push(pFieldSubDeclList[j]);
						}
					}
				}
			}

			this._pSubDeclList = pDeclList;
		}
	}

	export class SystemTypeInstruction extends Instruction implements IAFXTypeInstruction {
		private _sName: string = "";
		private _sRealName: string = "";
		private _pElementType: IAFXTypeInstruction = null;
		private _iLength: uint = 1;
		private _iSize: uint = null;
		private _pFieldDeclMap: IAFXVariableDeclMap = null;
		private _isArray: bool = false;
		private _isWritable: bool = true;
		private _isReadable: bool = true;
		private _pFieldNameList: string[] = null;
		private _pWrapVariableType: IAFXVariableTypeInstruction = null;
		private _isBuiltIn: bool = true;
		private _sDeclString: string = "";

		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_SystemTypeInstruction;
			this._pWrapVariableType = new VariableTypeInstruction();
			this._pWrapVariableType.pushType(this);
		}

		_toDeclString(): string {
			return this._sDeclString;
		}

		toFinalCode(): string {
			return this._sRealName;
		}

		isBuiltIn(): bool {
			return this._isBuiltIn;
		}

        setBuiltIn(isBuiltIn: bool): void {
        	this._isBuiltIn = isBuiltIn;
        }

        setDeclString(sDecl: string): void {
        	this._sDeclString = sDecl;
        }

		//-----------------------------------------------------------------//
		//----------------------------SIMPLE TESTS-------------------------//
		//-----------------------------------------------------------------//
		
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

		inline isStrongEqual(pType: IAFXTypeInstruction): bool{
			return this.getStrongHash() === pType.getStrongHash();
		}

		inline isConst(): bool {
			return false;
		}

		isSampler(): bool{
			return this.getName() === "sampler" ||
				   this.getName() === "sampler2D" ||
				   this.getName() === "samplerCUBE";
		}

		isSamplerCube(): bool {
			return this.getName() === "samplerCUBE";
		}
		
        isSampler2D(): bool {
        	return this.getName() === "sampler" ||
				   this.getName() === "sampler2D";
        }


		inline isWritable(): bool {
			return this._isWritable;
		}

		inline isReadable(): bool {
			return this._isReadable;
		}

		_containArray(): bool {
			return false;
		}

        _containSampler(): bool {
        	return false;
        }

        _containPointer(): bool {
        	return false;
        }

        _containComplexType(): bool {
        	return false;
        }

		//-----------------------------------------------------------------//
		//----------------------------SET BASE TYPE INFO-------------------//
		//-----------------------------------------------------------------//

		inline setName(sName: string): void {
			this._sName = sName;
		}

		inline setRealName(sRealName: string): void {
			this._sRealName = sRealName;
		}

		inline setSize(iSize: uint): void {
			this._iSize = iSize;
		}

		inline _canWrite(isWritable: bool): void {
			this._isWritable = isWritable;
		}

		inline _canRead(isReadable: bool): void {
			this._isReadable = isReadable;
		}

		//-----------------------------------------------------------------//
		//---------------------------INIT API------------------------------//
		//-----------------------------------------------------------------//
		
		addIndex(pType: IAFXTypeInstruction, iLength: uint): void {
			this._pElementType = pType;
			this._iLength = iLength;
			this._iSize = iLength * pType.getSize();
			this._isArray = true;
		}

		addField(sFieldName: string, pType: IAFXTypeInstruction, isWrite?: bool = true,
				 sRealFieldName?: string = sFieldName): void {

			var pField: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pFieldType: VariableTypeInstruction = new VariableTypeInstruction();
			var pFieldId: IAFXIdInstruction = new IdInstruction();

			pFieldType.pushType(pType);
			pFieldType._canWrite(isWrite);
			
			pFieldId.setName(sFieldName);
			pFieldId.setRealName(sRealFieldName);	

			pField.push(pFieldType, true);
			pField.push(pFieldId, true);

			if(isNull(this._pFieldDeclMap)){
				this._pFieldDeclMap = <IAFXVariableDeclMap>{};
			}

			this._pFieldDeclMap[sFieldName] = pField;

			if(isNull(this._pFieldNameList)){
				this._pFieldNameList = [];
			}

			this._pFieldNameList.push(sFieldName);
		}

		//-----------------------------------------------------------------//
		//----------------------------GET TYPE INFO------------------------//
		//-----------------------------------------------------------------//

		inline getName(): string {
			return this._sName;
		}

		inline getRealName(): string {
			return this._sRealName;
		}

		inline getHash(): string {
			return this._sRealName;
		}

		inline getStrongHash(): string {
			return this._sName;
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

		getTypeDecl(): IAFXTypeDeclInstruction {
			if(this.isBuiltIn()){
				return null;
			}

			return <IAFXTypeDeclInstruction>this.getParent();
		}


		inline getLength(): uint {
			return this._iLength;
		}

		inline hasField(sFieldName: string): bool {
			return isDef(this._pFieldDeclMap[sFieldName]);
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

		inline getField(sFieldName: string): IAFXVariableDeclInstruction {
			return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName] : null;
		}

		inline getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
			return null;
		}

		inline getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
			return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
		}

		inline getFieldNameList(): string[] {
			return this._pFieldNameList;
		}

		//-----------------------------------------------------------------//
		//----------------------------SYSTEM-------------------------------//
		//-----------------------------------------------------------------//
		
		inline clone(pRelationMap?: IAFXInstructionMap): SystemTypeInstruction {
			return this;
		}

		inline blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction {
			if(this.isStrongEqual(pType)){
				return this;
			}

			return null;
		}
	}

	export class ComplexTypeInstruction extends Instruction implements IAFXTypeInstruction {
		private _sName: string = "";
		private _sRealName: string = "";

		private _sHash: string = "";
		private _sStrongHash: string = "";

		private _iSize: uint = 0;

		private _pFieldDeclMap: IAFXVariableDeclMap = null;
		private _pFieldDeclList: IAFXVariableDeclInstruction[] = null;
		private _pFieldNameList: string[] = null;

		private _pFieldDeclBySemanticMap: IAFXVariableDeclMap = null;
		private _hasAllUniqueSemantics: bool = true;
		private _hasFieldWithoutSemantic: bool = false;

		private _isContainArray: bool = false;
		private _isContainSampler: bool = false;
		private _isContainPointer: bool = false;
		private _isContainComplexType: bool = false;
		
		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_ComplexTypeInstruction;
		}

		_toDeclString(): string {
			var sCode: string = "struct " + this._sRealName + "{";
			
			for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
				sCode += "\t" + this._pFieldDeclList[i].toFinalCode() + ";\n";
			}

			sCode += "}";

			return sCode;
		}

		toFinalCode(): string {
			return this._sRealName;
		}

		isBuiltIn(): bool {
			return false;
		}

        setBuiltIn(isBuiltIn: bool): void {
        }

		//-----------------------------------------------------------------//
		//----------------------------SIMPLE TESTS-------------------------//
		//-----------------------------------------------------------------//

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

		inline isEqual(pType: IAFXTypeInstruction): bool {
			return this.getHash() === pType.getHash();
		}

		inline isStrongEqual(pType: IAFXTypeInstruction): bool {
			return this.getStrongHash() === pType.getStrongHash();
		}

		inline isConst(): bool {
			return false;
		}

		isSampler(): bool{
			return false;
		}

		isSamplerCube(): bool {
			return false;
		}

		isSampler2D(): bool {
			return false;
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

		inline _containComplexType(): bool {
			return this._isContainComplexType;
		}

		//-----------------------------------------------------------------//
		//----------------------------SET BASE TYPE INFO-------------------//
		//-----------------------------------------------------------------//

		inline setName(sName: string): void {
			this._sName = sName;
			this._sRealName = sName;
		}

		inline setRealName(sRealName: string): void {
			this._sRealName = sRealName;
		}

		inline setSize(iSize: uint): void {
			this._iSize = iSize;
		}

		inline _canWrite(isWritable: bool): void {
		}

		inline _canRead(isWritable: bool): void {
		}

		//-----------------------------------------------------------------//
		//----------------------------INIT API-----------------------------//
		//-----------------------------------------------------------------//

		addField(pVariable: IAFXVariableDeclInstruction): void {
			if(isNull(this._pFieldDeclMap)){
				this._pFieldDeclMap = <IAFXVariableDeclMap>{};
				this._pFieldNameList = [];
			}

			if(isNull(this._pFieldDeclList)){
				this._pFieldDeclList = [];
			}

			var sVarName: string = pVariable.getName();
			this._pFieldDeclMap[sVarName] = pVariable;
			
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

			if(this._pFieldDeclList.length < this._pFieldNameList.length){
				this._pFieldDeclList.push(pVariable);
			}

			var pType: IAFXVariableTypeInstruction = pVariable.getType();
			//pType._markAsField();
			
			if(pType.isNotBaseArray() || pType._containArray()){
				this._isContainArray = true;
			}

			if(isSamplerType(pType) || pType._containSampler()){
				this._isContainSampler = true;
			}

			if(pType.isPointer() || pType._containPointer()){
				this._isContainPointer = true;
			}

			if(pType.isComplex()){
				this._isContainComplexType = true;
			}
		}

		addFields(pFieldCollector: IAFXInstruction, isSetParent?: bool = true): void {
			this._pFieldDeclList = <IAFXVariableDeclInstruction[]>(pFieldCollector.getInstructions());

			for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
		    	this.addField(this._pFieldDeclList[i]);
		    	this._pFieldDeclList[i].setParent(this);
		    }

		    this.calculatePaddings();
		}

		//-----------------------------------------------------------------//
		//----------------------------GET TYPE INFO------------------------//
		//-----------------------------------------------------------------//

		inline getName(): string {
			return this._sName;
		}

		inline getRealName(): string {
			return this._sRealName;
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

		inline getField(sFieldName: string): IAFXVariableDeclInstruction {
			if(!this.hasField(sFieldName)){
				return null;
			}

			return this._pFieldDeclMap[sFieldName];
		}

		getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
			if(!this.hasFieldWithSematic(sSemantic)){
				return null;
			}

			return this._pFieldDeclBySemanticMap[sSemantic];
		}

		inline getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
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
			return this;
		}

		inline getArrayElementType(): IAFXTypeInstruction {
			return null;
		}

		getTypeDecl(): IAFXTypeDeclInstruction {
			return <IAFXTypeDeclInstruction>this.getParent();
		}

		inline getLength(): uint {
			return 0;
		}

		_getFieldDeclList(): IAFXVariableDeclInstruction[] {
			return this._pFieldDeclList;
		}

		//-----------------------------------------------------------------//
		//----------------------------SYSTEM-------------------------------//
		//-----------------------------------------------------------------//

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

    		for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
    			var pCloneVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i].clone(pRelationMap);
    			var sVarName: string = pCloneVar.getName();

    			pFieldDeclList[i] = pCloneVar;
    			pFieldNameList[i] = sVarName;
    			pFieldDeclMap[sVarName] = pCloneVar;
    		}

    		pClone._setCloneFields(pFieldDeclList, pFieldNameList,
				   				   pFieldDeclMap);
    		pClone.setSize(this._iSize);
    		
			return pClone;
		}

		blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction {
			if(pType === this){
				return this;
			}

			if(eMode === EAFXBlendMode.k_TypeDecl){
				return null;
			}

			if(eMode === EAFXBlendMode.k_Uniform || eMode === EAFXBlendMode.k_Attribute){
				if(this.hasFieldWithoutSemantic() || pType.hasFieldWithoutSemantic()){
					return null;
				}
			}

			var pFieldList: IAFXVariableDeclInstruction[] = this._pFieldDeclList;
			var pBlendType: ComplexTypeInstruction = new ComplexTypeInstruction();
			var pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{};

			if(isNull(pFieldList)){
				LOG(this, pType);
			}

			for(var i: uint = 0; i < pFieldList.length; i++){
				var pField: IAFXVariableDeclInstruction = pFieldList[i];
				var pBlendField: IAFXVariableDeclInstruction = null;
				var sFieldName: string = pField.getName();
				var sFieldSemantic: string = pField.getSemantic();

				if(eMode === EAFXBlendMode.k_Shared){
					if(pType.hasField(sFieldName)){
						pBlendField = pField.blend(pType.getField(sFieldName), eMode);
					}
					else {
						pBlendField = pField.clone(pRelationMap);
					}
				}
				else if(eMode === EAFXBlendMode.k_Attribute || 
						eMode === EAFXBlendMode.k_Uniform ||
						eMode === EAFXBlendMode.k_VertexOut) {

					if(pType.hasFieldWithSematic(sFieldSemantic)){
						pBlendField = pField.blend(pType.getFieldBySemantic(sFieldSemantic), eMode);					
					}
					else {
						pBlendField = pField.clone(pRelationMap);
					}

					if(!isNull(pBlendField)){
						pBlendField.getNameId().setName(sFieldSemantic);
						pBlendField.getNameId().setRealName(sFieldSemantic);
					}	
				}

				if(isNull(pBlendField)){
					return null;
				}

				pBlendType.addField(pBlendField);
			}

			pFieldList = (<ComplexTypeInstruction>pType)._getFieldDeclList();

			for(var i: uint = 0; i < pFieldList.length; i++){
				var pField: IAFXVariableDeclInstruction = pFieldList[i];
				var pBlendField: IAFXVariableDeclInstruction = null;
				var sFieldName: string = pField.getName();
				var sFieldSemantic: string = pField.getSemantic();

				if(eMode === EAFXBlendMode.k_Shared){
					if(!this.hasField(sFieldName)){
						pBlendField = pField.clone(pRelationMap);
					}
				}
				else if(eMode === EAFXBlendMode.k_Attribute || 
						eMode === EAFXBlendMode.k_Uniform ||
						eMode === EAFXBlendMode.k_VertexOut) {

					if(!this.hasFieldWithSematic(sFieldSemantic)){
						pBlendField = pField.clone(pRelationMap);
						pBlendField.getNameId().setName(sFieldSemantic);
						pBlendField.getNameId().setRealName(sFieldSemantic);
					}
				}

				if(!isNull(pBlendField)){
					pBlendType.addField(pBlendField);
				}
			}

			pBlendType.setName(this.getName());
			pBlendType.setRealName(this.getRealName());

			return pBlendType;
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
				   		pFieldDeclMap: IAFXVariableDeclMap): void{
			this._pFieldDeclList = pFieldDeclList;
			this._pFieldNameList = pFieldNameList;
			this._pFieldDeclMap = pFieldDeclMap;
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

		private calculatePaddings(): void {
			var iPadding: uint = 0;

			for(var i: uint = 0; i < this._pFieldDeclList.length; i++){
				var pVarType: IAFXVariableTypeInstruction = this._pFieldDeclList[i].getType();
				var iVarSize: uint = pVarType.getSize();

				if(iVarSize === UNDEFINE_SIZE){
					this.setError(EFFCET_CANNOT_CALCULATE_PADDINGS, {typeName: this.getName()});
					return;
				}

				pVarType.setPadding(iPadding);
				iPadding += iVarSize;
			}
		}
	}
}

#endif