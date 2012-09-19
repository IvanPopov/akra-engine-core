/**
 * @author Ivan Popov
 * Scene Model class.
 */

function SceneModel(pEngine, pMesh) {
    A_CLASS;

    /**
     * @private
     * @type Uint
     * Frame index.
     */
    this._iModelFrameIndex = 0;
    this._hModelHandle = 0;
    this._pMeshes = [];

    this._fnRenderCallback = null;
    this._isStandAlone = false;

    if (pMesh) {
        this.addMesh(pMesh);
    }
}

EXTENDS(SceneModel, a.SceneObject);

/**
 * create resource.
 */
SceneModel.prototype.create = function () {
    SceneObject.prototype.create.call(this);
    this._hasShadow = null;
};


/**
 * destroy resource.
 */
SceneModel.prototype.destroy = function () {
    this._iModelFrameIndex = 0;

    safe_delete(this._pMesh);
    parent.destroy(this);
};

SceneModel.prototype.destructor = function () {
    'use strict';
    this.destroy();
};

SceneModel.prototype.setRenderCallback = function (fnCallback, isStandAlone) {
    this._fnRenderCallback = fnCallback;
    this._isStandAlone = (isStandAlone === undefined) ? false : true;
};
SceneModel.prototype.prepareForRender = function () {
    // var pMesh = this.findMesh();
    // if (!pMesh) {
    //     return;
    // }
    // var pSkin = pMesh[0].getSkin();
    // var pAnimations = this.pAnimations;
    // if (pSkin && pAnimations) {

    //     for (var i = 0; i < pAnimations.length; ++ i) {
    //         pAnimations[i].play(a.now() / 1000.0);
    //     }  
    // }
};

SceneModel.prototype.render = function () {
    parent.render(this);
//    A_TRACER.BEGIN();


    if (this._fnRenderCallback) {
        this._fnRenderCallback.call(this);
        if (this._isStandAlone) {
            return;
        }
    }

    trace("<<<<<<<<<<<<<SCENE MODEL RENDER>>>>>>>>>>", this.findMesh());

    var pMeshes = this._pMeshes,
        pRenderer = this._pEngine.shaderManager(),
        pMesh, pSubMesh;
    var i, j, k;
    var isSkinning;
    if (!pMeshes || pMeshes.length === 0) {
        return false;
    }

    pRenderer.activateSceneObject(this);
    pRenderer.setViewport(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);

    for (i = 0; i < pMeshes.length; i++) {
        pMesh = pMeshes[i];
        if (!pMesh || !pMesh.isReadyForRender()) {
            return;
        }

        for (j = 0; j < pMesh.length; j++) {
            pSubMesh = pMesh[j];
            pSubMesh.switchRenderMethod(pSubMesh.name);
            pSubMesh.startRender();
            isSkinning = this._pEngine.pEngineStates.mesh.isSkinning = pSubMesh.isSkinned();
            if (isSkinning) {
                pSubMesh.skin.applyBoneMatrices();
            }
            for (k = 0; k < pSubMesh.totalPasses(); k++) {
                pSubMesh.activatePass(k);
                pSubMesh.applySurfaceMaterial();
//                trace("SCENE MODEL NAME: ", this.name + ":" + pSubMesh.name, pSubMesh.data.toString());
                pSubMesh.applyRenderData(pSubMesh.data);
                var pEntry = pSubMesh.renderPass();
                trace("SceneModel.prototype.render", this, pEntry.pUniforms, pEntry.pTextures);
                pSubMesh.deactivatePass();
            }
            pSubMesh.finishRender();
        }
    }
    pRenderer.deactivateSceneObject();
//    A_TRACER.END();
    trace("<<<<<<<<<<<<<END SCENE MODEL RENDER>>>>>>>>>>");
    return true;
};

