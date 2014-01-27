
/// <reference path="IRenderData.ts" />
/// <reference path="IBuffer.ts" />


/// <reference path="IVertexBuffer.ts" />
/// <reference path="IVertexDeclaration.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IBuffer.ts" />
/// <reference path="IReferenceCounter.ts" />

module akra {
	export enum ERenderDataBufferOptions {
		VB_READABLE	   = <int>EHardwareBufferFlags.READABLE,
		RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX,
		RD_SINGLE_INDEX   = <int>ERenderDataOptions.SINGLE_INDEX,
		RD_RENDERABLE	 = <int>ERenderDataOptions.RENDERABLE
	};
	
	// export interface IRenderDataType {
	//	 new (): IRenderData;
	// }
	
	export interface IRenderDataCollection extends /*IHardwareBuffer*/IBuffer, IReferenceCounter {
		getBuffer(): IVertexBuffer;
		getByteLength(): uint;
		getLength(): uint;
	
		getEngine(): IEngine;
		getOptions(): int;
	
		getData(sUsage: string): IVertexData;
		getData(iOffset: uint): IVertexData;
		getRenderData(iSubset: uint): IRenderData;
		getEmptyRenderData(ePrimType: EPrimitiveTypes, eOptions?: ERenderDataBufferOptions): IRenderData;
		getDataLocation(sSemantics: string): int;
		
		allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, isCommon?: boolean): int;
		allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, isCommon?: boolean): int;
		allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView, isCommon?: boolean): int;
		allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer, isCommon?: boolean): int;
		
		destroy(): void;
		
		_draw(): void;
		_draw(iSubset: uint): void;
	
		// _setup(eOptions?: int): void;
		
		_allocateData(pVertexDecl: IVertexDeclaration, iSize: uint): IVertexData;
		_allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
		_allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBuffer): IVertexData;
		_allocateData(pDeclData: IVertexElementInterface[], iSize: uint): IVertexData;
		_allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView): IVertexData;
		_allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer): IVertexData;
	}
	
}
