
module akra {
	interface IEventSlot {
		target: any;
		callback: string;
		listener: Function;
	}
	
	interface IEventSlotListMap {
		[index: string]: IEventSlot[];
	}
	interface IEventSlotMap {
		[index: string]: IEventSlot;
	}
	
	interface IEventSlotTable {
		[index: number]: IEventSlotListMap;
		[index: string]: IEventSlotListMap;
	}
	
	interface IEventSlotList {
		[index: number]: IEventSlotMap;
		[index: string]: IEventSlotMap;
	}
	
	interface IEventTable {
		broadcast: IEventSlotTable;
		unicast: IEventSlotList;
	
		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): boolean;
		removeDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): boolean;
		addListener(iGuid: int, sSignal: string, fnListener: Function, eType?: EEventTypes): boolean;
		removeListener(iGuid: int, sSignal: string, fnListener?: Function, eType?: EEventTypes): boolean;
	
		findUnicastList(iGuid: int): IEventSlotMap;
		findBroadcastList(iGuid: int): IEventSlotListMap;
	
		findBroadcastSignalMap(iGuid: int, sSignal: string): IEventSlot[];
	
		_sync(pTarget: IEventProvider, pFrom: IEventProvider): void;
	}
	
}
