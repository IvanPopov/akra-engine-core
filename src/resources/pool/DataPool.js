/**
 * @file
 * @brief PoolGroup and DataPoolInterface and DataPool class.
 * @author xoma
 * @email xoma@odserve.org
 * PoolGroup массив которых хранит элементы, позволяет добалять и удалять их, имеет постоянный размер,
 * следит чтобы при удалени и добавлении происходило заполнение пустых ячеек, не происходило переполнения
 * DataPoolInterface подложка под DataPool
 * DataPool класс используемый для храннеия данных, побочного выделения под них места,
 * прозрачного обращения к его элементам
 * Тестовый пример:
 * Include("/include/include.js");
 *
 * var pDataPool=new a.DataPool();  //Создаем пулл данных
 *    pDataPool.initialize(10);    //Инициализируется ростом по 10
 * var pItem1 = new a.ResourcePoolItem(); //Создаем ресур
 * pItem1.createResource();
 * alert(pDataPool.add(pItem1));   //добавляем его к пулу
 *
 * var pItem2;
 * var k=0;
 * for(k=0;k<10;k++)
 * {
 *   pItem2 = new a.ResourcePoolItem();
 *   pItem2.createResource();
 *  alert(pDataPool.add(pItem2));
 * }
 *
 * alert("pDataPool: _iTotalMembers "+pDataPool._iTotalMembers+
 *      " ;_iTotalOpen "+pDataPool._iTotalOpen+ "; _iGroupCount "+
 *      pDataPool._iGroupCount);
 *
 * //alert(pDataPool._getGroupNumber(7));
 * //alert(pDataPool._getItemIndex(9));
 * //pDataPool._getGroup(1);
 * //alert("pDataPool.nextHandle: "+pDataPool.nextHandle());

 * //alert(pDataPool.get(10)==pItem2)

 * alert("destroy");
 * pDataPool.release(10);
 * for(k=9;k>=0;k--)
 * {
 *  alert(pDataPool._pGroupList.length);
 *  pDataPool.release(k);
 * }
 * alert(pDataPool._pGroupList.length);
 *
 * //проверка клеа и дестроя
 * pDataPool.destroy();
 *
 *
 * alert("pDataPool: _iTotalMembers "+pDataPool._iTotalMembers+
 *      " ;_iTotalOpen "+pDataPool._iTotalOpen+ "; _iGroupCount "+
 *      pDataPool._iGroupCount);
 *
 **/




Define(INVALID_INDEX, 0xffff);
Define(CLEAR_HANDLE(h), function () {
    h = INVALID_INDEX
})
Define(VALID_HANDLE(h), function () {
    h != INVALID_INDEX
})


/**
 * @property PoolGroup(Int iMaxCount, Function fnTemplate)
 * Статический массив элементов с данными
 * @memberof PoolGroup
 * @param iMaxCount Количесвто элементов с данными в массиве
 * @param fnTemplate
 **/
/**
 * PoolGroup Class
 * @ctor
 * Constructor of PoolGroup class
 **/

function PoolGroup (pEngine, fnTemplate, iMaxCount) {

    debug_assert(pEngine, "Engine не передан в PoolGroup");
    debug_assert(fnTemplate != undefined, "Type data not defined");

    this._pEngine = pEngine;
    /**
     * Конструктор для создания данных в группе
     * @type Function
     * @memberof PoolGroup
     **/
    this._fnTemplate = fnTemplate;


    /**
     * Число свободных элементов группы
     * @type Int
     * @memberof PoolGroup
     **/
    this._iTotalOpen = 0;
    /**
     * Первый свободный элемент группы
     * @type Int
     * @memberof PoolGroup
     **/
    this._iFirstOpen = 0;
    /**
     * Колмичество элементов в группе
     * @type Int
     * @memberof PoolGroup
     **/
    this._iMaxCount = iMaxCount;
    /**
     * Список свободных элементов группы
     * @type Int[]
     * @memberof PoolGroup
     **/
    this._pNextOpenList = null;
    /**
     * Массив элементов группы
     * @type []
     * @memberof PoolGroup
     **/
    this._pMemberList = null;
}

