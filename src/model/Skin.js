function Skin (pMesh, pSkeleton) {
	debug_assert(pMesh, 'you must specify mesh for skin');

	this._pMesh = pMesh;
	this._pSkeleton = null;
	this._pBoneTransformMatrices = null;

	if (pSkeleton) {
		this.setSkeleton(pSkeleton);
	}
}

Skin.prototype.hasSkeleton = function() {
    return this._pSkeleton !== null;
};

Skin.prototype.getSkeleton = function() {
    return this._pSkeleton;
};

Skin.prototype.setSkeleton = function(pSkeleton) {
    debug_assert(this._pSkeleton === null, 'skin already have skeleton');

    this._pSkeleton = pSkeleton;

    var pData = this._pMesh.data;
    var iData = pData.allocateData(VE_MAT4('BONE_MATRIX'), pSkeleton.getTransformationMatricesData());

    this._pBoneTransformMatrices = pData.getData(iData);
};

Skin.prototype.setVertexWeights = function() {
	//TODO: 
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