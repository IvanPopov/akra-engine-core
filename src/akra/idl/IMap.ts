module akra {
	export interface IMap<T> {
		[index: string]: T;
		[index: uint]: T;
	}

	export interface IDMap<T> {
		[index: string]: IMap<T>;
		[index: uint]: IMap<T>;
	}
	
	/** @deprecated Use IMap<string> instead. */
	export interface IStringMap {
		[index: string]: string;
		[index: uint]: string;
	}
	/** @deprecated Use IMap<int> instead. */
	export interface IIntMap {
		[index: string]: int;
		[index: uint]: int;
	}
	/** @deprecated Use IMap<uint> instead. */
	export interface IUintMap {
		[index: string]: uint;
		[index: uint]: uint;
	}
	/** @deprecated Use IMap<float> instead. */
	export interface IFloatMap {
		[index: string]: float;
		[index: uint]: float;
	}
	/** @deprecated Use IMap<boolean> instead. */
	export interface IBoolMap {
		[index: string]: boolean;
		[index: uint]: boolean;
	}
	/** @deprecated Use IDMap<boolean> instead. */
	export interface IBoolDMap {
		[index: string]: IBoolMap;
		[index: uint]: IBoolMap;
	}
	/** @deprecated Use IDMap<string> instead. */
	export interface IStringDMap {
		[index: string]: IStringMap;
		[index: uint]: IStringMap;
	}
}
