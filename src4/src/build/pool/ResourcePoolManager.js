/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IResourceWatcherFunc.ts" />
/// <reference path="../idl/IModel.ts" />
var akra;
(function (akra) {
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
            switch ((akra.path.parse(sPath).getExt() || "").toLowerCase()) {
                case "obj":
                    return 8192 /* OBJ */;
                case "dae":
                    return 4096 /* COLLADA */;
            }

            return 0 /* UNKNOWN */;
        }

        //is this class really singleton??
        var ResourcePoolManager = (function () {
            function ResourcePoolManager(pEngine) {
                /** Списки пулов по семействам ресурсов */
                this.pResourceFamilyList = null;
                /** Карта пулов по коду ресурса */
                this.pResourceTypeMap = null;
                //super();
                this.pEngine = pEngine;

                this.pResourceFamilyList = new Array(3 /* TOTAL_RESOURCE_FAMILIES */);

                for (var i = 0; i < 3 /* TOTAL_RESOURCE_FAMILIES */; i++) {
                    this.pResourceFamilyList[i] = new Array();
                }

                this.pResourceTypeMap = new Array();

                this.createDeviceResource();
            }
            ResourcePoolManager.prototype.getSurfaceMaterialPool = function () {
                return this.pSurfaceMaterialPool;
            };

            ResourcePoolManager.prototype.getEffectPool = function () {
                return this.pEffectPool;
            };

            ResourcePoolManager.prototype.getRenderMethodPool = function () {
                return this.pRenderMethodPool;
            };

            ResourcePoolManager.prototype.getVertexBufferPool = function () {
                return this.pVertexBufferPool;
            };

            ResourcePoolManager.prototype.getIndexBufferPool = function () {
                return this.pIndexBufferPool;
            };

            ResourcePoolManager.prototype.getColladaPool = function () {
                return this.pColladaPool;
            };

            ResourcePoolManager.prototype.getObjPool = function () {
                return this.pObjPool;
            };

            ResourcePoolManager.prototype.getImagePool = function () {
                return this.pImagePool;
            };

            ResourcePoolManager.prototype.getTexturePool = function () {
                return this.pTexturePool;
            };

            ResourcePoolManager.prototype.getVideoBufferPool = function () {
                return this.pVideoBufferPool;
            };

            ResourcePoolManager.prototype.getShaderProgramPool = function () {
                return this.pShaderProgramPool;
            };

            ResourcePoolManager.prototype.getComponentPool = function () {
                return this.pComponentPool;
            };

            ResourcePoolManager.prototype.getTextureBufferPool = function () {
                return this.pTextureBufferPool;
            };

            ResourcePoolManager.prototype.getRenderBufferPool = function () {
                return this.pRenderBufferPool;
            };

            ResourcePoolManager.prototype.getDepthBufferPool = function () {
                return this.pDepthBufferPool;
            };

            ResourcePoolManager.prototype.getEffectDataPool = function () {
                return this.pEffectDataPool;
            };

            ResourcePoolManager.prototype.initialize = function () {
                this.registerDeviceResources();
                return true;
            };

            ResourcePoolManager.prototype.destroy = function () {
                this.unregisterDeviceResources();
            };

            ResourcePoolManager.prototype.registerResourcePool = function (pCode, pPool) {
                akra.debug.assert(pCode.getFamily() >= 0 && pCode.getFamily() < 3 /* TOTAL_RESOURCE_FAMILIES */, "invalid code familyi index");

                akra.debug.assert(!akra.isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");

                this.pResourceTypeMap[pCode.toNumber()] = pPool;
                this.pResourceFamilyList[pCode.getFamily()].push(pPool);
            };

            ResourcePoolManager.prototype.unregisterResourcePool = function (pCode) {
                akra.debug.assert(pCode.getFamily() >= 0, "invalid family index");
                akra.debug.assert(pCode.getFamily() < 3 /* TOTAL_RESOURCE_FAMILIES */, "invalid family index");

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
            };

            ResourcePoolManager.prototype.destroyResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily < 3 /* TOTAL_RESOURCE_FAMILIES */, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].destroyAll();
                }
            };

            ResourcePoolManager.prototype.restoreResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily >= 0, "invalid family index");
                akra.debug.assert(eFamily < 3 /* TOTAL_RESOURCE_FAMILIES */, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].restoreAll();
                }
            };

            ResourcePoolManager.prototype.disableResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily >= 0, "invalid family index");
                akra.debug.assert(eFamily < 3 /* TOTAL_RESOURCE_FAMILIES */, "invalid family index");

                for (var i in this.pResourceFamilyList[eFamily]) {
                    this.pResourceFamilyList[eFamily][i].disableAll();
                }
            };

            ResourcePoolManager.prototype.cleanResourceFamily = function (eFamily) {
                akra.debug.assert(eFamily >= 0, "invalid family index");
                akra.debug.assert(eFamily < 3 /* TOTAL_RESOURCE_FAMILIES */, "invalid family index");

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
                var iHandle = akra.pool.PoolGroup.INVALID_INDEX;

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

                if (pPool != null && iHandle != akra.pool.PoolGroup.INVALID_INDEX) {
                    pResult = pPool.getResource(iHandle);
                }

                return pResult;
            };

            ResourcePoolManager.prototype.destroyAll = function () {
                for (var i = 0; i < 3 /* TOTAL_RESOURCE_FAMILIES */; i++) {
                    this.destroyResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.restoreAll = function () {
                for (var i = 0; i < 3 /* TOTAL_RESOURCE_FAMILIES */; i++) {
                    this.restoreResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.disableAll = function () {
                for (var i = 0; i < 3 /* TOTAL_RESOURCE_FAMILIES */; i++) {
                    this.disableResourceFamily(i);
                }
            };

            ResourcePoolManager.prototype.clean = function () {
                for (var i = 0; i < 3 /* TOTAL_RESOURCE_FAMILIES */; i++) {
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

                this.destroyResourceFamily(0 /* VIDEO_RESOURCE */);

                return true;
            };

            ResourcePoolManager.prototype.restoreDeviceResources = function () {
                akra.debug.log("Restoring Video Device Resources\n");
                this.restoreResourceFamily(0 /* VIDEO_RESOURCE */);
                return true;
            };

            ResourcePoolManager.prototype.disableDeviceResources = function () {
                akra.debug.log("Disabling Video Device Resources\n");
                this.disableResourceFamily(0 /* VIDEO_RESOURCE */);
                return true;
            };

            ResourcePoolManager.prototype.getEngine = function () {
                return this.pEngine;
            };

            ResourcePoolManager.prototype.createRenderMethod = function (sResourceName) {
                return this.getRenderMethodPool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createTexture = function (sResourceName) {
                return this.getTexturePool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createEffect = function (sResourceName) {
                return this.getEffectPool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createSurfaceMaterial = function (sResourceName) {
                return this.getSurfaceMaterialPool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createVertexBuffer = function (sResourceName) {
                return this.getVertexBufferPool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createVideoBuffer = function (sResourceName) {
                return this.getVideoBufferPool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createIndexBuffer = function (sResourceName) {
                return this.getIndexBufferPool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.createShaderProgram = function (sResourceName) {
                return this.getShaderProgramPool().createResource(sResourceName);
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
                    case 8192 /* OBJ */:
                        return this.getObjPool();
                    case 4096 /* COLLADA */:
                        return this.getColladaPool();
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
                return this.getImagePool().createResource(sResourceName);
            };

            ResourcePoolManager.prototype.loadImage = function (sFilename) {
                var pImg = this.getImagePool().findResource(sFilename);

                if (akra.isNull(pImg)) {
                    pImg = this.getImagePool().createResource(sFilename);

                    if (!pImg.isResourceLoaded()) {
                        pImg.loadResource(sFilename);
                    }
                }

                return pImg;
            };

            ResourcePoolManager.prototype.createDeviceResource = function () {
                this.pSurfaceMaterialPool = new akra.pool.ResourcePool(this, akra.pool.resources.SurfaceMaterial);
                this.pSurfaceMaterialPool.initialize(16);

                this.pEffectPool = new akra.pool.ResourcePool(this, akra.pool.resources.Effect);
                this.pEffectPool.initialize(16);

                this.pRenderMethodPool = new akra.pool.ResourcePool(this, akra.pool.resources.RenderMethod);
                this.pRenderMethodPool.initialize(16);

                this.pColladaPool = new akra.pool.ResourcePool(this, akra.pool.resources.Collada);
                this.pColladaPool.initialize(0);

                this.pObjPool = new akra.pool.ResourcePool(this, akra.pool.resources.Obj);
                this.pObjPool.initialize(0);

                this.pImagePool = new akra.pool.ResourcePool(this, akra.pool.resources.Img);
                this.pImagePool.initialize(16);

                if (akra.config.WEBGL) {
                    this.pTexturePool = new akra.pool.ResourcePool(this, akra.webgl.WebGLInternalTexture);
                    this.pTexturePool.initialize(16);

                    this.pIndexBufferPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLIndexBuffer);
                    this.pIndexBufferPool.initialize(16);

                    this.pVertexBufferPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLVertexBuffer);
                    this.pVertexBufferPool.initialize(16);

                    this.pVideoBufferPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLVertexTexture);
                    this.pVideoBufferPool.initialize(16);

                    this.pTextureBufferPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLTextureBuffer);
                    this.pTextureBufferPool.initialize(16);

                    this.pShaderProgramPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLShaderProgram);
                    this.pShaderProgramPool.initialize(16);

                    this.pRenderBufferPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLInternalRenderBuffer);
                    this.pRenderBufferPool.initialize(16);

                    this.pDepthBufferPool = new akra.pool.ResourcePool(this, akra.webgl.WebGLDepthBuffer);
                    this.pDepthBufferPool.initialize(16);
                } else {
                    akra.logger.critical("Render system not specified");
                }

                this.pEffectDataPool = new akra.pool.ResourcePool(this, akra.pool.resources.EffectData);
                this.pEffectDataPool.initialize(8);

                this.pComponentPool = new akra.pool.ResourcePool(this, akra.pool.resources.Component);
                this.pComponentPool.initialize(16);
            };

            ResourcePoolManager.prototype.registerDeviceResources = function () {
                //debug.log("Registering Video Device Resources\n");
                this.pTexturePool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 0 /* TEXTURE_RESOURCE */));
                this.pVertexBufferPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 2 /* VERTEXBUFFER_RESOURCE */));
                this.pIndexBufferPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 3 /* INDEXBUFFER_RESOURCE */));
                this.pEffectPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 4 /* EFFECT_RESOURCE */));
                this.pRenderMethodPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 5 /* RENDERMETHOD_RESOURCE */));
                this.pColladaPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 6 /* MODEL_RESOURCE */ | 4096 /* COLLADA */));
                this.pObjPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 6 /* MODEL_RESOURCE */ | 8192 /* OBJ */));
                this.pImagePool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 8 /* IMAGE_RESOURCE */));
                this.pSurfaceMaterialPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 9 /* SURFACEMATERIAL_RESOURCE */));
                this.pVideoBufferPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 1 /* VIDEOBUFFER_RESOURCE */));
                this.pShaderProgramPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 10 /* SHADERPROGRAM_RESOURCE */));
                this.pComponentPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 11 /* COMPONENT_RESOURCE */));
                this.pEffectDataPool.registerResourcePool(new akra.pool.ResourceCode(0 /* VIDEO_RESOURCE */, 12 /* EFFECTDATA_RESOURCE */));
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
                13 /* TOTAL_VIDEO_RESOURCES */,
                0 /* TOTAL_AUDIO_RESOURCES */,
                0 /* TOTAL_GAME_RESOURCES */
            ];
            return ResourcePoolManager;
        })();
        pool.ResourcePoolManager = ResourcePoolManager;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=ResourcePoolManager.js.map
