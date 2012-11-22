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

    	// /**
    	//  * Contain states of instruction
    	//  */
    	// stateMap: IAFXInstructionStateMap;

    	push(pInstruction: IAFXInstruction, isSetParent?: bool): void;

    	// changeState(sStateName: string, sValue: string): void;
    	// changeState(iStateIndex: int, sValue: string): void;

    	// stateChange(): void;
    	// isStateChange(): bool;

    	addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: uint);
    	toString(): string;
    }

    export interface IAFXTypeDeclInstruction extends IAFXInstruction {
        //variableType : IAFXVariableTypeInstruction;
    }

    export interface IAFXVariableTypeInstruction extends IAFXInstruction {
        //type : IAFXTypeInstruction
        //array: IAFXArrayInstruction
        //pointer : IAFXPointerInstruction
        addArrayIndex(): void;
        addPointIndex(): void;
        setVideoBuffer(): void;
    }

    export interface IAFXTypeInstruction extends IAFXInstruction {
        //usage: IAFXKeywordInstruction[]
        //id: IAFXIdInstruction
    }

    export interface IAFXStructDeclInstruction extends IAFXInstruction {
        //id: IAFXIdInstruction
        //structFields: IAFXStructInstruction
    }

    export interface IAFXBaseTypeInstruction extends IAFXInstruction {
        //id: IAFXIdInstruction
        //...
    }

    export interface IAFXIdInstruction extends IAFXInstruction {
        getName(): string;
        getRealName(): string;

        setName(sName: string): void;
        setRealName(sName: string): void;
    }

    export interface IAFXKeywordInstruction extends IAFXInstruction {
        setValue(sValue: string): void;
    }



    export interface IAFXVariableDeclInstruction extends IAFXInstruction {
        getVariableType(): IAFXVariableTypeInstruction;
    }
}

#endif