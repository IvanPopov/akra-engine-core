/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IResourceWatcherFunc.ts" />
/// <reference path="../idl/IModel.ts" />

/// <reference path="../bf/bf.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../path/path.ts" />

/// <reference path="ResourceCode.ts" />
/// <reference path="ResourcePool.ts" />
/// <reference path="ResourcePoolItem.ts" />
/// <reference path="DataPool.ts" />

/// <reference path="resources/RenderMethod.ts" />
/// <reference path="resources/SurfaceMaterial.ts" />
/// <reference path="resources/Effect.ts" />
/// <reference path="resources/Img.ts" />
/// <reference path="resources/Component.ts" />

/// <reference path="resources/Collada.ts" />
/// <reference path="resources/Obj.ts" />
/// <reference path="resources/EffectData.ts" />


/// <reference path="../webgl/WebGLPixelBuffer.ts" />
/// <reference path="../webgl/WebGLInternalTexture.ts" />
/// <reference path="../webgl/WebGLVertexBuffer.ts" />
/// <reference path="../webgl/WebGLVertexTexture.ts" />
/// <reference path="../webgl/WebGLTextureBuffer.ts" />
/// <reference path="../webgl/WebGLShaderProgram.ts" />
/// <reference path="../webgl/WebGLIndexBuffer.ts" />
/// <reference path="../webgl/WebGLInternalRenderbuffer.ts" />
/// <reference path="../webgl/WebGLDepthBuffer.ts" />



module akra.pool {
	function determModelFormat(sPath: string): EModelFormats {
		switch ((path.parse(sPath).getExt() || "").toLowerCase()) {
			case "obj":
				return EModelFormats.OBJ;
			case "dae":
				return EModelFormats.COLLADA;
		}

		return EModelFormats.UNKNOWN;
	}

	//is this class really singleton??
	export class ResourcePoolManager implements IResourcePoolManager {
		//all predefined pools
		private pSurfaceMaterialPool: IResourcePool<ISurfaceMaterial>;
		private pEffectPool: IResourcePool<IEffect>;
		private pRenderMethodPool: IResourcePool<IRenderMethod>;
		private pVertexBufferPool: IResourcePool<IVertexBuffer>;
		private pIndexBufferPool: IResourcePool<IIndexBuffer>;
		private pColladaPool: IResourcePool<ICollada>;
		private pObjPool: IResourcePool<IObj>;
		private pImagePool: IResourcePool<IImg>;
		private pTexturePool: IResourcePool<ITexture>;
		private pVideoBufferPool: IResourcePool<IResourcePoolItem>;
		private pShaderProgramPool: IResourcePool<IShaderProgram>;
		private pComponentPool: IResourcePool<IAFXComponent>;
		private pTextureBufferPool: IResourcePool<IPixelBuffer>;
		private pRenderBufferPool: IResourcePool<IPixelBuffer>;
		private pDepthBufferPool: IResourcePool<IDepthBuffer>;
		private pEffectDataPool: IResourcePool<IResourcePoolItem>;

		/** Списки пулов по семействам ресурсов */
		private pResourceFamilyList: IResourcePool<IResourcePoolItem>[][] = null;
		/** Карта пулов по коду ресурса */
		private pResourceTypeMap: IResourcePool<IResourcePoolItem>[] = null;

		private pEngine: IEngine;

		getSurfaceMaterialPool(): IResourcePool<ISurfaceMaterial> {
			return this.pSurfaceMaterialPool;
		}

		getEffectPool(): IResourcePool<IEffect> {
			return this.pEffectPool;
		}

		getRenderMethodPool(): IResourcePool<IRenderMethod> {
			return this.pRenderMethodPool;
		}

		getVertexBufferPool(): IResourcePool<IVertexBuffer> {
			return this.pVertexBufferPool;
		}

		getIndexBufferPool(): IResourcePool<IIndexBuffer> {
			return this.pIndexBufferPool;
		}

		getColladaPool(): IResourcePool<ICollada> {
			return this.pColladaPool;
		}

		getObjPool(): IResourcePool<IObj> {
			return this.pObjPool;
		}

		getImagePool(): IResourcePool<IImg> {
			return this.pImagePool;
		}

		getTexturePool(): IResourcePool<ITexture> {
			return this.pTexturePool;
		}

		getVideoBufferPool(): IResourcePool<IResourcePoolItem> {
			return this.pVideoBufferPool;
		}

		getShaderProgramPool(): IResourcePool<IShaderProgram> {
			return this.pShaderProgramPool;
		}

		getComponentPool(): IResourcePool<IAFXComponent> {
			return this.pComponentPool;
		}

