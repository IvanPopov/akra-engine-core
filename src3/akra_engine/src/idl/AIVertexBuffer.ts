// AIVertexBuffer interface
// [write description here...]

/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIRenderResource.ts" />


/// <reference path="AIVertexData.ts" />
/// <reference path="AIVertexElement.ts" />
/// <reference path="AIVertexDeclaration.ts" />

enum AEVertexBufferTypes {
	UNKNOWN,
	VBO,
	TBO
};

interface AIVertexBuffer extends AIHardwareBuffer, AIRenderResource {

	/** readonly */ type: AEVertexBufferTypes; 

	getVertexData(i: uint): AIVertexData;
	getVertexData(iOffset: uint, iCount: uint, pElements: AIVertexElement[]): AIVertexData;
	getVertexData(iOffset: uint, iCount: uint, pDecl: AIVertexDeclaration): AIVertexData;
	
	getEmptyVertexData(iCount: uint, pElements: AIVertexElement[], ppVertexDataIn?: AIVertexData): AIVertexData;
	getEmptyVertexData(iCount: uint, pDecl: AIVertexDeclaration, ppVertexDataIn?: AIVertexData): AIVertexData;
	getEmptyVertexData(iCount: uint, pSize: uint, ppVertexDataIn?: AIVertexData): AIVertexData;
	
	freeVertexData(pVertexData: AIVertexData): boolean;
	freeVertexData(): boolean;

	create(iByteSize: uint, iFlags?: int, pData?: Uint8Array): boolean;

	allocateData(pElements: AIVertexElement[], pData: ArrayBufferView): AIVertexData;
	allocateData(pDecl: AIVertexDeclaration, pData: ArrayBufferView): AIVertexData;
}