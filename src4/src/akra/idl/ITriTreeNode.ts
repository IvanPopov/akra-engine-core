

module akra {
	interface ITriTreeNode {
	    baseNeighbor: ITriTreeNode;
	    leftNeighbor: ITriTreeNode;
	    rightNeighbor: ITriTreeNode;
	    leftChild: ITriTreeNode;
	    rightChild: ITriTreeNode;
	}
	
	interface ITriangleNodePool {
	    request(): ITriTreeNode;
	    reset(): void;
	}
	
	
	
}
