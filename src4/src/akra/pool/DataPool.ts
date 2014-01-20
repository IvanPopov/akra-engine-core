/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IDataPool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />

/// <reference path="../debug.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../math/math.ts" />

/// <reference path="PoolGroup.ts" />

module akra.pool {

	export interface IGroupNumber {
		value: uint;
	}

	
	export class DataPool implements IDataPool {
		private pManager: IResourcePoolManager;
		private tTemplate: IResourcePoolItemType;
		private bInitialized: boolean = false;

		/** Массив групп */
		private pGroupList: PoolGroup[] = [];

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


		 get manager(): IResourcePoolManager { return this.pManager; }

		constructor(pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType) {
			this.pManager = pManager;
			this.tTemplate = tTemplate;
		}


		initialize(iGrowSize: uint): void {
			debug.assert(this.isInitialized() == false, "the cDataPool is already initialized");

			this.bInitialized = true;
			this.iGroupCount = math.nearestPowerOfTwo(iGrowSize);
			this.iIndexShift = math.lowestBitSet(this.iGroupCount);
			this.iIndexShift = math.clamp(this.iIndexShift, 1, 15);
			this.iGroupCount = 1 << this.iIndexShift;
			this.iIndexMask = this.iGroupCount - 1;
		}


		/** @ */
		isInitialized(): boolean {
			return this.bInitialized;
		}


		destroy(): void {
			this.clear();
			this.bInitialized = false;
		}


		release(iHandle: int): void {
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

			if (this.isHandleValid(iHandle) == true) {
				debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
				
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
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

			var iGroupNumber: IGroupNumber = {value: 0};

			var pOpenGroup: PoolGroup = this.findOpenGroup(iGroupNumber);
			var iIndex: uint = pOpenGroup.addMember(pMembers);

			this.iTotalOpen --;

			return this.buildHandle(iGroupNumber.value, iIndex);
		}
		
		forEach(fFunction: (pPool: IDataPool, iHandle: int, pMember: IResourcePoolItem) => void): void {
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");
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
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

			var iGroupNumber: IGroupNumber = {value: 0};
			var pOpenGroup: PoolGroup = this.findOpenGroup(iGroupNumber);
			var iIndex: uint = pOpenGroup.nextMember();

			this.iTotalOpen --;

			return this.buildHandle(iGroupNumber.value, iIndex);
		}

		isHandleValid(iHandle: int): boolean {
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

			if (iHandle !== PoolGroup.INVALID_INDEX) {
				debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

				var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));

				return !pGroup.isOpen(this.getItemIndex(iHandle));
			}

			return false;
		}

		get(iHandle: int): IResourcePoolItem {
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");
			debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

			var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));
			var iItemIndex: uint = this.getItemIndex(iHandle);

			return pGroup.member(iItemIndex);
		}

		getPtr(iHandle: int): IResourcePoolItem {
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");
			debug.assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

			var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));
			var iItemIndex: uint = this.getItemIndex(iHandle);

			return pGroup.memberPtr(iItemIndex);
		}

		getGenericPtr(iHandle: int): IResourcePoolItem {
			debug.assert(this.isInitialized() == true, "the cDataPool is not initialized");

			return this.getPtr(iHandle);
		}
	

		/** 
		 * @ 
		 * Получение номера группы по номеру элемента
		 */
		private getGroupNumber(iHandle: int): int {
			return iHandle >> this.iIndexShift;
		}

		/** 
		 * @ 
		 * Получение номера элеменат в группе по его номеру
		 */
		private getItemIndex(iHandle: int): int {
			return iHandle & this.iIndexMask;
		}

		/** 
		 * @ 
		 * Полученяи номера элеменат по его номеру группы и группе
		 */
		private buildHandle(iGroup, iIndex): int {
			return (iGroup << this.iIndexShift) + iIndex;
		}

		/** Добавление группы в пул */
		private addGroup(): PoolGroup {
			// append a new group to the list to start things off
			var pNewGroup: PoolGroup = new PoolGroup(this.pManager, this.tTemplate, this.iGroupCount);
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

			debug.assert((this.pGroupList.length + 1) < MAX_UINT16, "the cDataPool is full!!!!");
			//добавим новую группу

			return this.addGroup();
		}

		/** 
		 * @ 
		 * Возвращает группу по ее номеру
		 */
		private getGroup(iIndex: uint): PoolGroup {
			debug.assert(iIndex < this.pGroupList.length, "Invalid group index requested");
			return this.pGroupList[iIndex];
		}
	}
}
