// AIBinReader interface
// [write description here...]

module akra {

interface AIBinReader {

	string(sDefault?: string): string;

	uint32(): uint;
	uint16(): uint;
	uint8(): uint;

	boolean(): boolean;

	int32(): int;
	int16(): int;
	int8(): int;

	float64(): float;
	float32(): float;

	stringArray(): string[];

	uint32Array(): Uint32Array;
	uint16Array(): Uint16Array;
	uint8Array(): Uint8Array;

	int32Array(): Int32Array;
	int16Array(): Int16Array;
	int8Array(): Int8Array;

	float64Array(): Float64Array;
	float32Array(): Float32Array;
}
}

#endif