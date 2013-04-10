#ifndef IEVENTPROVIDER_TS
#define IEVENTPROVIDER_TS

#define signal 
#define slot

#include "common.ts"
#include "IUnique.ts"

module akra {
	IFACE(IEventTable);

	export enum EEventTypes {
		BROADCAST,
		UNICAST
	};

	export interface IEventProvider extends IUnique {
		getEventTable(): IEventTable;
		connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;
		disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;																												\
		bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool;																													\
		unbind(sSignal: string, fnListener?: Function, eType?: EEventTypes): bool;

		_syncTable(pFrom: IEventProvider): void;
		// callOnce(sSignal: string, fnListener?: Function, eType?: EEventTypes): bool;
	}
}

#endif