/**
 * @property create()
 * Создание группы, создается массив элементов, инициализирется список свободный и т.д.
 * @memberof PoolGroup
 **/
PoolGroup.prototype.create = function () {
    var i;

    debug_assert(this._pMemberList == null && this._pNextOpenList == null, "Group has already been created");

    this._pNextOpenList = new Array(this._iMaxCount);
    debug_assert(this._pNextOpenList != null, "tragic memory allocation failure!");

    this._pMemberList = new Array(this._iMaxCount);

    //alert("PoolGroup.create");
    for (i = 0; i < this._iMaxCount; i++) {
        this._pMemberList[i] = new this._fnTemplate(this._pEngine);
    }

    debug_assert(this._pNextOpenList != null, "tragic memory allocation failure!");

    for (i = 0; i < this._iMaxCount - 1; i++) {
        this._pNextOpenList[i] = i + 1;
    }
    this._pNextOpenList[i] = i;
    this._iTotalOpen = this._iMaxCount;

    this._iFirstOpen = 0;
}

/**
 * @property destroy()
 * Удаление группы: удаление массива элементов, списка совбодных элементов и т.д.
 * Выдается ошибка если группа не пуста
 * @memberof PoolGroup
 **/
PoolGroup.prototype.destroy = function () {
    //alert("destroy:1");
    debug_assert(this._pMemberList != null && this._pNextOpenList != null, "Group has not been created");
    //alert("destroy:this._iTotalOpen: "+this._iTotalOpen+" ;this._iMaxCount "+ this._iMaxCount);
    debug_assert(this._iTotalOpen == this._iMaxCount, "Group is not empty");
    //alert("destroy:3");
    delete this._pMemberList;
    this._pMemberList = null;

    delete this._pNextOpenList;
    this._pNextOpenList = null;

    this._iTotalOpen = 0;
    this._iMaxCount = 0;
}

/**
 * @property nextMember()
 * Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый
 * @memberof PoolGroup
 * @return Int номер следующего свободного элемента в списке
 **/
PoolGroup.prototype.nextMember = function () {
    debug_assert(this._pMemberList != null && this._pNextOpenList != null, "Group has not been created");
    debug_assert(this._iTotalOpen != null, "no open slots");
    //Возвращает номер первого свободного элемента в группе,
    //и изменяет номер первого свободного на следующего свободного

    var iSlot = this._iFirstOpen;
    this._iFirstOpen = this._pNextOpenList[iSlot];
    this._iTotalOpen--;

    debug_assert(this._iFirstOpen != INVALID_INDEX, "Invalid Open Index");
    debug_assert(this.isOpen(iSlot), "invalid index");

    //помечаем что элемент который отдали является используемым
    this._pNextOpenList[iSlot] = INVALID_INDEX;

    return iSlot;
}

/**
 * @property addMember(Object* pMember)
 * Добавляем новый элемент в список
 * @memberof PoolGroup
 * @return Int номер добавленого элемента в списке
 **/
PoolGroup.prototype.addMember = function (pMember) {
    var iSlot = this.nextMember();
    this._pMemberList[iSlot] = pMember;

    return iSlot;
}

/**
 * @property release(int iIndex)
 * Исключение элемента из списка по его номеру
 * @memberof PoolGroup
 * @param iIndex индекс исключаемого элемента
 **/
PoolGroup.prototype.release = function (iIndex) {
    debug_assert(this._pMemberList != null && this._pNextOpenList != null, "Group has not been created");
    debug_assert(iIndex < this._iMaxCount, "invalid index");

    debug_assert(this.isOpen(iIndex) == false, "invalid index to release");

    this._pNextOpenList[iIndex] = this._iTotalOpen > 0 ? this._iFirstOpen : iIndex;
    this._iTotalOpen++;
    this._iFirstOpen = iIndex;
}


/**
 * @property totalOpen()
 * Возвращает количесвто свободных мест в группе
 * @memberof PoolGroup
 * @return Int количество свободных мест в группе
 **/
