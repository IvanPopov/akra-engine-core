/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IDataPool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />

/// <reference path="../debug.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../math/math.ts" />

module akra.pool {

	export class PoolGroup {
		private pManager: IResourcePoolManager;

		/** Конструктор для создания данных в группе */
		private tTemplate: IResourcePoolItemType;

		/** Число свободных элементов группы */
		private iTotalOpen: uint = 0;
		/** Первый свободный элемент группы */
		private iFirstOpen: uint = 0;
		/** Колмичество элементов в группе */
		private iMaxCount: uint = 0;

		/** Список свободных элементов группы */
		private pNextOpenList: uint[] = null;
		/** Массив элементов группы */
		private pMemberList: IResourcePoolItem[] = null;

		getManager(): IResourcePoolManager { return this.pManager; }

		/** 
		 * Возвращает количесвто свободных мест в группе 
		 * @
		 */
		getTotalOpen(): uint {
			return this.iTotalOpen;
		}

		/** 
		 * Возвращает количесвто занятых мест в группе 
		 * @
		 */
		getTotalUsed(): uint {
			return this.iMaxCount - this.iTotalOpen;
		}

		/**
		 * Номер первого свободного элемента в группе
		 * @
		 */
		getFirstOpen(): uint {
			return this.iFirstOpen;
		}

		constructor(pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType, iMaxCount: uint) {
			this.pManager = pManager;
			this.tTemplate = tTemplate;
			this.iMaxCount = iMaxCount;
		}

		/** Создание группы, создается массив элементов, инициализирется список свободный и т.д. */
		create(): void {
			var i: int;

			debug.assert(this.pMemberList == null && this.pNextOpenList == null, "Group has already been created");

			this.pNextOpenList = new Array(this.iMaxCount);

			debug.assert(this.pNextOpenList != null, "tragic memory allocation failure!");

			this.pMemberList = new Array<IResourcePoolItem>(this.iMaxCount);


			for (i = 0; i < this.iMaxCount; i++) {
				this.pMemberList[i] = new this.tTemplate(this.pManager);
			}

			debug.assert(this.pNextOpenList != null, "tragic memory allocation failure!");

			for (i = 0; i < this.iMaxCount - 1; i++) {
				this.pNextOpenList[i] = i + 1;
			}

			this.pNextOpenList[i] = i;
			this.iTotalOpen = this.iMaxCount;
			this.iFirstOpen = 0;
		}

		/**  
		 * Удаление группы: удаление массива элементов, списка совбодных элементов и т.д.
		 * Выдается ошибка если группа не пуста 
		 * */
		destroy(): void {
			debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
			debug.assert(this.iTotalOpen == this.iMaxCount, "Group is not empty");

			delete this.pMemberList;
			this.pMemberList = null;

			delete this.pNextOpenList;
			this.pNextOpenList = null;

			this.iTotalOpen = 0;
			this.iMaxCount = 0;
		}

		/** Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый */
		nextMember() {
			debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
			debug.assert(this.iTotalOpen != null, "no open slots");
			//Возвращает номер первого свободного элемента в группе,
			//и изменяет номер первого свободного на следующего свободного

			var iSlot = this.iFirstOpen;
			this.iFirstOpen = this.pNextOpenList[iSlot];
			this.iTotalOpen--;

			debug.assert(this.iFirstOpen != PoolGroup.INVALID_INDEX, "Invalid Open Index");
			debug.assert(this.isOpen(iSlot), "invalid index");

			//помечаем что элемент который отдали является используемым
			this.pNextOpenList[iSlot] = PoolGroup.INVALID_INDEX;

			return iSlot;
		}

		/** Добавляем новый элемент в список */
		addMember(pMember: IResourcePoolItem): uint {
			var iSlot: uint = this.nextMember();
			this.pMemberList[iSlot] = pMember;

			return iSlot;
		}

		/** Исключение элемента из списка по его номеру */
		release(iIndex: uint): void {
			debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
			debug.assert(iIndex < this.iMaxCount, "invalid index");
			debug.assert(this.isOpen(iIndex) == false, "invalid index to release");

			this.pNextOpenList[iIndex] = this.iTotalOpen > 0 ? this.iFirstOpen : iIndex;
			this.iTotalOpen++;
			this.iFirstOpen = iIndex;
		}


		/** Проверить свободна ли эта ячейка в группе */
		isOpen(iIndex: uint): boolean {
			debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
			debug.assert(iIndex < this.iMaxCount, "invalid index");

			return this.pNextOpenList[iIndex] != PoolGroup.INVALID_INDEX;
		}

		/** Получение элемента по его номеру */
		member(iIndex: uint): IResourcePoolItem {
			debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
			debug.assert(iIndex < this.iMaxCount, "invalid index");
			return this.pMemberList[iIndex];
		}

		memberPtr(iIndex: uint): IResourcePoolItem {
			debug.assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
			debug.assert(iIndex < this.iMaxCount, "invalid index");
			return this.pMemberList[iIndex];
		}

		static INVALID_INDEX: uint = 0xffff;
	}
}