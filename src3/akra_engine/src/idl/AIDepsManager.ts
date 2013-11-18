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
    //system paramaters
	parent?: AIDependens;   //parent dep.
	depth?: uint;           //current depth of this Dep
	
	loaded?: uint;          //files loaded
	total?: uint;           //files total

	//user defined
	files?: AIDep[];        //files for loading
	deps?: AIDependens;     //sub dependens
	root?: string;          //root for this.level only
}

interface AIDepsManager extends AIEventProvider {
	load(pDeps: AIDependens, sRoot?: string): boolean;
}
