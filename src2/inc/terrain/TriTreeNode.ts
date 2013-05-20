#ifndef TRITREENODE_TS
#define TRITREENODE_TS

#include "ITriTreeNode.ts"

module akra.terrain {
	export class TriTreeNode implements ITriTreeNode{
		private _pBaseNeighbor:  ITriTreeNode = null;
		private _pLeftNeighbor:  ITriTreeNode = null;
		private _pRightNeighbor: ITriTreeNode = null;
		private _pLeftChild:     ITriTreeNode = null;
		private _pRightChild:    ITriTreeNode = null;

		inline get baseNeighbor(): ITriTreeNode {
			return this._pBaseNeighbor;
		}

		inline set baseNeighbor(pBaseNeighbor: ITriTreeNode) {
			this._pBaseNeighbor = pBaseNeighbor;
		}

		inline get leftNeighbor(): ITriTreeNode {
			return this._pLeftNeighbor;
		}

		inline set leftNeighbor(pLeftNeighbor: ITriTreeNode) {
			this._pLeftNeighbor = pLeftNeighbor;
		}

		inline get rightNeighbor(): ITriTreeNode {
			return this._pRightNeighbor;
		}

		inline set rightNeighbor(pRightNeighbor: ITriTreeNode) {
			this._pRightNeighbor = pRightNeighbor;
		}

		inline get leftChild(): ITriTreeNode {
			return this._pLeftChild;
		}

		inline set leftChild(pLeftChild: ITriTreeNode) {
			this._pLeftChild = pLeftChild;
		}

		inline get rightChild(): ITriTreeNode {
			return this._pRightChild;
		}

		inline set rightChild(pRightChild: ITriTreeNode) {
			this._pRightChild = pRightChild;
		}
	}

	export class TriangleNodePool implements ITriangleNodePool{
		private _iNextTriNode: uint = 0;
		private _iMaxCount: uint = undefined;
		private _pPool: ITriTreeNode[] = null;

		inline get nextTriNode(): uint {
			return this._iNextTriNode;
		}

		inline set nextTriNode(iNextTriNode: uint) {
			this._iNextTriNode = iNextTriNode;
		}

		inline get maxCount(): uint {
			return this._iMaxCount;
		}

		inline get pool(): ITriTreeNode[] {
			return this._pPool;
		}

		inline set pool(pPool: ITriTreeNode[]) {
			this._pPool = pPool;
		}

		constructor(iCount: uint) { 
			this._iMaxCount = iCount;
			this.pool = <ITriTreeNode[]>Array(iCount);

			// console.log("TriangleNodePool",this.maxCount);

			for(var i: uint = 0; i < this.maxCount; i++) {
				this.pool[i] = new TriTreeNode();
			}
		}

		request(): ITriTreeNode {
			var pNode: ITriTreeNode = null;

			if(this.nextTriNode < this.maxCount) {
				pNode = this.pool[this.nextTriNode];
				pNode.baseNeighbor  = null;
				pNode.leftNeighbor  = null;
				pNode.rightNeighbor = null;
				pNode.leftChild     = null;
				pNode.rightChild    = null;
				this.nextTriNode++;
			}

			return pNode;
		}

		reset(): void {
			this.nextTriNode = 0;
		}
	}
}

#endif



