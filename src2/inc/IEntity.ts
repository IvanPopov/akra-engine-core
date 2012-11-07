#ifndef IENTITY_TS
#define IENTITY_TS 

module akra {

	IFACE(IExplorerFunc);
	IFACE(IReferenceCounter);

	export interface IEntity extends IReferenceCounter {
		name: string;

		parent: IEntity;
		sibling: IEntity;
		child: IEntity;

		readonly depth: int;
		readonly root: IEntity;

		create(): bool;
		destroy(): void;

		findEntity(sName: string): IEntity;
		explore(fn: IExplorerFunc): void;
		childOf(pParent: IEntity): bool;
		siblingCount(): uint;
		childCount(): uint;

		update(): void;
		recursiveUpdate(): void;
		recursivePreUpdate(): void;
		prepareForUpdate(): void;

		hasParent(): bool;
		hasChild(): bool;
		hasSibling(): bool;

		isASibling(pSibling: IEntity): bool;
		isAChild(pChild: IEntity): bool;
		isInFamily(pEntity: IEntity, bSearchEntireTree?: bool): bool;


		addSibling(pSibling: IEntity): IEntity;
		addChild(pChild: IEntity): IEntity;
		removeChild(pChild: IEntity): IEntity;
		removeAllChildren(): void;

		attachToParent(pParent: IEntity): bool;
		detachFromParent(): bool;
		
		promoteChildren(): void;
		relocateChildren(pParent: IEntity): void;

		toString(isRecursive?: bool, iDepth?: int): string;
	}

}

#endif
