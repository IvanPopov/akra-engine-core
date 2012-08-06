var TEMPSCENEVECTOR3FORCALC0 = Vec3.create();
var TEMPSCENEMATRIX4FORCALC0 = Mat4.create();
var TEMPSCENEVECTOR4FORCALC0 = Vec4.create();
var TEMPSCENEMATRIX3FORCALC0 = Mat3.create();
var TEMPSCENEQUAT4FORCALC0   = Quat4.create();

function Node(){
    A_CLASS;
    Enum([
             k_setForDestruction = 0,
             k_newOrientation,
             k_newWorldMatrix,
             k_newLocalMatrix,
             k_rebuildInverseWorldMatrix,
             k_rebuildNormalMatrix,
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

    //orientation matrix
    this._qRotation = null;
    this._v3fTranslation = null;
    this._v3fScale = null;

    /**
     * World Posistion
     * @private
     * @type Float32Array
     */
    this._v3fWorldPosition = null;

    /**
     * Node name. Optional.
     * @type {String}
     */
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

Node.prototype.findNode = function (sNodeName) {
    'use strict';

    var pNode = null;

    if (this._sName === sNodeName) {
        return this;
    }

    if (this._pSibling) {
        pNode = this._pSibling.findNode(sNodeName);
    }

    if (pNode == null && this._pChild) {
        pNode = this._pChild.findNode(sNodeName);
    }

    return pNode;
};

Node.prototype.childOf = function (pParent) {
    'use strict';
    
    for (var pNode = this; pNode; pNode = pNode.parent()) {
        if (pNode.parent() === pParent) {
            return true;
        }
    }

    return false;
};

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
 * Getter for worldPosistion vector
 * @treturn Float32Array _v3fWorldPostion
 */
Node.prototype.worldPosition = function () {
    return this._v3fWorldPosition;
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
* SET_BIT(_iUpdateFlags, k_newOrientation);
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

Node.prototype.isLocalMatrixNew = function () {
    'use strict';
    
    return TEST_BIT(this._iUpdateFlags, a.Scene.k_newLocalMatrix);
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
    'use strict';
    
    this._pSibling = pNode;
};

/**
 * Sets the internal pointer to the First child object
 * @tparam SceneNode pNode
 * @private
 */
Node.prototype.setChild = function (pNode) {
    'use strict';
    
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
            // console.log("attachToParent-->", this.name, " Parent: ",Mat4.str(this._pParent._m4fWorldMatrix), 
            //             "inverse :", Mat4.str(invertedParentMatrix),
            //             "Local :", Mat4.str(this._m4fLocalMatrix));
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
    a.BitFlags.clearFlags(this._iUpdateFlags, FLAG(a.Scene.k_newLocalMatrix) | 
        FLAG(a.Scene.k_newOrientation) | FLAG(a.Scene.k_newWorldMatrix));
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

    //this.prepareForUpdate();
};

Node.prototype.recursivePreUpdate = function () {
    'use strict';
    
    // clear the flags from the previous update
    this.prepareForUpdate();

    // update my sibling
    if (this._pSibling) {
        this._pSibling.recursivePreUpdate();
    }
    // update my child
    if (this._pChild) {
        this._pChild.recursivePreUpdate();
    }
};

/**
 * Recalculate world Matrix
 */
Node.prototype.recalcWorldMatrix = function () {
    'use strict';
    
    var isParentMoved = this._pParent && this._pParent.isWorldMatrixNew();
    var isOrientModified = TEST_BIT(this._iUpdateFlags, a.Scene.k_newOrientation);
    var isLocalModified = TEST_BIT(this._iUpdateFlags, a.Scene.k_newLocalMatrix);

    if (isOrientModified || isParentMoved || isLocalModified) {

        var m4fLocal = this._m4fLocalMatrix;
        var m4fWorld = this._m4fWorldMatrix;
        var m4fParent = this._pParent.worldMatrix();
        var m4fOrient = TEMPSCENEMATRIX4FORCALC0;
        var v3fTemp = TEMPSCENEVECTOR3FORCALC0;

        Quat4.toMat4(this._qRotation, m4fOrient);
        Mat4.setTranslation(m4fOrient, this._v3fTranslation);
        Mat4.scale(m4fOrient, this._v3fScale);

        if (TEST_BIT(this._iUpdateFlags, a.Scene.k_newLocalMatrix)) {
            Mat4.multiply(m4fOrient, m4fLocal); 
        }

        if (this._pParent) {
            if (this._iInheritance === a.Scene.k_inheritAll) {
                Mat4.multiply(m4fParent, m4fOrient, m4fWorld);
            }
            else if (this._iInheritance === a.Scene.k_inheritPositionOnly) {
                Mat4.set3x3(m4fOrient, m4fWorld);
                m4fWorld._41 = m4fOrient._41;
                m4fWorld._42 = m4fOrient._42;
                m4fWorld._43 = m4fOrient._43;
                m4fWorld._14 = m4fParent._14 + m4fOrient._14;
                m4fWorld._24 = m4fParent._24 + m4fOrient._24;
                m4fWorld._34 = m4fParent._34 + m4fOrient._34;
                m4fWorld._44 = m4fOrient._44;
            }
            else if (this._iInheritance === a.Scene.k_inheritRotScaleOnly) {
                var p11 = m4fParent._11, p12 = m4fParent._12,
                    p13 = m4fParent._13;
                var p21 = m4fParent._21, p22 = m4fParent._22,
                    p23 = m4fParent._23;
                var p31 = m4fParent._31, p32 = m4fParent._32,
                    p33 = m4fParent._33;
                var l11 = m4fOrient._11, l12 = m4fOrient._12,
                    l13 = m4fOrient._13;
                var l21 = m4fOrient._21, l22 = m4fOrient._22,
                    l23 = m4fOrient._23;
                var l31 = m4fOrient._31, l32 = m4fOrient._32,
                    l33 = m4fOrient._33;
                m4fWorld._11 = p11 * l11 + p12 * l21 + p13 * l31;
                m4fWorld._12 = p11 * l12 + p12 * l22 + p13 * l32;
                m4fWorld._13 = p11 * l13 + p12 * l23 + p13 * l33;
                m4fWorld._14 = m4fOrient._14;
                m4fWorld._21 = p21 * l11 + p22 * l21 + p23 * l31;
                m4fWorld._22 = p21 * l12 + p22 * l22 + p23 * l32;
                m4fWorld._23 = p21 * l13 + p22 * l23 + p23 * l33;
                m4fWorld._24 = m4fOrient._24;
                m4fWorld._31 = p31 * l11 + p32 * l21 + p33 * l31;
                m4fWorld._32 = p31 * l12 + p32 * l22 + p33 * l32;
                m4fWorld._33 = p31 * l13 + p32 * l23 + p33 * l33;
                m4fWorld._34 = m4fOrient._34;

                m4fWorld._41 = m4fOrient._41;
                m4fWorld._42 = m4fOrient._42;
                m4fWorld._43 = m4fOrient._43;
                m4fWorld._44 = m4fOrient._44;
            }
        }
        else {
            Mat4.set(m4fOrient, m4fWorld);
        }

        this._v3fWorldPosition.X = m4fWorld._14;
        this._v3fWorldPosition.Y = m4fWorld._24;
        this._v3fWorldPosition.Z = m4fWorld._34;

        // set the flag that our world matrix has changed
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newWorldMatrix, true);
        // and it's inverse & vectors are out of date
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_rebuildInverseWorldMatrix, true);
        a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_rebuildNormalMatrix, true);
        return true;
    }

    return false;
};


/**
 * Set new position.
 * _v3fPostion = pPos
 * @tparam Float32Array pPos 3d vector
 */
Node.prototype.setPosition = function () {
    'use strict';
    
    var pPos = arguments.length === 1? arguments[0]: arguments;
    var v3fTranslation = this._v3fTranslation;

    v3fTranslation.X = pPos.X;
    v3fTranslation.Y = pPos.Y;
    v3fTranslation.Z = pPos.Z;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
};
/**
 * Set new relative position.
 * _v3fPostion = _v3fRight*pPos.X + _v3fUp*pos.Y + _v3fForward*pos.Z
 * @tparam Float32Array pPos 3d vector
 */
Node.prototype.setRelPosition = function () {
    'use strict';
    
    var pPos = arguments.length === 1? arguments[0]: arguments;
    var v3fTranslation = this._v3fTranslation;

    Quat4.multiplyVec3(this._qRotation, pPos);

    v3fTranslation.X = pPos.X;
    v3fTranslation.Y = pPos.Y;
    v3fTranslation.Z = pPos.Z;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
};
/**
 * Add new position.
 * _v3fPostion += pPos
 * @tparam Float32Array pPos 3d vector
 */
Node.prototype.addPosition = function () {
    'use strict';
    
    var pPos = arguments.length === 1? arguments[0]: arguments;
    var v3fTranslation = this._v3fTranslation;
    
    v3fTranslation.X += pPos.X;
    v3fTranslation.Y += pPos.Y;
    v3fTranslation.Z += pPos.Z;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
};
/**
 * Add new relative position.
 * _v3fPostion += _v3fRight*pPos.X + _v3fUp*pos.Y + _v3fForward*pos.Z
 * @tparam Float32Array pPos 3d vector
 */
Node.prototype.addRelPosition = function () {
    'use strict';
    
    var pPos = arguments.length === 1? arguments[0]: arguments;
    var v3fTranslation = this._v3fTranslation;


    Quat4.multiplyVec3(this._qRotation, pPos);
    
    v3fTranslation.X += pPos.X;
    v3fTranslation.Y += pPos.Y;
    v3fTranslation.Z += pPos.Z;

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
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
    'use strict';

    var qTemp = TEMPSCENEQUAT4FORCALC0;

    switch (arguments.length) {
        case 1:
            //from matrix3 or matrix4
            Mat4.toQuat4(arguments[0], this._qRotation);
            break;
        case 2:

            if (typeof arguments[1] == "number") {
                //from axis and angle
                Quat4.fromAxisAngle(arguments[0], arguments[1], this._qRotation);
            }
            else if (typeof arguments[0] == "number") {
                //from angle & axis
                Quat4.fromAxisAngle(arguments[1], arguments[0], this._qRotation);
            }
            else {
                //from forward & up
                Quat4.fromForwardUp(arguments[0], arguments[1], this._qRotation);
            }
            break;
        case 3:
            //from euler angles
            Quat4.fromYPR(arguments[0], arguments[1], arguments[2], this._qRotation);
            break;
        case 4:
            //from (x, y, z, angle)
            Quat4.fromAxisAngle(arguments, arguments[3], qTemp);
    }

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
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
    'use strict';

    var qTemp = TEMPSCENEQUAT4FORCALC0;
    
    switch (arguments.length) {
        case 1:
            Mat4.toQuat4(arguments[0], qTemp);
            break;
        case 2:
             if (typeof arguments[1] == "number") {
                //from axis and angle
                Quat4.fromAxisAngle(arguments[0], arguments[1], qTemp);
            }
            else if (typeof arguments[0] == "number") {
                //from angle & axis
                Quat4.fromAxisAngle(arguments[1], arguments[0], qTemp);
            }
            else {
                Quat4.fromForwardUp(arguments[0], arguments[1], qTemp);
            }
        case 3:
            Quat4.fromYPR(arguments[0], arguments[1], arguments[2], qTemp);
            break;
        case 4:
            //from (x, y, z, angle)
            Quat4.fromAxisAngle(arguments, arguments[3], qTemp);
    }
    

    Quat4.multiply(qTemp, this._qRotation, this._qRotation);
    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
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
/*Node.prototype.addRotation = function () {
    'use strict';
    
    var qTemp = TEMPSCENEQUAT4FORCALC0;
    
    switch (arguments.length) {
        case 1:
            Mat4.toQuat4(arguments[0], qTemp);
            break;
        case 2:
             if (typeof arguments[1] == "number") {
                //from axis and angle
                Quat4.fromAxisAngle(arguments[0], arguments[1], qTemp);
            }
            else if (typeof arguments[0] == "number") {
                //from angle & axis
                Quat4.fromAxisAngle(arguments[1], arguments[0], qTemp);
            }
            else {
                Quat4.fromForwardUp(arguments[0], arguments[1], qTemp);
            }
        case 3:
            Quat4.fromYPR(arguments[0], arguments[1], arguments[2], qTemp);
            break;
        case 4:
            //from (x, y, z, angle)
            Quat4.fromAxisAngle(arguments, arguments[3], qTemp);
    }
    

    Quat4.multiply(this._qRotation, qTemp);

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
};
*/

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
    'use strict';
    
    var pScale = arguments.length === 1? arguments[0]: arguments;
    var v3fScale = this._v3fScale;

    if (typeof pScale === 'number') {
        Vec3.set(pScale, pScale, pScale, v3fScale);
    }
    else {
        Vec3.set(pScale, v3fScale);
    }

    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
};

Node.prototype.multScale = function (scale) {
    'use strict';
    
    var pScale = arguments.length === 1? arguments[0]: arguments;
    var v3fScale = this._v3fScale;

    if (typeof pScale === 'number') {
        v3fScale.X *= pScale;
        v3fScale.Y *= pScale;
        v3fScale.Z *= pScale;
    }
    else {
        v3fScale.X *= pScale.X;
        v3fScale.Y *= pScale.Y;
        v3fScale.Z *= pScale.Z;
    }
    
    a.BitFlags.setBit(this._iUpdateFlags, a.Scene.k_newOrientation, true);
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