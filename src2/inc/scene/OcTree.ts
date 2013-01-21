#ifndef OCTREE_TS
#define OCTREE_TS

#include "IOcTree.ts"
#include "DisplayList.ts"
#include "OcTreeNode.ts"
#include "OcTreeRect.ts"
#include "IRect3d.ts"
#include "IFrustum.ts"

module akra.scene {
	export enum EOcTreeConstants {
	    k_MinimumTreeDepth = 1,
	    k_MaximumTreeDepth = 11
    };

	export class OcTree extends DisplayList implements IOcTree {
		/** List of OcTreeNodes on each level */
		protected _ppLevelNodes: IOcTreeNode[][] = null;
		/** First node in list of all nodes */
		protected _pFirstNode: IOcTreeNode = null;
		/** Size of world bounding box */
		protected _v3fWorldExtents: IVec3 = new Vec3;
		/** Negate min point of bounding box */
		protected _v3fWorldScale: IVec3 = new Vec3;
		/** Value of relation between (1024,1024,1024) and bounding box size */
		protected _v3fWorldOffset: IVec3 = new Vec3;
		/** Maximum depth of tree. Value set when you call OcTree::create() */
		protected _iDepth: int = 0;
		/** 
		 * Список свободных услов(объектов OcTreeNode). 
		 * Необходимо для экономии ресурсов памяти и чтобы не делать лишних delete 
		 */
		protected _pFreeNodePool: IOcTreeNode[] = null;
		/**
		 * Список байтовых ректов ректа камеры для тестов объектов.
		 */
		protected _pTestLocalRect: IOcTreeRect[] = null;

		constructor () {
			super();
			this.name = "OcTree";
		}	

		/**
		 * Get free node. 
		 * Get it from _pFreeNodePull or create new OcTreeNode if it`s empty and set his data.
		 */
		getAndSetFreeNode(iLevel: int, iX: int, iY: int, iZ: int, iIndex: int): IOcTreeNode {
			var pNode: IOcTreeNode = this._pFreeNodePool.pop();

		    if (!isDefAndNotNull(pNode)) {
		        pNode = new OcTreeNode(this);
		    }

		    pNode.level = iLevel;
		    pNode.x = iX;
		    pNode.y = iY;
		    pNode.z = iZ;
		    pNode.index = iIndex;
		    pNode.pNodeTrueRect.clear();
		    
		    this._ppLevelNodes[iLevel][iIndex] = pNode;

		    if (this._pFirstNode) {
		        this._pFirstNode.rearNodeLink = pNode;
		    }

		    pNode.forwardNodeLink = this.pFirstNode;
		    pNode.rearNodeLink = null;

		    this._pFirstNode = pNode;
		    /*
		     var i,j;
		     var pTempNode;
		     for(i=iLevel-1; i>=0; --i){
		     j = (((iZ>>(iLevel-i))<<i)<<i) + ((iY>>(iLevel-i))<<i) + (iX>>(iLevel-i));
		     pTempNode = this._ppLevelNodes[i][j];
		     if (pTempNode) {
		     this.pParentNode = pTempNode;
		     this.pSibling = pTempNode.pChildren;
		     pTempNode.pChildren = this;
		     break;
		     }
		     }
		     */
		    return pNode;
		}

		/**
		 * is any levels of tree are availeable(some object in a tree)
		 */
		isReady(): bool {
		    return this._iDepth && this._ppLevelNodes;
		}

		/**
		 * Getter for OcTreeNode by level and x, y, z
		 */
		getNodeFromLevelXYZ(iLevel: int, iIndex: int): IOcTreeNode {
		    debug_assert(this.isReady(), "the Oc tree has not been created");

		    if (iLevel >= 0 && iLevel < this._iDepth) {
		        return this._ppLevelNodes[iLevel][iIndex];
		    }
		    
		    return null;
		}

