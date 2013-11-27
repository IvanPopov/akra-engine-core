/// <reference path="../idl/AIRPC.ts" />



import config = require("config");
import logger = require("logger");
import net = require("net");
import time = require("time");

import ObjectList = require("util/ObjectList");
import ObjectArray = require("util/ObjectArray");
import ObjectSortCollection = require("util/ObjectSortCollection");

import Pipe = require("net/Pipe");

var OPTIONS: AIRPCOptions = config.rpc;

function hasLimitedDeferredCalls(pRpc: AIRPC): boolean {
    return (pRpc.options.deferredCallsLimit >= 0)
}
function hasReconnect(pRpc: AIRPC): boolean {
    return (pRpc.options.reconnectTimeout > 0);
}
function hasSystemRoutine(pRpc: AIRPC): boolean {
    return (pRpc.options.systemRoutineInterval > 0)
}
function hasCallbackLifetime(pRpc: AIRPC): boolean { 
    return (pRpc.options.callbackLifetime > 0)
}
function hasGroupCalls(pRpc: AIRPC): boolean {
    return (pRpc.options.callsFrequency > 0);
}
function hasCallbacksCountLimit(pRpc: AIRPC): boolean {
    return (pRpc.options.maxCallbacksCount > 0);
}

class RPC implements AIRPC {
    protected _pOption: AIRPCOptions;

    protected _pPipe: AIPipe = null;

    protected _iGroupID: int = -1;
    protected _pGroupCalls: AIRPCRequest = null;

    //стек вызововы, которые были отложены
    protected _pDefferedRequests: AIObjectList<AIRPCRequest> = new ObjectList<AIRPCRequest>();
    //стек вызовов, ожидающих результата
    //type: ObjectList<IRPCCallback>
    protected _pCallbacksList: AIObjectList<AIRPCCallback> = null;
    protected _pCallbacksCollection: AIObjectSortCollection<AIRPCCallback> = null;
    //число совершенных вызовов
    protected _nCalls: uint = 0;

    protected _pRemoteAPI: Object = {}
    protected _eState: AERpcStates = AERpcStates.k_Deteached;

    //rejoin timer
    protected _iReconnect: int = -1;
    //timer for system routine
    protected _iSystemRoutine: int = -1;
    protected _iGroupCallRoutine: int = -1;


    get remote(): any { return this._pRemoteAPI; }
    get options(): AIRPCOptions { return this._pOption; }
    get group(): int { return !isNull(this._pGroupCalls) ? this._iGroupID : -1; }

    constructor(sAddr?: string, pOption?: AIRPCOptions);
    constructor(pAddr: any = null, pOption: AIRPCOptions = {}) {
        for (var i in OPTIONS) {
            if (!isDef(pOption[i])) {
                pOption[i] = OPTIONS[i];
            }
        }

        this._pOption = pOption;

        if (!isDefAndNotNull(pOption.procMap)) {
            pOption.procMap = {}
        }

        pOption.procMap[pOption.procListName] = {
            lifeTime: -1,
            priority: 10
        }

        if (hasCallbacksCountLimit(this)) {
            this._pCallbacksCollection = new ObjectSortCollection<AIRPCCallback>(this._pOption.maxCallbacksCount);
            this._pCallbacksCollection.setCollectionFuncion((pCallback: AIRPCCallback): int => {
                return isNull(pCallback) ? -1 : pCallback.n;
            });
        }
        else {
            this._pCallbacksList = new ObjectList();
        }
        pAddr = pAddr || pOption.addr;

        if (isDefAndNotNull(pAddr)) {
            this.join(<string>pAddr);
        }
    }

