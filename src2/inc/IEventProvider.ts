#ifndef IEVENTPROVIDER_TS
#define IEVENTPROVIDER_TS

#define signal 

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
	}
}

#endif