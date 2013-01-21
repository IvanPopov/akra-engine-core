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
		x: int = 0;
		/** Byte y-coord of node */
		y: int = 0;
		/** Byte z-coord of node */
		z: int = 0;
		/** Index in array of nodes in tree */
		index: int = 0;
		/** First SceneObject in this node */
		firstMember: ISceneObject = null;
		/** Rect of node in real world */
		nodeTrueRect: IRect3d = new geometry.Rect3d();
		/** Link ro next node in tree */
		forwardNodeLink: OcTreeNode = null;
		/** Link ro previous node in tree */
		rearNodeLink: OcTreeNode = null;

	    /**
	     * Link ro parent node in tree
	     * @type OcTreeNode
	     * @private
	     */
	//    this.parentNode = null;
	    /**
	     * Link ro sibling node(nodes has same parent) in tree
	     * @type OcTreeNode
	     * @private
	     */
	//    this.siblingNode = null;
	    /**
	     * Link ro children node in tree
	     * @type OcTreeNode
	     * @private
	     */
	//    this.childrenNode = null;

		constructor (pTree: IOcTree);
		// constructor (iLevel: int, iX: int, iY: int, iZ: int/*, nChildren: uint*/);
		// constructor (iLevel, iX?, iY?, iZ?/*, nChildren?*/) {
		constructor (pTree: IOcTree) {

			this.tree = pTree;
		}

		/**
		 * Add or update object in this node
		 */
		addOrUpdateMember(pMember: ISceneObject): void {
		    // is this node not already a pMember?
		    if (pMember._pOcTreeNode != this) {
		        // remove the pMember from it's previous Oc tree node (if any)
		        if (pMember._pOcTreeNode) {
		            pMember._pOcTreeNode.removeMember(pMember);
		        }
		        // account for the new addition
		        if (!this.firstMember) {
		            this.firstMember = [pMember];//pMember;
		        }
		        else {
		            // prepend this pMember to our list
		            // pMember._pRearTreeLink = null;
		            // pMember._pForwardTreeLink = this.firstMember;
		            // this.firstMember._pRearTreeLink = pMember;
		         	this.firstMember.push(pMember);
		            //this.firstMember = pMember;
		        }
		        pMember._pOcTreeNode = this;
		    }
		    //обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
		    this.nodeCoords();
		}

		/**
		 * Remove member object from node and release node if there are not members in it
		 */
		removeMember(pMember: ISceneObject): void {
		    // make sure this is one of ours
		    debug_assert(pMember._pOcTreeNode == this, "error removing Oc tree pMember");
		    // remove this pMember from it's chain
		    if (pMember._pForwardTreeLink) {
		        pMember._pForwardTreeLink._pRearTreeLink = pMember._pRearTreeLink;
		    }
		    if (pMember._pRearTreeLink) {
		        pMember._pRearTreeLink._pForwardTreeLink = pMember._pForwardTreeLink;
		    }
		    // if this was our first pMember, advance our pointer to the next pMember
		    if (this.firstMember == pMember) {
		        this.firstMember = pMember._pForwardTreeLink;
		    }
		    // clear the former members links
		    pMember._pRearTreeLink = null;
		    pMember._pForwardTreeLink = null;
		    pMember._pOcTreeNode = null;
		    if (!this.firstMember) {
		        pMember._pOcTree.deleteNodeFromTree(this);
		    }
		    else{
		        //обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
		        this.nodeCoords();
		    }
		}
		/**
		 * Calculate real rect(in world coords) of node
		 */
		nodeCoords(): void {
		    var w: int = 1 << (10 - this.iLevel);

		    var pNodeTrueRect: IRect3d = this.nodeTrueRect;

		    pNodeTrueRect.fX0 = this.iX * w;
		    pNodeTrueRect.fX1 = (this.iX + 1) * w;
		    pNodeTrueRect.fY0 = this.iY * w;
		    pNodeTrueRect.fY1 = (this.iY + 1) * w;
		    pNodeTrueRect.fZ0 = this.iZ * w;
		    pNodeTrueRect.fZ1 = (this.iZ + 1) * w;
		    pNodeTrueRect.divSelf(this.tree._v3fWorldScale);
		    pNodeTrueRect.subSelf(this.tree._v3fWorldOffset);

		    var iLimit = (1 << this.iLevel) - 1;

		    var iX = this.iX;
		    var iY = this.iY;
		    var iZ = this.iZ;

		    if(iX == 0 || iX == iLimit 
		        || iY == 0 || iY == iLimit
		        || iZ == 0 || iZ == iLimit){

		        //if iLevel = 0 than iLimit = 0;
		        var pObject = null;
		        for(pObject = this.firstMember; pObject; pObject = pObject._pForwardTreeLink){
		            var pWorldRect: IRect3d = pObject.worldBounds();
		            
		            if(iX == 0){
		                pNodeTrueRect.x0 = math.min(pNodeTrueRect.x0, pWorldRect.x0)
		            }
		            
		            if(iX == iLimit){
		                pNodeTrueRect.x1 = math.max(pNodeTrueRect.x1, pWorldRect.x1)    
		            }

		            if(iY == 0){
		                pNodeTrueRect.y0 = math.min(pNodeTrueRect.y0, pWorldRect.y0)
		            }
		            
		            if(iY == iLimit){
		                pNodeTrueRect.y1 = math.max(pNodeTrueRect.y1, pWorldRect.y1)    
		            }

		            if(iZ == 0){
		                pNodeTrueRect.z0 = math.min(pNodeTrueRect.z0, pWorldRect.z0)
		            }
		            
		            if(iZ == iLimit){
		                pNodeTrueRect.z1 = math.max(pNodeTrueRect.z1, pWorldRect.z1)    
		            }
		        }
		    }
		    /*
		     this.nodeTrueRect.x0 = (this.nodeTrueRect.x0 + 1)<<0;
		     this.nodeTrueRect.x1 = (this.nodeTrueRect.x1 + 1)<<0;
		     this.nodeTrueRect.y0 = (this.nodeTrueRect.y0 + 1)<<0;
		     this.nodeTrueRect.y1 = (this.nodeTrueRect.y1 + 1)<<0;
		     this.nodeTrueRect.z0 = (this.nodeTrueRect.z0 + 1)<<0;
		     this.nodeTrueRect.z1 = (this.nodeTrueRect.z1 + 1)<<0;
		     */
		};
	}
}

#endif
