/**
 * FIle implementation via <Local filesystem>.
 * ONLY FOR LOCAL FILES!!
 */

#ifndef LOCALFILE_TS
#define LOCALFILE_TS

#include "TFile.ts"
#include "io/files.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"


#define LFS_MAX_SIZE (32 * 1024 * 1024)

#define CHECK_IFNOT_OPEN(method, callback) \
		if (!this.isOpened()) {						\
			var _pArgv: IArguments = arguments;		\
			this.open(function(err) {				\
				if (err) callback(err);				\
				this.method.apply(this, _pArgv);	\
			});										\
			return;									\
		}

module akra.io {

	class LocalFileSystem {
		private _pFileSystem: FileSystem = null;
		private _pCallbackQueue: Function[] = [];

		setFileSystem(pFS: FileSystem): void {
			this._pFileSystem = pFS;
		}

		/**
		 * Инициализация файловой системы.
		 * @tparam Function fnCallback Функция, вызываемая
		 * при успешной(получет в 1ом параметре fs)
		 * инициализации системы.
		 */
		get (fnCallback: Function): void {
			if (this._pFileSystem) {
		        fnCallback(this._pFileSystem);
		        return;
		    }

		    var pFileSystem: LocalFileSystem = this;
		    var pQueue: Function[] = this._pCallbackQueue;

		    pQueue.push(fnCallback);

		    if (pQueue.length > 1) {
		        return;
		    }

    		window.storageInfo.requestQuota(window.TEMPORARY, LFS_MAX_SIZE,
				function (nGrantedBytes: uint) {
					window.requestFileSystem(
						window.TEMPORARY, 
						nGrantedBytes,
						function (pFs: FileSystem) {

						   pFileSystem.setFileSystem(pFs);

						   if (pQueue.length) {
						       for (var i: int = 0; i < pQueue.length; ++i) {
						           pQueue[i](pFs);
						       }
						   }


						}, LocalFileSystem.errorHandler);
				});
		}

		static errorHandler (e: FileError): void {
			var sMesg: string = "init filesystem: ";

	        switch (e.code) {
	            case FileError.QUOTA_EXCEEDED_ERR:
	                sMesg += 'QUOTA_EXCEEDED_ERR';
	                break;
	            case FileError.NOT_FOUND_ERR:
	                sMesg += 'NOT_FOUND_ERR';
	                break;
	            case FileError.SECURITY_ERR:
	                sMesg += 'SECURITY_ERR';
	                break;
	            case FileError.INVALID_MODIFICATION_ERR:
	                sMesg += 'INVALID_MODIFICATION_ERR';
	                break;
	            case FileError.INVALID_STATE_ERR:
	                sMesg += 'INVALID_STATE_ERR';
	                break;
	            default:
	                sMesg += 'Unknown Error';
	                break;
	        }

	        ERROR(sMesg);
		}
	}

	var pLocalFileSystem: LocalFileSystem = new LocalFileSystem;

	export function getFileSystem(fnCallback: (pFileSystem: FileSystem) => void): void {
		pLocalFileSystem.get(fnCallback);
	}

	export class LocalFile implements IFile {
		private _pUri: IURI;
		private _iMode: int;
		
		//File
		private _pFile: File;
		//file reader
		private _pFileReader: FileReader;
		//pointer to file entry in filsystem
		private _pFileEntry: FileEntry;
		
		private _nCursorPosition: uint = 0;

		inline get path(): string {
			ASSERT(isDefAndNotNull(this._pFile), "There is no file handle open.");
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
			ASSERT(isDefAndNotNull(this._pFile), "There is no file handle open.");
        	return this._nCursorPosition; 
		}

		set position(iOffset: uint) {
			ASSERT(isDefAndNotNull(this._pFile), "There is no file handle open.");
			this._nCursorPosition = iOffset;
		}

		inline get byteLength(): uint {
       		return this._pFile? this._pFile.size: 0;
		}


		constructor (sFilename?: string, sMode?: string, fnCallback: Function = LocalFile.defaultCallback);
		constructor (sFilename?: string, iMode?: int, fnCallback: Function = LocalFile.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = LocalFile.defaultCallback) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this.setAndValidateUri(util.uri(sFilename));

			if (arguments.length > 2) {
				this.open(sFilename, sMode, fnCallback);
			}
		}


		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		//open(sFilename: string, sMode: string, fnCallback?: Function): void;
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

		        ASSERT(isDefAndNotNull(this._pUri), "No filename provided.");


		        this.open(this._pUri.toString(), this._iMode, fnCallback);

