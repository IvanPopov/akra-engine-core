///<reference path="akra.ts" />

module akra {
	export interface IApiInfo {
		webGL: bool;
		webAudio: bool;
		file: bool;
		fileSystem: bool;
		webWorker: bool;
		transferableObjects: bool;
		localStorage: bool;
		webSocket: bool;
	}
}
