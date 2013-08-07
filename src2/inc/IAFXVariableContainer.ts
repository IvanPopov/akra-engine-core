#ifndef IAFXVARIABLECONTAINER
#define IAFXVARIABLECONTAINER

module akra {
	export enum EAFXShaderVariableType {
        k_NotVar = 0,
        
        k_Texture = 2,
        
        k_Float,
        k_Int,
        k_Bool,

        k_Float2,
        k_Int2,
        k_Bool2,

        k_Float3,
        k_Int3,
        k_Bool3,

        k_Float4,
        k_Int4,
        k_Bool4,

        k_Float2x2,
        k_Float3x3,
        k_Float4x4,

        k_Sampler2D,
        k_SamplerCUBE,
        k_SamplerVertexTexture,

        k_CustomSystem,
        k_Complex
    }

	export interface IAFXShaderVarTypeMap {
		//[index: string]: EAFXShaderVariableType;
		[index: uint]: EAFXShaderVariableType;
	}

	export interface IAFXVariableInfo {
		variable: IAFXVariableDeclInstruction;
		type: EAFXShaderVariableType;
		name: string;
		realName: string;
		isArray: bool;
	}

	export interface IAFXVariableContainer {
		indices: uint[];

		add(pVar: IAFXVariableDeclInstruction): void;
		addSystemEntry(sName: string, eType: EAFXShaderVariableType): void;

		finalize(): void;

		getVarInfoByIndex(iIndex: uint): IAFXVariableInfo;
		getVarByIndex(iIndex: uint): IAFXVariableDeclInstruction;
		getTypeByIndex(iIndex: uint): EAFXShaderVariableType;
		isArrayVariable(iIndex: uint): bool;

		getIndexByName(sName: string): uint;
		getIndexByRealName(sName: string): uint;

		hasVariableWithName(sName: string): bool;
		hasVariableWithRealName(sName: string): bool;

		getVarByName(sName: string): IAFXVariableDeclInstruction;
		getVarByRealName(sName: string): IAFXVariableDeclInstruction;
	}
}

#endif