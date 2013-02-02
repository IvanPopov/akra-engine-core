#ifndef IEVENTPROVIDER_TS
#define IEVENTPROVIDER_TS

#define signal 
#define slot

module akra {
	IFACE(IEventTable);

	export enum EEventTypes {
		BROADCAST,
		UNICAST
	};

	export interface IEventProvider {
		getGuid(): uint;
		getEventTable(): IEventTable;
		connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;
		disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;																												\
		bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool;																													\
		unbind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool;
	}
}

#endif