#ifndef TRITREENODE_TS
#define TRITREENODE_TS

#include "ITriTreeNode.ts"

module akra {
	export class TriangleNodePool implements ITriangleNodePool{
		private _iNextTriNode: uint = 0;
		private _iMaxCount: uint = iCount;
		private _pPool: Array = null;

		inline get nextTriNode(): uint {
			return this._iNextTriNode;
		}

		inline set nextTriNode(iNextTriNode: uint) {
			this._iNextTriNode = iNextTriNode;
		}

		inline get maxCount(): uint {
			return this._iMaxCount;
		}

		inline get pool(): uint {
			return this._pPool;
		}

		inline set pool(pPool) {
			this._pPool = pPool;
		}

		constructor(iCount: uint) { 
			this.pool = Array(this.maxCount);

			console.log("TriangleNodePool",this.maxCount);

			for(var i: uint = 0; i < this.maxCount; i++) {
				this.pool[i] = new TriTreeNode();
			}
		}

		request() {
			var pNode: ITriTreeNode = null;

			if(this.nextTriNode < this.maxCount) {
				pNode = this.pool[this.nextTriNode];
				pNode.pBaseNeighbor  = null;
				pNode.pLeftNeighbor  = null;
				pNode.pRightNeighbor = null;
				pNode.pLeftChild     = null;
				pNode.pRightChild    = null;
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



