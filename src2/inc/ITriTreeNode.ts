#ifndef ITRITREENODE_TS
#define ITRITREENODE_TS

module akra {
	export interface ITriTreeNode {
		pBaseNeighbor;
		pLeftNeighbor;
		pRightNeighbor;
		pLeftChild;
		pRightChild;
	}

	export interface TriangleNodePool {
		request();
		reset(): void;
	}
}

#endif