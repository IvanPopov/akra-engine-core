// AIRenderDataCollection interface
// [write description here...]

/// <reference path="AIRenderData.ts" />
/// <reference path="AIBuffer.ts" />


/// <reference path="AIVertexBuffer.ts" />
/// <reference path="AIVertexDeclaration.ts" />
/// <reference path="AIRenderData.ts" />
/// <reference path="AIBuffer.ts" />
/// <reference path="AIReferenceCounter.ts" />

enum AERenderDataBufferOptions {
	VB_READABLE	   = <int>AEHardwareBufferFlags.READABLE,
	RD_ADVANCED_INDEX = <int>AERenderDataOptions.ADVANCED_INDEX,
	RD_SINGLE_INDEX   = <int>AERenderDataOptions.SINGLE_INDEX,
	RD_RENDERABLE	 = <int>AERenderDataOptions.RENDERABLE
};

// interface AIRenderDataType {
//	 new (): AIRenderData;
// }

interface AIRenderDataCollection extends /*AIHardwareBuffer*/AIBuffer, AIReferenceCounter {
	/** readonly */ buffer: AIVertexBuffer;
	/** readonly */ byteLength: uint;
	/** readonly */ length: uint;

	getEngine(): AIEngine;
	getOptions(): int;

	getData(sUsage: string): AIVertexData;
	getData(iOffset: uint): AIVertexData;
	getRenderData(iSubset: uint): AIRenderData;
	getEmptyRenderData(ePrimType: AEPrimitiveTypes, eOptions?: AERenderDataBufferOptions): AIRenderData;
	getDataLocation(sSemantics: string): int;
	
	allocateData(pDataDecl: AIVertexDeclaration, pData: ArrayBufferView, isCommon?: boolean): int;
	allocateData(pDataDecl: AIVertexDeclaration, pData: ArrayBuffer, isCommon?: boolean): int;
	allocateData(pDeclData: AIVertexElementInterface[], pData: ArrayBufferView, isCommon?: boolean): int;
	allocateData(pDeclData: AIVertexElementInterface[], pData: ArrayBuffer, isCommon?: boolean): int;
	
	destroy(): void;
	
	_draw(): void;
	_draw(iSubset: uint): void;

	// _setup(eOptions?: int): void;
	
	_allocateData(pVertexDecl: AIVertexDeclaration, iSize: uint): AIVertexData;
	_allocateData(pVertexDecl: AIVertexDeclaration, pData: ArrayBufferView): AIVertexData;
	_allocateData(pVertexDecl: AIVertexDeclaration, pData: ArrayBuffer): AIVertexData;
	_allocateData(pDeclData: AIVertexElementInterface[], iSize: uint): AIVertexData;
	_allocateData(pDeclData: AIVertexElementInterface[], pData: ArrayBufferView): AIVertexData;
	_allocateData(pDeclData: AIVertexElementInterface[], pData: ArrayBuffer): AIVertexData;
}
