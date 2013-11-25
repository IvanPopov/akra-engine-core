
/// <reference path="IEventProvider.ts" />

module akra {
	enum EDependenceStatuses {
		NOT_LOADED,
		LOADING,
		CHECKING,
		UNPACKING,
		LOADED
	}
	
	interface IDep {
		//system
		index?: int;
		deps?: IDependens;
	
		//additional
		status?: EDependenceStatuses;
		content?: any;
	
		//user
		path: string;
		name?: string;
		comment?: string;
		type?: string;
	}
	
	
	
	interface IDependens {
	    //system paramaters
		parent?: IDependens;   //parent dep.
		depth?: uint;           //current depth of this Dep
		
		loaded?: uint;          //files loaded
		total?: uint;           //files total
	
		//user defined
		files?: IDep[];        //files for loading
		deps?: IDependens;     //sub dependens
		root?: string;          //root for this.level only
	}
	
}
