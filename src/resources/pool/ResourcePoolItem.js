/**
 * @file
 * @brief ResourceCode and ResourcePoolItem class.
 * @author xoma
 * @email xoma@odserve.org
 *
 * ResourceCode - класс объекта, который яляются идентификаторами для типов ресурсов
 *
 * ResourcePoolItem - простой базовый класс под используемые ресурсы, такого как текстура, анимация или буфер вершин.
 * Отметим, что ResourcePoolItem наследован от cReferenceCounter. ResourcePoolManager использует значение ReferenceCounter,
 * чтобы решить, когда объекты больше не находятся в использовании и могут быть уничтожены во время
 * ResourcePoolManager.clear(). Это означает, что приложение должно обновлять подсчет ссылок ResourcePoolItem всякий раз,
 * когда ссылки на объекты сохдаются или удаляются. ReferenceCounter базовый класс, обеспечивающи функционал для управления подсчетом ссылок.
 **/


/**
 * @enum RESOURCE_CODE
 * Определяет недействительный код
 * @memberof ResourceCode
 **/
Enum([INVALID_CODE = 0xFFFFFFFF], RESOURCE_CODE, a.ResourceCode);

/**
 * @property ResourceCode()
 * Создание недействительного идентификатора
 * @memberof ResourceCode
 **/
/**
 * @property ResourceCode(ResourceCode pSrc)
 * Создание идентификатора по идентификатору
 * @memberof ResourceCode
 * @param pSrc идентификатор по которому создается новый
 **/
/**
 * @property ResourceCode(Int iSrc)
 * Создание идентификатора по значению
 * @memberof ResourceCode
 * @param iSrc значение котором инициализируется новый идентификатор
 **/
/**
 * @property ResourceCode(Int iNewFamily, Int iNewType)
 * Создание идентификатора по значению типа и принадлжености к семейству
 * @memberof ResourceCode
 * @param iNewFamily значение котором инициализируется семейство нового идентификатора {VideoResource, AudioResource, GameResource, ...}
 * @param iNewType значение которым инициализируется тип нового идентификатора (VideoResource={TextureResource,VBufferResource,RenderResource, ...})
 **/
/**
 * ResourceCode Class
 * @ctor
 * Constructor of ResourceCode class
 **/
function ResourceCode() {
    switch (arguments.length) {
        case 0:
            this.iValue = a.ResourceCode.INVALID_CODE;
            break;
        case 1:
            if (arguments[0] instanceof ResourceCode) {
                this.iValue = arguments[0].iValue;
            }
            else {
                this.iValue = arguments[0];
            }
            break;
        case 2:
            this.iFamily = arguments[0];
            this.iType = arguments[1];
            break;
    }
    ;
}

PROPERTY(ResourceCode, 'iFamily',
         /**
          * @property Int iFamily()
          * Getter for iFamily
          * @memberof ResourceCode
          * @return Value of famaly
          */
             function () {
             return this.iValue >> 16;
         },
         /**
          * @property void iFamily(Int iFamily)
          * Setter for iFamily
          * @memberof ResourceCode
          * @param iFamily New famaly to set
          */
             function (iNewFamily) {
             this.iValue &= 0x0000FFFF;
             this.iValue |= iNewFamily << 16;
         });

PROPERTY(ResourceCode, 'iType',
         /**
          * @property Int iType()
          * Getter for iType
          * @memberof ResourceCode
          * @return Value of type
          */
             function () {
             return this.iValue & 0x0000FFFF;
         },
         /**
          * @property void iType(Int iType)
          * Setter for iType
          * @memberof ResourceCode
          * @param iType New type to set
          */
             function (iNewType) {
             this.iValue &= 0xFFFF0000;
             this.iValue |= iNewType & 0x0000FFFF;
         });


/**
 * @property setInvalid()
 * Пеерводит текущее состояние идентифиакора в невалидное
 * @memberof ResourceCode
 **/
ResourceCode.prototype.setInvalid = function () {
    this.iValue = a.ResourceCode.INVALID_CODE;
}


