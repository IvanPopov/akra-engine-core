

module akra {
	interface ICollectionIndexFunction {
		(pElement: any): int;
	}
	
	interface IObjectSortCollection<T> {
		getElementAt(iIndex: uint): T;
		setElementAt(iIndex: uint, pValue: T): void;
		removeElementAt(iIndex: uint): void;
	
		setCollectionFuncion(fnCollection: ICollectionIndexFunction): void;
	
		push(pElement: any): void;
		findElement(iCollectionIndex: int): T;
		takeElement(iCollectionIndex: int): T;
		clear(): void;
	}
	
	
}
