#ifndef RPC_TS
#define RPC_TS

#include "common.ts"
#include "IRPC.ts"
#include "Pipe.ts"
#include "events/events.ts"
#include "util/util.ts"
#include "util/ObjectList.ts"

/// @: {data}/server|src(inc/net/server)|location()|data_location({data},DATA)


#define HAS_LIMITED_DEFERRED_CALLS(rpc) (rpc.options.deferredCallsLimit >= 0)
#define HAS_RECONNECT(rpc) (rpc.options.reconnectTimeout > 0)
#define HAS_SYSTEM_ROUTINE(rpc) (rpc.options.systemRoutineInterval > 0)
#define HAS_CALLBACK_LIFETIME(rpc) (rpc.options.callbackLifetime > 0)
#define HAS_GROUP_CALLS(rpc) (rpc.options.callsFrequency > 0)

module akra.net {


    enum ERpcStates {
        //not connected
        k_Deteached, 
        //connected, and connection must be established
        k_Joined,
        //must be closed
        k_Closing
    }

    class RPC implements IRPC {
        protected _pOption: IRPCOptions;

        protected _pPipe: IPipe = null;

        protected _iGroupID: int = -1;
        protected _pGroupCalls: IRPCRequest = null;

        //стек вызововы, которые были отложены
        protected _pDefferedRequests: IObjectList = new ObjectList;
        //стек вызовов, ожидающих результата
        //type: ObjectList<IRPCCallback>
        protected _pCallbacks: IObjectList = new ObjectList;
        //число совершенных вызовов
        protected _nCalls: uint = 0;

        protected _pRemoteAPI: Object = {};
        protected _eState: ERpcStates = ERpcStates.k_Deteached;

        //rejoin timer
        protected _iReconnect: int = -1;
        //timer for system routine
        protected _iSystemRoutine: int = -1;
        protected _iGroupCallRoutine: int = -1;


        inline get remote(): any { return this._pRemoteAPI; }
        inline get options(): IRPCOptions { return this._pOption; };
        inline get group(): int { return !isNull(this._pGroupCalls)? this._iGroupID: -1; }

        constructor (sAddr?: string, pOption?: IRPCOptions);
        constructor (pAddr: any = null, pOption: IRPCOptions = {}) {
            for (var i in RPC.OPTIONS) {
                if (!isDef(pOption[i])) {
                    pOption[i] = RPC.OPTIONS[i];
                }
            }

            this._pOption = pOption;

            if (!isDefAndNotNull(pOption.procMap)) {
                pOption.procMap = {};
            }

            pOption.procMap[pOption.procListName] = {
                lifeTime: -1,
                priority: 10
            };

            pAddr = pAddr || pOption.addr;

            if (isDefAndNotNull(pAddr)) {
                this.join(<string>pAddr);
            }
        }

        join(sAddr: string = null): void {
            var pPipe: IPipe = this._pPipe;
            var pRPC: RPC = this;
            var pDeffered: IObjectList = this._pDefferedRequests;

            if (isNull(pPipe)) {
                pPipe = net.createPipe();
            
                pPipe.bind(SIGNAL(message), 
                    function (pPipe: IPipe, pMessage: any, eType: EPipeDataTypes): void {
                        // LOG(pMessage);
                        if (eType !== EPipeDataTypes.BINARY) {
                            pRPC.parse(JSON.parse(<string>pMessage));
                        }
                        else {
                            pRPC.parseBinary(new Uint8Array(pMessage));
                        }
                    }
                );

                pPipe.bind(SIGNAL(opened), 
                    function (pPipe: IPipe, pEvent: Event): void {
                        
                        pRPC._startRoutines();

                        //if we have unhandled call in deffered...
                        if (pDeffered.length) {
                            pDeffered.seek(0);

                            while(pDeffered.length > 0) {
                                pPipe.write(pDeffered.current);
                                pRPC._releaseRequest(<IRPCRequest>pDeffered.takeCurrent());
                            }

                            debug_assert(pDeffered.length === 0, "something going wrong. length is: " + pDeffered.length);
                        }

                        pRPC.proc(pRPC.options.procListName, 
                            function (pError: Error, pList: string[]) {
                                if (!akra.isNull(pError)) {
                                    CRITICAL("could not get proc. list");
                                }
                                //TODO: FIX akra. prefix...
                                if (!akra.isNull(pList) && akra.isArray(pList)) {

                                    for (var i: int = 0; i < pList.length; ++ i) {
                                        (function (sMethod) {

                                            pRPC.options.procMap[sMethod] = pRPC.options.procMap[sMethod] || {
                                                lifeTime: -1,
                                                priority: 0
                                            };

                                            pRPC.remote[sMethod] = function () {
                                                var pArguments: string[] = [sMethod];

                                                for (var j: int = 0; j < arguments.length; ++ j) {
                                                    pArguments.push(arguments[j]);
                                                }

                                                return pRPC.proc.apply(pRPC, pArguments);
                                            }
                                        })(String(pList[i]));
                                    }

                                    // debug_print("rpc options: ", pRPC.options);
                                }

                                pRPC.joined();
                            }
                        );
                    }
                );

                pPipe.bind(SIGNAL(error), 
                    function(pPipe: IPipe, pError: Error): void {
                        ERROR("pipe error occured...");
                        //pRPC.rejoin();
                    }
                );

                pPipe.bind(SIGNAL(closed),
                    function (pPipe: IPipe, pEvent: CloseEvent): void {
                        pRPC._stopRoutines();
                        pRPC.rejoin();
                    }
                );
            }

            pPipe.open(<string>sAddr);

            this._pPipe = pPipe;
            this._eState = ERpcStates.k_Joined;
        }

