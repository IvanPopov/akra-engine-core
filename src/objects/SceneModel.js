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

    //------------------------------------------------
    //Temprary render..
    if (this.bNoRender) {
        return;
    }

    var pEngine = this._pEngine;
    var pCamera = pEngine.getActiveCamera();
    var pMesh = this.findMesh();
    var pProgram = null;
    var pDevice = pEngine.pDevice;
    var pModel = this;

    if (!pMesh || !pMesh.isReadyForRender()) {
        return;
    }

    for (var i = 0; i < pMesh.length; ++ i) {
        var pSubMesh = pMesh[i];
        var pSurface = pSubMesh.surfaceMaterial;

        if (pSubMesh.isSkinned()) {
            if (pSubMesh.surfaceMaterial.totalTextures) {
                pProgram = pEngine.pDrawMeshAnimProgTex;
            }
            else {
                pProgram = pEngine.pDrawMeshAnimProg;
            }
        }
        else if (pSubMesh.data.useAdvancedIndex()) {
            pProgram = pEngine.pDrawMeshI2IProg;
        }
        else if (pSubMesh.surfaceMaterial.totalTextures) {
            pProgram = pEngine.pDrawMeshTexProg;
        }
        else {
            pProgram = pEngine.pDrawMeshProg;
        }

        pProgram.activate();

        if (pSubMesh.data.useAdvancedIndex()) {
            pProgram.applyFloat('INDEX_INDEX_POSITION_OFFSET', 0);
            pProgram.applyFloat('INDEX_INDEX_NORMAL_OFFSET', 1);
            pProgram.applyFloat('INDEX_INDEX_FLEXMAT_OFFSET', 2);
        }
        
        pProgram.applyMatrix4('model_mat', pModel.worldMatrix());
        pProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
        pProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
        pProgram.applyMatrix3('normal_mat', pModel.normalMatrix());
        pProgram.applyVector3('eye_pos', pCamera.worldPosition());


        if (pSubMesh.isSkinned()) {
            pProgram.applyMatrix4('bind_matrix', pSubMesh.skin.getBindMatrix());
            pSubMesh.skin.applyBoneMatrices();
            //trace(pSubMesh.skin.skeleton._pJoints);
        }
        
        if (pSurface.totalTextures) {
            var iTextureFlags = pSurface.textureFlags;
            var iTexActivator = 1;
            
            for (var j = 0; j < a.SurfaceMaterial.maxTexturesPerSurface; ++ j) {
                if (!TEST_BIT(iTextureFlags, j)) {
                    if (j < 4) {
                        pProgram.applySampler2D('TEXTURE' + j, 15);
                    }
                    continue;
                }

                pSurface.texture(j).activate(iTexActivator);
                pProgram.applySampler2D('TEXTURE' + j, iTexActivator);
                iTexActivator ++;
            }
        }

        pSubMesh.draw();
    }
    

    //------------------------------------------------

    // var pDisplayManager = this._pEngine.pDisplayManager;
    // var pMeshSubset = null;

    // for (var i = 0, nSubsets = this._pMesh._pSubsets.length; i < nSubsets; i ++) {
    //     pMeshSubset = this._pMesh._pSubsets[i];

    //     if (!pMeshSubset.isRenderable()) {
    //         continue;
    //     }

    //     var pEffect = pMeshSubset.effect;
    //     var pMaterial = pMeshSubset.surfaceMaterial;
    //     var nPasses = pEffect.totalPasses();

    //     for (var iPass = 0; iPass < nPasses; iPass++) {
    //         var pRenderEntry = pDisplayManager.openRenderQueue();
    //         //TODO: использовать правильные параметры для занесения объекта в очередь.
    //         pRenderEntry.pRendarableObject = pMeshSubset;
    //         pRenderEntry.boneCount = 0;
    //         pRenderEntry.detailLevel = 0;
    //         pRenderEntry.modelType = a.RenderEntry.modelEntry;
    //         pRenderEntry.hModel = this._hModelHandle
    //         pRenderEntry.modelParamA = this._iModelFrameIndex;
    //         pRenderEntry.modelParamB = pMaterial.resourceHandle();
    //         pRenderEntry.renderPass = iPass;
    //         pRenderEntry.pSceneNode = this;
    //         pRenderEntry.userData = 0;

    //         pDisplayManager.closeRenderQueue(pRenderEntry);
    //     }
    // } 
};

