#ifndef RESOURCEPOOL_TS
#define RESOURCEPOOL_TS

#include "IEngine.ts"
#include "IResourcePool.ts"
#include "IResourcePoolItem.ts"
#include "IDataPool.ts"
#include "IResourceCode.ts"
#include "IResourcePoolManager.ts"
#include "util/ReferenceCounter.ts"
#include "events/events.ts"

module akra.core.pool {
    export class ResourcePool extends util.ReferenceCounter implements IResourcePool {
        private pManager: IResourcePoolManager = null;
        /** Конструктор для создания данных в пуле ресурсов */
        private tTemplate: IResourcePoolItemType = null;
        private sExt: string = null;
        private pRegistrationCode: IResourceCode = new ResourceCode(EResourceCodes.INVALID_CODE);
        private pNameMap: string[]/*{[index: number]: string;}*/ = new Array();
        private pDataPool: IDataPool = null;


        inline get iFourcc(): int {
            return (this.sExt.charCodeAt(3) << 24)
                      | (this.sExt.charCodeAt(2) << 16)
                      | (this.sExt.charCodeAt(1) << 8)
                      | (this.sExt.charCodeAt(0));
        }



        set iFourcc(iNewFourcc: int) {
            this.sExt = String.fromCharCode((iNewFourcc & 0x000000FF),
                                             (iNewFourcc & 0x0000FF00) >>> 8,
                                             (iNewFourcc & 0x00FF0000) >>> 16,
                                             (iNewFourcc & 0xFF000000) >>> 24);
        }

        inline get manager(): IResourcePoolManager {
            return this.pManager;
        }

        constructor (pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType) {
            super();

            this.pManager = pManager;
            this.tTemplate = tTemplate;
            this.pDataPool = new DataPool(this.pManager, tTemplate);
        }

        /** Добавление данного пула в менеджер ресурсво по его коду */
        registerResourcePool(pCode: IResourceCode): void {
            this.pRegistrationCode.eq(pCode);
            this.pManager.registerResourcePool(this.pRegistrationCode, this);
        }

        /** Удаление данного пула в менеджер ресурсво по его коду */
        unregisterResourcePool(): void {
            this.pManager.unregisterResourcePool(this.pRegistrationCode);
            this.pRegistrationCode.setInvalid();
        }

        /** По имени ресурса возвращает его хендл */
        findResourceHandle(sName: string): int {
            // look up the name in our map
            var iNewHandle = INVALID_INDEX;
            
            for (var iHandle: int = 0; iHandle < this.pNameMap.length; ++ iHandle) {
                if (this.pNameMap[iHandle] === sName) {
                    return iHandle;
                }
            }

            return iNewHandle;
        }

        /** 
         * Get resource name by handle.
         * @inline
         */
        findResourceName(iHandle: int): string {
            return this.pNameMap[iHandle];
        }

        setResourceName(iHandle: int, sName: string): void {
            this.pNameMap[iHandle] = sName;
        }


        initialize(iGrowSize: int): void {
            this.pDataPool.initialize(iGrowSize);
        }

        /** @inline */
        destroy(): void {
            this.pDataPool.destroy();
        }


        clean(): void {
            this.pDataPool.forEach(ResourcePool.callbackClean);
        }

        destroyAll(): void {
            this.pDataPool.forEach(ResourcePool.callbackDestroy);
        }

        restoreAll(): void {
            this.pDataPool.forEach(ResourcePool.callbackRestore);
        }

        disableAll(): void {
            this.pDataPool.forEach(ResourcePool.callbackDisable);
        }

        /** @inline */
        isInitialized(): bool {
            return this.pDataPool.isInitialized();
        }

       

        createResource(sResourceName: string): IResourcePoolItem {
            var iHandle: int = this.internalCreateResource(sResourceName);

            if (iHandle !== INVALID_INDEX) {
                var pResource: IResourcePoolItem = this.getResource(iHandle);

                pResource.setResourcePool(this);
                pResource.setResourceHandle(iHandle);
                pResource.setResourceCode(this.pRegistrationCode);

                this.createdResource(pResource);

                return pResource;
            }

            return null;
        }

        loadResource(sResourceName: string): IResourcePoolItem {
            // does the resource already exist?
            var pResource: IResourcePoolItem = this.findResource(sResourceName);
       
            if (pResource == null) {
                // create a new resource
                pResource = this.createResource(sResourceName);

                if (pResource != null) {
                    // attempt to load the desired data
                    if (pResource.loadResource(sResourceName)) {
                        // ok!
                        return pResource;
                    }

                    // loading failed.
                    // destroy the resource we created
                    // destroyResource(pResource);
                    pResource.release();
                    pResource = null;
                }
            }

            return pResource;
        }

        saveResource(pResource: IResourcePoolItem): bool {
            if (pResource != null) {
                // save the resource using it's own name as the file path
                return pResource.saveResource();
            }
            return false;
        }

        destroyResource(pResource: IResourcePoolItem): void {
            if (pResource != null) {
                var iReferenceCount: int = pResource.referenceCount();

                debug_assert(iReferenceCount == 0, "destruction of non-zero reference count!");

                if (iReferenceCount <= 0) {
                    var iHandle: int = pResource.resourceHandle;
                    this.internalDestroyResource(iHandle);
                }
            }
        }

        findResource(sName: string): IResourcePoolItem {

            // look up the name in our map
            for (var iHandle: int = 0; iHandle < this.pNameMap.length; ++ iHandle) {
                if (this.pNameMap[iHandle] == sName) {
                    if (iHandle != INVALID_INDEX) {
                        var pResource = this.getResource(iHandle);
                        return pResource;
                    }
                }
            }

            return null;
        }

        getResource(iHandle: int): IResourcePoolItem {
            var pResource: IResourcePoolItem = this.internalGetResource(iHandle);

            if (pResource != null) {
                pResource.addRef();
            }

            return pResource;
        }

        getResources(): IResourcePoolItem[] {
            var pResources: IResourcePoolItem[] = [];

            for (var iHandleResource in this.pNameMap) {
                pResources.push(this.getResource(parseInt(iHandleResource)));
            }

            return pResources;
        }


        private internalGetResource(iHandle: int): IResourcePoolItem {
            return this.pDataPool.getPtr(iHandle);
        }

        private internalDestroyResource(iHandle: int): void {
            // get a pointer to the resource and call it's destruction handler
            var pResource = this.pDataPool.getPtr(iHandle);

            pResource.destroyResource();

            delete this.pNameMap[iHandle];

            // free the resource slot associated with the handle
            this.pDataPool.release(iHandle);
        };

        private internalCreateResource(sResourceName: string): int {
            var iHandle: int = this.pDataPool.nextHandle();

            // make sure this name is not already in use
            for (var iter in this.pNameMap) {
                debug_assert((this.pNameMap[iter] != sResourceName),
                            "A resource with this name already exists: " + sResourceName);
            }

            // add this resource name to our map of handles
            this.pNameMap[iHandle] = sResourceName;

            // get a pointer to the resource and call it's creation function
            var pResource = this.pDataPool.getPtr(iHandle);

            pResource.createResource();

            return iHandle;
        }

        private static callbackDestroy(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            pResource.destroyResource();
        }

        private static callbackDisable(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            pResource.disableResource();
        }

        private static callbackRestore(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            pResource.restoreResource();
        }

        private static callbackClean(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            if (pResource.referenceCount() == 0) {
                pPool.release(iHandle);
            }
        }

        CREATE_EVENT_TABLE(ResourcePool);
        BROADCAST(createdResource, CALL(pResource));
       
    }
}

#endif
