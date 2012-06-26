/**
 * @ctor
 */
function DataSubset() {
    this._eOptions = 0;
    this._ePrimType = 0;
    this._pFactory = null;
    this._iId = -1;
    this._pIndexBuffer = null;
    this._pIndexData = null;
    this._pMap = null;
}

PROPERTY(MeshSubset, 'factory',
    function () {
        return this._pFactory;
    });

DataSubset.prototype.setup = function(pFactory, iId, ePrimType, eOptions) {
    if (arguments.length < 4) {
        return false;
    }

    var pIndexBuffer;

    pIndexBuffer = pFactory.getEngine().displayManager()
        .vertexBufferPool().createResource('subset_' + a.sid());
    pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
    
    this._pFactory = pFactory;
    this._iId = iId;
    this._ePrimType = ePrimType || a.PRIMTYPE.TRIANGLELIST;
    this._pIndices = pIndicesData;
    this._pIndexBuffer = pIndexBuffer;
    this._pMap = new a.BufferMap(pEngine);

    return true;
};

//добавляем сабмешу ссылку на его данные.
DataSubset.prototype._addData = function (pVertexData) {
   return this._pMap.flow(pVertexData);
};

DataSubset.prototype.allocateIndex = function (pAttrDecl, pData) {
    var pIndexData = this._pIndexData;
    
    if (!pIndexData) {
        this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
        return true;
    }
    
    return pIndexData.extend(pAttrDecl, pData);
};

DataSubset.prototype.allocateData = function(pDataDecl, pData) {
    return this._addData(this._pFactory._allocateData(pDataDecl));
};

/**
 * @ctor
 */
function MeshSubset (pEngine) {
    A_CLASS;

    this._iMaterial = -1;
}

EXTENDS(MeshSubset, a.DataSubset, a.RenderableObject);

PROPERTY(MeshSubset, 'parent',
    function () {
        return this.factory;
    });

MeshSubset.prototype.setup = function (pMesh, sName, iId, ePrimType) {
    if (arguments.length < 4) {
        return false;
    }
    //TODO: calc options for data set.
    parent.setup(pMesh, iId, ePrimType);

    this.name = sName;

    return true;
};


MeshSubset.prototype.setMaterial = function (iMaterial) {
    
};



A_NAMESPACE(MeshSubset);