		/**
		 * Create
		 */
		create(pWorldBoundingBox: IRect3d, iDepth: int, nNode: uint): void {

		    var v3fTemp: IVec3;
		    var i: int = 0;
		    var nodes: uint;
		    
		    debug_assert(!this.isReady(), "the Oc tree has already been created");
		    debug_assert(iDepth >= EOcTreeConstants.k_minimumTreeDepth, "invalid tree iDepth");
		    debug_assert(iDepth <= EOcTreeConstants.k_maximumTreeDepth, "invalid tree iDepth");

		    this._iDepth = iDepth;


		    v3fTemp = pWorldBoundingBox.size();
		    this._v3fWorldExtents.set(v3fTemp);
		    
		    v3fTemp = pWorldBoundingBox.minPoint().negate();
		    this._v3fWorldOffset.set(v3fTemp);

		    this._v3fWorldScale.x = 1024.0 / this._v3fWorldExtents.x;
		    this._v3fWorldScale.y = 1024.0 / this._v3fWorldExtents.y;
		    this._v3fWorldScale.z = 1024.0 / this._v3fWorldExtents.z;

		    // allocate the nodes
		    this._ppLevelNodes = new Array(iDepth);

		    for (i = 0; i < iDepth; ++i) {
		        this._ppLevelNodes[i] = new Array();
		    }

		    this._pTestLocalRect = new Array(iDepth);

		    for (i = 0; i < iDepth; ++i) {
		        this._pTestLocalRect[i] = new OcTreeRect;
		    }

		    this._pFreeNodePool = new Array();

		    nodes = (arguments.length == 3) ? nNode : 10;

		    for (i = 0; i < nodes; ++i) {
		        this._pFreeNodePool.push(new OcTreeNode(this));
		    }
		}

		/**
		 * Destroy tree and all nodes in tree. Set _iDepth to 0.
		 */
		destroy(): void {
		    var i: int;

		    for (i = 0; i < this._iDepth; ++i) {
		        delete this._ppLevelNodes[i];
		    }

		    for (i = 0; i < this._pFreeNodePool.length; ++i) {
		        delete this._pFreeNodePool[i];
		    }
		    
		    this._ppLevelNodes = null;
		    this._pFreeNodePool = null;
		    this._iDepth = 0;
		}


