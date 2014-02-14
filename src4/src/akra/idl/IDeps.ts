module akra {
	export enum EDependenceStatuses {
		PENDING,			///< Pending...	
		INITIALIZATION,		///< Added in queue to load.
		CHECKING,			///< Check integrity hashes and other .
		LOADING,			///< Started loading.
		DOWNLOADING,		///< Downlaoding, second argment - progresss.
		UNPACKING,			///< Unpacking/extraction/undumping process started. 
		EXTRACTION,			///< Extraction from arhive, second argument - progress.
		LOADED,				///< Loaded. Content will be passed as the second argument

		REJECTED			///< Rejected with error. 
	}
	
	export interface IDepStats {
		status: EDependenceStatuses;
		bytesLoaded: uint;
		byteLength: uint;				///< Byte length.
		unpacked: float;				///< Unpacked from 0. to 1.;
	}

	export interface IDep {
		//system fiels
		stats?: IDepStats;
		content?: any;

		//user files
		path: string;		///< Path to file/resource.
		name?: string;		///< Name of resource.
		comment?: string;	///< Comment.
		type?: string;		///< Type of resource.
	}

	
	export interface IDependens {
		//user defined
		files?: IDep[];        ///< files for loading
		deps?: IDependens;     ///< sub dependens
		root?: string;         ///< root for this.level only
	}

	export interface IDepEvent {
		source: IDep;					///< Dependence, which generates change in progress.

		time: uint;						///< Time from begin of loading.

		loaded: uint;					///< Files loaded.
		total: uint;					///< Total files to be loaded.

		bytesLoaded: uint;				///< Bytes loaded.
		bytesTotal: uint;				///< Bytes total.

		unpacked: float;				/// From 0. to 1.;
	}
	
}
