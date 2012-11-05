#ifndef APIINFO_TS
#define APIINFO_TS

#include "IApiInfo.ts"
#include "Singleton.ts"

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

		get webGL(): bool {
			if (!this.bWebGL) {
				this.bWebGL = ((<any>window).WebGLRenderingContext || this.checkWebGL() ? true : false);
			}

			return this.bWebGL;
		}		

		get transferableObjects(): bool {
			if (!this.bTransferableObjects) {
				this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
			}

			return this.bTransferableObjects;
		}

		get file(): bool {
			return this.bFile;
		}

		get fileSystem(): bool {
			return this.bFileSystem;
		}

		get webAudio(): bool {
			return this.bWebAudio;
		}

		get webWorker(): bool {
			return this.bWebWorker;
		}

		get localStorage(): bool {
			return this.bLocalStorage;
		}

		get webSocket(): bool {
			return this.bWebSocket;
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
		}	

		private checkWebGL(): bool {
			var pCanvas: HTMLCanvasElement;
			var pDevice: WebGLRenderingContext;
			
			try {
				pCanvas = <HTMLCanvasElement> document.createElement('canvas');
				pDevice = pCanvas.getContext('webgl', {}) ||
                       		pCanvas.getContext('experimental-webgl', {});

                if (pDevice) {
                	return true;
                }
			} 
			catch (e) {}

			return false;
		}

		private chechTransferableObjects(): bool {
			var pBlob: Blob = new Blob(["onmessage = function(e) { postMessage(true); }"]);
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