#ifndef RPC_TS
#define RPC_TS

#include "common.ts"
#include "IRPC.ts"
#include "Pipe.ts"
#include "events/events.ts"
#include "util/util.ts"


module akra.net {

    interface ICallback {
        n: uint;
        fn: Function;
    }

    class RPC implements IRPC {
        protected _pPipe: IPipe = null;

        //стек вызововы, которые были отложены
        protected _pDefferedCalls: IRPCRequest[] = [];
        //стек вызовов, ожидающих результата
        protected _pCallbacks: ICallback[] = [];
        //число совершенных вызовов
        protected _nCalls: uint = 0;
        //rejoin timer
        protected _iReconnect: int = -1;

        protected _pRemoteAPI: Object = {};

        //контекст, у которого будут вызываться методы
        //при получении REQUEST запросов со стороны сервера
        protected _pContext: any = null;

        inline get remote(): any { return this._pRemoteAPI; }

        constructor (sAddr?: string, pContext?: Object);
        constructor (pAddr: any = null, pContext: Object = null) {
            if (!isNull(pAddr)) {
                this.join(<string>pAddr);
            }
        }

        join(sAddr: string = null): void {
            var pPipe: IPipe = this._pPipe;
            var pRPC: IRPC = this;
            var pDeffered: IRPCRequest[] = this._pDefferedCalls;

            if (isNull(pPipe)) {
                pPipe = net.createPipe();
            }
      
            pPipe.bind(SIGNAL(message), 
                function (pPipe: IPipe, pMessage: any, eType: EPipeDataTypes): void {
                    if (eType !== EPipeDataTypes.BINARY) {
                        pRPC.parse(JSON.parse(<string>pMessage));
                    }
                    else {
                        pRPC.parseBinary(new Uint8Array(pMessage));
                    }
                }
            );

            pPipe.bind(SIGNAL(opened), 
                function (pPipe: IPipe): void {
                    //if we have unhandled call in deffered...
                    if (pDeffered.length) {
                        for (var i: int = 0; i < pDeffered.length; ++ i) {
                            pPipe.write(pDeffered[i]);
                        };

                        pDeffered.clear();
                    }

                    pRPC.proc(RPC.PROC_LIST, 
                        function (pList: string[]) {
                            //TODO: FIX akra. prefix...
                            if (!akra.isNull(pList) && akra.isArray(pList)) {

                                for (var i: int = 0; i < pList.length; ++ i) {
                                    (function (sMethod: string) {
                                        pRPC.remote[sMethod] = function () {

                                            var argv: string[] = [sMethod];

                                            for (var j: int = 0; j < arguments.length; ++ j) {
                                                argv.push(arguments[j]);
                                            }

                                            return pRPC.proc.apply(pRPC, argv);
                                        }
                                    })(String(pList[i]));
                                }
                            }

                            this.joined();
                        }
                    );
                }
            );

            pPipe.bind(SIGNAL(error), 
                function(pPipe: IPipe, pError: Error): void {
                    pRPC.rejoin();
                }
            );

            pPipe.open(<string>sAddr);

            this._pPipe = pPipe;
        }

        rejoin(): void {
            var pRPC: IRPC = this;
            clearTimeout(this._iReconnect);

            if (this._pPipe.isOpened()) {
                return;
            }

            if (this._pPipe.isClosed()) {
                LOG("attempt to reconnecting...");
            }

            this.join();

            this._iReconnect = setTimeout(
                function (): void {
                    pRPC.rejoin();
                },
                RPC.OPTIONS.RECONNECT_TIMEOUT
            );
        }

        parse(pRes: IRPCResponse): void {
            var pStack: ICallback[] = this._pCallbacks;

            if (!isDef(pRes.n)) {
                debug_print(pRes);
                WARNING("message droped, because seriial not recognized.");
            };

            this.response(pRes.n, pRes.type, pRes.res);
        }

        parseBinary(pBuffer: Uint8Array): void {
            var pRes: Uint8Array = pBuffer;
            var nMsg: uint = (new Uint32Array(pBuffer.subarray(0, 4).buffer, 0, 4))[0];
            var eType: ERPCPacketTypes = <ERPCPacketTypes>pBuffer[4];
            var pResult: Uint8Array = new Uint8Array(pBuffer, 8);

            this.response(nMsg, eType, pResult);
        }

        private response(nSerial: uint, eType: ERPCPacketTypes, pResult: any): void {
            var pStack: ICallback[] = this._pCallbacks;

            if (eType === ERPCPacketTypes.RESPONSE) {
                for (var i: int = pStack.length - 1; i >= 0; -- i) {
                    if (pStack[i].n === nSerial) {
                        pStack[i].fn.call(this, pResult);
                        pStack.splice(i, 1);
                        return;
                    }
                }

                WARNING("package droped, invalid serial: " + nSerial);
            }
            else if (eType === ERPCPacketTypes.REQUEST) {
                ERROR("TODO: REQUEST package type temprary unsupported.");
            }
            else if (eType === ERPCPacketTypes.FAILURE) {
                ERROR("detected FAILURE on " + nSerial + " package");
            }
            else {
                ERROR("unsupported response type detected: " + eType);
            }
        }

        free() {
            this._pDefferedCalls = [];
            this._pCallbacks = [];
        }

        proc(...argv: any[]): bool {
       
            var iCallback: int = arguments.length -1;
            var fnCallback: Function = 
                isFunction(arguments[iCallback])? <Function>arguments[iCallback]: null;
            var nArg: uint = arguments.length - (fnCallback? 2: 1);
            var pArgv: any[] = new Array(nArg);
            var pPipe: IPipe = this._pPipe;

            for (var i = 0; i < nArg; ++ i) {
                pArgv[i] = arguments[i + 1];
            }

            var pProc: IRPCRequest = {
                n: this._nCalls ++,
                type: ERPCPacketTypes.REQUEST,
                proc: String(arguments[0]),
                argv: pArgv
            }

            if (!isNull(fnCallback)) {
                this._pCallbacks.push({n: pProc.n, fn: fnCallback});
            }

            if (isNull(pPipe) || !pPipe.isOpened()) {
                this._pDefferedCalls.push(pProc);
                return false;
            }

            return pPipe.write(pProc);
        }

        BEGIN_EVENT_TABLE(RPC);
            BROADCAST(joined, VOID);
        END_EVENT_TABLE();

        static OPTIONS = {
            DEFFERED_CALLS_LIMIT: 1024,
            CALLBACKS_LIMIT     : 2048,
            RECONNECT_TIMEOUT   : 5000
        }

        //имя процедуры, для получения все поддерживаемых процедур
        static PROC_LIST: string = "proc_list";

    }

    export function createRpc(): IRPC {
        return new RPC;
    }
}

#endif
