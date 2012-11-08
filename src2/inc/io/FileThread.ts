#ifndef FILETHREAD_TS
#define FILETHREAD_TS

#include "IFile.ts"
#include "IThread.ts"
#include "io/file.ts"
#include "FileThreadManager.ts"
#include "bf/bitflags.ts"

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
		private _pUri: IURI;
		private _nCursorPosition: uint = 0;
		private _bOpened: bool = false;
		private _eTransferMode: EFileTransferModes = EFileTransferModes.k_Normal;
		private _pFileMeta: IFileMeta = null;


		inline get path(): string {
			assert(this._pFileMeta, "There is no file handle open.");
        	return this._pUri.toString();
		}

		inline get name(): string {
			return util.pathinfo(this._pUri.path).basename;
		}

		inline get mode(): int {
			return this._iMode;
		}

		//set mode(sMode: string);
		//set mode(iMode: int);
		set mode(sMode: any) {
			this._iMode = isString(sMode)? filemode(sMode): sMode;
		}

		inline set onread(fnCallback: Function) {
			this.read(fnCallback);
		}

		inline set onopen(fnCallback: Function) {
			this.open(fnCallback);
		}

		inline get position(): uint {
			assert(this._pFileMeta, 'There is no file handle open.');
        	return this._nCursorPosition; 
		}

		set position(iOffset: uint) {
			assert(this._pFileMeta, 'There is no file handle open.');
			this._nCursorPosition = iOffset;
		}

		inline get byteLength(): uint {
       	 return this._pFileMeta? this._pFileMeta.size: 0;
		}

		constructor (sFilename?: string, sMode?: string, fnCallback?: Function);
		constructor (sFilename?: string, iMode?: int, fnCallback?: Function);
		constructor (sFilename?: string, sMode?: any, fnCallback?: Function) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this._pUri = util.uri(sFilename) || null;

			if (info.api.transferableObjects) {
				this._eTransferMode = EFileTransferModes.k_Fast;
			}
			else if (info.browser.name == "Opera") {
				this._eTransferMode = EFileTransferModes.k_Slow;
			}
				
			if (arguments.length > 2) {
				this.open(sFilename, sMode, fnCallback);
			}
		}

		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode: int, fnCallback?: Function): void;
		open(fnCallback?: Function): void;
		open(sFilename?: any, iMode?: any, fnCallback?: any): void {
			var pFile: IFile = this;
			var hasMode: bool = !isFunction(iMode);

			 if (arguments.length < 3) {
		        if (isString(arguments[0])) {
		            this._pUri = util.uri(sFilename);
		            fnCallback = arguments[1];
		        }
		        else if (isInt(arguments[0])) {
		            this._iMode = arguments[0];
		            fnCallback = arguments[1];
		        }
		        else {
		            fnCallback = arguments[0];
		        }

		        assert(this._pUri, "No filename provided.");


		        this.open(this._pUri.toString(), this._iMode, fnCallback);

		        return;
		    }

		    fnCallback = arguments[hasMode ? 2 : 1];


		    if (this.isOpened()) {
		        warning("file already opened: " + this.name);
		        (<Function>fnCallback)(null, this._pFileMeta);
		    }

		    this._pUri = util.uri(arguments[0]);

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }

		    this.update(function (err) {
		    	if (err) {
		    		debug_warning("file update err", err);
		    		if (isDef(fnCallback)) {
		    			fnCallback.call(pFile, err);
		    		}

		    		return;
		    	}

		        if (IS_APPEND(this._iMode)) {
		            this.position = this.size;
		        }

		        if (isDef(fnCallback)) {
		        	fnCallback.call(pFile, null, pFile);
		        }
		    });
		}

		close(): void {
			this._pUri = null;
			this._iMode = EIO.IN | EIO.OUT;
			this._nCursorPosition = 0;
			this._pFileMeta = null;
		}

		clear(fnCallback?: Function): void {
			if (!this.touch(this.clear, arguments)) return;

			this.getThread(fnCallback).send({
                                              act:  EFileActions.k_Clear,
                                              name: this.path,
                                              mode: this._iMode
                                          });
		}


		read(fnCallback?: Function): void {
			if (!this.touch(this.read, arguments)) return;

		    var pFile: IFile = this;
		    var eTransferMode: EFileTransferModes = this._eTransferMode;
			var pThread: IThread = this.getThread(function (err, pData) {
				if (err) {
					if (isDef(fnCallback)) {
						fnCallback.call(pFile, err);
					}

					return;
				}

		        if (eTransferMode == EFileTransferModes.k_Slow && IS_BINARY(this._iMode)) {
		            pData = new Uint8Array(pData).buffer;
		        }

		        pFile.atEnd();

		        if (isDef(fnCallback)) {
		        	fnCallback.call(pFile, null, pData);
		        }
		    });

		    assert(CAN_READ(this._iMode), "The file is not readable.");


		    pThread.send({
		                     act:      EFileActions.k_Read,
		                     name:     this.path,
		                     mode:     this._iMode,
		                     pos:      this._nCursorPosition,
		                     transfer: this._eTransferMode
		                 });
		}

		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		write(pData: any, fnCallback?: Function, sContentType?: string): void {
			if (!this.touch(this.write, arguments)) return;

		    var pFile: IFile = this;
		    var iMode: int = this._iMode;
			var pThread: IThread = this.getThread(function (err, pMeta) {
				if (err) {
					if (isDef(fnCallback)) {
						fnCallback.call(pFile, err);
					}

					return;
				}

		    	pFile.position += isString(pData)? pData.length: pData.byteLength;
		    	(<any>pFile)._pFileMeta = <IFileMeta>pMeta;

		    	if (isDef(fnCallback)) {
		    		fnCallback.call(pFile, null, pMeta);
		    	}
		    });

		    assert(CAN_WRITE(iMode), "The file is not writable.");


		    sContentType = sContentType || (IS_BINARY(iMode)? "application/octet-stream" : "text/plain");

		    pThread.send({
                     act:         EFileActions.k_Write,
                     name:        this.path,
                     mode:        this._iMode,
                     data:        pData,
                     contentType: sContentType,
                     pos:         this._nCursorPosition
                 });
		}

		move(sFilename: string, fnCallback?: Function): void {
			var pFile: IFile = this;

			this.copy(sFilename, function(err) {
				if (err) {
					if (isDef(fnCallback)) {
						fnCallback(err);
					}

					return;
				}

				pFile.remove(fnCallback);
			});
		}

		copy(sFilename: string, fnCallback?: Function): void {
			var iMode: int = EIO.IN | EIO.OUT | EIO.TRUNC;
		    
		    if (IS_BINARY(this._iMode)) {
		        iMode |= EIO.BIN;
		    }

		    var pFile: IFile = this;
		    var pFileCopy: IFile = new FileThread(sFilename, iMode,
		                                     function (err) {
		                                     	if (err) {
		                                     		debug_warning("file copy error occured.", err);
		                                     		if (isDef(fnCallback)) {
		                                     			fnCallback(err);
		                                     		}
		                                     	}

		                                        pFile.read(function (pData: ArrayBuffer) {
		                                            pFile.write(pData, fnCallback);
		                                        });

		                                     });
		}

		rename(sFilename: string, fnCallback?: Function): void {
			var pName: IPathinfo = util.pathinfo(sFilename);

		    assert(!pName.dirname, 'only filename can be specified.');
		    
		    this.move(util.pathinfo(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
		}

		remove(fnCallback?: Function): void {
			if (!this.touch(this.remove, arguments)) return;

		    var pFile: IFile = this;
		    var pThread: IThread = this.getThread(function (err, pData) {
		        pFile.close();
		        if (isDef(fnCallback)) {
		            fnCallback.call(pFile, err, pData);
		        }
		    });

		    pThread.send({
		                     act:  EFileActions.k_Remove,
		                     name: this.path,
		                     mode: this._iMode
		                 });
		}

		//return current position
		atEnd(): int {
			this.position = this.byteLength;
			return this._nCursorPosition;
		}
		//return current position;
		seek(iOffset: int): int {
			assert(this._pFileMeta, "There is no file handle open.");

		    var nSeek: int = this._nCursorPosition + iOffset;
		    if (nSeek < 0) {
		        nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
		    }

		    assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

		    this._nCursorPosition = nSeek;

		    return this._nCursorPosition;
		}

		isOpened(): bool {
			return this._pFileMeta !== null;
		}

		isExists(fnCallback?: Function): void {
			this.getThread(fnCallback).send({
                                              act:  EFileActions.k_Exists,
                                              name: this.path,
                                              mode: this._iMode
                                          });
		}

		inline isLocal(): bool {
			return (this._pUri.protocol == "filesystem");
		}
		
		getMetaData(fnCallback: Function): void {
			return;
		}

		private touch(fnWrapper: Function, pArgv: IArguments) {
			var pFile: IFile = this;
			if (!this.isOpened()) {
				this.open(function(err) {
					if (err) {
						if (pArgv.length) {
							(<Function>pArgv[0]).call(pFile, err);
						}
					}

					fnWrapper.apply(pFile, pArgv);
				});

				return false;
			}

			return true;
		}

		private update(fnCallback: Function) {
			var pFile: IFile = this;
			var pThread: IThread = this.getThread(function (err, pMeta) {
				(<any>pFile)._pFileMeta = <IFileMeta>pMeta;
				fnCallback.call(pFile, err, pFile);
			});

			pThread.send({
                     act:  EFileActions.k_Open,
                     name: this._pUri.toString(),
                     mode: this._iMode
                 });
		}

		private getThread(fnCallback?: Function): IThread {
			return FileThread.getThread(this.isLocal(), fnCallback);
		}

		private static getThread(isLocal: bool = true, fnCallback?: Function): IThread {

			var pFile: IFile = this;
			var pManager: IThreadManager = isLocal? getLocalFileThreadManager(): getRemoteFileThreadManager();
			var pThread: IThread = pManager.occupyThread();
 
			pThread.onmessage = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;

				if (isDef(fnCallback)) {
					fnCallback.call(pFile, null, e.data);
				}
			}

			pThread.onerror = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;
				if (isDef(fnCallback)) {
					fnCallback.call(pFile, e);
				}
			}

			return pThread;
		}



	}
}

#endif