
/**
 * Scene node Class
 * @extends ReferenceCounter
 * @ctor
 * Constructor.
 * The constructor initializes all papams for SceneNode
 */
function SceneNode (pEngine) {
    A_CLASS;

    debug_assert(pEngine, "SceneNode. Engine не передан");

    this._pEngine = pEngine;
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
}

EXTENDS(SceneNode, Node);

/**
 * Set Local and World Natrix identify
 * @treturn Boolean
 */
SceneNode.prototype.create = function () {
    this._m4fLocalMatrix        = new Matrix4;
    this._m4fWorldMatrix        = new Matrix4;
    this._m4fInverseWorldMatrix = new Matrix4;
    this._m3fNormalMatrix       = new Matrix3;
    
    this._v3fWorldPosition  = new Vector3();
    this._v3fTranslation    = new Vector3(0, 0, 0);
    this._v3fScale          = new Vector3(1, 1, 1);
    this._qRotation         = new Quaternion(0, 0, 0, 1);


    Mat4.identity(this._m4fLocalMatrix);
    Mat4.identity(this._m4fWorldMatrix);
    //Mat4.identity(this._m4fInverseWorldMatrix);
    return true;
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
};
/**
 * Destroys the object. The object is removed from it's parent (if any) and all Children
 * Objects are orphaned (parent set to NULL).
 */
SceneNode.prototype.destroy = function () {
    parent.destroy();
    // release any group information
    this.releaseGroupData();
    // clear pLink information
    this._pSubNodeGroupOwner = null;
};
/**
 * Update matrix
 */
SceneNode.prototype.update = function () {
    Node.prototype.update.call(this);
    // if there is a group attached, update it
    if (this._pSubNodeGroupData) {
        this._pSubNodeGroupData.update();
    };
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
 * By default, scene nodes do not render.
 * Derived classes must provide
 * any functionality needed.
 */
SceneNode.prototype.render = function () {
};
/**
 * If we queued ourselved for rendering with the
 * display manager, we will get this function
 * called when it is our turn to render.
 * iActivationFlags contains a set of bit flags
 * held in the eActivationFlagBits enum
 * which tell us what resources we need to activate
 * in order to render ourselves.
 * @tparam RenderEntry pEntry
 * @tparam Int iActivationFlags
 */
SceneNode.prototype.renderCallback = function (pEntry, iActivationFlags) {
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
            var node = new a.SceneNode();
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
Ifdef (__DEBUG);

SceneNode.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        return '<scene_node' + (this._sName? ' ' + this._sName: '') + '>';
    }

    return Node.prototype.toString.call(this, isRecursive, iDepth);
}

Endif ();

A_NAMESPACE(SceneNode);