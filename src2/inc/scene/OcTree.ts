#ifndef OCTREE_TS
#define OCTREE_TS

#include "common.ts"
#include "IOcTree.ts"
#include "DisplayList.ts"
#include "math/Vec3.ts"
#include "OcTreeNode.ts"
#include "OcTreeRect.ts"
#include "IRect3d.ts"
#include "IFrustum.ts"
#include "geometry/classifications.ts"
#include "geometry/intersections.ts"

module akra.scene {
	export enum EOcTreeConstants {
	    k_MinimumTreeDepth = 0,
	    k_MaximumTreeDepth = 10
    };

	export class OcTree extends DisplayList implements IOcTree {
		/** List of OcTreeNodes on each level */
		//protected _ppLevelNodes: IOcTreeNode[][] = null;
		/** First node in list of all nodes */
		//protected _pFirstNode: IOcTreeNode = null;
		protected _pHead: IOcTreeNode = null;
		/** Size of world bounding box */
		protected _v3fWorldExtents: IVec3 = new Vec3();
		/** Negate min point of bounding box */
		protected _v3fWorldScale: IVec3 = new Vec3();
		/** Value of relation between (1024,1024,1024) and bounding box size */
		protected _v3fWorldOffset: IVec3 = new Vec3();
		/** Maximum depth of tree. Value set when you call OcTree::create() */
		protected _iDepth: int = 0;
		//protected _iSize: int = 0;//2^iDepth;
		/** 
		 * Список свободных узлов(объектов OcTreeNode). 
		 * Необходимо для экономии ресурсов памяти и чтобы не делать лишних delete 
		 */
		protected _pFreeNodePool: IOcTreeNode[] = null;
		/**
		 * Список байтовых ректов ректа камеры для тестов объектов.
		 */
		//protected _pTestLocalRect: IOcTreeRect[] = null;

		constructor () {
			super();
			this.name = "OcTree";
		};

		inline get depth(): int{
			return this._iDepth;
		};

		inline get worldScale(): IVec3{
			return this._v3fWorldScale;
		};

		inline get worldOffset(): IVec3{
			return this._v3fWorldOffset;
		};		

		/**
		 * Create
		 */
		create(pWorldBoundingBox: IRect3d, iDepth: int, nNodes: uint = 64): void {

		    var v3fTemp: IVec3 = vec3();
		    var i: int = 0;
		    
		    
		    debug_assert(!this.isReady(), "the Oc tree has already been created");
		    debug_assert(iDepth >= EOcTreeConstants.k_MinimumTreeDepth 
		    	&& iDepth <= EOcTreeConstants.k_MaximumTreeDepth, "invalid tree depth");

		    this._iDepth = iDepth;

		    this._v3fWorldExtents.set(pWorldBoundingBox.size(v3fTemp));
		    
		    this._v3fWorldOffset.set(pWorldBoundingBox.minPoint(v3fTemp).negate());

		    var iSize: int = 1 << iDepth;

		    this._v3fWorldScale.x = iSize / this._v3fWorldExtents.x;
		    this._v3fWorldScale.y = iSize / this._v3fWorldExtents.y;
		    this._v3fWorldScale.z = iSize / this._v3fWorldExtents.z;

		    // allocate the nodes
		    // this._ppLevelNodes = new Array(iDepth);

		    // for (i = 0; i < iDepth; ++i) {
		    //     this._ppLevelNodes[i] = new Array();
		    // }

		    // this._pTestLocalRect = new Array(iDepth);

		    // for (i = 0; i < iDepth; ++i) {
		    //     this._pTestLocalRect[i] = new OcTreeRect;
		    // }
		    
		    this._pHead = new OcTreeRootNode(this) ;
		    this._pHead.level = 0;

		    this._pFreeNodePool = new Array();

		    for (i = 0; i < nNodes; ++i) {
		        this._pFreeNodePool.push(new OcTreeNode(this));
		    }
		}

		/**
		 * is any levels of tree are availeable(some object in a tree)
		 */
		isReady(): bool {
			if(this._iDepth > 0){
				return true;
			}
			else{
				return false;
			}
		}

