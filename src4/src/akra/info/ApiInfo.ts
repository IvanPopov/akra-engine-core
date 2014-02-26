/// <reference path="../idl/IApiInfo.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />
/// <reference path="../common.ts" />
/// <reference path="../util/Singleton.ts" />
/// <reference path="../webgl/webgl.ts" />
/// <reference path="../logger.ts" />

module akra.info {

	import Singleton = util.Singleton;

	window["requestFileSystem"] =
	window["requestFileSystem"] || window["webkitRequestFileSystem"];

	export class ApiInfo extends Singleton<ApiInfo> implements IApiInfo {
		private _bWebAudio: boolean = false;
		private _bFile: boolean = false;
		private _bFileSystem: boolean = false;
		private _bWebWorker: boolean = false;
		private _bTransferableObjects: boolean = false;
		private _bLocalStorage: boolean = false;
		private _bWebSocket: boolean = false;
		private _bGamepad: boolean = false;
		private _bPromise: boolean = false;

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

		getPromise(): boolean {
			return this._bPromise;
		}

		constructor() {
			super();

			this._bWebAudio = (window["AudioContext"] && window["webkitAudioContext"] ? true : false);
			this._bFile = (window["File"] && window["FileReader"] && window["FileList"] && window["Blob"] ? true : false);
			this._bFileSystem = (this._bFile && window["URL"] && window["requestFileSystem"] ? true : false);
			this._bWebWorker = isDef(window["Worker"]);
			this._bLocalStorage = isDef(window["localStorage"]);
			this._bWebSocket = isDef(window["WebSocket"]);
			this._bGamepad = !!navigator["webkitGetGamepads"] || !!navigator["webkitGamepads"] || (navigator.userAgent.indexOf('Firefox/') != -1);
			this._bPromise = isDefAndNotNull(window["Promise"]);
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