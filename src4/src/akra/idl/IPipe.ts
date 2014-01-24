
/// <reference path="IEventProvider.ts" />

module akra {
	export interface IVirualDescriptor {
		onmessage: (pMessage: any) => void;
		onerror: (pErr: ErrorEvent) => void;
		onclose: (pEvent: CloseEvent) => void;
		onopen: (pEvent: Event) => void;
	}
	
	export enum EPipeTypes {
		UNKNOWN,
	
		WEBSOCKET,		/** Connect to websocket. */
		WEBWORKER 		/** Connect to webworker. */
	}
	
	export enum EPipeDataTypes {
		BINARY,
		STRING
	}
	
	export interface IPipe extends IEventProvider {
		getURI(): IURI;

		open(pAddr?: IURI): boolean;
		open(sAddr?: string): boolean;
		close(): void;

		write(sValue: string): boolean;
		write(pValue: Object): boolean;
		write(pValue: ArrayBuffer): boolean;
		write(pValue: ArrayBufferView): boolean;

		isOpened(): boolean;
		isCreated(): boolean;
		isClosed(): boolean;


		opened: ISignal<{ (pPipe: IPipe, pEvent: Event): void; }>;
		error: ISignal<{ (pPipe: IPipe, pErr: ErrorEvent): void; }>;
		closed: ISignal<{ (pPipe: IPipe, pEvent: CloseEvent): void; }>;
		message: ISignal<{ (pPipe: IPipe, pData: any, eType: EPipeDataTypes): void; }>;
	}
	
}
