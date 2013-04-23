#ifndef IEVENTTABLE_TS
#define IEVENTTABLE_TS

module akra {
	export interface IEventSlot {
		target: any;
		callback: string;
		listener: Function;
	}

	export interface IEventSlotListMap {
		[index: string]: IEventSlot[];
	}
	export interface IEventSlotMap {
		[index: string]: IEventSlot;
	}

	export interface IEventSlotTable {
		[index: number]: IEventSlotListMap;
		[index: string]: IEventSlotListMap;
	}

	export interface IEventSlotList {
		[index: number]: IEventSlotMap;
		[index: string]: IEventSlotMap;
	}

	export interface IEventTable {
		broadcast: IEventSlotTable;
		unicast: IEventSlotList;

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): bool;
		removeDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): bool;
		addListener(iGuid: int, sSignal: string, fnListener: Function, eType?: EEventTypes): bool;
		removeListener(iGuid: int, sSignal: string, fnListener?: Function, eType?: EEventTypes): bool;

		findUnicastList(iGuid: int): IEventSlotMap;
		findBroadcastList(iGuid: int): IEventSlotListMap;

		findBroadcastSignalMap(iGuid: int, sSignal: string): IEventSlot[];

		_sync(pTarget: IEventProvider, pFrom: IEventProvider): void;
	}
}

#endif
