#ifndef RESOURCEPOOLITEM_TS
#define RESOURCEPOOLITEM_TS

#include "common.ts"
#include "IEngine.ts"
#include "IResourceCode.ts"
#include "IResourcePool.ts"
#include "IResourcePoolManager.ts"
#include "IResourceWatcherFunc.ts"
#include "IResourceNotifyRoutineFunc.ts"
#include "IResourcePoolItem.ts"
#include "util/ReferenceCounter.ts"
#include "events/events.ts"

module akra.core.pool {

	export interface ICallbackSlot {
		bState: bool;
		fn: IResourceNotifyRoutineFunc;
		pResourceItem: IResourcePoolItem;
	}

	export class ResourcePoolItem extends util.ReferenceCounter implements IResourcePoolItem {
		//private pManager: IResourcePoolManager;
		private pResourceCode: IResourceCode;
		private pResourcePool: IResourcePool = null;
		private iResourceHandle: int = 0;
		private iResourceFlags: int = 0;
		private pCallbackFunctions: IResourceNotifyRoutineFunc[];
		private pStateWatcher: IResourceWatcherFunc[];
		private pCallbackSlots: ICallbackSlot[][];


		inline get resourceCode(): IResourceCode {
			return this.pResourceCode;
		}

		inline get resourcePool(): IResourcePool {
			return this.pResourcePool;
		}

		inline get resourceHandle(): int {
			return this.iResourceHandle;
		}

		inline get resourceFlags(): int {
			return this.iResourceFlags;
		}

		inline get alteredFlag(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.ALTERED);
		}

		inline get manager(): IResourcePoolManager { return this.getManager(); }

		/** Constructor of ResourcePoolItem class */
		constructor (/*pManager: IResourcePoolManager*/) {
			super();

			//this.pManager = pManager;
			this.pResourceCode = new ResourceCode(0);
			this.pCallbackFunctions = [];
			this.pStateWatcher = [];
			this.pCallbackSlots = genArray(null, <number>EResourceItemEvents.TOTALRESOURCEFLAGS);
		}

		inline getEngine(): IEngine {
			var pManager: IResourcePoolManager = this.getManager();
			
			if (pManager) {
				return pManager.getEngine();
			}

			return null;
		}

		inline getManager(): ResourcePoolManager {
			return <ResourcePoolManager>(<ResourcePool>this.pResourcePool).manager;
		}

		createResource(): bool {
			return false;
		}

		destroyResource(): bool {
			return false;
		}

		disableResource(): bool {
			return false;
		}

		restoreResource(): bool {
			return false;
		}

		loadResource(sFilename: string = null): bool {
			return false;
		}

		saveResource(sFilename: string = null): bool {
			return false;
		}


		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void {
			for (var i: int = 0; i < this.pCallbackFunctions.length; i ++) {
			    
			    if (this.pCallbackFunctions[i] == fn) {
			        return;
			    }
			}

			this.pCallbackFunctions.push(fn);
		}

		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void {
			for (var i: int = 0; i < this.pCallbackFunctions.length; i ++) {
		        if (this.pCallbackFunctions[i] == fn) {
		            this.pCallbackFunctions[i] = null;
		        }
		    }
		}

		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void {
			this.pStateWatcher[eEvent] = fnWatcher;
		}

		isSyncedTo(eSlot: EResourceItemEvents): bool {
			return !isNull(this.pCallbackSlots[eSlot]) && this.pCallbackSlots[eSlot].length > 0;
		}

