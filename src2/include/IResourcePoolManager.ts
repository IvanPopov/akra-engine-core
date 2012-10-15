///<reference path="akra.ts" />

module akra {

	/** Семейства ресурсов */
	export enum ResourceFamilies{
		VIDEO_RESOURCE = 0, 
		AUDIO_RESOURCE, 
		GAME_RESOURCE, 
		TOTAL_RESOURCE_FAMILIES
	};

	/** Члены семейства видео ресурсов */
	export enum VideoResources {
		k_TextureResource,
		k_VideoBufferResource,
		k_VertexBufferResource,
		k_IndexBufferResource,
		k_RenderResource,
		k_RenderSetResource,
		k_ModelResource,
		k_EffectFileData,
		k_ImageResource,
		k_SMaterialResource,
		k_ShaderProgramResource,
		k_ComponentResource,
		k_TotalVideoResources
	};

	export enum AudioResources {
		k_TotalAudioResources
	};

	export enum GameResources {
		k_TotalGameResources
	};

	/** Конструктор класса, занимается очисткой списков пулов по семействам ресурсвов и краты пулов по коду ресурсов */
    export interface IResourcePoolManager extends IManager {
    	/** Регистрируется пул ресурсов опредленного типа в менеджере русурсов */
    	registerResourcePool(pCode: IResourceCode, pInterface: any): void;
    	/** Удаляет пул ресурсов опредленного типа в менеджере русурсов */
    	unregisterResourcePool(pCode: IResourceCode): any;

    	/** Удаление ресурсов определенного семества */
    	destroyResourceFamily(iFamily: int): void;
    	restoreResourceFamily(iFamily: int): void;
    	disableResourceFamily(iFamily: int): void;
    	cleanResourceFamily(iFamily: int): void;

    	destroyResourceType(pCode: IResourceCode): void;
    	restoreResourceType(pCode: IResourceCode): void;
    	disableResourceType(pCode: IResourceCode): void;
    	cleanResourceType(pCode: IResourceCode): void;
    	/** Возвращает пул ресурса опредленного типа по его коду */
    	findResourcePool(pCode: IResourceCode): IResourcePool
    	/**
		 * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
		 **/
    	findResourceHandle(pCode: IResourceCode, sName: string): uint;

    	monitorInitResources(fnMonitor: Function): void;
    	setLoadedAllRoutine(fnCallback: Function): void;

    	/** Удаление всех ресурсов */
    	destroyAll(): void;
    	restoreAll(): void;
    	disableAll(): void;

    	clean(): void;

    }
}