/**
 * @file
 * @brief functions and classes to OcTree
 * @author sss
 *
 * Classes reload:
 * OcTree,
 * OcTreeRect,
 * OcTreeNode,
 */

/**
 * OcTree class
 * @ctor
 * Constructor.
 */
function OcTree () {
    Enum([
             k_minimumTreeDepth = 1,
             k_maximumTreeDepth = 11
         ], OCTREE_CONSTANTS, a.Tree);
    /**
     * List of OcTreeNodes on each level
     * @type Array<Array<OcTreeNode||Int>>(k_maximumTreeDepth)
     * @private
     */
    this._ppLevelNodes = null;
    /**
     * First node in list of all nodes
     * @type OcTreeNode
     * @private
     */
    this.pFirstNode = null;
    /**
     * Size of world bounding box
     * @type Float32Array
     * @private
     */
    this._v3fWorldExtents = new Vec3;
    /**
     * Negate min point of bounding box
     * @type Float32Array
     * @private
     */
    this._v3fWorldScale = new Vec3;
    /**
     * Value of relation between (1024,1024,1024) and bounding box size
     * @type Float32Array
     * @private
     */
    this._v3fWorldOffset = new Vec3;
    /**
     * Maximum depth of tree. Value set when you call OcTree::create()
     * @type Float32Array
     * @private
     */
    this._iDepth = 0;
    /**
     * Список свободных услов(объектов OcTreeNode). Необходимо для экономии ресурсов памяти и чтобы не делать лишних delete
     * @type Array<OcTreeNode>
     * @private
     */
    this._pFreeNodePool = null;
    /**
     * Список байтовых ректов ректа камеры для тестов объектов
     * @type Array<OcTreeRect>
     * @private
     */
    this.pTestLocalRect = null;
}
;
/**
 * Get free node. Get it from _pFreeNodePull or create new OcTreeNode if it`s empty and set his data
 * @tparam Int iLevel
 * @tparam Int iX
 * @tparam Int iY
 * @tparam Int iZ
 * @tparam Int iIndex
 * @treturn OcTreeNode
 */
