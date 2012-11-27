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
        setParent(pParent: IAFXInstruction): void;
        getParent(): IAFXInstruction;

        setOperator(sOperator: string): void;
        getOperator(): string;

        setInstructions(pInstructionList: IAFXInstruction[]): void;
        getInstructions(): IAFXInstruction[];

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

    export interface IAFXVariableTypeInstruction extends IAFXInstruction {
        //type : IAFXTypeInstruction
        //array: IAFXArrayInstruction
        //pointer : IAFXPointerInstruction
        addArrayIndex(pExpr: IAFXExprInstruction): void;
        addPointIndex(): void;
        setVideoBuffer(pBuffer: IAFXIdInstruction): void;

        isEqual(pType: IAFXVariableTypeInstruction): bool;
        isBase(): bool;
    }

    export interface IAFXTypedInstruction extends IAFXInstruction {
        getType(): IAFXVariableTypeInstruction;
        setType(pType: IAFXVariableTypeInstruction): void;
    }

    export interface IAFXDeclInstruction extends IAFXTypedInstruction {
        setSemantic(sSemantic: string);
    }

    export interface IAFXTypeDeclInstruction extends IAFXDeclInstruction {
    
    }

    export interface IAFXVariableDeclInstruction extends IAFXDeclInstruction {

    }

    export interface IAFXUsageTypeInstruction extends IAFXInstruction {
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


    export interface IAFXExprInstruction extends IAFXTypedInstruction {

    }

    export interface IAFXLiteralInstruction extends IAFXExprInstruction {
        setValue(pValue: any): void;
    }

}

#endif