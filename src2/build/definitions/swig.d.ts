interface SwigOptions {
	allowErrors?: bool;
	autoescape?: bool;
	cache?: bool;
	encoding?: string;
	filters?: any;
	root?: string;
	tags?: any;
	extensions?: any;
	tzOffset?: number;
}

interface SwigTemplate {
	(data: any): string;
}

interface Swig {
	init(pOptions?: SwigOptions): void;
	compileFile(file: string): SwigTemplate;
	compile(template: string, info: any): SwigTemplate;
}

declare var swig: Swig;