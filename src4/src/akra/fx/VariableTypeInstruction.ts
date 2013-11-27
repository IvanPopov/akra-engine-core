/// <reference path="../idl/AIAFXInstruction.ts" />

import Instruction = require("fx/Instruction");
import Effect = require("fx/Effect");
import IdInstruction = require("fx/IdInstruction");
import VariableDeclInstruction = require("fx/VariableInstruction");
import IntInstruction = require("IntInstruction");
import IdExprInstruction = require("fx/IdExprInstruction");

class VariableTypeInstruction extends Instruction implements AIAFXVariableTypeInstruction {
    private _pSubType: AIAFXTypeInstruction = null;
    private _pUsageList: string[] = null;

    private _sName: string = "";
    private _isWritable: boolean = null;
    private _isReadable: boolean = null;

    private _bUsedForWrite: boolean = false;
    private _bUsedForRead: boolean = false;

    private _sHash: string = "";
    private _sStrongHash: string = "";
    private _isArray: boolean = false;
    private _isPointer: boolean = false;
    private _isStrictPointer: boolean = false;
    private _isPointIndex: boolean = false;
    private _isUniform: boolean = false;
    private _isGlobal: boolean = false;
    private _isConst: boolean = false;
    private _isShared: boolean = false;
    private _isForeign: boolean = false;
    private _iLength: uint = Instruction.UNDEFINE_LENGTH;
    private _isNeedToUpdateLength: boolean = false;

    private _isFromVariableDecl: boolean = null;
    private _isFromTypeDecl: boolean = null;
    private _isField: boolean = false;

    private _pArrayIndexExpr: AIAFXExprInstruction = null;
    private _pArrayElementType: AIAFXVariableTypeInstruction = null;

    private _pFieldDeclMap: AIAFXVariableDeclMap = null;
    private _pFieldDeclBySemanticMap: AIAFXVariableDeclMap = null;
    private _pFieldIdMap: AIAFXIdExprMap = null;
    private _pUsedFieldMap: AIAFXVarUsedModeMap = null;

    private _pVideoBuffer: AIAFXVariableDeclInstruction = null;
    private _pMainPointIndex: AIAFXVariableDeclInstruction = null;
    private _pUpPointIndex: AIAFXVariableDeclInstruction = null;
    private _pDownPointIndex: AIAFXVariableDeclInstruction = null;
    private _nPointDim: uint = 0;
    private _pPointerList: AIAFXVariableDeclInstruction[] = null;
    private _iPadding: uint = Instruction.UNDEFINE_PADDING;

    private _pSubDeclList: AIAFXVariableDeclInstruction[] = null;
    private _pAttrOffset: AIAFXVariableDeclInstruction = null;

    private _bUnverifiable: boolean = false;
    private _bCollapsed: boolean = false;

    constructor() {
        super();
        this._pInstructionList = null;
        this._eInstructionType = AEAFXInstructionTypes.k_VariableTypeInstruction;
    }

