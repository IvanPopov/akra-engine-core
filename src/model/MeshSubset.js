/**
 * @ctor
 */
function MeshSubset (pEngine) {
    A_CLASS;

    /**
     * @private
     * @type {PRIMITIVE_TYPE}
     */
    this._ePrimType = 0;

    //vertexData(vertexBuffer) with indices
    //or IndexBuffer with indices
    this._pIndexData = null;
    this._pIndexBuffer = null;
    this._pMap = new a.BufferMap(pEngine);
    //parent mesh
    this._pMesh = null;

    //id
    this._iId = 0;

    this._iMaterial = -1;
}

EXTENDS(MeshSubset, a.RenderableObject);

PROPERTY(MeshSubset, 'parent',
    function () {
        return this._pMesh;
    });

/**
 * @protected
 * @param  {Engine} pEngine    [description]
 * @param  {Mesh} pMesh      [description]
 * @param  {Uint} iId        [description]
 * @param  {String} sName      [description]
 * @param  {PRIMITIVE_TYPE} ePrimType  [description]
 * @param  {Uint} iPrimCount [description]
 */
MeshSubset.prototype.setup = function (pMesh, iId, sName, pIndicesData, ePrimType) {
    if (arguments.length < 4) {
        return false;
    }

    this._pMesh = pMesh;
    this._iId = iId;
    this._ePrimType = ePrimType || a.PRIMTYPE.TRIANGLELIST;
    this._pIndices = pIndicesData;
    var pIndexBuffer = 
        PR_DISPLAYMNGR.vertexBufferPool().createResource('submesh_' + this.name + '_' + a.sid());
    pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
    this._pIndexBuffer = pIndexBuffer;

    this.name = sName;

    return true;
};

MeshSubset.prototype.allocateIndex = function (pAttrDecl, pData) {
    var pIndexData = this._pIndexData;
    
    if (!pIndexData) {
        this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
        return true;
    }
    
    return pIndexData.extend(pAttrDecl, pData);
};

MeshSubset.prototype.setMaterial = function (iMaterial) {
    
};

//добавляем сабмешу ссылку на его данные.
MeshSubset.prototype._addData = function (pVertexData) {
    this._pMap.flow(pVertexData);
}

A_NAMESPACE(MeshSubset);