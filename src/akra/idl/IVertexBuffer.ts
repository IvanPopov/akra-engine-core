
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderResource.ts" />


/// <reference path="IVertexData.ts" />
/// <reference path="IVertexElement.ts" />
/// <reference path="IVertexDeclaration.ts" />

module akra {
	export enum EVertexBufferTypes {
		UNKNOWN,
		VBO,
		TBO
	};
	
	export interface IVertexBuffer extends IHardwareBuffer, IRenderResource {
		getType(): EVertexBufferTypes; 
	
		getVertexData(i: uint): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		
		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pSize: uint, ppVertexDataIn?: IVertexData): IVertexData;
		
		freeVertexData(pVertexData: IVertexData): boolean;
		freeVertexData(): boolean;
	
		create(iByteSize: uint, iFlags?: int, pData?: Uint8Array): boolean;
	
		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
	}
}
