#ifndef RESOURCEPOOLMANAGER_TS
#define RESOURCEPOOLMANAGER_TS

#include "IEngine.ts"
#include "IResourcePoolManager.ts"
#include "IResourcePool.ts"
#include "IResourcePoolItem.ts"
#include "IResourceWatcherFunc.ts"
#include "IModel.ts"

#include "bf/bitflags.ts"
#include "ResourceCode.ts"
#include "ResourcePool.ts"
#include "DataPool.ts"

#include "resources/RenderMethod.ts"
#include "resources/SurfaceMaterial.ts"
//#include "resources/Model.ts"
#include "resources/Effect.ts"
#include "resources/Img.ts"
#include "resources/Component.ts"

#include "resources/Collada.ts"
#include "resources/EffectData.ts"

#ifdef WEBGL

#include "webgl/WebGLPixelBuffer.ts"
#include "webgl/WebGLInternalTexture.ts"
#include "webgl/WebGLVertexBuffer.ts"
#include "webgl/WebGLVertexTexture.ts"
#include "webgl/WebGLTextureBuffer.ts"
#include "webgl/WebGLShaderProgram.ts"
#include "webgl/WebGLIndexBuffer.ts"
#include "webgl/WebGLInternalRenderbuffer.ts"
#include "webgl/WebGLDepthBuffer.ts"

#endif



module akra.core.pool {
	//is this class really singleton??
    export class ResourcePoolManager implements IResourcePoolManager {
        //all predefined pools
        private pSurfaceMaterialPool: IResourcePool;
        private pEffectPool: IResourcePool;
        private pRenderMethodPool: IResourcePool;
        private pVertexBufferPool: IResourcePool;
        private pIndexBufferPool: IResourcePool;
        private pColladaPool: IResourcePool;
        private pImagePool: IResourcePool;
        private pTexturePool: IResourcePool;
        private pVideoBufferPool: IResourcePool;
        private pShaderProgramPool: IResourcePool;
        private pComponentPool: IResourcePool;
        private pTextureBufferPool: IResourcePool;
        private pRenderBufferPool: IResourcePool;
        private pDepthBufferPool: IResourcePool;
        private pEffectDataPool: IResourcePool;

    	/** Списки пулов по семействам ресурсов */
    	private pResourceFamilyList: IResourcePool[][] = null;
    	/** Карта пулов по коду ресурса */
    	private pResourceTypeMap: IResourcePool[] = null;
    	/** Ресурс для ожидания остальных */
    	private pWaiterResource: IResourcePoolItem = null;

        private pEngine: Engine;

        get surfaceMaterialPool(): IResourcePool { return this.pSurfaceMaterialPool; }
        get effectPool(): IResourcePool { return this.pEffectPool; }
        get renderMethodPool(): IResourcePool { return this.pRenderMethodPool; }
        get vertexBufferPool(): IResourcePool { return this.pVertexBufferPool; }
        get indexBufferPool(): IResourcePool { return this.pIndexBufferPool; }
        get colladaPool(): IResourcePool { return this.pColladaPool; }
        get imagePool(): IResourcePool { return this.pImagePool; }
        get texturePool(): IResourcePool { return this.pTexturePool; }
        get videoBufferPool(): IResourcePool { return this.pVideoBufferPool; }
        get shaderProgramPool(): IResourcePool { return this.pShaderProgramPool; }
        get componentPool(): IResourcePool { return this.pComponentPool; }
        get textureBufferPool(): IResourcePool {return this.pTextureBufferPool; }
        get renderBufferPool(): IResourcePool {return this.pRenderBufferPool; }
        get depthBufferPool(): IResourcePool {return this.pDepthBufferPool; }
        get effectDataPool(): IResourcePool {return this.pEffectDataPool; }

    	constructor(pEngine: IEngine) {
    		//super();

            this.pEngine = <Engine>pEngine;

    		this.pResourceFamilyList = new Array(EResourceFamilies.TOTAL_RESOURCE_FAMILIES);

    		for (var i = 0; i < EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
		        this.pResourceFamilyList[i] = new Array();
		    }

		    this.pResourceTypeMap = new Array();
		    this.pWaiterResource = new pool.ResourcePoolItem(/*this*/);

            this.createDeviceResource();
    	}

        initialize(): bool {
            this.registerDeviceResources();
            return true;
        }

        destroy(): void {
            this.unregisterDeviceResources();
        }