PoolGroup.prototype.totalOpen = function (pMember) {
    return this._iTotalOpen;
}

/**
 * @property totalUsed()
 * Возвращает количесвто занятых мест в группе
 * @memberof PoolGroup
 * @return Int количество занятых мест в группе
 **/
PoolGroup.prototype.totalUsed = function (pMember) {
    return this._iMaxCount - this._iTotalOpen;
}

/**
 * @property firstOpen()
 * Номер первого свободного элемента в группе
 * @memberof PoolGroup
 * @return Int Номер первого свободного элемента в группе
 **/
PoolGroup.prototype.firstOpen = function (pMember) {
    return this._iFirstOpen;
}

/**
 * @property isOpen(Int iIndex)
 * Проверить свободна ли эта ячейка в группе
 * @memberof PoolGroup
 * @param iIndex номер проверяемого элемента
 * @return Boolean
 **/
PoolGroup.prototype.isOpen = function (iIndex) {
    //alert("isOpen:1");
    debug_assert(this._pMemberList != null && this._pNextOpenList != null, "Group has not been created");
    //alert("isOpen:2");
    //alert("isOpen:iIndex = "+iIndex+" ;this._iMaxCount = "+this._iMaxCount);
    debug_assert(iIndex < this._iMaxCount, "invalid index");
    //alert("isOpen:3");
    return this._pNextOpenList[iIndex] != INVALID_INDEX;
}

/**
 * @property member(Int iIndex)
 * Получение элемента по его номеру
 * @memberof PoolGroup
 * @param iIndex номер элемента
 * @return Object элемент с этим номером
 **/
PoolGroup.prototype.member = function (iIndex) {
    debug_assert(this._pMemberList != null && this._pNextOpenList != null, "Group has not been created");
    debug_assert(iIndex < this._iMaxCount, "invalid index");
    return this._pMemberList[iIndex];
}

/**
 * @property memberPtr(Int iIndex)
 * Получение элемента по его номеру
 * @memberof PoolGroup
 * @param iIndex номер элемента
 * @return Object элемент с этим номером
 **/
PoolGroup.prototype.memberPtr = function (iIndex) {
    debug_assert(this._pMemberList != null && this._pNextOpenList != null, "Group has not been created");
    debug_assert(iIndex < this._iMaxCount, "invalid index");
    return this._pMemberList[iIndex];
}


/**
 * @property DataPoolInterface()
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 **/
/**
 * DataPoolInterface Class
 * @ctor
 * Constructor of DataPoolInterface class
 **/
function DataPoolInterface (pEngine, fnTemplate) {

    debug_assert(fnTemplate != undefined, "Type data not defined");

    this._pEngine = pEngine;
    /**
     * Конструктор для данных которые будут лежать в пуле
     * @type Function
     * @memberof DataPool
     **/
    this._fnTemplate = fnTemplate;
    /**
     * __DESCRIPTION__
     * @type Boolean
     * @memberof DataPoolInterface
     **/
    this._iInitialized = false;
}

/**
 * @property initialize(Int iGrowSize)
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 * @param iGrowSize
 **/
DataPoolInterface.prototype.initialize = function (iGrowSize) {
}
DataPoolInterface.prototype.initialize = null;

/**
 * @property destroy()
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 **/
DataPoolInterface.prototype.destroy = function () {
}
DataPoolInterface.prototype.destroy = null;

/**
 * @property clear()
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 **/
DataPoolInterface.prototype.clear = function () {
}
DataPoolInterface.prototype.clear = null;

/**
 * @property nextHandle()
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 * @return Int
 **/
DataPoolInterface.prototype.nextHandle = function () {
}
DataPoolInterface.prototype.nextHandle = null;

/**
 * @property release(Int iHandle)
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 * @param iHandle
 * @return Int
 **/
DataPoolInterface.prototype.release = function (iHandle) {
}
DataPoolInterface.prototype.release = null;

/**
 * @property forEach(Function fFunction)
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 * @param function
 **/
DataPoolInterface.prototype.forEach = function (fFunction) {
}
DataPoolInterface.prototype.forEach = null;

