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

		CAMERA,
		SHADOW_CASTER,

		LIGHT_PROJECT = 37,
		LIGHT_OMNI_DIRECTIONAL,

		SCENE_OBJECT = 64,

		MODEL,
		TERRAIN_SECTION,
		TEXT3D,
		SPRITE,
		EMITTER,

		UI_NODE = 100,
		// UI_HTMLNODE,
		// UI_DNDNODE,

		// UI_COMPONENT,
		// UI_BUTTON,
		// UI_LABEL,
		// UI_TREE,

		OBJECTS_LIMIT = 128
	}

	export interface IEntity extends IEventProvider, IReferenceCounter {
		name: string;

		parent: IEntity;
		sibling: IEntity;
		child: IEntity;

		readonly rightSibling: IEntity;

		readonly type: EEntityTypes;

		readonly depth: int;
		readonly root: IEntity;

		//create(): bool;//moved to INode
		destroy(): void;

		findEntity(sName: string): IEntity;
		explore(fn: IExplorerFunc): void;
		childOf(pParent: IEntity): bool;
		siblingCount(): uint;
		childCount(): uint;

		update(): bool;
		recursiveUpdate(): bool;
		recursivePreUpdate(): void;
		prepareForUpdate(): void;

		hasParent(): bool;
		hasChild(): bool;
		hasSibling(): bool;

		isASibling(pSibling: IEntity): bool;
		isAChild(pChild: IEntity): bool;
		isInFamily(pEntity: IEntity, bSearchEntireTree?: bool): bool;

		//обновлен ли сам узел
		isUpdated(): bool;
		//есть ли обновления среди потомков?
		hasUpdatedSubNodes(): bool;


		addSibling(pSibling: IEntity): IEntity;
		addChild(pChild: IEntity): IEntity;
		removeChild(pChild: IEntity): IEntity;
		removeAllChildren(): void;

		attachToParent(pParent: IEntity): bool;
		detachFromParent(): bool;
		
		promoteChildren(): void;
		relocateChildren(pParent: IEntity): void;

		toString(isRecursive?: bool, iDepth?: int): string;

		signal attached(): void;
		signal detached(): void;

		signal childAdded(pChild: IEntity): void;
		signal childRemoved(pChild: IEntity): void;
	}

}

#endif
