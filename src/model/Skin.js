function Skin (pMesh, pSkeleton) {
	debug_assert(pMesh, 'you must specify mesh for skin');

	this._pMesh = pMesh;
	this._pSkeleton = null;
	this._pBoneTransformMatrices = null;

	if (pSkeleton) {
		this.setSkeleton(pSkeleton);
	}

    this._pInfMetaData = null;
    this._pInfData = null;
    this._pWeightData = null;
}

PROPERTY(Skin, 'data',
    function () {
        return this._pMesh.data;
    });

Skin.prototype.hasSkeleton = function() {
    return this._pSkeleton !== null;
};

Skin.prototype.getSkeleton = function() {
    return this._pSkeleton;
};

Skin.prototype.getInfluenceMetaData = function () {
    'use strict';
    
    return this._pInfMetaData;
};

Skin.prototype.setSkeleton = function(pSkeleton) {
    debug_assert(this._pSkeleton === null, 'skin already have skeleton');

    this._pSkeleton = pSkeleton;

    var pData = this._pMesh.data;
    var iData = pData.allocateData(VE_MAT4('BONE_MATRIX'), pSkeleton.getTransformationMatricesData());

    this._pBoneTransformMatrices = pData.getData(iData);
};

Skin.prototype.setVertexWeights = function(pInfluencesCount, pInfluences, pWeights) {
    trace('>>>>>> HER !!');
    debug_assert(this._pInfMetaData == null && this._pIntData == null, 
        'vertex weights already setuped.')
    debug_assert(arguments.length === 3, 'you must specify all vertex parameters');

	var pData = this.data;

    var pInfluencesMeta = new Float32Array(pInfluencesCount.length * 2);
    for (var i = 0, j = 0, n = 0; i < pInfluencesMeta.length; i += 2) {
        var iCount = pInfluencesCount[j ++];
        pInfluencesMeta[i] = iCount;
        pInfluencesMeta[i + 1] = n;
        n += 2 * iCount;
    };

    this._pWeightData = pData._allocateData([VE_FLOAT('BONE_WEIGHT')], pWeights);
    this._pInfMetaData = pData._allocateData(VE_FLOAT('BONE_INF_META'), pInfluencesMeta);
    this._pIntData = pData._allocateData([VE_FLOAT('BONE_INF_DATA'), VE_FLOAT('BONE_WEIGHT_IND')], 
        pInfluences);

    return this._pInfMetaData !== null && this._pIntData !== null && this._pWeightData !== null;
};

Skin.prototype.applyBoneMatrices = function() {
    debug_assert(this._pSkeleton, 'mesh does not have any skeleton data');

    var pData;
    if (this._pSkeleton.isUpdated()) {
        this._pSkeleton.synced();
        pData = this._pSkeleton._pBoneTransformsData;

        trace('>> apply bone matrices');
        
        return this._pBoneTransformMatrices.setData(pData, 0, pData.byteLength);
    }

    return false;
};

A_NAMESPACE(Skin);