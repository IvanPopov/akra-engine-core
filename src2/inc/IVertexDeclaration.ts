#ifndef IVERTEXDECLARATION_TS
#define IVERTEXDECLARATION_TS


module akra {

	IFACE(IVertexElement);

	export var DeclarationUsages = {
		POSITION 	: "POSITION",
	    POSITION1	: "POSITION1",
	    POSITION2	: "POSITION2",
	    POSITION3	: "POSITION3",

	    BLENDWEIGHT	: "BLENDWEIGHT",
	    BLENDINDICES: "BLENDINDICES",
	    BLENDMETA	: "BLENDMETA",
	    
	    NORMAL 		: "NORMAL",
	    NORMAL1		: "NORMAL1",
	    NORMAL2		: "NORMAL2",
	    NORMAL3		: "NORMAL3",
	    
	    PSIZE		: "PSIZE",
	    
	    TEXCOORD 	: "TEXCOORD",
	    TEXCOORD1	: "TEXCOORD1",
	    TEXCOORD2	: "TEXCOORD2",
	    TEXCOORD3	: "TEXCOORD3",
	    TEXCOORD4	: "TEXCOORD4",
	    TEXCOORD5	: "TEXCOORD5",
	    
	    TANGENT		: "TANGENT",
	    BINORMAL 	: "BINORMAL",
	    
	    TESSFACTOR	: "TESSFACTOR",
	    COLOR 		: "COLOR",
	    FOG 		: "FOG",
	    DEPTH 		: "DEPTH",
	    SAMPLE 		: "SAMPLE",
	    
	    INDEX 		: "INDEX",
		INDEX0 		: "INDEX0",
	    INDEX1 		: "INDEX1",
	    INDEX2 		: "INDEX2",
	    INDEX3 		: "INDEX3",
	    INDEX10 	: "INDEX10", //system indices starts from 10
	    INDEX11 	: "INDEX11",
	    INDEX12 	: "INDEX12",
	    INDEX13 	: "INDEX13",
	    
	    MATERIAL 	: "MATERIAL",
	    MATERIAL1 	: "MATERIAL1",
	    MATERIAL2 	: "MATERIAL2",
	    
	    DIFFUSE		: "DIFFUSE",
	    AMBIENT 	: "AMBIENT",
	    SPECULAR 	: "SPECULAR",
	    EMISSIVE 	: "EMISSIVE",
	    SHININESS 	: "SHININESS",
	    UNKNOWN 	: "UNKNOWN",
	    END 		: "\a\n\r"
	};

	export var DeclUsages = DeclarationUsages;

	export interface IVertexDeclaration {
		stride: uint;
		length: uint;

		
		//[index: number]: IVertexElement;

		append(...pElement: IVertexElement[]): bool;
		append(pElements: IVertexElement[]): bool;

		extend(pDecl: IVertexDeclaration): bool;

		hasSemantics(sSemantics: string): bool;
		findElement(sSemantics: string, iCount?: uint): IVertexElement;
		clone(): IVertexDeclaration;



		///DEBUG!!!
		toString(): string;
	}

	

	export function VE_CUSTOM(sUsage: string, eType: EDataTypes = EDataTypes.FLOAT, iCount: uint = 1, iOffset?: uint) {
		return {count: iCount, type: eType, usage: sUsage, offset: iOffset};
	}

	export function VE_FLOAT(sName: string, iOffset?: uint) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 1, iOffset); };
	export function VE_FLOAT2(sName: string, iOffset: uint = 2) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 2, iOffset); };
	export function VE_FLOAT3(sName: string, iOffset: uint = 3) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 3, iOffset); };
	export function VE_FLOAT4(sName: string, iOffset: uint = 4) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 4, iOffset); };
	export function VE_FLOAT4x4(sName: string, iOffset: uint = 16) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 16, iOffset); };
	export function VE_VEC2(sName: string, iOffset: uint = 2) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 2, iOffset); };
	export function VE_VEC3(sName: string, iOffset: uint = 3) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 3, iOffset); };
	export function VE_VEC4(sName: string, iOffset: uint = 4) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 4, iOffset); };
	export function VE_MAT4(sName: string, iOffset: uint = 16) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 16, iOffset); };
	export function VE_INT(sName: string, iOffset: uint) { return VE_CUSTOM(sName, EDataTypes.INT, 1, iOffset);};

	export function VE_END(iOffset: uint = 0) { return VE_CUSTOM(DeclUsages.END, EDataTypes.UNSIGNED_BYTE, 0, iOffset); };

	export var createVertexDeclaration: (pData?) => IVertexDeclaration;
}

#endif
