
/**
 * Scene object Class
 * @extends SceneNode
 * @ctor
 * Constructor.
 * The constructor initializes all papams for SceneObject
 */
function SceneObject (pEngine) {

    A_CLASS;

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

a.extend(SceneObject, SceneNode);

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
    var result = SceneNode.prototype.create.call(this);
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
    //SceneObject.superclass.update.apply(this, arguments);
    SceneNode.prototype.update.call(this);
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

Ifdef (__DEBUG);

SceneObject.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        return '<scene_object' + (this._sName? ' ' + this._sName: '') + '>';
    }

    return SceneNode.prototype.toString.call(this, isRecursive, iDepth);
}

Endif ();

A_NAMESPACE(SceneObject);