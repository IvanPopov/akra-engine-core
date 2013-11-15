// AIRPC interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />

#define RPC_STACK_SIZE_EXCEEDED_CODE 1
#define RPC_CALLBACK_LIFETIME_EXPIRED_CODE 2

module akra {
enum AERPCPacketTypes {
	FAILURE,
	REQUEST,
	RESPONSE
}

interface AIRPCCallback {
	n: uint;
	fn: Function;
	timestamp: uint;
	procInfo?: string;
}

interface AIRPCPacket {
	n: uint;
	type: AERPCPacketTypes;
	next: AIRPCPacket;
}

interface IRPCRequest extends AIRPCPacket {
	proc: string;
	argv: any[];
	//ms - life time
	lt: uint;
	pr: uint;
}

interface IRPCResponse extends AIRPCPacket  {
	//procedure result
	res: any;
}

interface AIRPCProcOptions {
	//-1 - unknown, 0 - immortal
	lifeTime?: int;
	priority?: uint;
}

interface AIRPCProcOptionsMap {
	[proc: string]: AIRPCProcOptions;
}

interface IRPCError extends Error {
	code: uint;
}

interface AIRPCOptions {
	addr?: string;
	deferredCallsLimit?: int;	   /* -1 - unlimited */
	maxCallbacksCount?: int;		/* -1 - unlimited */
	reconnectTimeout?: int;		 /* -1 - never */
	systemRoutineInterval?: int;	/* -1 - never*/
	callbackLifetime?: uint;		/* 0 - immortal */
	procListName?: string;		  /* имя процедуры, для получения все поддерживаемых процедур */
	callsFrequency?: int;		   /* 0 or -1 - disable group calls */
	context?: any;				  /* контекст, у которого будут вызываться методы, при получении REQUEST запросов со стороны сервера */
	procMap?: AIRPCProcOptionsMap;

}

interface AIRPC extends AIEventProvider {
	options: AIRPCOptions;
	remote: any;
	group: int;

	join(sAddr?: string): void;
	rejoin(): void;
	free(): void;
	detach(): void;
	proc(...argv: any[]): boolean;

	parse(pResponse: IRPCResponse): void;
	parseBinary(pData: Uint8Array): void;

	groupCall(): int;
	dropGroupCall(): int;

	setProcedureOption(sProc: string, sOpt: string, pValue: any): void;

	signal joined(): void;
	signal error(pError: Error): void;

	_createRequest(): IRPCRequest;
	_releaseRequest(pReq: IRPCRequest): void;

	_createCallback(): AIRPCCallback;
	_releaseCallback(pCallback: AIRPCCallback): void;


	_startRoutines(): void;
	_stopRoutines(): void;
	_removeExpiredCallbacks(): void;
}  
}

#endif
