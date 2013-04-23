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
		    
		    this._pHead = new OcTreeRootNode(this);
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

		    // LOG(pRect.toString());
		    // LOG(iX0, iX1, iY0, iY1, iZ0, iZ1);

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

			var bTest: bool = false && (iX0 == 24 && iX1 == 28 && iY0 == 28 && iY1 == 32 && iZ0 == 12 && iZ1 == 16);

			var iDepth: int = this._iDepth;
		    var iLevel: int;

		    ///////////////////////////
		    iLevel = this._findNodeLevel(iX0, iX1, iY0, iY1, iZ0, iZ1);

		    // console.warn(iLevel);
		    ///////////////////////////

		    if(iLevel == 0){
		    	return this._pHead;
		    }

		    var iComposedIndex: int;
		    var iShift: int = iDepth - iLevel;
		    iComposedIndex = (iX0 >> (iDepth - iLevel)) << (2 * iDepth + iShift);
		    // console.log(iComposedIndex);
		    iComposedIndex += (iY0 >> (iDepth - iLevel)) << (iDepth + iShift);
		    // console.log(iComposedIndex);
		    iComposedIndex += (iZ0 >> (iDepth - iLevel)) << (iShift);

		    // console.log(iComposedIndex, iX0, iY0, iZ0);

			var iWay: int;

            var pParentNode: IOcTreeNode, pNode: IOcTreeNode;
		    pParentNode = this._pHead;
		    pNode = null;

		    var iTmpX: int, iTmpY: int, iTmpZ: int;
		    var iX: int, iY: int, iZ: int;

		    var i: int = 0;
			while(i < iLevel){

				iTmpX = iX0; iTmpY = iY0; iTmpZ = iZ0;

				iX = (iTmpX >> (iDepth - i - 1)) & 1;
		    	iY = (iTmpY >> (iDepth - i - 1)) & 1;
		    	iZ = (iTmpZ >> (iDepth - i - 1)) & 1;

				iWay = 4*iX + 2*iY + iZ;

				//	console.log('iWay -------------->', iWay, '<--------------');

				var pNodeList: IObjectList = pParentNode.childrenList[iWay];
				if(bTest){
					console.log(pParentNode);
				}

				if(pNodeList.length === 0){
					pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
					pNodeList.push(pNode);
					return pNode;
				}

				var iPosition: int = 0;
				var pTestNode: IOcTreeNode = pNodeList.first;

				var iTestMask: int = (iDepth >= i + 2) ? 1 << (iDepth - i - 2) : 0;

				var iMask: int  = (iTestMask << (2*iDepth)) + (iTestMask << iDepth) + iTestMask;
				if(bTest)
					console.log('mask-------------->',iMask,'<-----------');

				var pParentNodeOld: IOcTreeNode = pParentNode;

				while(isDefAndNotNull(pTestNode)){

					// var iTest: int = pTestNode.index & iComposedIndex;

					if(bTest){
						console.log(pTestNode);
						console.error('testNode index', pTestNode.index, 'composed index', iComposedIndex);
					}

					var iTestIndex: uint = pTestNode.index;

					var iResult1: int = iTestIndex & iMask;
					var iResult2: int = iComposedIndex & iMask;

					if(bTest)
						console.warn(iResult1, iResult2);

					if(iResult1 === iResult2){
						if(pTestNode.level === iLevel && iTestIndex == iComposedIndex){
							return pTestNode;
						}
						else if(pTestNode.level < iLevel && ((iTestIndex & iComposedIndex) == iTestIndex)){
							pParentNode = pTestNode;
							i = pTestNode.level;
							break;
						}
						else if(pTestNode.level > iLevel && ((iTestIndex & iComposedIndex) == iComposedIndex)){
							//alert("" + <string><any>pTestNode.level + "  " + <string><any>iLevel);
							if(pNode === null){
								pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
								pParentNode.childrenList[iWay].push(pNode);
								i = iLevel;
							}
							
							var iShift = iDepth - i - 1;

							iX = (iTestIndex >> (2*iDepth + iShift))&1;
							iY = (iTestIndex >> (iDepth + iShift))&1;
							iZ = (iTestIndex >> iShift)&1;

							var iTestWay: int = 4*iX + 2*iY + iZ;

							pNodeList.takeAt(iPosition);
							pNodeList.seek(iPosition-1);
							iPosition--;

							pNode.childrenList[iTestWay].push(pTestNode);
							pTestNode.rearNodeLink = pNode;
						}
					}

					pTestNode = pNodeList.next();
					iPosition++;
				}

				if(pNode === null && pParentNodeOld === pParentNode){
					pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
					pParentNode.childrenList[iWay].push(pNode);
					break;
				}
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
							if((arguments[2*i+1]%iPitch) != 0){
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
			var iMask: int = (1<<this._iDepth) - 1;
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

			console.error(pNode,pParentNode, pNode.worldBounds.toString());

			debug_assert(pNode.membersList.length == 0,"list members of node don't empty");

			var iDepth: int = this._iDepth;
			var iParentLevel: int = pParentNode.level;
			var iIndex: int = pNode.index;
			var iShift: int = iDepth - iParentLevel - 1;

			var iX: int = (iIndex >> (2*iDepth + iShift))&1;
			var iY: int = (iIndex >> (iDepth + iShift))&1;
			var iZ: int = (iIndex >> iShift)&1;

			var iWay: int = 4*iX + 2*iY + iZ;

			var pParentBranch: IObjectList = pParentNode.childrenList[iWay];

			//console.log('iWay ------------>', iWay);

			var iNode: int = pParentBranch.indexOf(pNode);

			debug_assert(iNode != -1, "can't remove node from parent, node not found");

			//deleting node from parent list
			pParentBranch.takeAt(iNode);

			for(var i=0;i<8;i++){
				var pChildrens: IObjectList = pNode.childrenList[i];
				while(pChildrens.length){
					var pChildNode: IOcTreeNode = pChildrens.pop();
					pChildNode.rearNodeLink = pParentNode;
					pParentBranch.push(pChildNode);
				}
			}

			pNode.level = 0;
			pNode.rearNodeLink = null;
			pNode.worldBounds.clear();

		    this._pFreeNodePool.push(pNode);
		};

		_findObjects(pCamera: ICamera, 
				pResultArray?: IObjectArray = new util.ObjectArray(),
				bFastSearch: bool = false): IObjectArray{

			//while we ignore second parametr
			//don't have normal implementation

			pResultArray.clear();

			if(!isDef(pCamera.frustum)){
				this._buildSearchResultsByRect(pCamera.searchRect, this._pHead, pResultArray);
			}
			else{
				this._buildSearchResultsByRectAndFrustum(pCamera.searchRect, 
									pCamera.frustum, this._pHead, pResultArray);
			}

			return pResultArray;
		};

		protected _buildSearchResultsByRect(pSearchRect: IRect3d, pNode: IOcTreeNode, pResultList: IObjectArray){
			var pNodeRect: IRect3d = pNode.worldBounds;

			var kResult: EVolumeClassifications = geometry.classifyRect3d(pSearchRect, pNodeRect);

			if(kResult == EVolumeClassifications.B_CONTAINS_A 
				|| kResult == EVolumeClassifications.INTERSECTING){

				//надо проводить дополнительные тесты
				
				var pMemberList: IObjectList = pNode.membersList;
				var pObject: ISceneObject = pMemberList.first;
				while(isDefAndNotNull(pObject)){
					if(geometry.intersectRect3dRect3d(pSearchRect, pObject.worldBounds)){
						pResultList.push(pObject);
					}
					pObject = pMemberList.next();
				}

				for(var i:int = 0; i < 8; i++){
					var pChildrenList: IObjectList = pNode.childrenList[i];
					var pChildNode: IOcTreeNode = pChildrenList.first;

					while(isDefAndNotNull(pChildNode)){
						this._buildSearchResultsByRect(pSearchRect, pChildNode, pResultList);
						pChildNode = pChildrenList.next();
					}
				}
			}
			else if(kResult != EVolumeClassifications.NO_RELATION){
				//объект полностью попал
				this._includeAllTreeSubbranch(pNode, pResultList);
			}
		};

		protected _buildSearchResultsByRectAndFrustum(pSearchRect: IRect3d, pFrustum: IFrustum,
			pNode: IOcTreeNode, pResultList: IObjectArray){

			var pNodeRect: IRect3d = pNode.worldBounds;
			//var pChildRect: IRect3d;

			if(geometry.intersectRect3dRect3d(pSearchRect, pNodeRect)){
				var kTestResult: int = geometry.classifyFrustumRect3d(pFrustum, pNodeRect);
				if(kTestResult == EVolumeClassifications.A_CONTAINS_B){
					//объект полностью попал	
					this._includeAllTreeSubbranch(pNode, pResultList);
				}
				else if(kTestResult == EVolumeClassifications.INTERSECTING){
					//объект попал частично
					var pMemberList: IObjectList = pNode.membersList;
					var pObject: ISceneObject = pMemberList.first;
					while(isDefAndNotNull(pObject)){
						if(pFrustum.testRect(pObject.worldBounds)){
							pResultList.push(pObject);
						}
						pObject = pMemberList.next();
					}

					for(var i:int = 0; i < 8; i++){
						//TODO: test by child rect
						var pChildrenList: IObjectList = pNode.childrenList[i];
						var pChildNode: IOcTreeNode = pChildrenList.first;
						while(isDefAndNotNull(pChildNode)){
							this._buildSearchResultsByRectAndFrustum(pSearchRect, pFrustum, pChildNode, pResultList);
							pChildNode = pChildrenList.next();
						}
					}
				}
			}
		};

		protected _includeAllTreeSubbranch(pNode: IOcTreeNode, pResultList: IObjectArray){
			//console.warn("----------------> including all subbranch <------------------");
			var pMemberList: IObjectList = pNode.membersList;
			var pObject: ISceneObject = pMemberList.first;
			while(isDefAndNotNull(pObject)){
				pResultList.push(pObject);
				pObject = pMemberList.next();
			}

			for(var i:int = 0; i < 8; i++){
				var pChildrenList: IObjectList = pNode.childrenList[i];
				var pChildNode: IOcTreeNode = pChildrenList.first;

				while(isDefAndNotNull(pChildNode)){
					this._includeAllTreeSubbranch(pChildNode, pResultList);
					pChildNode = pChildrenList.next();
				}
			}
		};

		protected attachObject(pNode: ISceneNode): void {
			// console.error(pNode, isSceneObject(pNode));
			if(isSceneObject(pNode)){
				var pOcTreeNode: IOcTreeNode = this.findTreeNode(<ISceneObject>pNode);
				pOcTreeNode.addMember(<ISceneObject>pNode);
			}
		};

		protected detachObject(pNode: ISceneNode): void {
			if(isSceneObject(pNode)){
				var pOcTreeNode: IOcTreeNode = this.findTreeNode(<ISceneObject>pNode);
				pOcTreeNode.removeMember(<ISceneObject>pNode);
			}
		};

		_toSimpleObject(pNode?: IOcTreeNode = this._pHead): any{
			
			var pResult: any = {};
			pResult.members = [];
			pResult.childrens = new Array(8);
			for(var i:int = 0; i < 8; i++){
				pResult.childrens[i] = [];
			}
			pResult.level = pNode.level;
			pResult.index = pNode.index;
			pResult.worldBounds = pNode.worldBounds;
			

			var pMemberList: IObjectList = pNode.membersList;
			var pObject: ISceneObject = pMemberList.first;
			while(isDefAndNotNull(pObject)){
				pResult.members.push(pObject.worldBounds);
				pObject = pMemberList.next();
			}

			for(var i:int = 0; i < 8; i++){
				var pList: IObjectList = pNode.childrenList[i];
				var pChildNode: IOcTreeNode = pList.first;

				while(isDefAndNotNull(pChildNode)){
					pResult.childrens[i].push(this._toSimpleObject(pChildNode));
					pChildNode = pList.next();
				}
			}

			return pResult;
		};

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