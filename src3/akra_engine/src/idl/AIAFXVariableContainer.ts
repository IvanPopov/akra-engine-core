enum AEAFXShaderVariableType {
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

interface AIAFXShaderVarTypeMap {
	//[index: string]: AEAFXShaderVariableType;
	[index: uint]: AEAFXShaderVariableType;
}

interface AIAFXVariableInfo {
	variable: AIAFXVariableDeclInstruction;
	type: AEAFXShaderVariableType;
	name: string;
	realName: string;
	isArray: boolean;
}

interface AIAFXVariableContainer {
	indices: uint[];

	add(pVar: AIAFXVariableDeclInstruction): void;
	addSystemEntry(sName: string, eType: AEAFXShaderVariableType): void;

	finalize(): void;

	getVarInfoByIndex(iIndex: uint): AIAFXVariableInfo;
	getVarByIndex(iIndex: uint): AIAFXVariableDeclInstruction;
	getTypeByIndex(iIndex: uint): AEAFXShaderVariableType;
	isArrayVariable(iIndex: uint): boolean;

	getIndexByName(sName: string): uint;
	getIndexByRealName(sName: string): uint;

	hasVariableWithName(sName: string): boolean;
	hasVariableWithRealName(sName: string): boolean;

	getVarByName(sName: string): AIAFXVariableDeclInstruction;
	getVarByRealName(sName: string): AIAFXVariableDeclInstruction;
}

