///<reference path="akra.ts" />

module akra {
	export interface IIndexData extends IBufferData {
		type: EDataTypes;
		count: uint;
		bytesPerIndex: uint;

		getData(iOffset: int, iSize: int): ArrayBuffer;
		setData(pData: ArrayBufferView, iOffset: int, iCount: uint): bool;

		destroy(): void;

		getPrimitiveType(): EPrimitiveTypes;
		getPrimitiveCount(): uint;
	}
}