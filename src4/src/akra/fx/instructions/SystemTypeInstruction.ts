/// <reference path="../../idl/IAFXInstruction.ts" />

/// <referene path="Instruction.ts" />
/// <referene path="VariableTypeInstruction.ts" />
/// <referene path="VariableInstruction.ts" />
/// <referene path="IdInstruction.ts" />

module akra.fx.instructions {
	export class SystemTypeInstruction extends Instruction implements IAFXTypeInstruction {
		private _sName: string = "";
		private _sRealName: string = "";
		private _pElementType: IAFXTypeInstruction = null;
		private _iLength: uint = 1;
		private _iSize: uint = null;
		private _pFieldDeclMap: IAFXVariableDeclMap = null;
		private _bIsArray: boolean = false;
		private _bIsWritable: boolean = true;
		private _bIsReadable: boolean = true;
		private _pFieldNameList: string[] = null;
		private _pWrapVariableType: IAFXVariableTypeInstruction = null;
		private _bIsBuiltIn: boolean = true;
		private _sDeclString: string = "";

		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_SystemTypeInstruction;
			this._pWrapVariableType = new VariableTypeInstruction();
			this._pWrapVariableType._pushType(this);
		}

		_toDeclString(): string {
			return this._sDeclString;
		}

		_toFinalCode(): string {
			return this._sRealName;
		}

		_isBuiltIn(): boolean {
			return this._bIsBuiltIn;
		}

		_setBuiltIn(isBuiltIn: boolean): void {
			this._bIsBuiltIn = isBuiltIn;
		}

		setDeclString(sDecl: string): void {
			this._sDeclString = sDecl;
		}

		//-----------------------------------------------------------------//
		//----------------------------SIMPLE TESTS-------------------------//
		//-----------------------------------------------------------------//

		_isBase(): boolean {
			return true;
		}

		_isArray(): boolean {
			return this._bIsArray;
		}

		_isNotBaseArray(): boolean {
			return false;
		}

		_isComplex(): boolean {
			return false;
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
			return this._getName() === "sampler" ||
				this._getName() === "sampler2D" ||
				this._getName() === "samplerCUBE";
		}

		_isSamplerCube(): boolean {
			return this._getName() === "samplerCUBE";
		}

		_isSampler2D(): boolean {
			return this._getName() === "sampler" ||
				this._getName() === "sampler2D";
		}


		_isWritable(): boolean {
			return this._bIsWritable;
		}

		_isReadable(): boolean {
			return this._bIsReadable;
		}

		_containArray(): boolean {
			return false;
		}

		_containSampler(): boolean {
			return false;
		}

		_containPointer(): boolean {
			return false;
		}

		_containComplexType(): boolean {
			return false;
		}

		//-----------------------------------------------------------------//
		//----------------------------SET BASE TYPE INFO-------------------//
		//-----------------------------------------------------------------//

		_setName(sName: string): void {
			this._sName = sName;
		}

		setRealName(sRealName: string): void {
			this._sRealName = sRealName;
		}

		setSize(iSize: uint): void {
			this._iSize = iSize;
		}

		_canWrite(isWritable: boolean): void {
			this._bIsWritable = isWritable;
		}

		_canRead(isReadable: boolean): void {
			this._bIsReadable = isReadable;
		}

		//-----------------------------------------------------------------//
		//---------------------------INIT API------------------------------//
		//-----------------------------------------------------------------//

		addIndex(pType: IAFXTypeInstruction, iLength: uint): void {
			this._pElementType = pType;
			this._iLength = iLength;
			this._iSize = iLength * pType._getSize();
			this._bIsArray = true;
		}

		addField(sFieldName: string, pType: IAFXTypeInstruction, isWrite: boolean = true,
			sRealFieldName: string = sFieldName): void {

			var pField: IAFXVariableDeclInstruction = new VariableDeclInstruction();
			var pFieldType: VariableTypeInstruction = new VariableTypeInstruction();
			var pFieldId: IAFXIdInstruction = new IdInstruction();

			pFieldType._pushType(pType);
			pFieldType._canWrite(isWrite);

			pFieldId._setName(sFieldName);
			pFieldId._setRealName(sRealFieldName);

			pField._push(pFieldType, true);
			pField._push(pFieldId, true);

			if (isNull(this._pFieldDeclMap)) {
				this._pFieldDeclMap = <IAFXVariableDeclMap>{};
			}

			this._pFieldDeclMap[sFieldName] = pField;

			if (isNull(this._pFieldNameList)) {
				this._pFieldNameList = [];
			}

			this._pFieldNameList.push(sFieldName);
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
			return this._sRealName;
		}

		_getStrongHash(): string {
			return this._sName;
		}

		_getSize(): uint {
			return this._iSize;
		}

		_getBaseType(): IAFXTypeInstruction {
			return this;
		}

		getVariableType(): IAFXVariableTypeInstruction {
			return this._pWrapVariableType;
		}

		_getArrayElementType(): IAFXTypeInstruction {
			return this._pElementType;
		}

		_getTypeDecl(): IAFXTypeDeclInstruction {
			if (this._isBuiltIn()) {
				return null;
			}

			return <IAFXTypeDeclInstruction>this._getParent();
		}


		_getLength(): uint {
			return this._iLength;
		}

		_hasField(sFieldName: string): boolean {
			return isDef(this._pFieldDeclMap[sFieldName]);
		}

		_hasFieldWithSematic(sSemantic: string): boolean {
			return false;
		}

		_hasAllUniqueSemantics(): boolean {
			return false;
		}

		_hasFieldWithoutSemantic(): boolean {
			return false;
		}

		_getField(sFieldName: string): IAFXVariableDeclInstruction {
			return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName] : null;
		}

		_getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
			return null;
		}

		_getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
			return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName]._getType() : null;
		}

		_getFieldNameList(): string[] {
			return this._pFieldNameList;
		}

		//-----------------------------------------------------------------//
		//----------------------------SYSTEM-------------------------------//
		//-----------------------------------------------------------------//

		_clone(pRelationMap?: IAFXInstructionMap): SystemTypeInstruction {
			return this;
		}

		_blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction {
			if (this._isStrongEqual(pType)) {
				return this;
			}

			return null;
		}
	}
}