		        return;
		    }

		    fnCallback = arguments[hasMode ? 2 : 1];
		    fnCallback = fnCallback || LocalFile.defaultCallback;

		    if (this.isOpened()) {
		        WARNING("file already opened: " + this.name);
		        (<Function>fnCallback)(null, this._pFile);
		    }

		    this.setAndValidateUri(util.uri(arguments[0]));

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }

		    var fnFSInited: Function;

		    var pFile: LocalFile = this;
		    var pFileSystem: FileSystem = null;
		    var fnErrorHandler: Function = function (e) {
		        if (e.code == FileError.NOT_FOUND_ERR && CAN_CREATE(pFile.mode)) {
					LocalFile.createDir(
						pFileSystem.root, 
						util.pathinfo(pFile.path).dirname.split('/'),
		                function (e) { 
		                	if (!isNull(e)) { 
		                		fnCallback.call(pFile, e); 
	                		} 
	                		else {
	                			fnFSInited.call(pFile, pFileSystem);
	                		} 			
		                });
		        }
		        else {
		            fnCallback.call(pFile, e);
		        }
		    };

		    fnFSInited = function (pFs: FileSystem) {
		        ASSERT(isDefAndNotNull(pFs), "local file system not initialized");

		        pFileSystem = pFs;
		        pFs.root.getFile(this.path,
		                         {
		                             create:    CAN_CREATE(this._iMode),
		                             exclusive: false
		                         },
		                         function (fileEntry: Entry) {
		                             (<LocalFile>pFile).setFileEntry(<FileEntry>fileEntry);

		                             (<FileEntry>fileEntry).file(function (file: File) {
		                                 (<LocalFile>pFile).setFile(file);

		                                 if (IS_TRUNC(pFile.mode) && pFile.byteLength) {
		                                     pFile.clear(function (err) {
		                                     	if (err) {
		                                     		fnCallback(err);
		                                     	}
		                                     	else {
		                                        	fnCallback.call(pFile, null, file);
		                                        }
		                                     });
		                                     return;
		                                 }

		                                 if (IS_APPEND(pFile.mode)) {
		                                     pFile.position = pFile.byteLength;
		                                 }

		                                 fnCallback.call(pFile, null, file);
		                             }, <ErrorCallback>fnErrorHandler);

		                         },
		                         <ErrorCallback>fnErrorHandler);
		    };

		    getFileSystem(function (pFileSystem: FileSystem) {
		        fnFSInited.call(pFile, pFileSystem);
		    });
		}

		close (): void {
		    this._pUri = null;
		    this._iMode = EIO.IN | EIO.OUT;
		    this._nCursorPosition = 0;
		    this._pFile = null;
		};


		clear(fnCallback: Function = LocalFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(clear, fnCallback);

			ASSERT(isDefAndNotNull(this._pFile), 'There is no file handle open');

		    var pFile: IFile = this;
		    var pFileEntry: FileEntry = this._pFileEntry;

		    pFileEntry.createWriter(
		    	function (pWriter: FileWriter) {
			        pWriter.seek(0);

			        pWriter.onwriteend = function () {
		                fnCallback.call(pFile, null);
		            }

			        pWriter.truncate(0);

			    }, 
			    function (e: FileError) {
			        fnCallback.call(pFile, e);
			    });
		}

		read(fnCallback: Function = LocalFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(read, fnCallback);

		    var pFile: IFile = this;
		    var eTransferMode: EFileTransferModes = this._iMode;

		    ASSERT(CAN_READ(this._iMode), "The file is not readable.");

			var pReader: FileReader = this._pFileReader;
			var pFileObject: File = this._pFile;

		    pReader.onloadend = function (e) {
		        var pData: any = (<any>(e.target)).result;
		        var nPos: uint = pFile.position;

		        if (nPos) {
		            if (IS_BINARY(pFile.mode)) {
		                pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
		            }
		            else {
		                pData = pData.substr(nPos);
		            }
		        }

		        pFile.atEnd();

		        fnCallback.call(pFile, null, pData);
		    };

		    if (IS_BINARY(pFile.mode)) {
		        pReader.readAsArrayBuffer(pFileObject);
		    }
		    else {
		        pReader.readAsText(pFileObject);
		    }
		}

		write(sData: string, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void {
			CHECK_IFNOT_OPEN(write, fnCallback);

		    var pFile: IFile = this;
		    var iMode: int = this._iMode;

		    ASSERT(CAN_WRITE(iMode), "The file is not writable.");

		    sContentType = sContentType || (IS_BINARY(iMode) ? "application/octet-stream" : "text/plain");

		    var pFile: IFile = this;
		    var pFileEntry: FileEntry = this._pFileEntry;

		    pFileEntry.createWriter(function (pWriter: FileWriter) {
		        pWriter.seek(pFile.position);

		        pWriter.onerror = function (e: FileError) {
		            fnCallback.call(pFileEntry, e);
		        }


	            pWriter.onwriteend = function () {
	                if (IS_BINARY(iMode)) {
	                    pFile.seek(pData.byteLength);
	                }
	                else {
	                    pFile.seek(pData.length);
	                }

	                fnCallback.call(pFile, null);
	            };
		        
		        pWriter.write(<Blob>(new (<any>Blob)(pData, {type: sContentType})));

		    }, 
		    function (e: FileError) {
		        fnCallback.call(pFile, e);
		    });
		}


		move(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var pFile: IFile = this;

			this.copy(sFilename, function(err) {
				if (err) {
					fnCallback(err);
					return;
				}

				pFile.remove(fnCallback);
			});
		}

		copy(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var iMode: int = EIO.IN | EIO.OUT | EIO.TRUNC;
		    var pFile: IFile = this;
		    var pFileCopy: IFile;

		    if (IS_BINARY(this._iMode)) {
		        iMode |= EIO.BIN;
		    }

		    pFileCopy = new LocalFile(sFilename, iMode,
		                                     function (err) {
		                                     	if (err) {
		                                     		fnCallback(err);
		                                     	}

		                                        pFile.read(function (pData: ArrayBuffer) {
		                                            pFile.write(pData, fnCallback);
		                                        });
		                                     });
		}

		rename(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var pName: IPathinfo = util.pathinfo(sFilename);

		    ASSERT(!pName.dirname, 'only filename can be specified.');
		    
		    this.move(util.pathinfo(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
		}

		remove(fnCallback: Function = LocalFile.defaultCallback): void {
			CHECK_IFNOT_OPEN(remove, fnCallback);

		    var pFile: IFile = this;
		    this._pFileEntry.remove(
		    <VoidCallback>function () {
		        pFile.close();
		        fnCallback.call(pFile, null);
		    }, <ErrorCallback>fnCallback);
		}

		//return current position
		atEnd(): int {
			this.position = this.byteLength;
			return this._nCursorPosition;
		}
		//return current position;
		seek(iOffset: int): int {
			ASSERT(isDefAndNotNull(this._pFile), "There is no file handle open.");

		    var nSeek: int = this._nCursorPosition + iOffset;
		    if (nSeek < 0) {
		        nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
		    }

		    ASSERT(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

		    this._nCursorPosition = nSeek;

		    return this._nCursorPosition;
		}

		isOpened(): bool {
			return this._pFile !== null;
		}

		isExists(fnCallback: Function): void {
			this.open(function(e: FileError) {
				fnCallback(isNull(e)? true: false);
			});
		}

		isLocal(): bool {
			return true;
		}

		getMetaData(fnCallback: Function): void {
			ASSERT(isDefAndNotNull(this._pFile), 'There is no file handle open.');
		    fnCallback(null, {
		                  lastModifiedDate: this._pFile.lastModifiedDate
		              });
		}

		setFileEntry(pFileEntry: FileEntry): bool {
			if (!isNull(this._pFileEntry)) {
				return false;
			}

			this._pFileEntry = pFileEntry;
			return true;
		}

		setFile(pFile: File): bool {
			if (!isNull(this._pFile)) {
				return false;
			}

			this._pFile = pFile;

			return true;
		}

		private setAndValidateUri(sFilename: IURI);
		private setAndValidateUri(sFilename: string);
		private setAndValidateUri(sFilename: any) {
			var pUri: IURI = util.uri(sFilename);
			var pUriLocal: IURI;

			if (pUri.protocol === "filesystem") {
		        pUriLocal = util.uri(pUri.path);

		        ASSERT(!(pUriLocal.protocol && pUriLocal.host != info.uri.host),
		               "Поддерживаются только локальные файлы в пределах текущего домена.");

		        var pFolders: string[] = pUriLocal.path.split('/');

		        if (pFolders[0] == "" || pFolders[0] == ".") {
		            pFolders = pFolders.slice(1);
		        }
		 
		        ASSERT(pUri.host === "temporary",
		               "Поддерживаются только файловые системы типа \"temporary\".");
		        
		        this._pUri = util.uri(pFolders.join("/"));
		    }
		    else {
		    	ERROR("used non local uri");
			}
		}

		static errorHandler (e: FileError): void {
			var sMesg: string = "";

	        switch (e.code) {
	            case FileError.QUOTA_EXCEEDED_ERR:
	                sMesg += 'QUOTA_EXCEEDED_ERR';
	                break;
	            case FileError.NOT_FOUND_ERR:
	                sMesg += 'NOT_FOUND_ERR';
	                break;
	            case FileError.SECURITY_ERR:
	                sMesg += 'SECURITY_ERR';
	                break;
	            case FileError.INVALID_MODIFICATION_ERR:
	                sMesg += 'INVALID_MODIFICATION_ERR';
	                break;
	            case FileError.INVALID_STATE_ERR:
	                sMesg += 'INVALID_STATE_ERR';
	                break;
	            default:
	                sMesg += 'Unknown Error';
	                break;
	        }

	        ERROR(sMesg);
		}

		static createDir(pRootDirEntry: DirectoryEntry, pFolders: string[], fnCallback) {
		    if (pFolders[0] == "." || pFolders[0] == "") {
		        pFolders = pFolders.slice(1);
		    }

		    pRootDirEntry.getDirectory(
		    	pFolders[0], 
			    { create: true }, 
			    function (dirEntry: Entry) {
			        if (pFolders.length) {
			            LocalFile.createDir(<DirectoryEntry>dirEntry, pFolders.slice(1), fnCallback);
			        }
			        else {
			            fnCallback(null);
			        }
			    }, fnCallback);
		};

		static defaultCallback: Function = function (err) {
			if (err) {
				LocalFile.errorHandler(err);
			}
		}

	}
}

#endif