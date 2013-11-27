/// <reference path="AIAFXInstruction.ts" />

interface AIAFXAttributeBlendContainer {
    /*readonly*/ attrsInfo: AIAFXVariableBlendInfo[];

    getTexcoordVar(iSlot: uint): AIAFXVariableDeclInstruction;
    hasTexcoord(iSlot: uint): boolean;
    getSlotBySemanticIndex(iIndex: uint): uint;
    getBufferSlotBySemanticIndex(iIndex: uint): uint;
    getOffsetVarsBySemantic(sName: string): AIAFXVariableDeclInstruction[];
    getOffsetDefault(sName: string): uint;
    getTypeBySemanticIndex(iIndex: uint): AIAFXVariableTypeInstruction;
}