var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            var ResourcePool = (function (_super) {
                __extends(ResourcePool, _super);
                function ResourcePool(pEngine, tTemplate) {
                                _super.call(this);
                    this.pEngine = null;
                    /** Конструктор для создания данных в пуле ресурсов */
                    this.tTemplate = null;
                    this.sExt = null;
                    this.pRegistrationCode = new pool.ResourceCode(akra.EResourceCodes.INVALID_CODE);
                    this.pNameMap = /*{[index: number]: string;}*/ new Array();
                    this.pDataPool = null;
                    this.pEngine = pEngine;
                    this.tTemplate = tTemplate;
                    this.pDataPool = new pool.DataPool(pEngine, tTemplate);
                }
                /** Добавление данного пула в менеджер ресурсво по его коду */
                                Object.defineProperty(ResourcePool.prototype, "iFourcc", {
                    get: /** @inline */
                    function () {
                        return (this.sExt.charCodeAt(3) << 24) | (this.sExt.charCodeAt(2) << 16) | (this.sExt.charCodeAt(1) << 8) | (this.sExt.charCodeAt(0));
                    }/** @inline */
                    ,
                    set: function (iNewFourcc) {
                        this.sExt = String.fromCharCode((iNewFourcc & 255), (iNewFourcc & 65280) >>> 8, (iNewFourcc & 16711680) >>> 16, (iNewFourcc & 4278190080) >>> 24);
                    },
                    enumerable: true,
                    configurable: true
                });
                ResourcePool.prototype.registerResourcePool = function (pCode) {
                    this.pRegistrationCode.eq(pCode);
                    this.pEngine.getResourceManager().registerResourcePool(this.pRegistrationCode, this);
                }/** Удаление данного пула в менеджер ресурсво по его коду */
                ;
                ResourcePool.prototype.unregisterResourcePool = function () {
                    this.pEngine.getResourceManager().unregisterResourcePool(this.pRegistrationCode);
                    this.pRegistrationCode.setInvalid();
                }/** По имени ресурса возвращает его хендл */
                ;
                ResourcePool.prototype.findResourceHandle = function (sName) {
                    // look up the name in our map
                    var iNewHandle = akra.INVALID_INDEX;
                    for(var iHandle = 0; iHandle < this.pNameMap.length; ++iHandle) {
                        if(this.pNameMap[iHandle] === sName) {
                            return iHandle;
                        }
                    }
                    return iNewHandle;
                }/**
                * Get resource name by handle.
                * @inline
                */
                ;
                ResourcePool.prototype.findResourceName = function (iHandle) {
                    return this.pNameMap[iHandle];
                };
                ResourcePool.prototype.setResourceName = function (iHandle, sName) {
                    this.pNameMap[iHandle] = sName;
                };
                ResourcePool.prototype.initialize = function (iGrowSize) {
                    this.pDataPool.initialize(iGrowSize);
                }/** @inline */
                ;
                ResourcePool.prototype.destroy = function () {
                    this.pDataPool.destroy();
                };
                ResourcePool.prototype.clean = function () {
                    this.pDataPool.forEach(ResourcePool.callbackClean);
                };
                ResourcePool.prototype.destroyAll = function () {
                    this.pDataPool.forEach(ResourcePool.callbackDestroy);
                };
                ResourcePool.prototype.restoreAll = function () {
                    this.pDataPool.forEach(ResourcePool.callbackRestore);
                };
                ResourcePool.prototype.disableAll = function () {
                    this.pDataPool.forEach(ResourcePool.callbackDisable);
                }/** @inline */
                ;
                ResourcePool.prototype.isInitialized = function () {
                    return this.pDataPool.isInitialized();
                };
                ResourcePool.prototype.createResource = function (sResourceName) {
                    var iHandle = this.internalCreateResource(sResourceName);
                    if(iHandle !== akra.INVALID_INDEX) {
                        var pResource = this.getResource(iHandle);
                        pResource.setResourcePool(this);
                        pResource.setResourceHandle(iHandle);
                        pResource.setResourceCode(this.pRegistrationCode);
                        return pResource;
                    }
                    return null;
                };
                ResourcePool.prototype.loadResource = function (sResourceName) {
                    // does the resource already exist?
                    var pResource = this.findResource(sResourceName);
                    if(pResource == null) {
                        // create a new resource
                        pResource = this.createResource(sResourceName);
                        if(pResource != null) {
                            // attempt to load the desired data
                            if(pResource.loadResource(sResourceName)) {
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
                    if(pResource != null) {
                        // save the resource using it's own name as the file path
                        return pResource.saveResource();
                    }
                    return false;
                };
                ResourcePool.prototype.destroyResource = function (pResource) {
                    if(pResource != null) {
                        var iReferenceCount = pResource.referenceCount();
                        akra.debug_assert(iReferenceCount == 0, "destruction of non-zero reference count!");
                        if(iReferenceCount <= 0) {
                            var iHandle = pResource.resourceHandle;
                            this.internalDestroyResource(iHandle);
                        }
                    }
                };
                ResourcePool.prototype.findResource = function (sName) {
                    // look up the name in our map
                    for(var iHandle = 0; iHandle < this.pNameMap.length; ++iHandle) {
                        if(this.pNameMap[iHandle] == sName) {
                            if(iHandle != akra.INVALID_INDEX) {
                                var pResource = this.getResource(iHandle);
                                return pResource;
                            }
                        }
                    }
                    return null;
                };
                ResourcePool.prototype.getResource = function (iHandle) {
                    var pResource = this.internalGetResource(iHandle);
                    if(pResource != null) {
                        pResource.addRef();
                    }
                    return pResource;
                };
                ResourcePool.prototype.getResources = function () {
                    var pResources = [];
                    for(var iHandleResource in this.pNameMap) {
                        pResources.push(this.getResource(parseInt(iHandleResource)));
                    }
                    return pResources;
                };
                ResourcePool.prototype.internalGetResource = function (iHandle) {
                    return this.pDataPool.getPtr(iHandle);
                };
                ResourcePool.prototype.internalDestroyResource = function (iHandle) {
                    // get a pointer to the resource and call it's destruction handler
                    var pResource = this.pDataPool.getPtr(iHandle);
                    pResource.destroyResource();
                    delete this.pNameMap[iHandle];
                    // free the resource slot associated with the handle
                    this.pDataPool.release(iHandle);
                };
                ResourcePool.prototype.internalCreateResource = function (sResourceName) {
                    var iHandle = this.pDataPool.nextHandle();
                    // make sure this name is not already in use
                    for(var iter in this.pNameMap) {
                        akra.debug_assert((this.pNameMap[iter] != sResourceName), "A resource with this name already exists: " + sResourceName);
                    }
                    // add this resource name to our map of handles
                    this.pNameMap[iHandle] = sResourceName;
                    // get a pointer to the resource and call it's creation function
                    var pResource = this.pDataPool.getPtr(iHandle);
                    pResource.createResource();
                    return iHandle;
                };
                ResourcePool.callbackDestroy = function callbackDestroy(pPool, iHandle, pResource) {
                    pResource.destroyResource();
                }
                ResourcePool.callbackDisable = function callbackDisable(pPool, iHandle, pResource) {
                    pResource.disableResource();
                }
                ResourcePool.callbackRestore = function callbackRestore(pPool, iHandle, pResource) {
                    pResource.restoreResource();
                }
                ResourcePool.callbackClean = function callbackClean(pPool, iHandle, pResource) {
                    if(pResource.referenceCount() == 0) {
                        pPool.release(iHandle);
                    }
                }
                return ResourcePool;
            })(akra.util.ReferenceCounter);
            pool.ResourcePool = ResourcePool;            
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
