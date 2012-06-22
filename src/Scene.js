/**
 * @file
 * @brief functions and classes to Scene
 * @author sss
 *
 * Classes reload:
 * cSceneNode,
 * cSubNodeGroup,
 * cOrientation,
 * cSceneObject,
 */
var TEMPSCENEVECTOR3FORCALC0 = Vec3.create();
var TEMPSCENEMATRIX4FORCALC0 = Mat4.create();

/**
 * Scene node Class
 * @extends ReferenceCounter
 * @ctor
 * Constructor.
 * The constructor initializes all papams for SceneNode
 */
function SceneNode (pEngine) {
    Enum([
             k_setForDestruction = 0,
             k_newLocalMatrix,
             k_newWorldMatrix,
             k_rebuildInverseWorldMatrix,
             k_rebuildWorldVectors,
             k_ignoreOrientation
         ], eUpdateDataFlagBits, a.Scene);
    Enum([
             k_inheritPositionOnly = 0,
             k_inheritRotScaleOnly,
             k_inheritAll
         ], eInheritance, a.Scene);

    debug_assert(pEngine, "SceneNode. Engine не передан");

    this._pEngine = pEngine;
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m4fLocalMatrix = Mat4.create();
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m4fWorldMatrix = Mat4.create();
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m4fInverseWorldMatrix = Mat4.create();
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m3fNormalMatrix = Mat3.create();
    /**
     * Bit flag
     * @private
     * @type Int
     */
    this._iUpdateFlags = 0;
    /**
     * Pointer to the parent node
     * @private
     * @type SceneNode
     */
    this._pParent = null;
    /**
     * pointer to the sibling of this node
     * @private
     * @type SceneNode
     */
    this._pSibling = null;
    /**
     * Pointer to the child
     * @private
     * @type SceneNode
     */
    this._pChild = null;
    /**
     * Pointer to sub node group
     * @private
     * @type SubNodeGroup
     */
    this._pSubNodeGroupData = null;
    /**
     * Pointer to sub node group owner
     * @private
     * @type SceneNode
     */
    this._pSubNodeGroupOwner = null;
    /**
     * Inheritance from  eInheritance
     * @private
     * @type Int
     */
    this._iInheritance = 0;
    /**
     * World Posistion
     * @private
     * @type Float32Array
     */
    this._v3fWorldPosition = Vec3.create();
    /**
     * World Right
     * @private
     * @type Float32Array
     */
    this._v3fWorldRight = Vec3.create();
    /**
     * World up
     * @private
     * @type Float32Array
     */
    this._v3fWorldUp = Vec3.create();
    /**
     * World forward
     * @private
     * @type Float32Array
     */
    this._v3fWorldForward = Vec3.create();

    SceneNode.superclass.constructor.apply(this);
}

a.extend(SceneNode, a.ReferenceCounter);

/**
 * Get parent
 * @treturn SceneNode _pParent
 */
SceneNode.prototype.parent = function () {
    INLINE();
    return this._pParent;
};
/**
 * Get sibling
 * @treturn SceneNode _pSibling
 */
SceneNode.prototype.sibling = function () {
    INLINE();
    return this._pSibling;
};
/**
 * Get child
 * @treturn SceneNode _pChild
 */
SceneNode.prototype.child = function () {
    INLINE();
    return this._pChild;
};
/**
 * Get worldMatrix
 * @treturn Float32Array _m4fWorldMatrix
 */
SceneNode.prototype.worldMatrix = function () {
    INLINE();
    return this._m4fWorldMatrix;
};
/**
 * Get normal matrix
 * @treturn Matrix3 _m4fWorldMatrix
 */
SceneNode.prototype.normalMatrix = function () {
    INLINE();
    return Mat3.transpose(Mat4.toInverseMat3(this._m4fWorldMatrix, this._m3fNormalMatrix));
};

/**
 * Get localMatrix
 * @treturn Float32Array _m4fLocalMatrix
 */
SceneNode.prototype.localMatrix = function () {
    INLINE();
    return this._m4fLocalMatrix;
};
/**
 * Get inverseWorldMatrix
 * @treturn Float32Array _m4fInverseWorldMatrix
 */
SceneNode.prototype.inverseWorldMatrix = function () {
    INLINE();
    // if the inverse matrix is out of date, compute it now
    if (TEST_BIT(this._iUpdateFlags, a.Scene.k_rebuildInverseWorldMatrix)) {
        Mat4.inverse(this._m4fWorldMatrix, this._m4fInverseWorldMatrix);
        CLEAR_BIT(this._iUpdateFlags, a.Scene.k_rebuildInverseWorldMatrix);
    }
    return this._m4fInverseWorldMatrix;
};
/**
 * Get updateFlags
 * @treturn Int _iUpdateFlags
 */
SceneNode.prototype.updateFlags = function () {
    INLINE();
    return this._iUpdateFlags;
};
/**
 * Get SubNodeGroupData
 * @treturn SubNodeGroup _pSubNodeGroupData
 */
SceneNode.prototype.subNodeGroupData = function () {
    INLINE();
    return this._pSubNodeGroupData;
};
/**
 * Get subNodeGroupOwner
 * @treturn SceneNode _pSubNodeGroupOwner
 */
SceneNode.prototype.subNodeGroupOwner = function () {
    INLINE();
    return this._pSubNodeGroupOwner;
};
/**
 * Set subNodeGroupOwner
 * @tparam SceneNode pOwner
 */
SceneNode.prototype.setSubNodeGroupOwner = function (pOwner) {
    INLINE();
    this._pSubNodeGroupOwner = pOwner;
};
/**
 * Parent is not undef
 * @treturn Boolean
 */
SceneNode.prototype.hasParent = function () {
    INLINE();
    if (this._pParent) {
        return true;
    }
    return false;
};
/**
 * Child is not undef
 * @treturn Boolean
 */
SceneNode.prototype.hasChild = function () {
    INLINE();
    if (this._pChild) {
        return true;
    }
    return false;
};
/**
 * Sibling is not undef
 * @treturn Boolean
 */
SceneNode.prototype.hasSibling = function () {
    INLINE();
    if (this._pSibling) {
        return true;
    }
    return false;
};
/**
 * SET_BIT(_iUpdateFlags, k_newLocalMatrix);
 */
SceneNode.prototype.setUpdatedLocalMatrixFlag = function () {
    INLINE();
    SET_BIT(this._iUpdateFlags, a.Scene.k_newLocalMatrix);
};
/**
 * Get loclaMatrix with some set_bits
 * @treturn Float32Array _m4fLocalMatrix
 */
SceneNode.prototype.accessLocalMatrix = function () {
    INLINE();
    this.setUpdatedLocalMatrixFlag();
    SET_BIT(this._iUpdateFlags, a.Scene.k_ignoreOrientation);
    return this._m4fLocalMatrix;
};


