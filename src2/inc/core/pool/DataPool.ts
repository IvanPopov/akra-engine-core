#ifndef DATAPOOL_TS
#define DATAPOOL_TS

#include "IEngine.ts"
#include "IDataPool.ts"
#include "IResourcePoolItem.ts"


module akra.core.pool {

	export interface IGroupNumber {
		value: uint;
	}

	export class PoolGroup {
		private pEngine: IEngine;

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

		/** 
		 * Возвращает количесвто свободных мест в группе 
		 * @inline
		 */
		get totalOpen(): uint {
			return this.iTotalOpen;
		}

		/** 
		 * Возвращает количесвто занятых мест в группе 
		 * @inline
		 */
		get totalUsed(): uint {
			return this.iMaxCount - this.iTotalOpen;
		}

		/**
		 * Номер первого свободного элемента в группе
		 * @inline
		 */
		get firstOpen(): uint {
			return this.iFirstOpen;
		}

		constructor (pEngine: IEngine, tTemplate: IResourcePoolItemType, iMaxCount: uint) {
			this.pEngine = pEngine;
			this.tTemplate = tTemplate;
			this.iMaxCount = iMaxCount;
		}

		/** Создание группы, создается массив элементов, инициализирется список свободный и т.д. */
		create(): void {
			var i: int;

		    debug_assert(this.pMemberList == null && this.pNextOpenList == null, "Group has already been created");

		    this.pNextOpenList = new Array(this.iMaxCount);
		    
		    debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");

		    this.pMemberList = new Array(this.iMaxCount);


		    for (i = 0; i < this.iMaxCount; i++) {
		        this.pMemberList[i] = new this.tTemplate(this.pEngine);
		    }

		    debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");

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
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(this.iTotalOpen == this.iMaxCount, "Group is not empty");

		    delete this.pMemberList;
		    this.pMemberList = null;

		    delete this.pNextOpenList;
		    this.pNextOpenList = null;

		    this.iTotalOpen = 0;
		    this.iMaxCount = 0;
		}

		/** Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый */
		nextMember() {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(this.iTotalOpen != null, "no open slots");
		    //Возвращает номер первого свободного элемента в группе,
		    //и изменяет номер первого свободного на следующего свободного

		    var iSlot = this.iFirstOpen;
		    this.iFirstOpen = this.pNextOpenList[iSlot];
		    this.iTotalOpen --;

		    debug_assert(this.iFirstOpen != INVALID_INDEX, "Invalid Open Index");
		    debug_assert(this.isOpen(iSlot), "invalid index");

		    //помечаем что элемент который отдали является используемым
		    this.pNextOpenList[iSlot] = INVALID_INDEX;

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
			debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");
		    debug_assert(this.isOpen(iIndex) == false, "invalid index to release");

		    this.pNextOpenList[iIndex] = this.iTotalOpen > 0 ? this.iFirstOpen : iIndex;
		    this.iTotalOpen ++;
		    this.iFirstOpen = iIndex;
		}


		/** Проверить свободна ли эта ячейка в группе */
		isOpen (iIndex: uint): bool {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");

		    return this.pNextOpenList[iIndex] != INVALID_INDEX;
		}

		/** Получение элемента по его номеру */
		member(iIndex: uint): IResourcePoolItem {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");
		    return this.pMemberList[iIndex];
		}

		memberPtr(iIndex: uint): IResourcePoolItem {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");
		    return this.pMemberList[iIndex];
		}
	}

	export class DataPool implements IDataPool {
		private pEngine: IEngine;
		private tTemplate: IResourcePoolItemType;
		private bInitialized: bool = false;

		/** Массив групп */
		private pGroupList: PoolGroup[] = null;

		/** Общее число ячеек */
		private iTotalMembers: uint = 0;
		/** Количесвто свободных ячеек */
		private iTotalOpen: uint = 0;
		/** Количесвто элементов в группе */
		private iGroupCount: uint = 0;
		/**
		 * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
    	 * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
		 */
		private iIndexMask: int = 0;
		/**
		 * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
     	 * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
		 */
		private iIndexShift: int = 0;


		constructor(pEngine: IEngine, tTemplate: IResourcePoolItemType) {
			this.pEngine = pEngine;
			this.tTemplate = tTemplate;
		}


		initialize(iGrowSize: uint): void {
			debug_assert(this.isInitialized() == false, "the cDataPool is already initialized");

		    this.bInitialized = true;
		    this.iGroupCount = math.nearestPowerOfTwo(iGrowSize);
		    this.iIndexShift = math.lowestBitSet(this.iGroupCount);
		    this.iIndexShift = math.clamp(this.iIndexShift, 1, 15);
		    this.iGroupCount = 1 << this.iIndexShift;
		    this.iIndexMask = this.iGroupCount - 1;
		}


		/** @inline */
		isInitialized(): bool {
			return this.bInitialized;
		}


		destroy(): void {
			this.clear();
    		this.bInitialized = false;
		}


