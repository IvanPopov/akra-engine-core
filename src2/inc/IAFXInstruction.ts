#ifndef IAFXINSTRUCTION_TS
#define IAFXINSTRUCTION_TS

#include "common.ts"

module akra {

	export interface IAFXInstructionStateMap extends StringMap{
	}

	export interface IAFXInstructionRoutine {
		(): void;
	}
	/**
	 * All opertion are represented by: 
	 * operator : arg1 ... argn
	 * Operator and instructions may be empty.
	 */
	export interface IAFXInstruction {
        parent: IAFXInstruction;

    	operator: string;
    	instructions: IAFXInstruction[];

    	/**
    	 * Contain states of instruction
    	 */
    	stateMap: IAFXInstructionStateMap;

    	push(pInstruction: IAFXInstruction): void;

    	changeState(sStateName: string, sValue: string): void;
    	changeState(iStateIndex: int, sValue: string): void;

    	stateChange(): void;
    	isStateChange(): bool;

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint);
    	toString(): string;
    }
}

#endif