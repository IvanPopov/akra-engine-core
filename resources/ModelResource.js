/**
 * @file
 * @author Ivan Popov
 */

/**
 * Class for loading additional information from models.
 * @file
 */

function ModelResource (pEngine) {
    ModelResource.superclass.constructor.apply(this, arguments);

    Enum([
             minLOD = 0,
             maxLOD = 3,
             totalLODlevels
         ], LOD_LEVELS, a.ModelResource);

    /** @private */
    this._nTotalFrames = 0;
    this._nTotalBoneMatrices = 0;
    this._pFrameRoot = null;
    this._pFrameList = null;
    this._pAnimController = null;
    this._pBoundingSphere = new a.Sphere;
    this._pBoundingBox = new a.Rect3d;

    // LOD information (only valid for progressive meshes)
    this._isProgressive = false; // true when progressive mesh is present
    this._eCurrentLOD = a.ModelResource.maxLOD;
}

a.extend(ModelResource, a.ResourcePoolItem);


ModelResource.prototype.totalFrames = function () {
    return this._nTotalFrames;
};
ModelResource.prototype.totalBoneMatrices = function () {
    return this._nTotalBoneMatrices;
};
ModelResource.prototype.animationController = function () {
    return this._pAnimController;
};
ModelResource.prototype.frame = function (i) {
    debug_assert(i < this._nTotalFrames, "invalid frame index");
    return this._pFrameList[i];
};
ModelResource.prototype.boundingSphere = function () {
    return this._pBoundingSphere;
};
ModelResource.prototype.boundingBox = function () {
    return this._pBoundingBox;
};

ModelResource.prototype.getLOD = function () {
    return this._eCurrentLOD;
};



ModelResource.prototype.getLODScale = function () {
    return this._eCurrentLOD / this.eLODLevels.k_maxLOD;
};

ModelResource.prototype.getRootFrame = function () {
    return this._pFrameRoot;
};

ModelResource.prototype.containsProgressiveMesh = function () {
    return this._isProgressive;
};