/**
 * Test bit k_newWorldMatrix
 * @treturn Boolean
 */
SceneNode.prototype.isWorldMatrixNew = function () {
    INLINE();
    return TEST_BIT(this._iUpdateFlags, a.Scene.k_newWorldMatrix);
};
/**
 * Set Local and World Natrix identify
 * @treturn Boolean
 */
SceneNode.prototype.create = function () {
    //this._m4fLocalMatrix = Mat4.create();
    Mat4.identity(this._m4fLocalMatrix);
    //this._m4fWorldMatrix = Mat4.create();
    Mat4.identity(this._m4fWorldMatrix);
    //Mat4.identity(this._m4fInverseWorldMatrix);
    return true;
};
/**
 * Create from resource
 * @tparam Int iModelResource
 * @treturn Boolean
 */
SceneNode.prototype.createFromResource = function (iModelResource) {
    // dump any current animation data
    this.releaseGroupData();

    this._pSubNodeGroupData = new SubNodeGroup();
    if (this._pSubNodeGroupData.create(this, iModelResource)) {
        return true;
    }
    else {
        delete this._pSubNodeGroupData;
    }
    return false;
};
/**
 * Safe delete pSubNodeGroupData
 * @private
 */
SceneNode.prototype.releaseGroupData = function () {
    if (this._pSubNodeGroupData) {
        this._pSubNodeGroupData.destroy();
        delete this._pSubNodeGroupData;
    }
}

/**
 * Destroys the object. The object is removed from it's parent (if any) and all Children
 * Objects are orphaned (parent set to NULL).
 */
SceneNode.prototype.destroy = function () {
    // release any group information
    this.releaseGroupData();

    // destroy anything attached to this node
    //	destroySceneObject();
    // promote any children up to our parent
    this.promoteChildren();
    // now remove ourselves from our parent
    this.detachFromParent();
    // we should now be removed from the tree, and have no dependants
    debug_assert(this.referenceCount() == 0, "Attempting to delete a scene node which is still in use");
    debug_assert(this._pSibling == null, "Failure Destroying Node");
    debug_assert(this._pChild == null, "Failure Destroying Node");
    // clear pLink information
    this._pSubNodeGroupOwner = null;
};
/**
 * Sets the internal pointer to the First sibling object
 * @tparam SceneNode pNode
 * @private
 */
SceneNode.prototype.setSibling = function (pNode) {
    this._pSibling = pNode;
};
/**
 * Sets the internal pointer to the First child object
 * @tparam SceneNode pNode
 * @private
 */
SceneNode.prototype.setChild = function (pNode) {
    this._pChild = pNode;
};
/**
 * Adds the provided ModelSpace object to the descendant list of this object. The provided
 * ModelSpace object is removed from any parent it may already belong to.
 * @tparam SceneNode pSibling
 * @private
 */
SceneNode.prototype.addSibling = function (pSibling) {
    if (pSibling) {
        // replace objects current sibling pointer with this new one
        pSibling.setSibling(this._pSibling);
        this.setSibling(pSibling);
    }
};
/**
 * Adds the provided ModelSpace object to the descendant list of this object. The provided
 * ModelSpace object is removed from any parent it may already belong to.
 * @tparam SceneNode pChild
 * @private
 */
SceneNode.prototype.addChild = function (pChild) {
    if (pChild) {
        // Replace the new child's sibling pointer with our old first child.
        pChild.setSibling(this._pChild);
        // the new child becomes our first child pointer.
        this._pChild = pChild;
    }
};
/**
 * Removes a specified child object from this parent object. If the child is not the
 * FirstChild of this object, all of the Children are searched to find the object to remove.
 * @tparam SceneNode pChild
 * @private
 */
SceneNode.prototype.removeChild = function (pChild) {
    if (this._pChild && pChild) {
        if (this._pChild == pChild) {
            this._pChild = pChild.sibling();
            pChild.setSibling(null);
        }
        else {
            var pTempNode = this._pChild;
            // keep searching until we find the node who's sibling is our target
            // or we reach the end of the sibling chain
            while (pTempNode && (pTempNode.sibling() != pChild)) {
                pTempNode = pTempNode.sibling();
            }
            // if we found the proper item, set it's FirstSibling to be the FirstSibling of the child
            // we are removing
            if (pTempNode) {
                pTempNode.setSibling(pChild.sibling());
                pChild.setSibling(null);
            }
        }
    }
};
/**
 * Removes all Children from this parent object
 * @private
 */
SceneNode.prototype.removeAllChildren = function () {
    // keep removing children until end of chain is reached
    while (this._pChild != 0) {
        var NextSibling = this._pChild.sibling();
        this._pChild.detachFromParent();
        this._pChild = NextSibling;
    }
};
/**
 * Attaches this object ot a new parent. Same as calling the parent's addChild() routine.
 * @tparam SceneNode pParent
 */
SceneNode.prototype.attachToParent = function (pParent) {
    if (pParent != this._pParent) {
        this.detachFromParent();
        if (pParent) {
            this._pParent = pParent;
            this._pParent.addChild(this);
            //this._pParent.addRef();
            // adjust my local matrix to be relative to this new parent
            var invertedParentMatrix = Mat4.inverse(this._pParent._m4fWorldMatrix);
            Mat4.multiply(this._m4fLocalMatrix, invertedParentMatrix);
        }
    }
};
/**
 * Setter for iInheritance
 * @tparam Int iSetting Value from eInheritance
 */
SceneNode.prototype.setInheritance = function (iSetting) {
    this._iInheritance = iSetting;
};
/**
 * Detach this object from his parent. Refresh local and world matrix
 */
SceneNode.prototype.detachFromParent = function () {
    // tell our current parent to release us
    if (this._pParent) {
        this._pParent.removeChild(this);
        if (this._pParent) {
            this._pParent.release();
        }
        this._pParent = null;
        // my world matrix is now my local matrix
        this._m4fLocalMatrix = this._m4fWorldMatrix;
        // and the world matrix is the identity
        this._m4fWorldMatrix = Mat4.create();
        Mat4.identity(this._m4fWorldMatrix);
    }
};
/**
 * Attaches this object's children to it's parent, promoting them up the tree
 */
SceneNode.prototype.promoteChildren = function () {
    // Do I have any children to promote?
    while (this._pChild != null) {
        var NextSibling = this._pChild.sibling();
        this._pChild.attachToParent(this._pParent);
        this._pChild = NextSibling;
    }
};
/**
 * Set new parent for all children
 * @tparam SceneNode pParent
 */
SceneNode.prototype.relocateChildren = function (pParent) {
    if (pParent != this) {
        // Do I have any children to relocate?
        while (this._pChild != 0) {
            var NextSibling = this._pChild.sibling();
            this._pChild.attachToParent(pParent);
            this._pChild = NextSibling;
        }
    }
};
/**
 * Checks to see if the provided item is a sibling of this object
 * @tparam SceneNode pSibling
 * @treturn Boolean
 */
