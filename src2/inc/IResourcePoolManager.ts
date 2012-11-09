#ifndef IRESOURCEPOOLMANAGER_TS
#define IRESOURCEPOOLMANAGER_TS

#include "IManager.ts"

module akra {

    IFACE(IEngine);
    IFACE(IResourceCode);
    IFACE(IResourcePool);
    IFACE(IResourceWatcherFunc);
    IFACE(IResourcePoolItem);

	/** Семейства ресурсов */
	export enum EResourceFamilies {
		VIDEO_RESOURCE = 0, 
		AUDIO_RESOURCE, 
		GAME_RESOURCE, 
		TOTAL_RESOURCE_FAMILIES
	};

	/** Члены семейства видео ресурсов */
	export enum EVideoResources {
		TEXTURE_RESOURCE,
		VIDEOBUFFER_RESOURCE,
		VERTEXBUFFER_RESOURCE,
		INDEXBUFFER_RESOURCE,
		EFFECT_RESOURCE,
		RENDERMETHOD_RESOURCE,
		MODEL_RESOURCE,
		EFFECTFILEDATA_RESOURCE,
		IMAGE_RESOURCE,
		SURFACEMATERIAL_RESOURCE,
		SHADERPROGRAM_RESOURCE,
		COMPONENT_RESOURCE,
		TOTAL_VIDEO_RESOURCES
	};

	export enum EAudioResources {
		TOTAL_AUDIO_RESOURCES
	};

	export enum EGameResources {
		TOTAL_GAME_RESOURCES
	};

	/** Конструктор класса, занимается очисткой списков пулов по семействам ресурсвов и краты пулов по коду ресурсов */
    export interface IResourcePoolManager extends IManager {
    	texturePool: IResourcePool;
    	surfaceMaterialPool: IResourcePool;
    	vertexBufferPool: IResourcePool;
    	videoBufferPool: IResourcePool;
    	indexBufferPool: IResourcePool;
    	renderMethodPool: IResourcePool;
    	modelPool: IResourcePool;
    	imagePool: IResourcePool;			
        //ex: private
    	shaderProgramPool: IResourcePool;		
        //ex: private
    	effectPool: IResourcePool;				
        //ex: private
    	componentPool: IResourcePool;			

    	/** Регистрируется пул ресурсов опредленного типа в менеджере русурсов */
    	registerResourcePool(pCode: IResourceCode, pPool: IResourcePool): void;
    	/** Удаляет пул ресурсов опредленного типа в менеджере русурсов */
    	unregisterResourcePool(pCode: IResourceCode): IResourcePool;

    	/** Удаление ресурсов определенного семества */
    	destroyResourceFamily(eFamily: EResourceFamilies): void;
    	restoreResourceFamily(eFamily: EResourceFamilies): void;
    	disableResourceFamily(eFamily: EResourceFamilies): void;
    	cleanResourceFamily(eFamily: EResourceFamilies): void;

    	destroyResourceType(pCode: IResourceCode): void;
    	restoreResourceType(pCode: IResourceCode): void;
    	disableResourceType(pCode: IResourceCode): void;
    	cleanResourceType(pCode: IResourceCode): void;
    	/** Возвращает пул ресурса опредленного типа по его коду */
    	findResourcePool(pCode: IResourceCode): IResourcePool;
    	/**
		 * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
		 **/
    	findResourceHandle(pCode: IResourceCode, sName: string): int;
    	/** Возвращает конкретный ресурс по его имени из конкретного пула опредленного типа */
    	findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
        findResource(pCode: IResourceCode, iHandle: int): IResourcePoolItem;

    	monitorInitResources(fnMonitor: IResourceWatcherFunc): void;
    	setLoadedAllRoutine(fnCallback: Function): void;

    	/** Удаление всех ресурсов */
    	destroyAll(): void;
    	restoreAll(): void;
    	disableAll(): void;

    	clean(): void;

    	createDeviceResources(): bool;
    	destroyDeviceResources(): bool;
    	restoreDeviceResources(): bool;
    	disableDeviceResources(): bool;

        getEngine(): IEngine;
    }
}

#endif
