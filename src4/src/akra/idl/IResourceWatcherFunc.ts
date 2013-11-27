

/// <reference path="IResourcePoolItem.ts" />

module akra {
	export interface IResourceWatcherFunc {
		(nLoaded?: uint, nTotal?: uint, pTarget?: IResourcePoolItem): void;
	}
}
