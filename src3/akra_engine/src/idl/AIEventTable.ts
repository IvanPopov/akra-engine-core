// AIEventTable interface
// [write description here...]

interface AIEventSlot {
	target: any;
	callback: string;
	listener: Function;
}

interface AIEventSlotListMap {
	[index: string]: AIEventSlot[];
}
interface AIEventSlotMap {
	[index: string]: AIEventSlot;
}

interface AIEventSlotTable {
	[index: number]: AIEventSlotListMap;
	[index: string]: AIEventSlotListMap;
}

interface AIEventSlotList {
	[index: number]: AIEventSlotMap;
	[index: string]: AIEventSlotMap;
}

interface AIEventTable {
	broadcast: AIEventSlotTable;
	unicast: AIEventSlotList;

	addDestination(iGuid: int, sSignal: string, pTarget: AIEventProvider, sSlot: string, eType?: AEEventTypes): boolean;
	removeDestination(iGuid: int, sSignal: string, pTarget: AIEventProvider, sSlot: string, eType?: AEEventTypes): boolean;
	addListener(iGuid: int, sSignal: string, fnListener: Function, eType?: AEEventTypes): boolean;
	removeListener(iGuid: int, sSignal: string, fnListener?: Function, eType?: AEEventTypes): boolean;

	findUnicastList(iGuid: int): AIEventSlotMap;
	findBroadcastList(iGuid: int): AIEventSlotListMap;

	findBroadcastSignalMap(iGuid: int, sSignal: string): AIEventSlot[];

	_sync(pTarget: AIEventProvider, pFrom: AIEventProvider): void;
}
