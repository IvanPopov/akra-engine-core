/// <reference path="../idl/IFile.ts" />
/// <reference path="../idl/IThread.ts" />
/// <reference path="../idl/EFileTransferModes.ts" />

/// <reference path="../config/config.ts" />
/// <reference path="../threading/threading.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../logger.ts" />
/// <reference path="io.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../math/math.ts" />


module akra.io {
	export enum AEFileActions {
		k_Open = 1,
		k_Read = 2,
		k_Write,
		k_Clear,
		k_Exists,
		k_Remove
	}

	export interface AIFileCommand {
		act: AEFileActions;
		name: string;
		mode: int;
		pos?: uint;
		transfer?: EFileTransferModes;
		data?: any;
		contentType?: string;
		progress?: boolean;
	}


	export class TFile implements IFile {
		private static localManager = new threading.Manager(config.io.tfile.local);
		private static remoteManager = new threading.Manager(config.io.tfile.remote);

		protected _iMode: int;
		protected _pUri: IURI = null;
		protected _nCursorPosition: uint = 0;
		protected _bOpened: boolean = false;
		protected _eTransferMode: EFileTransferModes = EFileTransferModes.k_Normal;
		protected _pFileMeta: IFileMeta = null;
		protected _isLocal: boolean = false;

		getPath(): string {
			return this._pUri.toString();
		}

		getName(): string {
			return path.parse(this._pUri.getPath()).getBaseName();
		}

		getMeta(): IFileMeta {
			logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
			return this._pFileMeta;
		}

		getByteLength(): uint {
			return this._pFileMeta ? this._pFileMeta.size : 0;
		}

		getMode(): int {
			return this._iMode;
		}

		setMode(sMode: string): void;
		setMode(iMode: int): void;
		setMode(mode: any): void {
			this._iMode = isString(mode) ? io.filemode(<string><any>mode) : mode;
		}

		getPosition(): uint {
			logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
			return this._nCursorPosition;
		}

		setPosition(iOffset: uint): void {
			logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
			this._nCursorPosition = iOffset;
		}

		setOnRead(fnCallback: (e: Error, data: any) => void): void {
			this.read(fnCallback);
		}

		setOnOpen(fnCallback: Function): void {
			this.open(fnCallback);
		}

		constructor(sFilename?: string, sMode?: string, fnCallback?: Function);
		constructor(sFilename?: string, iMode?: int, fnCallback?: Function);
		constructor(sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
			}

			this.setAndValidateUri(uri.parse(sFilename));

			if (info.api.getTransferableObjects()) {
				this._eTransferMode = EFileTransferModes.k_Fast;
			}
			//OPERA MOVED TO WEBKIT, and this TRAP not more be needed!
			// else if (info.browser.name == "Opera") {
			// 	this._eTransferMode = EFileTransferModes.k_Slow;
			// }

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
			fnCallback = fnCallback || TFile.defaultCallback;

			if (this.isOpened()) {
				logger.warn("file already opened: " + this.getName());
				(<Function>fnCallback).call(pFile, null, this._pFileMeta);
			}

			this.setAndValidateUri(uri.parse(arguments[0]));

			if (hasMode) {
				this._iMode = (isString(arguments[1]) ? io.filemode(<string>arguments[1]) : arguments[1]);
			}

			this.update(function (err) {
				if (err) {
					logger.warn("file update err", err);
					fnCallback.call(pFile, err);
					return;
				}

				if (io.isAppend(this._iMode)) {
					this.setPosition(this.size);
				}

				fnCallback.call(pFile, null, this._pFileMeta);
			});
		}

		close(): void {
			this._pUri = null;
			this._iMode = EIO.IN | EIO.OUT;
			this._nCursorPosition = 0;
			this._pFileMeta = null;
		}

		protected checkIfNotOpen(method: Function, callback: Function, pArgs: IArguments = null): boolean {
			if (!this.isOpened()) {
				this.open((e) => {
					if (e) {
						if (callback) {
							callback(e);
						}
					}

					if (!isNull(pArgs)) {
						method.apply(this, pArgs);
					}
					else {
						method.call(this, callback);
					}
				});

				return true;
			}

			return false;
		}

