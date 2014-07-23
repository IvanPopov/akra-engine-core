module akra {
	export interface ITriTreeNode {
	    baseNeighbor: ITriTreeNode;
	    leftNeighbor: ITriTreeNode;
	    rightNeighbor: ITriTreeNode;
	    leftChild: ITriTreeNode;
	    rightChild: ITriTreeNode;
	}
	
	export interface ITriangleNodePool {
		getMaxCount(): uint;
		
		getNextTriNode(): uint;
		setNextTriNode(iNextTriNode: uint): void;

		getPool(): ITriTreeNode[];
		setPool(pPool: ITriTreeNode[]): void;

	    request(): ITriTreeNode;
	    reset(): void;
	}	
}
