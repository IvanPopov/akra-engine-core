/// <reference path="../idl/IFile.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../logger.ts" />
/// <reference path="io.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../math/math.ts" />

/**
 * FIle implementation via <Local filesystem>.
 * ONLY FOR LOCAL FILES!!
 */

module akra.io {
	var pLocalFs: FileSystem = null;
	var pLocalFsWaiters: Function[] = [];

	function errorHandler(e: FileError): void {
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

		logger.error(sMesg);
	}

	function setupFileSystem(fnCallback: Function): void {
		if (pLocalFs) {
			fnCallback(pLocalFs);
			return;
		}

		pLocalFsWaiters.push(fnCallback);

		if (pLocalFsWaiters.length > 1) {
			return;
		}

		window.storageInfo.requestQuota(window.TEMPORARY, config.io.local.filesystemLimit || 33554432,
			(nGrantedBytes: uint) => {
				window.requestFileSystem(window.TEMPORARY, nGrantedBytes, (pFs: FileSystem) => {
					pLocalFs = pFs;

					if (pLocalFsWaiters.length) {
						for (var i: int = 0; i < pLocalFsWaiters.length; ++i) {
							pLocalFsWaiters[i](pFs);
						}
					}
				}, errorHandler);
			});
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


		getPath(): string {
			logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
			return this._pUri.toString();
		}

		getName(): string {
			return path.parse(this._pUri.getPath()).getBaseName();
		}

		getMeta(): IFileMeta {
			return null;
		}

		getByteLength(): uint {
			return this._pFile ? this._pFile.size : 0;
		}

		getMode(): int {
			return this._iMode;
		}

		setMode(sMode: string): void;
		setMode(iMode: int): void;
		setMode(sMode: any): void {
			this._iMode = isString(sMode) ? io.filemode(<any>sMode) : sMode;
		}

		setOnRead(fnCallback: (e: Error, data: any) => void): void {
			this.read(fnCallback);
		}

		setOnOpen(fnCallback: Function): void {
			this.open(fnCallback);
		}

		getPosition(): uint {
			logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
			return this._nCursorPosition;
		}

		setPosition(iOffset: uint): void {
			logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
			this._nCursorPosition = iOffset;
		}


		constructor(sFilename?: string, sMode?: string, fnCallback?: Function);
		constructor(sFilename?: string, iMode?: int, fnCallback?: Function);
		constructor(sFilename?: string, sMode?: any, fnCallback: Function = LocalFile.defaultCallback) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
			}

			this.setAndValidateUri(uri.parse(sFilename));

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
			var hasMode: boolean = !isFunction(iMode);

			if (arguments.length < 3) {
				if (isString(arguments[0])) {
					this.setAndValidateUri(uri.parse(sFilename));
					fnCallback = arguments[1];
				}
				else if (isInt(arguments[0])) {
					this._iMode = arguments[0];
					fnCallback = arguments[1];
				}
				else {
					fnCallback = arguments[0];
				}

				logger.assert(isDefAndNotNull(this._pUri), "No filename provided.");

				this.open(this._pUri.toString(), this._iMode, fnCallback);
				return;
			}

			fnCallback = arguments[hasMode ? 2 : 1];
			fnCallback = fnCallback || LocalFile.defaultCallback;

			if (this.isOpened()) {
				logger.warn("file already opened: " + this.getName());
				(<Function>fnCallback)(null, this._pFile);
			}

			this.setAndValidateUri(uri.parse(arguments[0]));

			if (hasMode) {
				this._iMode = (isString(arguments[1]) ? io.filemode(<string>arguments[1]) : arguments[1]);
			}

			var fnFSInited: Function;
			var pFileSystem: FileSystem = null;
			var fnErrorHandler: Function = function (e) {
				if (e.code == FileError.NOT_FOUND_ERR && io.canCreate(this.mode)) {
					LocalFile.createDir(
						pFileSystem.root,
						path.parse(this.path).getDirName().split('/'),
						function (e) {
							if (!isNull(e)) {
								fnCallback.call(this, e);
							}
							else {
								fnFSInited.call(this, pFileSystem);
							}
						});
				}
				else {
					fnCallback.call(this, e);
				}
			}

		fnFSInited = function (pFs: FileSystem) {
				logger.assert(isDefAndNotNull(pFs), "local file system not initialized");

				pFileSystem = pFs;
				pFs.root.getFile(this.path,
					{
						create: io.canCreate(this._iMode),
						exclusive: false
					},
					function (fileEntry: FileEntry) {
						this.setFileEntry(<FileEntry>fileEntry);
						fileEntry.file((file: File) => {
							this.setFile(file);

							if (io.isTrunc(this.mode) && this.byteLength) {
								this.clear((err) => {
									if (err) {
										fnCallback(err);
									}
									else {
										fnCallback.call(this, null, file);
									}
								});
								return;
							}

							if (io.isAppend(this.mode)) {
								this.position = this.byteLength;
							}

							fnCallback.call(this, null, file);
						}, <ErrorCallback>fnErrorHandler);

					},
					<ErrorCallback>fnErrorHandler);
			}

