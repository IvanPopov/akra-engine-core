///<reference path="../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            var PoolGroup = (function () {
                function PoolGroup(pEngine, tTemplate, iMaxCount) {
                    /** Число свободных элементов группы */
                    this.iTotalOpen = 0;
                    /** Первый свободный элемент группы */
                    this.iFirstOpen = 0;
                    /** Колмичество элементов в группе */
                    this.iMaxCount = 0;
                    /** Список свободных элементов группы */
                    this.pNextOpenList = null;
                    /** Массив элементов группы */
                    this.pMemberList = null;
                    this.pEngine = pEngine;
                    this.tTemplate = tTemplate;
                    this.iMaxCount = iMaxCount;
                }
                /** Создание группы, создается массив элементов, инициализирется список свободный и т.д. */
                                Object.defineProperty(PoolGroup.prototype, "totalOpen", {
                    get: /**
                    * Возвращает количесвто свободных мест в группе
                    * @inline
                    */
                    function () {
                        return this.iTotalOpen;
                    }/**
                    * Возвращает количесвто занятых мест в группе
                    * @inline
                    */
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PoolGroup.prototype, "totalUsed", {
                    get: function () {
                        return this.iMaxCount - this.iTotalOpen;
                    }/**
                    * Номер первого свободного элемента в группе
                    * @inline
                    */
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PoolGroup.prototype, "firstOpen", {
                    get: function () {
                        return this.iFirstOpen;
                    },
                    enumerable: true,
                    configurable: true
                });
                PoolGroup.prototype.create = function () {
                    var i;
                    akra.debug_assert(this.pMemberList == null && this.pNextOpenList == null, "Group has already been created");
                    this.pNextOpenList = new Array(this.iMaxCount);
                    akra.debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");
                    this.pMemberList = new Array(this.iMaxCount);
                    for(i = 0; i < this.iMaxCount; i++) {
                        this.pMemberList[i] = new this.tTemplate(this.pEngine);
                    }
                    akra.debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");
                    for(i = 0; i < this.iMaxCount - 1; i++) {
                        this.pNextOpenList[i] = i + 1;
                    }
                    this.pNextOpenList[i] = i;
                    this.iTotalOpen = this.iMaxCount;
                    this.iFirstOpen = 0;
                }/**
                * Удаление группы: удаление массива элементов, списка совбодных элементов и т.д.
                * Выдается ошибка если группа не пуста
                * */
                ;
                PoolGroup.prototype.destroy = function () {
                    akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                    akra.debug_assert(this.iTotalOpen == this.iMaxCount, "Group is not empty");
                    delete this.pMemberList;
                    this.pMemberList = null;
                    delete this.pNextOpenList;
                    this.pNextOpenList = null;
                    this.iTotalOpen = 0;
                    this.iMaxCount = 0;
                }/** Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый */
                ;
                PoolGroup.prototype.nextMember = function () {
                    akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                    akra.debug_assert(this.iTotalOpen != null, "no open slots");
                    //Возвращает номер первого свободного элемента в группе,
                    //и изменяет номер первого свободного на следующего свободного
                    var iSlot = this.iFirstOpen;
                    this.iFirstOpen = this.pNextOpenList[iSlot];
                    this.iTotalOpen--;
                    akra.debug_assert(this.iFirstOpen != akra.INVALID_INDEX, "Invalid Open Index");
                    akra.debug_assert(this.isOpen(iSlot), "invalid index");
                    //помечаем что элемент который отдали является используемым
                    this.pNextOpenList[iSlot] = akra.INVALID_INDEX;
                    return iSlot;
                }/** Добавляем новый элемент в список */
                ;
                PoolGroup.prototype.addMember = function (pMember) {
                    var iSlot = this.nextMember();
                    this.pMemberList[iSlot] = pMember;
                    return iSlot;
                }/** Исключение элемента из списка по его номеру */
                ;
                PoolGroup.prototype.release = function (iIndex) {
                    akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                    akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                    akra.debug_assert(this.isOpen(iIndex) == false, "invalid index to release");
                    this.pNextOpenList[iIndex] = this.iTotalOpen > 0 ? this.iFirstOpen : iIndex;
                    this.iTotalOpen++;
                    this.iFirstOpen = iIndex;
                }/** Проверить свободна ли эта ячейка в группе */
                ;
                PoolGroup.prototype.isOpen = function (iIndex) {
                    akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                    akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                    return this.pNextOpenList[iIndex] != akra.INVALID_INDEX;
                }/** Получение элемента по его номеру */
                ;
                PoolGroup.prototype.member = function (iIndex) {
                    akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                    akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                    return this.pMemberList[iIndex];
                };
                PoolGroup.prototype.memberPtr = function (iIndex) {
                    akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                    akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                    return this.pMemberList[iIndex];
                };
                return PoolGroup;
            })();
            pool.PoolGroup = PoolGroup;            
            var DataPool = (function () {
                function DataPool(pEngine, tTemplate) {
                    this.bInitialized = false;
                    /** Массив групп */
                    this.pGroupList = null;
                    /** Общее число ячеек */
                    this.iTotalMembers = 0;
                    /** Количесвто свободных ячеек */
                    this.iTotalOpen = 0;
                    /** Количесвто элементов в группе */
                    this.iGroupCount = 0;
                    /**
                    * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
                    * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
                    */
                    this.iIndexMask = 0;
                    /**
                    * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
                    * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
                    */
                    this.iIndexShift = 0;
                    this.pEngine = pEngine;
                    this.tTemplate = tTemplate;
                }
                DataPool.prototype.initialize = function (iGrowSize) {
                    akra.debug_assert(this.isInitialized() == false, "the cDataPool is already initialized");
                    this.bInitialized = true;
                    this.iGroupCount = akra.math.nearestPowerOfTwo(iGrowSize);
                    this.iIndexShift = akra.math.lowestBitSet(this.iGroupCount);
                    this.iIndexShift = akra.math.clamp(this.iIndexShift, 1, 15);
                    this.iGroupCount = 1 << this.iIndexShift;
                    this.iIndexMask = this.iGroupCount - 1;
                }/** @inline */
                ;
                DataPool.prototype.isInitialized = function () {
                    return this.bInitialized;
                };
                DataPool.prototype.destroy = function () {
                    this.clear();
                    this.bInitialized = false;
                };
                DataPool.prototype.release = function (iHandle) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    if(this.isHandleValid(iHandle) == true) {
                        akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                        var iGroupIndex = this.getGroupNumber(iHandle);
                        var iItemIndex = this.getItemIndex(iHandle);
                        var pGroup = this.getGroup(iGroupIndex);
                        pGroup.release(iItemIndex);
                        var pGroupBack = this.pGroupList[this.pGroupList.length - 1];
                        if(pGroupBack.totalOpen == this.iGroupCount) {
                            pGroupBack.destroy();
                            this.pGroupList.splice(this.pGroupList.length - 1, 1);
                        }
                        this.iTotalOpen++;
                    }
                };
                DataPool.prototype.clear = function () {
                    // destroy all groups in the list
                    for(var iGroupIter = 0; iGroupIter < this.pGroupList.length; ++iGroupIter) {
                        this.pGroupList[iGroupIter].destroy();
                    }
                    // now clear the list itself
                    this.pGroupList.clear();
                };
                DataPool.prototype.add = function (pMembers) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    var iGroupNumber = {
                        value: 0
                    };
                    var pOpenGroup = this.findOpenGroup(iGroupNumber);
                    var iIndex = pOpenGroup.addMember(pMembers);
                    this.iTotalOpen--;
                    return this.buildHandle(iGroupNumber.value, iIndex);
                };
                DataPool.prototype.forEach = function (fFunction) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    // iterate through every group
                    var iGroupNumber = 0;
                    for(var iGroupIter = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
                        var nCallbackCount = this.pGroupList[iGroupIter].totalUsed;
                        var iItemIndex = 0;
                        while(nCallbackCount != 0 && iItemIndex < this.iGroupCount) {
                            if(this.pGroupList[iGroupIter].isOpen(iItemIndex) == false) {
                                fFunction(this, this.buildHandle(iGroupNumber, iItemIndex), this.pGroupList[iGroupIter].member(iItemIndex));
                                nCallbackCount--;
                            }
                            ++iItemIndex;
                        }
                        ++iGroupNumber;
                    }
                };
                DataPool.prototype.nextHandle = function () {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    var iGroupNumber = {
                        value: 0
                    };
                    var pOpenGroup = this.findOpenGroup(iGroupNumber);
                    var iIndex = pOpenGroup.nextMember();
                    this.iTotalOpen--;
                    return this.buildHandle(iGroupNumber.value, iIndex);
                };
                DataPool.prototype.isHandleValid = function (iHandle) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    if(iHandle !== akra.INVALID_INDEX) {
                        akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                        var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                        return !pGroup.isOpen(this.getItemIndex(iHandle));
                    }
                    return false;
                };
                DataPool.prototype.get = function (iHandle) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                    var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                    var iItemIndex = this.getItemIndex(iHandle);
                    return pGroup.member(iItemIndex);
                };
                DataPool.prototype.getPtr = function (iHandle) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                    var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                    var iItemIndex = this.getItemIndex(iHandle);
                    return pGroup.memberPtr(iItemIndex);
                };
                DataPool.prototype.getGenericPtr = function (iHandle) {
                    akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                    return this.getPtr(iHandle);
                }/**
                * @inline
                * Получение номера группы по номеру элемента
                */
                ;
                DataPool.prototype.getGroupNumber = function (iHandle) {
                    return iHandle >> this.iIndexShift;
                }/**
                * @inline
                * Получение номера элеменат в группе по его номеру
                */
                ;
                DataPool.prototype.getItemIndex = function (iHandle) {
                    return iHandle & this.iIndexMask;
                }/**
                * @inline
                * Полученяи номера элеменат по его номеру группы и группе
                */
                ;
                DataPool.prototype.buildHandle = function (iGroup, iIndex) {
                    return (iGroup << this.iIndexShift) + iIndex;
                }/** Добавление группы в пул */
                ;
                DataPool.prototype.addGroup = function () {
                    // append a new group to the list to start things off
                    var pNewGroup = new PoolGroup(this.pEngine, this.tTemplate, this.iGroupCount);
                    this.pGroupList.push(pNewGroup);
                    // gain access to the new group and innitialize it
                    pNewGroup.create();
                    // increment our internal counters
                    this.iTotalMembers += this.iGroupCount;
                    this.iTotalOpen += this.iGroupCount;
                    return pNewGroup;
                }/** Поиск первой группы которая имеет свободную область */
                ;
                DataPool.prototype.findOpenGroup = function (pGroupNumber) {
                    pGroupNumber.value = 0;
                    //найдем и вренем первую группу имеющую свободную группу
                    for(var iGroupIter = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
                        if(this.pGroupList[iGroupIter].totalOpen > 0) {
                            return this.pGroupList[iGroupIter];
                        }
                        pGroupNumber.value++;
                    }
                    //свободных областей нет, поэтому мы должны добавить новую группу в пул,
                    //но пержде чем содавать убедимся что не достигли максимума
                    akra.debug_assert((this.pGroupList.length + 1) < akra.MAX_UINT16, "the cDataPool is full!!!!");
                    //добавим новую группу
                    return this.addGroup();
                }/**
                * @inline
                * Возвращает группу по ее номеру
                */
                ;
                DataPool.prototype.getGroup = function (iIndex) {
                    akra.debug_assert(iIndex < this.pGroupList.length, "Invalid group index requested");
                    return this.pGroupList[iIndex];
                };
                return DataPool;
            })();
            pool.DataPool = DataPool;            
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
