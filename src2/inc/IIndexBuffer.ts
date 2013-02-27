#ifndef IINDEXBUFFER_TS
#define IINDEXBUFFER_TS

#include "IHardwareBuffer.ts"
#include "IRenderResource.ts"
#include "IRenderer.ts"

module akra {

	IFACE(IIndexData);

	export interface IIndexBuffer extends IHardwareBuffer, IRenderResource {

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;

		freeIndexData(pIndexData: IIndexData): bool;


		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
	}
}

#endif