SceneModel.prototype.renderCallback = function (pEntry, iActivationFlags) {
/*    return;
    // if we queued ourselved for rendering with the
    // display manager, we will get this function
    // called when it is our turn to render

    // activationFlags contains a set of bit flags
    // held in the eActivationFlagBits enum (render_queue.h)
    // which tell us what resources we need to activate
    // in order to render ourselves.
    //profile_scope(cTerrainSystem_renderSection);
    var pMeshContainer = this.meshContainer();
    var hasSkinModel = pMeshContainer.pSkinInfo != null;

    var iMaterial = pEntry.userData;
    var pMethod = pMeshContainer.ppRenderMethodList[iMaterial];
    var pEffect = pMethod.getEffect(this._pEngine.getCurrentRenderStage());
    var pMaterial = pMethod.getMaterial(this._pEngine.getCurrentRenderStage());

    var bDeactivatePass = false;

    if (pEffect && pMaterial) {
        // do we need to activate the render pass?
        if (TEST_BIT(iActivationFlags, a.RenderQueue.activateRenderMethodPass)
            || TEST_BIT(iActivationFlags, a.RenderQueue.activateRenderMethodParam)
            || TEST_BIT(iActivationFlags, a.RenderQueue.activateRenderMethodLOD)) {
            this._pModelResource.setLOD(this._iLod);
            if (hasSkinModel) {
                nBoneInfluences = pMeshContainer.nBoneInfluences - 1;
                pEffect.setParameter(a.EffectResource.boneInfluenceCount, nBoneInfluences);
            }
            pEffect.activatePass(pEntry.renderPass);
            bDeactivatePass = true;
        }

        // do we need to activate the render method?
        if (TEST_BIT(iActivationFlags, a.RenderQueue.activateRenderMethod)) {
            pEffect.begin();
        }

        // do we need to activate the surface material
        if (TEST_BIT(iActivationFlags, a.RenderQueue.activateSurfaceMaterial)) {
            pEffect.applySurfaceMaterial(pMaterial);
        }

        
        var pCamera = this._pEngine.getActiveCamera();
        var m3fWorldViewProj = this._m3fWorldViewProj;
        pCamera.viewProjMatrix().mult(this.worldMatrix(), m3fWorldViewProj);
        // set the view matrix
        //console.log(this.worldMatrix());
        pEffect.setMatrix(a.EffectResource.worldViewProjMatrix, m3fWorldViewProj);
        pEffect.applyCameraMatrices(pCamera);
        
        pEffect.setMatrix(a.EffectResource.worldMatrix, this.worldMatrix());
        pEffect.setMatrix(a.EffectResource.normalMatrix, this.normalMatrix());

        var pMesh = pMeshContainer.pMeshData.pMesh;
        pEffect.applyVertexBuffer(pMesh.getVertexBuffer());
        pMesh.getIndexBuffer().activate();

        if (bDeactivatePass) {
            pEffect.deactivatePass();
        }

        // draw the mesh subset
        this._pModelResource.renderModelSubset(pEntry.modelParamA, pEntry.modelParamB);
    }*/
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

Ifdef (__DEBUG);

SceneModel.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        var sData = '<model' + (this._sName? ' ' + this._sName: '') + '(' + this._pMeshes.length + ')' +  '>';
        
        if (this._pMeshes.length) {

            sData += '( ';

            for (var i = 0; i < this._pMeshes.length; i++) {
                sData += (i > 0? ',': '') + this._pMeshes[i].name;
            };

            sData += ' )';
        
        }

        return sData;
    }

    return SceneObject.prototype.toString.call(this, isRecursive, iDepth);
}

Endif ();

A_NAMESPACE(SceneModel);

