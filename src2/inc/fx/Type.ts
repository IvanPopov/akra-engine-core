#ifndef AFXTYPE_TS
#define AFXTYPE_TS

#include "IAFXEffect.ts"
#include "fx/Instruction.ts"

module akra.fx {
	export class Type implements IAFXType {
		/**
		 * If type is base or define by typedef this filed is null
		 */
		private _pDeclInstruction: IAFXStructDeclInstruction;
		private _pNameId: IAFXIdInstruction;
		private _isBase: bool;
		private _sHash: string;

		getName(): string {
			return this._pNameId.getName();
		}

		getId(): IAFXIdInstruction {
			return this._pNameId;
		}

		constructor(){
			this._pDeclInstruction = null;
			this._pNameId = null;
			this._isBase = false;
			this._sHash = "";
		}

		initializeFromStruct(pStruct: IAFXStructDeclInstruction): bool{
			this._pDeclInstruction = pStruct;
			return true;
		}

		isBase(): bool {
			return this._isBase;
		}
	} 

	export class ComplexType implements IAFXComplexType {
		private _pInstruction: TypeInstruction;
		// private _pType: IAFXType;
		// private _pUsages: IAFXKeywordInstruction[];

		getName(): string {
			return this._pType.getName();
		}

		getId(): IAFXIdInstruction {
			return this._pType.getId();
		}

		constructor(){
			this._pType = null;
			this._pUsages = null;
		}

		getUsages(): IAFXKeywordInstruction[]{
			return this._pUsages;
		}

		getType(): IAFXType{
			return this._pType;
		}

		setType(pType: IAFXType): void {

		}

		setUsage(pUsage: IAFXKeywordInstruction) : void {

		}

	}
}

#endif