        registerResourcePool(pCode: IResourceCode, pPool: IResourcePool): void {
            debug_assert(pCode.family >= 0 && pCode.family < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES,
                "invalid code familyi index");

            debug_assert(!isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");

            this.pResourceTypeMap[pCode.toNumber()] = pPool;
            this.pResourceFamilyList[pCode.family].push(pPool);
        }

    	unregisterResourcePool(pCode: IResourceCode): IResourcePool {
            debug_assert(pCode.family >= 0, "invalid family index");
            debug_assert(pCode.family < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

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


        destroyResourceFamily(eFamily: EResourceFamilies): void {
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");


            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].destroyAll();
            }
        }

        restoreResourceFamily(eFamily: EResourceFamilies): void {
            debug_assert(eFamily >= 0, "invalid family index");
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].restoreAll();
            }
        }

        disableResourceFamily(eFamily: EResourceFamilies): void {
            debug_assert(eFamily >= 0, "invalid family index");
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].disableAll();
            }
        }

        cleanResourceFamily(eFamily: EResourceFamilies): void  {
            debug_assert(eFamily >= 0, "invalid family index");
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

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
            var iHandle: int = 0;

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
            
            this.pWaiterResource.setStateWatcher(EResourceItemEvents.LOADED, function () {
                fnMonitor.apply(me, arguments);
            });
        }

        setLoadedAllRoutine(fnCallback: Function): void {
            var pPool: IResourcePool;
            var pResource: IResourcePoolItem;
            var iHandleResource: int;
            var pWaiterResouse: IResourcePoolItem = this.pWaiterResource;

            var fnResCallback = function (iFlagBit?: int, iResourceFlags?: int, isSetting?: bool) {
                if (iFlagBit == <number>EResourceItemEvents.LOADED && isSetting) {
                    fnCallback();
                }
            };

            pWaiterResouse.notifyLoaded();

            for (var n: uint = 0; n < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; n ++) {
                for (var i: int = 0; i < ResourcePoolManager.pTypedResourseTotal[n]; i ++) {
                    pPool = this.findResourcePool(new ResourceCode(n, i));
                    
                    if (pPool) {
                        var pResources: IResourcePoolItem[] = pPool.getResources();
                        var pResource: IResourcePoolItem;

                        for (var i: int = 0; i < pResources.length; ++ i) {
                            pResource = pResources[i];
                            pWaiterResouse.sync(pResource, EResourceItemEvents.LOADED);
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
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.destroyResourceFamily(<EResourceFamilies><number>i);
            }
        }

        restoreAll(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.restoreResourceFamily(<EResourceFamilies><number>i);
            }
        }
        
        disableAll(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.disableResourceFamily(<EResourceFamilies><number>i);
            }
        }
        

        clean(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.cleanResourceFamily(<EResourceFamilies><number>i);
            }
        }

        createDeviceResources(): bool {
            return true;
        }

        destroyDeviceResources(): bool {
            this.disableDeviceResources();

            // then destroy...
            debug_print("Destroying Video Device Resources\n");
            
            this.destroyResourceFamily(EResourceFamilies.VIDEO_RESOURCE);

            return true;
        }

        restoreDeviceResources(): bool {
            debug_print("Restoring Video Device Resources\n");
            this.restoreResourceFamily(EResourceFamilies.VIDEO_RESOURCE);
            return true;
        }

        disableDeviceResources(): bool {
            debug_print("Disabling Video Device Resources\n");
            this.disableResourceFamily(EResourceFamilies.VIDEO_RESOURCE);
            return true;
        }

        inline getEngine(): Engine { return this.pEngine; }

        inline createRenderMethod(sResourceName: string): IRenderMethod {
            return <IRenderMethod>this.renderMethodPool.createResource(sResourceName);
        }

        inline createTexture(sResourceName: string): ITexture {
            return <ITexture>this.texturePool.createResource(sResourceName);
        }

        inline createEffect(sResourceName: string): IEffect {
            return <IEffect>this.effectPool.createResource(sResourceName);
        }

        inline createSurfaceMaterial(sResourceName: string): ISurfaceMaterial {
            return <ISurfaceMaterial>this.surfaceMaterialPool.createResource(sResourceName);
        }

        inline createVertexBuffer(sResourceName: string): IVertexBuffer {
            return <IVertexBuffer>this.vertexBufferPool.createResource(sResourceName);
        }

        inline createVideoBuffer(sResourceName: string): IVertexBuffer {
            return <IVertexBuffer>this.videoBufferPool.createResource(sResourceName);
        }

        inline createIndexBuffer(sResourceName: string): IIndexBuffer {
            return <IIndexBuffer>this.indexBufferPool.createResource(sResourceName);
        };

        inline createModel(sResourceName: string): IModel {
            return <IModel>this.colladaPool.createResource(sResourceName);   
        }

        inline createImg(sResourceName: string): IImg {
            return <IImg>this.imagePool.createResource(sResourceName);   
        }

        inline loadModel(sFilename: string, pOptions: any = null): IModel {
            if (util.pathinfo(sFilename).ext.toLowerCase() === "dae") {
                var pCollada: ICollada = <ICollada>this.colladaPool.findResource(sFilename);

                if (isNull(pCollada)) {
                    pCollada = <ICollada>this.colladaPool.createResource(sFilename);
                }

                if (!pCollada.isResourceLoaded()) {
                    pCollada.loadResource(sFilename, <IColladaLoadOptions>pOptions);
                }

                return pCollada;
            }

            return null;
        }



        private createDeviceResource(): void {
            this.pSurfaceMaterialPool = new ResourcePool(this, resources.SurfaceMaterial);
            this.pSurfaceMaterialPool.initialize(16);

            this.pEffectPool = new ResourcePool(this, resources.Effect);
            this.pEffectPool.initialize(16);

            this.pRenderMethodPool = new ResourcePool(this, resources.RenderMethod);
            this.pRenderMethodPool.initialize(16);


            this.pColladaPool = new ResourcePool(this, resources.Collada);
            this.pColladaPool.initialize(0);

            this.pImagePool = new ResourcePool(this, resources.Img);
            this.pImagePool.initialize(16);

#ifdef WEBGL
            this.pTexturePool = new ResourcePool(this, webgl.WebGLInternalTexture);
            this.pTexturePool.initialize(16);
            
            this.pIndexBufferPool = new ResourcePool(this, webgl.WebGLIndexBuffer);
            this.pIndexBufferPool.initialize(16);
            
            this.pVertexBufferPool = new ResourcePool(this, webgl.WebGLVertexBuffer);
            this.pVertexBufferPool.initialize(16);

            this.pVideoBufferPool = new ResourcePool(this, webgl.WebGLVertexTexture);
            this.pVideoBufferPool.initialize(16);

            this.pTextureBufferPool = new ResourcePool(this, webgl.WebGLTextureBuffer);
            this.pTextureBufferPool.initialize(16);
            
            this.pShaderProgramPool = new ResourcePool(this, webgl.WebGLShaderProgram);
            this.pShaderProgramPool.initialize(16);

            this.pRenderBufferPool = new ResourcePool(this, webgl.WebGLInternalRenderBuffer);
            this.pRenderBufferPool.initialize(16);

            this.pDepthBufferPool = new ResourcePool(this, webgl.WebGLDepthBuffer);
            this.pDepthBufferPool.initialize(16);
#else
            CRITICAL("Render system not specified");
#endif
            
            this.pEffectDataPool = new ResourcePool(this, resources.EffectData);
            this.pEffectDataPool.initialize(8);         


            this.pComponentPool = new ResourcePool(this, resources.Component);
            this.pComponentPool.initialize(16);
        }
        
        private registerDeviceResources(): void {
            debug_print("Registering Video Device Resources\n");
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
                    <number>EVideoResources.MODEL_RESOURCE));
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
            debug_print("Unregistering Video Device Resources");

            this.pTexturePool.unregisterResourcePool();
            this.pVertexBufferPool.unregisterResourcePool();
            this.pIndexBufferPool.unregisterResourcePool();
            this.pEffectPool.unregisterResourcePool();
            this.pRenderMethodPool.unregisterResourcePool();
            this.pColladaPool.unregisterResourcePool();
            this.pImagePool.unregisterResourcePool();
            this.pSurfaceMaterialPool.unregisterResourcePool();
            this.pVideoBufferPool.unregisterResourcePool();
            this.pShaderProgramPool.unregisterResourcePool();
            this.pComponentPool.unregisterResourcePool();
        }

    	static private pTypedResourseTotal: uint[] = [
	        <number>EVideoResources.TOTAL_VIDEO_RESOURCES, 
	        <number>EAudioResources.TOTAL_AUDIO_RESOURCES,
	        <number>EGameResources.TOTAL_GAME_RESOURCES
	    ];
    }
}

#endif