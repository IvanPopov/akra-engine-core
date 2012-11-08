#ifndef IPATHINFO_TS
#define IPATHINFO_TS

module akra {
	export interface IPathinfo {
		path: string;
		dirname: string;
		filename: string;
		ext: string;
		basename: string;


		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		isAbsolute(): bool;

		toString(): string;
	}
	
}

#endif