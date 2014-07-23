


/// <reference path="IEngine.ts" />
/// <reference path="IResourceCode.ts" />
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IResourcePoolManager.ts" />
	
module akra {
		export interface IResourcePool<T extends IResourcePoolItem> extends IEventProvider {
			getFourcc(): int;
			setFourcc(iFourcc: int): void;

			getManager(): IResourcePoolManager;

			/** Добавление данного пула в менеджер ресурсво по его коду */
			registerResourcePool(pCode: IResourceCode): void;
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

			//callbackDestroy(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
			//callbackDisable(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
			//callbackRestore(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
			//callbackClean(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;

			createResource(sResourceName: string): T;
			loadResource(sResourceName: string): T;
			saveResource(pResource: T): boolean;
			destroyResource(pResource: T): void;

			findResource(sName: string): T;
			getResource(iHandle: int): T;
			getResources(): T[];

			createdResource: ISignal<{ (pPool: IResourcePool<T>, pResource: T): void; }>;
		}
}