		clear(fnCallback: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.clear, fnCallback)) {
				return;
			}

			var pCommand: AIFileCommand = {
				act: AEFileActions.k_Clear,
				name: this.getPath(),
				mode: this._iMode
			};

			this.execCommand(pCommand, fnCallback);
		}


		read(
			fnCallback: (e: Error, data: any) => void = <any>TFile.defaultCallback,
			fnProgress?: (bytesLoaded: uint, bytesTotal: uint) => void): void {

			if (this.checkIfNotOpen(this.read, fnCallback, arguments)) {
				return;
			}

			var pFile: IFile = this;
			var eTransferMode: EFileTransferModes = this._eTransferMode;

			logger.assert(io.canRead(this._iMode), "The file is not readable.");

			var pCommand: AIFileCommand = {
				act: AEFileActions.k_Read,
				name: this.getPath(),
				mode: this._iMode,
				pos: this._nCursorPosition,
				transfer: this._eTransferMode,
				progress: isDefAndNotNull(fnProgress)
			};

			var fnCallbackSystem: Function = (err, pData: any): any => {
				if (err) {
					fnCallback.call(pFile, err);
					return;
				}

				if (pData.progress) {
					fnProgress(pData.loaded, pData.total);
					return false;
				}

				pFile.atEnd();
				fnCallback.call(pFile, null, pData.data);
			};

			this.execCommand(pCommand, fnCallbackSystem);
		}

		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
			if (this.checkIfNotOpen(this.write, fnCallback, arguments)) {
				return;
			}

			var pFile: IFile = this;
			var iMode: int = this._iMode;
			var pCommand: AIFileCommand;
			var fnCallbackSystem: Function = function (err, pMeta) {
				if (err) {
					fnCallback.call(pFile, err);
					return;
				}

				pFile.setPosition(pFile.getPosition() + (isString(pData) ? pData.length : pData.byteLength));
				(<any>pFile)._pFileMeta = <IFileMeta>pMeta;

				fnCallback.call(pFile, null, pMeta);
			};

			logger.assert(io.canWrite(iMode), "The file is not writable.");

			sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

			pCommand = {
				act: AEFileActions.k_Write,
				name: this.getPath(),
				mode: this._iMode,
				data: pData,
				contentType: sContentType,
				pos: this._nCursorPosition
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

			this.copy(sFilename, function (err) {
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

			if (io.isBinary(this._iMode)) {
				iMode |= EIO.BIN;
			}

			pFileCopy = new TFile(sFilename, iMode,
				function (err) {
					if (err) {
						fnCallback(err);
					}

					pFile.read((e: Error, pData: ArrayBuffer): void => {
						pFile.write(pData, fnCallback);
					});
				});
		}

		rename(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var pName: IPathinfo = path.parse(sFilename);

			logger.assert(!pName.getDirName(), 'only filename can be specified.');

			this.move(path.parse(this._pUri.getPath()).getDirName() + "/" + pName.getBaseName(), fnCallback);
		}

		remove(fnCallback: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.remove, fnCallback)) {
				return;
			}

			var pFile: IFile = this;
			var pCommand: AIFileCommand = {
				act: AEFileActions.k_Remove,
				name: this.getPath(),
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
			this.setPosition(this.getByteLength());
			return this._nCursorPosition;
		}
		//return current position;
		seek(iOffset: int): int {
			logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");

			var nSeek: int = this._nCursorPosition + iOffset;
			if (nSeek < 0) {
				nSeek = this.getByteLength() - (math.abs(nSeek) % this.getByteLength());
			}

			logger.assert(nSeek >= 0 && nSeek <= this.getByteLength(), "Invalid offset parameter");

			this._nCursorPosition = nSeek;

			return this._nCursorPosition;
		}

		isOpened(): boolean {
			return this._pFileMeta !== null;
		}

		isExists(fnCallback: Function): void {
			var pCommand: AIFileCommand = {
				act: AEFileActions.k_Exists,
				name: this.getPath(),
				mode: this._iMode
			};
			this.execCommand(pCommand, fnCallback);
		}

		isLocal(): boolean {
			return this._isLocal;
		}

		getMetaData(fnCallback: Function): void {
			logger.assert(isDefAndNotNull(this._pFileMeta), 'There is no file handle open.');
			fnCallback(null, {
				lastModifiedDate: this._pFileMeta.lastModifiedDate
			});
		}
		private setAndValidateUri(sFilename: IURI);
		private setAndValidateUri(sFilename: string);
		private setAndValidateUri(sFilename: any) {
			var pUri: IURI = uri.parse(sFilename);
			var pUriLocal: IURI;

			if (pUri.getScheme() === "filesystem:") {
				pUriLocal = uri.parse(pUri.getPath());
				// console.log(pUriLocal.toString());
				logger.assert(!(pUriLocal.getProtocol() && pUriLocal.getHost() != info.uri.getHost()),
					"It supports only local files within the current domain.");

				var pFolders: string[] = pUriLocal.getPath().split('/');


				if (pFolders[0] == "" || pFolders[0] == ".") {
					pFolders = pFolders.slice(1);
				}

				logger.assert(pFolders[0] === "temporary",
					"Supported only \"temporary\" filesystems. " + pUri.toString());

				//removing "temporary" from path...
				pFolders = pFolders.slice(1);

				this._pUri = uri.parse(pFolders.join("/"));
				// console.log(sFilename.toString(), "===>", this._pUri.toString());
				this._isLocal = true;
			}
			else {
				this._pUri = pUri;
			}
		}

		protected update(fnCallback: Function = TFile.defaultCallback) {
			var pFile: IFile = this;
			var pCommand: AIFileCommand = {
				act: AEFileActions.k_Open,
				name: this._pUri.toString(),
				mode: this._iMode
			};
			var fnCallbackSystem: Function = function (err, pMeta) {
				(<any>pFile)._pFileMeta = <IFileMeta>pMeta;
				// console.log(pMeta);
				fnCallback.call(pFile, err, pFile);
			};

			this.execCommand(pCommand, fnCallbackSystem);
		}

		private execCommand(pCommand: AIFileCommand, fnCallback: Function, pTransferables?: any[]): void {
			TFile.execCommand(this, this.isLocal(), pCommand, fnCallback, pTransferables);
		}

		static defaultCallback: Function = function (err) {
			if (err) {
				throw err;
			}
		}


		private static execCommand(pFile: IFile, isLocal: boolean, pCommand: AIFileCommand, fnCallback: Function, pTransferables?: any[]): void {
			// var pFile: IFile = this;
			var pManager: IThreadManager = isLocal ? TFile.localManager : TFile.remoteManager;
			pManager.waitForThread((pThread: IThread) => {
				pThread.onmessage = function (e) {
					if (fnCallback.call(pFile, null, e.data) === false) {
						return;
					}

					pThread.onmessage = null;
					pManager.releaseThread(pThread);
				}

				pThread.onerror = function (e) {
					pThread.onmessage = null;
					fnCallback.call(pFile, e);
					pManager.releaseThread(pThread);
				}



				if (isDef(pTransferables)) {
					// console.log(pCommand, pTransferables);
					pThread.send(pCommand, pTransferables);
				}
				else {
					pThread.send(pCommand);
				}
			});
		}

	}
}

