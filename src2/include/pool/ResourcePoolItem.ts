///<reference path="../akra.ts" />

module akra.pool {

	export interface ICallbackSlot {
		bState: bool;
		fn: IResourceNotifyRoutineFunc;
		pResourceItem: IResourcePoolItem;
	}

	export class ResourcePoolItem extends util.ReferenceCounter implements IResourcePoolItem {
		private pEngine: IEngine;
		private pResourceCode: IResourceCode;
		private pResourcePool: IResourcePool = null;
		private iResourceHandle: int = 0;
		private iResourceFlags: int = 0;
		private iSystemId: uint; 
		private pCallbackFunctions: IResourceNotifyRoutineFunc[];
		private pStateWatcher: IResourceWatcherFunc[];
		private pCallbackSlots: ICallbackSlot[][];


		/** @inline */
		get resourceCode(): IResourceCode {
			return this.pResourceCode;
		}

		/** @inline */
		get resourcePool(): IResourcePool {
			return this.pResourcePool;
		}

		/** @inline */
		get resourceHandle(): int {
			return this.iResourceHandle;
		}

		/** @inline */
		get resourceFlags(): int {
			return this.iResourceFlags;
		}

		/** @inline */
		get alteredFlag(): bool {
			return bf.testBit(this.iResourceFlags, <number>ResourceItemEvents.k_Altered);
		}

		/** Constructor of ResourcePoolItem class */
		constructor (pEngine: IEngine) {
			super();

			this.pEngine = pEngine;
			this.pResourceCode = new ResourceCode(0);
			this.iSystemId = sid();
			this.pCallbackFunctions = [];
			this.pStateWatcher = [];
			this.pCallbackSlots = genArray(null, <number>ResourceItemEvents.k_TotalResourceFlags);
		}

		/** @inline */
		valueOf(): int {
			return this.iSystemId;
		}

		/** @inline */
		toNumber(): int {
			return this.iSystemId;
		}

		/** @inline */
		getEngine(): IEngine {
			return this.pEngine;
		}

		createResource(): bool {
			return false;
		}

		destroyResource(): bool {
			return false;
		}

		disableResource(): bool{
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

		setStateWatcher(eEvent: ResourceItemEvents, fnWatcher: IResourceWatcherFunc): void {
			this.pStateWatcher[eEvent] = fnWatcher;
		}

		connect(pResourceItem: IResourcePoolItem, eSignal: ResourceItemEvents, eSlot?: ResourceItemEvents): bool {
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

		    fn = function (eFlag?: ResourceItemEvents, iResourceFlags?: int, isSet?: bool) {
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

		disconnect(pResourceItem: IResourcePoolItem, eSignal: ResourceItemEvents, eSlot?: ResourceItemEvents): bool {
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

		/** @inline */
		notifyCreated(): void {
			this.setResourceFlag(ResourceItemEvents.k_Created, true);
		}

		/** @inline */
		notifyDestroyed(): void {
			this.setResourceFlag(ResourceItemEvents.k_Created, false);
		}

		/** @inline */
		notifyLoaded(): void {
			this.setAlteredFlag(false);
    		this.setResourceFlag(ResourceItemEvents.k_Loaded, true);
		}

		/** @inline */
		notifyUnloaded(): void {
			this.setResourceFlag(ResourceItemEvents.k_Loaded, false);
		}

		/** @inline */
		notifyRestored(): void {
			this.setResourceFlag(ResourceItemEvents.k_Disabled, false);
		}

		/** @inline */
		notifyDisabled(): void {
			this.setResourceFlag(ResourceItemEvents.k_Disabled, true);
		}

		/** @inline */
		notifyAltered(): void {
			this.setResourceFlag(ResourceItemEvents.k_Altered, true);
		}
		
		/** @inline */
		notifySaved(): void {
			this.setAlteredFlag(false);
		}

		/** @inline */
		isResourceCreated(): bool {
			return bf.testBit(this.iResourceFlags, <number>ResourceItemEvents.k_Created);
		}

		/** @inline */
		isResourceLoaded(): bool {
			return bf.testBit(this.iResourceFlags, <number>ResourceItemEvents.k_Loaded);
		}

		/** @inline */
		isResourceDisabled(): bool {
			return bf.testBit(this.iResourceFlags, <number>ResourceItemEvents.k_Disabled);
		}

		/** @inline */
		isResourceAltered(): bool {
			return bf.testBit(this.iResourceFlags, <number>ResourceItemEvents.k_Altered );
		}

		setAlteredFlag(isOn: bool = true): void {
    		this.setResourceFlag(ResourceItemEvents.k_Altered, isOn);
		}

		/** @inline */
		setResourceName(sName: string) {
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

		notifyStateChange(eEvent: ResourceItemEvents, pTarget: IResourcePoolItem = null): void {
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

		setResourceFlag(eFlagBit: ResourceItemEvents, isSetting: bool): void;
		setResourceFlag(iFlagBit: int, isSetting: bool): void;
		setResourceFlag(iFlagBit, isSetting: bool): void {
			var iTempFlags: int = this.iResourceFlags;
		    
		    bf.setBit(this.iResourceFlags, iFlagBit, isSetting);

		    if (iTempFlags != this.iResourceFlags) {
		        for (var i: int = 0; i < this.pCallbackFunctions.length; i++) {
		            if (this.pCallbackFunctions[i]) {
		                this.pCallbackFunctions[i].call(this, iFlagBit, this.iResourceFlags, isSetting);
		            }
		        }
		    }
		}

		static private parseEvent(sEvent: string): ResourceItemEvents;
		static private parseEvent(iEvent: int): ResourceItemEvents;
		static private parseEvent(pEvent) {
		 	if (isInt(pEvent)) {
		        return <ResourceItemEvents>pEvent;
		    }

		    switch (pEvent.toLowerCase()) {
		        case 'loaded':
		            return ResourceItemEvents.k_Loaded;
		        case 'created':
		            return ResourceItemEvents.k_Created;
		        case 'disabled':
		            return ResourceItemEvents.k_Disabled;
		        case 'altered':
		            return ResourceItemEvents.k_Altered;
		        default:
		            error('Использовано неизвестное событие для ресурса.');
		            return 0;
		    }
		}
	}

}