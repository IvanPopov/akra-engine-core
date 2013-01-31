#ifndef IOCTREE_TS
#define IOCTREE_TS

#include "IDisplayList.ts"

module akra {

	IFACE(IRect3d);
	IFACE(IOcTreeNode);
	IFACE(ISceneObject);
	IFACE(IOcTreeRect);
	IFACE(IVec3);
	
	export interface IOcTree extends IDisplayList {

		readonly depth: int;
		readonly worldScale: IVec3;
		readonly worldOffset: IVec3;

		create(pWorldBoundingBox: IRect3d, iDepth: int, nNode?: uint): void;
		isReady(): bool;
		findTreeNode(pObject: ISceneObject): IOcTreeNode;
		findTreeNodeByRect(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode;
		getAndSetFreeNode(iLevel: int, iComposedIndex: int, pParentNode: IOcTreeNode): IOcTreeNode;
		deleteNodeFromTree(pNode: IOcTreeNode): void;
		buildSearchResults(pWorldRect: IRect3d, pOptionalFrustum?: IFrustum): IObjectArray;

		//getAndSetFreeNode(iLevel: int, iX: int, iY: int, iZ: int, iIndex: int): IOcTreeNode;
		//getNodeFromLevelXYZ(iLevel: int, iIndex: int): IOcTreeNode;
		//destroy(): void;
		//findTreeNode(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode;
		//buildByteRect(pWorldRect: IRect3d, pWorldByteRect: IOcTreeRect): void;
		//addOrUpdateSceneObject(pNewNode: ISceneObject): IOcTreeNode;
	}
}

#endif