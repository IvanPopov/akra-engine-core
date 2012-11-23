#ifndef IVERTEXBUFFER_TS
#define IVERTEXBUFFER_TS

#include "IHardwareBuffer.ts"
#include "IResourcePoolItem.ts"

module akra {

	IFACE(IVertexData);
	IFACE(IVertexElement);
	IFACE(IVertexDeclaration);

	export enum EVertexBufferTypes {
		TYPE_UNKNOWN,
		TYPE_VBO,
		TYPE_TBO
	};

	export interface IVertexBuffer extends IHardwareBuffer, IResourcePoolItem {

		readonly type: EVertexBufferTypes; 

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