		sync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool {
			eSlot = isDef(eSlot)? eSlot: eSignal;

		    eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
		    eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

		    var pSlots: ICallbackSlot[][] = this.pCallbackSlots, pSignSlots: ICallbackSlot[];

		    var me: IResourcePoolItem = this;
		    var n: uint;
		    var fn: IResourceNotifyRoutineFunc;
		    var bState: bool;

		    if (isNull(pSlots[eSlot])) {
		        pSlots[eSlot] = [];
		    }

		    pSignSlots = pSlots[eSlot];
		    n = pSignSlots.length;
		    bState = bf.testBit(pResourceItem.resourceFlags, <number>eSignal);

		    fn = function (eFlag?: EResourceItemEvents, iResourceFlags?: int, isSet?: bool) {
		        if (eFlag == <number>eSignal) {
		            pSignSlots[n].bState = isSet;
		            me.notifyStateChange(eSlot, this);

		            for (var i: int = 0; i < pSignSlots.length; ++i) {
		                if (pSignSlots[i].bState === false) {
		                    
		                    if (bf.testBit(me.resourceFlags, <number>eFlag)) {
		                        me.setResourceFlag(eFlag, false);
		                    }

		                    return;
		                }
		            }

		            me.setResourceFlag(eFlag, true);
		        }
		    };

		    pSignSlots.push({bState : bState, fn : fn, pResourceItem : pResourceItem});

		    fn.call(pResourceItem, eSignal, pResourceItem.resourceFlags, bState);
		    pResourceItem.setChangesNotifyRoutine(fn);

		    return true;
		}

		unsync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool {
			eSlot = isDef(eSlot)? eSlot: eSignal;
		    eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
		    eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

		    var pSlots: ICallbackSlot[][] = this.pCallbackSlots, pSignSlots: ICallbackSlot[];
		    var me: IResourcePoolItem = this;
		    var isRem: bool = false;

		    pSignSlots = pSlots[eSlot];


		    for (var i: int = 0, n: uint = pSignSlots.length; i < n; ++i) {
		        if (pSignSlots[i].pResourceItem === pResourceItem) {
		            pSignSlots[i].pResourceItem.delChangesNotifyRoutine(pSignSlots[i].fn);
		            pSignSlots.splice(i, 1);

		            --n;
		            --i;

		            isRem = true;
		        }
		    }

		    return isRem;
		}


