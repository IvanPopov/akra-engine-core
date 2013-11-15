// AIThread interface
// [write description here...]

module akra {
interface AIThread {
	onmessage: Function;
	onerror: Function;
	id: int;

	send(pData: Object, pTransferables?: any[]): void;
	send(pData: ArrayBuffer, pTransferables?: any[]): void;
	send(pData: ArrayBufferView, pTransferables?: any[]): void;
}
}
