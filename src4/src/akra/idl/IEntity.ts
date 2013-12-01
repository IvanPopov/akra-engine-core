

/// <reference path="IExplorerFunc.ts" />
/// <reference path="IReferenceCounter.ts" />

module akra {
	export enum EEntityTypes {
		UNKNOWN,
		NODE,
		
		JOINT,
	
		SCENE_NODE,
	
		CAMERA,
		SHADOW_CASTER,
	
		MODEL_ENTRY,
	
		LIGHT = 37,
	
		SCENE_OBJECT = 64,
	
		MODEL,
	
		TERRAIN,
		TERRAIN_ROAM,
		TERRAIN_SECTION,
		TERRAIN_SECTION_ROAM,
		
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
	
	export interface IEntity<T extends IEntity<T>> extends IEventProvider, IReferenceCounter {
		name: string;
	
		parent: T;
		sibling: T;
		child: T;
	
		/** readonly */ rightSibling: T;
	
		/** readonly */ type: EEntityTypes;
	
		/** readonly */ depth: int;
		/** readonly */ root: T;
	
		//create(): boolean;//moved to INode
		destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void;
	
		findEntity(sName: string): T;
		explore(fn: IExplorerFunc): void;
		childOf(pParent: T): boolean;
		siblingCount(): uint;
		childCount(): uint;
		children(): T[];
		childAt(i: int): T;
		descCount(): uint;
	
		update(): boolean;
		recursiveUpdate(): boolean;
		recursivePreUpdate(): void;
		prepareForUpdate(): void;
	
		hasParent(): boolean;
		hasChild(): boolean;
		hasSibling(): boolean;
	
		isASibling(pSibling: T): boolean;
		isAChild(pChild: T): boolean;
		isInFamily(pEntity: T, bSearchEntireTree?: boolean): boolean;
	
		//обновлен ли сам узел
		isUpdated(): boolean;
		//есть ли обновления среди потомков?
		hasUpdatedSubNodes(): boolean;
	
	
		addSibling(pSibling: T): T;
		addChild(pChild: T): T;
		removeChild(pChild: T): T;
		removeAllChildren(): void;
	
		attachToParent(pParent: T): boolean;
		detachFromParent(): boolean;
		
		promoteChildren(): void;
		relocateChildren(pParent: T): void;
	
		toString(isRecursive?: boolean, iDepth?: int): string;
	
		attached: ISignal<{ (pEntity: T): void; }>;
		detached: ISignal <{ (pEntity: T): void ; }>;
		childAdded: ISignal <{ (pEntity: T, pChild: T): void; }>;
		childRemoved: ISignal <{ (pEntity: T, pChild: T): void; }>;
	}
	
	
}
