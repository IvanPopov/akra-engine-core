// AIResourcePool interface
// [write description here...]



/// <reference path="AIEngine.ts" />
/// <reference path="AIResourceCode.ts" />
/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIResourcePoolManager.ts" />
	
	interface AIResourcePool extends AIEventProvider {
			iFourcc: int;
			/** readonly */ manager: AIResourcePoolManager;

			/** Добавление данного пула в менеджер ресурсво по его коду */
			registerResourcePool(pCode: AIResourceCode): void;
			/** Удаление данного пула в менеджер ресурсво по его коду */
			unregisterResourcePool(): void;
			/** По имени ресурса возвращает его хендл */
			findResourceHandle(sName: string): int;
			/** По хендлу ресурва возвращает его имя */
			findResourceName(iHandle: int): string;

			/** set resource name */
			setResourceName(iHandle: int, sName: string): void;

			initialize(iGrowSize: int): void;
			destroy(): void;
			clean(): void;

			destroyAll(): void;
			restoreAll(): void;
			disableAll(): void;

			isInitialized(): boolean;

			//callbackDestroy(pPool: AIDataPool, iHandle: int, pResource: AIResourcePoolItem): void;
			//callbackDisable(pPool: AIDataPool, iHandle: int, pResource: AIResourcePoolItem): void;
			//callbackRestore(pPool: AIDataPool, iHandle: int, pResource: AIResourcePoolItem): void;
			//callbackClean(pPool: AIDataPool, iHandle: int, pResource: AIResourcePoolItem): void;

			createResource(sResourceName: string): AIResourcePoolItem;
			loadResource(sResourceName: string): AIResourcePoolItem;
			saveResource(pResource: AIResourcePoolItem): boolean;
			destroyResource(pResource: AIResourcePoolItem): void;

			findResource(sName: string): AIResourcePoolItem;
			getResource(iHandle: int): AIResourcePoolItem;
			getResources(): AIResourcePoolItem[];

			signal createdResource(pResource: AIResourcePoolItem): void;
	}