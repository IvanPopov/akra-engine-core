#ifndef IRPC_TS
#define IRPC_TS

#include "IEventProvider.ts"

#define RPC_STACK_SIZE_EXCEEDED_CODE 1
#define RPC_CALLBACK_LIFETIME_EXPIRED_CODE 2

module akra {
	export enum ERPCPacketTypes {
        FAILURE,
        REQUEST,
        RESPONSE
    }

    export interface IRPCCallback {
        n: uint;
        fn: Function;
        timestamp: uint;
        procInfo?: string;
    }

	export interface IRPCPacket {
        n: uint;
        type: ERPCPacketTypes;
        next: IRPCPacket;
    }

    export interface IRPCRequest extends IRPCPacket {
        proc: string;
        argv: any[];
        //ms - life time
        lt: uint;
        pr: uint;
    }

    export interface IRPCResponse extends IRPCPacket  {
        //procedure result
        res: any;
    }

    export interface IRPCProcOptions {
        //-1 - unknown, 0 - immortal
        lifeTime?: int;
        priority?: uint;
    }

    export interface IRPCProcOptionsMap {
        [proc: string]: IRPCProcOptions;
    }

    export interface IRPCError extends Error {
        code: uint;
    }

    export interface IRPCOptions {
        addr?: string;
        deferredCallsLimit?: int;       /* -1 - unlimited */
        reconnectTimeout?: int;         /* -1 - never */
        systemRoutineInterval?: int;    /* -1 - never*/
        callbackLifetime?: uint;        /* 0 - immortal */
        procListName?: string;          /* имя процедуры, для получения все поддерживаемых процедур */
        callsFrequency?: int;           /* 0 or -1 - disable group calls */
        context?: any;                  /* контекст, у которого будут вызываться методы, при получении REQUEST запросов со стороны сервера */
        procMap?: IRPCProcOptionsMap;
    }

	export interface IRPC extends IEventProvider {
		options: IRPCOptions;
        remote: any;
        group: int;

		join(sAddr?: string): void;
		rejoin(): void;
		free(): void;
        detach(): void;
		proc(...argv: any[]): bool;

		parse(pResponse: IRPCResponse): void;
		parseBinary(pData: Uint8Array): void;

        groupCall(): int;
        dropGroupCall(): int;

        setProcedureOption(sProc: string, sOpt: string, pValue: any): void;

		signal joined(): void;
        signal error(pError: Error): void;

        _createRequest(): IRPCRequest;
        _releaseRequest(pReq: IRPCRequest): void;

        _createCallback(): IRPCCallback;
        _releaseCallback(pCallback: IRPCCallback): void;


        _startRoutines(): void;
        _stopRoutines(): void;
        _removeExpiredCallbacks(): void;
	}  
}

#endif