        rejoin(): void {
            var pRPC: IRPC = this;

            clearTimeout(this._iReconnect);

            //rejoin not needed, because pipe already connected
            if (this._pPipe.isOpened()) {
                this._eState = ERpcStates.k_Joined;
                return;
            }

            //rejoin not needed, because we want close connection
            if (this._eState == ERpcStates.k_Closing) {
                this._eState = ERpcStates.k_Deteached;
                return;
            }

            if (this._pPipe.isClosed()) {
                //callbacks that will not be called, because connection was lost 
                this.freeCallbacks();
            
                if (HAS_RECONNECT(this)) {
                    this._iReconnect = setTimeout(() => { 
                        pRPC.join(); 
                    }, this.options.reconnectTimeout);
                }
            }
        }

        parse(pRes: IRPCResponse): void {
            if (!isDef(pRes.n)) {
                debug_print(pRes);
                WARNING("message droped, because seriial not recognized.");
            };
            
            this.response(pRes.n, pRes.type, pRes.res);
        }


        parseBinary(pBuffer: Uint8Array): void {

            var iHeaderByteLength: uint = 12;
            var pHeader: Uint32Array = new Uint32Array(pBuffer.buffer, pBuffer.byteOffset, iHeaderByteLength / 4);

            var nMsg: uint = pHeader[0];
            var eType: ERPCPacketTypes = <ERPCPacketTypes>pHeader[1];
            var iByteLength: int = pHeader[2];

            var pResult: Uint8Array = pBuffer.subarray(iHeaderByteLength, iHeaderByteLength + iByteLength);
            
            this.response(nMsg, eType, pResult);

            var iPacketByteLength: int = iHeaderByteLength + iByteLength;

            if (pBuffer.byteLength > iPacketByteLength) {
                // console.log("group message detected >> ");
                this.parseBinary(pBuffer.subarray(iPacketByteLength));
            }
        }

        private response(nSerial: uint, eType: ERPCPacketTypes, pResult: any): void {
            var pStack: IObjectList = this._pCallbacks;
            var fn: Function = null;

            if (eType === ERPCPacketTypes.RESPONSE) {
                var pCallback: IRPCCallback = <IRPCCallback>pStack.last;
                // WARNING("---------------->",nSerial,"<-----------------");
                // LOG(pStack.length);
                do {
                    // LOG("#n: ", nSerial, " result: ", pResult);
                    if (pCallback.n === nSerial) {
                        fn = pCallback.fn;
                        this._releaseCallback(pStack.takeCurrent());

                        if (!isNull(fn)) {
                            fn(null, pResult);
                        }
                        return;
                    }
                } while (pCallback = pStack.prev());


                // WARNING("package droped, invalid serial: " + nSerial);
            }
            else if (eType === ERPCPacketTypes.REQUEST) {
                ERROR("TODO: REQUEST package type temprary unsupported.");
            }
            else if (eType === ERPCPacketTypes.FAILURE) {
                ERROR("detected FAILURE on " + nSerial + " package");
                debug_print(pResult);
            }
            else {
                ERROR("unsupported response type detected: " + eType);
            }
        }

