/// <reference path="../idl/IOcTree.ts" />
/// <reference path="../idl/IFrustum.ts" />
/// <reference path="../idl/IRect3d.ts" />

/// <reference path="../common.ts" />
/// <reference path="../math/Vec3.ts" />
/// <reference path="../geometry/classify/classify.ts" />
/// <reference path="../geometry/intersect/intersect.ts" />

/// <reference path="DisplayList.ts" />
/// <reference path="OcTreeNode.ts" />

module akra.scene {

	import Vec3 = math.Vec3;

	enum EOcTreeConstants {
		k_MinimumTreeDepth = 0,
		k_MaximumTreeDepth = 10
	}

	export class OcTree extends DisplayList<ISceneObject> implements IOcTree {
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

		constructor() {
			super("OcTree");
		}

		getDepth(): int {
			return this._iDepth;
		}

		getWorldScale(): IVec3 {
			return this._v3fWorldScale; 
		}

		getWorldOffset(): IVec3 {
			return this._v3fWorldOffset;
		}

		/**
		 * Create
		 */
		create(pWorldBoundingBox: IRect3d, iDepth: int, nNodes: uint = 64): void {

			var v3fTemp: IVec3 = Vec3.temp();
			var i: int = 0;


			debug.assert(!this.isReady(), "the Oc tree has already been created");
			debug.assert(iDepth >= EOcTreeConstants.k_MinimumTreeDepth
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
		isReady(): boolean {
			if (this._iDepth > 0) {
				return true;
			}
			else {
				return false;
			}
		}

		/**
		 * find node
		 */
		findTreeNode(pObject: ISceneObject): IOcTreeNode {
			var pRect: IRect3d = pObject.getWorldBounds();
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
			// if(pRect.x0 == 128 && pRect.x1 == 160 && pRect.y0 == 480 && pRect.y1 == 512){
			//     console.error(iX0, iX1, iY0, iY1, iZ0, iZ1);
			// }
			
			var pNode: IOcTreeNode = this.findTreeNodeByRect(iX0, iX1, iY0, iY1, iZ0, iZ1);
			//if (pNode == null) {
			//	console.log(pNode);
			//}
			return pNode;
		}

		/**
		 * Find tree node by Rect
		 */
		findTreeNodeByRect(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): IOcTreeNode {

			var nMax: int = (1 << this._iDepth);

			if (iX0 < 0 || iX1 > nMax || iY0 < 0 || iY1 > nMax
				|| iZ0 < 0 || iZ1 > nMax) {

				return this._pHead;
			}

			var iDepth: int = this._iDepth;
			var iLevel: int;

			///////////////////////////
			iLevel = this._findNodeLevel(iX0, iX1, iY0, iY1, iZ0, iZ1);

			// console.warn(iLevel);
			///////////////////////////

			if (iLevel === 0) {
				return this._pHead;
			}

			var iComposedIndex: int;
			var iShift: int = iDepth - iLevel;
			iComposedIndex = (iX0 >> (iDepth - iLevel)) << (2 * iDepth + iShift);
			// console.log(iComposedIndex);
			iComposedIndex += (iY0 >> (iDepth - iLevel)) << (iDepth + iShift);
			// console.log(iComposedIndex);
			iComposedIndex += (iZ0 >> (iDepth - iLevel)) << (iShift);

			var iWay: int;

			var pParentNode: IOcTreeNode, pNode: IOcTreeNode;
			pParentNode = this._pHead;
			pNode = null;

			var iX: int, iY: int, iZ: int;

			var i: int = 0;
			while (i < iLevel) {

				iX = (iX0 >> (iDepth - i - 1)) & 1;
				iY = (iY0 >> (iDepth - i - 1)) & 1;
				iZ = (iZ0 >> (iDepth - i - 1)) & 1;

				iWay = 4 * iX + 2 * iY + iZ;

				var pNodeList: IObjectList<IOcTreeNode> = pParentNode.childrenList[iWay];

				if (pNodeList.getLength() === 0) {
					pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
					pNodeList.push(pNode);
					return pNode;
				}

				var iPosition: int = 0;
				var pTestNode: IOcTreeNode = pNodeList.getFirst();

				var iTestMask: int = (iDepth >= i + 2) ? 1 << (iDepth - i - 2) : 0;


				var iMask: int = (iTestMask << (2 * iDepth)) + (iTestMask << iDepth) + iTestMask;

				var pParentNodeOld: IOcTreeNode = pParentNode;

				while (isDefAndNotNull(pTestNode)) {
					var iTestNodeIndex: uint = pTestNode.index;

					var iResult1: int = iTestNodeIndex & iMask;
					var iResult2: int = iComposedIndex & iMask;

					if (iResult1 === iResult2) {
						if (pTestNode.level === iLevel && iTestNodeIndex == iComposedIndex) {
							return pTestNode;
						}
						else if (pTestNode.level < iLevel && this._parentTest(pTestNode.level, iTestNodeIndex, iComposedIndex)) {
							pParentNode = pTestNode;
							i = pTestNode.level;
							break;
						}
						else if (pTestNode.level > iLevel && this._parentTest(iLevel, iComposedIndex, iTestNodeIndex)) {
							//alert("" + <string><any>pTestNode.level + "  " + <string><any>iLevel);
							if (pNode === null) {
								pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
								pParentNode.childrenList[iWay].push(pNode);
								i = iLevel;
							}

							var iShift: int = iDepth - i - 1;

							iX = (iTestNodeIndex >> (2 * iDepth + iShift)) & 1;
							iY = (iTestNodeIndex >> (iDepth + iShift)) & 1;
							iZ = (iTestNodeIndex >> iShift) & 1;

							var iTestWay: int = 4 * iX + 2 * iY + iZ;

							pNode.childrenList[iTestWay].push(pTestNode);
							pTestNode.rearNodeLink = pNode;

							pNodeList.takeAt(iPosition);
							if (iPosition === 0) {
								pNodeList.seek(0);
								pTestNode = pNodeList.getFirst();
								continue;
							}
							pNodeList.seek(iPosition - 1);
							iPosition--;
						}
					}

					pTestNode = pNodeList.next();
					iPosition++;
				}

				if (pNode === null && pParentNodeOld === pParentNode) {
					pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
					pParentNode.childrenList[iWay].push(pNode);
					break;
				}
			}

			return pNode;
		}

		private _parentTest(iLevel: uint, iParentIndex: uint, iChildIndex: uint): boolean {
			var iDepth: uint = this._iDepth;

			var iTmp: uint = (1 << iDepth) - (1 << (iDepth - iLevel));
			var iMask: uint = (iTmp << (2 * iDepth)) + (iTmp << iDepth) + iTmp;

			if ((iParentIndex & iMask) == (iChildIndex & iMask)) {
				return true;
			}
			return false;
		}

		private _findNodeLevel(iX0: int, iX1: int, iY0: int, iY1: int, iZ0: int, iZ1: int): int {
			var iLengthX: int = iX1 - iX0;
			var iLengthY: int = iY1 - iY0;
			var iLengthZ: int = iZ1 - iZ0;

			var iLength: int = math.max(iLengthX, math.max(iLengthY, iLengthZ));
			//maximum possible level
			var iLevel: int = this._iDepth - math.floor(math.log(iLength) / math.LN2);

			while (iLevel > 0) {
				var iPitch: int = 1 << (this._iDepth - iLevel);
				var iTest1: int, iTest2: int;

				//first test for x then for y and z

				var i;
				for (i = 0; i < 3; i++) {
					iTest1 = math.floor(arguments[2 * i] / iPitch);
					iTest2 = math.floor(arguments[2 * i + 1] / iPitch);

					if (iTest1 != iTest2) {
						if ((iTest1 + 1) == iTest2) {
							if ((arguments[2 * i + 1] % iPitch) != 0) {
								break;
							}
						}
						else {
							break;
						}
					}
				}
				if (i != 3) {
					iLevel--;
				}
				else {
					break;
				}
			}
			return iLevel;
		}

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
			var iMask: int = (1 << this._iDepth) - 1;
			var iIndexX: int = (iComposedIndex >> (2 * iDepth)) & iMask;
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
			pNode.worldBounds.subSelf(this._v3fWorldOffset);

			return pNode;
		}

		/**
		 * Delete node from tree
		 */
		deleteNodeFromTree(pNode: IOcTreeNode): void {
			var pParentNode: IOcTreeNode = pNode.rearNodeLink;

			debug.assert(pNode.membersList.getLength() == 0, "list members of node don't empty");

			var iDepth: int = this._iDepth;
			var iParentLevel: int = pParentNode.level;
			var iIndex: int = pNode.index;
			var iShift: int = iDepth - iParentLevel - 1;

			var iX: int = (iIndex >> (2 * iDepth + iShift)) & 1;
			var iY: int = (iIndex >> (iDepth + iShift)) & 1;
			var iZ: int = (iIndex >> iShift) & 1;

			var iWay: int = 4 * iX + 2 * iY + iZ;

			var pParentBranch: IObjectList<IOcTreeNode> = pParentNode.childrenList[iWay];

			//console.log('iWay ------------>', iWay);

			var iNode: int = pParentBranch.indexOf(pNode);

			debug.assert(iNode != -1, "can't remove node from parent, node not found");

			//deleting node from parent list
			pParentBranch.takeAt(iNode);

			for (var i: uint = 0; i < 8; i++) {
				var pChildrens: IObjectList<IOcTreeNode> = pNode.childrenList[i];
				while (pChildrens.getLength() > 0) {
					var pChildNode: IOcTreeNode = pChildrens.pop();
					pChildNode.rearNodeLink = pParentNode;
					pParentBranch.push(pChildNode);
				}
			}

			pNode.level = 0;
			pNode.rearNodeLink = null;
			pNode.worldBounds.clear();

			this._pFreeNodePool.push(pNode);
		}

		_findObjects(pCamera: ICamera,
			pResultArray: IObjectArray<ISceneObject> = new util.ObjectArray<ISceneObject>(),
			bFastSearch: boolean = false): IObjectArray<ISceneObject> {

			//while we ignore second parametr
			//don't have normal implementation

			pResultArray.clear();

			if (!isDef(pCamera.getFrustum())) {
				this._buildSearchResultsByRect(pCamera.getSearchRect(), this._pHead, pResultArray);
			}
			else {
				this._buildSearchResultsByRectAndFrustum(pCamera.getSearchRect(),
					pCamera.getFrustum(), this._pHead, pResultArray);
			}

			return pResultArray;
		}

		protected _buildSearchResultsByRect(pSearchRect: IRect3d, pNode: IOcTreeNode, pResultList: IObjectArray<ISceneObject>) {
			var pNodeRect: IRect3d = pNode.worldBounds;

			var kResult: EVolumeClassifications = geometry.classify.rect3d(pSearchRect, pNodeRect);

			if (kResult == EVolumeClassifications.B_CONTAINS_A
				|| kResult == EVolumeClassifications.INTERSECTING) {

				//надо проводить дополнительные тесты

				var pMemberList: IObjectList<ISceneObject> = pNode.membersList;
					var pObject: ISceneObject = pMemberList.getFirst();
				while (isDefAndNotNull(pObject)) {
					if (geometry.intersect.rect3dRect3d(pSearchRect, pObject.getWorldBounds())) {
						pResultList.push(pObject);
					}
					pObject = pMemberList.next();
				}

				for (var i: int = 0; i < 8; i++) {
					var pChildrenList: IObjectList<IOcTreeNode> = pNode.childrenList[i];
					var pChildNode: IOcTreeNode = pChildrenList.getFirst();

					while (isDefAndNotNull(pChildNode)) {
						this._buildSearchResultsByRect(pSearchRect, pChildNode, pResultList);
						pChildNode = pChildrenList.next();
					}
				}
			}
			else if (kResult != EVolumeClassifications.NO_RELATION) {
				//объект полностью попал
				this._includeAllTreeSubbranch(pNode, pResultList);
			}
		}

		protected _buildSearchResultsByRectAndFrustum(pSearchRect: IRect3d, pFrustum: IFrustum,
			pNode: IOcTreeNode, pResultList: IObjectArray<ISceneObject>) {

			var pNodeRect: IRect3d = pNode.worldBounds;
			//var pChildRect: IRect3d;

			if (geometry.intersect.rect3dRect3d(pSearchRect, pNodeRect)) {
				var kTestResult: int = geometry.classify.frustumRect3d(pFrustum, pNodeRect);
				if (kTestResult == EVolumeClassifications.A_CONTAINS_B) {
					//объект полностью попал	
					this._includeAllTreeSubbranch(pNode, pResultList);
				}
				else if (kTestResult == EVolumeClassifications.INTERSECTING) {
					//объект попал частично
					var pMemberList: IObjectList<ISceneObject> = pNode.membersList;
					var pObject: ISceneObject = pMemberList.getFirst();
					while (isDefAndNotNull(pObject)) {
						if (pFrustum.testRect(pObject.getWorldBounds())) {
							pResultList.push(pObject);
						}
						pObject = pMemberList.next();
					}

					for (var i: int = 0; i < 8; i++) {
						//TODO: test by child rect
						var pChildrenList: IObjectList<IOcTreeNode> = pNode.childrenList[i];
						var pChildNode: IOcTreeNode = pChildrenList.getFirst();
						while (isDefAndNotNull(pChildNode)) {
							this._buildSearchResultsByRectAndFrustum(pSearchRect, pFrustum, pChildNode, pResultList);
							pChildNode = pChildrenList.next();
						}
					}
				}
			}
		}

		protected _includeAllTreeSubbranch(pNode: IOcTreeNode, pResultList: IObjectArray<ISceneObject>) {
			//console.warn("----------------> including all subbranch <------------------");
			var pMemberList: IObjectList<ISceneObject> = pNode.membersList;
			var pObject: ISceneObject = pMemberList.getFirst();

			while (isDefAndNotNull(pObject)) {
				pResultList.push(pObject);
				pObject = pMemberList.next();
			}

			for (var i: int = 0; i < 8; i++) {
				var pChildrenList: IObjectList<IOcTreeNode> = pNode.childrenList[i];
				var pChildNode: IOcTreeNode = pChildrenList.getFirst();

				while (isDefAndNotNull(pChildNode)) {
					this._includeAllTreeSubbranch(pChildNode, pResultList);
					pChildNode = pChildrenList.next();
				}
			}
		}

		protected attachObject(pNode: ISceneNode): void {
			if (SceneObject.isSceneObject(pNode)) {
				var pOcTreeNode: IOcTreeNode = this.findTreeNode(<ISceneObject>pNode);
				pOcTreeNode.addMember(<ISceneObject>pNode);
			}
		}

		protected detachObject(pNode: ISceneNode): void {
			if (SceneObject.isSceneObject(pNode)) {
				var pOcTreeNode: IOcTreeNode = this.findTreeNode(<ISceneObject>pNode);
				pOcTreeNode.removeMember(<ISceneObject>pNode);
			}
		}

		_toSimpleObject(pNode: IOcTreeNode = this._pHead): any {

			var pResult: any = {}
			pResult.members = [];
			pResult.childrens = new Array(8);
			for (var i: int = 0; i < 8; i++) {
				pResult.childrens[i] = [];
			}
			pResult.level = pNode.level;
			pResult.index = pNode.index;
			pResult.worldBounds = pNode.worldBounds.toString();


			var pMemberList: IObjectList<ISceneObject> = pNode.membersList;
			var pObject: ISceneObject = pMemberList.getFirst();
			while (isDefAndNotNull(pObject)) {
				pResult.members.push(pObject.getWorldBounds().toString());
				pObject = pMemberList.next();
			}

			for (var i: int = 0; i < 8; i++) {
				var pList: IObjectList<IOcTreeNode> = pNode.childrenList[i];
				var pChildNode: IOcTreeNode = pList.getFirst();

				while (isDefAndNotNull(pChildNode)) {
					pResult.childrens[i].push(this._toSimpleObject(pChildNode));
					pChildNode = pList.next();
				}
			}

			return pResult;
		}
	}
}