ModelResource.prototype.createResource = function () {
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


ModelResource.prototype.loadResource = function (sFilename) {
    if (!sFilename) {
        var sResourceName = this.findResourceName();
        if (sResourceName) {
            sFilename = sResourceName;
        }
    }

    var pEngine = this._pEngine;
    var res;
    var me = this;

    this._isProgressive = false;
    this._pFrameRoot = null;

    switch (a.pathinfo(sFilename).ext.toLowerCase()) {
        case 'dae':
            a.COLLADA(pEngine, sFilename, function (pFrameRoot, nTotalFrames) {
                if (!pFrameRoot) {
                    debug_error('model: ' + sFilename + ' not loaded.');
                    return false;
                }

                me._pFrameRoot = pFrameRoot;
                me._nTotalFrames = nTotalFrames;
                me._nTotalBoneMatrices = 0;
                me._isProgressive = false;
                console.log(sFilename, ' :: frames total:', me._nTotalFrames, 'root:', me._pFrameRoot);

                me._setup();
            });
            break;
        case 'obj':
            a.loadMeshFromOBJ(pEngine, sFilename, a.MESH.MANAGED, function (pMesh) {
                if (!pMesh) {
                    debug_error('mesh: ' + sFilename + ' not loaded.');
                    return false;
                }

                me._pFrameRoot = a.createFrameFromOBJMesh(pMesh, sFilename);
                me._nTotalFrames = 1;
                me._isProgressive = false;
                me._nTotalBoneMatrices = 0;

                me._setup();
            });
            break;
        default:
            warning('Unknown model format used.');
            return false;
    }

    return true;
};

ModelResource.prototype._setup = function () {
    if (!this.buildFrameList()) {
        debug_error('Cannot build frame list.');
        return false;
    }

    this.enumMeshContainers(a.prepLoadedMesh, this);

    if (!this.setupBoneMatrixPointers(this._pFrameRoot)) {
        debug_error('Cannot setup bone matrix pointers.');
        return false;
    }

    this._pBoundingBox.clear();
    if (!this.calculateBoundingRect(this._pFrameRoot, this._pBoundingBox)) {
        debug_error('Cannot calculate mesh bounding Box.');
        return false;
    }

    //console.log('BOUNDING BOX: ', this._pBoundingBox);

    if (!a.computeFrameBoundingSphere(this._pFrameRoot, this._pBoundingSphere)) {
        debug_error('Cannot calculate mesh bounding sphere.');
        return false;
    }

    //console.log('BOUNDING SPHERE: ', this._pBoundingSphere);

    // D3DXFrameCalculateBoundingSphere seems to have trouble with some PMESH objects.
    // if the radius is zero, we use the box we built to define the sphere
    if (this._pBoundingSphere.fRadius == 0.0) {
        this._pBoundingSphere.v3fCenter = this._pBoundingBox.midPoint();
        var v3fCornerOffset =
            Vec3.subtract(this._pBoundingBox.maxPoint(), this._pBoundingBox.midPoint());
        this._pBoundingSphere.fRadius = Vec3.length(v3fCornerOffset);
    }

    // set the highest LOD
    this._eCurrentLOD = a.ModelResource.minLOD;
    this.setLOD(a.ModelResource.maxLOD);
}

a.prepLoadedMesh = function (pEngine, pFrame, pMeshContainer, pUserData) {
    var pRenderMethod;
    var pModelResource = pUserData;
    var pDisplayManager = pEngine.pDisplayManager;

    if (pMeshContainer) {
        //
        // Check the render methods
        //

        var fnSetupRenderMethod = function (pRenderMethod, pMeshContainer, iMaterial) {
            var fn;
            pRenderMethod.setChangesNotifyRoutine(fn = function () {
                if (this.isResourceLoaded()) {
                    this.delChangesNotifyRoutine(fn);
                    // set the render method
                    pModelResource.setRenderMethod(
                        pMeshContainer,
                        iMaterial,
                        pRenderMethod);
                }
            });
        };

        for (var iMaterial = 0; iMaterial < pMeshContainer.nMaterials; ++iMaterial) {
            var iSid = a.sid();
            if (!pMeshContainer.ppRenderMethodList[iMaterial]) {
                pRenderMethod =
                    pDisplayManager.renderMethodPool().createResource("method_" + iSid);

                // choose a default effect file to use
                var pEffectFile = null;
                if (pMeshContainer.pSkinInfo != null) {
                    pEffectFile = pDisplayManager.effectPool().loadResource(MEDIA_PATH('effects/default_skinned_mesh.fx.js', '/sources/'));
                }

                else {
                    pEffectFile = pEngine.pDisplayManager.effectPool().loadResource(MEDIA_PATH('effects/default_mesh.fx.js', '/sources/'));
                }


                // create a run-time material
                var pMaterial =
                    pDisplayManager.surfaceMaterialPool().createResource("material_" + iSid);

                // if the x-file has a texture, load it into the material
                //pMeshContainer.pMaterials[iMaterial].sTextureFilename = MEDIA_PATH('Tiny_skin.dds', '/media/models/');
                if (pMeshContainer.pMaterials[iMaterial].sTextureFilename) {
                    var sTexturePath = pMeshContainer.pMaterials[iMaterial].sTextureFilename;

                    var pTexture = pDisplayManager.texturePool().loadResource(sTexturePath);
                    if (pTexture) {
                        // put the texture is every material slot
                        // place the texture in the surface material
                        pMaterial.setTexture(0, pTexture);
                    }
                }

                // also copy the material settings
                pMaterial.setMaterial(pMeshContainer.pMaterials[iMaterial]);

                // now load both into the default render slot
                pRenderMethod.setEffect(0, pEffectFile);
                pRenderMethod.setMaterial(0, pMaterial);
                fnSetupRenderMethod(pRenderMethod, pMeshContainer, iMaterial);
            }
            else {
                pRenderMethod = pMeshContainer.ppRenderMethodList[iMaterial];
                pRenderMethod.addRef();

                fnSetupRenderMethod(pRenderMethod, pMeshContainer, iMaterial);
            }
        }
    }

    return true;
};

ModelResource.prototype.calculateBoundingRect = function (pFrame, pRect) {
    if (pFrame.pMeshContainer != null) {
        // get the base mesh interface
        var pBaseMesh = null;

        /*
         Вне зависимости от типа меща(Патч или не патч), он лежит в MeshData.pMesh
         */
        pBaseMesh = pFrame.pMeshContainer.pMeshData.pMesh;
        if (pBaseMesh) {
            var nVertices = pBaseMesh.getNumVertices();
            var nBytesPerVertex = pBaseMesh.getNumBytesPerVertex();

            if (pVerts = pBaseMesh.getVertexBuffer()) {
                var boxResult;

                var minPoint = new Vector3;
                var maxPoint = new Vector3;

                boxResult = a.computeBoundingBox(pVerts,
                                                 nVertices,
                                                 nBytesPerVertex,
                                                 minPoint,
                                                 maxPoint);

                if (boxResult) {
                    pRect.unionPoint(minPoint);
                    pRect.unionPoint(maxPoint);
                }
                else {
                    error('Cannot compute bounding box.');
                }
            }
        }
    }

    if (pFrame.pFrameSibling != null) {
        if (!this.calculateBoundingRect(pFrame.pFrameSibling, pRect)) {
            return false;
        }
    }

    if (pFrame.pFrameFirstChild != null) {
        if (!this.calculateBoundingRect(pFrame.pFrameFirstChild, pRect)) {
            return false;
        }
    }

    return true;
};


//-----------------------------------------------------------------------------
//Name: SetupBoneMatrixPointersOnMesh()
//Desc: Called to setup the pointers for a given bone to its transformation matrix
//-----------------------------------------------------------------------------

ModelResource.prototype.setupBoneMatrixPointersOnMesh = function (pMeshContainerBase) {
    var iBone, nBones;
    var pFrame = null;

    var pMeshContainer = pMeshContainerBase;

    // if there is a skinmesh, then setup the bone matrices
    if (pMeshContainer.pSkinInfo != null) {
        nBones = pMeshContainer.pSkinInfo.getNumBones();

        pMeshContainer.pBoneIndexList = new Array(nBones);
        if (pMeshContainer.pBoneIndexList == null) {
            return false;
        }

        for (iBone = 0; iBone < nBones; iBone++) {
            pFrame = a.FindFrame(this._pFrameRoot, pMeshContainer.pSkinInfo.getBoneName(iBone));
            if (pFrame == null) {
                return false;
            }

            pMeshContainer.pBoneIndexList[iBone] = pFrame.frameIndex;
        }
    }
    return true;
};

//-----------------------------------------------------------------------------
//Name: SetupBoneMatrixPointers()
//Desc: Called to setup the pointers for a given bone to its transformation matrix
//-----------------------------------------------------------------------------

ModelResource.prototype.setupBoneMatrixPointers = function (pFrame) {
    var hr;

    if (pFrame.pMeshContainer != null) {
        hr = this.setupBoneMatrixPointersOnMesh(pFrame.pMeshContainer);
        if (!hr) {
            return false;
        }
    }

    if (pFrame.pFrameSibling != null) {
        hr = this.setupBoneMatrixPointers(pFrame.pFrameSibling);
        if (!hr) {
            return false;
        }
    }

    if (pFrame.pFrameFirstChild != null) {
        hr = this.setupBoneMatrixPointers(pFrame.pFrameFirstChild);
        if (!hr) {
            return false;
        }
    }

    return true;
};

//-----------------------------------------------------------------------------
//Name: EnumerateFrames()
//Desc: Assign index values to the frames in sibling-child order
//		and copy them to our frame pointer table
//-----------------------------------------------------------------------------

ModelResource.prototype.enumerateFrames = function (pFrame, pParent, index) {
    debug_print('enumerate frames');
    var iLocalIndex = index;
    index++;

    pFrame.iFrameIndex = iLocalIndex;
    pFrame.iParentIndex = pParent;
    this._pFrameList[iLocalIndex] = pFrame;

    if (pFrame.pFrameSibling != null) {
        if (!this.enumerateFrames(pFrame.pFrameSibling, pParent, index)) {
            return false;
        }
    }

    if (pFrame.pFrameFirstChild != null) {
        pParent = index;
        if (!this.enumerateFrames(pFrame.pFrameFirstChild, iLocalIndex, index)) {
            return false;
        }
    }

    return true;
};

ModelResource.prototype.buildFrameList = function () {
    safe_delete(this._pFrameList);
    this._pFrameList = new Array(this._nTotalFrames);
    return this.enumerateFrames(this._pFrameRoot, MAX_UINT16, 0);
};


//ModelResource.prototype.saveResource = function (filename) {
//    if (!filename) {
//        var pString = this.findResourceName();
//
//        if (pString) {
//            filename = pString;
//        }
//
//    }
//
//    // prepare the data for saving
//    this.enumMeshContainers(a.prepForSave, 0);
//    var saveUserData = new a.SaveUserData;
//
//    /*
//     * SAVE MODEL To FILE
//     *
//     */
//    /*
//     * / var hr = D3DXSaveMeshHierarchyToFile(filename,
//     * DXFILEFORMAT_TEXT, (LPD3DXFRAME) m_pFrameRoot, m_pAnimController,
//     * &saveUserData);
//     *
//
//     if (hr)
//     return true;
//     else
//     new Error('Can\'t save to file');*/
//
//    return false;
//};

ModelResource.prototype.setRenderMethod = function (pMeshContainer, iMaterial, pRenderMethod) {
    var res = true;
    var pEngine = this._pEngine;
    safe_release(pMeshContainer.ppRenderMethodList[iMaterial]);
    pMeshContainer.ppRenderMethodList[iMaterial] = pRenderMethod;

    if (pRenderMethod) {
        pRenderMethod.addRef();

        var bUsesTangents = false;
        var bUsesBinormal = false;

        //a.RenderMethod.k_max_render_stages ???
        for (var iMethod = 0; iMethod < a.RenderMethod.maxRenderStages; ++iMethod) {

            var pEffectFile = pRenderMethod.getEffect(iMethod);

            if (pEffectFile && pEffectFile.effect()) {

                pEffect = pEffectFile.effect();

                // Look for tangents semantic
                var pEffectDesc = pEffect.getDesc();
                var sTechnique;
                var pTechniqueDesc;
                var sPass;
                var pPassDesc;


                for (var iTech = 0; iTech < pEffectDesc.nTechniques; iTech++) {
                    sTechnique = pEffect.getTechnique(iTech);
                    pTechniqueDesc = pEffect.getTechniqueDesc(sTechnique);

                    for (var iPass = 0; iPass < pTechniqueDesc.nPasses; iPass++) {
                        sPass = pEffect.getPass(sTechnique, iPass);
                        pPassDesc = pEffect.getPassDesc(sPass);
                        //TODO PassDesc always EMPTY!
                        for (var iSem = 0; iSem < pPassDesc.nVSSemanticsUsed; iSem++) {

                            if (pPassDesc.pVSSemantics[iSem].eUsage == a.DECLUSAGE.TANGENT) {
                                bUsesTangents = true;
                            }

                            if (PassDesc.pVSSemantics[iSem].eUsage == a.DECLUSAGE.BINORMAL) {
                                bUsesBinormal = true;
                            }
                        }
                    }
                }

            }
        }
        //console.log('bUsesBinormal: ', bUsesBinormal, 'bUsesTangents: ', bUsesTangents);

        //
        // compute binormal and tanget data if needed
        //
        //LPD3DXMESH& pOrigMesh = pMeshContainer.MeshData.pMesh;
        // get the base mesh interface
        var pOrigMesh = null;
        pOrigMesh = pMeshContainer.pMeshData.pMesh;

        var bRebuildRenderMesh = !pMeshContainer.pRenderMeshData.pMesh;
        if (bUsesTangents || bUsesBinormal) {
            var pDeclaration = pOrigMesh.getDeclaration();
            //D3DVERTEXELEMENT9 End = D3DDECL_END();
            var iElem;
            var bHasTangents = false;
            var bHasBinormal = false;

            for (iElem = 0; iElem < pDeclaration.length; iElem++) {
                if (pDeclaration[iElem].eUsage == a.DECLUSAGE.TANGENT) {
                    bHasTangents = true;
                }

                if (pDeclaration[iElem].eUsage == a.DECLUSAGE.BINORMAL) {
                    bHasBinormal = true;
                }
            }

            var cloneMesh = false;
            var currentOffset = pOrigMesh.getNumBytesPerVertex();

            // Update Mesh Semantics if changed
            if (bUsesTangents && !bHasTangents) {
                pDeclaration[iElem].Stream = 0;
                pDeclaration[iElem].Offset = currentOffset;
                pDeclaration[iElem].Type = a.DECLTYPE.FLOAT3;
                pDeclaration[iElem].Method = a.DECLMETHOD.DEFAULT;
                pDeclaration[iElem].Usage = a.DECLUSAGE.TANGENT;
                pDeclaration[iElem].UsageIndex = 0;
                currentOffset += 32 * 3;//sizeof(float) ~ 32
                cloneMesh = true;
            }

            if (bUsesBinormal && !bHasBinormal) {
                pDeclaration[iElem].Stream = 0;
                pDeclaration[iElem].Offset = currentOffset;
                pDeclaration[iElem].Type = a.DECLTYPE.FLOAT3;
                pDeclaration[iElem].Method = a.DECLMETHOD.DEFAULT;
                pDeclaration[iElem].Usage = a.DECLUSAGE.BINORMAL;
                pDeclaration[iElem].UsageIndex = 0;
                currentOffset += 32 * 3;
                cloneMesh = true;
            }


            if (cloneMesh) {
                if (pMeshContainer.pMeshData.eType == a.MESHDATATYPE.PMESH) {
                    // set to the highest possible LOD
                    pMeshContainer.pMeshData.pMesh.SetNumVertices(0xffffffff);
                }

                // clone a mesh with a shared VB
                if (pMeshContainer.pMeshData.eType == a.MESHDATATYPE.MESH) {

                    var pTempMesh = null;
                    pTempMesh = pMeshContainer.pMeshData.pMesh.CloneMesh(pEngine, a.MESH.SYSTEMMEM, pDeclaration);
                    if (pTempMesh) {
                        // do the work on the clone. The shared VB will ensure that
                        // the original mesh is updated as well

                        if (!a.computeTangent(pTempMesh, 0, 0, 0, true, pMeshContainer.pAdjacency)) {
                            debug_error('Cannot compute tangent for mesh');
                            res = false;
                        }

                        safe_release(pOrigMesh);
                        pMeshContainer.pMeshData.pMesh = pTempMesh;
                        pOrigMesh = pTempMesh;
                    }
                    else {
                        res = false;
                    }
                }
                bRebuildRenderMesh = true;
            }
        }

        if (bRebuildRenderMesh) {

            pMeshContainer.pRenderMeshData.pMesh = null;

            pMeshContainer.pBoneCombinationBuf = null;

            if (pMeshContainer.pSkinInfo != null) {
                if (pMeshContainer.pMeshData.eType == a.MESHDATATYPE.PMESH) {
                    // set to the highest possible LOD
                    pMeshContainer.pMeshData.pMesh.setNumVertices(0xffffffff);
                }

                // clone a mesh with a shared VB
                var pDeclaration = pOrigMesh.getDeclaration();

                var pTempMesh = null;
                pTempMesh = pOrigMesh.cloneMesh(pEngine, a.MESH.SYSTEMMEM, pDeclaration);
                if (pTempMesh) {
                    // Get palette size
                    // First 9 constants are used for other data.  Each 4x3 matrix takes up 3 constants.
                    // (96 - 9) /3 i.e. Maximum constant count - used constants
                    var nMaxMatrices = 26;
                    pMeshContainer.nBoneMatrices = Math.min(nMaxMatrices, pMeshContainer.pSkinInfo.getNumBones());

                    var eFlags = a.MESHOPTIONS.COMPACT | a.MESHOPTIONS.VERTEXCACHE | a.MESH.MANAGED
                        | a.MESH.WRITEONLY;
                    var pNewMesh = null;
                    pNewMesh = pMeshContainer.pSkinInfo.convertToIndexedBlendedMesh(
                        pTempMesh,
                        eFlags,
                        pMeshContainer.nBoneMatrices,
                        pMeshContainer.pAdjacency,
                        null, null, null,
                        pMeshContainer.nBoneInfluences,
                        pMeshContainer.nAttributeGroups,
                        pMeshContainer.pBoneCombinationBuf
                    );

                    if (pNewMesh) {
                        //
                        // Build semantics for the new mesh
                        //
                        var pDecl = pNewMesh.getDeclaration();
                        var pDeclCur = null;
                        if (pDecl) {
                            // the vertex shader is expecting to interpret the UBYTE4 as a D3DCOLOR, so update the type
                            //   NOTE: this cannot be done with CloneMesh, that would convert the UBYTE4 data to float and then to D3DCOLOR
                            //          this is more of a "cast" operation
                            //                     pDeclCur = pDecl;
                            //                     while (pDeclCur.nStream != 0xff) {
                            //                         if (pDeclCur.eUsage == a.DECLUSAGE.BLENDINDICES && pDeclCur.eUsageIndex == 0) {
                            //                            pDeclCur.eType = a.DECLTYPE.COLOR;
                            //                         }
                            //
                            //                         pDeclCur++;
                            //                     }
                            for (var n = 0; n < pDecl.length; ++n) {
                                pDeclCur = pDecl[n];
                                if (pDeclCur.eUsage == a.DECLUSAGE.BLENDINDICES && pDeclCur.eUsageIndex == 0) {
                                    pDeclCur.eType = a.DECLTYPE.COLOR;
                                }
                            }

                            res = pNewMesh.updateSemantics(pDecl);

                            // do we copy the new mesh or convert to a PMesh?
                            if (pMeshContainer.pMeshData.eType == a.MESHDATATYPE.MESH) {
                                pMeshContainer.pRenderMeshData.pMesh = pNewMesh;
                            }
                            else {
                                pMeshContainer.pRenderMeshData.pMesh = a.generatePMesh(
                                    pNewMesh,
                                    pMeshContainer.pAdjacency,
                                    null,
                                    null,
                                    pMeshContainer.MeshData.pMesh.getMinFaces(),
                                    a.MESHSIMP.FACE);


                                if (pMeshContainer.RenderMeshData.pMesh) {
                                    pMeshContainer.pRenderMeshData.eType =
                                        pMeshContainer.pMeshData.eType;

                                    safe_release(pNewMesh);
                                }
                                else {
                                    res = false;
                                    pMeshContainer.pRenderMeshData.eType =
                                        a.MESHDATATYPE.MESH;
                                    pMeshContainer.pRenderMeshData.pMesh = pNewMesh;
                                }
                            }
                        }
                        else {
                            res = false;
                        }
                    }
                    else {
                        res = false;
                    }
                    safe_release(pTempMesh);
                }
                else {
                    res = false;
                }
            }
            else {
                var eFlags = a.MESHOPTIONS.COMPACT | a.MESHOPTIONS.VERTEXCACHE | a.MESH.MANAGED;

                if (pMeshContainer.pMeshData.eType == a.MESHDATATYPE.MESH) {

                    //					hr = pMeshContainer.MeshData.pMesh.Optimize(
                    //												Flags,
                    //												pMeshContainer.pAdjacency,
                    //												null,
                    //												null,
                    //												null,
                    //												&pMeshContainer.RenderMeshData.pMesh);
                    //
                    var pDeclaration = pMeshContainer.pMeshData.pMesh.getDeclaration();


                    pMeshContainer.pRenderMeshData.pMesh = pMeshContainer.pMeshData.pMesh.cloneMesh(
                        pEngine, a.MESH.MANAGED, pDeclaration);
                }
                else {
                    var pDeclaration = pMeshContainer.pMeshData.pMesh.getDeclaration();

                    pMeshContainer.pRenderMeshData.pMesh = pMeshContainer.pMeshData.pMesh.clonePMesh(pEngine,
                                                                                                     a.MESH.MANAGED,
                                                                                                     pDeclaration);
                    res = pMeshContainer.pRenderMeshData.pMesh !== null;
                }

                pMeshContainer.pRenderMeshData.eType = pMeshContainer.pMeshData.eType;
            }
        }

        if (!res) {
            debug_error('ModelResource::SetRenderMethod FAILED');
        }
    }
    this.connect(pRenderMethod, a.ResourcePoolItem.Loaded);
    return res;
};


ModelResource.prototype.enumMeshContainers = function (fnCallback, pUserData) {
    if (this._pFrameList) {
        for (var i = 0; i < this._nTotalFrames; ++i) {
            var pFrame = this._pFrameList[i];
            if (pFrame.pMeshContainer != null) {
                if (!fnCallback(this._pEngine, pFrame, pFrame.pMeshContainer, pUserData)) {
                    return false;
                }
            }
        }
    }
    return true;
};

ModelResource.prototype.totalAnimations = function () {
    var nTotal = 0;
    if (this._pAnimController) {
        nTotal = this._pAnimController.getNumAnimationSets();
    }
    return nTotal;
};

ModelResource.prototype.animationName = function (iSlot) {
    debug_assert(iSlot < this.totalAnimations(), "invalid animation slot");
    var name = null;

    if (this._pAnimController) {
        var pAnimationSet = null;

        pAnimationSet = this._pAnimController.getAnimationSet(iSlot);

        if (pAnimationSet) {
            name = pAnimationSet.getName();
            safe_release(pAnimationSet);
        }
    }
    return name;
};

ModelResource.prototype.insertAnimation = function (iInsertBefore, pAnimSet) {
    var nAnimationCount = this.totalAnimations();

    if (this._pAnimController) {
        var res;
        var nMaxCount = this._pAnimController.getMaxNumAnimationSets();

        if (nAnimationCount + 1 >= nMaxCount) {
            var pNewController = null;

            pNewController = this._pAnimController.cloneAnimationController(
                this._pAnimController.getMaxNumMatrices(),
                nAnimationCount + 1,
                this._pAnimController.getMaxNumTracks(),
                this._pAnimController.getMaxNumEvents());

            if (!pNewController) {
                return;
            }

            safe_release(this._pAnimController);
            this._pAnimController = pNewController;
        }

        // if we are inserting after the end of the list, simply append this member
        if (iInsertBefore >= nAnimationCount) {
            this._pAnimController.registerAnimationSet(pAnimSet);
        }
        else {
            // how many animation sets do we have to store
            // to perform the insert?
            var iStorageCount = nAnimationCount - iInsertBefore;
            var pStorage = new Array(iStorageCount);

            // store and remove these animation sets
            var count;
            for (count = 0; count < iStorageCount; ++count) {
                var iStorage = iInsertBefore + count;
                pStorage[count] = this._pAnimController.getAnimationSet(iStorage);
            }

            for (count = 0; count < iStorageCount; ++count) {
                this._pAnimController.unregisterAnimationSet(pStorage[count]);
            }

            // add our new animation
            this._pAnimController.registerAnimationSet(pAnimSet);

            // now replace the temporary storage copies
            for (count = 0; count < iStorageCount; ++count) {
                var iStorage = iInsertBefore + count;
                this._pAnimController.registerAnimationSet(pStorage[count]);
                safe_release(pStorage[count]);
            }

            safe_delete_array(pStorage);
        }
    }
};

ModelResource.prototype.moveAnimation = function (iFrom, iTo) {
    debug_assert(iFrom < this.totalAnimations(), "invalid animation slot");

    if (this._pAnimController) {
        var pAnimationSet = 0;
        pAnimationSet = this._pAnimController.getAnimationSet(iFrom);
        this._pAnimController.unregisterAnimationSet(pAnimationSet);

        // re-insert at the new location
        this.insertAnimation(iTo, pAnimationSet);
        safe_release(pAnimationSet);
    }
};

ModelResource.prototype.addAnimations = function (pExternalController) {
    debug_assert(pExternalController, "invalid animation controller");

    if (this._pAnimController) {
        var res;
        var nAnimationCount = this.totalAnimations();
        var nCountToAdd = pExternalController.getNumAnimationSets();
        var nMaxCount = this._pAnimController.getMaxNumAnimationSets();

        if (nAnimationCount + nCountToAdd >= nMaxCount) {
            var pNewController = null;

            pNewController = this._pAnimController.cloneAnimationController(
                this._pAnimController.getMaxNumMatrices(),
                nAnimationCount + nCountToAdd,
                this._pAnimController.getMaxNumTracks(),
                this._pAnimController.getMaxNumEvents()
            );

            if (!pNewController) {
                return;
            }

            safe_release(this._pAnimController);
            this._pAnimController = pNewController;
        }

        var iAnimSet;
        for (iAnimSet = 0; iAnimSet < nCountToAdd; ++iAnimSet) {
            var pAnimationSet = 0;
            pAnimationSet = pExternalController.getAnimationSet(iAnimSet);
            this._pAnimController.registerAnimationSet(pAnimationSet);
            safe_release(pAnimationSet);
        }
    }
};

ModelResource.prototype.removeAnimation = function (iSlot) {
    debug_assert(iSlot < this.totalAnimations(), "invalid animation slot");
    var name = null;

    if (this._pAnimController) {
        var pAnimationSet = null;

        pAnimationSet = this._pAnimController.getAnimationSet(iSlot);

        if (pAnimationSet) {
            this._pAnimController.unregisterAnimationSet(pAnimationSet);
            safe_release(pAnimationSet);
        }
    }
};

ModelResource.prototype.renderModelSubset = function (iFrame, iSubset) {
    var pMeshContainer = this.frame(iFrame).pMeshContainer;
     /*   var pMeshContainer = this._pFrameList[iFrame].pMeshContainer;
      var pMeshData;
      if (pMeshContainer && (pMeshData = pMeshContainer.pRenderMeshData.pMesh)) {
      pMeshData.renderArea(iSubset);
      }*/

    if (pMeshContainer) {
        if (pMeshContainer.pRenderMeshData.pMesh) {
            pMeshContainer.pRenderMeshData.pMesh.renderArea(iSubset);
        }
    }
};

ModelResource.prototype.findFirstModelFrame = function () {
    for (var i = 0; i < this._nTotalFrames; ++i) {
        var pFrame = this._pFrameList[i];
        if (pFrame.pMeshContainer) {
            return i;
        }
    }
    return -1;
};

ModelResource.prototype.findNextModelFrame = function (iLastFrame) {
    for (var i = iLastFrame + 1; i < this._nTotalFrames; ++i) {
        var pFrame = this._pFrameList[i];
        if (pFrame.pMeshContainer) {
            return i;
        }
    }
    return -1;
};

ModelResource.prototype.setLODScale = function (fZeroToOne) {
    // skip if no progressive meshes were found
    if (!this._isProgressive) {
        return;
    }

    var iNewLOD = Math.realToInt32(fZeroToOne * a.ModelResource.maxLOD);
    this.setLOD(iNewLOD);
};

ModelResource.prototype.setLOD = function (iNewLOD) {
    // skip if no progressive meshes were found
    if (!this._isProgressive) {
        return;
    }

    iNewLOD = Math.clamp(iNewLOD, a.ModelResource.minLOD, a.ModelResource.maxLOD);
    var fDetailScale = iNewLOD / a.ModelResource.maxLOD;

    if (this._currentLOD != iNewLOD) {
        this._currentLOD = iNewLOD;

        // set the LOD for all attached Progressive Meshes
        for (var i = 0; i < this._nTotalFrames; ++i) {
            var pFrame = this._pFrameList[i];
            if (pFrame.pMeshContainer) {
                var pMeshContainer = pFrame.pMeshContainer;

                if (pMeshContainer.pRenderMeshData.eType == a.MESHDATATYPE.PMESH) {
                    var pMesh = pMeshContainer.pRenderMeshData.pMesh;

                    if (pMesh) {
                        var iMinFaces = pMesh.getMinFaces();
                        var iMaxFaces = pMesh.getMaxFaces();
                        var fDelta = (iMaxFaces - iMinFaces) * fDetailScale;
                        var nFaceCount = Math.realToInt32(fDelta) + iMinFaces;

                        pMesh.setNumFaces(nFaceCount);
                    }
                }
            }
        }
    }
};

a.ModelResource = ModelResource;

Define(a.ModelManager(pEngine), function () {
    a.ResourcePool(pEngine, a.ModelResource);
});

