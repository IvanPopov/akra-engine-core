
/// <reference path="AIUnique.ts" />
/// <reference path="IEventTable.ts" />

module akra {
	enum EEventTypes {
		BROADCAST,
		UNICAST
	}
	
	interface IEventProvider extends AIUnique {
		getEventTable(): IEventTable;
	
		connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): boolean;
		disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): boolean;
	
		bind(sSignal: string, fnListener: Function, eType?: EEventTypes): boolean;
		unbind(sSignal: string, fnListener?: Function, eType?: EEventTypes): boolean;
	
		_syncTable(pFrom: IEventProvider): void;
	}
	
}
