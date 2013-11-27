// AIPipe interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />

interface AIVirualDescriptor {
    onmessage: (pMessage: any) => void;
    onerror: (pErr: ErrorEvent) => void;
    onclose: (pEvent: CloseEvent) => void;
    onopen: (pEvent: Event) => void;
}

enum AEPipeTypes {
	UNKNOWN,

	WEBSOCKET,		/** Connect to websocket. */
	WEBWORKER 		/** Connect to webworker. */
}

enum AEPipeDataTypes {
	BINARY,
	STRING
}

interface AIPipe extends AIEventProvider {
	/** readonly */ uri: AIURI;

	open(pAddr?: AIURI): boolean;
	open(sAddr?: string): boolean;
	close(): void;

	write(sValue: string): boolean;
	write(pValue: Object): boolean;
	write(pValue: ArrayBuffer): boolean;
	write(pValue: ArrayBufferView): boolean;

	isOpened(): boolean;
	isCreated(): boolean;
	isClosed(): boolean;

	signal opened(pEvent: Event): void;
	signal error(pErr: ErrorEvent): void;
	signal closed(pEvent: CloseEvent): void;
	signal message(pData: any, eType: AEPipeDataTypes): void;
}
