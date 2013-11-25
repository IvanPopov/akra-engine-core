/// <reference path="../idl/AIAFXInstruction.ts" />

import TypedInstruction = require("fx/TypedInstruction");


class DeclInstruction extends TypedInstruction implements AIAFXDeclInstruction {
    protected _sSemantic: string = "";
    protected _pAnnotation: AIAFXAnnotationInstruction = null;
    protected _bForPixel: boolean = true;
    protected _bForVertex: boolean = true;
    protected _isBuiltIn: boolean = false;

    constructor() {
        super();
        this._eInstructionType = AEAFXInstructionTypes.k_DeclInstruction;
    }

    setSemantic(sSemantic: string): void {
        this._sSemantic = sSemantic;
    }

    setAnnotation(pAnnotation: AIAFXAnnotationInstruction): void {
        this._pAnnotation = pAnnotation;
    }

    getName(): string {
        return "";
    }

    getRealName(): string {
        return "";
    }

    getNameId(): AIAFXIdInstruction {
        return null;
    }

    getSemantic(): string {
        return this._sSemantic;
    }

    isBuiltIn(): boolean {
        return this._isBuiltIn;
    }

    setBuiltIn(isBuiltIn: boolean): void {
        this._isBuiltIn = isBuiltIn;
    }

    _isForAll(): boolean {
        return this._bForVertex && this._bForPixel;
    }
    _isForPixel(): boolean {
        return this._bForPixel;
    }
    _isForVertex(): boolean {
        return this._bForVertex;
    }

    _setForAll(canUse: boolean): void {
        this._bForVertex = canUse;
        this._bForPixel = canUse;
    }
    _setForPixel(canUse: boolean): void {
        this._bForPixel = canUse;
    }
    _setForVertex(canUse: boolean): void {
        this._bForVertex = canUse;
    }

    clone(pRelationMap: AIAFXInstructionMap = <AIAFXInstructionMap>{}): AIAFXDeclInstruction {
        var pClonedInstruction: AIAFXDeclInstruction = <AIAFXDeclInstruction>(super.clone(pRelationMap));
        pClonedInstruction.setSemantic(this._sSemantic);
        pClonedInstruction.setAnnotation(this._pAnnotation);
        return pClonedInstruction;
    }
}

export = DeclInstruction;