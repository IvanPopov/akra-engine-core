var TEMPSCENEVECTOR3FORCALC0 = Vec3.create();
var TEMPSCENEMATRIX4FORCALC0 = Mat4.create();

function Node(){
    A_CLASS;
    Enum([
             k_setForDestruction = 0,
             k_newLocalMatrix,
             k_newWorldMatrix,
             k_rebuildInverseWorldMatrix,
             k_rebuildWorldVectors,
             k_rebuildNormalMatrix,
             k_ignoreOrientation
         ], eUpdateDataFlagBits, a.Scene);
    Enum([
             k_inheritPositionOnly = 0,
             k_inheritRotScaleOnly,
             k_inheritAll
         ], eInheritance, a.Scene);
    
    this._m4fLocalMatrix = null;
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m4fWorldMatrix = null;
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m4fInverseWorldMatrix = null;
    /**
     * Matrix
     * @private
     * @type Float32Array
     */
    this._m3fNormalMatrix = null;
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
    this._v3fWorldPosition = null;
    /**
     * World Right
     * @private
     * @type Float32Array
     */
    this._v3fWorldRight = null;
    /**
     * World up
     * @private
     * @type Float32Array
     */
    this._v3fWorldUp = null;
    /**
     * World forward
     * @private
     * @type Float32Array
     */
    this._v3fWorldForward = null;

    this._sName = null;
}

EXTENDS(Node, a.ReferenceCounter);

PROPERTY(Node, 'name',
    function () {
        return this._sName;
    },
    function (sName) {
        this._sName = sName;
    });

PROPERTY(Node, 'depth',
    function () {
        var iDepth = -1;
        for (var pNode = this; pNode; pNode = pNode.parent(), ++ iDepth);
        return iDepth;
    });

Node.prototype.setName = function (sName) {
    'use strict';
    
    this._sName = sName;
};

Node.prototype.getName = function () {
    'use strict';
    
    return this._sName;
};


Node.prototype.parent = function () {
    INLINE();
    return this._pParent;
};


/**
 * Get sibling
 * @treturn SceneNode _pSibling
 */
Node.prototype.sibling = function () {
    INLINE();
    return this._pSibling;
};
/**
 * Get child
 * @treturn SceneNode _pChild
 */
Node.prototype.child = function () {
    INLINE();
    return this._pChild;
};
/**
 * Get worldMatrix
 * @treturn Float32Array _m4fWorldMatrix
 */
Node.prototype.worldMatrix = function () {
    INLINE();
    return this._m4fWorldMatrix;
};
/**
 * Get normal matrix
 * @treturn Matrix3 _m4fWorldMatrix
 */
Node.prototype.normalMatrix = function () {
    if (TEST_BIT(this._iUpdateFlags, a.Scene.k_rebuildNormalMatrix)) {
        Mat3.transpose(Mat4.toInverseMat3(this._m4fWorldMatrix, this._m3fNormalMatrix));
        CLEAR_BIT(this._iUpdateFlags, a.Scene.k_rebuildNormalMatrix);
    }
    return this._m3fNormalMatrix;
};

/**
 * Get localMatrix
 * @treturn Float32Array _m4fLocalMatrix
 */
Node.prototype.localMatrix = function () {
    INLINE();
    return this._m4fLocalMatrix;
};
/**
 * Get inverseWorldMatrix
 * @treturn Float32Array _m4fInverseWorldMatrix
 */