/**
 * @Operator <
 * Функция необходима для сортировки
 * @memberof ResourceCode
 * @return Boolean True если меньше, False если больше
 **/
ResourceCode.prototype.less = function (pSrc) {
    return this.iValue < pSrc.iValue;
};

/**
 * @Operator =
 * Копирование
 * @memberof ResourceCode
 * @return ResourceCode* текущий объект
 **/
ResourceCode.prototype.eq = function (pSrc) {
    this.iValue = pSrc.iValue;
    return this;
};

/**
 * @Operator (Int)
 * Преобразование к числу, заодно делает рабочим использование <,>,== и тд
 * @memberof ResourceCode
 * @return числовой идентифактор
 **/
ResourceCode.prototype.valueOf = function () {
    return this.iValue;
};

a.ResourceCode = ResourceCode;


/**
 * @property ResourcePoolItem()
 * Конструктор
 * @memberof ResourcePoolItem
 **/
/**
 * ResourcePoolItem Class
 * @ctor
 * Constructor of ResourcePoolItem class
 **/
function ResourcePoolItem(pEngine) {

    /**
     * @enum noname
     * Отражает состояние ресурса
     * @memberof ResourcePoolItem
     **/
    Enum([
             Created = 0, //ресур создан
             Loaded, //ресур заполнен данным и готов к использованию
             Disabled, //ресур в данный момент отключен для использования
             Altered, //ресур был изменен после загрузки
             TotalResourceFlags
         ],
         noname, a.ResourcePoolItem);

    debug_assert(pEngine, "Engine не передан");

    this._pResourceCode = new a.ResourceCode(0);
    this._pResourcePool = null;
    this._iResourceHandle = 0;
    this._iResourceFlags = 0;
    this._iSystemId = a.sid();
    this._pEngine = pEngine;
    this._pCallbackFunctions = [];
    this._fnStateWatcher = [];
    /**
     * Массив слотов.
     * Предназначен для запоминания флагов от зависимых ресурсов.
     * @private
     * @type int[][]
     */
    this._pCallbackSlots = null;

    GEN_ARRAY(this._pCallbackSlots, null, a.ResourcePoolItem.TotalResourceFlags)

    ResourcePoolItem.superclass.constructor.apply(this, arguments);
}

a.extend(ResourcePoolItem, a.ReferenceCounter);

/**
 * Get WebGLRenderingContext.
 * @treturn WebGLRenderingContext
 */
ResourcePoolItem.prototype.getDevice = function () {
    return this._pEngine.pDevice;
}

ResourcePoolItem.prototype.toNumber = function () {
    return this._iSystemId;
}
/**
 * Get current Engine.
 * @treturn Engine Current Engine.
 */
ResourcePoolItem.prototype.getEngine = function () {
    return this._pEngine;
}

/**
 * @property createResource()
 * Инициализация ресурса, вызывается один раз. Виртуальная.
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.createResource = function () {
}

/**
 * @property destroyResource()
 * Уничтожение ресурса. Виртуальная.
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.destroyResource = function () {
}

/**
 * @property disableResource()
 * Удаление ресурса из энергозависимой памяти. Виртуальная.
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.disableResource = function () {
}

/**
 * @property restoreResource()
 * Возвращение ресурса в энегрозависимю память. Виртуальная.
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.restoreResource = function () {
}

/**
 * @property loadResource(String sFileName)
 * Загрузка ресурса из файла, или null при использовании имени ресурса. Виртуальная.
 * @memberof ResourcePoolItem
 * @param sFileName имя файла
 * @return Boolean
 **/
ResourcePoolItem.prototype.loadResource = function (sFileName) {
    sFileName = sFileName || '';
}

/**
 * @property saveResource(String sFileName)
 * Сохранение ресурса в файл, или null при использовании имени ресурса.
 * @memberof ResourcePoolItem
 * @param sFileName имя файла
 * @return Boolean
 **/
ResourcePoolItem.prototype.saveResource = function (sFileName) {
    sFileName = sFileName || '';
}


