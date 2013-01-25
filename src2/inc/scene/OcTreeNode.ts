#ifndef OCTREENODE_TS
#define OCTREENODE_TS

#include "IOcTreeNode.ts"
#include "IRect3d.ts"
#include "IVec3.ts"
#include "geometry/Rect3d.ts"


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
		rearNodeLink: OcTreeNode = null;

		//eight links to possible children nodes;		
		childrenList: IObjectList[];

		//index - is xyz where x-left = 0, x-right = 1 etc.

		constructor(pTree: IOcTree){
			this.membersList = new ObjectList();
			this.worldBounds = new geometry.Rect3d();

			this.childrenList = new Array(8);
			for(var i=0; i<8;i++){
				childrenList[i] = new ObjectList();
			}

			this.tree = pTree;
		}

		/**
		 * Add object in this node
		 */
		addMember(pMember: ISceneObject): void {
			this.membersList.push(pMember);
		};

		/**
		 * Remove member object from node and release node if there are not members in it
		 */
		removeMember(pMember: ISceneObject): void {
			var i:int = this.membersList.indexOf(pMember);

			// make sure this is one of ours
			debug_assert(i>=0, "error removing Oc tree pMember");
		    
	    	if(i>=0){
	    		this.membersList.takeAt(i);
	    	}

	    	if(this.membersList.length === 0){
	    		this.tree.deleteNodeFromTree(this);
	    	}
		};

		
	};

	export class OcTreeRootNode extends OcTreeNode implements IOcTreeNode{

		protected _pBasicWorldBounds: IRect3d;

		constructor(pTree: IOcTree){
			super(pTree);

			var iTmp: int = 1 << this.pTree.depth;

			this._pBasicWorldBounds = new Rect3d(0, iTmp, 0, iTmp, 0, iTmp);
		    this._pBasicWorldBounds.divSelf(this.tree._v3fWorldScale);
		    this._pBasicWorldBounds.subSelf(this.tree._v3fWorldOffset);
		};

		addMember(pMember: ISceneObject): void{
			super.addMember(pMember);
			//обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
	    	this._updateNodeBoundingBox();
		};

		removeMember(pMember: ISceneObject): void{
			super.removeMember(pMember: ISceneObject);
			//обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
			this._updateNodeBoundingBox();
		};

		protected _updateNodeBoundingBox(): void {
		    var pNodeWorldBounds: IRect3d = this.worldBounds;
		    pNodeWorldBounds.set(this._pBasicWorldBounds);
		 
		    var pObject: ISceneObject = this.membersList.first();
		    while(isDefAndNotNull(pObject)){

		    	pNodeWorldBounds.unionRect(pObject.worldBounds);

		    	pObject = this.membersList.next();
		    }
		};
	}
}


#endif
