#ifndef IEVENTTABLE_TS
#define IEVENTTABLE_TS

module akra {
	export interface IEventSlot {
		target: any;
		callback: string;
		listener: Function;
	}

	export interface IEventSlotMap {
		[index: string]: IEventSlot[];
	}

	export interface IEventSlotTable {
		[index: number]: IEventSlotMap;
		[index: string]: IEventSlotMap;
	}

	export interface IEventSlotList {
		[index: number]: {[index: string]: IEventSlot;};
		[index: string]: {[index: string]: IEventSlot;};
	}

	export interface IEventTable {
		broadcast: IEventSlotTable;
		unicast: IEventSlotList;

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): bool;
		addListener(iGuid: int, sSignal: string, fnListener: Function, eType?: EEventTypes): bool;
	}
}

#endif
