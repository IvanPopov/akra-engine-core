// AIBinWriter interface
// [write description here...]

module akra {
interface AIBinWriter {
	byteLength: uint;

	string(sData: string): void;
	
	uint32(iValue: uint): void;
	uint16(iValue: uint): void;
	uint8(iValue: uint): void;

	boolean(bValue: boolean): void;

	int32(iValue: int): void;
	int16(iValue: int): void;
	int8(iValue: int): void;

	float64(fValue: float): void;
	float32(fValue: float): void;

	stringArray(pValue: string[]): void;

	uint32Array(pValue: Uint32Array): void;
	uint16Array(pValue: Uint16Array): void;
	uint8Array(pValue: Uint8Array): void;

	int32Array(pValue: Int32Array): void;
	int16Array(pValue: Int16Array): void;
	int8Array(pValue: Int8Array): void;

	float64Array(pValue: Float64Array): void;
	float32Array(pValue: Float64Array): void;

	data(): ArrayBuffer;
	dataAsString(): string;
	dataAsUint8Array(): Uint8Array;
}
}