		/**
		 * Find tree node by OcTreeRect
		 */
		findTreeNode(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode {
		    var level: int, levelX: int, levelY: int, levelZ: int;
		    var xPattern: int = iX0 ^ iX1;
		    var yPattern: int = iY0 ^ iY1;
		    var zPattern: int = iZ0 ^ iZ1;

		    var bitPattern: int = math.max(zPattern, math.max(xPattern, yPattern));
		    var highBit: int = bitPattern ? math.highestBitSet(bitPattern) + 1 : 0;

		    level = EOcTreeConstants.k_maximumTreeDepth - highBit - 1;
		    level = math.min(level, this._iDepth - 1);

		    var shift: int = EOcTreeConstants.k_maximumTreeDepth - level - 1;

		    levelX = iX1 >> shift;
		    levelY = iY1 >> shift;
		    levelZ = iZ1 >> shift;

		    var iIndex: int = ((levelZ << level) << level) + (levelY << level) + levelX;
		    var pNode: IOcTreeNode = this.getNodeFromLevelXYZ(level, iIndex);

		    if (!pNode) {
		        return this.getAndSetFreeNode(level, levelX, levelY, levelZ, iIndex);
		    }

		    return pNode;
		}

		/**
		 * Build pByteRect from Rect3d
		 * Convert to integer values, taking the floor of each real
		 */
		inline buildByteRect(pWorldRect: IRect3d, pWorldByteRect: IOcTreeRect): void {
		    pWorldByteRect.convert(pWorldRect, this._v3fWorldOffset, this._v3fWorldScale);
		};


		/**
		 * Add or update SceneObject to node
		 */
		addOrUpdateSceneObject(pNewNode: ISceneObject): IOcTreeNode {
		    var pRect: IRect3d = pNewNode._pWorldBounds;
		    var iX0: int = pRect.x0, iX1: int = pRect.x1,
		        iY0: int = pRect.y0, iY1: int = pRect.y1,
		        iZ0: int = pRect.z0, iZ1: int = pRect.z1;

		    var v3fWorldOffset: IVec3 = this._v3fWorldOffset;
		    var v3fWorldScale: IVec3 = this._v3fWorldScale;

		    iX0 += v3fWorldOffset.x;
		    iX1 += v3fWorldOffset.x;
		    iY0 += v3fWorldOffset.y;
		    iY1 += v3fWorldOffset.y;
		    iZ0 += v3fWorldOffset.z;
		    iZ1 += v3fWorldOffset.z;

		    iX0 *= v3fWorldScale.x;
		    iX1 *= v3fWorldScale.x;
		    iY0 *= v3fWorldScale.y;
		    iY1 *= v3fWorldScale.y;
		    iZ0 *= v3fWorldScale.z;
		    iZ1 *= v3fWorldScale.z;

		    iX0 = iX0 << 0;
		    iX1 = iX1 << 0;
		    iY0 = iY0 << 0;
		    iY1 = iY1 << 0;
		    iZ0 = iZ0 << 0;
		    iZ1 = iZ1 << 0;

		    iX0 = math.clamp(iX0, 0, 1022);
		    iY0 = math.clamp(iY0, 0, 1022);
		    iZ0 = math.clamp(iZ0, 0, 1022);

		    iX1 = math.clamp(iX1, iX0 + 1, 1023);
		    iY1 = math.clamp(iY1, iY0 + 1, 1023);
		    iZ1 = math.clamp(iZ1, iZ0 + 1, 1023);

		    var pNode: IOcTreeNode = this.findTreeNode(iX0, iX1, iY0, iY1, iZ0, iZ1);

		    return (pNode.addOrUpdateMember(pNewNode));
		};

		/**
		 * Delete node from tree
		 */
		deleteNodeFromTree(pNode: IOcTreeNode): void {

		    if (pNode.rearNodeLink) {
		        pNode.rearNodeLink.forwardNodeLink = pNode.forwardNodeLink;
		    }

		    if (pNode.forwardNodeLink) {
		        pNode.forwardNodeLink.rearNodeLink = pNode.rearNodeLink;
		    }

		    if (this._pFirstNode == pNode) {
		        this._pFirstNode = pNode.forwardNodeLink;
		    }

		    var iLevel: int = pNode.level;
		//    var iX = pNode.iX;
		//    var iY = pNode.iY;
		//    var iZ = pNode.iZ;
		    this._ppLevelNodes[iLevel][pNode.index] = null;

		    pNode.forwardNodeLink = null;
		    pNode.rearNodeLink = null;

		    this._pFreeNodePool.push(pNode);
		};

		/**
		 * Test frustum
		 */
		buildSearchResults(pWorldRect: IRect3d, pOptionalFrustum: IFrustum): ISceneObject {
		    var pResultListStart: ISceneObject = null; //SceneObject
		    var pResultListEnd: ISceneObject = null; //SceneObject
		    var pByteRect: IOcTreeRect = ocTreeRect();

		    this.buildByteRect(pWorldRect, pByteRect);

		    var iLevel: int = 0;
		    var iX: int, iY: int, iZ: int;
		    var pLocalRect: IRect3d;

		    var pObject: ISceneObject = null;
		    var pResult: IRect3d = rect3d();
		    var pNode: IOcTreeNode = null;
		    var i: int;

		    //Fill testlocalRect
		    for (i = 0; i < this._iDepth; ++i) {
		        var shift_count: int = 10 - i;
		        this._pTestLocalRect[i].set(pByteRect.x0 >> shift_count,
		                                   pByteRect.x1 >> shift_count,
		                                   pByteRect.y0 >> shift_count,
		                                   pByteRect.y1 >> shift_count,
		                                   pByteRect.z0 >> shift_count,
		                                   pByteRect.z1 >> shift_count);
		    }

		    //Test nodes
		    for (pNode = this._pFirstNode; pNode; pNode = pNode.forwardNodeLink) {
		        iLevel = pNode.level;
		        iX = pNode.x;
		        iY = pNode.y;
		        iZ = pNode.z;
		        pLocalRect = this._pTestLocalRect[iLevel];

		        if (iY < pLocalRect.y0 ||
		            iY > pLocalRect.y1 ||
		            iX < pLocalRect.x0 ||
		            iX > pLocalRect.x1 ||
		            iZ < pLocalRect.z0 ||
		            iZ > pLocalRect.z1) {
		            continue;
		        }
		        
		        if (iY == pLocalRect.y0 ||
		            iY == pLocalRect.y1 ||
		            iX == pLocalRect.x0 ||
		            iX == pLocalRect.x1 ||
		            iZ == pLocalRect.z0 ||
		            iZ == pLocalRect.z1) {
		            //Test node and objects
		            pObject = null;
		            if (!pOptionalFrustum) {
		                for (pObject = pNode.firstMember; pObject; pObject = pObject._pForwardTreeLink) {
		                    if (a.intersectRect3d(pWorldRect, pObject.worldBounds(), pResult)) {
		                        if (pResultListEnd) {
		                            pObject.attachToSearchResult(pResultListEnd, null);
		                            pResultListEnd = pObject;
		                        }
		                        else {
		                            pObject.clearSearchResults();
		                            pResultListEnd = pObject;
		                            pResultListStart = pObject;
		                        }
		                    }
		                }
		                continue;
		            }
		            //Real node rect not in frustum -> there are no members to add
		            if (pNode.pNodeTrueRect.isClear()) {
		                //pNode.pNodeTrueRect = pNode.nodeCoords();
		                pNode.nodeCoords();
		            }
		            if (!pOptionalFrustum.testRect(pNode.pNodeTrueRect)) {
		                continue;
		            }
		            //All ok -> test each member to rect and frustum
		            for (pObject = pNode.firstMember; pObject; pObject = pObject._pForwardTreeLink) {
		                if (a.intersectRect3d(pWorldRect, pObject.worldBounds(), pResult)) {
		                    if (pOptionalFrustum.testRect(pObject.worldBounds())) {
		                        if (pResultListEnd) {
		                            pObject.attachToSearchResult(pResultListEnd, null);
		                            pResultListEnd = pObject;
		                        }
		                        else {
		                            pObject.clearSearchResults();
		                            pResultListEnd = pObject;
		                            pResultListStart = pObject;
		                        }
		                    }
		                }
		            }
		            continue;
		        }
		        else {
		            //Test only for frustrum
		            pObject = null;
		            //No frustum -> add all members to search result
		            if (!pOptionalFrustum) {
		                for (pObject = pNode.firstMember; pObject; pObject = pObject._pForwardTreeLink) {
		                    if (pResultListEnd) {
		                        pObject.attachToSearchResult(pResultListEnd, null);
		                        pResultListEnd = pObject;
		                    }
		                    else {
		                        pObject.clearSearchResults();
		                        pResultListEnd = pObject;
		                        pResultListStart = pObject;
		                    }
		                }
		                continue;
		            }
		            //Real node rect not in frustum -> there are no members to add
		            if (pNode.pNodeTrueRect.isClear()) {
		                //pNode.pNodeTrueRect = pNode.nodeCoords();
		                pNode.nodeCoords();
		            }
		            if (!pOptionalFrustum.testRect(pNode.pNodeTrueRect)) {
		                continue;
		            }
		            //All ok -> test each member to frustum
		            for (pObject = pNode.firstMember; pObject; pObject = pObject._pForwardTreeLink) {
		                if (pOptionalFrustum.testRect(pObject.worldBounds())) {
		                    if (pResultListEnd) {
		                        pObject.attachToSearchResult(pResultListEnd, null);
		                        pResultListEnd = pObject;
		                    }
		                    else {
		                        pObject.clearSearchResults();
		                        pResultListEnd = pObject;
		                        pResultListStart = pObject;
		                    }
		                }
		            }
		            continue;
		        }
		    }
		    return pResultListStart;
		};

		protected attachObject(pObject: ISceneObject): void {
			
		}

		protected detachObject(pObject: ISceneObject): void {
			
		}

		_findObjects(pCamera: ICamera, bQuickSearch: bool = true): ISceneObject[] {

			return null;
		}

	}
}

#endif