#ifndef IENTITY_TS
#define IENTITY_TS 

module akra {

	IFACE(IExplorerFunc);
	IFACE(IReferenceCounter);

	export enum  EEntityTypes {
		UNKNOWN,
		NODE,
		
		JOINT,

		SCENE_NODE,
		SCENE_OBJECT,

		MODEL,
		TERRAIN_SECTION,
		TEXT3D,
		SPRITE,
		CAMERA,
		EMITTER,

		TOTAL
	}

	export interface IEntity extends IEventProvider, IReferenceCounter {
		name: string;

		parent: IEntity;
		sibling: IEntity;
		child: IEntity;

		readonly type: EEntityTypes;

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

		signal attached();
		signal detached();
	}

}

#endif
