// AIOcTree interface
// [write description here...]

/// <reference path="AIDisplayList.ts" />


/// <reference path="AIRect3d.ts" />
/// <reference path="AIOcTreeNode.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIOcTreeRect.ts" />
/// <reference path="AIVec3.ts" />

interface AIOcTree extends AIDisplayList {

	/** readonly */ depth: int;
	/** readonly */ worldScale: AIVec3;
	/** readonly */ worldOffset: AIVec3;

	create(pWorldBoundingBox: AIRect3d, iDepth: int, nNode?: uint): void;
	isReady(): boolean;
	findTreeNode(pObject: AISceneObject): AIOcTreeNode;
	findTreeNodeByRect(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): AIOcTreeNode;
	getAndSetFreeNode(iLevel: int, iComposedIndex: int, pParentNode: AIOcTreeNode): AIOcTreeNode;
	deleteNodeFromTree(pNode: AIOcTreeNode): void;

	//debug metod
	_toSimpleObject(pNode?: AIOcTreeNode): any;

	//getAndSetFreeNode(iLevel: int, iX: int, iY: int, iZ: int, iIndex: int): AIOcTreeNode;
	//getNodeFromLevelXYZ(iLevel: int, iIndex: int): AIOcTreeNode;
	//destroy(): void;
	//findTreeNode(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): AIOcTreeNode;
	//buildByteRect(pWorldRect: AIRect3d, pWorldByteRect: AIOcTreeRect): void;
	//addOrUpdateSceneObject(pNewNode: AISceneObject): AIOcTreeNode;
}