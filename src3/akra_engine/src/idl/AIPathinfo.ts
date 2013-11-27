// AIPathinfo interface
// [write description here...]


interface AIPathinfo {
	path: string;
	dirname: string;
	filename: string;
	ext: string;
	basename: string;


	set(sPath: string): void;
	set(pPath: AIPathinfo): void;
	isAbsolute(): boolean;

	toString(): string;
}