		inline isResourceCreated(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.CREATED);
		}

		inline isResourceLoaded(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.LOADED);
		}

		inline isResourceDisabled(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.DISABLED);
		}

		inline isResourceAltered(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.ALTERED );
		}

		setAlteredFlag(isOn: bool = true): bool {
			//notify always, when altered called
    		if (this.setResourceFlag(EResourceItemEvents.ALTERED, isOn) || isOn) {
    			isOn? this.altered(): this.saved();
    			return true;
    		}

    		return false;
		}

		inline setResourceName(sName: string) {
			if (this.pResourcePool != null) {
		        this.pResourcePool.setResourceName(this.iResourceHandle, sName);
		    }
		}

		findResourceName(): string {
			if (this.pResourcePool != null) {
		        return this.pResourcePool.findResourceName(this.iResourceHandle);
		    }

		    return null;
		}

		release(): uint {
			var iRefCount = super.release();

		    if (iRefCount == 0) {
		        //Если у нас есть менеджер попросим его удалить нас
		        if (this.pResourcePool != null) {
		            this.pResourcePool.destroyResource(this);
		        }
		    }

		    return iRefCount;
		}
		inline notifyCreated(): void {
			if (this.setResourceFlag(EResourceItemEvents.CREATED, true)) {
				this.created();
			}
		}

		inline notifyDestroyed(): void {
			if (this.setResourceFlag(EResourceItemEvents.CREATED, false)) {
				this.destroyed();
			}
		}

		inline notifyLoaded(): void {
			this.setAlteredFlag(false);
			// LOG("ResourcePoolItem::notifyLoaded();");
    		if (this.setResourceFlag(EResourceItemEvents.LOADED, true)) {
    			// LOG("ResourcePoolItem::loaded();");
    			this.loaded();
    		}
		}

		inline notifyUnloaded(): void {
			if (this.setResourceFlag(EResourceItemEvents.LOADED, false)) {
				this.unloaded();
			}
		}

		inline notifyRestored(): void {
			if (this.setResourceFlag(EResourceItemEvents.DISABLED, false)) {
				this.restored();
			}
		}

		inline notifyDisabled(): void {
			if (this.setResourceFlag(EResourceItemEvents.DISABLED, true)) {
				this.disabled();
			}
		}

		inline notifyAltered(): void {
			this.setAlteredFlag(true);
		}
		
		inline notifySaved(): void {
			this.setAlteredFlag(false);
		}

		/**
		 * Назначение кода ресурсу
		 * @inline
		 */
		setResourceCode(pCode: IResourceCode): void {
			this.pResourceCode.eq(pCode);
		}

		/**
		 * Чтобы ресурс знал какому пулу ресурсов принадлжит
		 * @inline
		 */
		setResourcePool(pPool: IResourcePool): void {
			this.pResourcePool = pPool;
		}

		/**
		 * Назначение хендла ресурсу
		 * @inline
		 */
		setResourceHandle(iHandle: int): void {
			this.iResourceHandle = iHandle;
		}

		notifyStateChange(eEvent: EResourceItemEvents, pTarget: IResourcePoolItem = null): void {
			if (!this.pStateWatcher[eEvent]) {
		        return;
		    }

		    var pSignSlots: ICallbackSlot[]  = this.pCallbackSlots[eEvent];
		    var nTotal: uint = pSignSlots.length, nLoaded: uint = 0;

		    for (var i: int = 0; i < nTotal; ++i) {
		        if (pSignSlots[i].bState) {
		            ++ nLoaded;
		        }
		    }

		    this.pStateWatcher[eEvent](nLoaded, nTotal, pTarget);
		}

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: bool): bool;
		setResourceFlag(iFlagBit: int, isSetting: bool): bool;
		setResourceFlag(iFlagBit, isSetting: bool): bool {
			var iTempFlags: int = this.iResourceFlags;
		    
		    this.iResourceFlags = bf.setBit(this.iResourceFlags, iFlagBit, isSetting);
		    // LOG("before !=", iFlagBit, "(" + EResourceItemEvents.LOADED + ")", iTempFlags, "==>", this.iResourceFlags);

		    if (iTempFlags != this.iResourceFlags) {
		    	// LOG("!+");
		        for (var i: int = 0; i < this.pCallbackFunctions.length; i++) {
		            if (this.pCallbackFunctions[i]) {
		                this.pCallbackFunctions[i].call(this, iFlagBit, this.iResourceFlags, isSetting);
		            }
		        }
		        
		        return true;
		    }

		    return false;
		}

		static private parseEvent(sEvent: string): EResourceItemEvents;
		static private parseEvent(iEvent: int): EResourceItemEvents;
		static private parseEvent(pEvent) {
		 	if (isInt(pEvent)) {
		        return <EResourceItemEvents>pEvent;
		    }

		    switch (pEvent.toLowerCase()) {
		        case 'loaded':
		            return EResourceItemEvents.LOADED;
		        case 'created':
		            return EResourceItemEvents.CREATED;
		        case 'disabled':
		            return EResourceItemEvents.DISABLED;
		        case 'altered':
		            return EResourceItemEvents.ALTERED;
		        default:
		            ERROR('Использовано неизвестное событие для ресурса.');
		            return 0;
		    }
		}


		CREATE_EVENT_TABLE(ResourcePoolItem);
		BROADCAST(created 	, VOID);
		BROADCAST(destroyed , VOID);
		BROADCAST(loaded 	, VOID);
		BROADCAST(unloaded 	, VOID);
		BROADCAST(restored 	, VOID);
		BROADCAST(disabled 	, VOID);
		BROADCAST(altered 	, VOID);
		BROADCAST(saved 	, VOID);
	}


	export inline function isVideoResource(pItem: IResourcePoolItem): bool {
		return !isNull(pItem) && pItem.resourceCode.family === EResourceFamilies.VIDEO_RESOURCE;
	}

}

#endif
