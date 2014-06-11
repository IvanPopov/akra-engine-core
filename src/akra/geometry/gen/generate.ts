/// <reference path="../common.ts" />

module akra.gen {
	/**
	 * Generated typed array by {Type} and {size}.
	 */
	export function array<T>(size: number, Type: any = null): T[] {
		var tmp: T[] = <T[]>new Array(size);

		for (var i: number = 0; i < size; ++i) {
			tmp[i] = (!isNull(Type) ? (new Type) : null);
		}

		return tmp;
	}
}