		//gete file system
		setupFileSystem((pFileSystem: FileSystem) => {
				fnFSInited(pFileSystem);
			});
		}

		close(): void {
			this._pUri = null;
			this._iMode = EIO.IN | EIO.OUT;
			this._nCursorPosition = 0;
			this._pFile = null;
		}

		private checkIfNotOpen(method: Function, callback: Function): boolean {
			if (!this.isOpened) {
				var argv: IArguments = arguments;
				this.open((e) => {
					if (e) {
						if (callback) {
							callback(e);
						}
					}

					method.apply(this, argv);
				});

				return true;
			}

			return false;
		}


		clear(fnCallback: Function = LocalFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.clear, fnCallback)) {
				return;
			}

			logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open');

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

		read(fnCallback: (e: Error, data: any) => void = <any>LocalFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.read, fnCallback)) {
				return;
			}

			logger.assert(io.canRead(this._iMode), "The file is not readable.");

			var pReader: FileReader = this._pFileReader;
			var pFileObject: File = this._pFile;

			pReader.onloadend = function (e) {
				var pData: any = (<any>(e.target)).result;
				var nPos: uint = this.position;

				if (nPos > 0) {
					if (io.isBinary(this.mode)) {
						pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
					}
					else {
						pData = pData.substr(nPos);
					}
				}

				this.atEnd();

				fnCallback.call(this, null, pData);
			}

		if (io.isBinary(this.getMode())) {
				pReader.readAsArrayBuffer(pFileObject);
			}
			else {
				pReader.readAsText(pFileObject);
			}
		}

		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		write(pData: any, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void {
			if (this.checkIfNotOpen(this.write, fnCallback)) {
				return;
			}

			var pFile: IFile = this;
			var iMode: int = this._iMode;

			logger.assert(io.canWrite(iMode), "The file is not writable.");

			sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

			var pFile: IFile = this;
			var pFileEntry: FileEntry = this._pFileEntry;

			pFileEntry.createWriter(function (pWriter: FileWriter) {
				pWriter.seek(pFile.getPosition());

				pWriter.onerror = function (e: FileError) {
					fnCallback.call(pFileEntry, e);
				}


				pWriter.onwriteend = function () {
					if (io.isBinary(iMode)) {
						pFile.seek(pData.byteLength);
					}
					else {
						pFile.seek(pData.length);
					}

					fnCallback.call(pFile, null);
				}

			pWriter.write(<Blob>(new (<any>Blob)(pData, { type: sContentType })));

			},
				function (e: FileError) {
					fnCallback.call(pFile, e);
				});
		}


		move(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var pFile: IFile = this;

			this.copy(sFilename, function (err) {
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

			if (io.isBinary(this._iMode)) {
				iMode |= EIO.BIN;
			}

			pFileCopy = new LocalFile(sFilename, iMode, (e: Error): void => {
				if (e) fnCallback(e);
				pFile.read((e: Error, pData: ArrayBuffer): void => {
					pFile.write(pData, fnCallback);
				});
			});
		}

		rename(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var pName: IPathinfo = path.parse(sFilename);

			logger.assert(!pName.getDirName(), 'only filename can be specified.');

			this.move(path.parse(this._pUri.getPath()).getDirName() + "/" + pName.getBaseName(), fnCallback);
		}

		remove(fnCallback: Function = LocalFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.remove, fnCallback)) {
				return;
			}

			var pFile: IFile = this;
			this._pFileEntry.remove(
				<VoidCallback>function () {
					pFile.close();
					fnCallback.call(pFile, null);
				}, <ErrorCallback>fnCallback);
		}

		//return current position
		atEnd(): int {
			this.setPosition(this.getByteLength());
			return this._nCursorPosition;
		}
		//return current position;
		seek(iOffset: int): int {
			logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");

			var nSeek: int = this._nCursorPosition + iOffset;
			if (nSeek < 0) {
				nSeek = this.getByteLength() - (math.abs(nSeek) % this.getByteLength());
			}

			logger.assert(nSeek >= 0 && nSeek <= this.getByteLength(), "Invalid offset parameter");

			this._nCursorPosition = nSeek;

			return this._nCursorPosition;
		}

		isOpened(): boolean {
			return this._pFile !== null;
		}

		isExists(fnCallback: Function): void {
			this.open(function (e: FileError) {
				fnCallback(isNull(e) ? true : false);
			});
		}

		isLocal(): boolean {
			return true;
		}

		getMetaData(fnCallback: Function): void {
			logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open.');
			fnCallback(null, {
				lastModifiedDate: this._pFile.lastModifiedDate
			});
		}

		setFileEntry(pFileEntry: FileEntry): boolean {
			if (!isNull(this._pFileEntry)) {
				return false;
			}

			this._pFileEntry = pFileEntry;
			return true;
		}

		setFile(pFile: File): boolean {
			if (!isNull(this._pFile)) {
				return false;
			}

			this._pFile = pFile;

			return true;
		}

		private setAndValidateUri(sFilename: IURI);
		private setAndValidateUri(sFilename: string);
		private setAndValidateUri(sFilename: any) {
			var pUri: IURI = uri.parse(sFilename);
			var pUriLocal: IURI;

			if (pUri.getProtocol() === "filesystem") {
				pUriLocal = uri.parse(pUri.getPath());

				logger.assert(!(pUriLocal.getProtocol() && pUriLocal.getHost() !== info.uri.getHost()),
					"Поддерживаются только локальные файлы в пределах текущего домена.");

				var pFolders: string[] = pUriLocal.getPath().split('/');

				if (pFolders[0] == "" || pFolders[0] == ".") {
					pFolders = pFolders.slice(1);
				}

				logger.assert(pUri.getHost() === "temporary",
					"Поддерживаются только файловые системы типа \"temporary\".");

				this._pUri = uri.parse(pFolders.join("/"));
			}
			else {
				logger.error("used non local uri");
			}
		}

		static errorHandler(e: FileError): void {
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

			logger.error(sMesg);
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
		}

		static defaultCallback: Function = function (err) {
			if (err) {
				LocalFile.errorHandler(err);
			}
		}

	}


}