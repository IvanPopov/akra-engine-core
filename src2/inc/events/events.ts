#ifndef EVENTS_TS
#define EVENTS_TS

#include "IEventTable.ts"
#include "IEventProvider.ts"

#define EMIT_UNICAST(event, call) \
	var _recivier: any = this; \
	this._pUnicastSlotMap = /*this._pUnicastSlotMap || */this.getEventTable().findUnicastList(this._iGuid);\
	var _unicast: IEventSlot = (<any>this._pUnicastSlotMap).event;\
	/*console.error(this.getEventTable());*/\
	if(isDef(_unicast)){\
		_unicast.target? _unicast.target[_unicast.callback] call: _unicast.listener call;\
	}
#define EMIT_BROADCAST(event, call) \
	this._pBroadcastSlotList = this._pBroadcastSlotList || this.getEventTable().findBroadcastList(this._iGuid);\
	var _broadcast: IEventSlot[] = (<any>this._pBroadcastSlotList).event; \
	var _recivier: any = this; \
		if(isDef(_broadcast)){\
			for (var i = 0; i < _broadcast.length; ++ i) { \
				_broadcast[i].target? _broadcast[i].target[_broadcast[i].callback] call: _broadcast[i].listener call; \
			}\
		} 
#define _EVENT_BC(event, signal, call) \
	event signal: void { \
		EMIT_BROADCAST(event, call)\
	}
#define _EVENT_UC(event, signal, call) \
	event signal: void { \
		EMIT_UNICAST(event, call) \
	}

#define _CALL(...) (_recivier, __VA_ARGS__)
#define CALL(...)  (__VA_ARGS__), _CALL(__VA_ARGS__)
#define _VOID  (_recivier)
#define VOID  (), _VOID
#define SLOT(call) #call
#define SIGNAL(call) #call
/**event, signal, slot*/
#define BROADCAST(...) _EVENT_BC(__VA_ARGS__);
/**event, signal, slot*/
#define UNICAST(...) _EVENT_UC(__VA_ARGS__);
#define EVENT(event) event

#define CONNECT(sender, signal, recivier, slot) recivier.connect(sender, signal, slot)
#define BIND(sender, signal, callback) sender.bind(signal, callback)

#define BEGIN_EVENT_TABLE(object) \
	private _iGuid: uint = sid(); 										\
	private _pUnicastSlotMap: IEventSlotMap = null;						\
	private _pBroadcastSlotList: IEventSlotListMap = null;				\
	private static _pEvenetTable: IEventTable = new events.EventTable(); 												\
																														\
	inline getEventTable(): IEventTable {return object._pEvenetTable; } 												\
	inline getGuid(): uint {return this._iGuid; } 																		\
	inline connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool {				\
		console.log(pSender,this,sSlot);\
		return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType);					\
	}; 																													\
	inline disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool {				\
		return this.getEventTable().removeDestination(pSender.getGuid(), sSignal, this, sSlot, eType);					\
	}																													\
	inline bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { 									\
		return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType);							\
	}																													\
	inline unbind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool {									\
		return this.getEventTable().removeListener(this.getGuid(), sSignal, fnListener, eType);							\
	}
#define END_EVENT_TABLE()

module akra.events {
	export class EventTable implements IEventTable {
		broadcast: IEventSlotTable = <IEventSlotTable>{};
		unicast: IEventSlotList = <IEventSlotList>{};

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastSignalMap(iGuid, sSignal).push({target: pTarget, callback: sSlot, listener: null});
				return true;
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				//console.log(iGuid, sSignal, pTarget, sSlot, eType);
				//console.warn(this.unicast);
				if (!isDef(this.unicast[iGuid][sSignal])) {
					this.unicast[iGuid][sSignal] = {target: pTarget, callback: sSlot, listener: null};
					return true;
				}
			}
			return false;
		}

		removeDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				var pList: IEventSlot[] = this.findBroadcastSignalMap(iGuid, sSignal);
				for (var i: int = 0; i < pList.length; ++ i) {
					if (pList[i].target === pTarget && pList[i].callback === sSlot) {
						pList.splice(i, 1);
						return true;
					}
				}
			}
			else {
				if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
					delete this.unicast[iGuid][sSignal];
					return true;
				}
			}
			debug_warning("cannot add destination for GUID <%s> with signal <%s>", iGuid, sSignal);
			return false;
		}

		addListener(iGuid: int, sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastSignalMap(iGuid, sSignal).push({target: null, callback: null, listener: fnListener});
				return true;
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				if (!isDef(this.unicast[iGuid][sSignal])) {
					this.unicast[iGuid][sSignal] = {target: null, callback: null, listener: fnListener};
					return true;
				}
			}
			debug_warning("cannot add listener for GUID <%s> with signal <%s>", iGuid, sSignal);
			return false;
		}

		removeListener(iGuid: int, sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				var pList: IEventSlot[] = this.findBroadcastSignalMap(iGuid, sSignal);
				for (var i: int = 0; i < pList.length; ++ i) {
					if (pList[i].listener === fnListener) {
						pList.splice(i, 1);
						return true;
					}
				}
			}
			else {
				if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
					delete this.unicast[iGuid][sSignal];
					return true;
				}
			}
			return false;
		}

		findBroadcastList(iGuid: int): IEventSlotListMap {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			return this.broadcast[iGuid];
		}

		findUnicastList(iGuid: int): IEventSlotMap {
			//console.error(iGuid,this.unicast[iGuid]);

			this.unicast[iGuid] = this.unicast[iGuid] || {};
			return this.unicast[iGuid];
		}

		private findBroadcastSignalMap(iGuid: int, sSignal: string): IEventSlot[] {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			this.broadcast[iGuid][sSignal] = this.broadcast[iGuid][sSignal] || [];
			return this.broadcast[iGuid][sSignal];
		}

		private
	}
}


#endif
