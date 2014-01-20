
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderResource.ts" />
/// <reference path="IRenderer.ts" />
/// <reference path="IIndexData.ts" />
/// <reference path="EDataTypes.ts" />

module akra {
	export interface IIndexBuffer extends IHardwareBuffer, IRenderResource {
	
		create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean;
	
		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
	
		freeIndexData(pIndexData: IIndexData): boolean;
	
	
		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
	}	
}
