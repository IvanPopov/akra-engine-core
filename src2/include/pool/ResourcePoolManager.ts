///<reference path="../akra.ts" />

module akra.pool {
	//is this class really singleton??
    export class ResourcePoolManager implements IResourcePoolManager {
    	/** Списки пулов по семействам ресурсов */
    	private pResourceFamilyList: IResourcePool[][] = null;
    	/** Карта пулов по коду ресурса */
    	private pResourceTypeMap: IResourcePool[] = null;
    	/** Ресурс для ожидания остальных */
    	private pWaiterResource: IResourcePoolItem = null;

    	constructor(pEngine: IEngine) {
    		//super();

    		this.pResourceFamilyList = new Array(ResourceFamilies.TOTAL_RESOURCE_FAMILIES);

    		for (var i = 0; i < ResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
		        this.pResourceFamilyList[i] = new Array();
		    }

		    this.pResourceTypeMap = new Array();
		    this.pWaiterResource = new pool.ResourcePoolItem(pEngine);
    	}

        initialize(): bool {
            return true;
        }

        registerResourcePool(pCode: IResourceCode, pPool: IResourcePool): void {
            debug_assert(pCode.family >= 0 && pCode.family < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES,
                "invalid code familyi index");

            debug_assert(!isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");

            this.pResourceTypeMap[pCode.toNumber()] = pPool;
            this.pResourceFamilyList[pCode.family].push(pPool);
        }

    	unregisterResourcePool(pCode: IResourceCode): IResourcePool {
            debug_assert(pCode.family >= 0, "invalid family index");
            debug_assert(pCode.family < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            var iCode = pCode.toNumber();
            var pPool = null;
            if (this.pResourceTypeMap[iCode] != undefined) {
                pPool = this.pResourceTypeMap[iCode];
                delete this.pResourceTypeMap[iCode];
            }

            if (pPool != null) {
                for (var i in this.pResourceFamilyList[pCode.family]) {
                    if (this.pResourceFamilyList[pCode.family][i] == pPool) {
                        delete this.pResourceFamilyList[pCode.family][i];
                        return pPool;
                    }
                }
            }

            return pPool;
        }

        destroyResourceFamily(iFamily: int): void {
            debug_assert(iFamily >= 0, "invalid family index");
            debug_assert(iFamily < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");


            for (var i in this.pResourceFamilyList[iFamily]) {
                this.pResourceFamilyList[iFamily][i].destroyAll();
            }
        }

        restoreResourceFamily(iFamily: int): void {
            debug_assert(iFamily >= 0, "invalid family index");
            debug_assert(iFamily < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[iFamily]) {
                this.pResourceFamilyList[iFamily][i].restoreAll();
            }
        }

        disableResourceFamily(iFamily: int): void {
            debug_assert(iFamily >= 0, "invalid family index");
            debug_assert(iFamily < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[iFamily]) {
                this.pResourceFamilyList[iFamily][i].disableAll();
            }
        }

        cleanResourceFamily(iFamily: int): void  {
            debug_assert(iFamily >= 0, "invalid family index");
            debug_assert(iFamily < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[iFamily]) {
                this.pResourceFamilyList[iFamily][i].clean();
            }
        }

        destroyResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].destroyAll();
            }
        }

        restoreResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].restoreAll();
            }
        }

        disableResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].disableAll();
            }
        }

        cleanResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].clean();
            }
        }

        findResourcePool(pCode: IResourceCode): IResourcePool {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                return this.pResourceTypeMap[pCode.toNumber()];
            }

            return null;
        }

        findResourceHandle(pCode: IResourceCode, sName: string): int {
            var pPool: IResourcePool = this.findResourcePool(pCode);
            var iHandle: int = INVALID_INDEX;

            if (!isNull(pPool)) {
                iHandle = pPool.findResourceHandle(sName);
            }

            return iHandle;
        }

        findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
        findResource(pCode: IResourceCode, iHandle: int): IResourcePoolItem;
        findResource(pCode, sName): IResourcePoolItem {
            var pPool: IResourcePool = this.findResourcePool(pCode);
            var pResult: IResourcePoolItem = null;
            var iHandle: int;

            if (isString(arguments[1])) {
                iHandle = pPool.findResourceHandle(sName);
            }
            else if (isInt(arguments[1])) {
                iHandle = arguments[1];
            }
            
            if (pPool != null && iHandle != INVALID_INDEX) {
                pResult = pPool.getResource(iHandle);
            }

            return pResult;
        }

        monitorInitResources(fnMonitor: IResourceWatcherFunc): void {
            var me: IResourcePoolManager = this;
            
            this.pWaiterResource.setStateWatcher(ResourceItemEvents.k_Loaded, function () {
                fnMonitor.apply(me, arguments);
            });
        }

        setLoadedAllRoutine(fnCallback: Function): void {
            var pPool: IResourcePool;
            var pResource: IResourcePoolItem;
            var iHandleResource: int;
            var pWaiterResouse: IResourcePoolItem = this.pWaiterResource;

            var fnResCallback = function (iFlagBit?: int, iResourceFlags?: int, isSetting?: bool) {
                if (iFlagBit == <number>ResourceItemEvents.k_Loaded && isSetting) {
                    fnCallback();
                }
            };

            pWaiterResouse.notifyLoaded();

            for (var n: uint = 0; n < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES; n ++) {
                for (var i: int = 0; i < ResourcePoolManager.pTypedResourseTotal[n]; i ++) {
                    pPool = this.findResourcePool(new ResourceCode(n, i));
                    
                    if (pPool) {
                        var pResources: IResourcePoolItem[] = pPool.getResources();
                        var pResource: IResourcePoolItem;

                        for (var i: int = 0; i < pResources.length; ++ i) {
                            pResource = pResources[i];
                            pWaiterResouse.connect(pResource, ResourceItemEvents.k_Loaded);
                        }
                    }

                }
            }

            if (pWaiterResouse.isResourceLoaded()) {
                fnCallback();
            }
            else {
                pWaiterResouse.setChangesNotifyRoutine(fnResCallback);
            }
        }

        destroyAll(): void {
            for (var i: int = 0; i < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.destroyResourceFamily(i);
            }
        }

        restoreAll(): void {
            for (var i: int = 0; i < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.restoreResourceFamily(i);
            }
        }
        
        disableAll(): void {
            for (var i: int = 0; i < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.disableResourceFamily(i);
            }
        }
        

        clean(): void {
            for (var i: int = 0; i < <number>ResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.cleanResourceFamily(i);
            }
        }
        

    	static private pTypedResourseTotal: uint[] = [
	        <number>VideoResources.k_TotalVideoResources, 
	        <number>AudioResources.k_TotalAudioResources,
	        <number>GameResources.k_TotalGameResources
	    ];
    }
}