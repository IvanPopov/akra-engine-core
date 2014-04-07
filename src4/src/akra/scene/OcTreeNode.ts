/// <reference path="../idl/IOcTreeNode.ts" />
/// <reference path="../idl/IRect3d.ts" />
/// <reference path="../idl/IVec3.ts" />

/// <reference path="../debug.ts" />
/// <reference path="../guid.ts" />

/// <reference path="../geometry/Rect3d.ts" />
/// <reference path="../util/ObjectList.ts" />


module akra.scene {

	/** OcTreeNode class represent node of OcTree */
	export class OcTreeNode implements IOcTreeNode {
		guid: uint = guid();

		/** Parent tree */
		tree: IOcTree;
		/** Level of node */
		level: int = 0;
		/** Byte x-coord of node */
		//x: int = 0;
		/** Byte y-coord of node */
		//y: int = 0;
		/** Byte z-coord of node */
		//z: int = 0;
		/** Index in array of nodes in tree */
		index: int = 0;
		/** First SceneObject in this node */
		membersList: IObjectList<ISceneObject>;
		/** Rect of node in real world */
		worldBounds: IRect3d;

		/** Link to previous node in tree */
		rearNodeLink: IOcTreeNode = null;

		//eight links to possible children nodes;		
		childrenList: IObjectList<IOcTreeNode>[];

		//index - is xyz where x-left = 0, x-right = 1 etc.

		constructor(pTree: IOcTree) {
			this.membersList = new util.ObjectList<ISceneObject>();
			this.worldBounds = new geometry.Rect3d();

			this.childrenList = new Array(8);
			for (var i = 0; i < 8; i++) {
				this.childrenList[i] = new util.ObjectList<IOcTreeNode>();
			}

			this.tree = pTree;
		}

		/**
		 * Add object in this node
		 */
		addMember(pObject: ISceneObject): void {
			this.membersList.push(pObject);
			pObject.worldBoundsUpdated.connect(this, this.OcTreeObjectMoved, EEventTypes.UNICAST);
			//this.connect(pObject, SIGNAL(worldBoundsUpdated), SLOT(OcTreeObjectMoved), EEventTypes.UNICAST);
		}

		/**
		 * Remove member object from node and release node if there are not members in it
		 */
		removeMember(pObject: ISceneObject): void {
			var i: int = this.membersList.indexOf(pObject);
			// console.log('position in list ------------>',i);

			// make sure this is one of ours
			debug.assert(i >= 0, "error removing member cannot find member");

			if (i >= 0) {
				this.membersList.takeAt(i);
				pObject.worldBoundsUpdated.disconnect(this, this.OcTreeObjectMoved, EEventTypes.UNICAST);
				//this.disconnect(pObject, SIGNAL(worldBoundsUpdated), SLOT(OcTreeObjectMoved), EEventTypes.UNICAST);
			}

			if (this.membersList.getLength() === 0) {
				this.tree.deleteNodeFromTree(this);
			}
		}

		toString(): string {
			var sStr = "guid: " + this.guid.toString() + "\n";
			sStr += "level: " + this.level.toString() + "\n";
			sStr += "index: " + this.index.toString() + "\n";
			sStr += "world bounds: " + this.worldBounds.toString() + "\n"
			return sStr;
		}

		OcTreeObjectMoved(pObject: ISceneObject) {
			// console.warn('object moving');
			var pNode: IOcTreeNode = this.tree.findTreeNode(pObject);
			//if (pNode === null) {
			//	logger.log(pObject);
			//}
			if (pNode !== this) {
				this.removeMember(pObject);
				pNode.addMember(pObject);
			}
		}
	}

	export class OcTreeRootNode extends OcTreeNode implements IOcTreeNode {

		protected _pBasicWorldBounds: IRect3d;

		constructor(pTree: IOcTree) {
			super(pTree);

			var iTmp: int = (1 << this.tree.getDepth());

			this._pBasicWorldBounds = new geometry.Rect3d(0, iTmp, 0, iTmp, 0, iTmp);
			this._pBasicWorldBounds.divSelf(this.tree.getWorldScale());
			this._pBasicWorldBounds.subSelf(this.tree.getWorldOffset());

			this.worldBounds.set(this._pBasicWorldBounds);
		}

		addMember(pMember: ISceneObject): void {
			super.addMember(pMember);
			//обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
			this._updateNodeBoundingBox();
		}

		removeMember(pObject: ISceneObject): void {
			var i: int = this.membersList.indexOf(pObject);

			// make sure this is one of ours
			debug.assert(i >= 0, "error removing member cannot find member");

			if (i >= 0) {
				this.membersList.takeAt(i);
				pObject.worldBoundsUpdated.disconnect(this, this.OcTreeObjectMoved, EEventTypes.UNICAST);
				//this.disconnect(pObject, SIGNAL(worldBoundsUpdated), SLOT(OcTreeObjectMoved), EEventTypes.UNICAST);
			}

			//обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
			this._updateNodeBoundingBox();
		}

		protected _updateNodeBoundingBox(): void {
			var pNodeWorldBounds: IRect3d = this.worldBounds;
			pNodeWorldBounds.set(this._pBasicWorldBounds);

			var pObject: ISceneObject = this.membersList.getFirst();
			while (isDefAndNotNull(pObject)) {
				pNodeWorldBounds.unionRect(pObject.getWorldBounds());

				pObject = this.membersList.next();
			}
		}
	}
}

