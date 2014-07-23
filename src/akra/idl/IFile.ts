module akra {
	export interface IFileMeta {
		lastModifiedDate: string;
		size: uint;
		eTag?: string;
	}
	
	export interface IFile extends IEventProvider {
		opened: ISignal<{ (pFile: IFile): void; }>;
		closed: ISignal<{ (pFile: IFile): void; }>;
		renamed: ISignal<{ (pFile: IFile, sName: string, sNamePrev: string): void; }>;

		getPath(): string;
		getName(): string;
		getByteLength(): uint;
		
		getMode(): int;
		setMode(sMode: string): void;
		setMode(iMode: int): void;

		getPosition(): uint;
		setPosition(iPos: uint): void;
	
		// binarayType: EFileBinaryType;
	
		open(sFilename: string, iMode: int, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(sFilename: string, sMode: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(sFilename: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(iMode: int, cb?: (e: Error, pMeta: IFileMeta) => void): void;
		open(cb?: (e: Error, pMeta: IFileMeta) => void): void;
	
		close(): void;
		clear(cb?: Function): void;
		read(cb?: (e: Error, data: any) => void, fnProgress?: (bytesLoaded: uint, bytesTotal: uint) => void): void;
		write(sData: string, cb?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, cb?: Function, sContentType?: string): void;
		move(sFilename: string, cb?: (e: Error, sPath: string, sPathPrev: string) => void): void;
		copy(sFilename: string, cb?: (e:Error, pCopy: IFile) => void): void;
		rename(sFilename: string, cb?: Function): void;
		remove(cb?: (e: Error, sName: string, sNamePrev: string) => void): void;
	
		//return current position
		atEnd(): int;
		//return current position;
		seek(iOffset: int): int;
	
		isOpened(): boolean;
		isExists(cb: Function): void;
		isLocal(): boolean;
	
		getMetaData(cb: (e: Error, pMeta: IFileMeta) => void): void;
	}
	
}
