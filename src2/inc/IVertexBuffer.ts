#ifndef IVERTEXBUFFER_TS
#define IVERTEXBUFFER_TS

#include "IHardwareBuffer.ts"
#include "IRenderResource.ts"

module akra {

	IFACE(IVertexData);
	IFACE(IVertexElement);
	IFACE(IVertexDeclaration);

	export enum EVertexBufferTypes {
		UNKNOWN,
		VBO,
		TBO
	};

	export interface IVertexBuffer extends IHardwareBuffer, IRenderResource {

		readonly type: EVertexBufferTypes; 

		getVertexData(i: uint): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		
		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pSize: uint, ppVertexDataIn?: IVertexData): IVertexData;
		
		freeVertexData(pVertexData: IVertexData): bool;
		freeVertexData(): bool;

		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
	}
}

#endif
