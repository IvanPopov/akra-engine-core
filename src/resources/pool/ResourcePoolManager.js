/**
 * @file
 * @brief ResourcePoolManager class.
 * @author xoma
 * @email xoma@odserve.org
 * Менеджер управления ресурсами(пулами ресурсов)(ResourcePoolManager). Является центральной частью системы ресурсов,
 * Все ресурсы могут быть созданы и управляться через этот интерфейс
 **/


/**
 * @enum RESOURCE_FAMILY
 * Семейства ресурсов
 * @memberof ResourcePoolManager
 **/
Enum([VideoResource = 0, AudioResource, GameResource, TotalResourceFamilies],
     RESOURCE_FAMILY, a.ResourcePoolManager)


/**
 * @enum VIDEO_RESOURCES
 * Члены семейства видео ресурсов
 * @memberof ResourcePoolManager
 **/
Enum([
         TextureResource = 0, VideoBufferResource, VertexBufferResource, IndexBufferResource,
         RenderResource, RenderSetResource, ModelResource, EffectFileData,
         ImageResource, SMaterialResource, ShaderProgramResource, ComponentResource, TotalVideoResources
     ],
     VIDEO_RESOURCES, a.ResourcePoolManager)

Enum([TotalAudioResources = 0],
     AUDIO_RESOURCES, a.ResourcePoolManager)

Enum([TotalGameResources = 0],
     GAME_RESOURCES, a.ResourcePoolManager)


/**
 * ResourcePoolManager Class
 * @ctor
 * Constructor of ResourcePoolManager class
 **/
/**
 * @property ResourcePoolManager()
 * Конструктор класса, занимается очисткой списков пулов по семействам ресурсвов и краты пулов по коду ресурсов
 * @memberof ResourcePoolManager
 **/
function ResourcePoolManager () {
    /**
     * Списки пулов по семействам ресурсов
     * @type *
     * @memberof ResourcePoolManager
     **/
    this._pResourceFamilyList = new Array(a.ResourcePoolManager.TotalResourceFamilies);
    for (var i = 0; i < a.ResourcePoolManager.TotalResourceFamilies; i++) {
        this._pResourceFamilyList[i] = new Array();
        this._pResourceFamilyList[i].splice(0);
    }

    /**
     * Карта пулов по коду ресурса
     * @memberof ResourcePoolManager
     **/
    this._pResourceTypeMap = new Array();
    this._pResourceTypeMap.splice(0);

    this.pTypedResourseTotal = [
        a.ResourcePoolManager.TotalVideoResources, a.ResourcePoolManager.TotalAudioResources,
        a.ResourcePoolManager.TotalGameResources
    ];

    this._pWaiterResource = new ResourcePoolItem({});

    //Чтобы был только один экземпляр
    debug_assert(ResourcePoolManager.prototype._isSingleton == true, "This class is singleton");
    ResourcePoolManager.prototype._isSingleton = false;
}

/**
 * Служит для проверки один ли класс создан
 * @type Bollean
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype._isSingleton = true;


/**
 * @property registerResourcePool(ResourceCode pCode, ResourcePoolInterface pInterface)
 * Регистрируется пул ресурсов опредленного типа в менеджере русурсов
 * @memberof ResourcePoolManager
 * @param pCode Тип ресурса
 * @param pInterface Пул ресусов
 **/
ResourcePoolManager.prototype.registerResourcePool = function (pCode, pInterface) {
    debug_assert(pInterface != null, "invalid cResourcePoolInterface pointer");
    debug_assert(pCode.iFamily >= 0, "invalid family index");
    debug_assert(pCode.iFamily < a.ResourcePoolManager.TotalResourceFamilies, "invalid family index");


    debug_assert(this._pResourceTypeMap[pCode.valueOf()] == undefined, "Resource type code already registered");

    this._pResourceTypeMap[pCode.valueOf()] = pInterface;
    this._pResourceFamilyList[pCode.iFamily].push(pInterface);
}

/**
 * @property unregisterResourcePool(ResourceCode pCode )
 * Удаляет пул ресурсов опредленного типа в менеджере русурсов
 * @memberof ResourcePoolManager
 * @param pCode Тип ресурса
 * @return ResourcePoolInterface Пул ресурсов который был удален в менеджере ресурсов
 **/
