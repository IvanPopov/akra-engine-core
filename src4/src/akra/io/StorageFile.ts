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

	export class StorageFile extends TFile implements IFile {

		constructor(sFilename?: string, sMode?: string, fnCallback?: Function);
		constructor(sFilename?: string, iMode?: int, fnCallback?: Function);
		constructor(sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
			super(sFilename, sMode, fnCallback);
			console.log("new StorageFile(", arguments, ")");
		}

		clear(fnCallback: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.clear, fnCallback)) {
				return;
			}

			localStorage.setItem(this.getPath(), "");
			this._pFileMeta.size = 0;

			fnCallback(null, this);
		}

		read(fnCallback: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.read, fnCallback)) {
				return;
			}

			logger.assert(io.canCreate(this._iMode), "The file is not readable.");

			var pData: any = this.readData();
			var nPos: uint = this._nCursorPosition;

			if (nPos > 0) {
				if (io.isBinary(this._iMode)) {
					pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
				}
				else {
					pData = pData.substr(nPos);
				}
			}

			this.atEnd();

			if (fnCallback) {
				fnCallback.call(this, null, pData);
			}
		}

		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
			if (this.checkIfNotOpen(this.write, fnCallback)) {
				return;
			}

			var iMode: int = this._iMode;
			var nSeek: uint;
			var pCurrentData: any;

			logger.assert(io.canWrite(iMode), "The file is not writable.");

			sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

			pCurrentData = this.readData();

			if (!isString(pCurrentData)) {
				pCurrentData = conv.abtos(pCurrentData);
			}

			nSeek = (isString(pData) ? pData.length : pData.byteLength);

			if (!isString(pData)) {
				pData = conv.abtos(pData);
			}

			pData = (<string>pCurrentData).substr(0, this._nCursorPosition) + (<string>pData) +
			(<string>pCurrentData).substr(this._nCursorPosition + (<string>pData).length);

			try {
				localStorage.setItem(this.getPath(), pData);
			}
			catch (e) {
				fnCallback(e);
			}

			this._pFileMeta.size = pData.length;
			this._nCursorPosition += nSeek;

			fnCallback(null);
		}

		isExists(fnCallback: Function = TFile.defaultCallback): void {
			fnCallback.call(this, null, localStorage.getItem(this.getPath()) == null);
		}

		remove(fnCallback: Function = TFile.defaultCallback): void {
			localStorage.removeItem(this.getPath());
			fnCallback.call(this, null);
		}

		private readData(): any {
			var pFileMeta: IFileMeta = this._pFileMeta;
			var pData: string = localStorage.getItem(this.getPath());
			var pDataBin: ArrayBuffer;

			if (pData == null) {
				pData = "";
				if (io.canCreate(this._iMode)) {
					localStorage.setItem(this.getPath(), pData);
				}
			}


			if (io.isBinary(this._iMode)) {
				pDataBin = conv.stoab(pData);
				pFileMeta.size = pDataBin.byteLength;
				return pDataBin;
			}
			else {
				pFileMeta.size = pData.length;
				return pData;
			}

			//return null;
		}

		protected update(fnCallback?: Function): void {
			this._pFileMeta = null;
			this.readData();
			fnCallback.call(this, null);
		}
	}
}
