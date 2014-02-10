/// <reference path="../idl/IOcTree.ts" />
/// <reference path="../idl/IFrustum.ts" />
/// <reference path="../idl/IRect3d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../common.ts" />
    /// <reference path="../math/Vec3.ts" />
    /// <reference path="../geometry/classify/classify.ts" />
    /// <reference path="../geometry/intersect/intersect.ts" />
    /// <reference path="DisplayList.ts" />
    /// <reference path="OcTreeNode.ts" />
    (function (scene) {
        var Vec3 = akra.math.Vec3;

        var EOcTreeConstants;
        (function (EOcTreeConstants) {
            EOcTreeConstants[EOcTreeConstants["k_MinimumTreeDepth"] = 0] = "k_MinimumTreeDepth";
            EOcTreeConstants[EOcTreeConstants["k_MaximumTreeDepth"] = 10] = "k_MaximumTreeDepth";
        })(EOcTreeConstants || (EOcTreeConstants = {}));

        var OcTree = (function (_super) {
            __extends(OcTree, _super);
            /**
            * Список байтовых ректов ректа камеры для тестов объектов.
            */
            //protected _pTestLocalRect: IOcTreeRect[] = null;
            function OcTree() {
                _super.call(this, "OcTree");
                /** List of OcTreeNodes on each level */
                //protected _ppLevelNodes: IOcTreeNode[][] = null;
                /** First node in list of all nodes */
                //protected _pFirstNode: IOcTreeNode = null;
                this._pHead = null;
                /** Size of world bounding box */
                this._v3fWorldExtents = new Vec3();
                /** Negate min point of bounding box */
                this._v3fWorldScale = new Vec3();
                /** Value of relation between (1024,1024,1024) and bounding box size */
                this._v3fWorldOffset = new Vec3();
                /** Maximum depth of tree. Value set when you call OcTree::create() */
                this._iDepth = 0;
                //protected _iSize: int = 0;//2^iDepth;
                /**
                * Список свободных узлов(объектов OcTreeNode).
                * Необходимо для экономии ресурсов памяти и чтобы не делать лишних delete
                */
                this._pFreeNodePool = null;
            }
            OcTree.prototype.getDepth = function () {
                return this._iDepth;
            };

            OcTree.prototype.getWorldScale = function () {
                return this._v3fWorldScale;
            };

            OcTree.prototype.getWorldOffset = function () {
                return this._v3fWorldOffset;
            };

            /**
            * Create
            */
            OcTree.prototype.create = function (pWorldBoundingBox, iDepth, nNodes) {
                if (typeof nNodes === "undefined") { nNodes = 64; }
                var v3fTemp = Vec3.temp();
                var i = 0;

                akra.debug.assert(!this.isReady(), "the Oc tree has already been created");
                akra.debug.assert(iDepth >= 0 /* k_MinimumTreeDepth */ && iDepth <= 10 /* k_MaximumTreeDepth */, "invalid tree depth");

                this._iDepth = iDepth;

                this._v3fWorldExtents.set(pWorldBoundingBox.size(v3fTemp));

                this._v3fWorldOffset.set(pWorldBoundingBox.minPoint(v3fTemp).negate());

                var iSize = 1 << iDepth;

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
                this._pHead = new akra.scene.OcTreeRootNode(this);
                this._pHead.level = 0;

                this._pFreeNodePool = new Array();

                for (i = 0; i < nNodes; ++i) {
                    this._pFreeNodePool.push(new akra.scene.OcTreeNode(this));
                }
            };

            /**
            * is any levels of tree are availeable(some object in a tree)
            */
            OcTree.prototype.isReady = function () {
                if (this._iDepth > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            /**
            * find node
            */
            OcTree.prototype.findTreeNode = function (pObject) {
                var pRect = pObject.getWorldBounds();
                var iX0 = pRect.x0, iX1 = pRect.x1, iY0 = pRect.y0, iY1 = pRect.y1, iZ0 = pRect.z0, iZ1 = pRect.z1;

                var v3fWorldOffset = this._v3fWorldOffset;
                var v3fWorldScale = this._v3fWorldScale;

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

                //round it
                iX0 = akra.math.floor(iX0);
                iX1 = akra.math.ceil(iX1);
                iY0 = akra.math.floor(iY0);
                iY1 = akra.math.ceil(iY1);
                iZ0 = akra.math.floor(iZ0);
                iZ1 = akra.math.ceil(iZ1);

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
                var pNode = this.findTreeNodeByRect(iX0, iX1, iY0, iY1, iZ0, iZ1);

                return pNode;
            };

            /**
            * Find tree node by Rect
            */
            OcTree.prototype.findTreeNodeByRect = function (iX0, iX1, iY0, iY1, iZ0, iZ1) {
                var nMax = (1 << this._iDepth);

                if (iX0 < 0 || iX1 > nMax || iY0 < 0 || iY1 > nMax || iZ0 < 0 || iZ1 > nMax) {
                    return this._pHead;
                }

                var iDepth = this._iDepth;
                var iLevel;

                ///////////////////////////
                iLevel = this._findNodeLevel(iX0, iX1, iY0, iY1, iZ0, iZ1);

                // console.warn(iLevel);
                ///////////////////////////
                if (iLevel == 0) {
                    return this._pHead;
                }

                var iComposedIndex;
                var iShift = iDepth - iLevel;
                iComposedIndex = (iX0 >> (iDepth - iLevel)) << (2 * iDepth + iShift);

                // console.log(iComposedIndex);
                iComposedIndex += (iY0 >> (iDepth - iLevel)) << (iDepth + iShift);

                // console.log(iComposedIndex);
                iComposedIndex += (iZ0 >> (iDepth - iLevel)) << (iShift);

                var iWay;

                var pParentNode, pNode;
                pParentNode = this._pHead;
                pNode = null;

                var iX, iY, iZ;

                var i = 0;
                while (i < iLevel) {
                    iX = (iX0 >> (iDepth - i - 1)) & 1;
                    iY = (iY0 >> (iDepth - i - 1)) & 1;
                    iZ = (iZ0 >> (iDepth - i - 1)) & 1;

                    iWay = 4 * iX + 2 * iY + iZ;

                    var pNodeList = pParentNode.childrenList[iWay];

                    if (pNodeList.getLength() === 0) {
                        pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
                        pNodeList.push(pNode);
                        return pNode;
                    }

                    var iPosition = 0;
                    var pTestNode = pNodeList.getFirst();

                    var iTestMask = (iDepth >= i + 2) ? 1 << (iDepth - i - 2) : 0;

                    var iMask = (iTestMask << (2 * iDepth)) + (iTestMask << iDepth) + iTestMask;

                    var pParentNodeOld = pParentNode;

                    while (akra.isDefAndNotNull(pTestNode)) {
                        var iTestNodeIndex = pTestNode.index;

                        var iResult1 = iTestNodeIndex & iMask;
                        var iResult2 = iComposedIndex & iMask;

                        if (iResult1 === iResult2) {
                            if (pTestNode.level === iLevel && iTestNodeIndex == iComposedIndex) {
                                return pTestNode;
                            } else if (pTestNode.level < iLevel && this._parentTest(pTestNode.level, iTestNodeIndex, iComposedIndex)) {
                                pParentNode = pTestNode;
                                i = pTestNode.level;
                                break;
                            } else if (pTestNode.level > iLevel && this._parentTest(iLevel, iComposedIndex, iTestNodeIndex)) {
                                //alert("" + <string><any>pTestNode.level + "  " + <string><any>iLevel);
                                if (pNode === null) {
                                    pNode = this.getAndSetFreeNode(iLevel, iComposedIndex, pParentNode);
                                    pParentNode.childrenList[iWay].push(pNode);
                                    i = iLevel;
                                }

                                var iShift = iDepth - i - 1;

                                iX = (iTestNodeIndex >> (2 * iDepth + iShift)) & 1;
                                iY = (iTestNodeIndex >> (iDepth + iShift)) & 1;
                                iZ = (iTestNodeIndex >> iShift) & 1;

                                var iTestWay = 4 * iX + 2 * iY + iZ;

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
            };

            OcTree.prototype._parentTest = function (iLevel, iParentIndex, iChildIndex) {
                var iDepth = this._iDepth;

                var iTmp = (1 << iDepth) - (1 << (iDepth - iLevel));
                var iMask = (iTmp << (2 * iDepth)) + (iTmp << iDepth) + iTmp;

                if ((iParentIndex & iMask) == (iChildIndex & iMask)) {
                    return true;
                }
                return false;
            };

            OcTree.prototype._findNodeLevel = function (iX0, iX1, iY0, iY1, iZ0, iZ1) {
                var iLengthX = iX1 - iX0;
                var iLengthY = iY1 - iY0;
                var iLengthZ = iZ1 - iZ0;

                var iLength = akra.math.max(iLengthX, akra.math.max(iLengthY, iLengthZ));

                //maximum possible level
                var iLevel = this._iDepth - akra.math.floor(akra.math.log(iLength) / akra.math.LN2);

                while (iLevel > 0) {
                    var iPitch = 1 << (this._iDepth - iLevel);
                    var iTest1, iTest2;

                    //first test for x then for y and z
                    var i;
                    for (i = 0; i < 3; i++) {
                        iTest1 = akra.math.floor(arguments[2 * i] / iPitch);
                        iTest2 = akra.math.floor(arguments[2 * i + 1] / iPitch);

                        if (iTest1 != iTest2) {
                            if ((iTest1 + 1) == iTest2) {
                                if ((arguments[2 * i + 1] % iPitch) != 0) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    if (i != 3) {
                        iLevel--;
                    } else {
                        break;
                    }
                }
                return iLevel;
            };

            /**
            * Get free node.
            * Get it from _pFreeNodePull or create new OcTreeNode if it`s empty and set his data.
            */
            OcTree.prototype.getAndSetFreeNode = function (iLevel, iComposedIndex, pParentNode) {
                var pNode = this._pFreeNodePool.pop();
                if (!akra.isDefAndNotNull(pNode)) {
                    pNode = new akra.scene.OcTreeNode(this);
                }

                var iDepth = this._iDepth;
                var iMask = (1 << this._iDepth) - 1;
                var iIndexX = (iComposedIndex >> (2 * iDepth)) & iMask;
                var iIndexY = (iComposedIndex >> (iDepth)) & iMask;
                var iIndexZ = iComposedIndex & iMask;
                var iSize = 1 << (this._iDepth - iLevel);

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
            };

            /**
            * Delete node from tree
            */
            OcTree.prototype.deleteNodeFromTree = function (pNode) {
                var pParentNode = pNode.rearNodeLink;

                akra.debug.assert(pNode.membersList.getLength() == 0, "list members of node don't empty");

                var iDepth = this._iDepth;
                var iParentLevel = pParentNode.level;
                var iIndex = pNode.index;
                var iShift = iDepth - iParentLevel - 1;

                var iX = (iIndex >> (2 * iDepth + iShift)) & 1;
                var iY = (iIndex >> (iDepth + iShift)) & 1;
                var iZ = (iIndex >> iShift) & 1;

                var iWay = 4 * iX + 2 * iY + iZ;

                var pParentBranch = pParentNode.childrenList[iWay];

                //console.log('iWay ------------>', iWay);
                var iNode = pParentBranch.indexOf(pNode);

                akra.debug.assert(iNode != -1, "can't remove node from parent, node not found");

                //deleting node from parent list
                pParentBranch.takeAt(iNode);

                for (var i = 0; i < 8; i++) {
                    var pChildrens = pNode.childrenList[i];
                    while (pChildrens.getLength() > 0) {
                        var pChildNode = pChildrens.pop();
                        pChildNode.rearNodeLink = pParentNode;
                        pParentBranch.push(pChildNode);
                    }
                }

                pNode.level = 0;
                pNode.rearNodeLink = null;
                pNode.worldBounds.clear();

                this._pFreeNodePool.push(pNode);
            };

            OcTree.prototype._findObjects = function (pCamera, pResultArray, bFastSearch) {
                if (typeof pResultArray === "undefined") { pResultArray = new akra.util.ObjectArray(); }
                if (typeof bFastSearch === "undefined") { bFastSearch = false; }
                //while we ignore second parametr
                //don't have normal implementation
                pResultArray.clear();

                if (!akra.isDef(pCamera.getFrustum())) {
                    this._buildSearchResultsByRect(pCamera.getSearchRect(), this._pHead, pResultArray);
                } else {
                    this._buildSearchResultsByRectAndFrustum(pCamera.getSearchRect(), pCamera.getFrustum(), this._pHead, pResultArray);
                }

                return pResultArray;
            };

            OcTree.prototype._buildSearchResultsByRect = function (pSearchRect, pNode, pResultList) {
                var pNodeRect = pNode.worldBounds;

                var kResult = akra.geometry.classify.rect3d(pSearchRect, pNodeRect);

                if (kResult == 3 /* B_CONTAINS_A */ || kResult == 4 /* INTERSECTING */) {
                    //надо проводить дополнительные тесты
                    var pMemberList = pNode.membersList;
                    var pObject = pMemberList.getFirst();
                    while (akra.isDefAndNotNull(pObject)) {
                        if (akra.geometry.intersect.rect3dRect3d(pSearchRect, pObject.getWorldBounds())) {
                            pResultList.push(pObject);
                        }
                        pObject = pMemberList.next();
                    }

                    for (var i = 0; i < 8; i++) {
                        var pChildrenList = pNode.childrenList[i];
                        var pChildNode = pChildrenList.getFirst();

                        while (akra.isDefAndNotNull(pChildNode)) {
                            this._buildSearchResultsByRect(pSearchRect, pChildNode, pResultList);
                            pChildNode = pChildrenList.next();
                        }
                    }
                } else if (kResult != 0 /* NO_RELATION */) {
                    //объект полностью попал
                    this._includeAllTreeSubbranch(pNode, pResultList);
                }
            };

            OcTree.prototype._buildSearchResultsByRectAndFrustum = function (pSearchRect, pFrustum, pNode, pResultList) {
                var pNodeRect = pNode.worldBounds;

                //var pChildRect: IRect3d;
                if (akra.geometry.intersect.rect3dRect3d(pSearchRect, pNodeRect)) {
                    var kTestResult = akra.geometry.classify.frustumRect3d(pFrustum, pNodeRect);
                    if (kTestResult == 2 /* A_CONTAINS_B */) {
                        //объект полностью попал
                        this._includeAllTreeSubbranch(pNode, pResultList);
                    } else if (kTestResult == 4 /* INTERSECTING */) {
                        //объект попал частично
                        var pMemberList = pNode.membersList;
                        var pObject = pMemberList.getFirst();
                        while (akra.isDefAndNotNull(pObject)) {
                            if (pFrustum.testRect(pObject.getWorldBounds())) {
                                pResultList.push(pObject);
                            }
                            pObject = pMemberList.next();
                        }

                        for (var i = 0; i < 8; i++) {
                            //TODO: test by child rect
                            var pChildrenList = pNode.childrenList[i];
                            var pChildNode = pChildrenList.getFirst();
                            while (akra.isDefAndNotNull(pChildNode)) {
                                this._buildSearchResultsByRectAndFrustum(pSearchRect, pFrustum, pChildNode, pResultList);
                                pChildNode = pChildrenList.next();
                            }
                        }
                    }
                }
            };

            OcTree.prototype._includeAllTreeSubbranch = function (pNode, pResultList) {
                //console.warn("----------------> including all subbranch <------------------");
                var pMemberList = pNode.membersList;
                var pObject = pMemberList.getFirst();

                while (akra.isDefAndNotNull(pObject)) {
                    pResultList.push(pObject);
                    pObject = pMemberList.next();
                }

                for (var i = 0; i < 8; i++) {
                    var pChildrenList = pNode.childrenList[i];
                    var pChildNode = pChildrenList.getFirst();

                    while (akra.isDefAndNotNull(pChildNode)) {
                        this._includeAllTreeSubbranch(pChildNode, pResultList);
                        pChildNode = pChildrenList.next();
                    }
                }
            };

            OcTree.prototype.attachObject = function (pNode) {
                if (akra.scene.SceneObject.isSceneObject(pNode)) {
                    var pOcTreeNode = this.findTreeNode(pNode);
                    pOcTreeNode.addMember(pNode);
                }
            };

            OcTree.prototype.detachObject = function (pNode) {
                if (akra.scene.SceneObject.isSceneObject(pNode)) {
                    var pOcTreeNode = this.findTreeNode(pNode);
                    pOcTreeNode.removeMember(pNode);
                }
            };

            OcTree.prototype._toSimpleObject = function (pNode) {
                if (typeof pNode === "undefined") { pNode = this._pHead; }
                var pResult = {};
                pResult.members = [];
                pResult.childrens = new Array(8);
                for (var i = 0; i < 8; i++) {
                    pResult.childrens[i] = [];
                }
                pResult.level = pNode.level;
                pResult.index = pNode.index;
                pResult.worldBounds = pNode.worldBounds.toString();

                var pMemberList = pNode.membersList;
                var pObject = pMemberList.getFirst();
                while (akra.isDefAndNotNull(pObject)) {
                    pResult.members.push(pObject.getWorldBounds().toString());
                    pObject = pMemberList.next();
                }

                for (var i = 0; i < 8; i++) {
                    var pList = pNode.childrenList[i];
                    var pChildNode = pList.getFirst();

                    while (akra.isDefAndNotNull(pChildNode)) {
                        pResult.childrens[i].push(this._toSimpleObject(pChildNode));
                        pChildNode = pList.next();
                    }
                }

                return pResult;
            };
            return OcTree;
        })(akra.scene.DisplayList);
        scene.OcTree = OcTree;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=OcTree.js.map
