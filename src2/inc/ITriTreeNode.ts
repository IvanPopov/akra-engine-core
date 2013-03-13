#ifndef ITRITREENODE_TS
#define ITRITREENODE_TS

module akra {
	export interface ITriTreeNode {
		baseNeighbor:  ITriTreeNode;
		leftNeighbor:  ITriTreeNode;
		rightNeighbor: ITriTreeNode;
		leftChild:     ITriTreeNode;
		rightChild:    ITriTreeNode;
	}

	export interface ITriangleNodePool {
		request();
		reset(): void;
	}
}

#endif