Node.prototype.inverseWorldMatrix = function () {
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
Node.prototype.updateFlags = function () {
    INLINE();
    return this._iUpdateFlags;
};

/**
* Parent is not undef
* @treturn Boolean
*/
Node.prototype.hasParent = function () {
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
Node.prototype.hasChild = function () {
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
Node.prototype.hasSibling = function () {
    INLINE();
    if (this._pSibling) {
        return true;
    }
    return false;
};
/**
* SET_BIT(_iUpdateFlags, k_newLocalMatrix);
*/
Node.prototype.setUpdatedLocalMatrixFlag = function () {
    INLINE();
    SET_BIT(this._iUpdateFlags, a.Scene.k_newLocalMatrix);
};
/**
* Get loclaMatrix with some set_bits
* @treturn Float32Array _m4fLocalMatrix
*/
Node.prototype.accessLocalMatrix = function () {
    INLINE();
    this.setUpdatedLocalMatrixFlag();
    SET_BIT(this._iUpdateFlags, a.Scene.k_ignoreOrientation);
    return this._m4fLocalMatrix;
};


/**
* Test bit k_newWorldMatrix
* @treturn Boolean
*/
Node.prototype.isWorldMatrixNew = function () {
    INLINE();
    return TEST_BIT(this._iUpdateFlags, a.Scene.k_newWorldMatrix);
};

Node.prototype.create = function () {
    return true;
};
Node.prototype.destroy = function () {
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
};
/**
 * Sets the internal pointer to the First sibling object
 * @tparam SceneNode pNode
 * @private
 */
Node.prototype.setSibling = function (pNode) {
    this._pSibling = pNode;
};
/**
 * Sets the internal pointer to the First child object
 * @tparam SceneNode pNode
 * @private
 */
Node.prototype.setChild = function (pNode) {
    this._pChild = pNode;
};
/**
 * Adds the provided ModelSpace object to the descendant list of this object. The provided
 * ModelSpace object is removed from any parent it may already belong to.
 * @tparam SceneNode pSibling
 * @private
 */
Node.prototype.addSibling = function (pSibling) {
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
Node.prototype.addChild = function (pChild) {
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
Node.prototype.removeChild = function (pChild) {
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
Node.prototype.removeAllChildren = function () {
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
Node.prototype.attachToParent = function (pParent) {
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
Node.prototype.setInheritance = function (iSetting) {
    this._iInheritance = iSetting;
};
/**
 * Detach this object from his parent. Refresh local and world matrix
 */
Node.prototype.detachFromParent = function () {
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
Node.prototype.promoteChildren = function () {
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
Node.prototype.relocateChildren = function (pParent) {
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
Node.prototype.isASibling = function (pSibling) {
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
Node.prototype.isAChild = function (pChild) {
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
Node.prototype.isInFamily = function (pNode, SearchEntireTree) {
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
Node.prototype.siblingCount = function () {
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
Node.prototype.childCount = function () {
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
Node.prototype.update = function () {
    // derived classes update the local matrix
    // then call this base function to complete
    // the update
    this.recalcWorldMatrix();
};
Node.prototype.prepareForUpdate = function () {
    // clear the temporary flags
    a.BitFlags.clearFlags(this._iUpdateFlags, FLAG(a.Scene.k_newLocalMatrix) | FLAG(a.Scene.k_newWorldMatrix));
};

Node.prototype.recursiveUpdate = function () {
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
 * Recalculate world Matrix
 */
Node.prototype.recalcWorldMatrix = function () {
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
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_rebuildNormalMatrix, true);
        return true;
    }

    return false;
};
/**
 * Update world vectors(up, right, up, forward, position) from worldMatrix
 */
Node.prototype.updateWorldVectors = function () {
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
Node.prototype.worldPosition = function () {
    this.updateWorldVectors();
    return this._v3fWorldPosition;
};
/**
 * Getter for worldRight vector
 * @treturn Float32Array _v3fWorldRight
 */
Node.prototype.worldRight = function () {
    this.updateWorldVectors();
    return this._v3fWorldRight;
};
/**
 * Getter for worldUp vecror
 * @treturn Float32Array _v3fWorldUp
 */
Node.prototype.worldUp = function () {
    this.updateWorldVectors();
    return this._v3fWorldUp;
};
/**
 * Getter for worldForward vecror
 * @treturn Float32Array _v3fWorldForward
 */
Node.prototype.worldForward = function () {
    this.updateWorldVectors();
    return this._v3fWorldForward;
};
Node.prototype.getUp = Node.prototype.worldUp;
Node.prototype.getRight = Node.prototype.worldRight;
Node.prototype.getForward = Node.prototype.worldForward;
Node.prototype.getPosition = Node.prototype.worldPosition;


/**
 * Set new position.
 * _v3fPostion = pPos
 * @tparam Float32Array pPos 3d vector
 */
Node.prototype.setPosition = function () {
    var pPos = arguments.length === 1? arguments[0]: arguments;

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
Node.prototype.setRelPosition = function () {
    var pPos = arguments.length === 1? arguments[0]: arguments;
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
Node.prototype.addPosition = function (pPos) {
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
Node.prototype.addRelPosition = function (pPos) {
    var m4fLocal = this._m4fLocalMatrix;
    var fX, fY, fZ;
    if (arguments.length < 3) {
        fX = pPos.X, fY = pPos.Y, fZ = pPos.Z;
    }
    else {
        fX = arguments.X;
        fY = arguments.Y;
        fZ = arguments.Z;
    }
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
Node.prototype.setRotation = function () {
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
Node.prototype.addRelRotation = function () {
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
Node.prototype.addRotation = function () {
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
Node.prototype.setScale = function (scale) {
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


Ifdef (__DEBUG);

Node.prototype.dumpHierarchy = function (iDepth, pParent) {
    'use strict';

    iDepth = iDepth || 0;
    pParent = pParent || null;

    var sName = this.getName();
    var pNode = {
        name: sName || 'unknown',
        id: iDepth,
        data: {},
        children: []
    };

    var pSibling = this.sibling();
    var pChild = this.child();

    if (pSibling) {
        pSibling.dumpHierarchy(iDepth + 0.01, pParent);
    }

    if (pChild) {
        pChild.dumpHierarchy(Math.floor(iDepth) + 1, pNode);
    }

    if (pParent) {
        pParent.children.push(pNode);
    }

    return pNode;
};


Node.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    iDepth = iDepth || 0;
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        return '<node' + (this._sName? ' ' + this._sName: '') + '>';
    }

    var pSibling = this.sibling();
    var pChild = this.child();
    var s = '';

    for (var i = 0; i < iDepth; ++ i) {
        s += ':  ';
    }

    s += '+----[depth: ' + this.depth + ']' + this.toString() + '\n';

    if (pChild) {
        s += pChild.toString(true, iDepth + 1);
    }

    if (pSibling) {
        s += pSibling.toString(true, iDepth);
    }

    return s;
};

Endif ();

A_NAMESPACE(Node);