SceneModel.prototype.renderShadow = function () {
    if (!this.hasShadow()) {
        return false;
    }
    trace("<<<<<<<<<<<<<START SCENE MODEL SHADOW RENDER>>>>>>>>>>");
    var pMeshes = this._pMeshes,
        pRenderer = this._pEngine.shaderManager(),
        pMesh, pSubMesh;
    var i, j, k;
    var isSkinning;

    if (!pMeshes || pMeshes.length === 0) {
        return false;
    }

    pRenderer.activateSceneObject(this);
    pRenderer.setViewport(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);

    for (i = 0; i < pMeshes.length; i++) {
        pMesh = pMeshes[i];
        if (!pMesh || !pMesh.isReadyForRender()) {
            return;
        }

        for (j = 0; j < pMesh.length; j++) {
            pSubMesh = pMesh[j];
            if (!pSubMesh.hasShadow()) {
                continue;
            }
            pSubMesh.switchRenderMethod('.prepare_shadows');
            pSubMesh.startRender();
            isSkinning = this._pEngine.pEngineStates.mesh.isSkinning = pSubMesh.isSkinned();
            if (isSkinning) {
                pSubMesh.skin.applyBoneMatrices();
            }
            this._pEngine.pEngineStates.isAdvancedIndex = false;
            for (k = 0; k < pSubMesh.totalPasses(); k++) {
                pSubMesh.activatePass(k);
                pSubMesh.applyRenderData(pSubMesh.data);
                trace("SceneModel.prototype.renderShadow", pSubMesh.renderPass());
                pSubMesh.deactivatePass();
            }
            pSubMesh.finishRender();
        }
    }
    pRenderer.deactivateSceneObject();
    trace("<<<<<<<<<<<<<END SCENE MODEL SHADOW RENDER>>>>>>>>>>");
    return true;
};

SceneModel.prototype.setShadow = function () {
    var pMeshes = this._pMeshes, pMesh;
    var i, j
    if (!pMeshes || pMeshes.length === 0) {
        return false;
    }
    for (i = 0; i < pMeshes.length; i++) {
        pMesh = pMeshes[i];
        for (j = 0; j < pMesh.length; j++) {
            pMesh[j].hasShadow(true);
        }
    }
    this._hasShadow = true;
    return true;
};

SceneModel.prototype.hasShadow = function () {
    if (this._hasShadow === null) {
        var pMeshes = this._pMeshes, pMesh;
        var i, j
        if (!pMeshes || pMeshes.length === 0) {
            this._hasShadow = false;
            return false;
        }
        for (i = 0; i < pMeshes.length; i++) {
            pMesh = pMeshes[i];
            for (j = 0; j < pMesh.length; j++) {
                if (pMesh[j].hasShadow()) {
                    this._hasShadow = true;
                    return true;
                }
            }
        }
        this._hasShadow = false;
        return false;
    }
    else {
        return this._hasShadow;
    }
};

SceneModel.prototype.resetShadow = function () {
    this._hasShadow = null;
};
// /**
//  *
//  * @tparam ModelResource pModel
//  * @tparam Uint iFrameIndex
//  */
// SceneModel.prototype.setModelResource = function (pModel, iFrameIndex) {
//     safe_release(this._pModelResource);
//     iFrameIndex = iFrameIndex || 0;

//     this._nTotalBoneMatrices = 0;
//     this._iModelFrameIndex = iFrameIndex;
//     this._pModelResource = pModel;

//     if (this._pModelResource) {
//         this._pModelResource.addRef();

//         this.accessLocalBounds().eq(this.boundingBox());
//     }
// };

SceneModel.prototype.addMesh = function (pMesh) {
    'use strict';
    if (!pMesh) {
        return false;
    }
    this._pMeshes.push(pMesh);
    return true;
};

SceneModel.prototype.findMesh = function (iMesh) {
    'use strict';
    iMesh = iMesh || 0;
    return this._pMeshes[iMesh] || null;
};

SceneModel.prototype.getMeshList = function () {
    'use strict';

    return this._pMeshes.slice();
};

Ifdef(__DEBUG);

SceneModel.prototype.toString = function (isRecursive, iDepth) {
    'use strict';

    isRecursive = isRecursive || false;

    if (!isRecursive) {
        var sData = '<model' + (this._sName ? ' ' + this._sName : '') + '(' + this._pMeshes.length + ')' + '>';

        if (this._pMeshes.length) {

            sData += '( ';

            for (var i = 0; i < this._pMeshes.length; i++) {
                sData += (i > 0 ? ',' : '') + this._pMeshes[i].name;
            }
            ;

            sData += ' )';

        }

        return sData;
    }

    return SceneObject.prototype.toString.call(this, isRecursive, iDepth);
}

Endif();

A_NAMESPACE(SceneModel);
