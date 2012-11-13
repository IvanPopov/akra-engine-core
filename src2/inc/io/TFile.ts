#ifndef TFILE_TS
#define TFILE_TS

#include "IFile.ts"
#include "IThread.ts"
#include "io/files.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"
#include "util/ThreadManager.ts"

#ifndef FTM_DEFAULT_LOCAL_THREAD
#define FTM_DEFAULT_LOCAL_THREAD "LocalFile.t.js"
#endif

#ifndef FTM_DEFAULT_REMOTE_THREAD
#define FTM_DEFAULT_REMOTE_THREAD "RemoteFile.t.js"
#endif

#define LocalFileThreadManager() util.ThreadManager(FTM_DEFAULT_LOCAL_THREAD)
#define RemoteFileThreadManager() util.ThreadManager(FTM_DEFAULT_REMOTE_THREAD)

#define CHECK_IFNOT_OPEN(method, callback) \
		if (!this.isOpened()) {						\
			this.open(function(err) {				\
				if (err) callback(err);				\
				this.method.apply(this, arguments);	\
			});										\
			return;									\
		}

module akra.io {

	export enum EFileActions {
		k_Open = 1,
		k_Read = 2,
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

	export interface IFileCommand {
		act: EFileActions;
		name: string;
		mode: int;
		pos?: uint;
		transfer?: EFileTransferModes;
		data?: any;
		contentType?: string;
	}


	var pLocalFileThreadManager = new LocalFileThreadManager();
	var pRemoteFileThreadManager = new RemoteFileThreadManager();

	export var getLocalFileThreadManager = (): IThreadManager => pLocalFileThreadManager;
	export var getRemoteFileThreadManager = (): IThreadManager => pRemoteFileThreadManager;


	export class TFile implements IFile {
		protected _iMode: int;
		protected _pUri: IURI = null;
		protected _nCursorPosition: uint = 0;
		protected _bOpened: bool = false;
		protected _eTransferMode: EFileTransferModes = EFileTransferModes.k_Normal;
		protected _pFileMeta: IFileMeta = null;
		protected _isLocal: bool = false;


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

		constructor (sFilename?: string, sMode?: string, fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, iMode?: int, fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this.setAndValidateUri(util.uri(sFilename));

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
		            this.setAndValidateUri(util.uri(sFilename));
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
		    fnCallback = fnCallback || TFile.defaultCallback;

		    if (this.isOpened()) {
		        warning("file already opened: " + this.name);
		        (<Function>fnCallback)(null, this._pFileMeta);
		    }

		    this.setAndValidateUri(util.uri(arguments[0]));

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }

		    this.update(function (err) {
		    	if (err) {
		    		debug_warning("file update err", err);
		    		fnCallback.call(pFile, err);
		    		return;
		    	}

		        if (IS_APPEND(this._iMode)) {
		            this.position = this.size;
		        }

		        fnCallback.call(pFile, null, pFile);
		    });
		}

		close(): void {
			this._pUri = null;
			this._iMode = EIO.IN | EIO.OUT;
			this._nCursorPosition = 0;
			this._pFileMeta = null;
		}

		clear(fnCallback: Function = TFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(clear, fnCallback);

			var pCommand: IFileCommand = {
	                                          act:  EFileActions.k_Clear,
	                                          name: this.path,
	                                          mode: this._iMode
	                                      };

			this.execCommand(pCommand, fnCallback);
		}


		read(fnCallback: Function = TFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(read, fnCallback);

		    var pFile: IFile = this;
		    var eTransferMode: EFileTransferModes = this._eTransferMode;

		    assert(CAN_READ(this._iMode), "The file is not readable.");


		    var pCommand: IFileCommand = {
		                     act:      EFileActions.k_Read,
		                     name:     this.path,
		                     mode:     this._iMode,
		                     pos:      this._nCursorPosition,
		                     transfer: this._eTransferMode
		                 };

		    var fnCallbackSystem: Function = function (err, pData) {
				if (err) {
					fnCallback.call(pFile, err);
					return;
				}
				
		        if (eTransferMode == EFileTransferModes.k_Slow && IS_BINARY(this._iMode)) {
		            pData = new Uint8Array(pData).buffer;
		        }

		        pFile.atEnd();

		        fnCallback.call(pFile, null, pData);
		    };

		    this.execCommand(pCommand, fnCallbackSystem);
		}

		write(sData: string, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
			CHECK_IFNOT_OPEN(write, fnCallback);

		    var pFile: IFile = this;
		    var iMode: int = this._iMode;
		    var pCommand: IFileCommand;
			var fnCallbackSystem: Function = function (err, pMeta) {
				if (err) {
					fnCallback.call(pFile, err);
					return;
				}

		    	pFile.position += isString(pData)? pData.length: pData.byteLength;
		    	(<any>pFile)._pFileMeta = <IFileMeta>pMeta;

		    	fnCallback.call(pFile, null, pMeta);
		    };

		    assert(CAN_WRITE(iMode), "The file is not writable.");

		    sContentType = sContentType || (IS_BINARY(iMode)? "application/octet-stream" : "text/plain");

		    pCommand = {
                    act:         EFileActions.k_Write,
                    name:        this.path,
                    mode:        this._iMode,
                    data:        pData,
                    contentType: sContentType,
                    pos:         this._nCursorPosition
                 };

            if (!isString(pData)) {
            	this.execCommand(pCommand, fnCallbackSystem, [pData]);
            }
            else {
            	this.execCommand(pCommand, fnCallbackSystem);
        	}
		}

