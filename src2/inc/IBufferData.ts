#ifndef IBUFFERDATA_TS
#define IBUFFERDATA_TS

module akra {
	export interface IBufferData {
		byteOffset: uint;
		byteLength: uint;
		buffer: IBuffer;
	}
}

#endif