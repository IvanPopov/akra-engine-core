/**
 * @file
 * @brief ResourcePool class.
 * @author xoma
 * @email xoma@odserve.org
 * Надстойрка над пулом данных, специализированная чтобы хранить ресурсы
 **/

/**
 * @property ResourcePoolInterface()
 * __DESCRIPTION__
 * @memberof ResourcePoolInterface
 **/

/**
 * ResourcePoolInterface Class
 * @ctor
 * Constructor of ResourcePoolInterface class
 **/

function ResourcePoolInterface (pEngine, fnTemplate) {
    debug_assert(fnTemplate != undefined, "Type data not defined");

    this._pEngine = pEngine;
    /**
     * Конструктор для создания данных в пуле ресурсов
     * @type Function
     * @memberof ResourcePool
     **/
    this._fnTemplate = fnTemplate;

    /**
     * __DESCRIPTION__
     * @type String
     * @memberof ResourcePoolInterface
     **/
    this.sExt = null;
    /**
     * __DESCRIPTION__
     * @type Int
     * @memberof ResourcePoolInterface
     **/
    this._pRegistrationCode = new a.ResourceCode(a.ResourceCode.INVALID_CODE);
    /**
     * __DESCRIPTION__
     * @type Array
     * @memberof ResourcePoolInterface
     **/
    this._pNameMap = new Array();
    this._pNameMap.splice(0);
}
;

/**
 * @property initialize(Int iGrowSize)
 * Виртуальная.
 * @param iGrowSize
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.initialize = function (iGrowSize) {
};

/**
 * @property destroy()
 * Виртуальная.
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.destroy = function () {
};

/**
 * @property isInitialized()
 * Виртуальная.
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.isInitialized = function () {
};

/**
 * @property destroyAll()
 * Виртуальная.
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.destroyAll = function () {
};

/**
 * @property disableAll()
 * Виртуальная.
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.disableAll = function () {
};

/**
 * @property restoreAll()
 * Виртуальная.
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.restoreAll = function () {
};

/**
 * @property clean()
 * Виртуальная.
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.clean = function () {
};

/**
 * @property _internalCreateResource(String sResourceName)
 * Виртуальная.
 * @param sResourceName
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype._internalCreateResource = function (sResourceName) {
};

/**
 * @property _internalDestroyResource(Int iHandle)
 * Виртуальная.
 * @param iHandle
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype._internalDestroyResource = function (iHandle) {
};

/**
 * @property _internalGetResource(Int iHandle)
 * Виртуальная.
 * @param iHandle
 * @memberof ResourcePoolInterface
 *
 **/
ResourcePoolInterface.prototype._internalGetResource = function (iHandle) {
};

Object.defineProperty(ResourcePoolInterface.prototype, "iFourcc", {
         /**
          * @property void iFourcc(Int iNewFourcc)
          * Setter for iFourcc
          * @memberof ResourcePoolInterface
          * @param iNewFourcc
          */
         set: function (iNewFourcc) {
             this.sExt = String.fromCharCode((iNewFourcc & 0x000000FF),
                                             (iNewFourcc & 0x0000FF00) >>> 8,
                                             (iNewFourcc & 0x00FF0000) >>> 16,
                                             (iNewFourcc & 0xFF000000) >>> 24);


         },
              /**
               * @property Int iFourcc()
               * Getter for iFourcc
               * @memberof ResourcePoolInterface
               * @return
               */
              get: function () {
                  return (this.sExt.charCodeAt(3) << 24)
                      | (this.sExt.charCodeAt(2) << 16)
                      | (this.sExt.charCodeAt(1) << 8)
                      | (this.sExt.charCodeAt(0));
              }
});

/**
 * @property registerResourcePool(ResourceCode pCode)
 * Добавление данного пула в менеджер ресурсво по его коду
 * @memberof ResourcePoolInterface
 * @param pCode __COMMENT__
 **/
ResourcePoolInterface.prototype.registerResourcePool = function (pCode) {
    this._pRegistrationCode.eq(pCode);
    this._pEngine.pResourceManager.registerResourcePool(this._pRegistrationCode, this);
};

/**
 * @property unregisterResourcePool()
 * Удаление данного пула в менеджер ресурсво по его коду
 * @memberof ResourcePoolInterface
 **/
