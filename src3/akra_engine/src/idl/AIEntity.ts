// AIEntity interface
// [write description here...] 


/// <reference path="AIExplorerFunc.ts" />
/// <reference path="AIReferenceCounter.ts" />

enum AEEntityTypes {
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

interface AIEntity extends AIEventProvider, AIReferenceCounter {
	name: string;

	parent: AIEntity;
	sibling: AIEntity;
	child: AIEntity;

	/** readonly */ rightSibling: AIEntity;

	/** readonly */ type: AEEntityTypes;

	/** readonly */ depth: int;
	/** readonly */ root: AIEntity;

	//create(): boolean;//moved to AINode
	destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void;

	findEntity(sName: string): AIEntity;
	explore(fn: AIExplorerFunc): void;
	childOf(pParent: AIEntity): boolean;
	siblingCount(): uint;
	childCount(): uint;
	children(): AIEntity[];
	childAt(i: int): AIEntity;
	descCount(): uint;

	update(): boolean;
	recursiveUpdate(): boolean;
	recursivePreUpdate(): void;
	prepareForUpdate(): void;

	hasParent(): boolean;
	hasChild(): boolean;
	hasSibling(): boolean;

	isASibling(pSibling: AIEntity): boolean;
	isAChild(pChild: AIEntity): boolean;
	isInFamily(pEntity: AIEntity, bSearchEntireTree?: boolean): boolean;

	//обновлен ли сам узел
	isUpdated(): boolean;
	//есть ли обновления среди потомков?
	hasUpdatedSubNodes(): boolean;


	addSibling(pSibling: AIEntity): AIEntity;
	addChild(pChild: AIEntity): AIEntity;
	removeChild(pChild: AIEntity): AIEntity;
	removeAllChildren(): void;

	attachToParent(pParent: AIEntity): boolean;
	detachFromParent(): boolean;
	
	promoteChildren(): void;
	relocateChildren(pParent: AIEntity): void;

	toString(isRecursive?: boolean, iDepth?: int): string;

	signal attached(): void;
	signal detached(): void;

	signal childAdded(pChild: AIEntity): void;
	signal childRemoved(pChild: AIEntity): void;
}