		release(iHandle: int): void {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    if (this.isHandleValid(iHandle) == true) {
		        debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
		        
		        var iGroupIndex: uint = this.getGroupNumber(iHandle);
		        var iItemIndex: uint = this.getItemIndex(iHandle);

		        var pGroup: PoolGroup = this.getGroup(iGroupIndex);
		        pGroup.release(iItemIndex);
		        var pGroupBack: PoolGroup = this.pGroupList[this.pGroupList.length - 1];

		        if (pGroupBack.totalOpen == this.iGroupCount) {
		            pGroupBack.destroy();
		            this.pGroupList.splice(this.pGroupList.length - 1, 1);
		        }

		        this.iTotalOpen ++;
		    }
		}
		
		clear(): void {
			// destroy all groups in the list
		    for (var iGroupIter: uint = 0; iGroupIter < this.pGroupList.length; ++ iGroupIter) {
		        this.pGroupList[iGroupIter].destroy();
		    }

		    // now clear the list itself
		    this.pGroupList.clear();
		}

		add(pMembers: IResourcePoolItem): int {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    var iGroupNumber: IGroupNumber = {value: 0};

		    var pOpenGroup: PoolGroup = this.findOpenGroup(iGroupNumber);
		    var iIndex: uint = pOpenGroup.addMember(pMembers);

		    this.iTotalOpen --;

		    return this.buildHandle(iGroupNumber.value, iIndex);
		}
		
		forEach(fFunction: (pPool: IDataPool, iHandle: int, pMember: IResourcePoolItem) => void): void {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
		    // iterate through every group

		    var iGroupNumber: uint = 0;
		    for (var iGroupIter: uint = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
		        
		        var nCallbackCount: uint = this.pGroupList[iGroupIter].totalUsed;
		        var iItemIndex: uint = 0;

		        while (nCallbackCount != 0 && iItemIndex < this.iGroupCount) {
		            if (this.pGroupList[iGroupIter].isOpen(iItemIndex) == false) {
		                fFunction(
		                	this, 
		                	this.buildHandle(iGroupNumber, iItemIndex), 
		                	this.pGroupList[iGroupIter].member(iItemIndex)
		                	);
		                nCallbackCount--;
		            }

		            ++iItemIndex;
		        }

		        ++iGroupNumber;
		    }
		}
		
		nextHandle(): int {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    var iGroupNumber: IGroupNumber = {value: 0};
		    var pOpenGroup: PoolGroup = this.findOpenGroup(iGroupNumber);
		    var iIndex: uint = pOpenGroup.nextMember();

		    this.iTotalOpen --;

		    return this.buildHandle(iGroupNumber.value, iIndex);
		}

		isHandleValid(iHandle: int): bool {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    if (iHandle !== INVALID_INDEX) {
		        debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		        var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));

		        return !pGroup.isOpen(this.getItemIndex(iHandle));
		    }

		    return false;
		}

		get(iHandle: int): IResourcePoolItem {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
		    debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		    var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));
		    var iItemIndex: uint = this.getItemIndex(iHandle);

		    return pGroup.member(iItemIndex);
		}

		getPtr(iHandle: int): IResourcePoolItem {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
		    debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		    var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));
		    var iItemIndex: uint = this.getItemIndex(iHandle);

		    return pGroup.memberPtr(iItemIndex);
		}

		getGenericPtr(iHandle: int): IResourcePoolItem {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

    		return this.getPtr(iHandle);
		}

		/** 
		 * @inline 
		 * Получение номера группы по номеру элемента
		 */
		private getGroupNumber(iHandle: int): int {
			return iHandle >> this.iIndexShift;
		}

		/** 
		 * @inline 
		 * Получение номера элеменат в группе по его номеру
		 */
		private getItemIndex(iHandle: int): int {
			return iHandle & this.iIndexMask;
		}

		/** 
		 * @inline 
		 * Полученяи номера элеменат по его номеру группы и группе
		 */
		private buildHandle(iGroup, iIndex): int {
			return (iGroup << this.iIndexShift) + iIndex;
		}

		/** Добавление группы в пул */
		private addGroup(): PoolGroup {
			// append a new group to the list to start things off
		    var pNewGroup: PoolGroup = new PoolGroup(this.pEngine, this.tTemplate, this.iGroupCount);
		    this.pGroupList.push(pNewGroup);
		    // gain access to the new group and innitialize it
		    pNewGroup.create();
		    // increment our internal counters
		    this.iTotalMembers += this.iGroupCount;
		    this.iTotalOpen += this.iGroupCount;

		    return pNewGroup;
		}

		/** Поиск первой группы которая имеет свободную область */
		private findOpenGroup(pGroupNumber: IGroupNumber): PoolGroup {
			pGroupNumber.value = 0;

		    //найдем и вренем первую группу имеющую свободную группу
		    for (var iGroupIter: uint = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
		        if (this.pGroupList[iGroupIter].totalOpen > 0) {
		            return this.pGroupList[iGroupIter];
		        }

		        pGroupNumber.value ++;
		    }

		    //свободных областей нет, поэтому мы должны добавить новую группу в пул,
		    //но пержде чем содавать убедимся что не достигли максимума

		    debug_assert((this.pGroupList.length + 1) < MAX_UINT16, "the cDataPool is full!!!!");
		    //добавим новую группу

		    return this.addGroup();
		}

		/** 
		 * @inline 
		 * Возвращает группу по ее номеру
		 */
		private getGroup(iIndex: uint): PoolGroup {
			debug_assert(iIndex < this.pGroupList.length, "Invalid group index requested");
    		return this.pGroupList[iIndex];
		}


	}
}

#endif