ResourcePoolInterface.prototype.unregisterResourcePool = function (pCode) {
    this._pEngine.pResourceManager.unregisterResourcePool(this._pRegistrationCode);
    this._pRegistrationCode.setInvalid();
};

/**
 * @property findResourceHandle(String sName)
 * По имени ресурса возвращает его хендл
 * @memberof ResourcePoolInterface
 * @param sName имя ресурса
 * @return Int хендл ресурса
 **/
ResourcePoolInterface.prototype.findResourceHandle = function (sName) {
    // look up the name in our map
    var iNewHandle = 0;
    CLEAR_HANDLE(iNewHandle);
    for (var iHandle in this._pNameMap) {
        if (this._pNameMap[iHandle] == sName) {
            return iHandle;
        }
    }
    return iNewHandle;
};

/**
 * @property findResourceName(Int iHandle)
 * По хендлу ресурва возвращает его имя
 * @memberof ResourcePoolInterface
 * @param iHandle хендл ресурса
 * @return String имя ресурса
 **/
ResourcePoolInterface.prototype.findResourceName = function (iHandle) {
    return this._pNameMap[iHandle];
};


/**
 * @property setResourceName(Int iHandle, String sName)
 *
 * @memberof ResourcePoolInterface
 * @param iHandle хендл ресурса
 * @param sName имя ресурса
 **/
ResourcePoolInterface.prototype.setResourceName = function (iHandle, sName) {
    this._pNameMap[iHandle] = sName;
};


/**
 * @property createResource(sResourceName)
 * Создание ресурса
 * @memberof ResourcePoolInterface
 * @param sResourceName имя ресурса
 * @return ResourcePoolItem
 **/
ResourcePoolInterface.prototype.createResource = function (sResourceName) {
    //alert("createResource:1");
    var iHandle = this._internalCreateResource(sResourceName);

    //alert("createResource:2");
    if (VALID_HANDLE(iHandle)) {
        //alert("createResource:3");
        var pResource = this.getResource(iHandle);
        //alert("createResource:4");
        pResource._setResourcePool(this);
        //alert("createResource:5");
        //console.log('handle for ',sResourceName,' : ', iHandle, 'code: ', this._pRegistrationCode.iValue);
        pResource._setResourceHandle(iHandle);
        //alert("createResource:6");
        pResource._setResourceCode(this._pRegistrationCode);
        //alert("createResource:7");
        return pResource;
    }
    //alert("createResource:8");
    return null;
};

/**
 * @property loadResource(sResourceName)
 *
 * @memberof ResourcePoolInterface
 * @param sResourceName имя ресурса
 * @return ResourcePoolItem
 **/
ResourcePoolInterface.prototype.loadResource = function (sResourceName) {
    // does the resource already exist?
    var pResource = this.findResource(sResourceName);
                                 
    if (pResource == null) {
        // create a new resource
        pResource = this.createResource(sResourceName);

        if (pResource != null) {
            // attempt to load the desired data
            if (pResource.loadResource()) {
                // ok!
                return pResource;
            }

            // loading failed.
            // destroy the resource we created
            //destroyResource(pResource);
            pResource.release();
            pResource = null;
        }

    }
    return pResource;
};


/**
 * @property saveResource(ResourcePoolItem pResource)
 *
 * @memberof ResourcePoolInterface
 * @param pResource ресурс
 * @return Boolean
 **/
ResourcePoolInterface.prototype.saveResource = function (pResource) {
    if (pResource != null) {
        // save the resource using it's own name as the file path
        return pResource.saveResource(0);
    }
    return false;
};

/**
 * @property findResource(String sName)
 *
 * @memberof ResourcePoolInterface
 * @param sResourceName имя ресурса
 * @return ResourcePoolItem
 **/
ResourcePoolInterface.prototype.findResource = function (sName) {
    //alert("ResourcePoolInterface.findResource");
    // look up the name in our map
    for (var iHandle in this._pNameMap) {
        if (this._pNameMap[iHandle] == sName) {
            if (VALID_HANDLE(iHandle)) {
                var pResource = this.getResource(iHandle);
                return pResource;
            }

        }
    }
    return null;
};


