/**
 * @file
 * @author Ivan Popov
 */

/**
 * Class for loading additional information from models.
 * @file
 */

function ModelResource (pEngine) {
    A_CLASS;

    
    this._pRootNodeList = [];
    this._pAnimList = [];
    this._pMeshList = [];
    this._pSkeletonList = [];

    this._nFilesToBeLoaded = 0;
}

EXTENDS(ModelResource, a.ResourcePoolItem);

PROPERTY(ModelResource, 'totalAnimations',
    function () {
        return this._pAnimList.length;
    });

ModelResource.prototype.createResource = function () {
    debug_assert(!this.isResourceCreated(),
        "The resource has already been created.");

    this.notifyCreated();
    this.notifyDisabled();

    return true;
};

ModelResource.prototype.destroyResource = function () {
    if (this._pFrameRoot) {
        this._pFrameRoot = 0;
    }

    safe_release(this._pAnimController);

    return true;
};

ModelResource.prototype.disableResource = function () {
    return true;
};
ModelResource.prototype.restoreResource = function () {
    return true;
};

ModelResource.prototype.getAnimation = function (iAnim) {
    'use strict';
    
    return this._pAnimList[iAnim] || null;
};


ModelResource.prototype.addAnimation = function (pAnimation) {
    'use strict';
    //TODO: this method    
    this._pAnimList.push(pAnimation);
    this.setAlteredFlag(true);
};

ModelResource.prototype.addMesh = function (pMesh) {
    'use strict';
    
    this._pMeshList.push(pMesh);
    this.setAlteredFlag(true);
};

ModelResource.prototype.addNode = function (pNode) {
    'use strict';

    //TODO: проверить, что  новый нод не является дочерним для уже существующих.
    this._pRootNodeList.push(pNode);
    this.setAlteredFlag(true);
};

ModelResource.prototype.addSkeleton = function (pSkeleton) {
    'use strict';
    
    this._pSkeletonList.push(pSkeleton);
    this.setAlteredFlag(true);
};

ModelResource.prototype.addToScene = function () {
    'use strict';

    var pNodes = this._pRootNodeList;
    var pRoot = this._pEngine.getRootNode();
    var pAnimations = this._pAnimList;

    for (var i = 0; i < pNodes.length; ++ i) {
        pNodes[i].attachToParent(pRoot);
    }

    for (var i = 0; i < pAnimations.length; ++ i) {
        pAnimations[i].bind(pRoot);
    }
};

ModelResource.prototype.getRootNodes = function () {
    'use strict';
    
    return this._pRootNodeList;
};


ModelResource.prototype.loadResource = function (sFilename, pOptions) {
    'use strict';

    var me = this;
    if (a.pathinfo(sFilename).ext.toLowerCase() === 'dae') {
        
        me._nFilesToBeLoaded ++;
 
        pOptions = pOptions || {drawJoints: false, wireframe: false};
        pOptions.file = sFilename;
        pOptions.modelResource = this;

        pOptions.success = function () {
            me._nFilesToBeLoaded --;

            if (me._nFilesToBeLoaded == 0) {
                me.notifyLoaded();
                me.notifyRestored();
            }
        }
        
        me.notifyDisabled();
        a.COLLADA(this._pEngine, pOptions);

        return true;
    }

    return false;
}

ModelResource.prototype.loadAnimation = function (sFilename) {
    'use strict';
    
    return this.loadResource(sFilename, 
        {
            scene: false, 
            animation: true,
            extractPoses: false, 
            skeletons: this._pSkeletonList,
            animationWithPose: true
        });
};

A_NAMESPACE(ModelResource);

Define(a.ModelManager(pEngine), function () {
    a.ResourcePool(pEngine, a.ModelResource);
});