		move(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var pFile: IFile = this;

			this.copy(sFilename, function(err) {
				if (err) {
					fnCallback(err);
					return;
				}

				pFile.remove(fnCallback);
			});
		}

		copy(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var iMode: int = EIO.IN | EIO.OUT | EIO.TRUNC;
		    var pFile: IFile = this;
		    var pFileCopy: IFile;

		    if (IS_BINARY(this._iMode)) {
		        iMode |= EIO.BIN;
		    }

		    pFileCopy = new TFile(sFilename, iMode,
		                                     function (err) {
		                                     	if (err) {
		                                     		fnCallback(err);
		                                     	}

		                                        pFile.read(function (pData: ArrayBuffer) {
		                                            pFile.write(pData, fnCallback);
		                                        });
		                                     });
		}

		rename(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var pName: IPathinfo = util.pathinfo(sFilename);

		    assert(!pName.dirname, 'only filename can be specified.');
		    
		    this.move(util.pathinfo(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
		}

		remove(fnCallback: Function = TFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(remove, fnCallback);

		    var pFile: IFile = this;
		    var pCommand: IFileCommand = {
		                     act:  EFileActions.k_Remove,
		                     name: this.path,
		                     mode: this._iMode
		                 };
		    var fnCallbackSystem: Function = function (err, pData) {
		        pFile.close();

		        if (isDef(fnCallback)) {
		            fnCallback.call(pFile, err, pData);
		        }
		    }

		    this.execCommand(pCommand, fnCallbackSystem);
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

		isExists(fnCallback: Function): void {
			var pCommand: IFileCommand = {
                                              act:  EFileActions.k_Exists,
                                              name: this.path,
                                              mode: this._iMode
                                          };
			this.execCommand(pCommand, fnCallback);
		}

		inline isLocal(): bool {
			return this._isLocal;
		}
		
		getMetaData(fnCallback: Function): void {
			assert(this._pFileMeta, 'There is no file handle open.');
		    fnCallback(null, {
		                  lastModifiedDate: this._pFileMeta.lastModifiedDate
		              });
		}
		private setAndValidateUri(sFilename: IURI);
		private setAndValidateUri(sFilename: string);
		private setAndValidateUri(sFilename: any) {
			var pUri: IURI = util.uri(sFilename);
			var pUriLocal: IURI;

			if (pUri.protocol === "filesystem") {
		        pUriLocal = util.uri(pUri.path);

		        assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host),
		               "Поддерживаются только локальные файлы в пределах текущего домена.");

		        var pFolders: string[] = pUriLocal.path.split('/');

		        if (pFolders[0] == "" || pFolders[0] == ".") {
		            pFolders = pFolders.slice(1);
		        }
		 
		        assert(pUri.host === "temporary",
		               "Поддерживаются только файловые системы типа \"temporary\".");
		        
		        this._pUri = util.uri(pFolders.join("/"));
		        this._isLocal = true;
		    }
		    else {
		    	this._pUri = pUri;
			}
		}

		private update(fnCallback: Function = TFile.defaultCallback) {
			var pFile: IFile = this;
			var pCommand: IFileCommand = {
                     act:  EFileActions.k_Open,
                     name: this._pUri.toString(),
                     mode: this._iMode
                 };
			var fnCallbackSystem: Function = function (err, pMeta) {
				(<any>pFile)._pFileMeta = <IFileMeta>pMeta;
				fnCallback.call(pFile, err, pFile);
			};

			this.execCommand(pCommand, fnCallbackSystem);
		}

		private execCommand(pCommand: IFileCommand, fnCallback: Function, pTransferables?: any[]): void {
			TFile.execCommand(this.isLocal(), pCommand, fnCallback);
		}

		static defaultCallback: Function = function (err) {
			if (err) {
				throw err;
			}
		}

		private static execCommand(isLocal: bool, pCommand: IFileCommand, fnCallback: Function, pTransferables?: any[]): void {

			var pFile: IFile = this;
			var pManager: IThreadManager = isLocal? getLocalFileThreadManager(): getRemoteFileThreadManager();
			var pThread: IThread = pManager.occupyThread();
 
			pThread.onmessage = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;
				fnCallback.call(pFile, null, e.data);
			}

			pThread.onerror = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;
				fnCallback.call(pFile, e);
			}

			if (isDef(pTransferables)) {
				pThread.send(pCommand, pTransferables);
			}
			else {
				pThread.send(pCommand);
			}
		}

	}
}

#endif