SceneNode.prototype.isASibling = function (pSibling) {
    if (!pSibling) {
        return false;
    }
    // if the sibling we are looking for is me, or my FirstSibling, return true
    if (this == pSibling || this._pSibling == pSibling) {
        return true;
    }
    // if we have a sibling, continue searching
    if (this._pSibling) {
        return this._pSibling.isASibling(pSibling);
    }
    // it's not us, and we have no sibling to check. This is not a sibling of ours.
    return false;
};
/**
 * Checks to see if the provided item is a child of this object. (one branch depth only)
 * @tparam SceneNode pChild\
 * @treturn Boolean
 */
SceneNode.prototype.isAChild = function (pChild) {
    if (!pChild) {
        return (false);
    }
    // if the sibling we are looking for is my FirstChild return true
    if (this._pChild == pChild) {
        return (true);
    }
    // if we have a child, continue searching
    if (this._pChild) {
        return (this._pChild.isASibling(pChild));
    }
    // it's not us, and we have no child to check. This is not a sibling of ours.
    return (false);
};
/**
 * Checks to see if the provided item is a child or sibling of this object. If SearchEntireTree
 * is TRUE, the check is done recursivly through all siblings and children. SearchEntireTree
 * is FALSE by default.
 * @tparam SceneNode pNode
 * @tparam Boolean SearchEntireTree
 * @treturn Boolean
 */
SceneNode.prototype.isInFamily = function (pNode, SearchEntireTree) {
    if (!pNode) {
        return (false);
    }
    // if the model we are looking for is me or my immediate family, return true
    if (this == pNode || this._pChild == pNode || this._pSibling == pNode) {
        return (true);
    }
    // if not set to seach entire tree, just check my siblings and kids
    if (!SearchEntireTree) {
        if (this.isASibling(pNode)) {
            return (true);
        }
        if (this._pChild && this._pChild.isASibling(pNode)) {
            return (true);
        }
    }
    else // seach entire Tree!!!
    {
        if (this._pSibling && this._pSibling.isInFamily(pNode, SearchEntireTree)) {
            return (true);
        }

        if (this._pChild && this._pChild.isInFamily(pNode, SearchEntireTree)) {
            return (true);
        }
    }
    return (false);
}

/**
 * Returns the current number of siblings of this object.
 * @treturn Int
 */
SceneNode.prototype.siblingCount = function () {
    var count = 0;
    if (this._pParent) {
        var pNextSibling = this._pParent.child();
        if (pNextSibling) {
            while (pNextSibling) {
                pNextSibling = pNextSibling.sibling();
                ++count;
            }
        }
    }
    return count;
};
/**
 * Returns the current number of children of this object
 * @treturn Boolean
 */
SceneNode.prototype.childCount = function () {
    var count = 0;
    pNextChild = this.child();
    if (pNextChild) {
        ++count;
        while (pNextChild) {
            pNextChild = pNextChild.sibling();
            ++count;
        }
    }
    return count;
};
/**
 * Update matrix
 */
SceneNode.prototype.update = function () {
    // derived classes update the local matrix
    // then call this base function to complete
    // the update
    this.recalcWorldMatrix();
    // if there is a group attached, update it
    if (this._pSubNodeGroupData) {
        this._pSubNodeGroupData.update();
    }
    ;
};
/**
 * Prepare for update matrix of node
 */
SceneNode.prototype.prepareForUpdate = function () {
    // clear the temporary flags
    a.BitFlags.clearFlags(this._iUpdateFlags, FLAG(a.Scene.k_newLocalMatrix) | FLAG(a.Scene.k_newWorldMatrix));
};
/**
 * Prepare for render
 * Base class does nothing. Derived classes
 * should set their LOD levels and prepare
 * for a call to render
 */
SceneNode.prototype.prepareForRender = function () {

};
/**
 * Update all child and sibling nodes
 */
SceneNode.prototype.recursiveUpdate = function () {
    // update myself
    this.update();
    // update my sibling
    if (this._pSibling) {
        this._pSibling.recursiveUpdate();
    }
    // update my child
    if (this._pChild) {
        this._pChild.recursiveUpdate();
    }
    // clear the flags from the previous update
    this.prepareForUpdate();
};
/**
 * This function renders everything in the scene.
 * it is only used by the model viewing tool
 */
SceneNode.prototype.recursiveRender = function () {
    // render myself
    this.prepareForRender();
    this.render();
    // render my sibling
    if (this.sibling()) {
        this.sibling().recursiveRender();
    }
    // render my child
    if (this.child()) {
        this.child().recursiveRender();
    }
};
/**
 * Recalculate world Matrix
 */
SceneNode.prototype.recalcWorldMatrix = function () {
    var isParentMoved = this._pParent && this._pParent.isWorldMatrixNew();
    var isWeMoved = TEST_BIT(this._iUpdateFlags, a.Scene.k_newLocalMatrix);
    if (isWeMoved || isParentMoved) {
        var m4fLocal = this._m4fLocalMatrix;
        var m4fWorld = this._m4fWorldMatrix;
        var m4fParent = this._pParent.worldMatrix();
        // multiply our local matrix by our parent
        if (this._pParent) {
            if (this._iInheritance === a.Scene.k_inheritAll) {
                Mat4.multiply(m4fParent, m4fLocal, m4fWorld);
            }
            else if (this._iInheritance === a.Scene.k_inheritPositionOnly) {
                Mat4.set3x3(m4fLocal, m4fWorld);
                m4fWorld._41 = m4fLocal._41;
                m4fWorld._42 = m4fLocal._42;
                m4fWorld._43 = m4fLocal._43;
                m4fWorld._14 = m4fParent._14 + m4fLocal._14;
                m4fWorld._24 = m4fParent._24 + m4fLocal._24;
                m4fWorld._34 = m4fParent._34 + m4fLocal._34;
                m4fWorld._44 = m4fLocal._44;
            }
            else if (this._iInheritance === a.Scene.k_inheritRotScaleOnly) {
                var p11 = m4fParent._11, p12 = m4fParent._12,
                    p13 = m4fParent._13;
                var p21 = m4fParent._21, p22 = m4fParent._22,
                    p23 = m4fParent._23;
                var p31 = m4fParent._31, p32 = m4fParent._32,
                    p33 = m4fParent._33;
                var l11 = m4fLocal._11, l12 = m4fLocal._12,
                    l13 = m4fLocal._13;
                var l21 = m4fLocal._21, l22 = m4fLocal._22,
                    l23 = m4fLocal._23;
                var l31 = m4fLocal._31, l32 = m4fLocal._32,
                    l33 = m4fLocal._33;
                m4fWorld._11 = p11 * l11 + p12 * l21 + p13 * l31;
                m4fWorld._12 = p11 * l12 + p12 * l22 + p13 * l32;
                m4fWorld._13 = p11 * l13 + p12 * l23 + p13 * l33;
                m4fWorld._14 = m4fLocal._14;
                m4fWorld._21 = p21 * l11 + p22 * l21 + p23 * l31;
                m4fWorld._22 = p21 * l12 + p22 * l22 + p23 * l32;
                m4fWorld._23 = p21 * l13 + p22 * l23 + p23 * l33;
                m4fWorld._24 = m4fLocal._24;
                m4fWorld._31 = p31 * l11 + p32 * l21 + p33 * l31;
                m4fWorld._32 = p31 * l12 + p32 * l22 + p33 * l32;
                m4fWorld._33 = p31 * l13 + p32 * l23 + p33 * l33;
                m4fWorld._34 = m4fLocal._34;

                m4fWorld._41 = m4fLocal._41;
                m4fWorld._42 = m4fLocal._42;
                m4fWorld._43 = m4fLocal._43;
                m4fWorld._44 = m4fLocal._44;
            }
        }
        else {
            Mat4.set(this._m4fLocalMatrix, this._m4fWorldMatrix);
        }
        // set the flag that our world matrix has changed
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newWorldMatrix, true);
        // and it's inverse & vectors are out of date
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_rebuildInverseWorldMatrix, true);
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_rebuildWorldVectors, true);
    }
};
/**
 * @property SceneNode createSubNode(ModelResource pModelResource, int frameIndex)
 * Create subnode from model resource
 * @memberof SceneNode
 */
