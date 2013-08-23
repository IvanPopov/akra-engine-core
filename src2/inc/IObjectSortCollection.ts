#ifndef IOBJECTSORTCOLLECTION_TS
#define IOBJECTSORTCOLLECTION_TS

module akra {
	export interface ICollectionIndexFunction {
		(pElement: any): int;
	}

	export interface IObjectSortCollection {
		getElementAt(iIndex: uint): any;
		setElementAt(iIndex: uint, pValue: any): void;
		removeElementAt(iIndex: uint): void;

		setCollectionFuncion(fnCollection: ICollectionIndexFunction): void;

		push(pElement: any): void;
		findElement(iCollectionIndex: int): any;
		takeElement(iCollectionIndex: int): any;
		clear(): void;
	}
}
#endif