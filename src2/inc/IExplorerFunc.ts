#ifndef IEXPLORERFUNC_TS
#define IEXPLORERFUNC_TS

module akra {
	
	IFACE(IEntity);

	export interface IExplorerFunc {
		(pEntity: IEntity): bool;
	}
}

#endif