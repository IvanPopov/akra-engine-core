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
            pLocalMatrix.set(this._pModelResource.frame(i).TransformationMatrix);

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

A_NAMESPACE(SubNodeGroup);