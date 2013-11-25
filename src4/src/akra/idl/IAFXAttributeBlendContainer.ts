/// <reference path="IAFXInstruction.ts" />

module akra {
	interface IAFXAttributeBlendContainer {
	    /*readonly*/ attrsInfo: IAFXVariableBlendInfo[];
	
	    getTexcoordVar(iSlot: uint): IAFXVariableDeclInstruction;
	    hasTexcoord(iSlot: uint): boolean;
	    getSlotBySemanticIndex(iIndex: uint): uint;
	    getBufferSlotBySemanticIndex(iIndex: uint): uint;
	    getOffsetVarsBySemantic(sName: string): IAFXVariableDeclInstruction[];
	    getOffsetDefault(sName: string): uint;
	    getTypeBySemanticIndex(iIndex: uint): IAFXVariableTypeInstruction;
	}
}
