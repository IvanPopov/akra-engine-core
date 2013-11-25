// AIRPC interface

/// <reference path="AIEventProvider.ts" />
/// <reference path="AIMap.ts" />

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

interface AIRPCRequest extends AIRPCPacket {
	proc: string;
	argv: any[];
	//ms - life time
	lt: uint;
	pr: uint;
}

interface AIRPCResponse extends AIRPCPacket  {
	//procedure result
	res: any;
}

interface AIRPCProcOptions {
	//-1 - unknown, 0 - immortal
	lifeTime?: int;
	priority?: uint;
}

interface AIRPCError extends Error {
	code: uint;
}

interface AIRPCOptions {
	addr?: string;
	deferredCallsLimit?: int;	        /* -1 - unlimited */
	maxCallbacksCount?: int;		    /* -1 - unlimited */
	reconnectTimeout?: int;		        /* -1 - never */
	systemRoutineInterval?: int;	    /* -1 - never*/
	callbackLifetime?: uint;		    /* 0 - immortal */
	procListName?: string;		        /* имя процедуры, для получения все поддерживаемых процедур */
	callsFrequency?: int;		        /* 0 or -1 - disable group calls */
	context?: any;				        /* контекст, у которого будут вызываться методы, при получении REQUEST запросов со стороны сервера */
    procMap?: AIMap<AIRPCProcOptions>;

}

enum AERpcStates {
    //not connected
    k_Deteached,
    //connected, and connection must be established
    k_Joined,
    //must be closed
    k_Closing
}


interface AIRPC extends AIEventProvider {
	options: AIRPCOptions;
    remote: any;
    group: int;                 //????

	join(sAddr?: string): void;
	rejoin(): void;
	free(): void;
	detach(): void;
	proc(...argv: any[]): boolean;

    groupCall(): int;           //??????
    dropGroupCall(): int;       //???????

	setProcedureOption(sProc: string, sOpt: string, pValue: any): void;

	signal joined(): void;
	signal error(pError: Error): void;
}  

