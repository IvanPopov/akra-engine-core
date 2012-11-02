#ifndef IBUFFER_TS
#define IBUFFER_TS

module akra {
	export interface IBuffer {
		//number of elements
		readonly length: int;
		
		//size in bytes
		readonly byteLength: int;

		
	}
}

#endif
