#ifndef IOCTREE_TS
#define IOCTREE_TS

#include "IDisplayList.ts"

module akra {

	IFACE(IRect3d);
	IFACE(IOcTreeNode);
	IFACE(ISceneObject);
	IFACE(IOcTreeRect);
	
	export interface IOcTree extends IDisplayList {
		getAndSetFreeNode(iLevel: int, iX: int, iY: int, iZ: int, iIndex: int): IOcTreeNode;
		isReady(): bool;
		getNodeFromLevelXYZ(iLevel: int, iIndex: int): IOcTreeNode;
		create(pWorldBoundingBox: IRect3d, iDepth: int, nNode: uint): void;
		destroy(): void;
		findTreeNode(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode;
		buildByteRect(pWorldRect: IRect3d, pWorldByteRect: IOcTreeRect): void;
		addOrUpdateSceneObject(pNewNode: ISceneObject): IOcTreeNode;
		deleteNodeFromTree(pNode: IOcTreeNode): void;
		buildSearchResults(pWorldRect: IRect3d, pOptionalFrustum: IFrustum): ISceneObject;
	}
}

#endif