// AIVertexDeclaration interface
// [write description here...]

//#define UNKNOWN_OFFSET MAX_INT32


/// <reference path="AIVertexElement.ts" />

// const DeclarationUsages = {
// 	POSITION 	: "POSITION",
// 	POSITION1	: "POSITION1",
// 	POSITION2	: "POSITION2",
// 	POSITION3	: "POSITION3",

// 	BLENDWEIGHT	: "BLENDWEIGHT",
// 	BLENDINDICES: "BLENDINDICES",
// 	BLENDMETA	: "BLENDMETA",
	
// 	NORMAL 		: "NORMAL",
// 	NORMAL1		: "NORMAL1",
// 	NORMAL2		: "NORMAL2",
// 	NORMAL3		: "NORMAL3",
	
// 	PSIZE		: "PSIZE",
	
// 	TEXCOORD 	: "TEXCOORD",
// 	TEXCOORD1	: "TEXCOORD1",
// 	TEXCOORD2	: "TEXCOORD2",
// 	TEXCOORD3	: "TEXCOORD3",
// 	TEXCOORD4	: "TEXCOORD4",
// 	TEXCOORD5	: "TEXCOORD5",
	
// 	TANGENT		: "TANGENT",
// 	BINORMAL 	: "BINORMAL",
	
// 	TESSFACTOR	: "TESSFACTOR",
// 	COLOR 		: "COLOR",
// 	FOG 		: "FOG",
// 	DEPTH 		: "DEPTH",
// 	SAMPLE 		: "SAMPLE",
	
// 	INDEX 		: "INDEX",
// 	INDEX0 		: "INDEX0",
// 	INDEX1 		: "INDEX1",
// 	INDEX2 		: "INDEX2",
// 	INDEX3 		: "INDEX3",
// 	//system indices starts from 10
// 	INDEX10 	: "INDEX10", 
// 	INDEX11 	: "INDEX11",
// 	INDEX12 	: "INDEX12",
// 	INDEX13 	: "INDEX13",
	
// 	MATERIAL 	: "MATERIAL",
// 	MATERIAL1 	: "MATERIAL1",
// 	MATERIAL2 	: "MATERIAL2",
	
// 	DIFFUSE		: "DIFFUSE",
// 	AMBIENT 	: "AMBIENT",
// 	SPECULAR 	: "SPECULAR",
// 	EMISSIVE 	: "EMISSIVE",
// 	SHININESS 	: "SHININESS",

// 	//special semantic for video buffer
// 	TEXTURE_HEADER : "TEXTURE_HEADER",

// 	UNKNOWN 	: "UNKNOWN",
// 	END 		: "\a\n\r"
// };

// const DeclUsages = DeclarationUsages;

interface AIVertexDeclaration {
	stride: uint;
	/** readonly */ length: uint;

	
	//[index: number]: AIVertexElement;

	append(...pElement: AIVertexElementInterface[]): boolean;
	append(pElements: AIVertexElementInterface[]): boolean;

	extend(pDecl: AIVertexDeclaration): boolean;

	hasSemantics(sSemantics: string): boolean;
	findElement(sSemantics: string, iCount?: uint): AIVertexElement;
	clone(): AIVertexDeclaration;

	element(i: uint): AIVertexElement;

	_update(): boolean;

	///DEBUG!!!
	toString(): string;
}



// /** inline */ function VE_CUSTOM(sUsage: string, eType: EDataTypes = EDataTypes.FLOAT, iCount: uint = 1, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface {
// 	return {count: iCount, type: eType, usage: sUsage, offset: iOffset};
// }

// /** inline */ function VE_FLOAT(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 1, iOffset); };
// /** inline */ function VE_FLOAT2(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 2, iOffset); };
// /** inline */ function VE_FLOAT3(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 3, iOffset); };
// /** inline */ function VE_FLOAT4(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 4, iOffset); };
// /** inline */ function VE_FLOAT4x4(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 16, iOffset); };
// /** inline */ function VE_VEC2(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 2, iOffset); };
// /** inline */ function VE_VEC3(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 3, iOffset); };
// /** inline */ function VE_VEC4(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 4, iOffset); };
// /** inline */ function VE_MAT4(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.FLOAT, 16, iOffset); };
// /** inline */ function VE_INT(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): AIVertexElementInterface { return VE_CUSTOM(sUsage, EDataTypes.INT, 1, iOffset);};

// /** inline */ function VE_END(iOffset: uint = 0): AIVertexElementInterface { return VE_CUSTOM(DeclUsages.END, EDataTypes.UNSIGNED_BYTE, 0, iOffset); };

// //var createVertexDeclaration: (pData?) => AIVertexDeclaration;