    join(sAddr: string = null): void {
        var pPipe: AIPipe = this._pPipe;
        var pDeffered: AIObjectList<AIRPCRequest> = this._pDefferedRequests;

        if (isNull(pPipe)) {
            pPipe = new Pipe();

            pPipe.bind("message",
                function (pPipe: AIPipe, pMessage: any, eType: AEPipeDataTypes): void {
                    // LOG(pMessage);
                    if (eType !== AEPipeDataTypes.BINARY) {
                        this.parse(JSON.parse(<string>pMessage));
                    }
                    else {
                        this.parseBinary(new Uint8Array(pMessage));
                    }
                }
                );

            pPipe.bind("opened",
                function (pPipe: AIPipe, pEvent: Event): void {

                    this._startRoutines();

                    //if we have unhandled call in deffered...
                    if (pDeffered.length) {
                        pDeffered.seek(0);

                        while (pDeffered.length > 0) {
                            pPipe.write(pDeffered.current);
                            this._releaseRequest(<AIRPCRequest>pDeffered.takeCurrent());
                        }

                        logger.presume(pDeffered.length === 0, "something going wrong. length is: " + pDeffered.length);
                    }

                    this.proc(this.options.procListName,
                        function (pError: Error, pList: string[]) {
                            if (!isNull(pError)) {
                                logger.critical("could not get proc. list");
                            }
                            //TODO: FIX akra. prefix...
                            if (!isNull(pList) && isArray(pList)) {

                                for (var i: int = 0; i < pList.length; ++i) {
                                    (function (sMethod) {

                                        this.options.procMap[sMethod] = this.options.procMap[sMethod] || {
                                            lifeTime: -1,
                                            priority: 0
                                        }

                                        this.remote[sMethod] = function () {
                                            var pArguments: string[] = [sMethod];

                                            for (var j: int = 0; j < arguments.length; ++j) {
                                                pArguments.push(arguments[j]);
                                            }

                                            return this.proc.apply(this, pArguments);
                                        }
										})(String(pList[i]));
                                }

                                // logger.log("rpc options: ", pRPC.options);
                            }

                            this.joined();
                        }
                        );
                }
                );

            pPipe.bind("error",
                function (pPipe: AIPipe, pError: Error): void {
                    logger.error("pipe e rror occured...");
                    this.error(pError);
                    //pRPC.rejoin();
                });

            pPipe.bind("closed",
                function (pPipe: AIPipe, pEvent: CloseEvent): void {
                    this._stopRoutines();
                    this.rejoin();
                });
        }

        pPipe.open(<string>sAddr);

        this._pPipe = pPipe;
        this._eState = AERpcStates.k_Joined;
    }

    rejoin(): void {
        var pRPC: AIRPC = this;

        clearTimeout(this._iReconnect);

        //rejoin not needed, because pipe already connected
        if (this._pPipe.isOpened()) {
            this._eState = AERpcStates.k_Joined;
            return;
        }

        //rejoin not needed, because we want close connection
        if (this._eState == AERpcStates.k_Closing) {
            this._eState = AERpcStates.k_Deteached;
            return;
        }

        if (this._pPipe.isClosed()) {
            //callbacks that will not be called, because connection was lost 
            this.freeCallbacks();

            if (hasReconnect(this)) {
                this._iReconnect = setTimeout(() => {
                    pRPC.join();
                }, this.options.reconnectTimeout);
            }
        }
    }

    parse(pRes: AIRPCResponse): void {
        if (!isDef(pRes.n)) {
            //logger.log(pRes);
            logger.warn("message droped, because seriial not recognized.");
        }

        this.response(pRes.n, pRes.type, pRes.res);
    }


    parseBinary(pBuffer: Uint8Array): void {

        var iHeaderByteLength: uint = 12;
        var pHeader: Uint32Array = new Uint32Array(pBuffer.buffer, pBuffer.byteOffset, iHeaderByteLength / 4);

        var nMsg: uint = pHeader[0];
        var eType: AERPCPacketTypes = <AERPCPacketTypes>pHeader[1];
        var iByteLength: int = pHeader[2];

        var pResult: Uint8Array = pBuffer.subarray(iHeaderByteLength, iHeaderByteLength + iByteLength);

        this.response(nMsg, eType, pResult);

        var iPacketByteLength: int = iHeaderByteLength + iByteLength;

        if (pBuffer.byteLength > iPacketByteLength) {
            // console.log("group message detected >> ");
            this.parseBinary(pBuffer.subarray(iPacketByteLength));
        }
    }

    private response(nSerial: uint, eType: AERPCPacketTypes, pResult: any): void {
        if (eType === AERPCPacketTypes.RESPONSE) {
            var fn: Function = null;
            var pCallback: AIRPCCallback = null;
            // WARNING("---------------->",nSerial,"<-----------------");
            // LOG(pStack.length);
            if (hasCallbacksCountLimit(this)) {
                var pCollection: AIObjectSortCollection<AIRPCCallback> = this._pCallbacksCollection;
                pCallback = pCollection.takeElement(nSerial);
                if (!isNull(pCallback)) {
                    fn = pCallback.fn;
                    this._releaseCallback(pCallback);

                    if (!isNull(fn)) {
                        fn(null, pResult);
                    }
                    return;
                }
            }
            else {
                var pStack: AIObjectList<AIRPCCallback> = this._pCallbacksList;
                pCallback = <AIRPCCallback>pStack.last;
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
            }


            // WARNING("package droped, invalid serial: " + nSerial);
        }
        else if (eType === AERPCPacketTypes.REQUEST) {
            logger.error("TODO: REQUEST package type temprary unsupported.");
        }
        else if (eType === AERPCPacketTypes.FAILURE) {
            logger.error("detected FAILURE on " + nSerial + " package");
            logger.log(pResult);
        }
        else {
            logger.error("unsupported response type detected: " + eType);
        }
    }

