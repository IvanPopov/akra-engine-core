

module akra {
	interface IPathinfo {
		path: string;
		dirname: string;
		filename: string;
		ext: string;
		basename: string;
	
	
		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		isAbsolute(): boolean;
	
		toString(): string;
	}
	
	
	
}
