/// <reference path="../idl/AIAFXInstruction.ts" />

import Instruction = require("fx/Instruction");
import VariableTypeInstruction = require("fx/VariableTypeInstruction");
import VariableDeclInstruction = require("fx/VariableInstruction");
import IdInstruction = require("fx/IdInstruction");

class SystemTypeInstruction extends Instruction implements AIAFXTypeInstruction {
    private _sName: string = "";
    private _sRealName: string = "";
    private _pElementType: AIAFXTypeInstruction = null;
    private _iLength: uint = 1;
    private _iSize: uint = null;
    private _pFieldDeclMap: AIAFXVariableDeclMap = null;
    private _isArray: boolean = false;
    private _isWritable: boolean = true;
    private _isReadable: boolean = true;
    private _pFieldNameList: string[] = null;
    private _pWrapVariableType: AIAFXVariableTypeInstruction = null;
    private _isBuiltIn: boolean = true;
    private _sDeclString: string = "";

    constructor() {
        super();
        this._eInstructionType = AEAFXInstructionTypes.k_SystemTypeInstruction;
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

    isEqual(pType: AIAFXTypeInstruction): boolean {
        return this.getHash() === pType.getHash();
    }

    isStrongEqual(pType: AIAFXTypeInstruction): boolean {
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

    addIndex(pType: AIAFXTypeInstruction, iLength: uint): void {
        this._pElementType = pType;
        this._iLength = iLength;
        this._iSize = iLength * pType.getSize();
        this._isArray = true;
    }

    addField(sFieldName: string, pType: AIAFXTypeInstruction, isWrite: boolean = true,
        sRealFieldName: string = sFieldName): void {

        var pField: AIAFXVariableDeclInstruction = new VariableDeclInstruction();
        var pFieldType: VariableTypeInstruction = new VariableTypeInstruction();
        var pFieldId: AIAFXIdInstruction = new IdInstruction();

        pFieldType.pushType(pType);
        pFieldType._canWrite(isWrite);

        pFieldId.setName(sFieldName);
        pFieldId.setRealName(sRealFieldName);

        pField.push(pFieldType, true);
        pField.push(pFieldId, true);

        if (isNull(this._pFieldDeclMap)) {
            this._pFieldDeclMap = <AIAFXVariableDeclMap>{};
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

    getBaseType(): AIAFXTypeInstruction {
        return this;
    }

    getVariableType(): AIAFXVariableTypeInstruction {
        return this._pWrapVariableType;
    }

    getArrayElementType(): AIAFXTypeInstruction {
        return this._pElementType;
    }

    getTypeDecl(): AIAFXTypeDeclInstruction {
        if (this.isBuiltIn()) {
            return null;
        }

        return <AIAFXTypeDeclInstruction>this.getParent();
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

    getField(sFieldName: string): AIAFXVariableDeclInstruction {
        return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName] : null;
    }

    getFieldBySemantic(sSemantic: string): AIAFXVariableDeclInstruction {
        return null;
    }

    getFieldType(sFieldName: string): AIAFXVariableTypeInstruction {
        return isDef(this._pFieldDeclMap[sFieldName]) ? this._pFieldDeclMap[sFieldName].getType() : null;
    }

    getFieldNameList(): string[] {
        return this._pFieldNameList;
    }

    //-----------------------------------------------------------------//
    //----------------------------SYSTEM-------------------------------//
    //-----------------------------------------------------------------//

    clone(pRelationMap?: AIAFXInstructionMap): SystemTypeInstruction {
        return this;
    }

    blend(pType: AIAFXTypeInstruction, eMode: AEAFXBlendMode): AIAFXTypeInstruction {
        if (this.isStrongEqual(pType)) {
            return this;
        }

        return null;
    }
}


export = SystemTypeInstruction;