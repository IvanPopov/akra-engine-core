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
		bState: boolean;
		fn: IResourceNotifyRoutineFunc;
		pResourceItem: IResourcePoolItem;
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

		//private pManager: IResourcePoolManager;
		private _pResourceCode: IResourceCode;
		private _pResourcePool: IResourcePool<IResourcePoolItem> = null;
		private _iResourceHandle: int = 0;
		private _iResourceFlags: int = 0;
		private _pCallbackFunctions: IResourceNotifyRoutineFunc[];
		private _pStateWatcher: IResourceWatcherFunc[];
		private _pCallbackSlots: ICallbackSlot[][];

		/** Constructor of ResourcePoolItem class */
		constructor(/*pManager: IResourcePoolManager*/) {
			super();
			this.setupSignals();

			//this.pManager = pManager;
			this._pResourceCode = new ResourceCode(0);
			this._pCallbackFunctions = [];
			this._pStateWatcher = [];
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


		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void {
			for (var i: int = 0; i < this._pCallbackFunctions.length; i++) {

				if (this._pCallbackFunctions[i] == fn) {
					return;
				}
			}

			this._pCallbackFunctions.push(fn);
		}

		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void {
			for (var i: int = 0; i < this._pCallbackFunctions.length; i++) {
				if (this._pCallbackFunctions[i] == fn) {
					this._pCallbackFunctions[i] = null;
				}
			}
		}

		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void {
			this._pStateWatcher[eEvent] = fnWatcher;
		}

		isSyncedTo(eSlot: EResourceItemEvents): boolean {
			return !isNull(this._pCallbackSlots[eSlot]) && this._pCallbackSlots[eSlot].length > 0;
		}

		sync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean {
			eSlot = isDef(eSlot) ? eSlot : eSignal;

			eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
			eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

			var pSlots: ICallbackSlot[][] = this._pCallbackSlots, pSignSlots: ICallbackSlot[];

			var me: IResourcePoolItem = this;
			var n: uint;
			var fn: IResourceNotifyRoutineFunc;
			var bState: boolean;

			if (isNull(pSlots[eSlot])) {
				pSlots[eSlot] = [];
			}

			pSignSlots = pSlots[eSlot];
			n = pSignSlots.length;
			bState = bf.testBit(pResourceItem.getResourceFlags(), <number>eSignal);

			fn = function (eFlag?: EResourceItemEvents, iResourceFlags?: int, isSet?: boolean) {
				if (eFlag == <number>eSignal) {
					pSignSlots[n].bState = isSet;
					me.notifyStateChange(eSlot, this);

					for (var i: int = 0; i < pSignSlots.length; ++i) {
						if (pSignSlots[i].bState === false) {

							if (bf.testBit(me.getResourceFlags(), <number>eFlag)) {
								me.setResourceFlag(eFlag, false);
							}

							return;
						}
					}

					me.setResourceFlag(eFlag, true);
				}
			};

			pSignSlots.push({ bState: bState, fn: fn, pResourceItem: pResourceItem });

			fn.call(pResourceItem, eSignal, pResourceItem.getResourceFlags(), bState);
			pResourceItem.setChangesNotifyRoutine(fn);

			return true;
		}

		unsync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean {
			eSlot = isDef(eSlot) ? eSlot : eSignal;
			eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
			eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

			var pSlots: ICallbackSlot[][] = this._pCallbackSlots, pSignSlots: ICallbackSlot[];
			var me: IResourcePoolItem = this;
			var isRem: boolean = false;

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


		isResourceCreated(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.CREATED);
		}

		isResourceLoaded(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.LOADED);
		}

		isResourceDisabled(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.DISABLED);
		}

		isResourceAltered(): boolean {
			return bf.testBit(this._iResourceFlags, <number>EResourceItemEvents.ALTERED);
		}

		setAlteredFlag(isOn: boolean = true): boolean {
			//notify always, when altered called
			if (this.setResourceFlag(EResourceItemEvents.ALTERED, isOn) || isOn) {
				isOn ? this.altered.emit() : this.saved.emit();
				return true;
			}

			return false;
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
			if (this.setResourceFlag(EResourceItemEvents.CREATED, true)) {
				this.created.emit();
			}
		}

		notifyDestroyed(): void {
			if (this.setResourceFlag(EResourceItemEvents.CREATED, false)) {
				this.destroyed.emit();
			}
		}

		notifyLoaded(): void {
			this.setAlteredFlag(false);
			// LOG("ResourcePoolItem::notifyLoaded();");
			if (this.setResourceFlag(EResourceItemEvents.LOADED, true)) {
				// LOG("ResourcePoolItem::loaded();");
				this.loaded.emit();
			}
		}

		notifyUnloaded(): void {
			if (this.setResourceFlag(EResourceItemEvents.LOADED, false)) {
				this.unloaded.emit();
			}
		}

		notifyRestored(): void {
			if (this.setResourceFlag(EResourceItemEvents.DISABLED, false)) {
				this.restored.emit();
			}
		}

		notifyDisabled(): void {
			if (this.setResourceFlag(EResourceItemEvents.DISABLED, true)) {
				this.disabled.emit();
			}
		}

		notifyAltered(): void {
			this.setAlteredFlag(true);
		}

		notifySaved(): void {
			this.setAlteredFlag(false);
		}

		/**
		 * Назначение кода ресурсу
		 * @
		 */
		setResourceCode(pCode: IResourceCode): void {
			this._pResourceCode.eq(pCode);
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

		notifyStateChange(eEvent: EResourceItemEvents, pTarget: IResourcePoolItem = null): void {
			if (!this._pStateWatcher[eEvent]) {
				return;
			}

			var pSignSlots: ICallbackSlot[] = this._pCallbackSlots[eEvent];
			var nTotal: uint = pSignSlots.length, nLoaded: uint = 0;

			for (var i: int = 0; i < nTotal; ++i) {
				if (pSignSlots[i].bState) {
					++nLoaded;
				}
			}

			this._pStateWatcher[eEvent](nLoaded, nTotal, pTarget);
		}

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: boolean): boolean;
		setResourceFlag(iFlagBit: int, isSetting: boolean): boolean;
		setResourceFlag(iFlagBit, isSetting: boolean): boolean {
			var iTempFlags: int = this._iResourceFlags;

			this._iResourceFlags = bf.setBit(this._iResourceFlags, iFlagBit, isSetting);
			// LOG("before !=", iFlagBit, "(" + EResourceItemEvents.LOADED + ")", iTempFlags, "==>", this.iResourceFlags);

			if (iTempFlags != this._iResourceFlags) {
				// LOG("!+");
				for (var i: int = 0; i < this._pCallbackFunctions.length; i++) {
					if (this._pCallbackFunctions[i]) {
						this._pCallbackFunctions[i].call(this, iFlagBit, this._iResourceFlags, isSetting);
					}
				}

				return true;
			}

			return false;
		}

		private static parseEvent(sEvent: string): EResourceItemEvents;
		private static parseEvent(iEvent: int): EResourceItemEvents;
		private static parseEvent(pEvent) {
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
					logger.error('Использовано неизвестное событие для ресурса.');
					return 0;
			}
		}
	}
}

