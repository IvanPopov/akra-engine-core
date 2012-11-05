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

	export interface IEventTable {
		slots: IEventSlotTable;

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string): bool;
		addListener(iGuid: int, sSignal: string, fnListener: Function): bool;
	}
}


#endif
