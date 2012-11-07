#ifndef FILETHREAD_TS
#define FILETHREAD_TS

#include "IFile.ts"
#include "IThread.ts"
#include "file/file.ts"

module akra.io {

	export enum EFileActions {
		k_Open = 1,
		k_Read,
		k_Write,
		k_Clear,
		k_Exists,
		k_Remove
	};

	export enum EFileTransferModes {
		k_Normal,
		k_Slow,
		k_Fast
	}

	export class FileThread implements IFile {
		private _iMode: int;
		private _pName: IURI;
		private _nSeek: uint = 0;
		private _bOpened: bool = false;
		private _eTransferMode: EFileTransferModes;


		inline get path(): string {
			assert(this._pFile, 'There is no file handle open.');
        	return this._pName.toString();
		}

		name: string;
		mode: int;

		onread: Function;
		onopen: Function;

		position: uint;
		byteLength: uint;

		constructor (sFilename?: string, sMode?: string, fnCallback?: Function);
		constructor (sFilename?: string, iMode?: int, fnCallback?: Function);
		constructor (sFilename?: string, sMode?: any, fnCallback?: Function) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this._pName = util.uri(sFilename) || null;

			if (a.info.api.transferableObjects) {
				this._eTransferMode = EFileTransferModes.k_Fast;
			}
			else if (a.info.browser.sBrowser == "Opera") {
				this._eTransferMode = EFileTransferModes.k_Slow;);
			}
			else {
				this._eTransferMode = EFileTransferModes.k_Normal;
			}
				
			if (arguments.length > 2) {
				this.open(sFilename, sMode, fnCallback);
			}
		}

		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Functionn): void;
		open(iMode: int, fnCallback?: Function): void;
		open(sMode: string, fnCallback?: Function): void;
		open(sFilename: any, iMode?: any, fnCallback?: any): void {
			var hasMode: bool = !isFunction(iMode);

			 if (arguments.length < 3) {
		        if (isString(arguments[0])) {
		            this._pName = util.uri(sFilename);
		            fnCallback = arguments[1];
		        }
		        else if (isInt(arguments[0])) {
		            this._iMode = arguments[0];
		            fnCallback = arguments[1];
		        }
		        else {
		            fnCallback = arguments[0];
		        }

		        assert(this._pName, "No filename provided.");


		        this.open(this._pName, this._iMode, fnCallback);

		        return;
		    }

		    fnCallback = arguments[hasMode ? 2 : 1];


		    if (this.isOpened()) {
		        warning("file already opened: " + this.name);
		        (<Function>fnCallback)(null);
		    }

		    this._pName = util.uri(arguments[0]);

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }


		    this.update(function (err) {
		    	if (err) {
		    		fnCallback(err);
		    	}

		        if (IS_APPEND(this._iMode)) {
		            this.position = this.size;
		        }

		        fnCallback.call(null, this);
		    });
		}


		private getThread(fnCallback?: Function): IThread {
			var pFile: IFile = this;
			var pManager: IThreadManager = getFileThreadManager();
			var pThread: IThread = pManager.occupyThread();
 
			pThread.onmessage = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;

				if (isDef(fnCallback)) {
					fnCallback(null, e.data);
				}
			}

			pThread.onerror = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;

				if (isDef(fnCallback)) {
					fnCallback(e);
				}
			}

			return pThread;
		}



	}
}

#endif FILE_TS