/**
 * @property getResource(Int iHandle)
 *
 * @memberof ResourcePoolInterface
 * @param iHandle хендл ресурса
 * @return ResourcePoolItem
 **/
ResourcePoolInterface.prototype.getResource = function (iHandle) {

    var pResource = this._internalGetResource(iHandle);

    if (pResource != null) {
        pResource.addRef();
    }

    return pResource;
};

/**
 * @property destroyResource(ResourcePoolItem pResource)
 *
 * @memberof ResourcePoolInterface
 * @param pResource ресурс
 **/
ResourcePoolInterface.prototype.destroyResource = function (pResource) 
{
    
    if (pResource != null) {
        var iReferenceCount = pResource.referenceCount();
        debug_assert(iReferenceCount == 0, "destruction of non-zero reference count!");

        if (iReferenceCount <= 0) {
            var iHandle = pResource.resourceHandle();
            this._internalDestroyResource(iHandle);
        }
    }

};

a.ResourcePoolInterface = ResourcePoolInterface;


/**
 * @property ResourcePool()
 * Создание пула ресурсов
 * @memberof ResourcePool
 **/

/**
 * ResourcePool Class
 * @ctor
 * Constructor of ResourcePool class
 **/

function ResourcePool (pEngine, fnTemplate) {
    ResourcePool.superclass.constructor.apply(this, arguments);

    /**
     * Пул данных, вокруг которого этот класс явялется оберткой
     * @type DataPool
     * @memberof ResourcePool
     **/
    this._pEngine = pEngine;
    this._fnTemplate = fnTemplate;
    this._pDataPool = new a.DataPool(this._pEngine, this._fnTemplate);
}

a.extend(ResourcePool, a.ResourcePoolInterface);


/**
 * @property initialize(Int iGrowSize)
 * Инициализация пула ресурсоу
 * @memberof ResourcePool
 * @param iGrowSize размер роста пула данных
 *
 **/
ResourcePool.prototype.initialize = function (iGrowSize) {
    this._pDataPool.initialize(iGrowSize);
}

/**
 * @property destroy()
 * Очистка пула и пометка о том что он больш не инициализирован
 * @memberof ResourcePool
 *
 **/
ResourcePool.prototype.destroy = function () {
    this._pDataPool.destroy();
}

/**
 * @property isInitialized()
 * Инициализирован ли пул
 * @memberof ResourcePool
 * @return Boolean
 **/
ResourcePool.prototype.isInitialized = function () {
    return this._pDataPool.isInitialized();
}


/**
 * @property _internalCreateResource(String sResourceName)
 * Создание ресурса
 * @param sResourceName
 * @memberof ResourcePool
 **/
ResourcePool.prototype._internalCreateResource = function (sResourceName) {
    //alert("ResourcePool._internalCreateResource 1");
    var iHandle = this._pDataPool.nextHandle();

    //alert("ResourcePool._internalCreateResource 2");
    // make sure this name is not already in use
    for (var iter in this._pNameMap) {
        debug_assert((this._pNameMap[iter] != sResourceName),
                     "A resource with this name already exists: " + sResourceName);
    }

    //alert("ResourcePool._internalCreateResource 4");
    // add this resource name to our map of handles
    this._pNameMap[iHandle] = sResourceName;

    //alert("ResourcePool._internalCreateResource 5");
    // get a pointer to the resource and call it's creation function
    var pResource = this._pDataPool.getPtr(iHandle);

    //alert("ResourcePool._internalCreateResource 6");
    pResource.createResource();

    //alert("ResourcePool._internalCreateResource 7");
    return iHandle;

};

/**
 * @property _internalDestroyResource(Int iHandle)
 * Виртуальная.
 * @param iHandle
 * @memberof ResourcePool
 **/
ResourcePool.prototype._internalDestroyResource = function (iHandle) {
    // get a pointer to the resource and call it's destruction handler
    var pResource = this._pDataPool.getPtr(iHandle);
    pResource.destroyResource();

    delete this._pNameMap[iHandle];

    // free the resource slot associated with the handle
    this._pDataPool.release(iHandle);
};


/**
 * @property callbackDestroy(DataPoolInterface pPool, Int iHandle, ResourcePoolItem pResource)
 * Callback
 * @param pPool
 * @param iHandle
 * @param pResource
 * @memberof ResourcePool
 **/

