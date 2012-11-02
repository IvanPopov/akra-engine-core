#ifndef IAPIINFO_TS
#define IAPIINFO_TS

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

#endif