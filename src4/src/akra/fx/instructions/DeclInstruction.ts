/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="TypedInstruction.ts" />

module akra.fx.instructions {
    export class DeclInstruction extends TypedInstruction implements IAFXDeclInstruction {
        protected _sSemantic: string = "";
        protected _pAnnotation: IAFXAnnotationInstruction = null;
        protected _bForPixel: boolean = true;
        protected _bForVertex: boolean = true;
        protected _isBuiltIn: boolean = false;

        constructor() {
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

        getRealName(): string {
            return "";
        }

        getNameId(): IAFXIdInstruction {
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

        _clone(pRelationMap: IAFXInstructionMap = <IAFXInstructionMap>{}): IAFXDeclInstruction {
            var pClonedInstruction: IAFXDeclInstruction = <IAFXDeclInstruction>(super._clone(pRelationMap));
            pClonedInstruction.setSemantic(this._sSemantic);
            pClonedInstruction.setAnnotation(this._pAnnotation);
            return pClonedInstruction;
        }
    }

}