

/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IResourceWatcherFunc.ts" />
/// <reference path="AIResourceNotifyRoutineFunc.ts" />
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
		/** readonly */ resourceCode: IResourceCode;
		/** resource pool */
		/** readonly */ resourcePool: IResourcePool;
		/** resource handle */
		/** readonly */ resourceHandle: int;
		/** resource flags */
		/** readonly */ resourceFlags: int;
		/** Проверка был ли изменен ресур после загрузки */
		/** readonly */ alteredFlag: boolean;
	
		/** readonly */ manager: IResourcePoolManager;
	
		
		
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
		setChangesNotifyRoutine(fn: AIResourceNotifyRoutineFunc): void;
		delChangesNotifyRoutine(fn: AIResourceNotifyRoutineFunc): void;
	
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
		setResourcePool(pPool: IResourcePool): void;
		setResourceHandle(iHandle: int): void;
	
		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: boolean): boolean;
		setResourceFlag(iFlagBit: int, isSetting: boolean): boolean;
	
		signal created(): void;
		signal destroyed(): void;
		signal loaded(): void;
		signal unloaded(): void;
		signal restored(): void;
		signal disabled(): void;
		signal altered(): void;
		signal saved(): void;
	
	}
	
	export interface IResourcePoolItemType {
		new (pManager: IResourcePoolManager): IResourcePoolItem;
	}
	
}
