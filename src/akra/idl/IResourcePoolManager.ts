
/// <reference path="IManager.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IResourceCode.ts" />
/// <reference path="IResourcePool.ts" />
/// <reference path="IResourceWatcherFunc.ts" />
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IRenderMethod.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IVertexBuffer.ts" />
/// <reference path="IModel.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IEffect.ts" />
/// <reference path="IShaderProgram.ts" />
/// <reference path="IModel.ts" />
/// <reference path="IObj.ts" />

/** Семейства ресурсов */
module akra {
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
		EFFECTDATA_RESOURCE,
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
		getTexturePool(): IResourcePool<ITexture>;
		getSurfaceMaterialPool(): IResourcePool<ISurfaceMaterial>;
		getVertexBufferPool(): IResourcePool<IVertexBuffer>;
		getVideoBufferPool(): IResourcePool<IVertexBuffer>;
		getIndexBufferPool(): IResourcePool<IIndexBuffer>;
		getTextureBufferPool(): IResourcePool<IPixelBuffer>;
		getRenderMethodPool(): IResourcePool<IRenderMethod>;
		getColladaPool(): IResourcePool<ICollada>;
		getObjPool(): IResourcePool<IObj>;
		getImagePool(): IResourcePool<IImg>;			
		//ex: private
		getShaderProgramPool(): IResourcePool<IShaderProgram>;		
		//ex: private
		getEffectPool(): IResourcePool<IEffect>;				
		//ex: private
		getComponentPool(): IResourcePool<IAFXComponent>;			
		getEffectDataPool(): IResourcePool<IResourcePoolItem>;
	
		getRenderBufferPool(): IResourcePool<IPixelBuffer>;
	
		/** Регистрируется пул ресурсов опредленного типа в менеджере русурсов */
		registerResourcePool(pCode: IResourceCode, pPool: IResourcePool<IResourcePoolItem>): void;
		/** Удаляет пул ресурсов опредленного типа в менеджере русурсов */
		unregisterResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem>;
	
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
		findResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem>;
		/**
		 * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
		 **/
		findResourceHandle(pCode: IResourceCode, sName: string): int;
		/** Возвращает конкретный ресурс по его имени из конкретного пула опредленного типа */
		findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
		findResource(pCode: IResourceCode, iHandle: int): IResourcePoolItem;
	
		getModelPoolByFormat(eFormat: EModelFormats): IResourcePool<IResourcePoolItem>;
	
		/** Удаление всех ресурсов */
		destroyAll(): void;
		restoreAll(): void;
		disableAll(): void;
	
		clean(): void;
	
		createDeviceResources(): boolean;
		destroyDeviceResources(): boolean;
		restoreDeviceResources(): boolean;
		disableDeviceResources(): boolean;
	
		getEngine(): IEngine;
	
		createRenderMethod(sResourceName: string): IRenderMethod;
		createTexture(sResourceName: string): ITexture;
		createSurfaceMaterial(sResourceName: string): ISurfaceMaterial;
		createEffect(sResourceName: string): IEffect;
		createVertexBuffer(sResourceName: string): IVertexBuffer;
		createVideoBuffer(sResourceName: string): IVertexBuffer;
		createIndexBuffer(sResourceName: string): IIndexBuffer;
		createShaderProgram(sResourceName: string): IShaderProgram;
		createModel(sResourceName: string, eFormat?: EModelFormats): IModel;
	
		createImg(sResourceName: string): IImg;
		loadModel(sFilename: string, pOptions?: IModelLoadOptions): IModel;
		loadImage(sFilename: string): IImg;
	
	}
	
}
