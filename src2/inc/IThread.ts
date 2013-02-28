#ifndef ITHREAD_TS
#define ITHREAD_TS

module akra {
	export interface IThread {
		onmessage: Function;
		onerror: Function;
		id: int;

		send(pData: Object, pTransferables?: any[]): void;
		send(pData: ArrayBuffer, pTransferables?: any[]): void;
		send(pData: ArrayBufferView, pTransferables?: any[]): void;
	}
}

#endif