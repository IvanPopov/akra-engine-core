#ifndef INDEXBUFFER_TS
#define INDEXBUFFER_TS

#include "IIndexBuffer.ts"
#include "core/pool/resources/HardwareBuffer.ts"

module akra.webgl {
	export class WebGLIndexBuffer extends core.pool.resources.HardwareBuffer implements IIndexBuffer {

		getIndexData: (iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes) => IIndexData = null;
		getEmptyIndexData: (iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes) => IIndexData = null;
		freeIndexData: (pIndexData: IIndexData) => bool = null;
		allocateData: (ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView) => IIndexData = null;
		getCountIndexForStripGrid: (iXVerts: int, iYVerts: int) => int = null;

		// inline getHardwareObject(): WebGLObject {
		// 	return null;
		// }
	}
}

#endif