/// <reference path="../idl/AIAFXInstruction.ts" />

import webgl = require("webgl");

import Effect = require("fx/Effect");
import StringDictionary = require("stringUtils/StringDictionary");
import DeclInstruction = require("fx/DeclInstruction");
import IdInstruction = require("fx/IdInstruction");
import IdExprInstruction = require("fx/IdExprInstruction");
import PostfixPointInstruction = require("fx/PostfixPointInstruction");
import ExtractExprInstruction = require("fx/ExtractExprInstruction");
import VariableTypeInstruction = require("fx/VariableTypeInstruction");

class VariableDeclInstruction extends DeclInstruction implements AIAFXVariableDeclInstruction {
    private _isVideoBuffer: boolean = null;
    private _pVideoBufferSampler: AIAFXVariableDeclInstruction = null;
    private _pVideoBufferHeader: AIAFXVariableDeclInstruction = null;
    private _pFullNameExpr: AIAFXExprInstruction = null;
    private _bDefineByZero: boolean = false;
    private _pSubDeclList: AIAFXVariableDeclInstruction[] = null;
    private _bShaderOutput: boolean = false;

    private _pAttrOffset: AIAFXVariableDeclInstruction = null;
    private _pAttrExtractionBlock: AIAFXInstruction = null;

    private _pValue: any = null;
    private _pDefaultValue: any = null;

    private _bLockInitializer: boolean = false;

    private _iNameIndex: uint = 0;
    static pShaderVarNamesGlobalDictionary: StringDictionary = new StringDictionary();
    static _getIndex(sName: string): uint {
        return VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(sName);
    }
    /**
     * Represent type var_name [= init_expr]
     * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
     */
    constructor() {
        super();
        this._pInstructionList = [null, null, null];
        this._eInstructionType = AEAFXInstructionTypes.k_VariableDeclInstruction;
    }

    hasInitializer(): boolean {
        return this._nInstructions === 3 && !isNull(this.getInitializeExpr());
    }

    getInitializeExpr(): AIAFXInitExprInstruction {
        return <AIAFXInitExprInstruction>this.getInstructions()[2];
    }

    hasConstantInitializer(): boolean {
        return this.hasInitializer() && this.getInitializeExpr().isConst();
    }

    lockInitializer(): void {
        this._bLockInitializer = true;
    }

    unlockInitializer(): void {
        this._bLockInitializer = false;
    }

    getDefaultValue(): any {
        return this._pDefaultValue;
    }

    prepareDefaultValue(): void {
        this.getInitializeExpr().evaluate();
        this._pDefaultValue = this.getInitializeExpr().getEvalValue();
    }

    getValue(): any {
        return this._pValue;
    }

    setValue(pValue: any): any {
        this._pValue = pValue;

        if (this.getType().isForeign()) {
            this.setRealName(pValue);
        }
    }

    getType(): AIAFXVariableTypeInstruction {
        return <AIAFXVariableTypeInstruction>this._pInstructionList[0];
    }

    setType(pType: AIAFXVariableTypeInstruction): void {
        this._pInstructionList[0] = <AIAFXVariableTypeInstruction>pType;
        pType.setParent(this);

        if (this._nInstructions === 0) {
            this._nInstructions = 1;
        }
    }

    setName(sName: string): void {
        var pName: AIAFXIdInstruction = new IdInstruction();
        pName.setName(sName);
        pName.setParent(this);

        this._pInstructionList[1] = <AIAFXIdInstruction>pName;

        if (this._nInstructions < 2) {
            this._nInstructions = 2;
        }
    }

    setRealName(sRealName: string): void {
        this.getNameId().setRealName(sRealName);
    }

    setVideoBufferRealName(sSampler: string, sHeader: string): void {
        if (!this.isVideoBuffer()) {
            return;
        }

        this._getVideoBufferSampler().setRealName(sSampler);
        this._getVideoBufferHeader().setRealName(sHeader);
    }

    getName(): string {
        return (<AIAFXIdInstruction>this._pInstructionList[1]).getName();
    }

