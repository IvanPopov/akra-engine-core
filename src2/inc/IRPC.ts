#ifndef IRPC_TS
#define IRPC_TS

#include "IEventProvider.ts"

module akra {
	export enum ERPCPacketTypes {
        FAILURE,
        REQUEST,
        RESPONSE
    }

    export interface IRPCCallback {
        n: uint;
        fn: Function;
    }

	export interface IRPCPacket {
        n: uint;
        type: ERPCPacketTypes;
    }

    export interface IRPCRequest extends IRPCPacket {
        proc: string;
        argv: any[];
    }

    export interface IRPCResponse extends IRPCPacket  {
        //procedure result
        res: any;
    }

	export interface IRPC extends IEventProvider {
		remote: any;

		join(sAddr?: string): void;
		rejoin(): void;
		free(): void;
		proc(...argv: any[]): bool;

		parse(pResponse: IRPCResponse): void;
		parseBinary(pData: ArrayBuffer): void;

		signal joined(): void;

        _createRequest(): IRPCRequest;
        _releaseRequest(pReq: IRPCRequest): void;

	}
}

#endif