		getTextureBufferPool(): IResourcePool<IPixelBuffer> {
			return this.pTextureBufferPool;
		}

		getRenderBufferPool(): IResourcePool<IPixelBuffer> {
			return this.pRenderBufferPool;
		}

		getDepthBufferPool(): IResourcePool<IDepthBuffer> {
			return this.pDepthBufferPool;
		}

		getEffectDataPool(): IResourcePool<IResourcePoolItem> {
			return this.pEffectDataPool;
		}

		constructor(pEngine: IEngine) {
			//super();

			this.pEngine = pEngine;

			this.pResourceFamilyList = new Array<IResourcePool<IResourcePoolItem>[]>(EResourceFamilies.TOTAL_RESOURCE_FAMILIES);

			for (var i = 0; i < EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
				this.pResourceFamilyList[i] = new Array();
			}

			this.pResourceTypeMap = new Array();

			this.createDeviceResource();
		}

		initialize(): boolean {
			this.registerDeviceResources();
			return true;
		}

		destroy(): void {
			this.unregisterDeviceResources();
		}

		registerResourcePool(pCode: IResourceCode, pPool: IResourcePool<IResourcePoolItem>): void {
			debug.assert(pCode.getFamily() >= 0 && pCode.getFamily() < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES,
				"invalid code familyi index");

			debug.assert(!isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");

			this.pResourceTypeMap[pCode.toNumber()] = pPool;
			this.pResourceFamilyList[pCode.getFamily()].push(pPool);
		}

		unregisterResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem> {
			debug.assert(pCode.getFamily() >= 0, "invalid family index");
			debug.assert(pCode.getFamily() < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

			var iCode = pCode.toNumber();
			var pPool = null;
			if (this.pResourceTypeMap[iCode] != undefined) {
				pPool = this.pResourceTypeMap[iCode];
				delete this.pResourceTypeMap[iCode];
			}

			if (pPool != null) {
				for (var i in this.pResourceFamilyList[pCode.getFamily()]) {
					if (this.pResourceFamilyList[pCode.getFamily()][i] == pPool) {
						delete this.pResourceFamilyList[pCode.getFamily()][i];
						return pPool;
					}
				}
			}

			return pPool;
		}


		destroyResourceFamily(eFamily: EResourceFamilies): void {
			debug.assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");


			for (var i in this.pResourceFamilyList[eFamily]) {
				this.pResourceFamilyList[eFamily][i].destroyAll();
			}
		}

		restoreResourceFamily(eFamily: EResourceFamilies): void {
			debug.assert(eFamily >= 0, "invalid family index");
			debug.assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

			for (var i in this.pResourceFamilyList[eFamily]) {
				this.pResourceFamilyList[eFamily][i].restoreAll();
			}
		}

		disableResourceFamily(eFamily: EResourceFamilies): void {
			debug.assert(eFamily >= 0, "invalid family index");
			debug.assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

			for (var i in this.pResourceFamilyList[eFamily]) {
				this.pResourceFamilyList[eFamily][i].disableAll();
			}
		}

		cleanResourceFamily(eFamily: EResourceFamilies): void {
			debug.assert(eFamily >= 0, "invalid family index");
			debug.assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

			for (var i in this.pResourceFamilyList[eFamily]) {
				this.pResourceFamilyList[eFamily][i].clean();
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

		findResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem> {
			if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
				return this.pResourceTypeMap[pCode.toNumber()];
			}

			return null;
		}

		findResourceHandle(pCode: IResourceCode, sName: string): int {
			var pPool: IResourcePool<IResourcePoolItem> = this.findResourcePool(pCode);
			var iHandle: int = PoolGroup.INVALID_INDEX;

			if (!isNull(pPool)) {
				iHandle = pPool.findResourceHandle(sName);
			}

			return iHandle;
		}

		findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
		findResource(pCode: IResourceCode, iHandle: int): IResourcePoolItem;
		findResource(pCode, sName): IResourcePoolItem {
			var pPool: IResourcePool<IResourcePoolItem> = this.findResourcePool(pCode);
			var pResult: IResourcePoolItem = null;
			var iHandle: int = 0;

			if (isString(arguments[1])) {
				iHandle = pPool.findResourceHandle(sName);
			}
			else if (isInt(arguments[1])) {
				iHandle = arguments[1];
			}

			if (pPool != null && iHandle != PoolGroup.INVALID_INDEX) {
				pResult = pPool.getResource(iHandle);
			}

			return pResult;
		}

		destroyAll(): void {
			for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
				this.destroyResourceFamily(<EResourceFamilies><number>i);
			}
		}

		restoreAll(): void {
			for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
				this.restoreResourceFamily(<EResourceFamilies><number>i);
			}
		}

		disableAll(): void {
			for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
				this.disableResourceFamily(<EResourceFamilies><number>i);
			}
		}


