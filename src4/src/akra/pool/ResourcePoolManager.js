var akra;
(function (akra) {
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
    (function (pool) {
        function determModelFormat(sPath) {
            switch ((akra.path.parse(sPath).ext || "").toLowerCase()) {
                case "obj":
                    return akra.EModelFormats.OBJ;
                case "dae":
                    return akra.EModelFormats.COLLADA;
            }

            return akra.EModelFormats.UNKNOWN;
        }

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

                for (var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                    this.pResourceFamilyList[i] = new Array();
                }

                this.pResourceTypeMap = new Array();
                this.pWaiterResource = new pool.ResourcePoolItem();

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
            Object.defineProperty(ResourcePoolManager.prototype, "colladaPool", {
                get: function () {
                    return this.pColladaPool;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolManager.prototype, "objPool", {
                get: function () {
                    return this.pObjPool;
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
            Object.defineProperty(ResourcePoolManager.prototype, "textureBufferPool", {
                get: function () {
                    return this.pTextureBufferPool;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolManager.prototype, "renderBufferPool", {
                get: function () {
                    return this.pRenderBufferPool;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolManager.prototype, "depthBufferPool", {
                get: function () {
                    return this.pDepthBufferPool;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolManager.prototype, "effectDataPool", {
                get: function () {
                    return this.pEffectDataPool;
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
                akra.debug.assert(pCode.family >= 0 && pCode.family < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid code familyi index");

                akra.debug.assert(!akra.isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");

                this.pResourceTypeMap[pCode.toNumber()] = pPool;
                this.pResourceFamilyList[pCode.family].push(pPool);
            };

            ResourcePoolManager.prototype.unregisterResourcePool = function (pCode) {
                akra.debug.assert(pCode.family >= 0, "invalid family index");
                akra.debug.assert(pCode.family < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

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
            };

            ResourcePoolManager.prototype.destroyResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].destroyAll();
                }
            };

            ResourcePoolManager.prototype.restoreResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily >= 0, "invalid family index");
                akra.debug.assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].restoreAll();
                }
            };

            ResourcePoolManager.prototype.disableResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily >= 0, "invalid family index");
                akra.debug.assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].disableAll();
                }
            };

            ResourcePoolManager.prototype.cleanResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily >= 0, "invalid family index");
                akra.debug.assert(eFamily < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].clean();
                }
            };

            ResourcePoolManager.prototype.destroyResourceType = function (pCode) {
                if (akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                    this.pResourceTypeMap[pCode.toNumber()].destroyAll();
                }
            };

            ResourcePoolManager.prototype.restoreResourceType = function (pCode) {
                if (akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                    this.pResourceTypeMap[pCode.toNumber()].restoreAll();
                }
            };

            ResourcePoolManager.prototype.disableResourceType = function (pCode) {
                if (akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                    this.pResourceTypeMap[pCode.toNumber()].disableAll();
                }
            };

            ResourcePoolManager.prototype.cleanResourceType = function (pCode) {
                if (akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                    this.pResourceTypeMap[pCode.toNumber()].clean();
                }
            };

            ResourcePoolManager.prototype.findResourcePool = function (pCode) {
                if (akra.isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                    return this.pResourceTypeMap[pCode.toNumber()];
                }

                return null;
            };

            ResourcePoolManager.prototype.findResourceHandle = function (pCode, sName) {
                var pPool = this.findResourcePool(pCode);
                var iHandle = pool.PoolGroup.INVALID_INDEX;

                if (!akra.isNull(pPool)) {
                    iHandle = pPool.findResourceHandle(sName);
                }

                return iHandle;
            };

            ResourcePoolManager.prototype.findResource = function (pCode, sName) {
                var pPool = this.findResourcePool(pCode);
                var pResult = null;
                var iHandle = 0;

                if (akra.isString(arguments[1])) {
                    iHandle = pPool.findResourceHandle(sName);
                } else if (akra.isInt(arguments[1])) {
                    iHandle = arguments[1];
                }

                if (pPool != null && iHandle != pool.PoolGroup.INVALID_INDEX) {
                    pResult = pPool.getResource(iHandle);
                }

                return pResult;
            };

            ResourcePoolManager.prototype.monitorInitResources = function (fnMonitor) {
                var me = this;

                this.pWaiterResource.setStateWatcher(akra.EResourceItemEvents.LOADED, function () {
                    fnMonitor.apply(me, arguments);
                });
            };

            ResourcePoolManager.prototype.setLoadedAllRoutine = function (fnCallback) {
                var pPool;
                var pResource;
                var iHandleResource;
                var pWaiterResouse = this.pWaiterResource;

                var fnResCallback = function (iFlagBit, iResourceFlags, isSetting) {
                    if (iFlagBit == akra.EResourceItemEvents.LOADED && isSetting) {
                        fnCallback();
                    }
                };

                pWaiterResouse.notifyLoaded();

                for (var n = 0; n < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; n++) {
                    var nTotal = parseInt(ResourcePoolManager.pTypedResourseTotal[n]);

                    for (var i = 0; i < nTotal; i++) {
                        pPool = this.findResourcePool(new pool.ResourceCode(n, i));

                        if (pPool) {
                            var pResources = pPool.getResources();
                            var pResource;

                            for (var h = 0; h < pResources.length; ++h) {
                                pResource = pResources[h];
                                pWaiterResouse.sync(pResource, akra.EResourceItemEvents.LOADED);
                            }
                        }
                    }
                }

                if (pWaiterResouse.isResourceLoaded()) {
                    fnCallback();
                } else {
                    pWaiterResouse.setChangesNotifyRoutine(fnResCallback);
                }
            };

            ResourcePoolManager.prototype.destroyAll = function () {
                for (var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                    this.destroyResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.restoreAll = function () {
                for (var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                    this.restoreResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.disableAll = function () {
                for (var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                    this.disableResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.clean = function () {
                for (var i = 0; i < akra.EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                    this.cleanResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.createDeviceResources = function () {
                return true;
            };

            ResourcePoolManager.prototype.destroyDeviceResources = function () {
                this.disableDeviceResources();

                // then destroy...
                akra.debug.log("Destroying Video Device Resources\n");

                this.destroyResourceFamily(akra.EResourceFamilies.VIDEO_RESOURCE);

                return true;
            };

            ResourcePoolManager.prototype.restoreDeviceResources = function () {
                akra.debug.log("Restoring Video Device Resources\n");
                this.restoreResourceFamily(akra.EResourceFamilies.VIDEO_RESOURCE);
                return true;
            };

            ResourcePoolManager.prototype.disableDeviceResources = function () {
                akra.debug.log("Disabling Video Device Resources\n");
                this.disableResourceFamily(akra.EResourceFamilies.VIDEO_RESOURCE);
                return true;
            };

            ResourcePoolManager.prototype.getEngine = function () {
                return this.pEngine;
            };

            ResourcePoolManager.prototype.createRenderMethod = function (sResourceName) {
                return this.renderMethodPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createTexture = function (sResourceName) {
                return this.texturePool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createEffect = function (sResourceName) {
                return this.effectPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createSurfaceMaterial = function (sResourceName) {
                return this.surfaceMaterialPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createVertexBuffer = function (sResourceName) {
                return this.vertexBufferPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createVideoBuffer = function (sResourceName) {
                return this.videoBufferPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createIndexBuffer = function (sResourceName) {
                return this.indexBufferPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createShaderProgram = function (sResourceName) {
                return this.shaderProgramPool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createModel = function (sResourceName, eFormat) {
                var pPool = this.getModelPoolByFormat(eFormat || determModelFormat(sResourceName));

                if (!akra.isNull(pPool)) {
                    return pPool.createResource(sResourceName);
                }

                return null;
            };

            ResourcePoolManager.prototype.getModelPoolByFormat = function (eFormat) {
                switch (eFormat) {
                    case akra.EModelFormats.OBJ:
                        return this.objPool;
                    case akra.EModelFormats.COLLADA:
                        return this.colladaPool;
                }

                return null;
            };

            ResourcePoolManager.prototype.loadModel = function (sFilename, pOptions) {
                if (typeof pOptions === "undefined") { pOptions = null; }
                var eFormat = determModelFormat(sFilename);
                var pPool = this.getModelPoolByFormat(eFormat);
                var pModel = null;

                if (!akra.isNull(pPool)) {
                    pModel = pPool.findResource(sFilename);

                    if (akra.isNull(pModel)) {
                        pModel = pPool.createResource(sFilename);
                    }

                    if (!pModel.isResourceLoaded()) {
                        pModel.loadResource(sFilename, pOptions);
                    }

                    return pModel;
                }

                return null;
            };

            ResourcePoolManager.prototype.createImg = function (sResourceName) {
                return this.imagePool.createResource(sResourceName);
            };

            ResourcePoolManager.prototype.loadImage = function (sFilename) {
                var pImg = this.imagePool.findResource(sFilename);

                if (akra.isNull(pImg)) {
                    pImg = this.imagePool.createResource(sFilename);

                    if (!pImg.isResourceLoaded()) {
                        pImg.loadResource(sFilename);
                    }
                }

                return pImg;
            };

            ResourcePoolManager.prototype.createDeviceResource = function () {
                this.pSurfaceMaterialPool = new pool.ResourcePool(this, resources.SurfaceMaterial);
                this.pSurfaceMaterialPool.initialize(16);

                this.pEffectPool = new pool.ResourcePool(this, resources.Effect);
                this.pEffectPool.initialize(16);

                this.pRenderMethodPool = new pool.ResourcePool(this, resources.RenderMethod);
                this.pRenderMethodPool.initialize(16);

                this.pColladaPool = new pool.ResourcePool(this, resources.Collada);
                this.pColladaPool.initialize(0);

                this.pObjPool = new pool.ResourcePool(this, resources.Obj);
                this.pObjPool.initialize(0);

                this.pImagePool = new pool.ResourcePool(this, resources.Img);
                this.pImagePool.initialize(16);

                if (akra.config.WEBGL) {
                    this.pTexturePool = new pool.ResourcePool(this, webgl.WebGLInternalTexture);
                    this.pTexturePool.initialize(16);

                    this.pIndexBufferPool = new pool.ResourcePool(this, webgl.WebGLIndexBuffer);
                    this.pIndexBufferPool.initialize(16);

                    this.pVertexBufferPool = new pool.ResourcePool(this, webgl.WebGLVertexBuffer);
                    this.pVertexBufferPool.initialize(16);

                    this.pVideoBufferPool = new pool.ResourcePool(this, webgl.WebGLVertexTexture);
                    this.pVideoBufferPool.initialize(16);

                    this.pTextureBufferPool = new pool.ResourcePool(this, webgl.WebGLTextureBuffer);
                    this.pTextureBufferPool.initialize(16);

                    this.pShaderProgramPool = new pool.ResourcePool(this, webgl.WebGLShaderProgram);
                    this.pShaderProgramPool.initialize(16);

                    this.pRenderBufferPool = new pool.ResourcePool(this, webgl.WebGLInternalRenderBuffer);
                    this.pRenderBufferPool.initialize(16);

                    this.pDepthBufferPool = new pool.ResourcePool(this, webgl.WebGLDepthBuffer);
                    this.pDepthBufferPool.initialize(16);
                } else {
                    akra.logger.critical("Render system not specified");
                }

                this.pEffectDataPool = new pool.ResourcePool(this, resources.EffectData);
                this.pEffectDataPool.initialize(8);

                this.pComponentPool = new pool.ResourcePool(this, resources.Component);
                this.pComponentPool.initialize(16);
            };

            ResourcePoolManager.prototype.registerDeviceResources = function () {
                //debug.log("Registering Video Device Resources\n");
                this.pTexturePool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.TEXTURE_RESOURCE));
                this.pVertexBufferPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.VERTEXBUFFER_RESOURCE));
                this.pIndexBufferPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.INDEXBUFFER_RESOURCE));
                this.pEffectPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.EFFECT_RESOURCE));
                this.pRenderMethodPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.RENDERMETHOD_RESOURCE));
                this.pColladaPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.MODEL_RESOURCE | akra.EModelFormats.COLLADA));
                this.pObjPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.MODEL_RESOURCE | akra.EModelFormats.OBJ));
                this.pImagePool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.IMAGE_RESOURCE));
                this.pSurfaceMaterialPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.SURFACEMATERIAL_RESOURCE));
                this.pVideoBufferPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.VIDEOBUFFER_RESOURCE));
                this.pShaderProgramPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.SHADERPROGRAM_RESOURCE));
                this.pComponentPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.COMPONENT_RESOURCE));
                this.pEffectDataPool.registerResourcePool(new pool.ResourceCode(akra.EResourceFamilies.VIDEO_RESOURCE, akra.EVideoResources.EFFECTDATA_RESOURCE));
            };

            ResourcePoolManager.prototype.unregisterDeviceResources = function () {
                akra.debug.log("Unregistering Video Device Resources");

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
            };

            ResourcePoolManager.pTypedResourseTotal = [
                akra.EVideoResources.TOTAL_VIDEO_RESOURCES,
                akra.EAudioResources.TOTAL_AUDIO_RESOURCES,
                akra.EGameResources.TOTAL_GAME_RESOURCES
            ];
            return ResourcePoolManager;
        })();
        pool.ResourcePoolManager = ResourcePoolManager;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
