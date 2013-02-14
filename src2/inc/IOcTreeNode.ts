#ifndef IOCTREENODE_TS
#define IOCTREENODE_TS

module akra {

	IFACE(IOcTree);
	IFACE(ISceneObject);
	IFACE(IRect3d);
	
	export interface IOcTreeNode {
		/** Parent tree */
		tree: IOcTree;
		/** Level of node */
		level: int;
		/** Byte x-coord of node */
		x: int;
		/** Byte y-coord of node */
		y: int;
		/** Byte z-coord of node */
		z: int;
		/** Index in array of nodes in tree */
		index: int;
		/** First SceneObject in this node */
		firstMember: ISceneObject;
		/** Rect of node in real world */
		nodeTrueRect: IRect3d;
		/** Link ro next node in tree */
		forwardNodeLink: OcTreeNode;
		/** Link ro previous node in tree */
		rearNodeLink: OcTreeNode;

		addOrUpdateMember(pMember: ISceneObject): void;
		removeMember(pMember: ISceneObject): void;
		nodeCoords(): void;
	}
}

#endif