/**
 * Create subnode
 * @treturn SceneNode
 */
SceneNode.prototype.createSubNode = function () {
    switch (arguments.length) {
        case 2:
            var node = new a.SceneModel();
            node.create();
            node.setModelResource(pModelResource, frameIndex);
            node._pSubNodeGroupOwner = this;
            return node;
        default:
            var node = new cSceneNode();
            node.create();
            node._pSubNodeGroupOwner = this;
            return node;
    }
};
/**
 * Destroy subNode
 * @tparam SceneNode pSubNode
 */
SceneNode.prototype.destroySubNode = function (pSubNode) {
    pSubNode.destroy();
    pSubNode._pSubNodeGroupOwner = null;
    delete pSubNode;
    pSubNode = null;
};
/**
 * Update world vectors(up, right, up, forward, position) from worldMatrix
 */
SceneNode.prototype.updateWorldVectors = function () {
    // we only do this when nessesary
    if (TEST_BIT(this._iUpdateFlags, a.Scene.k_rebuildWorldVectors)) {
        var fX, fY, fZ, fW;

        fX = this._m4fWorldMatrix._11;
        fY = this._m4fWorldMatrix._21;
        fZ = this._m4fWorldMatrix._31;
        fW = this._m4fWorldMatrix._41;
        if (fW != 0.0) {
            fX /= fW;
            fY /= fW;
            fZ /= fW;
        }
        Vec3.set(fX, fY, fZ, this._v3fWorldRight);
        Vec3.normalize(this._v3fWorldRight);

        fX = this._m4fWorldMatrix._12;
        fY = this._m4fWorldMatrix._22;
        fZ = this._m4fWorldMatrix._32;
        fW = this._m4fWorldMatrix._42;
        if (fW != 0.0) {
            fX /= fW;
            fY /= fW;
            fZ /= fW;
        }
        Vec3.set(fX, fY, fZ, this._v3fWorldUp);
        Vec3.normalize(this._v3fWorldUp);

        fX = this._m4fWorldMatrix._13;
        fY = this._m4fWorldMatrix._23;
        fZ = this._m4fWorldMatrix._33;
        fW = this._m4fWorldMatrix._43;
        if (fW != 0.0) {
            fX /= fW;
            fY /= fW;
            fZ /= fW;
        }
        Vec3.set(fX, fY, fZ, this._v3fWorldForward);
        Vec3.normalize(this._v3fWorldForward);

        fX = this._m4fWorldMatrix._14;
        fY = this._m4fWorldMatrix._24;
        fZ = this._m4fWorldMatrix._34;
        fW = this._m4fWorldMatrix._44;
        if (fW != 0.0) {
            fX /= fW;
            fY /= fW;
            fZ /= fW;
        }
        Vec3.set(fX, fY, fZ, this._v3fWorldPosition);

        a.BitFlags.clearBit(this._iUpdateFlags, a.Scene.k_rebuildWorldVectors);
    }
};
/**
 * Getter for worldPosistion vector
 * @treturn Float32Array _v3fWorldPostion
 */
SceneNode.prototype.worldPosition = function () {
    this.updateWorldVectors();
    return this._v3fWorldPosition;
};
/**
 * Getter for worldRight vector
 * @treturn Float32Array _v3fWorldRight
 */
SceneNode.prototype.worldRight = function () {
    this.updateWorldVectors();
    return this._v3fWorldRight;
};
/**
 * Getter for worldUp vecror
 * @treturn Float32Array _v3fWorldUp
 */
SceneNode.prototype.worldUp = function () {
    this.updateWorldVectors();
    return this._v3fWorldUp;
};
/**
 * Getter for worldForward vecror
 * @treturn Float32Array _v3fWorldForward
 */
SceneNode.prototype.worldForward = function () {
    this.updateWorldVectors();
    return this._v3fWorldForward;
};
SceneNode.prototype.getUp = SceneNode.prototype.worldUp;
SceneNode.prototype.getRight = SceneNode.prototype.worldRight;
SceneNode.prototype.getForward = SceneNode.prototype.worldForward;
SceneNode.prototype.getPosition = SceneNode.prototype.worldPosition();

/**
 * Set new position.
 * _v3fPostion = pPos
 * @tparam Float32Array pPos 3d vector
 */
