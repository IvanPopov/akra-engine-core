module akra {
	export interface IFileMeta {
		lastModifiedDate: string;
		size: uint;
		eTag?: string;
	}
	
	export interface IFile {
		/** readonly */ path: string;
		/** readonly */ name: string;
		mode: int;
	
		/** @deprecated */
		onread: (e: Error, data: any) => void;
		/** @deprecated */
		onopen: Function;
	
		position: uint;
		byteLength: uint;
	
		/** readonly */ meta: IFileMeta;
	
		// binarayType: EFileBinaryType;
	
		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode: int, fnCallback?: Function): void;
		open(fnCallback?: Function): void;
	
		close(): void;
		clear(fnCallback?: Function): void;
		read(fnCallback?: (e: Error, data: any) => void, fnProgress?: (bytesLoaded: uint, bytesTotal: uint) => void): void;
		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		move(sFilename: string, fnCallback?: Function): void;
		copy(sFilename: string, fnCallback?: Function): void;
		rename(sFilename: string, fnCallback?: Function): void;
		remove(fnCallback?: Function): void;
	
		//return current position
		atEnd(): int;
		//return current position;
		seek(iOffset: int): int;
	
		isOpened(): boolean;
		isExists(fnCallback: Function): void;
		isLocal(): boolean;
	
		getMetaData(fnCallback: Function): void;
	}
	
}