    private freeRequests(): void {
        var pStack: AIObjectList<AIRPCRequest> = this._pDefferedRequests;
        var pReq: AIRPCRequest = <AIRPCRequest>pStack.first;

        if (pReq) {
            do {
                this._releaseRequest(pReq);
            } while (pReq = pStack.next());

            pStack.clear();
        }
    }

    private freeCallbacks(): void {
        if (hasCallbacksCountLimit(this)) {
            this._pCallbacksCollection.clear();
        }
        else {
            var pStack: AIObjectList<AIRPCCallback> = this._pCallbacksList;
            var pCallback: AIRPCCallback = <AIRPCCallback>pStack.first;

            if (pCallback) {
                do {
                    this._releaseCallback(pCallback);
                } while (pCallback = pStack.next());

                pStack.clear();
            }
        }
    }

    free(): void {
        this.freeRequests();
        this.freeCallbacks();
    }

    detach(): void {
        this._eState = AERpcStates.k_Closing;

        if (!isNull(this._pPipe) && this._pPipe.isOpened()) {
            this._pPipe.close();
        }

        this.free();
    }

    private findLifeTimeFor(sProc: string): uint {
        var pProcOpt: AIRPCProcOptions = this._pOption.procMap[sProc];

        if (pProcOpt) {
            var iProcLt: int = pProcOpt.lifeTime;

            if (iProcLt >= 0)
                return iProcLt;
        }

        return this._pOption.callbackLifetime;
    }

    private findPriorityFor(sProc: string): uint {
        var pProcOpt: AIRPCProcOptions = this._pOption.procMap[sProc];

        if (pProcOpt) {
            var iProcPr: int = pProcOpt.priority || 0;

            return iProcPr;
        }

        return 0;
    }

    setProcedureOption(sProc: string, sOpt: string, pValue: any): void {
        var pOptions: AIRPCProcOptions = this.options.procMap[sProc];

        if (!pOptions) {
            pOptions = this.options.procMap[sProc] = {
                lifeTime: -1
            }
        }

        pOptions[sOpt] = pValue;
    }

    proc(...argv: any[]): boolean {

        var IRPCCallback: int = arguments.length - 1;
        var fnCallback: Function =
            isFunction(arguments[IRPCCallback]) ? <Function>arguments[IRPCCallback] : null;
        var nArg: uint = arguments.length - (fnCallback ? 2 : 1);
        var pArgv: any[] = new Array(nArg);
        var pPipe: AIPipe = this._pPipe;
        var pCallback: AIRPCCallback = null;

        for (var i = 0; i < nArg; ++i) {
            pArgv[i] = arguments[i + 1];
        }

        var pProc: AIRPCRequest = this._createRequest();

        pProc.n = this._nCalls++;
        pProc.type = AERPCPacketTypes.REQUEST;
        pProc.proc = String(arguments[0]);
        pProc.argv = pArgv;
        pProc.next = null;
        pProc.lt = this.findLifeTimeFor(pProc.proc);
        pProc.pr = this.findPriorityFor(pProc.proc);

        pCallback = <AIRPCCallback>this._createCallback();
        pCallback.n = pProc.n;
        pCallback.fn = fnCallback;
        pCallback.timestamp = time();

        if (has("DEBUG")) {
            pCallback.procInfo = pProc.proc + "(" + pArgv.join(',') + ")";
        }

			if (isNull(pPipe) || !pPipe.isOpened()) {
            if (!hasLimitedDeferredCalls(this) ||
                this._pDefferedRequests.length <= this.options.deferredCallsLimit) {

                this._pDefferedRequests.push(pProc);

                if (hasCallbacksCountLimit(this)) {
                    this._pCallbacksCollection.push(pCallback);
                }
                else {
                    this._pCallbacksList.push(pCallback);
                }
            }
            else {
                pCallback.fn(RPC.ERRORS.STACK_SIZE_EXCEEDED);
                logger.log(RPC.ERRORS.STACK_SIZE_EXCEEDED);

                this._releaseCallback(pCallback);
                this._releaseRequest(pProc);
            }

            return false;
        }

        if (hasCallbacksCountLimit(this)) {
            this._pCallbacksCollection.push(pCallback);
        }
        else {
            this._pCallbacksList.push(pCallback);
        }

        return this.callProc(pProc);
    }