		/**
		 * find node
		 */
		findTreeNode(pObject: ISceneObject): IOcTreeNode {
		    var pRect: IRect3d = pObject.worldBounds;
		    var iX0: int = pRect.x0, iX1: int = pRect.x1,
		        iY0: int = pRect.y0, iY1: int = pRect.y1,
		        iZ0: int = pRect.z0, iZ1: int = pRect.z1;

		    var v3fWorldOffset: IVec3 = this._v3fWorldOffset;
		    var v3fWorldScale: IVec3 = this._v3fWorldScale;

		    iX0 += v3fWorldOffset.x; iX1 += v3fWorldOffset.x;
		    iY0 += v3fWorldOffset.y; iY1 += v3fWorldOffset.y;
		    iZ0 += v3fWorldOffset.z; iZ1 += v3fWorldOffset.z;

		    iX0 *= v3fWorldScale.x; iX1 *= v3fWorldScale.x;
		    iY0 *= v3fWorldScale.y; iY1 *= v3fWorldScale.y;
		    iZ0 *= v3fWorldScale.z; iZ1 *= v3fWorldScale.z;

		    //round it
		    iX0 = math.floor(iX0); iX1 = math.ceil(iX1);
		    iY0 = math.floor(iY0); iY1 = math.ceil(iY1);
		    iZ0 = math.floor(iZ0); iZ1 = math.ceil(iZ1);

		    iX1 = (iX1 === iX0) ? iX0 + 1 : iX1;
		    iY1 = (iY1 === iY0) ? iY0 + 1 : iY1;
		    iZ1 = (iZ1 === iZ0) ? iZ0 + 1 : iZ1;

		    //var iMax1: int = 1 << this._iDepth - 2;
		    //var iMax2: int = 1 << this._iDepth - 1;

		    //iX0 = math.clamp(iX0, 0, iMax1);
		    //iY0 = math.clamp(iY0, 0, iMax1);
		    //iZ0 = math.clamp(iZ0, 0, iMax1);

		    //iX1 = math.clamp(iX1, iX0 + 1, iMax2);
		    //iY1 = math.clamp(iY1, iY0 + 1, iMax2);
		    //iZ1 = math.clamp(iZ1, iZ0 + 1, iMax2);

		    console.error('zzzzzz', iX0, iX1, iY0, iY1, iZ0, iZ1);

		    var pNode: IOcTreeNode = this.findTreeNodeByRect(iX0, iX1, iY0, iY1, iZ0, iZ1);

		    return pNode;
		};

