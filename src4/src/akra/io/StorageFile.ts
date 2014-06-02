/// <reference path="../config/config.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../logger.ts" />
/// <reference path="io.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="TFile.ts" />

/**
 * FIle implementation via <Local Storage>.
 * ONLY FOR LOCAL FILES!!
 */


module akra.io {

	export var memoryStorage: IMap<any> = {};

	function size(pData): uint {
		return pData? (isString(pData) ? pData.length : pData.byteLength): 0;
	}

	export class StorageFile extends TFile implements IFile {

		//constructor(sFilename?: string, sMode?: string, cb?: (e: Error, pMeta: IFileMeta) => void);
		//constructor(sFilename?: string, iMode?: int, cb?: (e: Error, pMeta: IFileMeta) => void);
		//constructor(sFilename?: string, sMode?: any, cb?: (e: Error, pMeta: IFileMeta) => void) {
		//	super(sFilename, sMode, cb);
		//}

		clear(cb: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.clear, cb)) {
				return;
			}

			//localStorage.setItem(this.getPath(), "");
			memoryStorage[this.getPath()] = null;

			this._pFileMeta.size = 0;

			cb(null, this);
		}

		read(cb: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.read, cb, arguments)) {
				return;
			}

			//logger.assert(io.canCreate(this._iMode), "The file is not readable.");

			var pData: any = this.readData();
			//var nPos: uint = this._nCursorPosition;

			//if (nPos > 0) {
			//	if (io.isBinary(this._iMode)) {
			//		pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
			//	}
			//	else {
			//		pData = pData.substr(nPos);
			//	}
			//}

			//this.atEnd();

			if (!io.isBinary(this._iMode) && !isString(pData)) {
				pData = conv.abtos(pData);
				this._pFileMeta.size = pData.length;
			}

			if (cb) {
				setTimeout(cb, 1, null, pData);
			}
		}

		write(sData: string, cb?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, cb?: Function, sContentType?: string): void;
		write(pData: any, cb: Function = TFile.defaultCallback, sContentType?: string): void {
			if (this.checkIfNotOpen(this.write, cb, arguments)) {
				return;
			}

			//var iMode: int = this._iMode;
			//var nSeek: uint;
			var pCurrentData: any;

			if (!io.isBinary(this._iMode) && !isString(pData)) {
				pData = conv.abtos(pData);
			}

			this._pFileMeta.size = size(pData);

			//logger.assert(io.canWrite(iMode), "The file is not writable.");

			//sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

			//pCurrentData = this.readData();

			//if (!isString(pCurrentData)) {
			//	pCurrentData = conv.abtos(pCurrentData);
			//}


			

			//nSeek = size(pData);

			//if (!isString(pData)) {
			//	pData = conv.abtos(pData);
			//}

			//pData = (<string>pCurrentData).substr(0, this._nCursorPosition) + (<string>pData) +
			//(<string>pCurrentData).substr(this._nCursorPosition + (<string>pData).length);

			//try {
			//	localStorage.setItem(this.getPath(), pData);
			//}
			//catch (e) {
			//	localStorage.removeItem(this.getPath());
				memoryStorage[this.getPath()] = pData;
				//cb(e);
			//}

			//this._pFileMeta.size = size(pData);
			//this._nCursorPosition += nSeek;


			setTimeout(cb, 1, null);
		}

		isExists(cb: Function = TFile.defaultCallback): void {
			setTimeout(() => {
				cb.call(this, null, /*localStorage.getItem(this.getPath()) != null ||*/ isDef(memoryStorage[this.getPath()]));
			}, 1);
		}

		remove(cb: Function = TFile.defaultCallback): void {			
			//localStorage.removeItem(this.getPath());
			delete memoryStorage[this.getPath()];
			cb.call(this, null);
		}

		private readData(): any {
			//var pFileMeta: IFileMeta = this._pFileMeta;
			var pData: any = /*localStorage[this.getPath()] || */memoryStorage[this.getPath()] || null;
			//var pDataBin: ArrayBuffer;

			//if (pData == null) {
			//	//pData = null;
			//	if (io.canCreate(this._iMode)) {
			//		//localStorage.setItem(this.getPath(), pData);
			//		memoryStorage[this.getPath()] = pData;
			//	}
			//}

			//if (!pData) {
			//	pFileMeta.size = 0;
			//	return pData;
			//}

			//if (io.isBinary(this._iMode)) {
			//	//pDataBin = conv.stoab(pData);
			//	pFileMeta.size = pData.byteLength || 0;
			//	return pData;
			//}
			//else {
			//	pFileMeta.size = pData.length || 0;
			//	return pData;
			//}

			return pData;
		}

		protected update(cb?: Function): void {
			this._pFileMeta = {size: 0, lastModifiedDate: null};
			
			setTimeout(() => { this.readData(); cb.call(this, null, this); }, 1);
		}
	}
}
