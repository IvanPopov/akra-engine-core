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
    return this._pMap.flow(pVertexData)
};

RenderDataSubset.prototype.allocateIndex = function (pAttrDecl, pData) {
    var pIndexData = this._pIndexData;
    
If (__DEBUG)
    for (var i = 0; i < pAttrDecl.length; i++) {
        if (pAttrDecl[i].eType !== a.DTYPE.FLOAT) {
            return false;
        }
    };
Endif ();

    if (!pIndexData) {
        this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
        return true;
    }
    
    if (!pIndexData.extend(pAttrDecl, pData)) {
        trace('invalid data for allocation:', arguments);
        warning('cannot allocate index in data subset..');
        return false;
    }

    return true;
};

RenderDataSubset.prototype.allocateData = function(pDataDecl, pData) {
    var pVertexData = this._pFactory._allocateData(pDataDecl, pData);
    var iFlow = this._addData(pVertexData);
    
    if (iFlow < 0) {
        trace('invalid data', pDataDecl, pData);
        debug_assert('cannot allocate data for submesh');
        return -1;
    }

    return iFlow;
};

RenderDataSubset.prototype.index = function (iFlow, eSemantics) { 
    'use strict'
    
    var pData = this._pIndexData.getTypedData(eSemantics);
    var iAddition = this._pMap.getFlow(iFlow).pData.getOffset();

    if (!pData) {
        return false;
    }

    for (var i = 0; i < pData.length; i++) {
        pData[i] += iAddition;
    };

    //remeber addition, that we added to index.
    this._pIndexData._iAddition = iAddition;

    return this._pIndexData.setData(pData, eSemantics) && 
        this._pMap.mapping(iFlow, this._pIndexData, eSemantics);
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
    var pIndexData = this._pIndexData;
    var pFlows = this._pMap.flows;
   
    for (var i = 0; i < pFlows.length; ++ i) {
        if (!pFlows[i]) {
            continue;
        }

        if (pFlows[i].pData.hasSemantics(a.DECLUSAGE.MATERIAL)) {
            return trace('material alredy used!!!!!!!!!!!!');
        }
    }

    var eSemantics = 'INDEX_MAT9';
    var pDecl = new a.VertexDeclaration([VE_FLOAT(eSemantics)]);

    var pData = new Uint8Array(pIndexData.getCount() * pDecl.stride);
    var iMatFlow = this._addData(this._pFactory.getMaterial(iMaterial)._pData);
    
    if (iMatFlow < 0) {
        trace('AHTUNG!!! ALL\'s BAD!!', 'mat flow < 0');
        return false;
    }

    if (!this.allocateIndex(pDecl, pData)) {
        trace('cannot allocate index for material!!!');
        return false;
    }

    return this.index(iMatFlow, eSemantics);
};



A_NAMESPACE(MeshSubset);