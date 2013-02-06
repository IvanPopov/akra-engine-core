#ifndef PIPE_TS
#define PIPE_TS

#include "IPipe.ts"
#include "events/events.ts"
#include "util/util.ts"

module akra.net {
	export const WEBSOCKET_PORT = 1337;

	interface IVirualDescriptor {
		onmessage: (pMessage: any) => void;
	}

	class Pipe implements IPipe {
		protected _pAddr: IURI = null;
		protected _nMesg: uint = 0; /** Number of sended messages.*/
		protected _eType: EPipeTypes = EPipeTypes.UNKNOWN;
		protected _pConnect: IVirualDescriptor = null;

		inline get uri(): IURI {
			return util.uri(this._pAddr.toString());
		}

		constructor (sAddr: string = null) {
			if (!isNull(sAddr)) {
				this.open(sAddr);
			}
		}

		open(pAddr?: IURI): bool;
		open(sAddr?: string): bool;
		open(sAddr: any = null): bool {
			var pAddr: IURI;
			var eType: EPipeTypes;
			var pSocket: WebSocket = null;
			var pWorker: Worker = null;
			var pPipe: IPipe = this;

			if (!isNull(sAddr)) {
				pAddr = util.uri(<string>sAddr);
			}
			else {
				if (this.isCreated()) {
					this.close();
				}

				pAddr = this.uri;
			}

			// pipe to websocket
			if (pAddr.protocol.toLowerCase() === "ws") {
				//unknown port
				if (!(pAddr.port > 0)) {
					pAddr.port = WEBSOCKET_PORT;
				}

				//websocket unsupported
				if (!isDefAndNotNull(WebSocket)) {
					ERROR("Your browser does not support websocket api.");
					return false;
				}

				pSocket = new WebSocket(pAddr.toString());
				
				pSocket.onopen = function (): void {
					LOG("created pipe to: " + pAddr.toString());

					pPipe.opened();
				}

				pSocket.onerror = function (pErr: ErrorEvent): void {
					WARNING("pipe error detected: " + pErr.message);
					pPipe.error(pErr);
				}

				pSocket.binaryType = "arraybuffer";
				eType = EPipeTypes.WEBSOCKET;
			}
			else if (util.pathinfo(pAddr.path).ext.toLowerCase() === "js") {
				if (!isDefAndNotNull(Worker)) {
					ERROR("Your browser does not support webworker api.");
					return false;
				}

				pWorker = new Worker(pAddr.toString());
				eType = EPipeTypes.WEBWORKER;
			}
			else {
				ERROR("Pipe supported only websockets/webworkers.");
				return false;
			}

			this._pConnect = pWorker || pSocket;
			this._pAddr = pAddr;
			this._eType = eType;

			if (isDefAndNotNull(window)) {
				window.onunload = function (): void {
					pPipe.close();
				}
			}

			if (!isNull(this._pConnect)) {
				this._pConnect.onmessage = function (pMessage: any): void {
					if (isArrayBuffer(pMessage.data)) {
						pPipe.message(pMessage.data, EPipeDataTypes.BINARY);
					}
					else {
						pPipe.message(pMessage.data, EPipeDataTypes.STRING);
					}
				}

				return true;
			}

			return false;
		}

		close(): void {
			var pSocket: WebSocket;
			var pWorker: Worker;
			if (this.isOpened()) {
		    	switch (this._eType) {
			    	case EPipeTypes.WEBSOCKET:
			    		pSocket = <WebSocket>this._pConnect;
						pSocket.onmessage = null;
				    	pSocket.onerror = null;
				    	pSocket.onopen = null;
						pSocket.close();
						break;
					case EPipeTypes.WEBWORKER:
						pWorker = <Worker>this._pConnect;
						pWorker.terminate();
				}
			}

			this._pConnect = null;
		}	

		write(pValue: any): bool {
			var pSocket: WebSocket;
			var pWorker: Worker;

			if (this.isOpened()) {
				this._nMesg ++;
				
				switch (this._eType) {
			    	case EPipeTypes.WEBSOCKET:
			    		pSocket = <WebSocket>this._pConnect;

						if (isObject(pValue)) {
							pValue = JSON.stringify(pValue);
						}

						pSocket.send(pValue);
						return true;

					case EPipeTypes.WEBWORKER:
						pWorker = <Worker>this._pConnect;
						
						if (isDef(pValue.byteLength)) {
							pWorker.postMessage(pValue, [pValue]);
						}
						else {
							pWorker.postMessage(pValue);	
						}

						return true;
				}
			}

			return false;
		}

		isClosed(): bool {
			switch (this._eType) {
				case EPipeTypes.WEBSOCKET:
					return ((<WebSocket>this._pConnect).readyState === 3);
			}

			return !isNull(this._pConnect);
		}

		isOpened(): bool {
			switch (this._eType) {
				case EPipeTypes.WEBSOCKET:
					return (<WebSocket>this._pConnect).readyState === 1;
			}

			return !isNull(this._pConnect);
		}

		inline isCreated(): bool {
			return !isNull(this._pConnect);
		}

		BEGIN_EVENT_TABLE(Pipe);
			BROADCAST(opened, VOID);
			BROADCAST(closed, VOID);
			BROADCAST(error, CALL(err));
			BROADCAST(message, CALL(data, type));
		END_EVENT_TABLE();
	}

	export function createPipe(sAddr: string = null): IPipe {
		return new Pipe(sAddr);
	}
}

#endif

