/// <reference path="../idl/ITriTreeNode.ts" />

module akra.terrain {
	export class TriangleNodePool implements ITriangleNodePool {
		private _iNextTriNode: uint = 0;
		private _iMaxCount: uint = undefined;
		private _pPool: ITriTreeNode[] = null;

		getNextTriNode(): uint {
			return this._iNextTriNode;
		}

		setNextTriNode(iNextTriNode: uint): void {
			this._iNextTriNode = iNextTriNode;
		}

		getMaxCount(): uint {
			return this._iMaxCount;
		}

		getPool(): ITriTreeNode[] {
			return this._pPool;
		}

		setPool(pPool: ITriTreeNode[]): void {
			this._pPool = pPool;
		}

		constructor(iCount: uint) { 
			this._iMaxCount = iCount;
			this._pPool = <ITriTreeNode[]>Array(iCount);

			// console.log("TriangleNodePool",this.maxCount);

			for(var i: uint = 0; i < this._iMaxCount; i++) {
				this._pPool[i] = TriangleNodePool.createTriTreeNode();
			}
		}

		request(): ITriTreeNode {
			var pNode: ITriTreeNode = null;

			if(this._iNextTriNode < this._iMaxCount) {
				pNode = this._pPool[this._iNextTriNode];
				pNode.baseNeighbor  = null;
				pNode.leftNeighbor  = null;
				pNode.rightNeighbor = null;
				pNode.leftChild     = null;
				pNode.rightChild    = null;
				this._iNextTriNode++;
			}

			return pNode;
		}

		reset(): void {
			this._iNextTriNode = 0;
		}

		static createTriTreeNode(): ITriTreeNode {
			return {
				baseNeighbor: null,
				leftNeighbor: null,
				rightNeighbor: null,
				leftChild: null,
				rightChild: null
			};
		}
	}
}