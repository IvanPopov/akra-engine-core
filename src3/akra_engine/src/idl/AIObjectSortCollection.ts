// AIObjectSortCollection interface
// [write description here...]

module akra {
interface AICollectionIndexFunction {
	(pElement: any): int;
}

interface AIObjectSortCollection {
	getElementAt(iIndex: uint): any;
	setElementAt(iIndex: uint, pValue: any): void;
	removeElementAt(iIndex: uint): void;

	setCollectionFuncion(fnCollection: AICollectionIndexFunction): void;

	push(pElement: any): void;
	findElement(iCollectionIndex: int): any;
	takeElement(iCollectionIndex: int): any;
	clear(): void;
}
}