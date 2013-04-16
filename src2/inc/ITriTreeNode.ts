#ifndef ITRITREENODE_TS
#define ITRITREENODE_TS

module akra {
	export interface ITriTreeNode {
		baseNeighbor:  ITriTreeNode;
		leftNeighbor:  ITriTreeNode;
		rightNeighbor: ITriTreeNode;
		leftChild:     ITriTreeNode;
		rightChild:    ITriTreeNode;
		id: uint;
	}

	export interface ITriangleNodePool {
		request(): ITriTreeNode;
		reset(): void;
	}
}

#endif