ResourcePool.callbackDestroy = function (pPool, iHandle, pResource) {
    //alert("callbackDestroy");
    pResource.destroyResource();

}

/**
 * @property callbackDisable(DataPoolInterface pPool, Int iHandle, ResourcePoolItem pResource)
 * Callback
 * @param pPool
 * @param iHandle
 * @param pResource
 * @memberof ResourcePool
 **/

ResourcePool.callbackDisable = function (pPool, iHandle, pResource) {
    pResource.disableResource();
}


/**
 * @property callbackRestore(DataPoolInterface pPool, Int iHandle, ResourcePoolItem pResource)
 * Callback
 * @param pPool
 * @param iHandle
 * @param pResource
 * @memberof ResourcePool
 **/

ResourcePool.callbackRestore = function (pPool, iHandle, pResource) {
    pResource.restoreResource();
}

/**
 * @property callbackClean(DataPoolInterface pPool, Int iHandle, ResourcePoolItem pResource)
 * Callback
 * @param pPool
 * @param iHandle
 * @param pResource
 * @memberof ResourcePool
 **/

ResourcePool.callbackClean = function (pPool, iHandle, pResource) {
    // if the reference count is zero, destroy the resource and clear the handle
    if (pResource.referenceCount() == 0) {
        pPool.release(iHandle);
    }
}


/**
 * @property destroyAll()
 *
 * @memberof ResourcePool
 **/
ResourcePool.prototype.destroyAll = function () {
    this._pDataPool.forEach(ResourcePool.callbackDestroy);

}

/**
 * @property restoreAll()
 *
 * @memberof ResourcePool
 **/
ResourcePool.prototype.restoreAll = function () {
    this._pDataPool.forEach(ResourcePool.callbackRestore);
}

/**
 * @property disableAll()
 *
 * @memberof ResourcePool
 **/
ResourcePool.prototype.disableAll = function () {
    this._pDataPool.forEach(ResourcePool.callbackDisable);
}

/**
 * @property clean()
 *
 * @memberof ResourcePool
 **/
ResourcePool.prototype.clean = function () {
    this._pDataPool.forEach(ResourcePool.callbackClean);

//alert("ResourcePool.clean");
//добавлено мной так как странно что при удалении ресурсов, их именна остаются доступны
//alert(this._pNameMap);
//this._pNameMap.splice(0);
//alert(this._pNameMap);
}


/**
 * @property _internalGetResource(Int iHandle)
 * Виртуальная.
 * @param iHandle
 * @memberof ResourcePool
 *
 **/
ResourcePool.prototype._internalGetResource = function (iHandle) {
    return this._pDataPool.getPtr(iHandle);
};


/**
 * @property createResource(sResourceName)
 *
 * @memberof ResourcePoolInterface
 * @param sResourceName имя ресурса
 * @return ResourcePool
 **/
ResourcePool.prototype.createResource = function (sResourceName) {
    return ResourcePool.superclass.createResource.apply(this, arguments);
};

/**
 * @property loadResource(sResourceName)
 *
 * @memberof ResourcePoolInterface
 * @param sResourceName имя ресурса
 * @return ResourcePool
 **/
ResourcePool.prototype.loadResource = function (sResourceName) {
    return ResourcePool.superclass.loadResource.apply(this, arguments);
};


/**
 * @property findResource(String sName)
 *
 * @memberof ResourcePool
 * @param sResourceName имя ресурса
 * @return ResourcePoolItem
 **/
ResourcePool.prototype.findResource = function (sName) {
    //alert("ResourcePool.findResource: sName = "+sName );
    return ResourcePool.superclass.findResource.apply(this, arguments);
};


/**
 * @property getResource(Int iHandle)
 *
 * @memberof ResourcePool
 * @param iHandle хендл ресурса
 * @return ResourcePoolItem
 **/
ResourcePool.prototype.getResource = function (iHandle) {

    return ResourcePool.superclass.getResource.apply(this, arguments);
};

Define(a.SimplePool(pEngine), function () {
    a.ResourcePool(pEngine, a.ResourcePoolItem);
})

a.ResourcePool = ResourcePool;























