        private freeRequests(): void {
            var pStack: IObjectList = this._pDefferedRequests;
            var pReq: IRPCRequest = <IRPCRequest>pStack.first;
            
            if (pReq) {
                do {
                    this._releaseRequest(pReq);
                } while (pReq = pStack.next());

                pStack.clear();
            }
        }

        private freeCallbacks(): void {
            var pStack: IObjectList = this._pCallbacks;
            var pCallback: IRPCCallback = <IRPCCallback>pStack.first;
            
            if (pCallback) {
                do {
                    this._releaseCallback(pCallback);
                } while (pCallback = pStack.next());

                pStack.clear();
            }
        }

        free(): void {
            this.freeRequests();
            this.freeCallbacks();
        }

        detach(): void {
            this._eState = ERpcStates.k_Closing;

            if (!isNull(this._pPipe) && this._pPipe.isOpened()) {
                this._pPipe.close();
            }

            this.free();
        }

        private inline findLifeTimeFor(sProc: string): uint {
            var pProcOpt: IRPCProcOptions = this._pOption.procMap[sProc];
            
            if (pProcOpt) {
                var iProcLt: int = pProcOpt.lifeTime;

                if (iProcLt >= 0)
                    return iProcLt;
            }
            
            return this._pOption.callbackLifetime;
        }

        private findPriorityFor(sProc: string): uint {
            var pProcOpt: IRPCProcOptions = this._pOption.procMap[sProc];
            
            if (pProcOpt) {
                var iProcPr: int = pProcOpt.priority || 0;

                return iProcPr;
            }
            
            return 0;
        }

        setProcedureOption(sProc: string, sOpt: string, pValue: any): void {
            var pOptions: IRPCProcOptions = this.options.procMap[sProc];

            if (!pOptions) {
                pOptions = this.options.procMap[sProc] = {
                    lifeTime: -1
                };
            }

            pOptions[sOpt] = pValue;
        }

        proc(...argv: any[]): bool {
       
            var IRPCCallback: int = arguments.length - 1;
            var fnCallback: Function = 
                isFunction(arguments[IRPCCallback])? <Function>arguments[IRPCCallback]: null;
            var nArg: uint = arguments.length - (fnCallback? 2: 1);
            var pArgv: any[] = new Array(nArg);
            var pPipe: IPipe = this._pPipe;
            var pCallback: IRPCCallback = null;

            for (var i = 0; i < nArg; ++ i) {
                pArgv[i] = arguments[i + 1];
            }

            var pProc: IRPCRequest = this._createRequest();

            pProc.n     = this._nCalls ++;
            pProc.type  = ERPCPacketTypes.REQUEST;
            pProc.proc  = String(arguments[0]);
            pProc.argv  = pArgv;
            pProc.next  = null;
            pProc.lt    = this.findLifeTimeFor(pProc.proc);
            pProc.pr    = this.findPriorityFor(pProc.proc);

            pCallback = <IRPCCallback>this._createCallback();
            pCallback.n = pProc.n;
            pCallback.fn = fnCallback;
            pCallback.timestamp = now();
#ifdef DEBUG            
            pCallback.procInfo = pProc.proc + "(" + pArgv.join(',') + ")";
#endif

            if (isNull(pPipe) || !pPipe.isOpened()) {
                if (!HAS_LIMITED_DEFERRED_CALLS(this) ||
                    this._pDefferedRequests.length <= this.options.deferredCallsLimit) {

                    this._pDefferedRequests.push(pProc);
                    this._pCallbacks.push(pCallback);
                }
                else {
                    pCallback.fn(RPC.ERRORS.STACK_SIZE_EXCEEDED);
                    debug_warning(RPC.ERRORS.STACK_SIZE_EXCEEDED);
                    
                    this._releaseCallback(pCallback);
                    this._releaseRequest(pProc);
                }
                
                return false;
            }

            this._pCallbacks.push(pCallback);

            return this.callProc(pProc);
        }

        private callProc(pProc: IRPCRequest): bool {
            var pPipe: IPipe = this._pPipe;
            var bResult: bool = false;

            if (HAS_GROUP_CALLS(this)) {
                if (isNull(this._pGroupCalls)) {
                    this._pGroupCalls = pProc;
                    this._iGroupID ++;
                }
                else {
                    pProc.next = this._pGroupCalls;
                    this._pGroupCalls = pProc;
                }

                return true;
            }
            else {
                bResult = pPipe.write(pProc);
                this._releaseRequest(pProc);
            }

            return bResult;
        }

        inline _systemRoutine(): void {
            this._removeExpiredCallbacks();
        }

