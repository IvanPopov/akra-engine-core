module akra {
	interface IMap<T> {
	    [index: string]: T;
	    [index: uint]: T;
	}
	
	/** @deprecated Use IMap<type> instead. */
	interface IStringMap {
	    [index: string]: string;
	    [index: uint]: string;
	}
	/** @deprecated Use IMap<type> instead. */
	interface IIntMap {
	    [index: string]: int;
	    [index: uint]: int;
	}
	/** @deprecated Use IMap<type> instead. */
	interface IUintMap {
	    [index: string]: uint;
	    [index: uint]: uint;
	}
	/** @deprecated Use IMap<type> instead. */
	interface IFloatMap {
	    [index: string]: float;
	    [index: uint]: float;
	}
	/** @deprecated Use IMap<type> instead. */
	interface IBoolMap {
	    [index: string]: boolean;
	    [index: uint]: boolean;
	}
	/** @deprecated Use IMap<type> instead. */
	interface IBoolDMap {
	    [index: string]: IBoolMap;
	    [index: uint]: IBoolMap;
	}
	/** @deprecated Use IMap<type> instead. */
	interface IStringDMap {
	    [index: string]: IStringMap;
	    [index: uint]: IStringMap;
	}
}
