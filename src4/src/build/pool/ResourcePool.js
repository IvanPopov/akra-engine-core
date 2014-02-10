/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IDataPool.ts" />
/// <reference path="../idl/IResourceCode.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../util/ReferenceCounter.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="ResourceCode.ts" />
    /// <reference path="PoolGroup.ts" />
    /// <reference path="DataPool.ts" />
    (function (pool) {
        var ResourcePool = (function (_super) {
            __extends(ResourcePool, _super);
            function ResourcePool(pManager, tTemplate) {
                _super.call(this);
                this.guid = akra.guid();
                this._pManager = null;
                /** Конструктор для создания данных в пуле ресурсов */
                this._tTemplate = null;
                this._sExt = null;
                this._pRegistrationCode = new akra.pool.ResourceCode(4294967295 /* INVALID_CODE */);
                this._pNameMap = new Array();
                this._pDataPool = null;
                this.setupSignals();

                this._pManager = pManager;
                this._tTemplate = tTemplate;
                this._pDataPool = new akra.pool.DataPool(this._pManager, tTemplate);
            }
            ResourcePool.prototype.setupSignals = function () {
                this.createdResource = this.createdResource || new akra.Signal(this);
            };

            ResourcePool.prototype.getFourcc = function () {
                return (this._sExt.charCodeAt(3) << 24) | (this._sExt.charCodeAt(2) << 16) | (this._sExt.charCodeAt(1) << 8) | (this._sExt.charCodeAt(0));
            };

            ResourcePool.prototype.setFourcc = function (iNewFourcc) {
                this._sExt = String.fromCharCode((iNewFourcc & 0x000000FF), (iNewFourcc & 0x0000FF00) >>> 8, (iNewFourcc & 0x00FF0000) >>> 16, (iNewFourcc & 0xFF000000) >>> 24);
            };

            ResourcePool.prototype.getManager = function () {
                return this._pManager;
            };

            /** Добавление данного пула в менеджер ресурсво по его коду */
            ResourcePool.prototype.registerResourcePool = function (pCode) {
                this._pRegistrationCode.eq(pCode);
                this._pManager.registerResourcePool(this._pRegistrationCode, this);
            };

            /** Удаление данного пула в менеджер ресурсво по его коду */
            ResourcePool.prototype.unregisterResourcePool = function () {
                this._pManager.unregisterResourcePool(this._pRegistrationCode);
                this._pRegistrationCode.setInvalid();
            };

            /** По имени ресурса возвращает его хендл */
            ResourcePool.prototype.findResourceHandle = function (sName) {
                // look up the name in our map
                var iNewHandle = akra.pool.PoolGroup.INVALID_INDEX;

                for (var iHandle = 0; iHandle < this._pNameMap.length; ++iHandle) {
                    if (this._pNameMap[iHandle] === sName) {
                        return iHandle;
                    }
                }

                return iNewHandle;
            };

            /**
            * Get resource name by handle.
            * @
            */
            ResourcePool.prototype.findResourceName = function (iHandle) {
                return this._pNameMap[iHandle];
            };

            ResourcePool.prototype.setResourceName = function (iHandle, sName) {
                this._pNameMap[iHandle] = sName;
            };

            ResourcePool.prototype.initialize = function (iGrowSize) {
                this._pDataPool.initialize(iGrowSize);
            };

            /** @ */
            ResourcePool.prototype.destroy = function () {
                this._pDataPool.destroy();
            };

            ResourcePool.prototype.clean = function () {
                this._pDataPool.forEach(ResourcePool.callbackClean);
            };

            ResourcePool.prototype.destroyAll = function () {
                this._pDataPool.forEach(ResourcePool.callbackDestroy);
            };

            ResourcePool.prototype.restoreAll = function () {
                this._pDataPool.forEach(ResourcePool.callbackRestore);
            };

            ResourcePool.prototype.disableAll = function () {
                this._pDataPool.forEach(ResourcePool.callbackDisable);
            };

            /** @ */
            ResourcePool.prototype.isInitialized = function () {
                return this._pDataPool.isInitialized();
            };

            ResourcePool.prototype.createResource = function (sResourceName) {
                var iHandle = this.internalCreateResource(sResourceName);

                if (iHandle !== akra.pool.PoolGroup.INVALID_INDEX) {
                    var pResource = this.getResource(iHandle);

                    pResource.setResourcePool(this);
                    pResource.setResourceHandle(iHandle);
                    pResource.setResourceCode(this._pRegistrationCode);

                    this.createdResource.emit(pResource);

                    return pResource;
                }

                return null;
            };

            ResourcePool.prototype.loadResource = function (sResourceName) {
                // does the resource already exist?
                var pResource = this.findResource(sResourceName);

                if (pResource == null) {
                    // create a new resource
                    pResource = this.createResource(sResourceName);

                    if (pResource != null) {
                        // attempt to load the desired data
                        if (pResource.loadResource(sResourceName)) {
                            // ok!
                            return pResource;
                        }

                        // loading failed.
                        // destroy the resource we created
                        // destroyResource(pResource);
                        pResource.release();
                        pResource = null;
                    }
                }

                return pResource;
            };

            ResourcePool.prototype.saveResource = function (pResource) {
                if (pResource != null) {
                    // save the resource using it's own name as the file path
                    return pResource.saveResource();
                }
                return false;
            };

            ResourcePool.prototype.destroyResource = function (pResource) {
                if (pResource != null) {
                    var iReferenceCount = pResource.referenceCount();

                    akra.debug.assert(iReferenceCount == 0, "destruction of non-zero reference count!");

                    if (iReferenceCount <= 0) {
                        var iHandle = pResource.getResourceHandle();
                        this.internalDestroyResource(iHandle);
                    }
                }
            };

            ResourcePool.prototype.findResource = function (sName) {
                for (var iHandle = 0; iHandle < this._pNameMap.length; ++iHandle) {
                    if (this._pNameMap[iHandle] == sName) {
                        if (iHandle != akra.pool.PoolGroup.INVALID_INDEX) {
                            var pResource = this.getResource(iHandle);
                            return pResource;
                        }
                    }
                }

                return null;
            };

            ResourcePool.prototype.getResource = function (iHandle) {
                var pResource = this.internalGetResource(iHandle);

                if (pResource != null) {
                    pResource.addRef();
                }

                return pResource;
            };

            ResourcePool.prototype.getResources = function () {
                var pResources = [];

                for (var iHandleResource in this._pNameMap) {
                    pResources.push(this.getResource(parseInt(iHandleResource)));
                }

                return pResources;
            };

            ResourcePool.prototype.internalGetResource = function (iHandle) {
                return this._pDataPool.getPtr(iHandle);
            };

            ResourcePool.prototype.internalDestroyResource = function (iHandle) {
                // get a pointer to the resource and call it's destruction handler
                var pResource = this._pDataPool.getPtr(iHandle);

                pResource.destroyResource();

                delete this._pNameMap[iHandle];

                // free the resource slot associated with the handle
                this._pDataPool.release(iHandle);
            };

            ResourcePool.prototype.internalCreateResource = function (sResourceName) {
                var iHandle = this._pDataPool.nextHandle();

                for (var iter in this._pNameMap) {
                    akra.debug.assert((this._pNameMap[iter] != sResourceName), "A resource with this name already exists: " + sResourceName);
                }

                // add this resource name to our map of handles
                this._pNameMap[iHandle] = sResourceName;

                // get a pointer to the resource and call it's creation function
                var pResource = this._pDataPool.getPtr(iHandle);

                pResource.createResource();

                return iHandle;
            };

            ResourcePool.callbackDestroy = function (pPool, iHandle, pResource) {
                pResource.destroyResource();
            };

            ResourcePool.callbackDisable = function (pPool, iHandle, pResource) {
                pResource.disableResource();
            };

            ResourcePool.callbackRestore = function (pPool, iHandle, pResource) {
                pResource.restoreResource();
            };

            ResourcePool.callbackClean = function (pPool, iHandle, pResource) {
                if (pResource.referenceCount() == 0) {
                    pPool.release(iHandle);
                }
            };
            return ResourcePool;
        })(akra.util.ReferenceCounter);
        pool.ResourcePool = ResourcePool;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=ResourcePool.js.map
