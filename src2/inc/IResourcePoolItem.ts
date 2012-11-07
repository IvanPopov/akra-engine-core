#ifndef IRESOURCEPOOLITEM_TS
#define IRESOURCEPOOLITEM_TS

#include "IReferenceCounter.ts"

module akra {

	IFACE(IEngine);
	IFACE(IResourceWatcherFunc);
	IFACE(IResourceNotifyRoutineFunc);
	IFACE(IResourceCode);
	IFACE(IResourcePool);
	IFACE(IResourcePoolManager);

	/**
     * Отражает состояние ресурса
     **/
    export enum EResourceItemEvents{
    	//ресур создан
		k_Created, 			
		//ресур заполнен данным и готов к использованию
		k_Loaded, 			
		//ресур в данный момент отключен для использования
		k_Disabled, 
		//ресур был изменен после загрузки		
		k_Altered, 			
		k_TotalResourceFlags
	};

	export interface IResourcePoolItem extends IReferenceCounter {
		/** resource code */
		readonly resourceCode: IResourceCode;
		/** resource pool */
		readonly resourcePool: IResourcePool;
		/** resource handle */
		readonly resourceHandle: int;
		/** resource flags */
		readonly resourceFlags: int;
		/** Проверка был ли изменен ресур после загрузки */
		readonly alteredFlag: bool;

		readonly manager: IResourcePoolManager;

		
		inline getGuid(): int;
		/** Get current Engine. */
		getEngine(): IEngine;

		/** Инициализация ресурса, вызывается один раз. Виртуальная. */
		createResource(): bool;
		/** Уничтожение ресурса. Виртуальная. */
		destroyResource(): bool;
		/**  Удаление ресурса из энергозависимой памяти. Виртуальная. */
		disableResource(): bool;
		/** Возвращение ресурса в энегрозависимю память. Виртуальная. */
		restoreResource(): bool;

		/** Загрузка ресурса из файла, или null при использовании имени ресурса. Виртуальная. */
		loadResource(sFilename?: string): bool;
		/** Сохранение ресурса в файл, или null при использовании имени ресурса. */
		saveResource(sFilename?: string): bool;

		/** Добавление и удаление функции, которая будет вызываться при изменении состояния ресурса( fnFunc(iNewSost,iOldSost) ) */
		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;
		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;

		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void;

		/** sinchronize events with other resourse */
		connect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool;
		disconnect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool;

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
		isResourceCreated(): bool;
		/** Проверка загружен ли ресурс */
		isResourceLoaded(): bool;
		/** Проверка активен ли ресурс */
		isResourceDisabled(): bool;
		/** Проверка обновлен ли ресурс */
		isResourceAltered(): bool;

		/** Установка состояния в изменен после загружки */
		setAlteredFlag(isOn?: bool): void;

		/** Пиписывание ресурсу имени */
		setResourceName(sName: string);

		/** Поиск имени ресурса */
		findResourceName(): string;

		/** оповещение о уменьшении количесва ссылок на ресурс */
		release(): uint;

		setResourceCode(pCode: IResourceCode): void;
		setResourcePool(pPool: IResourcePool): void;
		setResourceHandle(iHandle: int): void;

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: bool): void;
		setResourceFlag(iFlagBit: int, isSetting: bool): void;
	}

	export interface IResourcePoolItemType {
		new (pManager: IResourcePoolManager): IResourcePoolItem;
	}
}

#endif
