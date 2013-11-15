// AIOcTreeNode interface
// [write description here...]


/// <reference path="AIOcTree.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AIObjectList.ts" />

interface AIOcTreeNode {
	/** Parent tree */
	tree: AIOcTree;
	/** Level of node */
	level: int;
	/** Byte x-coord of node */
	// x: int;
	// /** Byte y-coord of node */
	// y: int;
	// /** Byte z-coord of node */
	// z: int;
	/** Index in array of nodes in tree */
	index: int;
	/** First SceneObject in this node */
	membersList: AIObjectList;
	/** Rect of node in real world */
	worldBounds: AIRect3d;
	/** Link ro next node in tree */
	//forwardNodeLink: AIOcTreeNode;
	/** Link ro previous node in tree */
	rearNodeLink: AIOcTreeNode;

	//eight links to possible children nodes;		
	childrenList: AIObjectList[];

	addMember(pMember: AISceneObject): void;
	removeMember(pMember: AISceneObject): void;

	toString(): string;
}