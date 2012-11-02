#ifndef IVERTEXBUFFERBASE_TS
#define IVERTEXBUFFERBASE_TS

#include "IGPUBuffer.ts"

module akra {

	IFACE(IVertexData);
	IFACE(IVertexElement);
	IFACE(IVertexDeclaration);


	export interface IVertexBufferBase extends IGPUBuffer {
		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		
		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		
		freeVertexData(pVertexData: IVertexData): bool;

		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
	}
}

#endif
