#ifndef IRESOURCEPOOL_TS
#define IRESOURCEPOOL_TS


module akra {
        
        IFACE(IEngine);
        IFACE(IResourceCode);
        IFACE(IResourcePoolItem);
        IFACE(IResourcePoolManager);
        
        export interface IResourcePool extends IEventProvider {
                iFourcc: int;
                readonly manager: IResourcePoolManager;

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

                isInitialized(): bool;

                //callbackDestroy(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
                //callbackDisable(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
                //callbackRestore(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
                //callbackClean(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;

                createResource(sResourceName: string): IResourcePoolItem;
                loadResource(sResourceName: string): IResourcePoolItem;
                saveResource(pResource: IResourcePoolItem): bool;
                destroyResource(pResource: IResourcePoolItem): void;

                findResource(sName: string): IResourcePoolItem;
                getResource(iHandle: int): IResourcePoolItem;
                getResources(): IResourcePoolItem[];

                signal createdResource(pResource: IResourcePoolItem): void;
        }
}

#endif
