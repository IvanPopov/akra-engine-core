// AIEventProvider interface
// [write description here...]

/// <reference path="AIUnique.ts" />
/// <reference path="AIEventTable.ts" />

enum AEEventTypes {
	BROADCAST,
	UNICAST
}

interface AIEventProvider extends AIUnique {
	getEventTable(): AIEventTable;

	connect(pSender: AIEventProvider, sSignal: string, sSlot: string, eType?: AEEventTypes): boolean;
	disconnect(pSender: AIEventProvider, sSignal: string, sSlot: string, eType?: AEEventTypes): boolean;

	bind(sSignal: string, fnListener: Function, eType?: AEEventTypes): boolean;
	unbind(sSignal: string, fnListener?: Function, eType?: AEEventTypes): boolean;

	_syncTable(pFrom: AIEventProvider): void;
}