		clean(): void {
			for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
				this.cleanResourceFamily(<EResourceFamilies><number>i);
			}
		}

		createDeviceResources(): boolean {
			return true;
		}

		destroyDeviceResources(): boolean {
			this.disableDeviceResources();

			// then destroy...
			debug.log("Destroying Video Device Resources\n");

			this.destroyResourceFamily(EResourceFamilies.VIDEO_RESOURCE);

			return true;
		}

		restoreDeviceResources(): boolean {
			debug.log("Restoring Video Device Resources\n");
			this.restoreResourceFamily(EResourceFamilies.VIDEO_RESOURCE);
			return true;
		}

		disableDeviceResources(): boolean {
			debug.log("Disabling Video Device Resources\n");
			this.disableResourceFamily(EResourceFamilies.VIDEO_RESOURCE);
			return true;
		}

		getEngine(): IEngine { return this.pEngine; }

		createRenderMethod(sResourceName: string): IRenderMethod {
			return <IRenderMethod>this.getRenderMethodPool().createResource(sResourceName);
		}

		createTexture(sResourceName: string): ITexture {
			return <ITexture>this.getTexturePool().createResource(sResourceName);
		}

		createEffect(sResourceName: string): IEffect {
			return <IEffect>this.getEffectPool().createResource(sResourceName);
		}

		createSurfaceMaterial(sResourceName: string): ISurfaceMaterial {
			return <ISurfaceMaterial>this.getSurfaceMaterialPool().createResource(sResourceName);
		}

		createVertexBuffer(sResourceName: string): IVertexBuffer {
			return <IVertexBuffer>this.getVertexBufferPool().createResource(sResourceName);
		}

		createVideoBuffer(sResourceName: string): IVertexBuffer {
			return <IVertexBuffer>this.getVideoBufferPool().createResource(sResourceName);
		}

		createIndexBuffer(sResourceName: string): IIndexBuffer {
			return <IIndexBuffer>this.getIndexBufferPool().createResource(sResourceName);
		}

		createShaderProgram(sResourceName: string): IShaderProgram {
			return <IShaderProgram>this.getShaderProgramPool().createResource(sResourceName);
		}

		createModel(sResourceName: string, eFormat?: EModelFormats): IModel {
			var pPool: IResourcePool<IResourcePoolItem> = this.getModelPoolByFormat(eFormat || determModelFormat(sResourceName));

			if (!isNull(pPool)) {
				return <IModel>pPool.createResource(sResourceName);
			}

			return null;
		}

		getModelPoolByFormat(eFormat: EModelFormats): IResourcePool<IResourcePoolItem> {
			switch (eFormat) {
				case EModelFormats.OBJ:
					return this.getObjPool();
				case EModelFormats.COLLADA:
					return this.getColladaPool();
			}

			return null;
		}

		loadModel(sFilename: string, pOptions: IModelLoadOptions = null): IModel {
			var eFormat: EModelFormats = determModelFormat(sFilename);
			var pPool: IResourcePool<IResourcePoolItem> = this.getModelPoolByFormat(eFormat);
			var pModel: IModel = null;

			if (!isNull(pPool)) {
				pModel = <IModel>pPool.findResource(sFilename);

				if (isNull(pModel)) {
					pModel = <IModel>pPool.createResource(sFilename);
				}

				if (!pModel.isResourceLoaded()) {
					pModel.loadResource(sFilename, pOptions);
				}

				return pModel;
			}

			return null;
		}

		createImg(sResourceName: string): IImg {
			return <IImg>this.getImagePool().createResource(sResourceName);
		}


		loadImage(sFilename: string): IImg {
			var pImg: IImg = <IImg>this.getImagePool().findResource(sFilename);

			if (isNull(pImg)) {
				pImg = <IImg>this.getImagePool().createResource(sFilename);

				if (!pImg.isResourceLoaded()) {
					pImg.loadResource(sFilename);
				}
			}

			return pImg;
		}


