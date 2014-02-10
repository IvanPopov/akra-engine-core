/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourceCode.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
/// <reference path="../idl/IResourceWatcherFunc.ts" />
/// <reference path="../idl/IResourceNotifyRoutineFunc.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />

/// <reference path="../util/ReferenceCounter.ts" />
/// <reference path="../common.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />
/// <reference path="../gen/generate.ts" />

/// <reference path="ResourceCode.ts" />

module akra.pool {

	export interface ICallbackSlot {
		state: boolean;
		fn: IResourceNotifyRoutineFunc;
		resource: IResourcePoolItem;
		event: EResourceItemEvents;
	}

	export class ResourcePoolItem extends util.ReferenceCounter implements IResourcePoolItem {
		guid: uint = guid();

		created: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		destroyed: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		loaded: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		unloaded: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		restored: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		disabled: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		altered: ISignal<{ (pResource: IResourcePoolItem): void; }>;
		saved: ISignal<{ (pResource: IResourcePoolItem): void; }>;

		stateChanged: ISignal<{ (pResource: IResourcePoolItem, eEvent: EResourceItemEvents, iFlags: uint, isSet: boolean); }>;

		private _pResourceCode: IResourceCode;
		private _pResourcePool: IResourcePool<IResourcePoolItem> = null;
		private _iResourceHandle: int = 0;
		private _iResourceFlags: int = 0;					//состояния самого ресурса
		private _iResourceSyncFlags: int = 0xFFFFFF;			//состояния зависимых ресурсов
		private _pCallbackSlots: ICallbackSlot[][];

		/** Constructor of ResourcePoolItem class */
		constructor(/*pManager: IResourcePoolManager*/) {
			super();
			this.setupSignals();

			//this.pManager = pManager;
			this._pResourceCode = new ResourceCode(0);
			this._pCallbackSlots = gen.array<ICallbackSlot[]>(<number>EResourceItemEvents.TOTALRESOURCEFLAGS);
		}

		protected setupSignals(): void {
			this.created = this.created || new Signal(<any>this);
			this.destroyed = this.destroyed || new Signal(<any>this);
			this.loaded = this.loaded || new Signal(<any>this);
			this.unloaded = this.unloaded || new Signal(<any>this);
			this.restored = this.restored || new Signal(<any>this);
			this.disabled = this.disabled || new Signal(<any>this);
			this.altered = this.altered || new Signal(<any>this);
			this.saved = this.saved || new Signal(<any>this);

			this.stateChanged = this.stateChanged || new Signal(<any>this);
		}

		getResourceCode(): IResourceCode {
			return this._pResourceCode;
		}

		getResourcePool(): IResourcePool<IResourcePoolItem> {
			return this._pResourcePool;
		}

		getResourceHandle(): int {
			return this._iResourceHandle;
		}

		getResourceFlags(): int {
			return this._iResourceFlags;
		}

		getAlteredFlag(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.ALTERED);
		}

		getEngine(): IEngine {
			var pManager: IResourcePoolManager = this.getManager();

			if (pManager) {
				return pManager.getEngine();
			}

			return null;
		}

		getManager(): IResourcePoolManager {
			return (<IResourcePool<IResourcePoolItem>>this._pResourcePool).getManager();
		}

		createResource(): boolean {
			return false;
		}

		destroyResource(): boolean {
			return false;
		}

		disableResource(): boolean {
			return false;
		}

		restoreResource(): boolean {
			return false;
		}

		loadResource(sFilename: string = null): boolean {
			return false;
		}

		saveResource(sFilename: string = null): boolean {
			return false;
		}

		isSyncedTo(eSlot: EResourceItemEvents): boolean {
			return !isNull(this._pCallbackSlots[eSlot]) && this._pCallbackSlots[eSlot].length > 0;
		}

		/**
		 * Find resources, that may affect the @eState of this resoyrces.
		 */
		findRelatedResources(eState: EResourceItemEvents): IResourcePoolItem[] {
			var pSlots: ICallbackSlot[] = this._pCallbackSlots[eState];
			var pRelatedResources: IResourcePoolItem[] = [];

			for (var i = 0; i < pSlots.length; ++i) {
				pRelatedResources.push(pSlots[i].resource);
			}

			return pRelatedResources;
		}