/**
 * @property getGenericPtr(Int iHandle)
 * __DESCRIPTION__
 * @memberof DataPoolInterface
 * @param function
 * @return Object
 **/
DataPoolInterface.prototype.getGenericPtr = function (iHandle) {
}
DataPoolInterface.prototype.getGenericPtr = null;

/**
 * @property isInitialized()
 * Инициализирован ли пул
 * @memberof DataPoolInterface
 * @return Boolean
 **/
DataPoolInterface.prototype.isInitialized = function () {
    return this._iInitialized;
}

a.DataPoolInterface = DataPoolInterface;


//#################################################################

/**
 * @property DataPool(Function fnTemplate)
 * __DESCRIPTION__
 * @param fnTemplate Тип(конструктор) для данных которые будут лежать в пуле
 * @memberof DataPool
 **/
/**
 * DataPool Class
 * @ctor
 * Constructor of DataPool class
 **/
function DataPool (pEngine, fnTemplate) {
    /**
     * Массив групп
     * @type Array PoolGroup
     * @memberof DataPool
     **/
    this._pGroupList = new Array();
    //this._pGroupLis.clear(); //и так чистый
    /**
     * Общее число ячеек
     * @type Int
     * @memberof DataPool
     **/
    this._iTotalMembers = 0;
    /**
     * Количесвто свободных ячеек
     * @type Int
     * @memberof DataPool
     **/
    this._iTotalOpen = 0;

    /**
     * Количесвто элементов в группе
     * @type Int
     * @memberof DataPool
     **/
    this._iGroupCount = 0;
    /**
     * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
     * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
     * @type Int
     * @memberof DataPool
     **/
    this._iIndexMask = 0;
    /**
     * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
     * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
     * @type Int
     * @memberof DataPool
     **/
    this._iIndexShift = 0;

    DataPool.superclass.constructor.apply(this, arguments);
}

a.extend(DataPool, a.DataPoolInterface);

/**
 * @property initialize(Int iGrowSize)
 * Инициализация пула данных
 * @memberof DataPool
 * @param iGrowSize
 **/
DataPool.prototype.initialize = function (iGrowSize) {
    debug_assert(this.isInitialized() == false, "the cDataPool is already initialized");
    this._iInitialized = true;
    this._iGroupCount = Math.nearestPowerOfTwo(iGrowSize);
    this._iIndexShift = Math.lowestBitSet(this._iGroupCount);
    this._iIndexShift = Math.clamp(this._iIndexShift, 1, 15);
    this._iGroupCount = 1 << this._iIndexShift;
    this._iIndexMask = this._iGroupCount - 1;
}


/**
 * @property destroy()
 * Очистка пула и пометка о том что он больш не инициализирован
 * @memberof DataPool
 **/
DataPool.prototype.destroy = function () {
    this.clear();
    this._iInitialized = false;
}

/**
 * @property _getGroupNumber(Int iHandle)
 * Получение номера группы по номеру элемента
 * @memberof DataPool
 **/
DataPool.prototype._getGroupNumber = function (iHandle) {
    return iHandle >> this._iIndexShift;
}

/**
 * @property _getItemIndex(Int iHandle)
 * Получение номера элеменат в группе по его номеру
 * @memberof DataPool
 **/
DataPool.prototype._getItemIndex = function (iHandle) {
    return iHandle & this._iIndexMask;
}

/**
 * @property _buildHandle(Int iGroup, Int iIndex)
 * Полученяи номера элеменат по его номеру группы и группе
 * @memberof DataPool
 **/
DataPool.prototype._buildHandle = function (iGroup, iIndex) {
    return (iGroup << this._iIndexShift) + iIndex;
}


/**
 * @property forEach(Function fFunction)
 *  Цикл по всем объектам с приминением к ним функции, как fFunction(текущий пул данных, объект к торому применяется);
 * @memberof DataPoolInterface
 * @param function
 **/
