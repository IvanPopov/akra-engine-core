#ifndef AFXTYPE_TS
#define AFXTYPE_TS

#include "IAFXEffect.ts"
#include "fx/Instruction.ts"

module akra.fx {
	export class Type implements IAFXType {
		/**
		 * If type is base or define by typedef this filed is null
		 */
		private _pDeclInstruction: IAFXTypeDeclInstruction;
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

		initializeFromInstruction(pInstruction: IAFXTypeDeclInstruction): bool{
			this._pDeclInstruction = pInstruction;
			return true;
		}

		isBase(): bool {
			return this._isBase;
		}
	} 
}

#endif