		isSyncComplete(eSignal: EResourceItemEvents): boolean {
			return bf.testBit(this._iResourceSyncFlags, eSignal);
		}

		private updateSyncState(eState: EResourceItemEvents): void {
			var pSignSlots: ICallbackSlot[] = this._pCallbackSlots[eState];

			for (var i: int = 0; i < pSignSlots.length; ++i) {
				if (pSignSlots[i].state === false) {
					bf.setBit(this._iResourceSyncFlags, eState, false);
					return;
				}
			}

			bf.setBit(this._iResourceSyncFlags, eState, true);
		}

		/**
		 * Sync resource with another.
		 * @param eSignal Signal of @pResourceItem
		 * @param eSlot State of this resource.
		 */
		sync(pResourceItem: IResourcePoolItem, eSignal: string, eSlot?: string): boolean;
		sync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
		sync(pResourceItem: IResourcePoolItem, eSignal: any, eSlot?: any): boolean {
			eSlot = isDef(eSlot) ? eSlot : eSignal;

			eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
			eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

			var pSlots: ICallbackSlot[][] = this._pCallbackSlots,
				pSignSlots: ICallbackSlot[] = pSlots[eSlot] = pSlots[eSlot] || [];

			var n: uint = pSignSlots.length;;		//n - number of signal slot, that contains 'pResourceItem'
			var fn: IResourceNotifyRoutineFunc;
			var bState: boolean;

			//current state of related resource
			bState = bf.testBit(pResourceItem.getResourceFlags(), <number>eSignal);

			fn = (pResourceItem: IResourcePoolItem, eFlag?: EResourceItemEvents, iResourceFlags?: int, isSet?: boolean) => {
				if (eFlag === eSignal) {
					pSignSlots[n].state = isSet;

					var bState: boolean = this.isSyncComplete(eSlot);
					this.updateSyncState(eSlot);

					if (this.isSyncComplete(eSlot) !== bState) {
						this.notifyStateChanged(eSlot);
					}
				}
			};

			pSignSlots.push({
				resource: pResourceItem, //related resource
				state: bState,			 //state of @signal
				fn: fn,					 //handler for @pResource.stateChanged event.
				event: eSignal			 //signal type
			});

			fn.call(pResourceItem, eSignal, pResourceItem.getResourceFlags(), bState);
			pResourceItem.stateChanged.connect(fn);

			return true;
		}

		unsync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean {
			eSlot = isDef(eSlot) ? eSlot : eSignal;
			eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
			eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

			var pSlots: ICallbackSlot[][] = this._pCallbackSlots, pSignSlots: ICallbackSlot[];
			var isRem: boolean = false;

			pSignSlots = pSlots[eSlot];

			for (var i: int = 0, n: uint = pSignSlots.length; i < n; ++i) {
				if (pSignSlots[i].resource === pResourceItem && pSignSlots[i].event == eSignal) {
					pSignSlots[i].resource.stateChanged.disconnect(pSignSlots[i].fn);
					pSignSlots.splice(i, 1);

					--n;
					--i;

					isRem = true;
				}
			}

			var bPrevValue: boolean = this.isSyncComplete(eSlot);
			this.updateSyncState(eSlot);

			if (bPrevValue != this.isSyncComplete(eSlot)) {
				this.notifyStateChanged(eSlot);
			}

			return isRem;
		}


