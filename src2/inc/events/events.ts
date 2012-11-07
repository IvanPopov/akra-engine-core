#ifndef EVENTS_TS
#define EVENTS_TS

#include "IEventTable.ts"
#include "IEventProvider.ts"

#define _EVENT_BC(e, s) \
	e s: void { \
		var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid][#e]; \
		for (var i = 0; i < broadcast.length; ++ i) { \
			broadcast[i].target? broadcast[i].target[broadcast[i].callback] s: broadcast[i].listener s; \
		} \
	}
#define _EVENT_UC(e, s) \
	e s: void { \
		(this.getEventTable()).unicast[this._iGuid][#e] s; \
	}
#define CALL(...)  (__VA_ARGS__)
#define SLOT(call) #call
#define SIGNAL(call) #call
#define BROADCAST(event, signal) _EVENT_BC(event, signal);
#define UNICAST(event, signal) _EVENT_UC(event, signal);
#define EVENT(event) event

#define CONNECT(sender, signal, recivier, slot) recivier.connect(sender, signal, slot)
#define BIND(sender, signal, callback) sender.bind(signal, callback)

#define BEGIN_EVENT_TABLE(object) \
	private _iGuid: uint = sid(); 																						\
	private static _pEvenetTable: IEventTable = new events.EventTable(); 												\
	inline getEventTable(): IEventTable {return object._pEvenetTable; } 												\
	inline getGuid(): uint {return this._iGuid; } 																		\
	inline connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool {				\
		return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType);					\
	}; 																													\
	inline bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { 									\
		return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType);							\
	}
#define END_EVENT_TABLE()


module akra.events {
	export class EventTable implements IEventTable {
		broadcast: IEventSlotTable = <IEventSlotTable>{};
		unicast: IEventSlotList = <IEventSlotList>{};

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastList(iGuid, sSignal).push({target: pTarget, callback: sSlot, listener: null});
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				this.unicast[iGuid][sSignal] = {target: pTarget, callback: sSlot, listener: null};
			}
			return true;
		}

		addListener(iGuid: int, sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastList(iGuid, sSignal).push({target: null, callback: null, listener: fnListener});
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				this.unicast[iGuid][sSignal] = {target: null, callback: null, listener: fnListener};
			}
			return true;
		}

		private findBroadcastList(iGuid: int, sSignal: string): IEventSlot[] {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			this.broadcast[iGuid][sSignal] = this.broadcast[iGuid][sSignal] || [];
			return this.broadcast[iGuid][sSignal];
		}

		private
	}
}


#endif
