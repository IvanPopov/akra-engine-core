

/// <reference path="IEntity.ts" />

module akra {
	export interface IExplorerFunc<T> {
		(pEntity: T): boolean;
	}
}
