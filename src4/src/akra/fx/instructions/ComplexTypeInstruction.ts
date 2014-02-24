/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="../../logger.ts" />

/// <reference path="Instruction.ts" />
/// <reference path="../Effect.ts" />


module akra.fx.instructions {

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
		private _bHasAllUniqueSemantics: boolean = true;
		private _bHasFieldWithoutSemantic: boolean = false;

		private _isContainArray: boolean = false;
		private _isContainSampler: boolean = false;
		private _isContainPointer: boolean = false;
		private _isContainComplexType: boolean = false;

		constructor() {
			super();
			this._pInstructionList = null;
			this._eInstructionType = EAFXInstructionTypes.k_ComplexTypeInstruction;
		}

		_toDeclString(): string {
			var sCode: string = "struct " + this._sRealName + "{";

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				sCode += "\t" + this._pFieldDeclList[i]._toFinalCode() + ";\n";
			}

			sCode += "}";

			return sCode;
		}

		_toFinalCode(): string {
			return this._sRealName;
		}

		_isBuiltIn(): boolean {
			return false;
		}

		_setBuiltIn(isBuiltIn: boolean): void {
		}

		//-----------------------------------------------------------------//
		//----------------------------SIMPLE TESTS-------------------------//
		//-----------------------------------------------------------------//

		_isBase(): boolean {
			return false;
		}

		_isArray(): boolean {
			return false;
		}

		_isNotBaseArray(): boolean {
			return false;
		}

		_isComplex(): boolean {
			return true;
		}

		_isEqual(pType: IAFXTypeInstruction): boolean {
			return this._getHash() === pType._getHash();
		}

		_isStrongEqual(pType: IAFXTypeInstruction): boolean {
			return this._getStrongHash() === pType._getStrongHash();
		}

		_isConst(): boolean {
			return false;
		}

		_isSampler(): boolean {
			return false;
		}

		_isSamplerCube(): boolean {
			return false;
		}

		_isSampler2D(): boolean {
			return false;
		}

		_isWritable(): boolean {
			return true;
		}

		_isReadable(): boolean {
			return true;
		}

		_containArray(): boolean {
			return this._isContainArray;
		}

		_containSampler(): boolean {
			return this._isContainSampler;
		}

		_containPointer(): boolean {
			return this._isContainPointer;
		}

		_containComplexType(): boolean {
			return this._isContainComplexType;
		}

		//-----------------------------------------------------------------//
		//----------------------------SET BASE TYPE INFO-------------------//
		//-----------------------------------------------------------------//

		_setName(sName: string): void {
			this._sName = sName;
			this._sRealName = sName;
		}

		setRealName(sRealName: string): void {
			this._sRealName = sRealName;
		}

		setSize(iSize: uint): void {
			this._iSize = iSize;
		}

		_canWrite(isWritable: boolean): void {
		}

		_canRead(isWritable: boolean): void {
		}

		//-----------------------------------------------------------------//
		//----------------------------INIT API-----------------------------//
		//-----------------------------------------------------------------//

		addField(pVariable: IAFXVariableDeclInstruction): void {
			if (isNull(this._pFieldDeclMap)) {
				this._pFieldDeclMap = <IAFXVariableDeclMap>{};
				this._pFieldNameList = [];
			}

			if (isNull(this._pFieldDeclList)) {
				this._pFieldDeclList = [];
			}

			var sVarName: string = pVariable.getName();
			this._pFieldDeclMap[sVarName] = pVariable;

			if (this._iSize !== Instruction.UNDEFINE_SIZE) {
				var iSize: uint = pVariable.getType()._getSize();
				if (iSize !== Instruction.UNDEFINE_SIZE) {
					this._iSize += iSize;
				}
				else {
					this._iSize = Instruction.UNDEFINE_SIZE;
				}
			}

			this._pFieldNameList.push(sVarName);

			if (this._pFieldDeclList.length < this._pFieldNameList.length) {
				this._pFieldDeclList.push(pVariable);
			}

			var pType: IAFXVariableTypeInstruction = pVariable.getType();
			//pType._markAsField();

			if (pType._isNotBaseArray() || pType._containArray()) {
				this._isContainArray = true;
			}

			if (Effect.isSamplerType(pType) || pType._containSampler()) {
				this._isContainSampler = true;
			}

			if (pType._isPointer() || pType._containPointer()) {
				this._isContainPointer = true;
			}

			if (pType._isComplex()) {
				this._isContainComplexType = true;
			}
		}

		addFields(pFieldCollector: IAFXInstruction, isSetParent: boolean = true): void {
			this._pFieldDeclList = <IAFXVariableDeclInstruction[]>(pFieldCollector._getInstructions());

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				this.addField(this._pFieldDeclList[i]);
				this._pFieldDeclList[i]._setParent(this);
			}

			this.calculatePaddings();
		}

		//-----------------------------------------------------------------//
		//----------------------------GET TYPE INFO------------------------//
		//-----------------------------------------------------------------//

		_getName(): string {
			return this._sName;
		}

		_getRealName(): string {
			return this._sRealName;
		}

		_getHash(): string {
			if (this._sHash === "") {
				this.calcHash();
			}

			return this._sHash;
		}

		_getStrongHash(): string {
			if (this._sStrongHash === "") {
				this.calcStrongHash();
			}

			return this._sStrongHash;
		}

		_hasField(sFieldName: string): boolean {
			return isDef(this._pFieldDeclMap[sFieldName]);
		}

		_hasFieldWithSematic(sSemantic: string): boolean {
			if (isNull(this._pFieldDeclBySemanticMap)) {
				this.analyzeSemantics();
			}

			return isDef(this._pFieldDeclBySemanticMap[sSemantic]);
		}

		_hasAllUniqueSemantics(): boolean {
			if (isNull(this._pFieldDeclBySemanticMap)) {
				this.analyzeSemantics();
			}
			return this._bHasAllUniqueSemantics;
		}

		_hasFieldWithoutSemantic(): boolean {
			if (isNull(this._pFieldDeclBySemanticMap)) {
				this.analyzeSemantics();
			}
			return this._bHasAllUniqueSemantics;
		}

		_getField(sFieldName: string): IAFXVariableDeclInstruction {
			if (!this._hasField(sFieldName)) {
				return null;
			}

			return this._pFieldDeclMap[sFieldName];
		}

		_getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
			if (!this._hasFieldWithSematic(sSemantic)) {
				return null;
			}

			return this._pFieldDeclBySemanticMap[sSemantic];
		}

		_getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
			return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
		}

		_getFieldNameList(): string[] {
			return this._pFieldNameList;
		}

		_getSize(): uint {
			if (this._iSize === Instruction.UNDEFINE_SIZE) {
				this._iSize = this._calcSize();
			}
			return this._iSize;
		}

		_getBaseType(): IAFXTypeInstruction {
			return this;
		}

		_getArrayElementType(): IAFXTypeInstruction {
			return null;
		}

		_getTypeDecl(): IAFXTypeDeclInstruction {
			return <IAFXTypeDeclInstruction>this._getParent();
		}

		_getLength(): uint {
			return 0;
		}

		_getFieldDeclList(): IAFXVariableDeclInstruction[] {
			return this._pFieldDeclList;
		}

		//-----------------------------------------------------------------//
		//----------------------------SYSTEM-------------------------------//
		//-----------------------------------------------------------------//

		_clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): ComplexTypeInstruction {
			if (this._pParentInstruction === null ||
				!isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) ||
				pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction) {
				//pRelationMap[this._getInstructionID()] = this;
				return this;
			}

			var pClone: ComplexTypeInstruction = <ComplexTypeInstruction>super._clone(pRelationMap);

			pClone._setCloneName(this._sName, this._sRealName);
			pClone._setCloneHash(this._sHash, this._sStrongHash);
			pClone._setCloneContain(this._isContainArray, this._isContainSampler);

			var pFieldDeclList: IAFXVariableDeclInstruction[] = new Array(this._pFieldDeclList.length);
			var pFieldNameList: string[] = new Array(this._pFieldNameList.length);
			var pFieldDeclMap: IAFXVariableDeclMap = <IAFXVariableDeclMap>{};

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				var pCloneVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i]._clone(pRelationMap);
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

		_blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction {
			if (pType === this) {
				return this;
			}

			if (eMode === EAFXBlendMode.k_TypeDecl) {
				return null;
			}

			if (eMode === EAFXBlendMode.k_Uniform || eMode === EAFXBlendMode.k_Attribute) {
				if (this._hasFieldWithoutSemantic() || pType._hasFieldWithoutSemantic()) {
					return null;
				}
			}

			var pFieldList: IAFXVariableDeclInstruction[] = this._pFieldDeclList;
			var pBlendType: ComplexTypeInstruction = new ComplexTypeInstruction();
			var pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{};

			if (isNull(pFieldList)) {
				logger.log(this, pType);
			}

			for (var i: uint = 0; i < pFieldList.length; i++) {
				var pField: IAFXVariableDeclInstruction = pFieldList[i];
				var pBlendField: IAFXVariableDeclInstruction = null;
				var sFieldName: string = pField.getName();
				var sFieldSemantic: string = pField.getSemantic();

				if (eMode === EAFXBlendMode.k_Shared) {
					if (pType._hasField(sFieldName)) {
						pBlendField = pField.blend(pType._getField(sFieldName), eMode);
					}
					else {
						pBlendField = pField._clone(pRelationMap);
					}
				}
				else if (eMode === EAFXBlendMode.k_Attribute ||
					eMode === EAFXBlendMode.k_Uniform ||
					eMode === EAFXBlendMode.k_VertexOut) {

					if (pType._hasFieldWithSematic(sFieldSemantic)) {
						pBlendField = pField.blend(pType._getFieldBySemantic(sFieldSemantic), eMode);
					}
					else {
						pBlendField = pField._clone(pRelationMap);
					}

					if (!isNull(pBlendField)) {
						pBlendField.getNameId().setName(sFieldSemantic);
						pBlendField.getNameId().setRealName(sFieldSemantic);
					}
				}

				if (isNull(pBlendField)) {
					return null;
				}

				pBlendType.addField(pBlendField);
			}

			pFieldList = (<ComplexTypeInstruction>pType)._getFieldDeclList();

			for (var i: uint = 0; i < pFieldList.length; i++) {
				var pField: IAFXVariableDeclInstruction = pFieldList[i];
				var pBlendField: IAFXVariableDeclInstruction = null;
				var sFieldName: string = pField.getName();
				var sFieldSemantic: string = pField.getSemantic();

				if (eMode === EAFXBlendMode.k_Shared) {
					if (!this._hasField(sFieldName)) {
						pBlendField = pField._clone(pRelationMap);
					}
				}
				else if (eMode === EAFXBlendMode.k_Attribute ||
					eMode === EAFXBlendMode.k_Uniform ||
					eMode === EAFXBlendMode.k_VertexOut) {

					if (!this._hasFieldWithSematic(sFieldSemantic)) {
						pBlendField = pField._clone(pRelationMap);
						pBlendField.getNameId().setName(sFieldSemantic);
						pBlendField.getNameId().setRealName(sFieldSemantic);
					}
				}

				if (!isNull(pBlendField)) {
					pBlendType.addField(pBlendField);
				}
			}

			pBlendType._setName(this._getName());
			pBlendType.setRealName(this._getRealName());

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

		_setCloneContain(isContainArray: boolean, isContainSampler: boolean): void {
			this._isContainArray = isContainArray;
			this._isContainSampler = isContainSampler;
		}

		_setCloneFields(pFieldDeclList: IAFXVariableDeclInstruction[], pFieldNameList: string[],
			pFieldDeclMap: IAFXVariableDeclMap): void {
			this._pFieldDeclList = pFieldDeclList;
			this._pFieldNameList = pFieldNameList;
			this._pFieldDeclMap = pFieldDeclMap;
		}

		_calcSize(): uint {
			var iSize: uint = 0;

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				var iFieldSize: uint = this._pFieldDeclList[i].getType()._getSize();

				if (iFieldSize === Instruction.UNDEFINE_SIZE) {
					iSize = Instruction.UNDEFINE_SIZE;
					break;
				}
				else {
					iSize += iFieldSize;
				}
			}

			return iSize;
		}

		private calcHash(): void {
			var sHash: string = "{";

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				sHash += this._pFieldDeclList[i].getType()._getHash() + ";";
			}

			sHash += "}";

			this._sHash = sHash;
		}

		private calcStrongHash(): void {
			var sStrongHash: string = "{";

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				sStrongHash += this._pFieldDeclList[i].getType()._getStrongHash() + ";";
			}

			sStrongHash += "}";

			this._sStrongHash = sStrongHash;
		}

		private analyzeSemantics(): void {
			this._pFieldDeclBySemanticMap = <IAFXVariableDeclMap>{};

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				var pVar: IAFXVariableDeclInstruction = this._pFieldDeclList[i];
				var sSemantic: string = pVar.getSemantic();

				if (sSemantic === "") {
					this._bHasFieldWithoutSemantic = true;
				}

				if (isDef(this._pFieldDeclBySemanticMap[sSemantic])) {
					this._bHasAllUniqueSemantics = false;
				}

				this._pFieldDeclBySemanticMap[sSemantic] = pVar;

				this._bHasFieldWithoutSemantic = this._bHasFieldWithoutSemantic || pVar.getType()._hasFieldWithoutSemantic();
				if (this._bHasAllUniqueSemantics && pVar.getType()._isComplex()) {
					this._bHasAllUniqueSemantics = pVar.getType()._hasAllUniqueSemantics();
				}
			}

		}

		private calculatePaddings(): void {
			var iPadding: uint = 0;

			for (var i: uint = 0; i < this._pFieldDeclList.length; i++) {
				var pVarType: IAFXVariableTypeInstruction = this._pFieldDeclList[i].getType();
				var iVarSize: uint = pVarType._getSize();

				if (iVarSize === Instruction.UNDEFINE_SIZE) {
					this._setError(EEffectErrors.CANNOT_CALCULATE_PADDINGS, { typeName: this._getName() });
					return;
				}

				pVarType.setPadding(iPadding);
				iPadding += iVarSize;
			}
		}
	}
}

