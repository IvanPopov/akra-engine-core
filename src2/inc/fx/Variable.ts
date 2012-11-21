#ifndef AFXVARIALE_TS
#define AFXVARIALE_TS

#include "IAFXEffect.ts"
#include "fx/Instruction.ts"

module akra.fx {
	export class Variable implements IAFXVariable {
		private _pDeclInstruction: VarDeclInstruction;

		getName(): string {
			return "var_name";
		}

		getId(): IAFXIdInstruction{
			return null;
		}

		constructor(){
			this._pDeclInstruction = new VarDeclInstruction();
		}

		setName(sName: string): void {

		}

		setType(pType: IAFXComplexType): void {

		}

		initializeFromInstruction(pInstruction: IAFXVariableDeclInstruction): void{
			
		}
	} 
}

#endif