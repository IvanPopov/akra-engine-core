/// <reference path="../idl/IAFXInstruction.ts" />

/// <referene path="Instruction.ts" />
/// <referene path="VariableTypeInstruction.ts" />
/// <referene path="VariableInstruction.ts" />
/// <referene path="IdInstruction.ts" />

module akra.fx {
    export class SystemTypeInstruction extends Instruction implements IAFXTypeInstruction {
        private _sName: string = "";
        private _sRealName: string = "";
        private _pElementType: IAFXTypeInstruction = null;
        private _iLength: uint = 1;
        private _iSize: uint = null;
        private _pFieldDeclMap: IAFXVariableDeclMap = null;
        private _isArray: boolean = false;
        private _isWritable: boolean = true;
        private _isReadable: boolean = true;
        private _pFieldNameList: string[] = null;
        private _pWrapVariableType: IAFXVariableTypeInstruction = null;
        private _isBuiltIn: boolean = true;
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

        isBuiltIn(): boolean {
            return this._isBuiltIn;
        }

        setBuiltIn(isBuiltIn: boolean): void {
            this._isBuiltIn = isBuiltIn;
        }

        setDeclString(sDecl: string): void {
            this._sDeclString = sDecl;
        }

        //-----------------------------------------------------------------//
        //----------------------------SIMPLE TESTS-------------------------//
        //-----------------------------------------------------------------//

        isBase(): boolean {
            return true;
        }

        isArray(): boolean {
            return this._isArray;
        }

        isNotBaseArray(): boolean {
            return false;
        }

        isComplex(): boolean {
            return false;
        }

        isEqual(pType: IAFXTypeInstruction): boolean {
            return this.getHash() === pType.getHash();
        }

        isStrongEqual(pType: IAFXTypeInstruction): boolean {
            return this.getStrongHash() === pType.getStrongHash();
        }

        isConst(): boolean {
            return false;
        }

        isSampler(): boolean {
            return this.getName() === "sampler" ||
                this.getName() === "sampler2D" ||
                this.getName() === "samplerCUBE";
        }

        isSamplerCube(): boolean {
            return this.getName() === "samplerCUBE";
        }

        isSampler2D(): boolean {
            return this.getName() === "sampler" ||
                this.getName() === "sampler2D";
        }


        isWritable(): boolean {
            return this._isWritable;
        }

        isReadable(): boolean {
            return this._isReadable;
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

        setName(sName: string): void {
            this._sName = sName;
        }

        setRealName(sRealName: string): void {
            this._sRealName = sRealName;
        }

        setSize(iSize: uint): void {
            this._iSize = iSize;
        }

        _canWrite(isWritable: boolean): void {
            this._isWritable = isWritable;
        }

        _canRead(isReadable: boolean): void {
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

        addField(sFieldName: string, pType: IAFXTypeInstruction, isWrite: boolean = true,
            sRealFieldName: string = sFieldName): void {

            var pField: IAFXVariableDeclInstruction = new VariableDeclInstruction();
            var pFieldType: VariableTypeInstruction = new VariableTypeInstruction();
            var pFieldId: IAFXIdInstruction = new IdInstruction();

            pFieldType.pushType(pType);
            pFieldType._canWrite(isWrite);

            pFieldId.setName(sFieldName);
            pFieldId.setRealName(sRealFieldName);

            pField.push(pFieldType, true);
            pField.push(pFieldId, true);

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

        getName(): string {
            return this._sName;
        }

        getRealName(): string {
            return this._sRealName;
        }

        getHash(): string {
            return this._sRealName;
        }

        getStrongHash(): string {
            return this._sName;
        }

        getSize(): uint {
            return this._iSize;
        }

        getBaseType(): IAFXTypeInstruction {
            return this;
        }

        getVariableType(): IAFXVariableTypeInstruction {
            return this._pWrapVariableType;
        }

        getArrayElementType(): IAFXTypeInstruction {
            return this._pElementType;
        }

        getTypeDecl(): IAFXTypeDeclInstruction {
            if (this.isBuiltIn()) {
                return null;
            }

            return <IAFXTypeDeclInstruction>this.getParent();
        }


        getLength(): uint {
            return this._iLength;
        }

        hasField(sFieldName: string): boolean {
            return isDef(this._pFieldDeclMap[sFieldName]);
        }

        hasFieldWithSematic(sSemantic: string): boolean {
            return false;
        }

        hasAllUniqueSemantics(): boolean {
            return false;
        }

        hasFieldWithoutSemantic(): boolean {
            return false;
        }

        getField(sFieldName: string): IAFXVariableDeclInstruction {
            return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName] : null;
        }

        getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
            return null;
        }

        getFieldType(sFieldName: string): IAFXVariableTypeInstruction {
            return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
        }

        getFieldNameList(): string[] {
            return this._pFieldNameList;
        }

        //-----------------------------------------------------------------//
        //----------------------------SYSTEM-------------------------------//
        //-----------------------------------------------------------------//

        clone(pRelationMap?: IAFXInstructionMap): SystemTypeInstruction {
            return this;
        }

        blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction {
            if (this.isStrongEqual(pType)) {
                return this;
            }

            return null;
        }
    }
}
