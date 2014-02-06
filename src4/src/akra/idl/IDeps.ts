
/// <reference path="IEventProvider.ts" />

module akra {
	export enum EDependenceStatuses {
		NOT_LOADED,
		INITIALIZATION,
		CHECKING,
		LOADING,
		UNPACKING,
		LOADED
	}
	
	export interface IDep {
		//system
		index?: int;
		deps?: IDependens;
		//if primary dependence?
		primary?: boolean; 
	
		//additional
		status?: EDependenceStatuses;
		content?: any;
	
		//user
		path: string;
		name?: string;
		comment?: string;
		type?: string;
	}

	
	export interface IDependens {
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