		private createDeviceResource(): void {
			this.pSurfaceMaterialPool = new ResourcePool<ISurfaceMaterial>(this, resources.SurfaceMaterial);
			this.pSurfaceMaterialPool.initialize(16);

			this.pEffectPool = new ResourcePool<IEffect>(this, resources.Effect);
			this.pEffectPool.initialize(16);

			this.pRenderMethodPool = new ResourcePool<IRenderMethod>(this, resources.RenderMethod);
			this.pRenderMethodPool.initialize(16);


			this.pColladaPool = new ResourcePool<ICollada>(this, resources.Collada);
			this.pColladaPool.initialize(0);

			this.pObjPool = new ResourcePool<IObj>(this, resources.Obj);
			this.pObjPool.initialize(0);

			this.pImagePool = new ResourcePool<IImg>(this, resources.Img);
			this.pImagePool.initialize(16);

			if (config.WEBGL) {
				this.pTexturePool = new ResourcePool<ITexture>(this, webgl.WebGLInternalTexture);
				this.pTexturePool.initialize(16);

				this.pIndexBufferPool = new ResourcePool<IIndexBuffer>(this, webgl.WebGLIndexBuffer);
				this.pIndexBufferPool.initialize(16);

				this.pVertexBufferPool = new ResourcePool<IVertexBuffer>(this, webgl.WebGLVertexBuffer);
				this.pVertexBufferPool.initialize(16);

				this.pVideoBufferPool = new ResourcePool<IResourcePoolItem>(this, webgl.WebGLVertexTexture);
				this.pVideoBufferPool.initialize(16);

				this.pTextureBufferPool = new ResourcePool<IPixelBuffer>(this, webgl.WebGLTextureBuffer);
				this.pTextureBufferPool.initialize(16);

				this.pShaderProgramPool = new ResourcePool<IShaderProgram>(this, webgl.WebGLShaderProgram);
				this.pShaderProgramPool.initialize(16);

				this.pRenderBufferPool = new ResourcePool<IPixelBuffer>(this, webgl.WebGLInternalRenderBuffer);
				this.pRenderBufferPool.initialize(16);

				this.pDepthBufferPool = new ResourcePool<IDepthBuffer>(this, webgl.WebGLDepthBuffer);
				this.pDepthBufferPool.initialize(16);
			}
			else {
				logger.critical("Render system not specified");
			}

			this.pEffectDataPool = new ResourcePool<IResourcePoolItem>(this, resources.EffectData);
			this.pEffectDataPool.initialize(8);


			this.pComponentPool = new ResourcePool<IAFXComponent>(this, resources.Component);
			this.pComponentPool.initialize(16);
		}

		private registerDeviceResources(): void {
			//debug.log("Registering Video Device Resources\n");
			this.pTexturePool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.TEXTURE_RESOURCE));
			this.pVertexBufferPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.VERTEXBUFFER_RESOURCE));
			this.pIndexBufferPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.INDEXBUFFER_RESOURCE));
			this.pEffectPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.EFFECT_RESOURCE));
			this.pRenderMethodPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.RENDERMETHOD_RESOURCE));
			this.pColladaPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.MODEL_RESOURCE | EModelFormats.COLLADA));
			this.pObjPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.MODEL_RESOURCE | EModelFormats.OBJ));
			this.pImagePool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.IMAGE_RESOURCE));
			this.pSurfaceMaterialPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.SURFACEMATERIAL_RESOURCE));
			this.pVideoBufferPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.VIDEOBUFFER_RESOURCE));
			this.pShaderProgramPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.SHADERPROGRAM_RESOURCE));
			this.pComponentPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.COMPONENT_RESOURCE));
			this.pEffectDataPool.registerResourcePool(
				new ResourceCode(
					<number>EResourceFamilies.VIDEO_RESOURCE,
					<number>EVideoResources.EFFECTDATA_RESOURCE));
		}

		private unregisterDeviceResources(): void {
			debug.log("Unregistering Video Device Resources");

			this.pTexturePool.unregisterResourcePool();
			this.pVertexBufferPool.unregisterResourcePool();
			this.pIndexBufferPool.unregisterResourcePool();
			this.pEffectPool.unregisterResourcePool();
			this.pRenderMethodPool.unregisterResourcePool();
			this.pColladaPool.unregisterResourcePool();
			this.pObjPool.unregisterResourcePool();
			this.pImagePool.unregisterResourcePool();
			this.pSurfaceMaterialPool.unregisterResourcePool();
			this.pVideoBufferPool.unregisterResourcePool();
			this.pShaderProgramPool.unregisterResourcePool();
			this.pComponentPool.unregisterResourcePool();
		}

		private static pTypedResourseTotal: uint[] = [
			<number>EVideoResources.TOTAL_VIDEO_RESOURCES,
			<number>EAudioResources.TOTAL_AUDIO_RESOURCES,
			<number>EGameResources.TOTAL_GAME_RESOURCES
		];
	}
}

