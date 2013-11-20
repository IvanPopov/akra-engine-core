// AIObjectSortCollection interface
// [write description here...]


interface AICollectionIndexFunction {
	(pElement: any): int;
}

interface AIObjectSortCollection<T> {
	getElementAt(iIndex: uint): T;
	setElementAt(iIndex: uint, pValue: T): void;
	removeElementAt(iIndex: uint): void;

	setCollectionFuncion(fnCollection: AICollectionIndexFunction): void;

	push(pElement: any): void;
	findElement(iCollectionIndex: int): T;
	takeElement(iCollectionIndex: int): T;
	clear(): void;
}

