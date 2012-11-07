#ifndef IFILE_TS
#define IFILE_TS

module akra {

	export interface IFile {
		readonly path: string;
		name: string;
		mode: int;

		onread: Function;
		onopen: Function;

		position: uint;
		byteLength: uint;


		open(sFilename: string, iMode: int, fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Functionn): void;
		open(iMode: int, fnCallback?: Function): void;
		open(sMode: string, fnCallback?: Function): void;

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
		isExists(fnCallback?: Function): void;

		getMetaData(fnCallback: Function): void;
	}
}

#endif