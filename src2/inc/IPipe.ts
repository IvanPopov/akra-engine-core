#ifndef IPIPE_TS
#define IPIPE_TS

#include "IEventProvider.ts"

module akra {
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
		readonly uri: IURI;

		open(pAddr?: IURI): bool;
		open(sAddr?: string): bool;
		close(): void;

		write(sValue: string): bool;
		write(pValue: Object): bool;
		write(pValue: ArrayBuffer): bool;
		write(pValue: ArrayBufferView): bool;

		isOpened(): bool;
		isCreated(): bool;
		isClosed(): bool;

		signal opened(pEvent: Event): void;
		signal error(pErr: ErrorEvent): void;
		signal closed(pEvent: CloseEvent): void;
		signal message(pData: any, eType: EPipeDataTypes): void;
	}
}

#endif