/**
 * @property _setResourceCode(ResourceCode pCode)
 * Назначение кода ресурсу
 * @memberof ResourcePoolItem
 * @param pCode назначаемый код
 **/
ResourcePoolItem.prototype._setResourceCode = function (pCode) {
    this._pResourceCode.eq(pCode);
}

/**
 * @property _setResourcePool(ResourcePoolInterface pPool)
 * Чтобы ресурс знал какому пулу ресурсов принадлжит
 * @memberof ResourcePoolItem
 * @param pPool пул
 **/
ResourcePoolItem.prototype._setResourcePool = function (pPool) {
    this._pResourcePool = pPool;
}

/**
 * @property _setResourceHandle(Int iHandle)
 * Назначение хендла ресурсу
 * @memberof ResourcePoolItem
 * @param iHandle хендл
 **/
ResourcePoolItem.prototype._setResourceHandle = function (iHandle) {
    this._iResourceHandle = iHandle;
}


/**
 * @property setChangesNotifyRoutine(Function fnFunc, Boolean isRemove)
 * Добавление и удаление функции, которая будет вызываться при изменении состояния ресурса( fnFunc(iNewSost,iOldSost) )
 * @memberof ResourcePoolItem
 * @param fn функция колбек
 * @param isRemove Если истина удалить, если ложь добавить
 **/
ResourcePoolItem.prototype.setChangesNotifyRoutine = function (fn) {
    debug_assert(typeof fn == 'function', 'Передана не функция');
    for (var i = 0; i < this._pCallbackFunctions.length; i++) {
        if (this._pCallbackFunctions[i] == fn) {
            return;
        }
    }
    this._pCallbackFunctions.push(fn);
}

ResourcePoolItem.prototype.delChangesNotifyRoutine = function (fn) {
    debug_assert(typeof(fn) == "function", "Передана не функция");
    for (var i = 0; i < this._pCallbackFunctions.length; i++) {
        if (this._pCallbackFunctions[i] == fn) {
            this._pCallbackFunctions.splice(i - 1, 1);
        }
    }
}

ResourcePoolItem.parseEvent = function (pEvent) {
    if (typeof pEvent == 'number') {
        return pEvent;
    }

    switch (pEvent.toLowerCase()) {
        case 'loaded':
            return a.ResourcePoolItem.Loaded;
        case 'created':
            return a.ResourcePoolItem.Created;
        case 'disabled':
            return a.ResourcePoolItem.Disabled;
        case 'altered':
            return a.ResourcePoolItem.Altered;
        default:
            error('Использовано неизвестное событие для ресурса.');
    }

    return 0;
}

ResourcePoolItem.prototype.setStateWatcher = function (eState, fnWatcher) {
    this._fnStateWatcher[eState] = fnWatcher;
}

ResourcePoolItem.prototype._notifyStateChange = function (eSlot, pTarget) {
    if (!this._fnStateWatcher[eSlot]) {
        return;
    }

    var pSignSlots = this._pCallbackSlots[eSlot];
    var nTotal = pSignSlots.length, nLoaded = 0;
    for (var i = 0; i < nTotal; ++i) {
        if (pSignSlots[i].bState) {
            ++nLoaded;
        }
    }

    this._fnStateWatcher[eSlot](nLoaded, nTotal, pTarget);
}

ResourcePoolItem.prototype.disconnect = function (pResourceItem, eSignal, eSlot) {
    eSlot = ifndef(eSlot, eSignal);
    eSlot = ResourcePoolItem.parseEvent(eSlot);
    eSignal = ResourcePoolItem.parseEvent(eSignal);

    debug_assert(0 <= eSlot && eSlot < a.ResourcePoolItem.TotalResourceFlags,
                 'Invalid slot used(' + eSlot + ').');

    var pSlots = this._pCallbackSlots,
        pSignSlots;
    var me = this;
    var isRem = false;

    pSignSlots = pSlots[eSlot];


    for (var i = 0, n = pSignSlots.length; i < n; ++i) {
        if (pSignSlots[i].pResourceItem === pResourceItem) {
            pSignSlots[i].pResourceItem.delChangesNotifyRoutine(
                pSignSlots[i].fn);
            pSignSlots.splice(i, 1);
            --n;
            --i;
            isRem = true;
        }
    }

    return isRem;
};

