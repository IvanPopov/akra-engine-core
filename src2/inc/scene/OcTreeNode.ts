#ifndef OCTREENODE_TS
#define OCTREENODE_TS

#include "IOcTreeNode.ts"
#include "IRect3d.ts"
#include "IVec3.ts"
#include "geometry/Rect3d.ts"
#include "util/ObjectList.ts"


module akra.scene {

	/** OcTreeNode class represent node of OcTree */
	export class OcTreeNode implements IOcTreeNode { 
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
		membersList: IObjectList;
		/** Rect of node in real world */
		worldBounds: IRect3d;
		
		/** Link to previous node in tree */
		rearNodeLink: IOcTreeNode = null;

		//eight links to possible children nodes;		
		childrenList: IObjectList[];

		//index - is xyz where x-left = 0, x-right = 1 etc.

		constructor(pTree: IOcTree){
			this.membersList = new util.ObjectList();
			this.worldBounds = new geometry.Rect3d();

			this.childrenList = new Array(8);
			for(var i=0; i<8;i++){
				this.childrenList[i] = new util.ObjectList();
			}

			this.tree = pTree;
		}

		/**
		 * Add object in this node
		 */
		addMember(pObject: ISceneObject): void {
			this.membersList.push(pObject);
			this.connect(pObject, SIGNAL(worldBoundsUpdated), SLOT(objectMoved), EEventTypes.UNICAST);
			// console.log(this.membersList);
		};

		/**
		 * Remove member object from node and release node if there are not members in it
		 */
		removeMember(pObject: ISceneObject): void {
			var i:int = this.membersList.indexOf(pObject);
			// console.log('position in list ------------>',i);
			
			// make sure this is one of ours
			debug_assert(i>=0, "error removing member cannot find member");
		    
	    	if(i>=0){
	    		this.membersList.takeAt(i);
	    		this.disconnect(pObject, SIGNAL(worldBoundsUpdated), SLOT(objectMoved), EEventTypes.UNICAST);
	    	}

	    	if(this.membersList.length === 0){
	    		this.tree.deleteNodeFromTree(this);
	    	}
		};

		CREATE_EVENT_TABLE(OcTreeNode);

		objectMoved(pObject: ISceneObject){
			// console.warn('object moving');
			var pNode: IOcTreeNode = this.tree.findTreeNode(pObject);
			//console.error('-----before------>', this, pNode,'<-------arter------');
			if(pNode !== this){
				this.removeMember(pObject);
				pNode.addMember(pObject);
			}
		};
	};

	export class OcTreeRootNode extends OcTreeNode implements IOcTreeNode{

		protected _pBasicWorldBounds: IRect3d;

		constructor(pTree: IOcTree){
			super(pTree);

			var iTmp: int = (1 << this.tree.depth);

			this._pBasicWorldBounds = new geometry.Rect3d(0, iTmp, 0, iTmp, 0, iTmp);
		    this._pBasicWorldBounds.divSelf(this.tree.worldScale);
		    this._pBasicWorldBounds.subSelf(this.tree.worldOffset);

		    this.worldBounds.set(this._pBasicWorldBounds);
		};

		addMember(pMember: ISceneObject): void{
			super.addMember(pMember);
			//обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
	    	this._updateNodeBoundingBox();
		};

		removeMember(pObject: ISceneObject): void{
			var i:int = this.membersList.indexOf(pObject);

			// make sure this is one of ours
			debug_assert(i>=0, "error removing member cannot find member");
		    
	    	if(i>=0){
	    		this.membersList.takeAt(i);
	    		this.disconnect(pObject, SIGNAL(moved), SLOT(objectMoved), EEventTypes.UNICAST);
	    	}

			//обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
			this._updateNodeBoundingBox();
		};

		protected _updateNodeBoundingBox(): void {
		    var pNodeWorldBounds: IRect3d = this.worldBounds;
		    pNodeWorldBounds.set(this._pBasicWorldBounds);
		 
		    var pObject: ISceneObject = this.membersList.first;
		    while(isDefAndNotNull(pObject)){
		    	pNodeWorldBounds.unionRect(pObject.worldBounds);

		    	pObject = this.membersList.next();
		    }
		};
	}
}


#endif
