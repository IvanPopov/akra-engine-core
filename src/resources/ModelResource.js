/**
 * @file
 * @author Ivan Popov
 */

/**
 * Class for loading additional information from models.
 * @file
 */

function ModelResource(pEngine) {
    A_CLASS;


    this._pRootNodeList = [];
    this._pAnimController = new a.AnimationController(pEngine);
    this._pMeshList = [];
    this._pSkeletonList = [];

    this._nFilesToBeLoaded = 0;
    this._pNode = null;
}

EXTENDS(ModelResource, a.ResourcePoolItem);

PROPERTY(ModelResource, 'totalAnimations',
         function () {
             return this._pAnimController.totalAnimations;
         });

PROPERTY(ModelResource, 'totalMeshes',
    function () {
        return this._pMeshList.length;
    });

PROPERTY(ModelResource, 'node',
         function () {
             return this._pNode;
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


ModelResource.prototype.setAnimation = function (iAnim, pAnimation) {
    'use strict';

    this._pAnimController.setAnimation(iAnim, pAnimation);
};

ModelResource.prototype.addAnimation = function (pAnimation) {
    'use strict';
    //TODO: this method    
    this._pAnimController.addAnimation(pAnimation);
    this.setAlteredFlag(true);
};

ModelResource.prototype.getAnimationController = function () {
    'use strict';

    return this._pAnimController;
};

ModelResource.prototype.addMesh = function (pMesh) {
    'use strict';

    this._pMeshList.push(pMesh);
    this.setAlteredFlag(true);
};

ModelResource.prototype.getMesh = function (iMesh) {
    'use strict';
    
    return this._pMeshList[iMesh];
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
    var pRoot = new a.SceneNode(this._pEngine);
    pRoot.create();
    pRoot.setInheritance(a.Scene.k_inheritAll);
    pRoot.attachToParent(this._pEngine.getRootNode());
    
    for (var i = 0; i < pNodes.length; ++i) {
        pNodes[i].attachToParent(pRoot);
    }
    this._pAnimController.bind(pRoot);
    this._pNode = pRoot;

    //--------------
    // var pMeshNode;

    // for (var i = 0; i < this._pMeshList.length; ++ i) {
    //     pMeshNode = new a.SceneModel(this.getEngine());
    //     pMeshNode.create();
    //     pMeshNode.setInheritance(a.Scene.k_inheritAll);
    //     pMeshNode.attachToParent(this._pNode);
    //     pMeshNode.addMesh(this._pMeshList[i]);
    // }
};

ModelResource.prototype.getRootNodes = function () {
    'use strict';

    return this._pRootNodeList;
};


ModelResource.prototype.loadResource = function (sFilename, pOptions) {
    'use strict';

    var me = this;
    var fnCustomCallback = (pOptions && pOptions.success) ? pOptions.success : null;

    var fnCallback = function () {
        if (me.isResourceLoaded()) {
            me.setAlteredFlag();
        }

        fnSuccess();

        if (fnCustomCallback) {
            fnCustomCallback.call(me);
        }
    };

    var fnSuccess = function () {
        me._nFilesToBeLoaded--;

        if (me._nFilesToBeLoaded == 0) {
            if (fnCustomCallback == null) {
                me.notifyLoaded();
            }

            me.notifyRestored();
        }
    };


    me._nFilesToBeLoaded++;
    me.notifyDisabled();

    //trace('>> load animation >> ', sFilename);
    if (a.pathinfo(sFilename).ext.toLowerCase() === 'dae') {

        pOptions = pOptions || {drawJoints : false, wireframe : false};
        pOptions.file = sFilename;
        pOptions.modelResource = this;

        pOptions.success = fnCallback;

        a.COLLADA(this._pEngine, pOptions);

        return true;
    }

    if (a.pathinfo(sFilename).ext.toLowerCase() === 'aac') {

        a.fopen(sFilename, "rb").read(function (pData) {
            me._pAnimController = a.undump(pData, {engine : me.getEngine()});
            fnCallback();
        });

        return true;
    }

    fnSuccess();

    return false;
}

ModelResource.prototype.loadAnimation = function (sFilename) {
    'use strict';

    return this.loadResource(sFilename,
                             {
                                 scene             : false,
                                 animation         : true,
                                 extractPoses      : false,
                                 skeletons         : this._pSkeletonList,
                                 animationWithPose : true
                             });
};

ModelResource.prototype.applyShadow = function () {
    var pMeshes = this._pMeshList, pMesh, pSubMesh;
    var i, j;
    var pEffectPool = this._pEngine.displayManager().effectPool(),
        pRenderMethodPool = this._pEngine.displayManager().renderMethodPool();
    var pEffect;
    var pRenderMethod = pRenderMethodPool.findResource(".prepare_shadow_for_mesh");
    if (!pRenderMethod) {
        pRenderMethod = pRenderMethodPool.createResource(".prepare_shadow_for_mesh");
        pEffect = pEffectPool.createResource(".prepare_shadow_for_mesh");
        pEffect.create();
        pEffect.use("akra.system.prepareShadows");
        pRenderMethod.effect = pEffect;
    }
    if (!pMeshes || pMeshes.length === 0) {
        return false;
    }
    for (i = 0; i < pMeshes.length; i++) {
        pMesh = pMeshes[i];
        for (j = 0; j < pMesh.length; j++) {
            pSubMesh = pMesh[j];
            pSubMesh.addRenderMethod(pRenderMethod, ".prepare_shadows");
            pSubMesh.hasShadow(true);
        }
    }
};


A_NAMESPACE(ModelResource);

Define(a.ModelManager(pEngine), function () {
    a.ResourcePool(pEngine, a.ModelResource);
});
