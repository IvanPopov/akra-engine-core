#ifndef IFILE_TS
#define IFILE_TS

module akra {

	export interface IFileMeta {
		lastModifiedDate: string;
		size: uint;
		eTag?: string;
	}


	// export enum EFileBinaryType {
	// 	ARRAY_BUFFER 	= 0x01,
	// 	BLOB 			= 0x02,
	// 	OBJECT_URL 		= 0x03
	// }

	export interface IFile {
		readonly path: string;
		readonly name: string;
		mode: int;

		onread: Function;
		onopen: Function;

		position: uint;
		byteLength: uint;

		readonly meta: IFileMeta;

		// binarayType: EFileBinaryType;

		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode: int, fnCallback?: Function): void;
		open(fnCallback?: Function): void;

		close(): void;
		clear(fnCallback?: Function): void;
		read(fnCallback?: Function): void;
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

		isOpened(): bool;
		isExists(fnCallback: Function): void;
		isLocal(): bool;

		getMetaData(fnCallback: Function): void;
	}
}

#endif