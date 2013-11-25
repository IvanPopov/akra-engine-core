
/// <reference path="IDisplayList.ts" />


/// <reference path="IRect3d.ts" />
/// <reference path="IOcTreeNode.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IOcTreeRect.ts" />
/// <reference path="IVec3.ts" />

module akra {
	interface IOcTree extends IDisplayList {
	
		/** readonly */ depth: int;
		/** readonly */ worldScale: IVec3;
		/** readonly */ worldOffset: IVec3;
	
		create(pWorldBoundingBox: IRect3d, iDepth: int, nNode?: uint): void;
		isReady(): boolean;
		findTreeNode(pObject: ISceneObject): IOcTreeNode;
		findTreeNodeByRect(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode;
		getAndSetFreeNode(iLevel: int, iComposedIndex: int, pParentNode: IOcTreeNode): IOcTreeNode;
		deleteNodeFromTree(pNode: IOcTreeNode): void;
	
		//debug metod
		_toSimpleObject(pNode?: IOcTreeNode): any;
	
		//getAndSetFreeNode(iLevel: int, iX: int, iY: int, iZ: int, iIndex: int): IOcTreeNode;
		//getNodeFromLevelXYZ(iLevel: int, iIndex: int): IOcTreeNode;
		//destroy(): void;
		//findTreeNode(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode;
		//buildByteRect(pWorldRect: IRect3d, pWorldByteRect: IOcTreeRect): void;
		//addOrUpdateSceneObject(pNewNode: ISceneObject): IOcTreeNode;
	}
}
