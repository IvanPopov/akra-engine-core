///<reference path="../akra.ts" />

module akra.util {
	export class ApiInfo implements IApiInfo {
		private pApi: Object = null;

		constructor () {
			var pApi = {};

			pApi['webgl'] = (window.WebGLRenderingContext || this.checkWebGL() ? true : false);
			pApi['webAudio'] = (window.AudioContext && window.webkitAudioContext ? true : false);
			pApi['file'] = (window.File && window.FileReader && window.FileList && window.Blob ? true : false);
			pApi['fileSystem'] = (this.file && window.URL && window.requestFileSystem ? true : false);
			pApi['webWorker'] = (typeof(Worker) !== "undefined");
			pApi['transferableObjects'] = (pApi['webWorker'] && this.chechTransferableObjects() ? true : false);
			pApi['localStorage'] = (typeof(localStorage) !== 'undefined');
			pApi['webSocket'] = (typeof(window.WebSocket) !== 'undefined');
		}	
	}
}

