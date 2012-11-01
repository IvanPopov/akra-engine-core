///<reference path="../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            //is this class really singleton??
            var ResourcePoolManager = (function () {
                function ResourcePoolManager(pEngine) {
                    /** Списки пулов по семействам ресурсов */
                    this.pResourceFamilyList = null;
                    /** Карта пулов по коду ресурса */
                    this.pResourceTypeMap = null;
                    /** Ресурс для ожидания остальных */
                    this.pWaiterResource = null;
                    //super();
                    this.pEngine = pEngine;
                    this.pResourceFamilyList = new Array(akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES);
                    for(var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                        this.pResourceFamilyList[i] = new Array();
                    }
                    this.pResourceTypeMap = new Array();
                    this.pWaiterResource = new core.pool.ResourcePoolItem(pEngine);
                    this.createDeviceResource();
                }
                Object.defineProperty(ResourcePoolManager.prototype, "surfaceMaterialPool", {
                    get: function () {
                        return this.pSurfaceMaterialPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "effectPool", {
                    get: function () {
                        return this.pEffectPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "renderMethodPool", {
                    get: function () {
                        return this.pRenderMethodPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "vertexBufferPool", {
                    get: function () {
                        return this.pVertexBufferPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "indexBufferPool", {
                    get: function () {
                        return this.pIndexBufferPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "modelPool", {
                    get: function () {
                        return this.pModelPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "imagePool", {
                    get: function () {
                        return this.pImagePool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "texturePool", {
                    get: function () {
                        return this.pTexturePool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "videoBufferPool", {
                    get: function () {
                        return this.pVideoBufferPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "shaderProgramPool", {
                    get: function () {
                        return this.pShaderProgramPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ResourcePoolManager.prototype, "componentPool", {
                    get: function () {
                        return this.pComponentPool;
                    },
                    enumerable: true,
                    configurable: true
                });
                ResourcePoolManager.prototype.initialize = function () {
                    this.registerDeviceResources();
                    return true;
                };
                ResourcePoolManager.prototype.destroy = function () {
                    this.unregisterDeviceResources();
                };
                ResourcePoolManager.prototype.registerResourcePool = function (pCode, pPool) {
                    akra.debug_assert(pCode.family >= 0 && pCode.family < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid code familyi index");
                    akra.debug_assert(!akra.isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");
                    this.pResourceTypeMap[pCode.toNumber()] = pPool;
                    this.pResourceFamilyList[pCode.family].push(pPool);
                };
                ResourcePoolManager.prototype.unregisterResourcePool = function (pCode) {
                    akra.debug_assert(pCode.family >= 0, "invalid family index");
                    akra.debug_assert(pCode.family < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");
                    var iCode = pCode.toNumber();
                    var pPool = null;
                    if(this.pResourceTypeMap[iCode] != undefined) {
                        pPool = this.pResourceTypeMap[iCode];
                        delete this.pResourceTypeMap[iCode];
                    }
                    if(pPool != null) {
                        for(var i in this.pResourceFamilyList[pCode.family]) {
                            if(this.pResourceFamilyList[pCode.family][i] == pPool) {
                                delete this.pResourceFamilyList[pCode.family][i];
                                return pPool;
                            }
                        }
                    }
                    return pPool;
                };
                ResourcePoolManager.prototype.destroyResourceFamily = function (eFamily) {
                    akra.debug_assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");
                    for(var i in this.pResourceFamilyList[eFamily]) {
                        this.pResourceFamilyList[eFamily][i].destroyAll();
                    }
                };
                ResourcePoolManager.prototype.restoreResourceFamily = function (eFamily) {
                    akra.debug_assert(eFamily >= 0, "invalid family index");
                    akra.debug_assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");
                    for(var i in this.pResourceFamilyList[eFamily]) {
                        this.pResourceFamilyList[eFamily][i].restoreAll();
                    }
                };
                ResourcePoolManager.prototype.disableResourceFamily = function (eFamily) {
                    akra.debug_assert(eFamily >= 0, "invalid family index");
                    akra.debug_assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");
                    for(var i in this.pResourceFamilyList[eFamily]) {
                        this.pResourceFamilyList[eFamily][i].disableAll();
                    }
                };
                ResourcePoolManager.prototype.cleanResourceFamily = function (eFamily) {
                    akra.debug_assert(eFamily >= 0, "invalid family index");
                    akra.debug_assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");
                    for(var i in this.pResourceFamilyList[eFamily]) {
                        this.pResourceFamilyList[eFamily][i].clean();
                    }
                };
                ResourcePoolManager.prototype.destroyResourceType = function (pCode) {
                    if(akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                        this.pResourceTypeMap[pCode.toNumber()].destroyAll();
                    }
                };
                ResourcePoolManager.prototype.restoreResourceType = function (pCode) {
                    if(akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                        this.pResourceTypeMap[pCode.toNumber()].restoreAll();
                    }
                };
                ResourcePoolManager.prototype.disableResourceType = function (pCode) {
                    if(akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                        this.pResourceTypeMap[pCode.toNumber()].disableAll();
                    }
                };
                ResourcePoolManager.prototype.cleanResourceType = function (pCode) {
                    if(akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                        this.pResourceTypeMap[pCode.toNumber()].clean();
                    }
                };
                ResourcePoolManager.prototype.findResourcePool = function (pCode) {
                    if(akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                        return this.pResourceTypeMap[pCode.toNumber()];
                    }
                    return null;
                };
                ResourcePoolManager.prototype.findResourceHandle = function (pCode, sName) {
                    var pPool = this.findResourcePool(pCode);
                    var iHandle = akra.INVALID_INDEX;
                    if(!akra.isNull(pPool)) {
                        iHandle = pPool.findResourceHandle(sName);
                    }
                    return iHandle;
                };
                ResourcePoolManager.prototype.findResource = function (pCode, sName) {
                    var pPool = this.findResourcePool(pCode);
                    var pResult = null;
                    var iHandle;
                    if(akra.isString(arguments[1])) {
                        iHandle = pPool.findResourceHandle(sName);
                    } else {
                        if(akra.isInt(arguments[1])) {
                            iHandle = arguments[1];
                        }
                    }
                    if(pPool != null && iHandle != akra.INVALID_INDEX) {
                        pResult = pPool.getResource(iHandle);
                    }
                    return pResult;
                };
                ResourcePoolManager.prototype.monitorInitResources = function (fnMonitor) {
                    var me = this;
                    this.pWaiterResource.setStateWatcher(akra.EResourceItemEvents.k_Loaded, function () {
                        fnMonitor.apply(me, arguments);
                    });
                };
                ResourcePoolManager.prototype.setLoadedAllRoutine = function (fnCallback) {
                    var pPool;
                    var pResource;
                    var iHandleResource;
                    var pWaiterResouse = this.pWaiterResource;
                    var fnResCallback = function (iFlagBit, iResourceFlags, isSetting) {
                        if(iFlagBit == akra.EResourceItemEvents.k_Loaded && isSetting) {
                            fnCallback();
                        }
                    };
                    pWaiterResouse.notifyLoaded();
                    for(var n = 0; n < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; n++) {
                        for(var i = 0; i < ResourcePoolManager.pTypedResourseTotal[n]; i++) {
                            pPool = this.findResourcePool(new pool.ResourceCode(n, i));
                            if(pPool) {
                                var pResources = pPool.getResources();
                                var pResource;
                                for(var i = 0; i < pResources.length; ++i) {
                                    pResource = pResources[i];
                                    pWaiterResouse.connect(pResource, akra.EResourceItemEvents.k_Loaded);
                                }
                            }
                        }
                    }
                    if(pWaiterResouse.isResourceLoaded()) {
                        fnCallback();
                    } else {
                        pWaiterResouse.setChangesNotifyRoutine(fnResCallback);
                    }
                };
                ResourcePoolManager.prototype.destroyAll = function () {
                    for(var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                        this.destroyResourceFamily(i);
                    }
                };
                ResourcePoolManager.prototype.restoreAll = function () {
                    for(var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                        this.restoreResourceFamily(i);
                    }
                };
                ResourcePoolManager.prototype.disableAll = function () {
                    for(var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                        this.disableResourceFamily(i);
                    }
                };
                ResourcePoolManager.prototype.clean = function () {
                    for(var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                        this.cleanResourceFamily(i);
                    }
                };
                ResourcePoolManager.prototype.createDeviceResources = function () {
                    return true;
                };
                ResourcePoolManager.prototype.destroyDeviceResources = function () {
                    this.disableDeviceResources();
                    // then destroy...
                    akra.debug_print("Destroying Video Device Resources\n");
                    this.destroyResourceFamily(akra.EResourceFamilies.VIDEO_RESOURCE);
                    return true;
                };
                ResourcePoolManager.prototype.restoreDeviceResources = function () {
                    akra.debug_print("Restoring Video Device Resources\n");
                    this.restoreResourceFamily(akra.EResourceFamilies.VIDEO_RESOURCE);
                    return true;
                };
                ResourcePoolManager.prototype.disableDeviceResources = function () {
                    akra.debug_print("Disabling Video Device Resources\n");
                    this.disableResourceFamily(akra.EResourceFamilies.VIDEO_RESOURCE);
                    return true;
                };
                ResourcePoolManager.prototype.createDeviceResource = function () {
                    this.pSurfaceMaterialPool = new pool.ResourcePool(this.pEngine, pool.resources.SurfaceMaterial);
                    this.pSurfaceMaterialPool.initialize(16);
                    this.pEffectPool = new pool.ResourcePool(this.pEngine, pool.resources.Effect);
                    this.pEffectPool.initialize(16);
                    this.pRenderMethodPool = new pool.ResourcePool(this.pEngine, pool.resources.RenderMethod);
                    this.pRenderMethodPool.initialize(16);
                    this.pVertexBufferPool = new pool.ResourcePool(this.pEngine, pool.resources.VertexBuffer);
                    this.pVertexBufferPool.initialize(16);
                    this.pIndexBufferPool = new pool.ResourcePool(this.pEngine, pool.resources.IndexBuffer);
                    this.pIndexBufferPool.initialize(16);
                    this.pModelPool = new pool.ResourcePool(this.pEngine, pool.resources.Model);
                    this.pModelPool.initialize(16);
                    this.pImagePool = new pool.ResourcePool(this.pEngine, pool.resources.Img);
                    this.pImagePool.initialize(16);
                    this.pTexturePool = new pool.ResourcePool(this.pEngine, pool.resources.Texture);
                    this.pTexturePool.initialize(16);
                    this.pVideoBufferPool = new pool.ResourcePool(this.pEngine, pool.resources.VideoBuffer);
                    this.pVideoBufferPool.initialize(16);
                    this.pShaderProgramPool = new pool.ResourcePool(this.pEngine, pool.resources.ShaderProgram);
                    this.pShaderProgramPool.initialize(16);
                    this.pComponentPool = new pool.ResourcePool(this.pEngine, pool.resources.Component);
                    this.pComponentPool.initialize(16);
                };
                ResourcePoolManager.prototype.registerDeviceResources = function () {
                    akra.debug_print("Registering Video Device Resources\n");
                    this.pTexturePool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.TEXTURE_RESOURCE));
                    this.pVertexBufferPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.VERTEXBUFFER_RESOURCE));
                    this.pIndexBufferPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.INDEXBUFFER_RESOURCE));
                    this.pEffectPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.EFFECT_RESOURCE));
                    this.pRenderMethodPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.RENDERMETHOD_RESOURCE));
                    this.pModelPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.MODEL_RESOURCE));
                    this.pImagePool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.IMAGE_RESOURCE));
                    this.pSurfaceMaterialPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.SURFACEMATERIAL_RESOURCE));
                    this.pVideoBufferPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.VIDEOBUFFER_RESOURCE));
                    this.pShaderProgramPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.SHADERPROGRAM_RESOURCE));
                    this.pComponentPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.COMPONENT_RESOURCE));
                };
                ResourcePoolManager.prototype.unregisterDeviceResources = function () {
                    akra.debug_print("Unregistering Video Device Resources");
                    this.pTexturePool.unregisterResourcePool();
                    this.pVertexBufferPool.unregisterResourcePool();
                    this.pIndexBufferPool.unregisterResourcePool();
                    this.pEffectPool.unregisterResourcePool();
                    this.pRenderMethodPool.unregisterResourcePool();
                    this.pModelPool.unregisterResourcePool();
                    this.pImagePool.unregisterResourcePool();
                    this.pSurfaceMaterialPool.unregisterResourcePool();
                    this.pVideoBufferPool.unregisterResourcePool();
                    this.pShaderProgramPool.unregisterResourcePool();
                    this.pComponentPool.unregisterResourcePool();
                };
                ResourcePoolManager.pTypedResourseTotal = [
                    akra.EVideoResources.TOTAL_VIDEO_RESOURCES, 
                    akra.EAudioResources.TOTAL_AUDIO_RESOURCES, 
                    akra.EGameResources.TOTAL_GAME_RESOURCES
                ];
                return ResourcePoolManager;
            })();
            pool.ResourcePoolManager = ResourcePoolManager;            
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