ResourcePoolItem.prototype.connect = function (pResourceItem, eSignal, eSlot) {
    eSlot = ifndef(eSlot, eSignal);

    eSlot = ResourcePoolItem.parseEvent(eSlot);
    eSignal = ResourcePoolItem.parseEvent(eSignal);

    debug_assert(0 <= eSlot && eSlot < a.ResourcePoolItem.TotalResourceFlags,
                 'Invalid slot used(' + eSlot + ').');

    var pSlots = this._pCallbackSlots,
        pSignSlots;

    var me = this, n, fn, bState;

    if (pSlots[eSlot] === null) {
        pSlots[eSlot] = [];
    }

    pSignSlots = pSlots[eSlot];
    n = pSignSlots.length;
    bState = TEST_BIT(pResourceItem._iResourceFlags, eSignal);

    fn = function (eFlag, iResourceFlags, isSet) {
        if (eFlag == eSignal) {
            pSignSlots[n].bState = isSet;//TEST_BIT(iResourceFlags, eFlag);
            me._notifyStateChange(eSlot, this);
            for (var i = 0; i < pSignSlots.length; ++i) {
                if (pSignSlots[i].bState === false) {
                    if (TEST_BIT(me._iResourceFlags, eFlag)) {
                        me._setResourceFlag(eFlag, false);
                    }
                    return;
                }
            }

            me._setResourceFlag(eFlag, true);
        }
    };

    pSignSlots.push({bState : bState, fn : fn, pResourceItem : pResourceItem});

    fn.call(pResourceItem, eSignal, pResourceItem._iResourceFlags, bState);
    pResourceItem.setChangesNotifyRoutine(fn);

    return true;
};


/**
 * @property _setResourceFlag(Int iFlagBit, Boolean isSetting)
 * Уставнока состояний у ресурса
 * @memberof ResourcePoolItem
 * @param iFlagBit
 * @param isSetting
 **/
ResourcePoolItem.prototype._setResourceFlag = function (iFlagBit, isSetting) {
    var iTempFlags = this._iResourceFlags;
    SET_BIT(this._iResourceFlags, iFlagBit, isSetting);
    if (iTempFlags != this._iResourceFlags) {
        for (var i = 0; i < this._pCallbackFunctions.length; i++) {
            this._pCallbackFunctions[i].call(this, iFlagBit, this._iResourceFlags, isSetting);
        }
    }
}


/**
 * @property notifyCreated()
 * Установка состояния в созданный
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyCreated = function () {
    this._setResourceFlag(a.ResourcePoolItem.Created, true);
}

/**
 * @property notifyDestroyed()
 * Установка в состояние не созданный
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyDestroyed = function () {
    this._setResourceFlag(a.ResourcePoolItem.Created, false);
}

/**
 * @property notifyLoaded()
 * Уставнока в состояние загруженный
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyLoaded = function () {
    this.setAlteredFlag(false);
    this._setResourceFlag(a.ResourcePoolItem.Loaded, true);
}

/**
 * @property notifyUnloaded()
 * Уставнока в состояние незагруженный
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyUnloaded = function () {
    this._setResourceFlag(a.ResourcePoolItem.Loaded, false);
}

/**
 * @property notifyRestored()
 * Установка в состояние используемый
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyRestored = function () {
    this._setResourceFlag(a.ResourcePoolItem.Disabled, false);
}

/**
 * @property notifyDisabled()
 * Установка в состояние не используемый
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyDisabled = function () {
    this._setResourceFlag(a.ResourcePoolItem.Disabled, true);
}
/**
 * @property notifyDisabled()
 * Resource updated
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifyAltered = function () {
    this._setResourceFlag(a.ResourcePoolItem.Altered, true);
}
/**
 * @property notifySaved()
 * Установка в состояние сохраненый
 * @memberof ResourcePoolItem
 **/
