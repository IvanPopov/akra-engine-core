#ifndef AFXVARIALE_TS
#define AFXVARIALE_TS

#include "IAFXEffect.ts"
#include "fx/Instruction.ts"

module akra.fx {
	export class Variable implements IAFXVariable {
		private _pDeclInstruction: IAFXVariableDeclInstruction;

		getName(): string {
			return "var_name";
		}

		getId(): IAFXIdInstruction{
			return null;
		}

		constructor(){
			this._pDeclInstruction = null;
		}

		setName(sName: string): void {

		}

		setType(pType: IAFXVariableTypeInstruction): void {

		}

		getType(): IAFXVariableTypeInstruction {
			return null;	
		}

		initializeFromInstruction(pInstruction: IAFXVariableDeclInstruction): void{
			this._pDeclInstruction = pInstruction;	
		}
	} 
}

#endif