DataPool.prototype.forEach = function (fFunction) {

    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
    // iterate through every group

    var iGroupNumber = 0;
    for (GroupIter = 0; GroupIter < this._pGroupList.length; GroupIter++) {
        var nCallbackCount = this._pGroupList[GroupIter].totalUsed();
        var iItemIndex = 0;
        while (nCallbackCount != 0 && iItemIndex < this._iGroupCount) {
            if (this._pGroupList[GroupIter].isOpen(iItemIndex) == false) {
                fFunction(this, this._buildHandle(iGroupNumber, iItemIndex),
                          this._pGroupList[GroupIter].member(iItemIndex));
                nCallbackCount--;
            }
            ++iItemIndex;
        }
        ++iGroupNumber;
    }
}


/**
 * @property clear()
 * Удаление всех групп
 * Все группы должны быть пусты, иначе во время удаления произойдет ошибка
 * @memberof DataPool
 **/
DataPool.prototype.clear = function () {
    // destroy all groups in the list
    for (var GroupIter in this._pGroupList) {
        this._pGroupList[GroupIter].destroy();
    }
    // now clear the list itself
    this._pGroupList.splice(0);
}

/**
 * @property _addGroup()
 * Добавление группы в пул
 * @memberof DataPool
 * @return Созданная группа
 **/
DataPool.prototype._addGroup = function () {
    // append a new group to the list to start things off
    var pNewGroup = new PoolGroup(this._pEngine, this._fnTemplate, this._iGroupCount);
    this._pGroupList.push(pNewGroup);
    // gain access to the new group and innitialize it
    pNewGroup.create();
    // increment our internal counters
    this._iTotalMembers += this._iGroupCount;
    this._iTotalOpen += this._iGroupCount;
    return pNewGroup;
}

/**
 * @property _findOpenGroup(Object pGroupNumber)
 * Поиск первой группы которая имеет свободную область
 * @memberof DataPool
 * @param pGroupNumber обязательно нужно пердавать объект, номер группы вернется в свойстве объкта value
 * @return Созданная группа
 **/
DataPool.prototype._findOpenGroup = function (pGroupNumber) {
    //alert("_findOpenGroup:1");
    pGroupNumber.value = 0;

    //найдем и вренем первую группу имеющую свободную группу
    //alert("this._pGroupList.length "+this._pGroupList.length);
    for (GroupIter = 0; GroupIter < this._pGroupList.length; GroupIter++) {
        //alert("_findOpenGroup: this._pGroupList[GroupIter].totalOpen() "+ this._pGroupList[GroupIter].totalOpen());
        if (this._pGroupList[GroupIter].totalOpen() > 0) {
            return this._pGroupList[GroupIter];
        }
        pGroupNumber.value++;
    }

    //свободных областей нет, поэтому мы должны добавить новую группу в пул,
    //но пержде чем содавать убедимся что не достигли максимума

    //alert("_findOpenGroup:2");
    debug_assert((this._pGroupList.length + 1) < MAX_UINT16, "the cDataPool is full!!!!");
    //добавим новую группу

    //alert("_findOpenGroup:3");
    return this._addGroup();
}

/**
 * @property _getGroup(Int iIndex)
 * Возвращает группу по ее номеру
 * @memberof DataPool
 * @param iIndex
 * @return группа
 **/
DataPool.prototype._getGroup = function (iIndex) {
    debug_assert(iIndex < this._pGroupList.length, "Invalid group index requested");
    //alert("this._pGroupList"+this._pGroupList);
    return this._pGroupList[iIndex];
}


/**
 * @property add(Object pMembers)
 * Добавляет новый элемент в пул
 * @memberof DataPool
 * @param pMembers
 * @return Int номер элемента
 **/
DataPool.prototype.add = function (pMembers) {

    //alert("add:1");

    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

    var iGroupNumber = {};
    iGroupNumber.value = 0;

    //alert("add:2");
    var pOpenGroup = this._findOpenGroup(iGroupNumber);

    //alert("add:3");
    var iIndex = pOpenGroup.addMember(pMembers);

    this._iTotalOpen--;


    //alert("add:4");
    return this._buildHandle(iGroupNumber.value, iIndex);
}