OcTree.prototype.getAndSetFreeNode = function (iLevel, iX, iY, iZ, iIndex) {
    var pNode = this._pFreeNodePool.pop();
    if (!pNode) {
        pNode = new a.OcTreeNode(this);
    }
    pNode.iLevel = iLevel;
    pNode.iX = iX;
    pNode.iY = iY;
    pNode.iZ = iZ;
    pNode.iIndex = iIndex;
    pNode.pNodeTrueRect.clear();
    this._ppLevelNodes[iLevel][iIndex] = pNode;

    if (this.pFirstNode) {
        this.pFirstNode.pRearNodeLink = pNode;
    }

    pNode.pForwardNodeLink = this.pFirstNode;
    pNode.pRearNodeLink = null;
    this.pFirstNode = pNode;
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
 * is any levels of tree are availeable(some object in a tree)
 * @treturn Boolean
 */
OcTree.prototype.isReady = function () {
    return this._iDepth && this._ppLevelNodes;
};
/**
 * Getter for OcTreeNode by level and x, y, z
 * @tparam Int iLevel
 * @tparam Int iIndex
 * @treturn OcTreeNode
 */
OcTree.prototype.getNodeFromLevelXYZ = function (iLevel, iIndex) {
    debug_assert(this.isReady(), "the Oc tree has not been created");
    if (iLevel >= 0 && iLevel < this._iDepth) {
        return this._ppLevelNodes[iLevel][iIndex];
    }
    return -1;
};
/**
 * Create
 * @tparam Rect3d pWorldBoundingBox
 * @tparam Int iDepth
 * @tparam Int nNode Number of precreated OcTreeNodes
 */
OcTree.prototype.create = function (pWorldBoundingBox, iDepth, nNode) {

    debug_assert(!this.isReady(), "the Oc tree has already been created");
    debug_assert(iDepth >= a.Tree.k_minimumTreeDepth, "invalid tree iDepth");
    debug_assert(iDepth <= a.Tree.k_maximumTreeDepth, "invalid tree iDepth");

    this._iDepth = iDepth;
    var v3fTemp;
    v3fTemp = pWorldBoundingBox.size();
    this._v3fWorldExtents.set(v3fTemp);
    v3fTemp = pWorldBoundingBox.minPoint().negate();
    this._v3fWorldOffset.set(v3fTemp);

    this._v3fWorldScale.X = 1024.0 / this._v3fWorldExtents.X;
    this._v3fWorldScale.Y = 1024.0 / this._v3fWorldExtents.Y;
    this._v3fWorldScale.Z = 1024.0 / this._v3fWorldExtents.Z;

    // allocate the nodes
    this._ppLevelNodes = new Array(iDepth);
    var i = 0;
    for (i = 0; i < iDepth; ++i) {
        this._ppLevelNodes[i] = new Array();
    }

    this.pTestLocalRect = new Array(iDepth);
    for (i = 0; i < iDepth; ++i) {
        this.pTestLocalRect[i] = new OcTreeRect;
    }

    this._pFreeNodePool = new Array();
    var nodes = (arguments.length == 3) ? nNode : 10;
    for (i = 0; i < nodes; ++i) {
        this._pFreeNodePool.push(new a.OcTreeNode(this));
    }
};
/**
 * Destroy tree and all nodes in tree. Set _iDepth to 0.
 */
OcTree.prototype.destroy = function () {
    var i;
    for (i = 0; i < this._iDepth; ++i) {
        delete this._ppLevelNodes[i];
    }
    delete this._ppLevelNodes;
    for (i = 0; i < this._pFreeNodePool.length; ++i) {
        delete this._pFreeNodePool[i];
    }
    delete this._pFreeNodePool;

    this._iDepth = 0;
};
/**
 * Find tree node by OcTreeRect
 * @tparam Int iX0
 * @tparam Int iX1
 * @tparam Int iY0
 * @tparam Int iY1
 * @tparam Int iZ0
 * @tparam Int iZ1
 * @treturn OcTreeNode
 */
OcTree.prototype.findTreeNode = function (iX0, iX1, iY0, iY1, iZ0, iZ1) {
    var level, levelX, levelY, levelZ;
    var xPattern = iX0 ^ iX1;
    var yPattern = iY0 ^ iY1;
    var zPattern = iZ0 ^ iZ1;

    var bitPattern = Math.max(zPattern, Math.max(xPattern, yPattern));
    var highBit = bitPattern ? Math.highestBitSet(bitPattern) + 1 : 0;

    level = a.Tree.k_maximumTreeDepth - highBit - 1;
    level = Math.min(level, this._iDepth - 1);

    var shift = a.Tree.k_maximumTreeDepth - level - 1;

    levelX = iX1 >> shift;
    levelY = iY1 >> shift;
    levelZ = iZ1 >> shift;

    var iIndex = ((levelZ << level) << level) + (levelY << level) + levelX;
    var pNode = this.getNodeFromLevelXYZ(level, iIndex);
    if (!pNode) {
        return this.getAndSetFreeNode(level, levelX, levelY, levelZ, iIndex);
    }
    return pNode;
};
/**
 * Build pByteRect from Rect3d
 * Convert to integer values, taking the floor of each real
 * @tparam Rect3d pWorldRect
 * @tparam OcTreeRect pWorldByteRect
 */
OcTree.prototype.buildByteRect = function (pWorldRect, pWorldByteRect) {
    pWorldByteRect.convert(pWorldRect, this._v3fWorldOffset, this._v3fWorldScale);
};
/**
 * Add or update SceneObject to node
 * @tparam SceneObject pNewNode
 */
OcTree.prototype.addOrUpdateSceneObject = function (pNewNode) {
    var pRect = pNewNode._pWorldBounds;
    var iX0 = pRect.fX0, iX1 = pRect.fX1,
        iY0 = pRect.fY0, iY1 = pRect.fY1,
        iZ0 = pRect.fZ0, iZ1 = pRect.fZ1;

    iX0 += this._v3fWorldOffset.X;
    iX1 += this._v3fWorldOffset.X;
    iY0 += this._v3fWorldOffset.Y;
    iY1 += this._v3fWorldOffset.Y;
    iZ0 += this._v3fWorldOffset.Z;
    iZ1 += this._v3fWorldOffset.Z;

    iX0 *= this._v3fWorldScale.X;
    iX1 *= this._v3fWorldScale.X;
    iY0 *= this._v3fWorldScale.Y;
    iY1 *= this._v3fWorldScale.Y;
    iZ0 *= this._v3fWorldScale.Z;
    iZ1 *= this._v3fWorldScale.Z;

    iX0 = iX0 << 0;
    iX1 = iX1 << 0;
    iY0 = iY0 << 0;
    iY1 = iY1 << 0;
    iZ0 = iZ0 << 0;
    iZ1 = iZ1 << 0;

    iX0 = Math.clamp(iX0, 0, 1022);
    iY0 = Math.clamp(iY0, 0, 1022);
    iZ0 = Math.clamp(iZ0, 0, 1022);

    iX1 = Math.clamp(iX1, iX0 + 1, 1023);
    iY1 = Math.clamp(iY1, iY0 + 1, 1023);
    iZ1 = Math.clamp(iZ1, iZ0 + 1, 1023);

    var pNode = this.findTreeNode(iX0, iX1, iY0, iY1, iZ0, iZ1);
    return (pNode.addOrUpdateMember(pNewNode));
};
/**
 * Delete node from tree
 * @tparam OcTreeNode node
 */
OcTree.prototype.deleteNodeFromTree = function (pNode) {
    if (pNode.pRearNodeLink) {
        pNode.pRearNodeLink.pForwardNodeLink = pNode.pForwardNodeLink;
    }
    if (pNode.pForwardNodeLink) {
        pNode.pForwardNodeLink.pRearNodeLink = pNode.pRearNodeLink;
    }
    if (this.pFirstNode == pNode) {
        this.pFirstNode = pNode.pForwardNodeLink;
    }

    var iLevel = pNode.iLevel;
//    var iX = pNode.iX;
//    var iY = pNode.iY;
//    var iZ = pNode.iZ;
    this._ppLevelNodes[iLevel][pNode.iIndex] = null;

    pNode.pForwardNodeLink = null;
    pNode.pRearNodeLink = null;
    this._pFreeNodePool.push(pNode);
};
/**
 * Test frustum
 * @tparam Rect3d pWorldRect
 * @tparam Frustum pOptionalFrustum
 * @treturn SceneObject
 */
OcTree.prototype.buildSearchResults = function (pWorldRect, pOptionalFrustum) {
    var pResultListStart = null; //SceneObject
    var pResultListEnd = null; //SceneObject
    var pByteRect = new OcTreeRect();
    this.buildByteRect(pWorldRect, pByteRect);

    var iLevel = 0;
    var iX, iY, iZ;
    var pLocalRect;

    var pObject = null;
    var pResult = new a.Rect3d();

    var pNode = null;
    var i;
    //Fill testlocalRect
    for (i = 0; i < this._iDepth; ++i) {
        var shift_count = 10 - i;
        this.pTestLocalRect[i].set(pByteRect.iX0 >> shift_count,
                                   pByteRect.iX1 >> shift_count,
                                   pByteRect.iY0 >> shift_count,
                                   pByteRect.iY1 >> shift_count,
                                   pByteRect.iZ0 >> shift_count,
                                   pByteRect.iZ1 >> shift_count);
    }
    //Test nodes
    for (pNode = this.pFirstNode; pNode; pNode = pNode.pForwardNodeLink) {
        iLevel = pNode.iLevel;
        iX = pNode.iX;
        iY = pNode.iY;
        iZ = pNode.iZ;
        pLocalRect = this.pTestLocalRect[iLevel];
        if (iY < pLocalRect.iY0 ||
            iY > pLocalRect.iY1 ||
            iX < pLocalRect.iX0 ||
            iX > pLocalRect.iX1 ||
            iZ < pLocalRect.iZ0 ||
            iZ > pLocalRect.iZ1) {
            continue;
        }
        if (iY == pLocalRect.iY0 ||
            iY == pLocalRect.iY1 ||
            iX == pLocalRect.iX0 ||
            iX == pLocalRect.iX1 ||
            iZ == pLocalRect.iZ0 ||
            iZ == pLocalRect.iZ1) {
            //Test node and objects
            pObject = null;
            if (!pOptionalFrustum) {
                for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
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
            for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
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
                for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
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
            for (pObject = pNode.pFirstMember; pObject; pObject = pObject._pForwardTreeLink) {
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

/**
 * @property OcTreeRect(OcTreeRect pSrc);
 * Constructor
 * @memberof OcTreeRect
 */
/**
 * @property OcTreeRect(Int x0, Int x1, Int y0, Int y1, Int z0, Int z1);
 * Constructor
 * @memberof OcTreeRect
 */
/**
 * OcTreeRect class represent simple 3d byte rect
 * @ctor
 * Constructor
 */
function OcTreeRect () {
    /**
     * x0
     * @type Int
     */
    this.iX0 = 0;
    /**
     * x1
     * @type Int
     */
    this.iX1 = 0;
    /**
     * y0
     * @type Int
     */
    this.iY0 = 0;
    /**
     * y1
     * @type Int
     */
    this.iY1 = 0;
    /**
     * z0
     * @type Int
     */
    this.iZ0 = 0;
    /**
     * z1
     * @type Int
     */
    this.iZ1 = 0;
    switch (arguments.length) {
        case 1:
            this.iX0 = arguments[0].iX0;
            this.iX1 = arguments[0].iX1;
            this.iY0 = arguments[0].iY0;
            this.iY1 = arguments[0].iY1;
            this.iZ0 = arguments[0].iZ0;
            this.iZ1 = arguments[0].iZ1;
            break;
        case 6:
            this.iX0 = arguments[0];
            this.iX1 = arguments[1];
            this.iY0 = arguments[2];
            this.iY1 = arguments[3];
            this.iZ0 = arguments[4];
            this.iZ1 = arguments[5];
            break;
    }
    ;
}
;
/**
 * Convert Rect3d to byte rect
 * @tparam Rect3d pWorldRect
 * @tparam Float32Array v3fOffset
 * @tparam Float32Array v3fScale
 */
OcTreeRect.prototype.convert = function (pWorldRect, v3fOffset, v3fScale) {
    var convertedRect = new a.Rect3d(pWorldRect);
    // reposition and v3fScale world coordinates to OcTree coordinates
    convertedRect.addSelf(v3fOffset);
    convertedRect.multSelf(v3fScale);
    //alert([convertedRect.iX0,convertedRect.iY0,convertedRect.iZ0,convertedRect.iX1,convertedRect.iY1,convertedRect.iZ1]);
    // reduce by a tiny amount to handle tiled data
    convertedRect.fX1 = Math.max(convertedRect.fX1 - 0.01, convertedRect.fX0);
    convertedRect.fY1 = Math.max(convertedRect.fY1 - 0.01, convertedRect.fY0);
    convertedRect.fZ1 = Math.max(convertedRect.fZ1 - 0.01, convertedRect.fZ0);

    // convert to integer values, taking the floor of each real
    this.iX0 = convertedRect.fX0 << 0;
    this.iX1 = convertedRect.fX1 << 0;
    this.iY0 = convertedRect.fY0 << 0;
    this.iY1 = convertedRect.fY1 << 0;
    this.iZ0 = convertedRect.fZ0 << 0;
    this.iZ1 = convertedRect.fZ1 << 0;
    // we must be positive
    this.iX0 = Math.clamp(this.iX0, 0, 1022);
    this.iY0 = Math.clamp(this.iY0, 0, 1022);
    this.iZ0 = Math.clamp(this.iZ0, 0, 1022);

    // we must be at least one unit large
    this.iX1 = Math.clamp(this.iX1, this.iX0 + 1, 1023);
    this.iY1 = Math.clamp(this.iY1, this.iY0 + 1, 1023);
    this.iZ1 = Math.clamp(this.iZ1, this.iZ0 + 1, 1023);
};
/**
 * Set
 * @tparam Int iX0
 * @tparam Int iX1
 * @tparam Int iY0
 * @tparam Int iY1
 * @tparam Int iZ0
 * @tparam Int iZ1
 */
OcTreeRect.prototype.set = function (iX0, iX1, iY0, iY1, iZ0, iZ1) {
    this.iX0 = iX0;
    this.iX1 = iX1;
    this.iY0 = iY0;
    this.iY1 = iY1;
    this.iZ0 = iZ0;
    this.iZ1 = iZ1;
};

/**
 * @property OcTreeNode(Int iLevel, Int iX, Int iY, Int iZ, Int nChildren);
 * Constructor
 * @memberof OcTreeRect
 */
/**
 * OcTreeNode class represent node of OcTree
 * @ctor
 * Constructor
 */
function OcTreeNode (pTree) {
    /**
     * Parent tree
     * @type OcTree
     */
    this.pTree = pTree;
    /**
     * Level of node
     * @type Int
     */
    this.iLevel = 0;
    /**
     * Byte x-coord of node
     * @type Int
     */
    this.iX = 0;
    /**
     * Byte y-coord of node
     * @type Int
     */
    this.iY = 0;
    /**
     * Byte z-coord of node
     * @type Int
     */
    this.iZ = 0;
    /**
     * Index in array of nodes in tree
     * @type Int
     */
    this.iIndex = 0;
    /**
     * First SceneObject in this node
     * @type SceneObject
     * @private
     */
    this.pFirstMember = null;
    /**
     * Rect of node in real world
     * @type Rect3d
     * @private
     */
    this.pNodeTrueRect = new Rect3d();
    /**
     * Link ro next node in tree
     * @type OcTreeNode
     * @private
     */
    this.pForwardNodeLink = null;
    /**
     * Link ro previous node in tree
     * @type OcTreeNode
     * @private
     */
    this.pRearNodeLink = null;
    /**
     * Link ro parent node in tree
     * @type OcTreeNode
     * @private
     */
//    this.pParentNode = null;
    /**
     * Link ro sibling node(nodes has same parent) in tree
     * @type OcTreeNode
     * @private
     */
//    this.pSiblingNode = null;
    /**
     * Link ro children node in tree
     * @type OcTreeNode
     * @private
     */
//    this.pChildrenNode = null;

    if (arguments.length == 4) {
        this.iLevel = arguments[0];
        this.iX = arguments[1];
        this.iY = arguments[2];
        this.iZ = arguments[3];
    }
}
;
/**
 * Add or update object in this node
 * @tparam SceneObject pMember
 */
OcTreeNode.prototype.addOrUpdateMember = function (pMember) {
    // is this node not already a pMember?
    if (pMember._pOcTreeNode != this) {
        // remove the pMember from it's previous Oc tree node (if any)
        if (pMember._pOcTreeNode) {
            pMember._pOcTreeNode.removeMember(pMember);
        }
        // account for the new addition
        if (!this.pFirstMember) {
            this.pFirstMember = pMember;
        }
        else {
            // prepend this pMember to our list
            pMember._pRearTreeLink = null;
            pMember._pForwardTreeLink = this.pFirstMember;
            this.pFirstMember._pRearTreeLink = pMember;
            this.pFirstMember = pMember;
        }
        pMember._pOcTreeNode = this;
    }
};
/**
 * Remove member object from node and release node if there are not members in it
 * @tparam SceneObject pMember
 */
OcTreeNode.prototype.removeMember = function (pMember) {
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
    if (this.pFirstMember == pMember) {
        this.pFirstMember = pMember._pForwardTreeLink;
    }
    // clear the former members links
    pMember._pRearTreeLink = null;
    pMember._pForwardTreeLink = null;
    pMember._pOcTreeNode = null;
    if (!this.pFirstMember) {
        pMember._pOcTree.deleteNodeFromTree(this);
    }
};
/**
 * Calculate real rect(in world coords) of node
 */
OcTreeNode.prototype.nodeCoords = function () {
    var w = 1 << (10 - this.iLevel);
    this.pNodeTrueRect.fX0 = this.iX * w;
    this.pNodeTrueRect.fX1 = (this.iX + 1) * w;
    this.pNodeTrueRect.fY0 = this.iY * w;
    this.pNodeTrueRect.fY1 = (this.iY + 1) * w;
    this.pNodeTrueRect.fZ0 = this.iZ * w;
    this.pNodeTrueRect.fZ1 = (this.iZ + 1) * w;
    this.pNodeTrueRect.divSelf(this.pTree._v3fWorldScale);
    this.pNodeTrueRect.subSelf(this.pTree._v3fWorldOffset);
    /*
     this.pNodeTrueRect.fX0 = (this.pNodeTrueRect.fX0 + 1)<<0;
     this.pNodeTrueRect.fX1 = (this.pNodeTrueRect.fX1 + 1)<<0;
     this.pNodeTrueRect.fY0 = (this.pNodeTrueRect.fY0 + 1)<<0;
     this.pNodeTrueRect.fY1 = (this.pNodeTrueRect.fY1 + 1)<<0;
     this.pNodeTrueRect.fZ0 = (this.pNodeTrueRect.fZ0 + 1)<<0;
     this.pNodeTrueRect.fZ1 = (this.pNodeTrueRect.fZ1 + 1)<<0;
     */
};

a.OcTree = OcTree;
a.OcTreeNode = OcTreeNode;
a.OcTreeRect = OcTreeRect;