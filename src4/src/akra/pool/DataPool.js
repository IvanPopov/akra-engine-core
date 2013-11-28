var akra;
(function (akra) {
    /// <reference path="../idl/IEngine.ts" />
    /// <reference path="../idl/IDataPool.ts" />
    /// <reference path="../idl/IResourcePoolItem.ts" />
    /// <reference path="../idl/IResourcePoolManager.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../limit.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="PoolGroup.ts" />
    (function (pool) {
        var DataPool = (function () {
            function DataPool(pManager, tTemplate) {
                this.bInitialized = false;
                /** Массив групп */
                this.pGroupList = [];
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
                this.pManager = pManager;
                this.tTemplate = tTemplate;
            }
            Object.defineProperty(DataPool.prototype, "manager", {
                get: function () {
                    return this.pManager;
                },
                enumerable: true,
                configurable: true
            });

            DataPool.prototype.initialize = function (iGrowSize) {
                akra.debug.assert(this.isInitialized() == false, "the cDataPool is already initialized");

                this.bInitialized = true;
                this.iGroupCount = akra.math.nearestPowerOfTwo(iGrowSize);
                this.iIndexShift = akra.math.lowestBitSet(this.iGroupCount);
                this.iIndexShift = akra.math.clamp(this.iIndexShift, 1, 15);
                this.iGroupCount = 1 << this.iIndexShift;
                this.iIndexMask = this.iGroupCount - 1;
            };

            /** @ */
            DataPool.prototype.isInitialized = function () {
                return this.bInitialized;
            };

            DataPool.prototype.destroy = function () {
                this.clear();
                this.bInitialized = false;
            };

            DataPool.prototype.release = function (iHandle) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

                if (this.isHandleValid(iHandle) == true) {
                    akra.debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

                    var iGroupIndex = this.getGroupNumber(iHandle);
                    var iItemIndex = this.getItemIndex(iHandle);

                    var pGroup = this.getGroup(iGroupIndex);
                    pGroup.release(iItemIndex);
                    var pGroupBack = this.pGroupList[this.pGroupList.length - 1];

                    if (pGroupBack.totalOpen == this.iGroupCount) {
                        pGroupBack.destroy();
                        this.pGroupList.splice(this.pGroupList.length - 1, 1);
                    }

                    this.iTotalOpen++;
                }
            };

            DataPool.prototype.clear = function () {
                for (var iGroupIter = 0; iGroupIter < this.pGroupList.length; ++iGroupIter) {
                    this.pGroupList[iGroupIter].destroy();
                }

                // now clear the list itself
                this.pGroupList.clear();
            };

            DataPool.prototype.add = function (pMembers) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

                var iGroupNumber = { value: 0 };

                var pOpenGroup = this.findOpenGroup(iGroupNumber);
                var iIndex = pOpenGroup.addMember(pMembers);

                this.iTotalOpen--;

                return this.buildHandle(iGroupNumber.value, iIndex);
            };

            DataPool.prototype.forEach = function (fFunction) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

                // iterate through every group
                var iGroupNumber = 0;
                for (var iGroupIter = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
                    var nCallbackCount = this.pGroupList[iGroupIter].totalUsed;
                    var iItemIndex = 0;

                    while (nCallbackCount != 0 && iItemIndex < this.iGroupCount) {
                        if (this.pGroupList[iGroupIter].isOpen(iItemIndex) == false) {
                            fFunction(this, this.buildHandle(iGroupNumber, iItemIndex), this.pGroupList[iGroupIter].member(iItemIndex));
                            nCallbackCount--;
                        }

                        ++iItemIndex;
                    }

                    ++iGroupNumber;
                }
            };

            DataPool.prototype.nextHandle = function () {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

                var iGroupNumber = { value: 0 };
                var pOpenGroup = this.findOpenGroup(iGroupNumber);
                var iIndex = pOpenGroup.nextMember();

                this.iTotalOpen--;

                return this.buildHandle(iGroupNumber.value, iIndex);
            };

            DataPool.prototype.isHandleValid = function (iHandle) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

                if (iHandle !== pool.PoolGroup.INVALID_INDEX) {
                    akra.debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

                    var pGroup = this.getGroup(this.getGroupNumber(iHandle));

                    return !pGroup.isOpen(this.getItemIndex(iHandle));
                }

                return false;
            };

            DataPool.prototype.get = function (iHandle) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");
                akra.debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

                var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                var iItemIndex = this.getItemIndex(iHandle);

                return pGroup.member(iItemIndex);
            };

            DataPool.prototype.getPtr = function (iHandle) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");
                akra.debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

                var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                var iItemIndex = this.getItemIndex(iHandle);

                return pGroup.memberPtr(iItemIndex);
            };

            DataPool.prototype.getGenericPtr = function (iHandle) {
                akra.debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

                return this.getPtr(iHandle);
            };

            /**
            * @
            * Получение номера группы по номеру элемента
            */
            DataPool.prototype.getGroupNumber = function (iHandle) {
                return iHandle >> this.iIndexShift;
            };

            /**
            * @
            * Получение номера элеменат в группе по его номеру
            */
            DataPool.prototype.getItemIndex = function (iHandle) {
                return iHandle & this.iIndexMask;
            };

            /**
            * @
            * Полученяи номера элеменат по его номеру группы и группе
            */
            DataPool.prototype.buildHandle = function (iGroup, iIndex) {
                return (iGroup << this.iIndexShift) + iIndex;
            };

            /** Добавление группы в пул */
            DataPool.prototype.addGroup = function () {
                // append a new group to the list to start things off
                var pNewGroup = new pool.PoolGroup(this.pManager, this.tTemplate, this.iGroupCount);
                this.pGroupList.push(pNewGroup);

                // gain access to the new group and innitialize it
                pNewGroup.create();

                // increment our internal counters
                this.iTotalMembers += this.iGroupCount;
                this.iTotalOpen += this.iGroupCount;

                return pNewGroup;
            };

            /** Поиск первой группы которая имеет свободную область */
            DataPool.prototype.findOpenGroup = function (pGroupNumber) {
                pGroupNumber.value = 0;

                for (var iGroupIter = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
                    if (this.pGroupList[iGroupIter].totalOpen > 0) {
                        return this.pGroupList[iGroupIter];
                    }

                    pGroupNumber.value++;
                }

                //свободных областей нет, поэтому мы должны добавить новую группу в пул,
                //но пержде чем содавать убедимся что не достигли максимума
                akra.debug.assert((this.pGroupList.length + 1) < akra.MAX_UINT16, "the cDataPool is full!!!!");

                //добавим новую группу
                return this.addGroup();
            };

            /**
            * @
            * Возвращает группу по ее номеру
            */
            DataPool.prototype.getGroup = function (iIndex) {
                akra.debug.assert(iIndex < this.pGroupList.length, "Invalid group index requested");
                return this.pGroupList[iIndex];
            };
            return DataPool;
        })();
        pool.DataPool = DataPool;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
