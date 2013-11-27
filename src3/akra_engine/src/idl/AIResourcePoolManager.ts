// AIResourcePoolManager interface
// [write description here...]

/// <reference path="AIManager.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIResourceCode.ts" />
/// <reference path="AIResourcePool.ts" />
/// <reference path="AIResourceWatcherFunc.ts" />
/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIRenderMethod.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIVertexBuffer.ts" />
/// <reference path="AIModel.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIEffect.ts" />
/// <reference path="AIShaderProgram.ts" />
/// <reference path="AIModel.ts" />


/** Семейства ресурсов */
enum AEResourceFamilies {
	VIDEO_RESOURCE = 0, 
	AUDIO_RESOURCE, 
	GAME_RESOURCE, 
	TOTAL_RESOURCE_FAMILIES
};

/** Члены семейства видео ресурсов */
enum AEVideoResources {
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

enum AEAudioResources {
	TOTAL_AUDIO_RESOURCES
};

enum AEGameResources {
	TOTAL_GAME_RESOURCES
};

/** Конструктор класса, занимается очисткой списков пулов по семействам ресурсвов и краты пулов по коду ресурсов */
interface AIResourcePoolManager extends AIManager {
	texturePool: AIResourcePool;
	surfaceMaterialPool: AIResourcePool;
	vertexBufferPool: AIResourcePool;
	videoBufferPool: AIResourcePool;
	indexBufferPool: AIResourcePool;
	textureBufferPool: AIResourcePool;
	renderMethodPool: AIResourcePool;
	colladaPool: AIResourcePool;
	objPool: AIResourcePool;
	imagePool: AIResourcePool;			
	//ex: private
	shaderProgramPool: AIResourcePool;		
	//ex: private
	effectPool: AIResourcePool;				
	//ex: private
	componentPool: AIResourcePool;			
	effectDataPool: AIResourcePool;

	renderBufferPool: AIResourcePool;

	/** Регистрируется пул ресурсов опредленного типа в менеджере русурсов */
	registerResourcePool(pCode: AIResourceCode, pPool: AIResourcePool): void;
	/** Удаляет пул ресурсов опредленного типа в менеджере русурсов */
	unregisterResourcePool(pCode: AIResourceCode): AIResourcePool;

	/** Удаление ресурсов определенного семества */
	destroyResourceFamily(eFamily: AEResourceFamilies): void;
	restoreResourceFamily(eFamily: AEResourceFamilies): void;
	disableResourceFamily(eFamily: AEResourceFamilies): void;
	cleanResourceFamily(eFamily: AEResourceFamilies): void;

	destroyResourceType(pCode: AIResourceCode): void;
	restoreResourceType(pCode: AIResourceCode): void;
	disableResourceType(pCode: AIResourceCode): void;
	cleanResourceType(pCode: AIResourceCode): void;
	/** Возвращает пул ресурса опредленного типа по его коду */
	findResourcePool(pCode: AIResourceCode): AIResourcePool;
	/**
	 * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
	 **/
	findResourceHandle(pCode: AIResourceCode, sName: string): int;
	/** Возвращает конкретный ресурс по его имени из конкретного пула опредленного типа */
	findResource(pCode: AIResourceCode, sName: string): AIResourcePoolItem;
	findResource(pCode: AIResourceCode, iHandle: int): AIResourcePoolItem;

	getModelPoolByFormat(eFormat: AEModelFormats): AIResourcePool;

	/**
	 * @deprecated
	 */
	monitorInitResources(fnMonitor: AIResourceWatcherFunc): void;
	/**
	 * @deprecated
	 */
	setLoadedAllRoutine(fnCallback: Function): void;

	/** Удаление всех ресурсов */
	destroyAll(): void;
	restoreAll(): void;
	disableAll(): void;

	clean(): void;

	createDeviceResources(): boolean;
	destroyDeviceResources(): boolean;
	restoreDeviceResources(): boolean;
	disableDeviceResources(): boolean;

	getEngine(): AIEngine;

	createRenderMethod(sResourceName: string): AIRenderMethod;
	createTexture(sResourceName: string): AITexture;
	createSurfaceMaterial(sResourceName: string): AISurfaceMaterial;
	createEffect(sResourceName: string): AIEffect;
	createVertexBuffer(sResourceName: string): AIVertexBuffer;
	createVideoBuffer(sResourceName: string): AIVertexBuffer;
	createIndexBuffer(sResourceName: string): AIIndexBuffer;
	createShaderProgram(sResourceName: string): AIShaderProgram;
	createModel(sResourceName: string, eFormat?: AEModelFormats): AIModel;

	createImg(sResourceName: string): AIImg;
	loadModel(sFilename: string, pOptions?: AIModelLoadOptions): AIModel;
	loadImage(sFilename: string): AIImg;

}
