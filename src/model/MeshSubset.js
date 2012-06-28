/**
 * @ctor
 */
function RenderDataSubset() {
    this._eOptions = 0;
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

RenderDataSubset.prototype.setup = function(pFactory, iId, ePrimType, eOptions) {
    if (arguments.length < 4) {
        return false;
    }

    var pIndexBuffer;

    pIndexBuffer = pFactory.getEngine().displayManager()
        .vertexBufferPool().createResource('subset_' + a.sid());
    pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
    
    this._pFactory = pFactory;
    this._iId = iId;
    this._pIndexBuffer = pIndexBuffer;
    this._pMap = new a.BufferMap(pFactory.getEngine());
    this._pMap.primType = ePrimType || a.PRIMTYPE.TRIANGLELIST;

    return true;
};

//добавляем сабмешу ссылку на его данные.
RenderDataSubset.prototype._addData = function (pVertexData) {
    return this._pMap.flow(pVertexData);
};

RenderDataSubset.prototype.allocateIndex = function (pAttrDecl, pData) {
    var pIndexData = this._pIndexData;
    
    if (!pIndexData) {
        this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
        return true;
    }
    
    return pIndexData.extend(pAttrDecl, pData);
};

RenderDataSubset.prototype.allocateData = function(pDataDecl, pData) {
    var pVertexData = this._pFactory._allocateData(pDataDecl, pData);
    return this._addData(pVertexData);
};

A_NAMESPACE(RenderDataSubset);

/**
 * @ctor
 */
function MeshSubset (pEngine) {
    A_CLASS;

    this._iMaterial = -1;
}

EXTENDS(MeshSubset, a.RenderDataSubset, a.RenderableObject);

PROPERTY(MeshSubset, 'mesh',
    function () {
        return this.factory;
    });

MeshSubset.prototype.setup = function (pMesh, sName, iId, ePrimType) {
    if (arguments.length < 4) {
        return false;
    }
    //TODO: calc options for data set.
    parent.setup(pMesh, iId, ePrimType, 0);

    this.name = sName;

    return true;
};


MeshSubset.prototype.setMaterial = function (iMaterial) {
    //if (this._pMap.has)
    this._pMap.findFlow('MATERIAL');
    trace('map:', this._pMap);
};



A_NAMESPACE(MeshSubset);