// AIIndexBuffer interface
// [write description here...]

/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIRenderResource.ts" />
/// <reference path="AIRenderer.ts" />
/// <reference path="AIIndexData.ts" />
/// <reference path="AEDataTypes.ts" />

interface AIIndexBuffer extends AIHardwareBuffer, AIRenderResource {

	create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean;

	getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: AEPrimitiveTypes, eElementsType: AEDataTypes): AIIndexData;
	getEmptyIndexData(iCount: uint, ePrimitiveType: AEPrimitiveTypes, eElementsType: AEDataTypes): AIIndexData;

	freeIndexData(pIndexData: AIIndexData): boolean;


	allocateData(ePrimitiveType: AEPrimitiveTypes, eElementsType: AEDataTypes, pData: ArrayBufferView): AIIndexData;
}