ResourcePoolManager.prototype.unregisterResourcePool = function (pCode) {
    debug_assert(pCode.iFamily >= 0, "invalid family index");
    debug_assert(pCode.iFamily < a.ResourcePoolManager.TotalResourceFamilies, "invalid family index");


    var pInterface = null;
    if (this._pResourceTypeMap[pCode.valueOf()] != undefined) {
        pInterface = this._pResourceTypeMap[pCode.valueOf()];
        delete this._pResourceTypeMap[pCode.valueOf()];
    }

    if (pInterface != null) {
        for (var pIter in this._pResourceFamilyList[pCode.iFamily]) {
            if (this._pResourceFamilyList[pCode.iFamily][pIter] == pInterface) {
                delete this._pResourceFamilyList[pCode.iFamily][pIter];
                return pInterface;
            }
        }
    }
    return pInterface;
}

/**
 * @property destroyAll()
 * Удаление всех ресурсов
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.destroyAll = function () {
    for (var i = 0; i < a.ResourcePoolManager.TotalResourceFamilies; i++) {
        this.destroyResourceFamily(i);
    }
}

/**
 * @property restoreAll()
 *
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.restoreAll = function () {
    for (var i = 0; i < a.ResourcePoolManager.TotalResourceFamilies; i++) {
        this.restoreResourceFamily(i);
    }
}

/**
 * @property disableAll()
 *
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.disableAll = function () {
    for (var i = 0; i < a.ResourcePoolManager.TotalResourceFamilies; i++) {
        this.disableResourceFamily(i);
    }
}


/**
 * @property clean()
 *
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.clean = function () {
    for (var i = 0; i < a.ResourcePoolManager.TotalResourceFamilies; i++) {
        this.cleanResourceFamily(i);
    }
}

/**
 * @property destroyResourceFamily(Int iFamily)
 * Удаление ресурсов определенного семества
 * @param iFamily семество удаляемых ресурсов
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.destroyResourceFamily = function (iFamily) {
    debug_assert(iFamily >= 0, "invalid family index");
    debug_assert(iFamily < a.ResourcePoolManager.TotalResourceFamilies, "invalid family index");

    //alert("destroyResourceFamily 1:"+ iFamily);

    for (var iIter in this._pResourceFamilyList[iFamily]) {
        //alert("destroyResourceFamily 2:"+ iIter);
        this._pResourceFamilyList[iFamily][iIter].destroyAll();
    }
}

/**
 * @property restoreResourceFamily(Int iFamily)
 *
 * @param iFamily
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.restoreResourceFamily = function (iFamily) {
    debug_assert(iFamily >= 0, "invalid family index");
    debug_assert(iFamily < a.ResourcePoolManager.TotalResourceFamilies, "invalid family index");

    for (var iIter in this._pResourceFamilyList[iFamily]) {
        this._pResourceFamilyList[iFamily][iIter].restoreAll();
    }
}

/**
 * @property disableResourceFamily(Int iFamily)
 *
 * @param iFamily
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.disableResourceFamily = function (iFamily) {
    debug_assert(iFamily >= 0, "invalid family index");
    debug_assert(iFamily < a.ResourcePoolManager.TotalResourceFamilies, "invalid family index");

    for (var iIter in this._pResourceFamilyList[iFamily]) {
        this._pResourceFamilyList[iFamily][iIter].disableAll();
    }
}

/**
 * @property cleanResourceFamily(Int iFamily)
 *
 * @param iFamily
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.cleanResourceFamily = function (iFamily) {
    debug_assert(iFamily >= 0, "invalid family index");
    debug_assert(iFamily < a.ResourcePoolManager.TotalResourceFamilies, "invalid family index");

    for (var iIter in this._pResourceFamilyList[iFamily]) {
        this._pResourceFamilyList[iFamily][iIter].clean();
    }
}

/**
 * @property destroyResourceType(ResourceCode pCode)
 *
 * @param pCode
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.destroyResourceType = function (pCode) {
    if (this._pResourceTypeMap[pCode.valueOf()] != undefined) {
        this._pResourceTypeMap[pCode.valueOf()].destroyAll();
    }

}

/**
 * @property restoreResourceType(ResourceCode pCode)
 *
 * @param pCode
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.destroyResourceType = function (pCode) {
    if (this._pResourceTypeMap[pCode.valueOf()] != undefined) {
        this._pResourceTypeMap[pCode.valueOf()].restoreAll();
    }

}


/**
 * @property disableResourceType(ResourceCode pCode)
 *
 * @param pCode
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.disableResourceType = function (pCode) {
    if (this._pResourceTypeMap[pCode.valueOf()] != undefined) {
        this._pResourceTypeMap[pCode.valueOf()].disableAll();
    }
}


/**
 * @property cleanResourceType(ResourceCode pCode)
 *
 * @param pCode
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.cleanResourceType = function (pCode) {
    if (this._pResourceTypeMap[pCode.valueOf()] != undefined) {
        this._pResourceTypeMap[pCode.valueOf()].clean();
    }
}

/**
 * @property findResourcePool(ResourceCode pCode)
 * Возвращает пул ресурса опредленного типа по его коду
 * @param pCode
 * @return ResourcePoolInterface
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.findResourcePool = function (pCode) {
    if (this._pResourceTypeMap[pCode.valueOf()] != undefined) {
        return this._pResourceTypeMap[pCode.valueOf()];
    }
    else {
        return null;
    }
}

/**
 * @property findResourceHandle(ResourceCode pCode, String sName)
 * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
 * @param pCode тип пула
 * @param sName имя ресурса
 * @return Int
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.findResourceHandle = function (pCode, sName) {

    var pPool = this.findResourcePool(pCode);
    var iHandle;
    CLEAR_HANDLE(iHandle);

    if (pPool != null) {
        iHandle = pPool.findResourceHandle(sName);
    }

    return iHandle;
}

/**
 * @property findResource(ResourceCode pCode, Int iHandle)
 * Возвращает конкретный ресурс по его хендлу из конкретного пула опредленного типа
 * @param pCode тип пула
 * @param iHandle имя ресурса
 * @return ResourcePoolItem
 * @memberof ResourcePoolManager
 **/
