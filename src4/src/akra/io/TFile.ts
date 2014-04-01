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
	export enum EFileActions {
		k_Open = 1,
		k_Read = 2,
		k_Write,
		k_Clear,
		k_Exists,
		k_Remove
	}

	export interface IFileCommand {
		act: EFileActions;
		name: string;
		mode: int;
		pos?: uint;
		transfer?: EFileTransferModes;
		data?: any;
		contentType?: string;
		progress?: boolean;
	}

	import cio = config.io;

	var sRemote: string = cio.tfile.remote.content;
	var sLocal: string = cio.tfile.local.content;

	if (cio.tfile.local.format === "String") {
		//attachment contain inline thread file dataa
		sLocal = conv.toURL("var $INTERFACE_DEFINED = true;\n" +
			cio.tfile.local.content + "\n" + cio.tfile.iface.content, "application/javascript");
	}
	else {
		sLocal = config.data + sLocal;
	}

	if (cio.tfile.remote.format === "String") {
		//attachment contain inline thread file dataa
		sRemote = conv.toURL("var $INTERFACE_DEFINED = true;\n" +
			cio.tfile.remote.content + "\n" + cio.tfile.iface.content, "application/javascript");
	}
	else {
		sRemote = config.data + sRemote;
	}

	export class TFile implements IFile {
		guid: uint = guid();

		opened: ISignal<{ (pFile: IFile): void; }>;
		closed: ISignal<{ (pFile: IFile): void; }>;
		renamed: ISignal<{ (pFile: IFile, sName: string, sNamePrev: string): void; }>;

		private static localManager = new threading.Manager(sLocal);
		private static remoteManager = new threading.Manager(sRemote);

		protected _iMode: int;
		protected _pUri: IURI = null;
		protected _nCursorPosition: uint = 0;
		protected _bOpened: boolean = false;
		protected _eTransferMode: EFileTransferModes = EFileTransferModes.k_Normal;
		protected _pFileMeta: IFileMeta = null;
		protected _isLocal: boolean = false;

		constructor(sFilename?: string, sMode?: string, cb?: (e: Error, pMeta: IFileMeta) => void);
		constructor(sFilename?: string, iMode?: int, cb?: (e: Error, pMeta: IFileMeta) => void);
		constructor(sFilename?: string, sMode?: any, cb?: (e: Error, pMeta: IFileMeta) => void) {
			this.setupSignals();

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

			if (isDefAndNotNull(cb)) {
				this.open(sFilename, sMode, cb);
			}
		}

		setupSignals(): void {
			this.opened = this.opened || new Signal(<any>this);
			this.closed = this.closed || new Signal(<any>this);
			this.renamed = this.renamed || new Signal(<any>this);
		}

		getPath(): string {
			return this._pUri.toString();
		}

		getName(): string {
			return path.parse(this._pUri.getPath()).getBaseName();
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

		open(sFilename: string, iMode: int, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(sFilename: string, sMode: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(sFilename: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(iMode: int, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(sFilename?: any, iMode?: any, cb?: any): void {
			var pFile: IFile = this;
			var hasMode: boolean = !isFunction(iMode);

			if (arguments.length < 3) {
				if (isString(arguments[0])) {
					this.setAndValidateUri(uri.parse(sFilename));
					cb = arguments[1];
				}
				else if (isInt(arguments[0])) {
					this._iMode = arguments[0];
					cb = arguments[1];
				}
				else {
					cb = arguments[0];
				}

				logger.assert(isDefAndNotNull(this._pUri), "No filename provided.");


				this.open(this._pUri.toString(), this._iMode, cb);

				return;
			}

			cb = arguments[hasMode ? 2 : 1];
			cb = cb || TFile.defaultCallback;

			if (this.isOpened()) {
				logger.warn("file already opened: " + this.getName());
				(<Function>cb).call(pFile, null, this._pFileMeta);
			}

			this.setAndValidateUri(uri.parse(arguments[0]));

			if (hasMode) {
				this._iMode = (isString(arguments[1]) ? io.filemode(<string>arguments[1]) : arguments[1]);
			}

			this.update((err) => {
				if (err) {
					logger.warn("file update err", err);
					cb.call(pFile, err);
					return;
				}

				if (io.isAppend(this._iMode)) {
					this.setPosition(this.getByteLength());
				}

				cb.call(pFile, null, this._pFileMeta);
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

		clear(cb: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.clear, cb)) {
				return;
			}

			var pCommand: IFileCommand = {
				act: EFileActions.k_Clear,
				name: this.getPath(),
				mode: this._iMode
			};

			this.execCommand(pCommand, cb);
		}


		read(
			cb: (e: Error, data: any) => void = <any>TFile.defaultCallback,
			fnProgress?: (bytesLoaded: uint, bytesTotal: uint) => void): void {

			if (this.checkIfNotOpen(this.read, cb, arguments)) {
				return;
			}

			var pFile: IFile = this;
			var eTransferMode: EFileTransferModes = this._eTransferMode;

			logger.assert(io.canRead(this._iMode), "The file is not readable.");

			var pCommand: IFileCommand = {
				act: EFileActions.k_Read,
				name: this.getPath(),
				mode: this._iMode,
				pos: this._nCursorPosition,
				transfer: this._eTransferMode,
				progress: isDefAndNotNull(fnProgress)
			};

			var fnCallbackSystem: Function = (err, pData: any): any => {
				if (err) {
					cb.call(pFile, err);
					return;
				}

				if (pData.progress) {
					fnProgress(pData.loaded, pData.total);
					return false;
				}

				pFile.atEnd();
				cb.call(pFile, null, pData.data);
			};

			this.execCommand(pCommand, fnCallbackSystem);
		}

		write(sData: string, cb?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, cb?: Function, sContentType?: string): void;
		write(pData: any, cb: Function = TFile.defaultCallback, sContentType?: string): void {
			if (this.checkIfNotOpen(this.write, cb, arguments)) {
				return;
			}

			var iMode: int = this._iMode;
			var pCommand: IFileCommand;
			var fnCallbackSystem: Function = (err, pMeta) => {
				if (err) {
					cb.call(this, err);
					return;
				}

				this.setPosition(this.getPosition() + (isString(pData) ? pData.length : pData.byteLength));
				this._pFileMeta = <IFileMeta>pMeta;

				cb.call(this, null, pMeta);
			};

			logger.assert(io.canWrite(iMode), "The file is not writable.");

			sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

			pCommand = {
				act: EFileActions.k_Write,
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

		move(sFilename: string, cb: (e: Error, sPath: string, sPathPrev: string) => void = <any>TFile.defaultCallback): void {
			var pFile: IFile = this;
			var sPath: string = this.getPath();

			this.copy(sFilename, (e: Error, pCopy: IFile): void => {
				if (e) {
					return cb.call(pFile, e);
				}

				pFile.remove((e: Error) => {
					pFile.close();
					pFile.open(sFilename);

					cb.call(pFile, e, pFile.getPath(), sPath);
				});
			});
		}

		//copy file
		copy(sFilename: string, cb: (e: Error, pCopy: IFile, pMeta: IFileMeta) => void = <any>TFile.defaultCallback): void {
			var iMode: int = EIO.IN | EIO.OUT | EIO.TRUNC;
			var pFile: IFile = this;
			var pCopy: IFile;

			if (io.isBinary(this._iMode)) {
				iMode |= EIO.BIN;
			}

			pCopy = fopen(sFilename, iMode);

			pCopy.open((err): void => {
				if (err) {
					return cb.call(pFile, err, null);
				}

				pFile.read((e: Error, pData: ArrayBuffer): void => {
					pCopy.write(pData, (e: Error, pMeta: IFileMeta) => {
						if (!e) { pCopy.close(); }

						cb.call(pFile, e, pCopy, pMeta);
					});
				});
			});
		}

		rename(sFilename: string, cb: (e: Error, sName: string, sNamePrev: string) => void = <any>TFile.defaultCallback): void {
			var pName: IPathinfo = path.parse(sFilename);
			var sNamePrev: string = this.getName();

			logger.assert(!pName.getDirName(), "only filename can be specified.");

			this.move(path.parse(this._pUri.getPath()).getDirName() + "/" + pName.getBaseName(),
				(e: Error) => {
					this.renamed.emit(this.getName(), sNamePrev);
					cb.call(this, this.getName(), sNamePrev);
			});
		}

		remove(cb: Function = TFile.defaultCallback): void {
			if (this.checkIfNotOpen(this.remove, cb)) {
				return;
			}

			var pCommand: IFileCommand = {
				act: EFileActions.k_Remove,
				name: this.getPath(),
				mode: this._iMode
			};

			this.execCommand(pCommand, (e: Error): void => {
				if (!e) {
					this.close();
				}

				cb.call(this, e);
			});
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

		isExists(cb: Function): void {
			var pCommand: IFileCommand = {
				act: EFileActions.k_Exists,
				name: this.getPath(),
				mode: this._iMode
			};

			this.execCommand(pCommand, cb);
		}

		isLocal(): boolean {
			return this._isLocal;
		}

		getMetaData(cb: (e: Error, pMeta: IFileMeta) => void): void {
			logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
			cb(null, this._pFileMeta);
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

		protected update(cb: Function = TFile.defaultCallback) {
			var pCommand: IFileCommand = {
				act: EFileActions.k_Open,
				name: this._pUri.toString(),
				mode: this._iMode
			};

			var fnCallbackSystem: Function = (err, pMeta) => {
				this._pFileMeta = <IFileMeta>pMeta;
				cb.call(this, err, this);
			};

			this.execCommand(pCommand, fnCallbackSystem);
		}

		private execCommand(pCommand: IFileCommand, cb: Function, pTransferables?: any[]): void {
			TFile.execCommand(this, this.isLocal(), pCommand, cb, pTransferables);
		}

		static defaultCallback: Function = function (err) {
			if (err) {
				throw err;
			}
		}


		private static execCommand(pFile: IFile, isLocal: boolean, pCommand: IFileCommand, cb: Function, pTransferables?: any[]): void {
			// var pFile: IFile = this;
			var pManager: IThreadManager = isLocal ? TFile.localManager : TFile.remoteManager;
			pManager.waitForThread((pThread: IThread) => {
				pThread.onmessage = function (e) {
					if (cb.call(pFile, null, e.data) === false) {
						return;
					}

					pThread.onmessage = null;
					pManager.releaseThread(pThread);
				}

				pThread.onerror = function (e) {
					pThread.onmessage = null;
					cb.call(pFile, e);
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

