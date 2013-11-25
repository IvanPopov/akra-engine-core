

/// <reference path="IResourcePoolItem.ts" />

module akra {
	interface IResourceWatcherFunc {
		(nLoaded?: uint, nTotal?: uint, pTarget?: IResourcePoolItem): void;
	}
}
