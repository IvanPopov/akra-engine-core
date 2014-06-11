

module akra {
	export interface IPathinfo {
		getPath(): string;
		setPath(sPath: string): void;

		getDirName(): string;
		setDirName(sDir: string): void;

		getFileName(): string;
		setFileName(sFile: string): void;

		getExt(): string;
		setExt(sExt: string): void;

		getBaseName(): string;
		setBaseName(sBase: string): void;	
	
		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		isAbsolute(): boolean;
	
		toString(): string;
	}
	
	
	
}