SceneNode.prototype.setPosition = function (pPos) {
    var m4fLocal = this._m4fLocalMatrix;
    m4fLocal._14 = pPos.X;
    m4fLocal._24 = pPos.Y;
    m4fLocal._34 = pPos.Z;
    m4fLocal._44 = 1.0;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * Set new relative position.
 * _v3fPostion = _v3fRight*pPos.X + _v3fUp*pos.Y + _v3fForward*pos.Z
 * @tparam Float32Array pPos 3d vector
 */
SceneNode.prototype.setRelPosition = function (pPos) {
    var m4fLocal = this._m4fLocalMatrix;
    var fX = pPos.X, fY = pPos.Y, fZ = pPos.Z;
    m4fLocal._14 = m4fLocal._11 * fX + m4fLocal._12 * fY + m4fLocal._13 * fZ;
    m4fLocal._24 = m4fLocal._21 * fX + m4fLocal._22 * fY + m4fLocal._23 * fZ;
    m4fLocal._34 = m4fLocal._31 * fX + m4fLocal._32 * fY + m4fLocal._33 * fZ;
    m4fLocal._44 = 1.0;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * Add new position.
 * _v3fPostion += pPos
 * @tparam Float32Array pPos 3d vector
 */
SceneNode.prototype.addPosition = function (pPos) {
    var m4fLocal = this._m4fLocalMatrix;
    m4fLocal._14 += pPos.X;
    m4fLocal._24 += pPos.Y;
    m4fLocal._34 += pPos.Z;
    m4fLocal._44 = 1.0;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * Add new relative position.
 * _v3fPostion += _v3fRight*pPos.X + _v3fUp*pos.Y + _v3fForward*pos.Z
 * @tparam Float32Array pPos 3d vector
 */
SceneNode.prototype.addRelPosition = function (pPos) {
    var m4fLocal = this._m4fLocalMatrix;
    var fX = pPos.X, fY = pPos.Y, fZ = pPos.Z;
    m4fLocal._14 += m4fLocal._11 * fX + m4fLocal._12 * fY + m4fLocal._13 * fZ;
    m4fLocal._24 += m4fLocal._21 * fX + m4fLocal._22 * fY + m4fLocal._23 * fZ;
    m4fLocal._34 += m4fLocal._31 * fX + m4fLocal._32 * fY + m4fLocal._33 * fZ;
    m4fLocal._44 = 1.0;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * @property void setRotation(Float32Array m4fRotation)
 * Setup rotation
 * @memberof SceneNode
 */
/**
 * @property void setRotation(Float32Array v3fAxis, Float fAngle)
 * Setup rotation
 * @memberof SceneNode
 */
/**
 * @property void setRotation(Float32Array v3fForward, Float32Array v3fUp)
 * Setup rotation
 * @memberof SceneNode
 */
/**
 * @property void setRotation(Float yaw, Float pitch, Float roll)
 * Setup rotation
 * roll->pitch->yaw = z -> x -> y
 * @memberof SceneNode
 */
SceneNode.prototype.setRotation = function () {
    var m4fRot;
    var m4fLocal = this._m4fLocalMatrix;
    switch (arguments.length) {
        case 1:
            m4fRot = arguments[0];
            m4fLocal._11 = m4fRot._11;
            m4fLocal._21 = m4fRot._21;
            m4fLocal._31 = m4fRot._31;
            m4fLocal._12 = m4fRot._12;
            m4fLocal._22 = m4fRot._22;
            m4fLocal._32 = m4fRot._32;
            m4fLocal._13 = m4fRot._13;
            m4fLocal._23 = m4fRot._23;
            m4fLocal._33 = m4fRot._33;
            break;
        case 2:
            var ar1 = arguments[0];
            var ar2 = arguments[1];
            if (typeof ar2 == "number") {
                m4fRot = TEMPSCENEMATRIX4FORCALC0;
                Mat4.identity(m4fRot);
                Mat4.rotate(m4fRot, ar2, ar1);
                m4fLocal._11 = m4fRot._11;
                m4fLocal._21 = m4fRot._21;
                m4fLocal._31 = m4fRot._31;
                m4fLocal._12 = m4fRot._12;
                m4fLocal._22 = m4fRot._22;
                m4fLocal._32 = m4fRot._32;
                m4fLocal._13 = m4fRot._13;
                m4fLocal._23 = m4fRot._23;
                m4fLocal._33 = m4fRot._33;
            }
            else {
                Vec3.cross(ar2, ar1, TEMPSCENEVECTOR3FORCALC0);
                m4fLocal._11 = TEMPSCENEVECTOR3FORCALC0.X;
                m4fLocal._21 = TEMPSCENEVECTOR3FORCALC0.Y;
                m4fLocal._31 = TEMPSCENEVECTOR3FORCALC0.Z;
                m4fLocal._12 = ar2.X;
                m4fLocal._22 = ar2.Y;
                m4fLocal._32 = ar2.Z;
                m4fLocal._13 = ar1.X;
                m4fLocal._23 = ar1.Y;
                m4fLocal._33 = ar1.Z;
            }
            break;
        case 3:
            var yaw = arguments[0], pitch = arguments[1], roll = arguments[2];
            m4fRot = TEMPSCENEMATRIX4FORCALC0;
            Mat4.identity(m4fRot);
            Mat4.rotateY(m4fRot, yaw);
            Mat4.rotateX(m4fRot, pitch);
            Mat4.rotateZ(m4fRot, roll);
            m4fLocal._11 = m4fRot._11;
            m4fLocal._21 = m4fRot._21;
            m4fLocal._31 = m4fRot._31;
            m4fLocal._12 = m4fRot._12;
            m4fLocal._22 = m4fRot._22;
            m4fLocal._32 = m4fRot._32;
            m4fLocal._13 = m4fRot._13;
            m4fLocal._23 = m4fRot._23;
            m4fLocal._33 = m4fRot._33;
            break;
    }
    ;
    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * @property void addRelRotation(Float32Array m4fRotation)
 * Add relative rotation
 * @memberof SceneNode
 */
/**
 * @property void addRelRotation(Float32Array v3fAxis, Float fAngle)
 * Setup rotation
 * @memberof SceneNode
 */
/**
 * @property void addRelRotation(Float yaw, Float pitch, Float roll)
 * Setup rotation
 * roll->pitch->yaw = z -> x -> y
 * @memberof SceneNode
 */
SceneNode.prototype.addRelRotation = function () {
    var m4fRot;
    var m4fLocal = this._m4fLocalMatrix;
    switch (arguments.length) {
        case 1:
            m4fRot = arguments[0];
            break;
        case 2:
            Mat4.rotate(m4fLocal, arguments[1], arguments[0]);
            a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
            return;
        case 3:
            var yaw = arguments[0], pitch = arguments[1], roll = arguments[2];
            m4fRot = TEMPSCENEMATRIX4FORCALC0;
            Mat4.identity(m4fRot);
            Mat4.rotateY(m4fRot, yaw);
            Mat4.rotateX(m4fRot, pitch);
            Mat4.rotateZ(m4fRot, roll);
            break;
    }
    ;

    var a11 = m4fLocal._11, a21 = m4fLocal._21, a31 = m4fLocal._31;
    var a12 = m4fLocal._12, a22 = m4fLocal._22, a32 = m4fLocal._32;
    var a13 = m4fLocal._13, a23 = m4fLocal._23, a33 = m4fLocal._33;

    var b11 = m4fRot._11, b21 = m4fRot._21, b31 = m4fRot._31;
    var b12 = m4fRot._12, b22 = m4fRot._22, b32 = m4fRot._32;
    var b13 = m4fRot._13, b23 = m4fRot._23, b33 = m4fRot._33;

    m4fLocal._11 = a11 * b11 + a12 * b21 + a13 * b31;
    m4fLocal._21 = a21 * b11 + a22 * b21 + a23 * b31;
    m4fLocal._31 = a31 * b11 + a32 * b21 + a33 * b31;

    m4fLocal._12 = a11 * b12 + a12 * b22 + a13 * b32;
    m4fLocal._22 = a21 * b12 + a22 * b22 + a23 * b32;
    m4fLocal._32 = a31 * b12 + a32 * b22 + a33 * b32;

    m4fLocal._13 = a11 * b13 + a12 * b23 + a13 * b33;
    m4fLocal._23 = a21 * b13 + a22 * b23 + a23 * b33;
    m4fLocal._33 = a31 * b13 + a32 * b23 + a33 * b33;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * @property void addRotation(Float32Array m4fRotation)
 * Add rotation
 * @memberof SceneNode
 */
/**
 * @property void addRotation(Float32Array v3fAxis, Float fAngle)
 * Add rotation
 * @memberof SceneNode
 */
/**
 * @property void addRotation(Float32Array v3fForward, Float32Array v3fUp)
 * Add rotation
 * @memberof SceneNode
 */
/**
 * @property void addRotation(Float yaw, Float pitch, Float roll)
 * Add rotation
 * roll->pitch->yaw = z -> x -> y
 * @memberof SceneNode
 */
SceneNode.prototype.addRotation = function () {
    var m4fRot;
    var m4fLocal = this._m4fLocalMatrix;

    switch (arguments.length) {
        case 1:
            m4fRot = arguments[0];
            break;
        case 2:
            var ar1 = arguments[0];
            var ar2 = arguments[1];
            if (typeof ar2 == "number") {
                m4fRot = TEMPSCENEMATRIX4FORCALC0;
                Mat4.identity(m4fRot);
                Mat4.rotate(m4fRot, ar2, ar1);
            }
            else {
                m4fRot = TEMPSCENEMATRIX4FORCALC0;
                Vec3.cross(ar2, ar1, TEMPSCENEVECTOR3FORCALC0);
                m4fRot._11 = TEMPSCENEVECTOR3FORCALC0.X;
                m4fRot._21 = TEMPSCENEVECTOR3FORCALC0.Y;
                m4fRot._31 = TEMPSCENEVECTOR3FORCALC0.Z;
                m4fRot._12 = ar2.X;
                m4fRot._22 = ar2.Y;
                m4fRot._32 = ar2.Z;
                m4fRot._13 = ar1.X;
                m4fRot._23 = ar1.Y;
                m4fRot._33 = ar1.Z;
            }
            break;
        case 3:
            var yaw = arguments[0], pitch = arguments[1], roll = arguments[2];
            m4fRot = TEMPSCENEMATRIX4FORCALC0;
            Mat4.identity(m4fRot);
            Mat4.rotateY(m4fRot, yaw);
            Mat4.rotateX(m4fRot, pitch);
            Mat4.rotateZ(m4fRot, roll);
            break;
    }
    ;

    var a11 = m4fRot._11, a21 = m4fRot._21, a31 = m4fRot._31;
    var a12 = m4fRot._12, a22 = m4fRot._22, a32 = m4fRot._32;
    var a13 = m4fRot._13, a23 = m4fRot._23, a33 = m4fRot._33;

    var b11 = m4fLocal._11, b21 = m4fLocal._21, b31 = m4fLocal._31;
    var b12 = m4fLocal._12, b22 = m4fLocal._22, b32 = m4fLocal._32;
    var b13 = m4fLocal._13, b23 = m4fLocal._23, b33 = m4fLocal._33;

    m4fLocal._11 = a11 * b11 + a12 * b21 + a13 * b31;
    m4fLocal._21 = a21 * b11 + a22 * b21 + a23 * b31;
    m4fLocal._31 = a31 * b11 + a32 * b21 + a33 * b31;

    m4fLocal._12 = a11 * b12 + a12 * b22 + a13 * b32;
    m4fLocal._22 = a21 * b12 + a22 * b22 + a23 * b32;
    m4fLocal._32 = a31 * b12 + a32 * b22 + a33 * b32;

    m4fLocal._13 = a11 * b13 + a12 * b23 + a13 * b33;
    m4fLocal._23 = a21 * b13 + a22 * b23 + a23 * b33;
    m4fLocal._33 = a31 * b13 + a32 * b23 + a33 * b33;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};
/**
 * @property void setScale(Float32Array v3fScale)
 * Set scale
 * @memberof SceneNode
 */
/**
 * Setup scale
 * @tparam Float scale
 */
SceneNode.prototype.setScale = function (scale) {
    var m4fLocal = this._m4fLocalMatrix;
    if (typeof(scale) == "number") {
        m4fLocal._11 *= scale;
        m4fLocal._22 *= scale;
        m4fLocal._33 *= scale;
    }
    else {
        m4fLocal._11 *= scale.X;
        m4fLocal._22 *= scale.Y;
        m4fLocal._33 *= scale.Z;
    }
    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newLocalMatrix, true);
};


/**
 * SubNode group
 * @ctor
 * Constructor
 */
function SubNodeGroup () {
    /**
     * Parent node of group
     * @type SceneNode
     * @private
     */
    this._pParentNode = null;
    /**
     * ModelResource
     * @type ModelResource
     * @private
     */
    this._pModelResource = null;
    /**
     * Count of subnodes
     * @type Int
     * @private
     */
    this._totalSubNodes = 0;
    /**
     * SubNode list
     * @type Array(SceneNode)
     * @private
     */
    this._ppSubNodePtrList = null;
    /**
     * Count of named subnodes
     * @type Int
     * @private
     */
    this._totalNamedSubNodes = 0;
    /**
     * Named SubNode list
     * @type Array(SceneNode)
     * @private
     */
    this._ppNamedSubNodePtrList = null;
    /**
     * Animation controller
     * @type AnimationController
     * @private
     */
    this._animController = null;
}
;
/**
 * Getter
 * @treturn ModelResource
 */
SubNodeGroup.prototype.modelResource = function () {
    INLINE();
    return this._pModelResource;
};
/**
 * Getter
 * @treturn Int
 */
SubNodeGroup.prototype.totalSubNodes = function () {
    INLINE();
    return this._totalSubNodes;
};
/**
 * Getter for subnode by index
 * @tparam Int index
 * @treturn SceneNode
 */
SubNodeGroup.prototype.subNodePtr = function (index) {
    INLINE();
    debug_assert(index < this._totalSubNodes, "invalid subnode index");
    return this._ppSubNodePtrList[index];
};
/**
 * Getter
 * @treturn Int
 */
SubNodeGroup.prototype.totalNamedSubNodes = function () {
    INLINE();
    return this._totalNamedSubNodes;
};
/**
 * Getter for subnode by index
 * @tparam Int index
 * @treturn SceneNode
 */
SubNodeGroup.prototype.namedSubNodePtr = function (index) {
    INLINE();
    debug_assert(index < this._totalNamedSubNodes, "invalid subnode index");
    return this._ppNamedSubNodePtrList[index];
};
/**
 * Getter
 * @treturn AnimationController
 */
SubNodeGroup.prototype.animController = function () {
    INLINE();
    return this._animController;
};
/**
 * Create
 * @tparam SceneNode pRootNode
 * @tparam Int iModelResource handle of resource in pool
 */
SubNodeGroup.prototype.create = function (pRootNode, iModelResource) {
    // destroy any local data
    this.destroy();

    this._pParentNode = pRootNode;
    this._pModelResource = a.displayManager().modelPool().getResource(ModelResource);
    if (this._pModelResource) {
        // clone the frame tree
        this._totalSubNodes = this._pModelResource.totalFrames();
        this._totalNamedSubNodes = 0;
        this._ppSubNodePtrList = new Array();
        this._ppNamedSubNodePtrList = new Array();
        // copy the frame nodes locally
        for (var i = 0; i < this._totalSubNodes; ++i) {
            // is a scene object attached to this node?
            var pMeshContainer = this._pModelResource.frame(i).pMeshContainer;
            // create this node
            if (pMeshContainer) {
                this._ppSubNodePtrList[i] = pRootNode.createSubNode(this._pModelResource, i);
            }
            else {
                this._ppSubNodePtrList[i] = pRootNode.createSubNode();
            }
            // pLink to the proper parent node
            var parentIndex = this._pModelResource.frame(i).parentIndex;

            debug_assert(parentIndex == a.define.MAXUINT16, parentIndex < this._pModelResource.frame(i).frameIndex,
                         "invalid model resource");

            if (parentIndex == a.define.MAXUINT16) {
                this._ppSubNodePtrList[i].attachToParent(pRootNode);
            }
            else {
                this._ppSubNodePtrList[i].attachToParent(this._ppSubNodePtrList[parentIndex]);
            }
            // set the local matrix of the sub node
            var pLocalMatrix = this._pSubNodePtrList[i].accessLocalMatrix();
            Mat4.set(this._pModelResource.frame(i).TransformationMatrix, pLocalMatrix);

            // if the source was a named node, register with the animation controller
            if (this._pModelResource.frame(i).Name) {
                this._ppNamedSubNodePtrList[this._totalNamedSubNodes] = this._ppSubNodePtrList[i];
                ++this._totalNamedSubNodes;
            }
        }
        this._animController.create(this, iModelResource);
        return true;
    }
    return false;
};
/**
 * Destroy all local data
 */
SubNodeGroup.prototype.destroy = function () {
    this._animController.destroy();
    // delete our allocations
    if (this._ppSubNodePtrList) {
        for (var i = 0; i < this._totalSubNodes; ++i) {
            this._pParentNode.destroySubNode(this._ppSubNodePtrList[i]);
        }
    }
    ;
    delete this._ppSubNodePtrList;
    delete this._ppNamedSubNodePtrList;
    this._totalSubNodes = 0;
    this._totalNamedSubNodes = 0;
    // release our reference to the source model
    this._pModelResource.release();
    this._pModelResource = null;
}
/**
 * Play the current animation
 */
SubNodeGroup.prototype.update = function () {
    this._animController.update();
};
/**
 * Signal all the subnodes to recalc
 */
SubNodeGroup.prototype.adjustForAnimationStep = function () {
    for (var i = 0; i < this._totalNamedSubNodes; ++i) {
        this._ppNamedSubNodePtrList[i].setUpdatedLocalMatrixFlag();
    }
};
/**
 * Scene object Class
 * @extends SceneNode
 * @ctor
 * Constructor.
 * The constructor initializes all papams for SceneObject
 */
function SceneObject (pEngine) {

    SceneObject.superclass.constructor.apply(this, arguments);

    Enum([
             k_newLocalBounds = 0,
             k_newWorldBounds
         ], eObjectFlagBits, a.Scene);

    // bounding box information
    /**
     * Bit flag
     * @type Int
     * @private
     */
    this._iObjectFlags = 0;
    /**
     * Local bounding rect
     * @type Rect3d
     * @private
     */
    this._pLocalBounds = new a.Rect3d();
    /**
     * World bounding rect
     * @type Rect3d
     * @private
     */
    this._pWorldBounds = new a.Rect3d();

    // world Tree membership information
    /**
     * Tree object
     * @type OcTree
     * @private
     */
    this._pOcTree = null;
    /**
     * Tree node where object place
     * @type OcTreeNode
     * @private
     */
    this._pOcTreeNode = null;
    /**
     * Link for object
     * @type SceneObject
     * @private
     */
    this._pForwardTreeLink = null;
    /**
     * Link for object
     * @type SceneObject
     * @private
     */
    this._pRearTreeLink = null;

    // Tree search result links
    /**
     * Link for object
     * @type SceneObject
     * @private
     */
    this._pForwardSearchLink = null;
    /**
     * Link for object
     * @type SceneObject
     * @private
     */
    this._pRearSearchLink = null;
}
;

EXTENDS(SceneObject, SceneNode);

/**
 * Setter
 * @tparam Rect3d pBox
 */
SceneObject.prototype.setWorldBounds = function (pBox) {
    INLINE();
    this._pWorldBounds = pBox;
};
/**
 * Setter
 * @tparam SceneObject pForwardLink
 */
SceneObject.prototype.setForwardSearchLink = function (pForwardLink) {
    INLINE();
    this._pForwardSearchLink = pForwardLink;
};
/**
 * Setter
 * @tparam SceneObject pRearLink
 */
SceneObject.prototype.setRearSearchLink = function (pRearLink) {
    INLINE();
    this._pRearSearchLink = pRearLink;
};
/**
 * Getter
 * @treturn Int
 */
SceneObject.prototype.objectFlags = function () {
    INLINE();
    return this._iObjectFlags;
};
/**
 * Accessor to LocalBounds. Set right bits in _iObjectFlags
 * @treturn Rect3d
 */
SceneObject.prototype.accessLocalBounds = function () {
    INLINE();
    a.BitFlags.setBit(this._iObjectFlags, a.Scene.k_newLocalBounds, true);
    return this._pLocalBounds;
};


/**
 * Getter
 * @treturn OcTreeNode
 */
SceneObject.prototype.treeNode = function () {
    INLINE();
    return this._pOcTreeNode;
};
/**
 * Getter
 * @treturn SceneObject
 */
SceneObject.prototype.forwardTreeLink = function () {
    INLINE();
    return this._pForwardTreeLink;
};
/**
 * Getter
 * @treturn SceneObject
 */
SceneObject.prototype.rearTreeLink = function () {
    INLINE();
    return this._pRearTreeLink;
};
/**
 * Setter for treeNode
 * @tparam OcTreeNode pParentNode
 */
SceneObject.prototype.setOcTreeData = function (pParentNode) {
    INLINE();
    this._pOcTreeNode = pParentNode;
};
/**
 * Setter
 * @tparam SceneObject pLink
 */
SceneObject.prototype.setForwardTreeLink = function (pLink) {
    INLINE();
    this._pForwardTreeLink = pLink;
};
/**
 * Setter
 * @tparam SceneObject pLink
 */
SceneObject.prototype.setRearTreeLink = function (pLink) {
    INLINE();
    this._pRearTreeLink = pLink;
};
/**
 * Getter
 * @treturn Rect3d
 */
SceneObject.prototype.localBounds = function () {
    INLINE();
    return this._pLocalBounds;
};
/**
 * Getter
 * @treturn Rect3d
 */
SceneObject.prototype.worldBounds = function () {
    INLINE();
    return this._pWorldBounds;
};
/**
 * Test world bounds is new or not
 * @treturn Boolean
 */
SceneObject.prototype.isWorldBoundsNew = function () {
    INLINE();
    return TEST_BIT(this._iObjectFlags, a.Scene.k_newWorldBounds);
};
/**
 * Getter for _pForwardSearchLink
 * @treturn SceneObject
 */
SceneObject.prototype.nextSearchLink = function () {
    INLINE();
    return this._pForwardSearchLink;
};
/**
 * Init object
 * @treturn Boolean
 */
SceneObject.prototype.create = function () {
    var result = SceneObject.superclass.create.apply(this, arguments);
    if (result) {
        this.attachToOcTree(this._pEngine.getSceneTree());
    }
    return result;
};
/**
 * Destroys the object. The object is removed from it's parent (if any) and all Children
 * Objects are orphaned (parent set to NULL).
 */
SceneObject.prototype.destroy = function () {
    // remove ourselves from the tree (if any)
    this.detachFromOcTree();
    SceneObject.superclass.destroy.apply(this, arguments);
};
/**
 * Prapare for update object
 */
SceneObject.prototype.prepareForUpdate = function () {
    SceneObject.superclass.prepareForUpdate.apply(this, arguments);
    // clear the temporary flags
    a.BitFlags.clearFlags(this._iObjectFlags, FLAG(a.Scene.k_newLocalBounds)
        | FLAG(a.Scene.k_newWorldBounds));
};
/**
 * Update object(matrix, bounds, tree membership)
 */
SceneObject.prototype.update = function () {
    SceneObject.superclass.update.apply(this, arguments);
    // do we need to update our local matrix?

    // derived classes update the local matrix
    // then call this base function to complete
    // the update
    this.recalcWorldBounds();
    this.refreshOcTreeMembership();
};
/**
 * Recalculate world bounds
 */
SceneObject.prototype.recalcWorldBounds = function () {
    // nodes only get their bounds updated
    // as nessesary
    if (TEST_BIT(this._iObjectFlags, a.Scene.k_newLocalBounds)
        || this.isWorldMatrixNew()) {
        // transform our local rectangle 
        // by the current world matrix
        this._pWorldBounds.set(this._pLocalBounds);
        // make sure we have some degree of thickness
        if (this._pOcTree) {
            this._pWorldBounds.fX1 = Math.max(this._pWorldBounds.fX1, this._pWorldBounds.fX0 + 0.01);
            this._pWorldBounds.fY1 = Math.max(this._pWorldBounds.fY1, this._pWorldBounds.fY0 + 0.01);
            this._pWorldBounds.fZ1 = Math.max(this._pWorldBounds.fZ1, this._pWorldBounds.fZ0 + 0.01);
        }
        this._pWorldBounds.transform(this.worldMatrix());
        // set the flag that our bounding box has changed
        a.BitFlags.setBit(this._iObjectFlags, a.Scene.k_newWorldBounds, true);
    }
};
/**
 * Refresh tree index of object
 */
SceneObject.prototype.refreshOcTreeMembership = function () {
    if (this._pOcTree
        && TEST_BIT(this._iObjectFlags, a.Scene.k_newWorldBounds)) {
        this._pOcTree.addOrUpdateSceneObject(this);
    }
};
/**
 * Add object in tree
 * @tparam OcTree pParentTree
 */
SceneObject.prototype.attachToOcTree = function (pParentTree) {
    this.detachFromOcTree();
    this._pOcTree = pParentTree;
    this._pOcTree.addOrUpdateSceneObject(this);
};
/**
 * Delete object from tree
 */
SceneObject.prototype.detachFromOcTree = function () {
    if (this._pOcTreeNode) {
        this._pOcTreeNode.removeMember(this);
        this._pOcTreeNode = null;
    }
    this._pOcTree = null;
    this._pForwardTreeLink = null;
    this._pRearTreeLink = null;
};
/**
 * Make object availeable for search
 * @tparam SceneObject pRearLink
 * @tparam SceneObject pForwardLink
 */
SceneObject.prototype.attachToSearchResult = function (pRearLink, pForwardLink) {
    this._pForwardSearchLink = pForwardLink;
    this._pRearSearchLink = pRearLink;
    if (this._pForwardSearchLink) {
        this._pForwardSearchLink.setRearSearchLink(this);
    }
    if (this._pRearSearchLink) {
        this._pRearSearchLink.setForwardSearchLink(this);
    }
};
/**
 * Make object not availeable for search
 */
SceneObject.prototype.detachFromSearchResult = function () {
    if (this._pForwardSearchLink) {
        this._pForwardSearchLink.setRearSearchLink(this._pRearSearchLink);
    }
    if (this._pRearSearchLink) {
        this._pRearSearchLink.setForwardSearchLink(this._pForwardSearchLink);
    }
    this._pForwardSearchLink = null;
    this._pRearSearchLink = null;
};
/**
 * Set search results to null
 */
SceneObject.prototype.clearSearchResults = function () {
    this._pRearSearchLink = null;
    this._pForwardSearchLink = null;
};
/**
 * default implementation does nothing
 */
SceneObject.prototype.prepareForRender = function () {
};
/**
 * Call parent method. Default implementation does nothing.
 */
SceneObject.prototype.render = function () {
    SceneObject.superclass.render.apply(this, arguments);
};
/**
 * if we queued ourselved for rendering with the
 * display manager, we will get this function
 * called when it is our turn to render
 * activationFlags contains a set of bit flags
 * held in the eActivationFlagBits enum (render_queue.h)
 * which tell us what resources we need to activate
 * in order to render ourselves.
 */
SceneObject.prototype.renderCallback = function (entry, activationFlags) {
};

a.SceneNode = SceneNode;
a.SubNodeGroup = SubNodeGroup;
a.SceneObject = SceneObject;