    toFinalCode(): string {
        var sCode: string = "";
        if (!isNull(this._pUsageList)) {
            if (!this.isShared()) {
                for (var i: uint = 0; i < this._pUsageList.length; i++) {
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

    isBuiltIn(): boolean {
        return false;
    }

    setBuiltIn(isBuiltIn: boolean): void {
    }

    _setCollapsed(bValue: boolean): void {
        this._bCollapsed = bValue;
    }

    _isCollapsed(): boolean {
        return this._bCollapsed;
    }

    //-----------------------------------------------------------------//
    //----------------------------SIMPLE TESTS-------------------------//
    //-----------------------------------------------------------------//

    isBase(): boolean {
        return this.getSubType().isBase() && this._isArray === false;
    }

    isArray(): boolean {
        return this._isArray ||
            (this.getSubType().isArray());
    }

    isNotBaseArray(): boolean {
        return this._isArray || (this.getSubType().isNotBaseArray());
    }

    isComplex(): boolean {
        return this.getSubType().isComplex();
    }

    isEqual(pType: AIAFXTypeInstruction): boolean {
        if (this._isUnverifiable()) {
            return true;
        }

        if (this.isNotBaseArray() && pType.isNotBaseArray() &&
            (this.getLength() !== pType.getLength() ||
            this.getLength() === Instruction.UNDEFINE_LENGTH ||
            pType.getLength() === Instruction.UNDEFINE_LENGTH)) {
            return false;
        }

        if (this.getHash() !== pType.getHash()) {
            return false;
        }

        return true;
    }

    isStrongEqual(pType: AIAFXTypeInstruction): boolean {
        if (!this.isEqual(pType) || this.getStrongHash() !== pType.getStrongHash()) {
            return false;
        }

        return true;
    }

    isSampler(): boolean {
        return this.getSubType().isSampler();
    }

    isSamplerCube(): boolean {
        return this.getSubType().isSamplerCube();
    }

    isSampler2D(): boolean {
        return this.getSubType().isSampler2D();
    }

    isWritable(): boolean {
        if (!isNull(this._isWritable)) {
            return this._isWritable;
        }

        if ((this.isArray() && !this.isBase()) ||
            this.isForeign() || this.isUniform()) {
            this._isWritable = false;
        }
        else {
            this._isWritable = this.getSubType().isWritable();
        }

        return this._isWritable;
    }

    isReadable(): boolean {
        if (!isNull(this._isReadable)) {
            return this._isReadable;
        }

        if (this.hasUsage("out")) {
            this._isReadable = false;
        }
        else {
            this._isReadable = this.getSubType().isReadable();
        }

        return this._isReadable;
    }

    _containArray(): boolean {
        return this.getSubType()._containArray();
    }

    _containSampler(): boolean {
        return this.getSubType()._containSampler();
    }

    _containPointer(): boolean {
        return this.getSubType()._containPointer();
    }

    _containComplexType(): boolean {
        return this.getSubType()._containComplexType();
    }

    isPointer(): boolean {
        return this._isPointer ||
            (this.getSubType()._getInstructionType() === AEAFXInstructionTypes.k_VariableTypeInstruction &&
            (<AIAFXVariableTypeInstruction>this.getSubType()).isPointer());
    }

    isStrictPointer(): boolean {
        return this._isStrictPointer ||
            (this.getSubType()._getInstructionType() === AEAFXInstructionTypes.k_VariableTypeInstruction &&
            (<AIAFXVariableTypeInstruction>this.getSubType()).isStrictPointer());
    }

    isPointIndex(): boolean {
        if (isNull(this._isPointIndex)) {
            this._isPointIndex = this.isStrongEqual(Effect.getSystemType("ptr"));
        }

        return this._isPointIndex;
    }

    isFromVariableDecl(): boolean {
        if (!isNull(this._isFromVariableDecl)) {
            return this._isFromVariableDecl;
        }

        if (isNull(this.getParent())) {
            this._isFromVariableDecl = false;
        }
        else {
            var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

            if (eParentType === AEAFXInstructionTypes.k_VariableDeclInstruction) {
                this._isFromVariableDecl = true;
            }
            else if (eParentType === AEAFXInstructionTypes.k_VariableTypeInstruction) {
                this._isFromVariableDecl = (<AIAFXVariableTypeInstruction>this.getParent()).isFromVariableDecl();
            }
            else {
                this._isFromVariableDecl = false;
            }
        }

        return this._isFromVariableDecl;
    }

    isFromTypeDecl(): boolean {
        if (!isNull(this._isFromTypeDecl)) {
            return this._isFromTypeDecl;
        }

        if (isNull(this.getParent())) {
            this._isFromTypeDecl = false;
        }
        else {
            var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

            if (eParentType === AEAFXInstructionTypes.k_TypeDeclInstruction) {
                this._isFromTypeDecl = true;
            }
            else if (eParentType === AEAFXInstructionTypes.k_VariableTypeInstruction) {
                this._isFromTypeDecl = (<AIAFXVariableTypeInstruction>this.getParent()).isFromVariableDecl();
            }
            else {
                this._isFromTypeDecl = false;
            }
        }

        return this._isFromTypeDecl;
    }

    isUniform(): boolean {
        if (isNull(this._isUniform)) {
            this._isUniform = this.hasUsage("uniform");
        }

        return this._isUniform;
    }

    isGlobal(): boolean {
        if (isNull(this._isGlobal)) {
            this._isGlobal = this._getScope() === 0;
        }

        return this._isGlobal;
    }

    isConst(): boolean {
        if (isNull(this._isConst)) {
            this._isConst = this.hasUsage("const");
        }

        return this._isConst;
    }

    isShared(): boolean {
        if (isNull(this._isShared)) {
            this._isShared = this.hasUsage("shared");
        }

        return this._isShared;
    }

    isForeign(): boolean {
        if (isNull(this._isForeign)) {
            this._isForeign = this.hasUsage("foreign");
        }

        return this._isForeign;
    }

    _isTypeOfField(): boolean {
        if (isNull(this.getParent())) {
            return false;
        }

        if (this.getParent()._getInstructionType() === AEAFXInstructionTypes.k_VariableDeclInstruction) {
            var pParentDecl: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>this.getParent();
            return pParentDecl.isField();
        }

        return false;
    }

    _isUnverifiable(): boolean {
        return this._bUnverifiable;
    }

    //-----------------------------------------------------------------//
    //----------------------------SET TYPE INFO------------------------//
    //-----------------------------------------------------------------//

    setName(sName: string): void {
        this._sName = sName;
    }

    _canWrite(isWritable: boolean): void {
        this._isWritable = isWritable;
    }

    _canRead(isReadable: boolean): void {
        this._isReadable = isReadable;
    }

    //-----------------------------------------------------------------//
    //----------------------------INIT API-----------------------------//
    //-----------------------------------------------------------------//
    setPadding(iPadding: uint): void {
        this._iPadding = iPadding;
    }

    pushType(pType: AIAFXTypeInstruction): void {
        var eType: AEAFXInstructionTypes = pType._getInstructionType();

        if (eType === AEAFXInstructionTypes.k_SystemTypeInstruction ||
            eType === AEAFXInstructionTypes.k_ComplexTypeInstruction) {
            this._pSubType = pType;
        }
        else {
            var pVarType: AIAFXVariableTypeInstruction = <AIAFXVariableTypeInstruction>pType;
            if (!pVarType.isNotBaseArray() && !pVarType.isPointer()) {
                var pUsageList: string[] = pVarType.getUsageList();
                if (!isNull(pUsageList)) {
                    for (var i: uint = 0; i < pUsageList.length; i++) {
                        this.addUsage(pUsageList[i]);
                    }
                }

                this._pSubType = pVarType.getSubType();
            }
            else {
                this._pSubType = pType;
            }
        }

    }

    addUsage(sUsage: string): void {
        if (isNull(this._pUsageList)) {
            this._pUsageList = [];
        }

        if (!this.hasUsage(sUsage)) {
            this._pUsageList.push(sUsage);
        }
    }

    addArrayIndex(pExpr: AIAFXExprInstruction): void {
        //TODO: add support for v[][10]

        this._pArrayElementType = new VariableTypeInstruction();
        this._pArrayElementType.pushType(this.getSubType());
        if (!isNull(this._pUsageList)) {
            for (var i: uint = 0; i < this._pUsageList.length; i++) {
                this._pArrayElementType.addUsage(this._pUsageList[i]);
            }
        }
        this._pArrayElementType.setParent(this);

        this._pArrayIndexExpr = pExpr;

        this._iLength = this._pArrayIndexExpr.evaluate() ? this._pArrayIndexExpr.getEvalValue() : Instruction.UNDEFINE_LENGTH;

        this._isArray = true;

        if (this._iLength === Instruction.UNDEFINE_LENGTH) {
            this._isNeedToUpdateLength = true;
        }
    }

    addPointIndex(isStrict: boolean = true): void {
        this._nPointDim++;
        this._isPointer = true;
        if (isStrict) {
            this._isStrictPointer = true;
        }
    }

    setVideoBuffer(pBuffer: AIAFXVariableDeclInstruction): void {
        if (this.isPointIndex()) {
            (<AIAFXVariableDeclInstruction>this.getParent().getParent()).getType().setVideoBuffer(pBuffer);
            return;
        }

        this._pVideoBuffer = pBuffer;

        if (!this.isComplex()) {
            return;
        }

        var pFieldNameList: string[] = this.getFieldNameList();

        for (var i: uint = 0; i < pFieldNameList.length; i++) {
            var pFieldType: AIAFXVariableTypeInstruction = this.getFieldType(pFieldNameList[i]);

            if (pFieldType.isPointer()) {
                pFieldType.setVideoBuffer(pBuffer);
            }
        }
    }

    initializePointers(): void {
        this._pPointerList = [];
        var pDownPointer: AIAFXVariableDeclInstruction = this._getParentVarDecl();

        for (var i: uint = 0; i < this.getPointDim(); i++) {
            var pPointer: AIAFXVariableDeclInstruction = new VariableDeclInstruction();
            var pPointerType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
            var pPointerId: AIAFXIdInstruction = new IdInstruction();

            pPointer.push(pPointerType, true);
            pPointer.push(pPointerId, true);

            pPointerType.pushType(Effect.getSystemType("ptr"));
            pPointerId.setName(Instruction.UNDEFINE_NAME);
            pPointerId.setName(this._getParentVarDecl().getName() + "_pointer_" + i.toString());

            if (i > 0) {
                (this._pPointerList[i - 1].getType())._setUpDownPointers(pPointer, pDownPointer);
                pDownPointer = this._pPointerList[i - 1];
            }
            else {
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
        if (!this.isComplex()) {
            return;
        }

        var pFieldNameList: string[] = this.getFieldNameList();

        for (var i: uint = 0; i < pFieldNameList.length; i++) {
            var pFieldType: AIAFXVariableTypeInstruction = this.getFieldType(pFieldNameList[i]);
            if (!pFieldType.isPointer()) {
                pFieldType.addPointIndex(false);
                pFieldType._setVideoBufferInDepth();
            }
        }
    }

    _setVideoBufferInDepth(): void {
        if (this.isPointer()) {
            this.setVideoBuffer(Effect.createVideoBufferVariable());
        }
        else if (this.isComplex() && this._containPointer()) {
            var pFieldNameList: string[] = this.getFieldNameList();

            for (var i: uint = 0; i < pFieldNameList.length; i++) {
                var pFieldType: AIAFXVariableTypeInstruction = this.getFieldType(pFieldNameList[i]);

                pFieldType._setVideoBufferInDepth();
            }
        }
    }

    _markAsUnverifiable(isUnverifiable: boolean): void {
        this._bUnverifiable = true;
    }

    _addAttrOffset(pOffset: AIAFXVariableDeclInstruction): void {
        this._pAttrOffset = pOffset;
    }


    //-----------------------------------------------------------------//
    //----------------------------GET TYPE INFO------------------------//
    //-----------------------------------------------------------------//	

    getName(): string {
        return this._sName;
    }

    getRealName(): string {
        return this.getBaseType().getRealName();
    }

    getHash(): string {
        if (this._sHash === "") {
            this.calcHash();
        }

        return this._sHash;
    }

    getStrongHash(): string {
        if (this._sStrongHash === "") {
            this.calcStrongHash();
        }

        return this._sStrongHash;
    }

    getSize(): uint {
        if (this.isPointer() || this.isPointIndex()) {
            return 1;
        }

        if (this._isArray) {
            var iSize: uint = this._pArrayElementType.getSize();
            if (this._iLength === Instruction.UNDEFINE_LENGTH ||
                iSize === Instruction.UNDEFINE_SIZE) {
                    return Instruction.UNDEFINE_SIZE;
            }
            else {
                return iSize * this._iLength;
            }
        }
        else {
            return this.getSubType().getSize();
        }
    }

    getBaseType(): AIAFXTypeInstruction {
        return this.getSubType().getBaseType();
    }

    getLength(): uint {
        if (!this.isNotBaseArray()) {
            this._iLength = 0;
            return 0;
        }

        if (this.isNotBaseArray() && !this._isArray) {
            this._iLength = this.getSubType().getLength();
        }
        else if (this._iLength === Instruction.UNDEFINE_LENGTH || this._isNeedToUpdateLength) {
            var isEval: boolean = this._pArrayIndexExpr.evaluate();

            if (isEval) {
                var iValue: uint = <uint>this._pArrayIndexExpr.getEvalValue();
                this._iLength = isInt(iValue) ? iValue : Instruction.UNDEFINE_LENGTH;
            }
        }

        return this._iLength;
    }

    getPadding(): uint {
        return this.isPointIndex() ? this._getDownPointer().getType().getPadding() : this._iPadding;
    }

    getArrayElementType(): AIAFXVariableTypeInstruction {
        if (this._isUnverifiable()) {
            return this;
        }

        if (!this.isArray()) {
            return null;
        }

        if (isNull(this._pArrayElementType)) {
            this._pArrayElementType = new VariableTypeInstruction();
            this._pArrayElementType.pushType(this.getSubType().getArrayElementType());
            if (!isNull(this._pUsageList)) {
                for (var i: uint = 0; i < this._pUsageList.length; i++) {
                    this._pArrayElementType.addUsage(this._pUsageList[i]);
                }
            }
            this._pArrayElementType.setParent(this);
        }

        return this._pArrayElementType;
    }

    getTypeDecl(): AIAFXTypeDeclInstruction {
        if (!this.isFromTypeDecl()) {
            return null;
        }

        var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

        if (eParentType === AEAFXInstructionTypes.k_TypeDeclInstruction) {
            return <AIAFXTypeDeclInstruction>this.getParent();
        }
        else {
            return (<AIAFXTypeInstruction>this.getParent()).getTypeDecl();
        }
    }

    hasField(sFieldName: string): boolean {
        return this._isUnverifiable() ? true : this.getSubType().hasField(sFieldName);
    }

    hasFieldWithSematic(sSemantic: string): boolean {
        if (!this.isComplex()) {
            return false;
        }

        return this.getSubType().hasFieldWithSematic(sSemantic);
    }

    hasAllUniqueSemantics(): boolean {
        if (!this.isComplex()) {
            return false;
        }

        return this.getSubType().hasAllUniqueSemantics();
    }

    hasFieldWithoutSemantic(): boolean {
        if (!this.isComplex()) {
            return false;
        }

        return this.getSubType().hasFieldWithoutSemantic();
    }

    getField(sFieldName: string): AIAFXVariableDeclInstruction {
        if (!this.hasField(sFieldName)) {
            return null;
        }

        if (isNull(this._pFieldDeclMap)) {
            this._pFieldDeclMap = <AIAFXVariableDeclMap>{};
        }

        if (isDef(this._pFieldDeclMap[sFieldName])) {
            return this._pFieldDeclMap[sFieldName];
        }

        var pField: AIAFXVariableDeclInstruction = new VariableDeclInstruction();

        if (!this._isUnverifiable()) {
            var pSubField: AIAFXVariableDeclInstruction = this.getSubType().getField(sFieldName);

            var pFieldType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
            pFieldType.pushType(pSubField.getType());
            // if(!this.isBase()){
            pFieldType.setPadding(pSubField.getType().getPadding());
            // }
            pField.push(pFieldType, true);
            pField.push(pSubField.getNameId(), false);
            pField.setSemantic(pSubField.getSemantic());
        }
        else {
            var pFieldName: AIAFXIdInstruction = new IdInstruction();

            pFieldName.setName(sFieldName);
            pFieldName.setRealName(sFieldName);

            pField.push(this, false);
            pField.push(pFieldName, true);
        }

        pField.setParent(this);

        this._pFieldDeclMap[sFieldName] = pField;

        return pField;
    }

    getFieldBySemantic(sSemantic: string): AIAFXVariableDeclInstruction {
        if (this.hasFieldWithSematic(sSemantic)) {
            return null;
        }

        if (isNull(this._pFieldDeclBySemanticMap)) {
            this._pFieldDeclBySemanticMap = <AIAFXVariableDeclMap>{};
        }

        if (isDef(this._pFieldDeclBySemanticMap[sSemantic])) {
            return this._pFieldDeclBySemanticMap[sSemantic];
        }

        var pField: AIAFXVariableDeclInstruction = new VariableDeclInstruction();
        var pSubField: AIAFXVariableDeclInstruction = this.getSubType().getFieldBySemantic(sSemantic);

        var pFieldType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
        pFieldType.pushType(pSubField.getType());
        // if(!this.isBase()){
        pFieldType.setPadding(pSubField.getType().getPadding());
        // }
        pField.push(pFieldType, true);
        pField.push(pSubField.getNameId(), false);


        pField.setParent(this);

        this._pFieldDeclBySemanticMap[sSemantic] = pField;

        return pField;
    }

    getFieldType(sFieldName: string): AIAFXVariableTypeInstruction {
        return <AIAFXVariableTypeInstruction>this.getField(sFieldName).getType();
    }

    getFieldNameList(): string[] {
        return this.getSubType().getFieldNameList();
    }


    getUsageList(): string[] {
        return this._pUsageList;
    }

    getSubType(): AIAFXTypeInstruction {
        return this._pSubType;
    }

    hasUsage(sUsageName: string): boolean {
        if (isNull(this._pUsageList)) {
            return false;
        }

        for (var i: uint = 0; i < this._pUsageList.length; i++) {
            if (this._pUsageList[i] === sUsageName) {
                return true;
            }
        }

        if (!isNull(this.getSubType()) && this.getSubType()._getInstructionType() === AEAFXInstructionTypes.k_VariableTypeInstruction) {
            return (<AIAFXVariableTypeInstruction>this.getSubType()).hasUsage(sUsageName);
        }

        return false;
    }

    hasVideoBuffer(): boolean {
        return !isNull(this.getVideoBuffer());
    }

    getPointDim(): uint {
        return this._nPointDim ||
            ((this.getSubType()._getInstructionType() === AEAFXInstructionTypes.k_VariableTypeInstruction) ?
            (<AIAFXVariableTypeInstruction>this.getSubType()).getPointDim() : 0);
    }

    getPointer(): AIAFXVariableDeclInstruction {
        if (!this.isFromVariableDecl() ||
            !(this.isPointer() || this.isPointIndex()) || !this.hasVideoBuffer()) {
            return null;
        }

        if (!isNull(this._pUpPointIndex)) {
            return this._pUpPointIndex;
        }

        if (this.isPointIndex()) {
            return null;
        }

        this.initializePointers();

        return this._pUpPointIndex;
    }

    getVideoBuffer(): AIAFXVariableDeclInstruction {
        if (this.isPointIndex()) {
            return (<AIAFXVariableDeclInstruction>this.getParent().getParent()).getType().getVideoBuffer();
        }

        return this._pVideoBuffer;
    }

    getFieldExpr(sFieldName: string): AIAFXIdExprInstruction {
        if (!this.hasField(sFieldName)) {
            return null;
        }
        var pField: AIAFXVariableDeclInstruction = this.getField(sFieldName);
        var pExpr: AIAFXIdExprInstruction = new IdExprInstruction();
        pExpr.push(pField.getNameId(), false);
        pExpr.setType(pField.getType());

        return pExpr;
    }

    getFieldIfExist(sFieldName: string): AIAFXVariableDeclInstruction {
        if (isNull(this._pFieldDeclMap) && isDef(this._pFieldDeclMap[sFieldName])) {
            return this._pFieldDeclMap[sFieldName];
        }
        else {
            return null;
        }
    }

    getSubVarDecls(): AIAFXVariableDeclInstruction[] {
        if (!this.canHaveSubDecls()) {
            return null;
        }

        if (isNull(this._pSubDeclList)) {
            this.generateSubDeclList();
        }
        return this._pSubDeclList;
    }

    _getFullName(): string {
        if (!this.isFromVariableDecl()) {
            return "Not from variable decl";
        }

        var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

        if (eParentType === AEAFXInstructionTypes.k_VariableDeclInstruction) {
            return (<AIAFXVariableDeclInstruction>this.getParent())._getFullName();
        }
        else {
            return (<AIAFXVariableTypeInstruction>this.getParent())._getFullName();
        }
    }

    _getVarDeclName(): string {
        if (!this.isFromVariableDecl()) {
            return "";
        }

        var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

        if (eParentType === AEAFXInstructionTypes.k_VariableDeclInstruction) {
            return (<AIAFXVariableDeclInstruction>this.getParent()).getName();
        }
        else {
            return (<AIAFXVariableTypeInstruction>this.getParent())._getVarDeclName();
        }
    }

    _getTypeDeclName(): string {
        if (!this.isFromVariableDecl()) {
            return "";
        }

        var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

        if (eParentType === AEAFXInstructionTypes.k_VariableDeclInstruction) {
            return (<AIAFXTypeDeclInstruction>this.getParent()).getName();
        }
        else {
            return (<AIAFXVariableTypeInstruction>this.getParent())._getTypeDeclName();
        }
    }

    _getParentVarDecl(): AIAFXVariableDeclInstruction {
        if (!this.isFromVariableDecl()) {
            return null;
        }

        var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

        if (eParentType === AEAFXInstructionTypes.k_VariableDeclInstruction) {
            return <AIAFXVariableDeclInstruction>this.getParent();
        }
        else {
            return (<AIAFXVariableTypeInstruction>this.getParent())._getParentVarDecl();
        }
    }

    _getParentContainer(): AIAFXVariableDeclInstruction {
        if (!this.isFromVariableDecl() || !this._isTypeOfField()) {
            return null;
        }

        var pContainerType: AIAFXVariableTypeInstruction = <AIAFXVariableTypeInstruction>this._getParentVarDecl().getParent();
        if (!pContainerType.isFromVariableDecl()) {
            return null;
        }

        return pContainerType._getParentVarDecl();
    }

    _getMainVariable(): AIAFXVariableDeclInstruction {
        if (!this.isFromVariableDecl()) {
            return null;
        }

        if (this._isTypeOfField()) {
            return (<AIAFXVariableTypeInstruction>this.getParent().getParent())._getMainVariable();
        }
        else {
            return (<AIAFXVariableDeclInstruction>this._getParentVarDecl());
        }
    }

    _getMainPointer(): AIAFXVariableDeclInstruction {
        if (isNull(this._pMainPointIndex)) {
            if (isNull(this.getPointer())) {
                this._pMainPointIndex = this._getParentVarDecl()
				}
            else {
                this._pMainPointIndex = this._getUpPointer().getType()._getMainPointer();
            }
        }

        return this._pMainPointIndex;
    }

    _getUpPointer(): AIAFXVariableDeclInstruction {
        return this._pUpPointIndex;
    }

    _getDownPointer(): AIAFXVariableDeclInstruction {
        return this._pDownPointIndex;
    }

    _getAttrOffset(): AIAFXVariableDeclInstruction {
        return this._pAttrOffset;
    }

    //-----------------------------------------------------------------//
    //----------------------------SYSTEM-------------------------------//
    //-----------------------------------------------------------------//		

    wrap(): AIAFXVariableTypeInstruction {
        var pCloneType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
        pCloneType.pushType(this);

        return pCloneType;
    }

    clone(pRelationMap: AIAFXInstructionMap = <AIAFXInstructionMap>{}): AIAFXVariableTypeInstruction {
        if (isDef(pRelationMap[this._getInstructionID()])) {
            return <AIAFXVariableTypeInstruction>pRelationMap[this._getInstructionID()];
        }

        if (this._pParentInstruction === null ||
            !isDef(pRelationMap[this._pParentInstruction._getInstructionID()]) ||
            pRelationMap[this._pParentInstruction._getInstructionID()] === this._pParentInstruction) {
            //pRelationMap[this._getInstructionID()] = this;
            return this;
        }

        var pClone: AIAFXVariableTypeInstruction = <AIAFXVariableTypeInstruction>super.clone(pRelationMap);

        pClone.pushType(this._pSubType.clone(pRelationMap));
        if (!isNull(this._pUsageList)) {
            for (var i: uint = 0; i < this._pUsageList.length; i++) {
                pClone.addUsage(this._pUsageList[i]);
            }
        }

        pClone._canWrite(this._isWritable);
        pClone._canRead(this._isReadable);
        pClone._setCloneHash(this._sHash, this._sStrongHash);
        pClone.setPadding(this.getPadding());

        if (this._isArray) {
            this._setCloneArrayIndex(this._pArrayElementType.clone(pRelationMap),
                this._pArrayIndexExpr.clone(pRelationMap),
                this._iLength);
        }

        if (this._isPointer) {
            var pClonePointerList: AIAFXVariableDeclInstruction[] = null;
            if (!isNull(this._pPointerList)) {
                pClonePointerList = new Array(this._pPointerList.length);
                var pDownPointer: AIAFXVariableDeclInstruction = pClone._getParentVarDecl();

                for (var i: uint = 0; i < this._pPointerList.length; i++) {
                    pClonePointerList[i] = this._pPointerList[i].clone(pRelationMap);

                    if (i > 0) {
                        (pClonePointerList[i - 1].getType())._setUpDownPointers(pClonePointerList[i], pDownPointer);
                        pDownPointer = pClonePointerList[i - 1];
                    }
                    else {
                        pClonePointerList[0].getType()._setUpDownPointers(null, pDownPointer);
                    }
                }

                pClonePointerList[pClonePointerList.length - 1].getType()._setUpDownPointers(null, pDownPointer);
            }

            this._setClonePointeIndexes(this.getPointDim(), pClonePointerList);
        }

        if (!isNull(this._pFieldDeclMap)) {
            var sFieldName: string = "";
            var pCloneFieldMap: AIAFXVariableDeclMap = <AIAFXVariableDeclMap>{};

            for (sFieldName in this._pFieldDeclMap) {
                pCloneFieldMap[sFieldName] = this._pFieldDeclMap[sFieldName].clone(pRelationMap);
            }

            this._setCloneFields(pCloneFieldMap);
        }

        return pClone;
    }

    blend(pType: AIAFXVariableTypeInstruction, eMode: AEAFXBlendMode): AIAFXVariableTypeInstruction {
        if (this === pType) {
            return this;
        }

        if (eMode === AEAFXBlendMode.k_Global) {
            return null;
        }

        if (this.isComplex() !== pType.isComplex() ||
            (this.isNotBaseArray() !== pType.isNotBaseArray()) ||
            (this.isPointer() !== pType.isPointer())) {
            return null;
        }

        if (this.isNotBaseArray() || this.getLength() === Instruction.UNDEFINE_LENGTH ||
            this.getLength() !== pType.getLength()) {
            return null;
        }

        var pBlendBaseType: AIAFXTypeInstruction = this.getBaseType().blend(pType.getBaseType(), eMode);
        if (isNull(pBlendBaseType)) {
            return null;
        }

        var pBlendType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
        pBlendType.pushType(pBlendBaseType);

        if (this.isNotBaseArray()) {
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

    _setCloneArrayIndex(pElementType: AIAFXVariableTypeInstruction,
        pIndexExpr: AIAFXExprInstruction, iLength: uint): void {
        this._isArray = true;
        this._pArrayElementType = pElementType;
        this._pArrayIndexExpr = pIndexExpr;
        this._iLength = iLength;
    }

    _setClonePointeIndexes(nDim: uint, pPointerList: AIAFXVariableDeclInstruction[]): void {
        this._isPointer = true;
        this._nPointDim = nDim;
        this._pPointerList = pPointerList;
        if (!isNull(this._pPointerList)) {
            this._pUpPointIndex = this._pPointerList[0];
        }
    }

    _setCloneFields(pFieldMap: AIAFXVariableDeclMap): void {
        this._pFieldDeclMap = pFieldMap;
    }

    _setUpDownPointers(pUpPointIndex: AIAFXVariableDeclInstruction,
        pDownPointIndex: AIAFXVariableDeclInstruction): void {
        this._pUpPointIndex = pUpPointIndex;
        this._pDownPointIndex = pDownPointIndex;
    }

    private calcHash(): void {
        var sHash: string = this.getSubType().getHash();

        if (this._isArray) {
            sHash += "[";

            var iLength: uint = this.getLength();

            if (iLength === Instruction.UNDEFINE_LENGTH) {
                sHash += "undef"
				}
            else {
                sHash += iLength.toString();
            }

            sHash += "]";
        }

        this._sHash = sHash;
    }

    private calcStrongHash(): void {
        var sStrongHash: string = this.getSubType().getStrongHash();

        if (this._isArray) {
            sStrongHash += "[";

            var iLength: uint = this.getLength();

            if (iLength === Instruction.UNDEFINE_LENGTH) {
                sStrongHash += "undef"
				}
            else {
                sStrongHash += iLength.toString();
            }

            sStrongHash += "]";
        }
        if (this.isPointer()) {
            for (var i: uint = 0; i < this.getPointDim(); i++) {
                sStrongHash = "@" + sStrongHash;
            }
        }


        this._sStrongHash = sStrongHash;
    }

    private generateSubDeclList(): void {
        if (!this.canHaveSubDecls()) {
            return;
        }

        var pDeclList: AIAFXVariableDeclInstruction[] = [];
        var i: uint = 0;

        if (!isNull(this._pAttrOffset)) {
            pDeclList.push(this._pAttrOffset);
        }

        if (this.isPointer()) {

            if (isNull(this._getUpPointer())) {
                this.initializePointers();
            }

            for (i = 0; i < this._pPointerList.length; i++) {
                pDeclList.push(this._pPointerList[i]);
            }
        }

        if (this.isComplex()) {
            var pFieldNameList: string[] = this.getFieldNameList();

            for (i = 0; i < pFieldNameList.length; i++) {
                var pField: AIAFXVariableDeclInstruction = this.getField(pFieldNameList[i]);
                var pFieldSubDeclList: AIAFXVariableDeclInstruction[] = pField.getSubVarDecls();

                if (!isNull(pFieldSubDeclList)) {
                    for (var j: uint = 0; j < pFieldSubDeclList.length; j++) {
                        pDeclList.push(pFieldSubDeclList[j]);
                    }
                }
            }
        }

        this._pSubDeclList = pDeclList;
    }

    private canHaveSubDecls(): boolean {
        return this.isComplex() || this.isPointer() || !isNull(this._pAttrOffset);
    }
}


export = VariableTypeInstruction;