/**
 * @property findResource(ResourceCode pCode, String sName)
 * Возвращает конкретный ресурс по его имени из конкретного пула опредленного типа
 * @param pCode тип пула
 * @param sName имя ресурса
 * @return ResourcePoolItem
 * @memberof ResourcePoolManager
 **/
ResourcePoolManager.prototype.findResource = function (pCode, sName) {
    if (typeof arguments[1] == "string") {
        var pPool = this.findResourcePool(pCode);
        var pResult = null;
        var iHandle;

        //alert("ResourcePoolManager.findResource: sName = "+ sName+ "; pPool = "+ pPool);
        if (pPool != null) {

            //alert("ResourcePoolManager.findResource:1");
            iHandle = pPool.findResourceHandle(sName);

            //alert("ResourcePoolManager.findResource:iHandle = "+iHandle);
            if (VALID_HANDLE(iHandle)) {
                pResult = pPool.getResource(iHandle);
            }
        }

        return pResult;
    }
    else if (typeof arguments[1] == "number") {
        var pPool = this.findResourcePool(pCode);
        var pResult = null;
        if (pPool != null) {
            if (VALID_HANDLE(sName)) {
                pResult = pPool.getResource(sName);
            }
        }

    }
    else {
        debug_assert(1 == 0, "invalid type 2 parameter");
        return null;
    }

}
ResourcePoolManager.prototype.monitorInitResources = function (fnMonitor) {
    var me = this;
    this._pWaiterResource.setStateWatcher(a.ResourcePoolItem.Loaded, function () {
        fnMonitor.apply(me, arguments);
    });
}

ResourcePoolManager.prototype.setLoadedAllRoutine = function (fnCallback) {
    var pPool;
    var pResource;
    var iHandleResource;
    var pWaiterResouse = this._pWaiterResource;

    var fnResCallback = function (iFlagBit, iResourceFlags, isSetting) {
        if (iFlagBit == a.ResourcePoolItem.Loaded && isSetting == true) {
            fnCallback();
        }
    };

    pWaiterResouse.notifyLoaded();

    for (var n = 0; n < a.ResourcePoolManager.TotalResourceFamilies; n++) {
        for (var i = 0; i < this.pTypedResourseTotal[n]; i++) {
            pPool = this.findResourcePool(new a.ResourceCode(n, i));
            if (pPool) {
                for (var iHandleResource in pPool._pNameMap) {
                    pResource = pPool.getResource(iHandleResource);
                    pWaiterResouse.connect(pResource, a.ResourcePoolItem.Loaded);
                }
            }

        }
    }

    (pWaiterResouse.isResourceLoaded()?
        fnCallback(): pWaiterResouse.setChangesNotifyRoutine(fnResCallback));
}

a.ResourcePoolManager = ResourcePoolManager;