/**
 * Ищет первый свободный элемент в пуле
 * @return Int номер элемента
 **/
DataPool.prototype.nextHandle = function () {
    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

    var iGroupNumber = {};
    iGroupNumber.value = 0;
    var pOpenGroup = this._findOpenGroup(iGroupNumber);

    var iIndex = pOpenGroup.nextMember();
    this._iTotalOpen--;
    return this._buildHandle(iGroupNumber.value, iIndex);
}


/**
 * @property release(Int iHandle)
 * Высвобождаем элемент в пуле по его номеру
 * @memberof DataPool
 * @param iHandle
 **/
DataPool.prototype.release = function (iHandle) {
    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

    if (this.isHandleValid(iHandle) == true) {
        debug_assert(this._pGroupList.length != 0, "The cDataPool has not been properly created");
        //alert("release:1 " +this._iTotalOpen);
        var iGroupIndex = this._getGroupNumber(iHandle);
        //alert("release:2 " +this._iTotalOpen);
        var iItemIndex = this._getItemIndex(iHandle);
        //alert("release:3 " +this._iTotalOpen);
        pGroup = this._getGroup(iGroupIndex);
        //alert("release:4 " +this._iTotalOpen);
        pGroup.release(iItemIndex);
        //alert("release:5 " +this._iTotalOpen);
        pGroupBack = this._pGroupList[this._pGroupList.length - 1];
        //alert("release:6 " +this._iTotalOpen);
        if (pGroupBack.totalOpen() == this._iGroupCount) {
            pGroupBack.destroy();
            this._pGroupList.splice(this._pGroupList.length - 1, 1);
        }

        //alert("release:8 "+this._iTotalOpen);
        this._iTotalOpen++;
        //alert("release:9 "+this._iTotalOpen);
    }
}


/**
 * @property isHandleValid(Int iHandle)
 * Проверяется используется лм этот элемент
 * @memberof DataPool
 * @param iHandle
 * @return Boolean
 **/
DataPool.prototype.isHandleValid = function (iHandle) {
    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

    if (VALID_HANDLE(iHandle) == true) {
        debug_assert(this._pGroupList.length != 0, "The cDataPool has not been properly created");

        var pGroup = this._getGroup(this._getGroupNumber(iHandle));

        return !pGroup.isOpen(this._getItemIndex(iHandle));
    }
    return false;
}

/**
 * @property get(Int iHandle)
 * Возвратитть элемент по хендлу
 * @memberof DataPool
 * @param iHandle
 * @return Object
 **/
DataPool.prototype.get = function (iHandle) {
    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
    debug_assert(this._pGroupList.length != 0, "The cDataPool has not been properly created");

    var pGroup = this._getGroup(this._getGroupNumber(iHandle));
    var iItemIndex = this._getItemIndex(iHandle);

    return pGroup.member(iItemIndex);
}

/**
 * @property getPtr(Int iHandle)
 * Возвратитть элемент по хендлу
 * @memberof DataPool
 * @param iHandle
 * @return Object
 **/
DataPool.prototype.getPtr = function (iHandle) {
    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
    debug_assert(this._pGroupList.length != 0, "The cDataPool has not been properly created");

    //alert("iHandle "+ iHandle);
    //alert("DataPool.getPtr 1");
    //alert("this._getGroupNumber(iHandle) " +this._getGroupNumber(iHandle));
    var pGroup = this._getGroup(this._getGroupNumber(iHandle));

    //alert("pGroup " + pGroup);
    //alert("DataPool.getPtr 2");
    var iItemIndex = this._getItemIndex(iHandle);
    //alert("iItemIndex " + iItemIndex);
    //alert("DataPool.getPtr 3");
    return pGroup.memberPtr(iItemIndex);
}

/**
 * @property getGenericPtr(Int iIndex)
 * Возвратитть элемент по хендлу
 * @memberof DataPool
 * @param iHandle
 * @return Object
 **/
DataPool.prototype.getGenericPtr = function (iHandle) {
    debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
    return this.getPtr(iHandle);
}

a.DataPool = DataPool;

