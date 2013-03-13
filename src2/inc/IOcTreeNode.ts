#ifndef IOCTREENODE_TS
#define IOCTREENODE_TS

module akra {

	IFACE(IOcTree);
	IFACE(ISceneObject);
	IFACE(IRect3d);
	IFACE(IObjectList);
	
	export interface IOcTreeNode {
		/** Parent tree */
		tree: IOcTree;
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
		membersList: IObjectList;
		/** Rect of node in real world */
		worldBounds: IRect3d;
		/** Link ro next node in tree */
		//forwardNodeLink: IOcTreeNode;
		/** Link ro previous node in tree */
		rearNodeLink: IOcTreeNode;

		//eight links to possible children nodes;		
		childrenList: IObjectList[];

		addMember(pMember: ISceneObject): void;
		removeMember(pMember: ISceneObject): void;
		//nodeCoords(): void;
	}
}

#endif
