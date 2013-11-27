// AIIndexData interface
// [write description here...]

/// <reference path="AIRenderer.ts" />
/// <reference path="AIBuffer.ts" />
/// <reference path="AIBufferData.ts" />
/// <reference path="AEDataTypes.ts" />

interface AIIndexData extends AIBufferData, AIBuffer {
	/** readonly */ type: AEDataTypes;
	/** readonly */ length: uint;
	/** readonly */ bytesPerIndex: uint;
	/** readonly */ id: uint;

	getData(iOffset: int, iSize: int): ArrayBuffer;
	getTypedData(iStart: uint, iCount: uint): ArrayBufferView;
	
	setData(pData: ArrayBufferView): boolean;
	setData(pData: ArrayBufferView, iOffset: int): boolean;
	setData(pData: ArrayBufferView, iOffset: int, iCount: uint): boolean;

	destroy(): void;

	getPrimitiveType(): AEPrimitiveTypes;
	getPrimitiveCount(): uint;
	getBufferHandle(): int;
}
