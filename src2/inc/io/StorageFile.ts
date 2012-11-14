/**
 * FIle implementation via <Local Storage>.
 * ONLY FOR LOCAL FILES!!
 */

#ifndef STORAGEFILE_TS
#define STORAGEFILE_TS

#include "TFile.ts"
#include "io/files.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"


module akra.io {
	export class StorageFile extends TFile implements IFile {
		
		constructor (sFilename?: string, sMode?: string, fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, iMode?: int, fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
			super(sFilename, sMode, fnCallback);
		}

		clear(fnCallback: Function = TFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(clear, fnCallback);

			localStorage.setItem(this.path, "");
			this._pFileMeta.size = 0;

			fnCallback(null, this);
		}

		read(fnCallback: Function = TFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(read, fnCallback);

			ASSERT(CAN_CREATE(this._iMode), "The file is not readable.");

		    var pData: any = this.readData();   
		    var nPos: uint = this._nCursorPosition;

		    if (nPos) {
		        if (IS_BINARY(this._iMode)) {
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

		write(sData: string, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
			CHECK_IFNOT_OPEN(write, fnCallback);

			var iMode: int = this._iMode;
			var nSeek: uint;
			var pCurrentData: any;

		    ASSERT(CAN_WRITE(iMode), "The file is not writable.");

		    sContentType = sContentType || (IS_BINARY(iMode) ? "application/octet-stream" : "text/plain");

		    pCurrentData = this.readData();

		    if (!isString(pCurrentData)) {
		        pCurrentData = util.abtos(pCurrentData);
		    }

		    nSeek = (isString(pData) ? pData.length : pData.byteLength);

		    if (!isString(pData)) {
		        pData = util.abtos(pData);
		    }

		    pData = (<string>pCurrentData).substr(0, this._nCursorPosition) + (<string>pData) + 
		    	(<string>pCurrentData).substr(this._nCursorPosition + (<string>pData).length);

		    try {
		        localStorage.setItem(this.path, pData);
		    }
		    catch (e) {
		       fnCallback(e);
		    }

		    this._pFileMeta.size = pData.length;
		    this._nCursorPosition += nSeek;

		    fnCallback(null);
		}

		isExists(fnCallback: Function = TFile.defaultCallback): void {
			fnCallback.call(this, null, localStorage.getItem(this.path) == null);
		}

		remove(fnCallback: Function = TFile.defaultCallback): void {
			localStorage.removeItem(this.path);
    		fnCallback.call(this, null);
		}

		private readData(): any {
			var pFileMeta: IFileMeta = this._pFileMeta;
		    var pData: string = localStorage.getItem(this.path);
		    var pDataBin: ArrayBuffer;

		    if (pData == null) {
		        pData = "";
		        if (CAN_CREATE(this._iMode)) {
		            localStorage.setItem(this.path, pData);
		        }
		    }


		    if (IS_BINARY(this._iMode)) {
		        pDataBin = util.stoab(pData);
		        pFileMeta.size = pDataBin.byteLength;
		        return pDataBin;
		    }
		    else {
		        pFileMeta.size = pData.length;
		        return pData;
		    }

		    return null;
		}

		private update(fnCallback: Function): void {
			this._pFileMeta = null;
		    this.readData();
		    fnCallback.call(this, null);
		}
	}
}

#endif