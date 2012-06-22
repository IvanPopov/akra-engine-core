
/**
 * SkinInfo
 */

function SkinInfo () {

};

SkinInfo.prototype = {
    clone: function (ppSkinInfo) {},
    convertToBlendedMesh: function (
        pMesh,
        eOptions,
        pAdjacencyIn,
        pAdjacencyOut,
        pFaceRemap,
        ppVertexRemap,
        pMaxVertexInfl,
        pNumBoneCombinations,
        ppBoneCombinationTable,
        ppMesh) {},
        /**
         * Takes a mesh and returns a new mesh with per-vertex blend weights, indices,
         * and a bone combination table. The table describes which bone palettes affect
         * which subsets of the mesh.
         * @param pMesh The input mesh.
         * @param Options
         * @param paletteSize Number of bone matrices available for matrix palette skinning.
         * @param pAdjacencyIn
         * @param pAdjacencyOut
         * @param pFaceRemap An array of DWORDs, one per face, that identifies the original mesh
         * 	face that corresponds to each face in the blended mesh. If the value supplied
         * 	for this argument is null, face remap data is not returned.
         * @param ppVertexRemap
         * @param pMaxVertexInfl Pointer to a DWORD that will contain the maximum number of
         * 	bone influences required per vertex for this skinning method.
         * @param pNumBoneCombinations
         * @param ppBoneCombinationTable
         * @param ppMesh Pointer to the new mesh.
         */
        ConvertToIndexedBlendedMesh: function (
        /** @type mesh */
        pMesh,
        /** @type Number */
        Options,
        /** @type Number */
        paletteSize,
        /** @type Number[] */
        pAdjacencyIn,
        /** @type Number[] */
        pAdjacencyOut,
        /** @type Number[] */
        pFaceRemap,
        /** @type IBuffer */
        ppVertexRemap,
        /** @type Number[] */
        pMaxVertexInfl,
        /** @type Number[] */
        pNumBoneCombinations,
        /** @type IBuffer */
        ppBoneCombinationTable,
        /** @type Mesh */
        ppMesh) {},
    findBoneVertexInfluenceIndex: function (boneNum, vertexNum, pInfluenceIndex) {},
    getBoneInfluence: function (Bone, vertices, weights) {},
    getBoneName: function (Bone) {},
    getBoneOffsetMatrix: function (Bone) {},
                                                                /** Retrieves the blend factor and vertex affected by a specified bone influence. */
                                                                GetBoneVertexInfluence: function (boneNum, influenceNum, pWeight, pVertexNum) {},
    getDeclaration: function () {},
    getFVF: function () {},
    getMaxFaceInfluences: function (pIB, NumFaces, maxFaceInfluences) {},
    getMaxVertexInfluences: function (maxVertexInfluences) {},
    getMinBoneInfluence: function () {},
    getNumBoneInfluences: function (bone) {},
    getNumBones: function () {},
    remap: function (NumVertices, pVertexRemap) {},
    setBoneInfluence: function (Bone, numInfluences, vertices, weights) {},
    setBoneName: function (Bone, pName) {},
    setBoneOffsetMatrix: function (Bone, pBoneTransform) {},
    setBoneVertexInfluence: function (boneNum, influenceNum, weight) {},
    setDeclaration: function (pDeclaration) {},
    setFVF: function (FVF) {},
    setMinBoneInfluence: function (MinInfl) {},
    /**
    * Applies software skinning to the target vertices based on the current matrices.
    */
    updateSkinnedMesh: function (
       pBoneTransforms,
       pBoneInvTransposeTransforms,
       pVerticesSrc,
       pVerticesDst) {

    }
};
