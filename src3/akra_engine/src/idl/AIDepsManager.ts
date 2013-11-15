// AIDepsManager interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />

enum AEDependenceStatuses {
	NOT_LOADED,
	LOADING,
	CHECKING,
	UNPACKING,
	LOADED
}

interface AIDep {
	//system
	index?: int;
	deps?: AIDependens;

	//additional
	status?: AEDependenceStatuses;
	content?: any;

	//user
	path: string;
	name?: string;
	comment?: string;
	type?: string;
}

interface AIDependens {
	parent?: AIDependens;
	depth?: uint;
	
	loaded?: uint;
	total?: uint;

	//user
	files?: AIDep[];
	deps?: AIDependens;
	root?: string;
}

interface AIDepsManager extends AIEventProvider {
	load(pDeps: AIDependens, sRoot?: string): boolean;
}
