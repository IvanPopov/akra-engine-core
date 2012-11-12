#ifndef FILELOCALSTORAGE_TS
#define FILELOCALSTORAGE_TS

#include "FileThread.ts"
#include "io/file.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"


module akra.io {
	export class FileLocalStorage extends FileThread implements IFile {
		
		constructor (sFilename?: string, sMode?: string, fnCallback: Function = FileThread.defaultCallback);
		constructor (sFilename?: string, iMode?: int, fnCallback: Function = FileThread.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = FileThread.defaultCallback) {
			super(sFilename, sMode, fnCallback);
		}

		clear(fnCallback: Function = FileThread.defaultCallback): void {
			CHECK_IFNOT_OPEN(clear, fnCallback);

			localStorage.setItem(this.path, '');
			this._pFileMeta.size = 0;

			fnCallback(null, this);
		}

		read(fnCallback: Function = FileThread.defaultCallback): void {
			CHECK_IFNOT_OPEN(read, fnCallback);

			assert(CAN_CREATE(this._iMode), "The file is not readable.");

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

		write(sData: string, fnCallback: Function = FileThread.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = FileThread.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = FileThread.defaultCallback, sContentType?: string): void {
			CHECK_IFNOT_OPEN(write, fnCallback);

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
			this._pFileMeta = {};
		    this.readData();
		    fnSuccess.call(null);
		}
	}
}

#endif