ResourcePoolItem.prototype.notifySaved = function () {
    this.setAlteredFlag(false);
}

/**
 * @property resourceCode()
 * Получение кода ресурса
 * @memberof ResourcePoolItem
 * @return ResourceCode
 **/
ResourcePoolItem.prototype.resourceCode = function () {
    return this._pResourceCode;
}

/**
 * @property resourcePool()
 * Получение пула ресурса
 * @memberof ResourcePoolItem
 * @return ResourcePoolInterface
 **/
ResourcePoolItem.prototype.resourcePool = function () {
    return this._pResourcePool;
}

/**
 * @property resourceHandle()
 * Получение хендла
 * @memberof ResourcePoolItem
 * @return Int
 **/
ResourcePoolItem.prototype.resourceHandle = function () {
    return this._iResourceHandle;
}

/**
 * @property resourceFlags()
 * Получение флагов ресурса
 * @memberof ResourcePoolItem
 * @return Int
 **/
ResourcePoolItem.prototype.resourceFlags = function () {
    return this._iResourceFlags;
}

/**
 * @property isResourceCreated()
 * Проверка создан ли ресурс
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.isResourceCreated = function () {
    return TEST_BIT(this._iResourceFlags, a.ResourcePoolItem.Created);
}

/**
 * @property isResourceLoaded()
 * Проверка загружен ли ресурс
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.isResourceLoaded = function () {
    return TEST_BIT(this._iResourceFlags, a.ResourcePoolItem.Loaded);
}

/**
 * @property isResourceDisabled()
 * Проверка активен ли ресурс
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.isResourceDisabled = function () {
    return TEST_BIT(this._iResourceFlags, a.ResourcePoolItem.Disabled);
}

/**
 * @property isResourceDisabled()
 * Проверка обновлен ли ресурс
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.isResourceAltered = function () {
    return TEST_BIT(this._iResourceFlags, a.ResourcePoolItem.Altered);
}

/**
 * @property setAlteredFlag(Boolean isOn)
 * Установка состояния в изменен после загружки
 * @memberof ResourcePoolItem
 * @param isOn
 **/
ResourcePoolItem.prototype.setAlteredFlag = function (isOn) {
    this._setResourceFlag(a.ResourcePoolItem.Altered, isOn);
    ;
}

/**
 * @property isResourceDisabled()
 * Проверка был ли изменен ресур после загрузки
 * @memberof ResourcePoolItem
 * @return Boolean
 **/
ResourcePoolItem.prototype.alteredFlag = function () {
    return TEST_BIT(this._iResourceFlags, a.ResourcePoolItem.Altered);
}


/**
 * @property setResourceName(String sName)
 * Пиписывание ресурсу имени
 * @memberof ResourcePoolItem
 * @param sName новое имя бъекта
 **/
ResourcePoolItem.prototype.setResourceName = function (sName) {
    if (this._pResourcePool != null) {
        this._pResourcePool.setResourceName(this._iResourceHandle, sName);
    }
}

/**
 * @property findResourceName()
 * Поиск имени ресурса
 * @memberof ResourcePoolItem
 * @param sName новое имя бъекта
 **/
ResourcePoolItem.prototype.findResourceName = function () {
    if (this._pResourcePool != null) {
        return this._pResourcePool.findResourceName(this._iResourceHandle);
    }

    return null;
}

/**
 * @property release()
 * оповещение о уменьшении количесва ссылок на ресурс
 * @memberof ResourcePoolItem
 * @return Int
 **/
ResourcePoolItem.prototype.release = function () {
    var iRefCount = ResourcePoolItem.superclass.release.apply(this, arguments);

    if (iRefCount == 0) {
        //Если у нас есть менеджер попросим его удалить нас
        if (this._pResourcePool != null) {
            this._pResourcePool.destroyResource(this);
        }
    }
    return iRefCount;
}

a.ResourcePoolItem = ResourcePoolItem;