		isResourceCreated(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.CREATED)
				&& this.isSyncComplete(EResourceItemEvents.CREATED);
		}

		isResourceLoaded(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.LOADED)
				&& this.isSyncComplete(EResourceItemEvents.LOADED);
		}

		isResourceDisabled(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.DISABLED)
				&& this.isSyncComplete(EResourceItemEvents.DISABLED);
		}

		isResourceAltered(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.ALTERED);
		}

		setResourceName(sName: string) {
			if (this._pResourcePool != null) {
				this._pResourcePool.setResourceName(this._iResourceHandle, sName);
			}
		}

		findResourceName(): string {
			if (this._pResourcePool != null) {
				return this._pResourcePool.findResourceName(this._iResourceHandle);
			}

			return null;
		}

		release(): uint {
			var iRefCount = super.release();

			if (iRefCount == 0) {
				//Если у нас есть менеджер попросим его удалить нас
				if (this._pResourcePool != null) {
					this._pResourcePool.destroyResource(this);
				}
			}

			return iRefCount;
		}



		notifyCreated(): void {
			this.setResourceFlag(EResourceItemEvents.CREATED, true);
		}

		notifyDestroyed(): void {
			this.setResourceFlag(EResourceItemEvents.CREATED, false);
		}

		notifyLoaded(): void {
			this.notifyAltered();
			this.setResourceFlag(EResourceItemEvents.LOADED, true);
		}

		notifyUnloaded(): void {
			this.setResourceFlag(EResourceItemEvents.LOADED, false);
		}

		notifyRestored(): void {
			this.setResourceFlag(EResourceItemEvents.DISABLED, false);
		}

		notifyDisabled(): void {
			this.setResourceFlag(EResourceItemEvents.DISABLED, true);
		}

		notifyAltered(): void {
			this.setResourceFlag(EResourceItemEvents.ALTERED, true);
		}

		notifySaved(): void {
			this.setResourceFlag(EResourceItemEvents.ALTERED, false);
		}

		/**
		 * Назначение кода ресурсу
		 * @
		 */
		setResourceCode(pCode: IResourceCode): void {
			this._pResourceCode.eq(pCode);
			
			//debug.error("created resource", this.guid, this.findResourceName(), this);
		}

		/**
		 * Чтобы ресурс знал какому пулу ресурсов принадлжит
		 * @
		 */
		setResourcePool(pPool: IResourcePool<IResourcePoolItem>): void {
			this._pResourcePool = pPool;
		}

		/**
		 * Назначение хендла ресурсу
		 * @
		 */
		setResourceHandle(iHandle: int): void {
			this._iResourceHandle = iHandle;
		}

		private notifyStateChanged(eState: EResourceItemEvents): void {
			var bState: boolean = bf.testBit(this._iResourceFlags, eState);

			if (((this.isSyncComplete(eState) && bState) || (!bState)) ||
				eState == EResourceItemEvents.ALTERED) {
				this.stateChanged.emit(eState, this._iResourceFlags, bState);
			
				switch (eState) {
					case EResourceItemEvents.LOADED:
						return bState ? this.loaded.emit() : this.unloaded.emit();
					case EResourceItemEvents.CREATED:
						return bState ? this.created.emit() : this.destroyed.emit();
					case EResourceItemEvents.DISABLED:
						return bState ? this.disabled.emit() : this.restored.emit();
					case EResourceItemEvents.ALTERED:
						return bState ? this.altered.emit() : this.saved.emit();
				}
			}
		}

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: boolean): boolean;
		setResourceFlag(iFlagBit: int, isSetting: boolean): boolean;
		setResourceFlag(iFlagBit, isSetting: boolean): boolean {
			var iTempFlags: int = this._iResourceFlags;

			this._iResourceFlags = bf.setBit(this._iResourceFlags, iFlagBit, isSetting);

			//ALTERED - specific signal, every time, when resource will be modified, alter will be emitted.
			if (iTempFlags !== this._iResourceFlags || iFlagBit === EResourceItemEvents.ALTERED) {
				//даже если состояние самого ресурса изменилось,
				//сигнал об этом не будет отослан пока он не получит статуст синхронизации
				this.notifyStateChanged(iFlagBit);
				return true;
			}

			return false;
		}

		private static parseEvent(sEvent: string): EResourceItemEvents;
		private static parseEvent(eEvent: EResourceItemEvents): EResourceItemEvents;
		private static parseEvent(pEvent): any {
			if (isInt(pEvent)) {
				return <EResourceItemEvents>pEvent;
			}

			switch (pEvent.toLowerCase()) {
				case ResourcePoolItem.LOADED:
					return EResourceItemEvents.LOADED;
				case ResourcePoolItem.CREATED:
					return EResourceItemEvents.CREATED;
				case ResourcePoolItem.DISABLED:
					return EResourceItemEvents.DISABLED;
				case ResourcePoolItem.ALTERED:
					return EResourceItemEvents.ALTERED;
				default:
					logger.error('Used unknown event type.');
			}
			
			return 0;
		}


		static DISABLED: string = "disabled";
		static ALTERED: string = "altered";
		static CREATED: string = "created";
		static LOADED: string = "loaded";
	}
}