    getRealName(): string {
        return (<AIAFXIdInstruction>this._pInstructionList[1]).getRealName();
    }

    getNameId(): AIAFXIdInstruction {
        return <AIAFXIdInstruction>this._pInstructionList[1];
    }

    isUniform(): boolean {
        return this.getType().hasUsage("uniform");
    }

    isField(): boolean {
        if (isNull(this.getParent())) {
            return false;
        }

        var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();
        if (eParentType === AEAFXInstructionTypes.k_VariableTypeInstruction ||
            eParentType === AEAFXInstructionTypes.k_ComplexTypeInstruction ||
            eParentType === AEAFXInstructionTypes.k_SystemTypeInstruction) {
            return true;
        }

        return false;
    }

    isPointer(): boolean {
        return this.getType().isPointer();
    }

    isVideoBuffer(): boolean {
        if (isNull(this._isVideoBuffer)) {
            this._isVideoBuffer = this.getType().isStrongEqual(Effect.getSystemType("video_buffer"));
        }

        return this._isVideoBuffer;
    }

    isSampler(): boolean {
        return this.getType().isSampler();
    }

    getSubVarDecls(): AIAFXVariableDeclInstruction[] {
        return this.getType().getSubVarDecls();
    }

    isDefinedByZero(): boolean {
        return this._bDefineByZero;
    }

    defineByZero(isDefine: boolean): void {
        this._bDefineByZero = isDefine;
    }

    toFinalCode(): string {
        if (this._isShaderOutput()) {
            return "";
        }
        var sCode: string = "";

        if (this.isVideoBuffer()) {
            this._getVideoBufferHeader().lockInitializer();

            sCode = this._getVideoBufferHeader().toFinalCode();
            sCode += ";\n";
            sCode += this._getVideoBufferSampler().toFinalCode();

            this._getVideoBufferHeader().unlockInitializer();
        }
        else {
            sCode = this.getType().toFinalCode();
            sCode += " " + this.getNameId().toFinalCode();

            if (this.getType().isNotBaseArray()) {
                var iLength: uint = this.getType().getLength();
                if (webgl.isANGLE && iLength === 1 && this.getType().isComplex()) {
                    sCode += "[" + 2 + "]";
                }
                else {
                    sCode += "[" + iLength + "]";
                }
            }

            if (this.hasInitializer() &&
                !this.isSampler() &&
                !this.isUniform() &&
                !this._bLockInitializer) {
                sCode += "=" + this.getInitializeExpr().toFinalCode();
            }
        }

        return sCode;
    }

    _markAsVarying(bValue: boolean): void {
        this.getNameId()._markAsVarying(bValue);
    }

    _markAsShaderOutput(isShaderOutput: boolean): void {
        this._bShaderOutput = isShaderOutput;
    }

    _isShaderOutput(): boolean {
        return this._bShaderOutput;
    }

    _setAttrExtractionBlock(pCodeBlock: AIAFXInstruction): void {
        this._pAttrExtractionBlock = pCodeBlock;
    }

    _getAttrExtractionBlock(): AIAFXInstruction {
        return this._pAttrExtractionBlock;
    }

    _getNameIndex(): uint {
        return this._iNameIndex || (this._iNameIndex = VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(this.getRealName()));
    }

    _getFullNameExpr(): AIAFXExprInstruction {
        if (!isNull(this._pFullNameExpr)) {
            return this._pFullNameExpr;
        }

        if (!this.isField() ||
            !(<AIAFXVariableTypeInstruction>this.getParent())._getParentVarDecl().isVisible()) {
            this._pFullNameExpr = new IdExprInstruction();
            this._pFullNameExpr.push(this.getNameId(), false);
        }
        else {
            var pMainVar: AIAFXVariableDeclInstruction = <AIAFXVariableDeclInstruction>this.getType()._getParentContainer();

            if (isNull(pMainVar)) {
                return null;
            }

            var pMainExpr: AIAFXExprInstruction = pMainVar._getFullNameExpr();
            if (isNull(pMainExpr)) {
                return null;
            }
            var pFieldExpr: AIAFXExprInstruction = new IdExprInstruction();
            pFieldExpr.push(this.getNameId(), false);

            this._pFullNameExpr = new PostfixPointInstruction();
            this._pFullNameExpr.push(pMainExpr, false);
            this._pFullNameExpr.push(pFieldExpr, false);
            this._pFullNameExpr.setType(this.getType());
        }

        return this._pFullNameExpr;
    }

