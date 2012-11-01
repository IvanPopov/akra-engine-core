#ifndef IINDEXBUFFER_TS
#define IINDEXBUFFER_TS

#include "IGPUBuffer.ts"
#include "IRenderResource.ts"

module akra {
	export interface IIndexBuffer extends IGPUBuffer, IRenderResource {

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;

		freeIndexData(pIndexData: IIndexData): bool;


		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
		getCountIndexForStripGrid(iXVerts: int, iYVerts: int): int;

	}
}

#endif