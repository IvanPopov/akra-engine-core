#ifndef EVENTS_TS
#define EVENTS_TS

/***********************************************
 * TODO: check, if event exists on target!!!!!
 *************************************************/

#include "IEventTable.ts"
#include "IEventProvider.ts"
#include "common.ts"
#include "util/unique.ts"

#define EMIT_UNICAST(event, call) \
	var _recivier: any = this; \
	this._pUnicastSlotMap = this._pUnicastSlotMap || (<events.EventTable>this.getEventTable()).findUnicastList(this._iGuid);\
	var _unicast: IEventSlot = (<any>this._pUnicastSlotMap).event;\
	/*console.error(this.getEventTable());*/\
	if(isDef(_unicast)){\
		_unicast.target? _unicast.target[_unicast.callback] call: _unicast.listener call;\
	}
#define EMIT_BROADCAST(event, call) \
	this._pBroadcastSlotList = this._pBroadcastSlotList || (<events.EventTable>this.getEventTable()).findBroadcastList(this._iGuid);\
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


#define CREATE_EVENT_TABLE(object) \
	UNIQUE()										\
	protected _pUnicastSlotMap: IEventSlotMap = null;						\
	protected _pBroadcastSlotList: IEventSlotListMap = null;				\
	protected static _pEventTable: IEventTable = new events.EventTable(); 							\
																									\
	inline getEventTable(): IEventTable { return object._pEventTable; } 												\
	inline connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool {				\
		return pSender.getEventTable().addDestination((<events.EventProvider>pSender).getGuid(), sSignal, this, sSlot, eType);					\
	}; 																													\
	inline disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool {				\
		return pSender.getEventTable().removeDestination((<events.EventProvider>pSender).getGuid(), sSignal, this, sSlot, eType);					\
	}																													\
	inline bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { 									\
		return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType);							\
	}																													\
	inline unbind(sSignal: string, fnListener?: Function, eType?: EEventTypes): bool {									\
		return this.getEventTable().removeListener(this.getGuid(), sSignal, fnListener, eType);							\
	}																													\
	inline _syncTable(pFrom: IEventProvider): void {																	\
		this.getEventTable()._sync(this, pFrom);										\
	}
//#define END_EVENT_TABLE()

module akra.events {
	export class EventTable implements IEventTable {
		broadcast: IEventSlotTable = <IEventSlotTable>{};
		unicast: IEventSlotList = <IEventSlotList>{};

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {

				if (this.findDestinationIndexBC(iGuid, sSignal, pTarget, sSlot) === -1) {
					this.findBroadcastSignalMap(iGuid, sSignal).push({target: pTarget, callback: sSlot, listener: null});
				}

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

		private findDestinationIndexBC(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string): int {
		
			var pList: IEventSlot[] = this.findBroadcastSignalMap(iGuid, sSignal);
			
			for (var i: int = 0; i < pList.length; ++ i) {
				if (pList[i].target === pTarget && pList[i].callback === sSlot) {
					return i;
				}
			}
			
			return -1;
		}

		removeDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				var pList: IEventSlot[] = this.findBroadcastSignalMap(iGuid, sSignal);
				var i: int = this.findDestinationIndexBC(iGuid, sSignal, pTarget, sSlot);
				
				if (i != -1) {
					pList.splice(i, 1);
					return true;
				}
			}
			else {
				if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
					delete this.unicast[iGuid][sSignal];
					return true;
				}
			}
			debug_warning("cannot remove destination for GUID <%s> with signal <%s>", iGuid, sSignal);
			return false;
		}

		addListener(iGuid: int, sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				// console.log("add listener(", iGuid, "):: ", "listener: ", fnListener, "signal: ", sSignal);
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

		removeListener(iGuid: int, sSignal: string, fnListener?: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
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

		inline findBroadcastList(iGuid: int): IEventSlotListMap {
			return (this.broadcast[iGuid] = this.broadcast[iGuid] || {});
		}

		findUnicastList(iGuid: int): IEventSlotMap {
			//console.error(iGuid,this.unicast[iGuid]);

			this.unicast[iGuid] = this.unicast[iGuid] || {};
			return this.unicast[iGuid];
		}

		_sync(pTarget: IEventProvider, pFrom: IEventProvider): void {
			this.broadcast[pTarget.getGuid()] = this.broadcast[pFrom.getGuid()];
			this.unicast[pTarget.getGuid()] = this.unicast[pFrom.getGuid()];
		}

		private findBroadcastSignalMap(iGuid: int, sSignal: string): IEventSlot[] {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			this.broadcast[iGuid][sSignal] = this.broadcast[iGuid][sSignal] || [];
			return this.broadcast[iGuid][sSignal];
		}
	}


	export class EventProvider implements IEventProvider {
		CREATE_EVENT_TABLE(EventProvider);
	}
}


#endif