        _startRoutines(): void {
            var pRPC: RPC = this;

            if (HAS_SYSTEM_ROUTINE(this)) {
                this._iSystemRoutine = setInterval(() => {
                    pRPC._systemRoutine();
                }, this.options.systemRoutineInterval);
            }

            if (HAS_GROUP_CALLS(this)) {
                this._iGroupCallRoutine = setInterval(() => {
                    pRPC.groupCall();
                }, this.options.callsFrequency);
            }
        }

        _stopRoutines(): void {
            clearInterval(this._iSystemRoutine);
            this._systemRoutine();

            clearInterval(this._iGroupCallRoutine);
            //TODO: remove calls from group call, if RPC finally detached!
        }

        groupCall(): int {
            var pReq: IRPCRequest = this._pGroupCalls;
            
            if (isNull(pReq)) {
                return;
            }

            this._pPipe.write(pReq);

           return this.dropGroupCall();
        }

        dropGroupCall(): int {
            var pReq: IRPCRequest = this._pGroupCalls;

            for (;;) {
                var pNext = pReq.next;
                this._releaseRequest(pReq);
                
                if (!pNext) {
                    break;
                }

                pReq = <IRPCRequest>pNext;
            }

            this._pGroupCalls = null;
            return this._iGroupID;
        }

        _removeExpiredCallbacks(): void {
            var pCallbacks: IObjectList = this._pCallbacks;
            var pCallback: IRPCCallback = <IRPCCallback>pCallbacks.first;
            var iNow: int = now();
            var fn: Function = null;
            var sInfo: string = null;

            while(!isNull(pCallback)) {

                if (HAS_CALLBACK_LIFETIME(this) && (iNow - pCallback.timestamp) >= this.options.callbackLifetime) {
                    fn = pCallback.fn;
#ifdef DEBUG                    
                    sInfo = pCallback.procInfo;
#endif
                    this._releaseCallback(<IRPCCallback>pCallbacks.takeCurrent());

                    pCallback = pCallbacks.current;

                    if (!isNull(fn)) {
                        // debug_print("procedure info: ", sInfo);
                        fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
                    }
                }
                else {
                    pCallback = <IRPCCallback>pCallbacks.next();
                }
            }
        }

        _releaseRequest(pReq: IRPCRequest): void {
            pReq.n = 0;
            pReq.proc = null;
            pReq.argv = null;
            pReq.next = null;
            pReq.lt = 0;
            pReq.pr = 0;

            RPC.requestPool.push(pReq);
        };

        _createRequest(): IRPCRequest {
            if (RPC.requestPool.length == 0) {
                // LOG("allocated rpc request");
                return {n: 0, type: ERPCPacketTypes.REQUEST, proc: null, argv: null, next: null, lt: 0, pr: 0};
            }

            return <IRPCRequest>RPC.requestPool.pop();
        }

        _releaseCallback(pCallback: IRPCCallback): void {
            pCallback.n = 0;
            pCallback.fn = null;
            pCallback.timestamp = 0;
            pCallback.procInfo = null;

            RPC.callbackPool.push(pCallback);
        };

        _createCallback(): IRPCCallback {
            if (RPC.callbackPool.length == 0) {
                // LOG("allocated callback");
                return { n: 0, fn: null, timestamp: 0, procInfo: <string>null };
            }

            return <IRPCCallback>RPC.callbackPool.pop();
        }

        CREATE_EVENT_TABLE(RPC);
        BROADCAST(joined, VOID);

        private static requestPool: IObjectArray = new ObjectArray;
        private static callbackPool: IObjectArray = new ObjectArray;

        static OPTIONS: IRPCOptions = {
            deferredCallsLimit        : 20000,
            reconnectTimeout          : 2500,
            systemRoutineInterval     : 10000,
            callbackLifetime          : 60000,
            procListName              : "proc_list",
            callsFrequency            : -1
        }

        static ERRORS = {
            STACK_SIZE_EXCEEDED: new Error("stack size exceeded"),
            CALLBACK_LIFETIME_EXPIRED: new Error("procedure life time expired")
        }

    }

    export function createRpc(opt?: IRPCOptions): IRPC;
    export function createRpc(addr?: string, opt?: IRPCOptions): IRPC;
    export function createRpc(addr?: any, opt?: any): IRPC {
        if (arguments.length == 1) {
            if (isString(addr)) {
                return new RPC(addr);
            }

            return new RPC(null, arguments[0]);
        }

        return new RPC(addr, opt);
    }
}

#endif
