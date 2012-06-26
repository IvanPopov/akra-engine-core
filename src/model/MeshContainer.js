/**
 * MESHDATA
 * @enum
 */
Enum([
         MESH = 0x001,
         PMESH = 0x002,
         PATCHMESH = 0x003
     ], MESHDATATYPE, a.MESHDATATYPE);


/**
 * MeshData
 * @ctor
 */
function MeshData (eType, pMesh) {
    /** @type Number|MESHDATATYPE */
    this.eType = eType || a.MESHDATATYPE.MESH;

    /** @type Mesh */
    this.pMesh = pMesh || null;
}


a.MeshData = MeshData;

/**
 * @ctor
 * @tparam String sName
 * Базовый контейнер для меша.
 */
function MeshContainerBase (sName) {
    /** @type String */
    this.sName = sName || null;
    /** @type MeshData */
    this.pMeshData = null;
    /** @type Material[] */
    this.pMaterials = null;
    /** @type Effect[] */
    this.pEffects = null;
    /** @type SkinInfo */
    this.pSkinInfo = null;
    /** @type Number[][] */
    this.pAdjacency = null;
    /** @type MeshContainer */
    this.pNextMeshContainer = null;
}
a.MeshContainerBase = MeshContainerBase;


Object.defineProperty(MeshContainerBase.prototype, "nMaterials", {
    get: function () {
        return this.pMaterials.length;
    }
});


/**
 * Mesh container structure.
 * @ctor
 */
function MeshContainer () {
    MeshContainer.superclass.constructor.apply(this, arguments);
    /**
     * SkinMesh info
     * and additionals parameters.
     */

    /** @type Number */
    this.nAttributeGroups = null;
    /**
     * Original table attributes of mesh.
     * @type AttributeRange[]
     */
    this.pAttributeTable = null;
    /** @type MeshData */
    this.pRenderMeshData = new a.MeshData;
    /** @type NumBoneInfluences */
    this.nBoneInfluences = 0;
    /** @type Number[] */
    this.pBoneIndexList = null;
    /** @type Buffer */
    this.pBoneCombinationBuf = null;
    /** @type Number */
    this.nBoneMatrices = 0;
    /** @type Matrix[] */
    this.pBoneOffsetMatrices = null;
    /** @type RenderMethod */
    this.ppRenderMethodList = [];
}

a.extend(MeshContainer, MeshContainerBase);

/**
 * create container
 * @param sName
 * @param pMeshData
 * @param pMaterials
 * @param pEffectInstances
 * @param pAdjacency
 * @param pSkinInfo
 */
MeshContainer.prototype.create =
    function (sName, pMeshData, pMaterials, pEffectInstances, pSkinInfo) {

        var pMesh = null;
        var nFaces, iMaterials, iBone, nBones;
        var pEngine;
        var x;


        if (pMeshData.eType == a.MESHDATATYPE.PATCHMESH) {
            debug_error('patch meshes unsupported.');
            return null;
        }

        pMesh = pMeshData.pMesh;

        this.sName = sName;

        pEngine = pMesh.getEngine();
        nFaces = pMesh.getNumFaces();

        // remove circular links from the adjacency information
//        var pAdjacency = pMesh.generateAdjacency();
//
//        for (var x = 0; x < nFaces * 3; x += 3) {
//            var a = pAdjacency[x];
//            var b = pAdjacency[x + 1];
//            var c = pAdjacency[x + 2];
//
//            if (a == b || a == c) {
//                pAdjacency[x] = 0xffffffff;
//            }
//
//            if (b == c) {
//                pAdjacency[x + 1] = 0xffffffff;
//            }
//        }

        this.pMeshData = pMeshData;
        //this.pMeshData.pMesh = pMeshData.pMesh;
        //this.pMeshData.eType = pMeshData.eType;

        //this.pAdjacency = pAdjacency;
        var nMaterials = (pMaterials? pMaterials.length: 0);
        if (nMaterials > 0) {

            // copy all the material data in bulk
            this.pMaterials = pMaterials;

            if (pEffectInstances) {
                this.pEffects = pEffectInstances;
            }
        }
        else {
            this.pMaterials = [new a.Material];
            this.pMaterials[0].sTextureFilename = MEDIA_PATH('textures/default.dds', '/media/');
            Vec3.set(0.5, 0.5, 0.5, this.pMaterials[0].pDiffuse);
            Vec3.set(0.5, 0.5, 0.5, this.pMaterials[0].pSpecular);
        }

        if (pSkinInfo != null) {
            this.pSkinInfo = pSkinInfo;

            nBones = pSkinInfo.getNumBones();
            this.pBoneOffsetMatrices = new Array(nBones);

            for (iBone = 0; iBone < nBones; ++iBone) {
                this.pBoneOffsetMatrices[iBone] = Mat4.create(this.pSkinInfo.getBoneOffsetMatrix(iBone));
            }
        }

    };

a.MeshContainer = MeshContainer;

a.computeMeshConatinerBoudingSphere = function (pContainer, pSphere) {
    pSphere.clear();
    debug_assert(pContainer.pMeshData.eType === a.MESHDATATYPE.MESH,
                 "Unsupport calculation bounding sphere for progressive Mesh");

    var pMesh = pContainer.pMeshData.pMesh;
    if (pMesh === null) {
        return true;
    }
    var nVertices = pMesh.getNumVertices();
    var nBytesPerVertex = pMesh.getNumBytesPerVertex();
    var pVerts;
    if (pVerts = pMesh.getVertexBuffer()) {

        //if(!a.computeBoundingSphereMinimal(pVerts, nVertices, nBytesPerVertex, pSphere))
        //    return false;
    }
    if(pContainer.pNextMeshContainer !== null){
        var pNextSphere = new a.Sphere();
        if(!a.calculateMeshConatinerBoudingSphere(pContainer.pNextMeshContainer, pNextSphere))
            return false;
        a.computeGeneralizingSphere(pSphere, pNextSphere);
    }
    return true;
};