		/**
		 * Find tree node by Rect
		 */
		findTreeNodeByRect(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode {

			var nMax: int = (1 << this._iDepth);

			if(iX0 < 0 || iX1 > nMax || iY0 < 0 || iY1 > nMax
				|| iZ0 < 0 || iZ1 > nMax){

				return this._pHead;
			}

			var iDepth: int = this._iDepth;

			// var iMidX: int, iMidY: int, iMidZ: int;
		    var iLevel: int;

		 //    var iXPattern: int = iX0 ^ iX1;
		 //    var iYPattern: int = iY0 ^ iY1;
		 //    var iZPattern: int = iZ0 ^ iZ1;

		 //    var iPattern: int = math.max(iXPattern, math.max(iYPattern, iZPattern));

		    // iLevel = (iPattern != 0) ? iDepth - math.highestBitSet(iPattern) : 0;

		    // console.warn(iLevel);
		    ///////////////////////////
		    iLevel = this._findNodeLevel(iX0, iX1, iY0, iY1, iZ0, iZ1);

		    console.warn(iLevel);
		    ///////////////////////////

		    if(iLevel == 0){
		    	return this._pHead;
		    }

		    var iComposedIndex: int;
		    var iShift: int = iDepth - iLevel;
		    iComposedIndex = (iX0 >> (iDepth - iLevel)) << (2*iDepth + iShift);
		    console.log(iComposedIndex);
		    iComposedIndex += (iY0 >> (iDepth - iLevel)) << (iDepth + iShift);
		    console.log(iComposedIndex);
		    iComposedIndex += (iZ0 >> (iDepth - iLevel)) << (iShift);

		    //console.log(iComposedIndex, iX0, iY0, iZ0);

			var iWay: int;

            var pParentNode: IOcTreeNode, pNode: IOcTreeNode
		    pParentNode = this._pHead;
		    pNode = null;

		    var iTmpX: int, iTmpY: int, iTmpZ: int;
		    var iX: int, iY: int, iZ: int;

		    var i: int = 0;
		    var zz: int = 0;
			while(i < iLevel){

				iTmpX = iX0; iTmpY = iY0; iTmpZ = iZ0;

				iX = (iTmpX >> (iDepth - i - 1)) & 1;
		    	iY = (iTmpY >> (iDepth - i - 1)) & 1;
		    	iZ = (iTmpZ >> (iDepth - i - 1)) & 1;

				iWay = 4*iX + 2*iY + iZ;

				console.log('iWay -------------->', iWay, '<--------------');

				var pNodeList: IObjectList = pParentNode.childrenList[iWay];
				console.log(pParentNode);

				if(pNodeList.length === 0){
					pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
					pNodeList.push(pNode);
					return pNode;
				}

				var iPosition: int = 0;
				var pTestNode: IOcTreeNode = pNodeList.first;

				var iTestMask: int = (iDepth >= i + 2) ? 1 << (iDepth - i - 2) : 0;

				var iMask: int  = (iTestMask << (2*iDepth)) + (iTestMask << iDepth) + iTestMask;
				console.log('mask-------------->',iMask,'<-----------');

				var pParentNodeOld: IOcTreeNode = pParentNode;

				while(isDefAndNotNull(pTestNode)){

					var iTest: int = pTestNode.index & iComposedIndex;

					console.log(pTestNode);
					console.error('iLevel--->', iLevel,'iTest ------------>', iTest);
					console.error('testNode index', pTestNode.index, 'composed index', iComposedIndex);

					var iResult1: int = pTestNode.index & iMask;
					var iResult2: int = iComposedIndex & iMask;

					console.warn(iResult1, iResult2);

					if(iResult1 === iResult2){
						if(pTestNode.level === iLevel){
							return pTestNode;
						}
						else if(pTestNode.level < iLevel){
							pParentNode = pTestNode;
							i = pTestNode.level;
							break;
						}
						else{
							alert("" + <string><any>pTestNode.level + "  " + <string><any>iLevel);
							if(pNode === null){
								pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
								pParentNode.childrenList[iWay].push(pNode);
								i = iLevel;
							}
							
							var iTestIndex: int = pTestNode.index;

							iX = (iTestIndex >> (3*iDepth - i))&1;
							iY = (iTestIndex >> (2*iDepth - i))&1;
							iZ = (iTestIndex >> (iDepth - i))&1;

							var iTestWay: int = 4*iX + 2*iY + iZ;

							pNodeList.takeAt(iPosition);
							pNodeList.seek(iPosition-1);
							iPosition--;

							pNode.childrenList[iTestWay].push(pTestNode);
							pTestNode.rearNodeLink = pNode;
						}
					}

					// if(iTest === pTestNode.index){
					// 	if(pTestNode.level === iLevel){
					// 		return pTestNode;
					// 	}
					// 	else if(pTestNode.level < iLevel){
					// 		pParentNode = pTestNode;
					// 		i = pTestNode.level;
					// 		break;
					// 	}
					// 	console.log(pTestNode.level, iLevel,"<--------------------------");
					// }
					// if(iTest === iComposedIndex){
						
					// 	var iTestIndex: int = pTestNode.index;

					// 	iX = (iTestIndex >> (3*iDepth - i))&1;
					// 	iY = (iTestIndex >> (2*iDepth - i))&1;
					// 	iZ = (iTestIndex >> (iDepth - i))&1;

					// 	iWay = 4*iX + 2*iY + iZ;

					// 	pNodeList.takeAt(iPosition);
					// 	pNodeList.seek(iPosition-1);
					// 	iPosition--;

					// 	pNode.childrenList[iWay].push(pTestNode);
					// 	pTestNode.rearNodeLink = pNode;
					// }

					pTestNode = pNodeList.next();
					iPosition++;
				}

				if(pNode === null && pParentNodeOld === pParentNode){
					pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
					pParentNode.childrenList[iWay].push(pNode);
					break;
				}

				if(zz>100){
					break;
				}
				zz++;
			}

			return pNode;
		};

		private _findNodeLevel(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): int{
			var iLengthX: int = iX1 - iX0;
			var iLengthY: int = iY1 - iY0;
			var iLengthZ: int = iZ1 - iZ0;

			var iLength: int = math.max(iLengthX, math.max(iLengthY, iLengthZ));
			//maximum possible level
			var iLevel: int = this._iDepth - math.floor(math.log(iLength) / math.LN2);

			while(iLevel > 0){
				var iPitch: int = 1 << (this._iDepth - iLevel);
				var iTest1: int, iTest2: int;

				//first test for x then for y and z

				var i;
				for(i=0; i<3; i++){
					iTest1 = math.floor(arguments[2*i] / iPitch);
					iTest2 = math.floor(arguments[2*i + 1] / iPitch);

					if(iTest1 != iTest2){
						if((iTest1 + 1) == iTest2){
							if((iX1%iPitch) != 0){
								break;
							}
						}
						else{
							break;
						}
					}
				}
				if(i!=3){
					iLevel--;
				}
				else{
					break;
				}
			}
			return iLevel;
		};

		/**
		 * Get free node. 
		 * Get it from _pFreeNodePull or create new OcTreeNode if it`s empty and set his data.
		 */
		getAndSetFreeNode(iLevel: int, iComposedIndex: int, pParentNode: IOcTreeNode): IOcTreeNode {
			var pNode: IOcTreeNode = this._pFreeNodePool.pop();
			if (!isDefAndNotNull(pNode)) {
		        pNode = new OcTreeNode(this);
		    }


			var iDepth: int = this._iDepth;
			var iMask: int = (1<<(this._iDepth + 1)) - 1;
			var iIndexX: int = (iComposedIndex >> (2*iDepth)) & iMask;
			var iIndexY: int = (iComposedIndex >> (iDepth)) & iMask;
			var iIndexZ: int = iComposedIndex & iMask;
			var iSize: int = 1 << (this._iDepth - iLevel);

		    pNode.level = iLevel;
		    // pNode.x = iX;
		    // pNode.y = iY;
		    // pNode.z = iZ;
		    pNode.index = iComposedIndex;
		    pNode.rearNodeLink = pParentNode;
		    pNode.worldBounds.set(iIndexX, iIndexX + iSize, iIndexY, iIndexY + iSize, iIndexZ, iIndexZ + iSize);
		    pNode.worldBounds.divSelf(this._v3fWorldScale);
		    pNode.worldBounds.subSelf(this._v3fWorldOffset)
		    
		    //this._ppLevelNodes[iLevel][iIndex] = pNode;

		    // if (this._pFirstNode) {
		    //     this._pFirstNode.rearNodeLink = pNode;
		    // }

		    // pNode.forwardNodeLink = this.pFirstNode;
		    // pNode.rearNodeLink = null;

		    //this._pFirstNode = pNode;
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
		};

		/**
		 * Delete node from tree
		 */
		deleteNodeFromTree(pNode: IOcTreeNode): void {
			
			var pParentNode: IOcTreeNode = pNode.rearNodeLink;

			debug_assert(pNode.membersList.length == 0,"list members of node don't empty");

			var iDepth: int = this._iDepth;
			var iParentLevel: int = pParentNode.level;
			var iIndex: int = pNode.index;

			var iX: int = (iIndex >> (3*iDepth - iParentLevel))&1;
			var iY: int = (iIndex >> (2*iDepth - iParentLevel))&1;
			var iZ: int = (iIndex >> (iDepth - iParentLevel))&1;

			var iWay: int = 4*iX + 2*iY + iZ;

			var pParentBranch: IObjectList = pParentNode.childrenList[iWay];

			var iNode: int = pParentBranch.indexOf(pNode);

			//deleting node from parent list
			pParentBranch.takeAt(iNode);

			for(var i=0;i<8;i++){
				var pChildrens: IObjectList = pNode.childrenList[i];
				while(pChildrens.length){
					var pChildrenNode: IOcTreeNode = pChildrens.pop();
					pChildrenNode.rearNodeLink = pParentNode;
					pParentBranch.push(pChildrenNode);
				}
			}

			pNode.level = 0;
			pNode.rearNodeLink = null;
			pNode.worldBounds.clear();

		    this._pFreeNodePool.push(pNode);
		};

		/**
		 * Test rect and frustum
		 */
		
		buildSearchResults(pWorldRect: IRect3d, pOptionalFrustum?: IFrustum): IObjectArray{
			var pResult: IObjectArray = new util.ObjectArray();
			if(arguments.length === 1){
				this._buildSearchResultsByRect(pWorldRect, this._pHead, pResult);
			}
			else{
				this._buildSearchResultsByRectAndFrustum(pWorldRect, pOptionalFrustum,
				 this._pHead, pResult);
			}

			return pResult;
		};

		protected _buildSearchResultsByRect(pWorldRect: IRect3d, pNode: IOcTreeNode, pResultList: IObjectArray){
			var pNodeRect: IRect3d = pNode.worldBounds;

			var kResult: EVolumeClassifications = geometry.classifyRect3d(pNodeRect, pWorldRect);

			if(kResult == EVolumeClassifications.A_CONTAINS_B 
				&& kResult == EVolumeClassifications.INTERSECTING){

				//надо проводить дополнительные тесты
				
				var pMemberList: IObjectList = pNode.membersList;
				var pObject: ISceneObject = pMemberList.first;
				while(isDefAndNotNull(pObject)){
					if(geometry.intersectRect3dRect3d(pWorldRect, pObject.worldBounds)){
						pResultList.push(pObject);
					}
					pObject = pMemberList.next();
				}

				for(var i:int = 0; i < 8; i++){
					var pChildrenList: IObjectList = pNode.childrenList[i];
					var pNode: IOcTreeNode = pChildrenList.first;

					while(isDefAndNotNull(pNode)){
						this._buildSearchResultsByRect(pWorldRect, pNode, pResultList);
						pNode = pChildrenList.next();
					}
				}
			}
			else if(kResult != EVolumeClassifications.NO_RELATION){
				//объект полностью попал
				this._includeAllTreeSubbranch(pNode, pResultList);
			}
		};

		protected _buildSearchResultsByRectAndFrustum(pWorldRect: IRect3d, pOptionalFrustum: IFrustum,
			pNode: IOcTreeNode, pResultList: IObjectArray){

			var pNodeRect: IRect3d = pNode.worldBounds;

			if(geometry.intersectRect3dRect3d(pWorldRect, pNodeRect)){
				var kTestResult: int = geometry.classifyFrustumRect3d(pOptionalFrustum, pNodeRect);
				if(kTestResult == EVolumeClassifications.A_CONTAINS_B){
					//объект полностью попал	
					this._includeAllTreeSubbranch(pNode, pResultList);
				}
				else if(kTestResult == EVolumeClassifications.INTERSECTING){
					//объект попал частично
					var pMemberList: IObjectList = pNode.membersList;
					var pObject: ISceneObject = pMemberList.first;
					while(isDefAndNotNull(pObject)){
						if(pOptionalFrustum.testRect(pObject.worldBounds)){
							pResultList.push(pObject);
						}
						pObject = pMemberList.next();
					}

					for(var i:int = 0; i < 8; i++){
						var pChildrenList: IObjectList = pNode.childrenList[i];
						var pNode: IOcTreeNode = pChildrenList.first;
						while(isDefAndNotNull(pNode)){
							this._buildSearchResultsByRectAndFrustum(pWorldRect, pOptionalFrustum, pNode, pResultList);
							pNode = pChildrenList.next();
						}
					}
				}
			}
		};

		protected _includeAllTreeSubbranch(pNode: IOcTreeNode, pResultList: IObjectArray){
			var pMemberList: IObjectList = pNode.membersList;
			var pObject: ISceneObject = pMemberList.first();
			while(isDefAndNotNull(pObject)){
				pResultList.push(pObject);
				pObject = pMemberList.next();
			}

			for(var i:int = 0; i < 8; i++){
				var pChildrenList: IObjectList = pNode.childrenList[i];
				var pNode: IOcTreeNode = pChildrenList.first;

				while(isDefAndNotNull(pNode)){
					this._includeAllTreeSubbranch(pNode, pResultList);
					pNode = pChildrenList.next();
				}
			}
		};

		protected attachObject(pObject: ISceneObject): void {
			var pNode: IOcTreeNode = this.findTreeNode(pObject);
			console.log(pNode);
			pNode.addMember(pObject);
		}

		protected detachObject(pObject: ISceneObject): void {
			var pNode: IOcTreeNode = this.findTreeNode(pObject);
			pNode.removeMember(pObject);
		}

		/**
		 * Getter for OcTreeNode by level and x, y, z
		 */
		// getNodeFromLevelXYZ(iLevel: int, iIndex: int): IOcTreeNode {
		//     debug_assert(this.isReady(), "the Oc tree has not been created");

		//     if (iLevel >= 0 && iLevel < this._iDepth) {
		//         return this._ppLevelNodes[iLevel][iIndex];
		//     }
		    
		//     return null;
		// }



		/**
		 * Destroy tree and all nodes in tree. Set _iDepth to 0.
		 */
		// destroy(): void {
		//     var i: int;

		//     // for (i = 0; i < this._iDepth; ++i) {
		//     //     delete this._ppLevelNodes[i];
		//     // }

		//     for (i = 0; i < this._pFreeNodePool.length; ++i) {
		//         delete this._pFreeNodePool[i];
		//     }
		    
		//     //this._ppLevelNodes = null;
		//     this._pFreeNodePool = null;
		//     this._iDepth = 0;
		// }


		

		// /**
		//  * Build pByteRect from Rect3d
		//  * Convert to integer values, taking the floor of each real
		//  */
		// inline buildByteRect(pWorldRect: IRect3d, pWorldByteRect: IOcTreeRect): void {
		//     pWorldByteRect.convert(pWorldRect, this._v3fWorldOffset, this._v3fWorldScale);
		// };

	}
}

#endif