/// <reference path="../idl/IApiInfo.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />
/// <reference path="../common.ts" />
/// <reference path="../util/Singleton.ts" />
/// <reference path="../webgl/webgl.ts" />
/// <reference path="../logger.ts" />

module akra.info {

	import Singleton = util.Singleton;

	export class ApiInfo extends Singleton<ApiInfo> implements IApiInfo {
		private _bWebAudio: boolean = false;
		private _bFile: boolean = false;
		private _bFileSystem: boolean = false;
		private _bWebWorker: boolean = false;
		private _bTransferableObjects: boolean = false;
		private _bLocalStorage: boolean = false;
		private _bWebSocket: boolean = false;
		private _bGamepad: boolean = false;

		getWebGL(): boolean {
			return webgl.isEnabled();
		}

		getTransferableObjects(): boolean {
			if (!this._bTransferableObjects) {
				this._bTransferableObjects = (this._bWebWorker && this.chechTransferableObjects() ? true : false);
			}

			return this._bTransferableObjects;
		}

		getFile(): boolean {
			return this._bFile;
		}

		getFileSystem(): boolean {
			return this._bFileSystem;
		}

		getWebAudio(): boolean {
			return this._bWebAudio;
		}

		getWebWorker(): boolean {
			return this._bWebWorker;
		}

		getLocalStorage(): boolean {
			return this._bLocalStorage;
		}

		getWebSocket(): boolean {
			return this._bWebSocket;
		}

		getGamepad(): boolean {
			return this._bGamepad;
		}

		getZip(): boolean {
			return isDefAndNotNull(window["zip"]);
		}

		constructor() {
			super();

			var pApi = {};

			this._bWebAudio = ((<any>window).AudioContext && (<any>window).webkitAudioContext ? true : false);
			this._bFile = ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob ? true : false);
			this._bFileSystem = (this._bFile && (<any>window).URL && (<any>window).requestFileSystem ? true : false);
			this._bWebWorker = isDef((<any>window).Worker);
			this._bLocalStorage = isDef((<any>window).localStorage);
			this._bWebSocket = isDef((<any>window).WebSocket);
			this._bGamepad = !!(<any>navigator).webkitGetGamepads || !!(<any>navigator).webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
		}

		private chechTransferableObjects(): boolean {
			var pBlob: Blob = new Blob(["onmessage = function(e) { postMessage(true); }"], { "type": "text\/javascript" });
			var sBlobURL: string = (<any>window).URL.createObjectURL(pBlob);
			var pWorker: Worker = new Worker(sBlobURL);

			var pBuffer: ArrayBuffer = new ArrayBuffer(1);

			try {
				pWorker.postMessage(pBuffer, [pBuffer]);
			}
			catch (e) {
				logger.log('transferable objects not supported in your browser...');
			}

			pWorker.terminate();

			if (pBuffer.byteLength) {
			return false
		}

			return true;
		}
	}
}