// AIResourceWatcherFunc interface
// [write description here...]


/// <reference path="AIResourcePoolItem.ts" />

interface AIResourceWatcherFunc {
	(nLoaded?: uint, nTotal?: uint, pTarget?: AIResourcePoolItem): void;
}