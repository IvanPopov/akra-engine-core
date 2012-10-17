///<reference path="../akra.ts" />

module akra.pool {
	//is this class really singleton??
    export class ResourcePoolManager implements IResourcePoolManager {
    	/** Списки пулов по семействам ресурсов */
    	private pResourceFamilyList: IResourcePool[] = null;
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

    	unregisterResourcePool(pCode: IResourceCode): IResourcePool;

    	static private pTypedResourseTotal: uint[] = [
	        VideoResources.k_TotalVideoResources, 
	        AudioResources.k_TotalAudioResources,
	        GameResources.k_TotalGameResources
	    ];
    }
}