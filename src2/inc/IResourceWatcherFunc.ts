#ifndef IRESOURCEWATCHERFUNC_TS
#define IRESOURCEWATCHERFUNC_TS

module akra {

	IFACE(IResourcePoolItem);

	export interface IResourceWatcherFunc {
		(nLoaded?: uint, nTotal?: uint, pTarget?: IResourcePoolItem): void;
	}
}

#endif