    private callProc(pProc: AIRPCRequest): boolean {
        var pPipe: AIPipe = this._pPipe;
        var bResult: boolean = false;

        if (hasGroupCalls(this)) {
            if (isNull(this._pGroupCalls)) {
                this._pGroupCalls = pProc;
                this._iGroupID++;
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

    private _systemRoutine(): void {
        this._removeExpiredCallbacks();
    }

   private  _startRoutines(): void {
        var pRPC: RPC = this;

        if (hasSystemRoutine(this)) {
            this._iSystemRoutine = setInterval(() => {
                pRPC._systemRoutine();
            }, this.options.systemRoutineInterval);
        }

        if (hasGroupCalls(this)) {
            this._iGroupCallRoutine = setInterval(() => {
                pRPC.groupCall();
            }, this.options.callsFrequency);
        }
    }

    private _stopRoutines(): void {
        clearInterval(this._iSystemRoutine);
        this._systemRoutine();

        clearInterval(this._iGroupCallRoutine);
        //TODO: remove calls from group call, if RPC finally detached!
    }

    groupCall(): int {
        var pReq: AIRPCRequest = this._pGroupCalls;

        if (isNull(pReq)) {
            return;
        }

        this._pPipe.write(pReq);

        return this.dropGroupCall();
    }

    dropGroupCall(): int {
        var pReq: AIRPCRequest = this._pGroupCalls;

        for (; ;) {
            var pNext = pReq.next;
            this._releaseRequest(pReq);

            if (!pNext) {
                break;
            }

            pReq = <AIRPCRequest>pNext;
        }

        this._pGroupCalls = null;
        return this._iGroupID;
    }

    private _removeExpiredCallbacks(): void {
        var pCallback: AIRPCCallback = null;
        var iNow: int = time();
        var fn: Function = null;
        var sInfo: string = null;

        if (hasCallbacksCountLimit(this)) {
            //				 for(var i: uint = 0; i < this.options.maxCallbacksCount; i++){
            //					 pCallback = <IRPCCallback>this._pCallbacksCollection.getElementAt(i);

            //					 if (!isNull(pCallback) && HAS_CALLBACK_LIFETIME(this) && (iNow - pCallback.timestamp) >= this.options.callbackLifetime) {
            //						 fn = pCallback.fn;
            // #ifdef DEBUG					
            //						 sInfo = pCallback.procInfo;
            // #endif
            //						 this._releaseCallback(pCallback);
            //						 this._pCallbacksCollection.removeElementAt(i);

            //						 if (!isNull(fn)) {
            //							 // logger.log("procedure info: ", sInfo);
            //							 fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
            //						 }
            //					 }
            //				 }
        }
        else {
            var pCallbacks: AIObjectList<AIRPCCallback> = this._pCallbacksList;
            pCallback = <AIRPCCallback>pCallbacks.first;
            while (!isNull(pCallback)) {

                if (hasCallbackLifetime(this) && (iNow - pCallback.timestamp) >= this.options.callbackLifetime) {
                    fn = pCallback.fn;
                    if (has("DEBUG")) {
                        sInfo = pCallback.procInfo;
                    }
					this._releaseCallback(<AIRPCCallback>pCallbacks.takeCurrent());

                    pCallback = pCallbacks.current;

                    if (!isNull(fn)) {
                        // logger.log("procedure info: ", sInfo);
                        fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
                    }
                }
                else {
                    pCallback = <AIRPCCallback>pCallbacks.next();
                }
            }
        }
    }

    private _releaseRequest(pReq: AIRPCRequest): void {
        pReq.n = 0;
        pReq.proc = null;
        pReq.argv = null;
        pReq.next = null;
        pReq.lt = 0;
        pReq.pr = 0;

        RPC.requestPool.push(pReq);
    }

    private _createRequest(): AIRPCRequest {
        if (RPC.requestPool.length == 0) {
            // LOG("allocated rpc request");
            return { n: 0, type: AERPCPacketTypes.REQUEST, proc: null, argv: null, next: null, lt: 0, pr: 0 }
        }

        return RPC.requestPool.pop();
    }

    private _releaseCallback(pCallback: AIRPCCallback): void {
        pCallback.n = 0;
        pCallback.fn = null;
        pCallback.timestamp = 0;
        pCallback.procInfo = null;

        RPC.callbackPool.push(pCallback);
    }

    private _createCallback(): AIRPCCallback {
        if (RPC.callbackPool.length == 0) {
            // LOG("allocated callback");
            return { n: 0, fn: null, timestamp: 0, procInfo: <string>null }
        }

        return RPC.callbackPool.pop();
    }

    //CREATE_EVENT_TABLE(RPC);
    //BROADCAST(joined, VOID);
    //BROADCAST(error, CALL(pError));

    private static requestPool: AIObjectArray<AIRPCRequest> = new ObjectArray;
    private static callbackPool: AIObjectArray <AIRPCCallback>= new ObjectArray;

	static ERRORS = {
        STACK_SIZE_EXCEEDED: <AIRPCError>{
            name: "RPC err.",
            message: "stack size exceeded",
            code: 1
        },
        CALLBACK_LIFETIME_EXPIRED: <AIRPCError>{
            name: "RPC err.",
            message: "procedure life time expired",
            code: 2
        }
    }

}

export = RPC;