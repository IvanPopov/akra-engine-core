
/// <reference path="IRenderer.ts" />
/// <reference path="IBuffer.ts" />
/// <reference path="IBufferData.ts" />
/// <reference path="EDataTypes.ts" />

module akra {
	interface IIndexData extends IBufferData, IBuffer {
		/** readonly */ type: EDataTypes;
		/** readonly */ length: uint;
		/** readonly */ bytesPerIndex: uint;
		/** readonly */ id: uint;
	
		getData(iOffset: int, iSize: int): ArrayBuffer;
		getTypedData(iStart: uint, iCount: uint): ArrayBufferView;
		
		setData(pData: ArrayBufferView): boolean;
		setData(pData: ArrayBufferView, iOffset: int): boolean;
		setData(pData: ArrayBufferView, iOffset: int, iCount: uint): boolean;
	
		destroy(): void;
	
		getPrimitiveType(): EPrimitiveTypes;
		getPrimitiveCount(): uint;
		getBufferHandle(): int;
	}
	
}
