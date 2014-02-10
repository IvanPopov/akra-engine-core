/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IDataPool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />
var akra;
(function (akra) {
    /// <reference path="../debug.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../limit.ts" />
    /// <reference path="../math/math.ts" />
    (function (pool) {
        var PoolGroup = (function () {
            function PoolGroup(pManager, tTemplate, iMaxCount) {
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
                this.pManager = pManager;
                this.tTemplate = tTemplate;
                this.iMaxCount = iMaxCount;
            }
            PoolGroup.prototype.getManager = function () {
                return this.pManager;
            };

            /**
            * Возвращает количесвто свободных мест в группе
            * @
            */
            PoolGroup.prototype.getTotalOpen = function () {
                return this.iTotalOpen;
            };

            /**
            * Возвращает количесвто занятых мест в группе
            * @
            */
            PoolGroup.prototype.getTotalUsed = function () {
                return this.iMaxCount - this.iTotalOpen;
            };

            /**
            * Номер первого свободного элемента в группе
            * @
            */
            PoolGroup.prototype.getFirstOpen = function () {
                return this.iFirstOpen;
            };

            /** Создание группы, создается массив элементов, инициализирется список свободный и т.д. */
            PoolGroup.prototype.create = function () {
                var i;

                akra.debug.assert(this.pMemberList == null && this.pNextOpenList == null, "Group has already been created");

                this.pNextOpenList = new Array(this.iMaxCount);

                akra.debug.assert(this.pNextOpenList != null, "tragic memory allocation failure!");

                this.pMemberList = new Array(this.iMaxCount);

                for (i = 0; i < this.iMaxCount; i++) {
                    this.pMemberList[i] = new this.tTemplate(this.pManager);
                }

                akra.debug.assert(this.pNextOpenList != null, "tragic memory allocation failure!");

                for (i = 0; i < this.iMaxCount - 1; i++) {
                    this.pNextOpenList[i] = i + 1;
                }

                this.pNextOpenList[i] = i;
                this.iTotalOpen = this.iMaxCount;
                this.iFirstOpen = 0;
            };

            /**
            * Удаление группы: удаление массива элементов, списка совбодных элементов и т.д.
            * Выдается ошибка если группа не пуста
            * */
            PoolGroup.prototype.destroy = function () {
                akra.debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug.assert(this.iTotalOpen == this.iMaxCount, "Group is not empty");

                delete this.pMemberList;
                this.pMemberList = null;

                delete this.pNextOpenList;
                this.pNextOpenList = null;

                this.iTotalOpen = 0;
                this.iMaxCount = 0;
            };

            /** Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый */
            PoolGroup.prototype.nextMember = function () {
                akra.debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug.assert(this.iTotalOpen != null, "no open slots");

                //Возвращает номер первого свободного элемента в группе,
                //и изменяет номер первого свободного на следующего свободного
                var iSlot = this.iFirstOpen;
                this.iFirstOpen = this.pNextOpenList[iSlot];
                this.iTotalOpen--;

                akra.debug.assert(this.iFirstOpen != PoolGroup.INVALID_INDEX, "Invalid Open Index");
                akra.debug.assert(this.isOpen(iSlot), "invalid index");

                //помечаем что элемент который отдали является используемым
                this.pNextOpenList[iSlot] = PoolGroup.INVALID_INDEX;

                return iSlot;
            };

            /** Добавляем новый элемент в список */
            PoolGroup.prototype.addMember = function (pMember) {
                var iSlot = this.nextMember();
                this.pMemberList[iSlot] = pMember;

                return iSlot;
            };

            /** Исключение элемента из списка по его номеру */
            PoolGroup.prototype.release = function (iIndex) {
                akra.debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug.assert(iIndex < this.iMaxCount, "invalid index");
                akra.debug.assert(this.isOpen(iIndex) == false, "invalid index to release");

                this.pNextOpenList[iIndex] = this.iTotalOpen > 0 ? this.iFirstOpen : iIndex;
                this.iTotalOpen++;
                this.iFirstOpen = iIndex;
            };

            /** Проверить свободна ли эта ячейка в группе */
            PoolGroup.prototype.isOpen = function (iIndex) {
                akra.debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug.assert(iIndex < this.iMaxCount, "invalid index");

                return this.pNextOpenList[iIndex] != PoolGroup.INVALID_INDEX;
            };

            /** Получение элемента по его номеру */
            PoolGroup.prototype.member = function (iIndex) {
                akra.debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug.assert(iIndex < this.iMaxCount, "invalid index");
                return this.pMemberList[iIndex];
            };

            PoolGroup.prototype.memberPtr = function (iIndex) {
                akra.debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug.assert(iIndex < this.iMaxCount, "invalid index");
                return this.pMemberList[iIndex];
            };

            PoolGroup.INVALID_INDEX = 0xffff;
            return PoolGroup;
        })();
        pool.PoolGroup = PoolGroup;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=PoolGroup.js.map
