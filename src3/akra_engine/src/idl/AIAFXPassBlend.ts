// AIAFXPassBlend interface
// [write description here...]

/// <reference path="AIUnique.ts" />
/// <reference path="AIAFXInstruction.ts" />
/// <reference path="AIAFXMaker.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIBufferMap.ts" />


interface AIAFXPassBlendMap {
	[index: uint]: AIAFXPassBlend;
	[index: string]: AIAFXPassBlend;
}

interface AIAFXPassBlend extends AIUnique {
	initFromPassList(pPassList: AIAFXPassInstruction[]): boolean;
	generateFXMaker(pPassInput: AIAFXPassInputBlend,
					pSurfaceMaterial: AISurfaceMaterial,
					pBuffer: AIBufferMap): AIAFXMaker;
	
	_hasUniformWithName(sName: string): boolean;
	_hasUniformWithNameIndex(iNameIndex: uint): boolean;
	_getRenderStates(): AIMap<AERenderStateValues>;
}

