#ifndef IEVENTPROVIDER_TS
#define IEVENTPROVIDER_TS

module akra {
	IFACE(IEventTable);

	export interface IEventProvider {
		getGuid(): uint;
		getEventTable(): IEventTable;
		connect(pSender: IEventProvider, sSignal: string, sSlot: string): bool;
	}
}

#endif