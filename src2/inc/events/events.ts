#ifndef EVENTS_TS
#define EVENTS_TS

#include "IEventTable.ts"
#include "IEventProvider.ts"

#define _EVENT_BC(e, s) \
	e s: void { \
		var slots: IEventSlot[] = (this.getEventTable()).slots[this._iGuid][#e]; \
		for (var i = 0; i < slots.length; ++ i) { \
			slots[i].target? slots[i].target[slots[i].callback] s: slots[i].listener s; \
		} \
	}
#define CALL(...)  (__VA_ARGS__)
#define SLOT(call) #call
#define SIGNAL(call) #call
#define BROADCAST(event, signal) \
	_EVENT_BC(event, signal);
#define EVENT(event) \
	event

#define CONNECT(sender, signal, recivier, slot) recivier.connect(sender, signal, slot)
#define BIND(sender, signal, callback) sender.bind(signal, callback)

#define BEGIN_EVENT_TABLE(object) \
	private _iGuid: uint = sid(); 																						\
	private static _pEvenetTable: IEventTable = new events.EventTable(); 													\
	inline getEventTable(): IEventTable {return object._pEvenetTable; } 												\
	inline getGuid(): uint {return this._iGuid; } 																		\
	inline connect(pSender: IEventProvider, sSignal: string, sSlot: string): bool { 									\
		if (!pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot)) { 				\
			debug_error('cannot connect to target'); 																	\
			return false;																		 						\
		} 																												\
		return true; 																									\
	}; 																													\
	inline bind(sSignal: string, fnListener: Function): bool { 															\
		if (!this.getEventTable().addListener(this.getGuid(), sSignal, fnListener)) { 							\
			debug_error('cannot connect to target'); 																	\
			return false; 																								\
		} 																												\
		return true; 																									\
	}
#define END_EVENT_TABLE()


module akra.events {
	export class EventTable implements IEventTable {
		slots: IEventSlotTable = <IEventSlotTable>{};

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string): bool {
			this.findSlot(iGuid, sSignal).push({target: pTarget, callback: sSlot, listener: null});
			return true;
		}

		addListener(iGuid: int, sSignal: string, fnListener: Function): bool {
			this.findSlot(iGuid, sSignal).push({target: null, callback: null, listener: fnListener});
			return true;
		}

		private findSlot(iGuid: int, sSignal: string): IEventSlot[] {
			this.slots[iGuid] = this.slots[iGuid] || {};
			this.slots[iGuid][sSignal] = this.slots[iGuid][sSignal] || [];
			return this.slots[iGuid][sSignal];
		}
	}
}


#endif
