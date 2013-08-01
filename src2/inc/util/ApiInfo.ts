#ifndef APIINFO_TS
#define APIINFO_TS

#include "IApiInfo.ts"
#include "Singleton.ts"
#include "webgl/WebGL.ts"
#include "zip.d.ts"

module akra.util {
	export class ApiInfo extends Singleton implements IApiInfo {
		private bWebGL: bool = false;
		private bWebAudio: bool = false;
		private bFile: bool = false;
		private bFileSystem: bool = false;
		private bWebWorker: bool = false;
		private bTransferableObjects: bool = false;
		private bLocalStorage: bool = false;
		private bWebSocket: bool = false;
		private bGamepad: bool = false;
		private bZip: bool = false;

		inline get webGL(): bool {
			return webgl.isEnabled();
		}		

		get transferableObjects(): bool {
			if (!this.bTransferableObjects) {
				this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
			}

			return this.bTransferableObjects;
		}

		inline get file(): bool {
			return this.bFile;
		}

		inline get fileSystem(): bool {
			return this.bFileSystem;
		}

		inline get webAudio(): bool {
			return this.bWebAudio;
		}

		inline get webWorker(): bool {
			return this.bWebWorker;
		}

		inline get localStorage(): bool {
			return this.bLocalStorage;
		}

		inline get webSocket(): bool {
			return this.bWebSocket;
		}

		inline get gamepad(): bool {
			return this.bGamepad;
		}

		inline get zip(): bool {
			return this.bZip;
		}

		constructor () {
			super();

			var pApi = {};

			this.bWebAudio = ((<any>window).AudioContext && (<any>window).webkitAudioContext ? true : false);
			this.bFile = ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob ? true : false);
			this.bFileSystem = (this.bFile && (<any>window).URL && (<any>window).requestFileSystem ? true : false);
			this.bWebWorker = isDef((<any>window).Worker);
			this.bLocalStorage = isDef((<any>window).localStorage);
			this.bWebSocket = isDef((<any>window).WebSocket);
			this.bGamepad = !! (<any>navigator).webkitGetGamepads || !! (<any>navigator).webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
			this.bZip = isDefAndNotNull(window["zip"]);
		}	

		private chechTransferableObjects(): bool {
			var pBlob: Blob = new Blob(["onmessage = function(e) { postMessage(true); }"], { "type" : "text\/javascript" });
			var sBlobURL: string = (<any>window).URL.createObjectURL(pBlob);
			var pWorker: Worker = new Worker(sBlobURL);

			var pBuffer: ArrayBuffer = new ArrayBuffer(1);

		    try {
		        pWorker.postMessage(pBuffer, [pBuffer]);
		    }
		    catch (e) {
		        debug_print('transferable objects not supported in your browser...');
		    }

		    pWorker.terminate();

		    if (pBuffer.byteLength) {
		        return false
		    }

		    return true;
		}
	}
}

#endif