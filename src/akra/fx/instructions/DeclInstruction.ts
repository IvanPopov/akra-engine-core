/// <reference path="../../idl/IAFXInstruction.ts" />
/// <reference path="TypedInstruction.ts" />

module akra.fx.instructions {
	export class DeclInstruction extends TypedInstruction implements IAFXDeclInstruction {
		protected _sSemantic: string = "";
		protected _pAnnotation: IAFXAnnotationInstruction = null;
		protected _bForPixel: boolean = true;
		protected _bForVertex: boolean = true;
		protected _bIsBuiltIn: boolean = false;

		constructor() {
			super();
			this._eInstructionType = EAFXInstructionTypes.k_DeclInstruction;
		}

		_setSemantic(sSemantic: string): void {
			this._sSemantic = sSemantic;
		}

		_setAnnotation(pAnnotation: IAFXAnnotationInstruction): void {
			this._pAnnotation = pAnnotation;
		}

		_getName(): string {
			return "";
		}

		_getRealName(): string {
			return "";
		}

		_getNameId(): IAFXIdInstruction {
			return null;
		}

		_getSemantic(): string {
			return this._sSemantic;
		}

		_isBuiltIn(): boolean {
			return this._bIsBuiltIn;
		}

		_setBuiltIn(isBuiltIn: boolean): void {
			this._bIsBuiltIn = isBuiltIn;
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
			pClonedInstruction._setSemantic(this._sSemantic);
			pClonedInstruction._setAnnotation(this._pAnnotation);
			return pClonedInstruction;
		}
	}

}