    _getFullName(): string {
        if (this.isField() &&
            (<AIAFXVariableTypeInstruction>this.getParent())._getParentVarDecl().isVisible()) {

            var sName: string = "";
            var eParentType: AEAFXInstructionTypes = this.getParent()._getInstructionType();

            if (eParentType === AEAFXInstructionTypes.k_VariableTypeInstruction) {
                sName = (<AIAFXVariableTypeInstruction>this.getParent())._getFullName();
            }

            sName += "." + this.getName();

            return sName;
        }
        else {
            return this.getName();
        }
    }

    _getVideoBufferSampler(): AIAFXVariableDeclInstruction {
        if (!this.isVideoBuffer()) {
            return null;
        }

        if (isNull(this._pVideoBufferSampler)) {
            this._pVideoBufferSampler = new VariableDeclInstruction();
            var pType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
            var pId: AIAFXIdInstruction = new IdInstruction();

            pType.pushType(Effect.getSystemType("sampler2D"));
            pType.addUsage("uniform");
            pId.setName(this.getName() + "_sampler");

            this._pVideoBufferSampler.push(pType, true);
            this._pVideoBufferSampler.push(pId, true);
        }

        return this._pVideoBufferSampler;
    }

    _getVideoBufferHeader(): AIAFXVariableDeclInstruction {
        if (!this.isVideoBuffer()) {
            return null;
        }

        if (isNull(this._pVideoBufferHeader)) {
            this._pVideoBufferHeader = new VariableDeclInstruction();
            var pType: AIAFXVariableTypeInstruction = new VariableTypeInstruction();
            var pId: AIAFXIdInstruction = new IdInstruction();
            var pExtarctExpr: ExtractExprInstruction = new ExtractExprInstruction();

            pType.pushType(Effect.getSystemType("video_buffer_header"));
            pId.setName(this.getName() + "_header");

            this._pVideoBufferHeader.push(pType, true);
            this._pVideoBufferHeader.push(pId, true);
            this._pVideoBufferHeader.push(pExtarctExpr, true);

            pExtarctExpr.initExtractExpr(pType, null, this, "", null);
        }

        return this._pVideoBufferHeader;
    }

    _getVideoBufferInitExpr(): AIAFXInitExprInstruction {
        if (!this.isVideoBuffer()) {
            return null;
        }

        return this._getVideoBufferHeader().getInitializeExpr();
    }

    _setCollapsed(bValue: boolean): void {
        this.getType()._setCollapsed(bValue);
    }

    _isCollapsed(): boolean {
        return this.getType()._isCollapsed();
    }

    clone(pRelationMap?: AIAFXInstructionMap): AIAFXVariableDeclInstruction {
        return <AIAFXVariableDeclInstruction>super.clone(pRelationMap);
    }

    blend(pVariableDecl: AIAFXVariableDeclInstruction, eMode: AEAFXBlendMode): AIAFXVariableDeclInstruction {
        var pBlendType: AIAFXVariableTypeInstruction = this.getType().blend(pVariableDecl.getType(), eMode);

        if (isNull(pBlendType)) {
            return null;
        }

        var pBlendVar: AIAFXVariableDeclInstruction = new VariableDeclInstruction();
        var pId: AIAFXIdInstruction = new IdInstruction();

        pId.setName(this.getNameId().getName());
        pId.setRealName(this.getNameId().getRealName());

        pBlendVar.setSemantic(this.getSemantic());
        pBlendVar.push(pBlendType, true);
        pBlendVar.push(pId, true);

        return pBlendVar;
    }

}


export = VariableDeclInstruction;