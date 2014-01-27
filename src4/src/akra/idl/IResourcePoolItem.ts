

/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IResourceWatcherFunc.ts" />
/// <reference path="IResourceNotifyRoutineFunc.ts" />
/// <reference path="IResourceCode.ts" />
/// <reference path="IResourcePool.ts" />
/// <reference path="IResourcePoolManager.ts" />

/**
 * Отражает состояние ресурса
 **/
module akra {
	export enum EResourceItemEvents {
		//ресур создан
		CREATED, 			
		//ресур заполнен данным и готов к использованию
		LOADED, 			
		//ресур в данный момент отключен для использования
		DISABLED, 
		//ресур был изменен после загрузки		
		ALTERED, 			
		TOTALRESOURCEFLAGS
	};
	
	export interface IResourcePoolItem extends IReferenceCounter, IEventProvider {
		/** resource code */
		getResourceCode(): IResourceCode;
		/** resource pool */
		getResourcePool(): IResourcePool<IResourcePoolItem>;
		/** resource handle */
		getResourceHandle(): int;
		/** resource flags */
		getResourceFlags(): int;
		/** Проверка был ли изменен ресур после загрузки */
		getAlteredFlag(): boolean;

	
		
		
		/** Get current Engine. */
		getEngine(): IEngine;
		getManager(): IResourcePoolManager;
	
		/** Инициализация ресурса, вызывается один раз. Виртуальная. */
		createResource(): boolean;
		/** Уничтожение ресурса. Виртуальная. */
		destroyResource(): boolean;
		/**  Удаление ресурса из энергозависимой памяти. Виртуальная. */
		disableResource(): boolean;
		/** Возвращение ресурса в энегрозависимю память. Виртуальная. */
		restoreResource(): boolean;
	
		/** Загрузка ресурса из файла, или null при использовании имени ресурса. Виртуальная. */
		loadResource(sFilename?: string): boolean;
		/** Сохранение ресурса в файл, или null при использовании имени ресурса. */
		saveResource(sFilename?: string): boolean;
	
		/** Добавление и удаление функции, которая будет вызываться при изменении состояния ресурса( fnFunc(iNewSost,iOldSost) ) */
		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;
		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;
	
		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void;
	
		/** sinchronize events with other resourse */
		isSyncedTo(eSlot: EResourceItemEvents): boolean;
		//sync(pResourceItem: IResourcePoolItem, sSignal: string, sSlot?: string): boolean;
		sync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
	
		//unsync(pResourceItem: IResourcePoolItem, sSignal: string, sSlot?: string): boolean;
		unsync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
	
		/** Установка состояния в созданный */
		notifyCreated(): void;
		/** Установка в состояние не созданный */
		notifyDestroyed(): void;
		/** Уставнока в состояние загруженный */
		notifyLoaded(): void;
		/** Уставнока в состояние незагруженный */
		notifyUnloaded(): void;
		/** Установка в состояние используемый */
		notifyRestored(): void;
		/** Установка в состояние не используемый */
		notifyDisabled(): void;
		/** Установка в состояние не используемый */
		notifyAltered(): void;
		/** Установка в состояние сохраненый */
		notifySaved(): void;
	
		notifyStateChange(eEvent: EResourceItemEvents, pTarget?: IResourcePoolItem);
	
		/** Проверка создан ли ресурс */
		isResourceCreated(): boolean;
		/** Проверка загружен ли ресурс */
		isResourceLoaded(): boolean;
		/** Проверка активен ли ресурс */
		isResourceDisabled(): boolean;
		/** Проверка обновлен ли ресурс */
		isResourceAltered(): boolean;
	
		/** Установка состояния в изменен после загружки */
		setAlteredFlag(isOn?: boolean): boolean;
	
		/** Пиписывание ресурсу имени */
		setResourceName(sName: string);
	
		/** Поиск имени ресурса */
		findResourceName(): string;
	
		/** оповещение о уменьшении количесва ссылок на ресурс */
		release(): uint;
	
		setResourceCode(pCode: IResourceCode): void;
		setResourcePool(pPool: IResourcePool<IResourcePoolItem>): void;
		setResourceHandle(iHandle: int): void;
	
		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: boolean): boolean;
		setResourceFlag(iFlagBit: int, isSetting: boolean): boolean;
	
		created: ISignal<{ (pResource: IResourcePoolItem): void; }> ;
		destroyed: ISignal <{ (pResource: IResourcePoolItem): void ; }> ;
		loaded: ISignal <{ (pResource: IResourcePoolItem): void; }> ;
		unloaded: ISignal <{ (pResource: IResourcePoolItem): void; }> ;
		restored: ISignal <{ (pResource: IResourcePoolItem): void; }> ;
		disabled: ISignal <{ (pResource: IResourcePoolItem): void; }> ;
		altered: ISignal <{ (pResource: IResourcePoolItem): void; }> ;
		saved: ISignal <{ (pResource: IResourcePoolItem): void; }> ;
	
	}
	
	export interface IResourcePoolItemType {
		new (pManager: IResourcePoolManager): IResourcePoolItem;
	}
	
}
