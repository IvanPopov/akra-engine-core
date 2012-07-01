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
    this._pMaps = [];
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
    this._pMaps.push(this._pMap);

    return true;
};

//добавляем сабмешу ссылку на его данные.
RenderDataSubset.prototype._addData = function (pVertexData, iFlow) {
    'use strict';

    return (iFlow === undefined? this._pMap.flow(pVertexData): 
        this._pMap.flow(iFlow, pVertexData));
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
        this._pIndexData._iAdditionCache = {};
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

    return pVertexData.getOffset();
};

RenderDataSubset.prototype.addIndexSet = function(usePreviousDataSet, ePrimType) {
    'use strict';
    usePreviousDataSet = ifndef(usePreviousDataSet, true);

    if (this._pIndexData === null) {
        return false;
    }

    this._pIndexData = null;
    if (usePreviousDataSet) {
        this._pMap = this._pMap.clone(false);
        
        if (!this._pMap) {
            return -1;
        }
    }
    else {
        this._pMap = new a.BufferMap(this._pFactory.getEngine());
    }
    
    this._pMap.primType = ePrimType || a.PRIMTYPE.TRIANGLELIST;
    this._pMaps.push(this._pMap);

    return this._pMap.length - 1;
};

RenderDataSubset.prototype.getIndexSet = function() {
    'use strict';

    for (var i = 0; i < this._pMaps.length; ++ i) {
        if (this._pMaps[i] === this._pMap) {
            return i;
        }
    }

    return -1;
};

RenderDataSubset.prototype.selectIndexSet = function(iSet) {
    if (this._pMaps[iSet]) {
        this._pMap = this._pMaps[iSet];
        this._pIndexData = this._pIndexBuffer._pVertexDataArray[iSet];
        return true;
    }

    return false;
};

/**
 * Setup index.
 * @param  {Int} iData      Data identifier.
 * @param  {String} eSemantics Index semantics.
 * @param  {Boolean} useSame    Use same anywere?
 * @param  {Int} iBeginWith Begin index from...
 * @return {Boolean}          
 */
RenderDataSubset.prototype.index = function (iData, eSemantics, useSame, iBeginWith) { 
    'use strict'
    iBeginWith = iBeginWith || 0;
    useSame = useSame || false;
    
    var iFlow = -1;
    var iAddition, iRealAddition, iPrevAddition;
    var pFlow;
    var pData;
    var iIndexOffset;
    var pIndexData = this._pIndexData;
    
    for (var i = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++ i) {
        pFlow = pFlows[i];

        if (pFlow.pData && pFlow.pData.getOffset() === iData) {
            iFlow = pFlow.iFlow;
            break;
        }
    }

    if (iFlow < 0) {
        return false;
    }

    iIndexOffset = pIndexData._pVertexDeclaration.element(eSemantics).iOffset;
    pData = pIndexData.getTypedData(eSemantics);
    iAddition = iData;

    if (!pData) {
        return false;
    }

    var iTypeSize = 4.0;//a.getTypeSize(a.DTYPE.FLOAT);
    var iStride = pFlow.pData.stride;
    
    if (pIndexData._iAdditionCache[iIndexOffset] !== iAddition) {
        iPrevAddition = pIndexData._iAdditionCache[iIndexOffset] || 0;
        iRealAddition = iAddition - iPrevAddition;
        if (!useSame) {
            for (var i = 0; i < pData.length; i++) {
                pData[i] = (pData[i] * iStride + iRealAddition) / iTypeSize;
            };
        }
        else {
            for (var i = 0; i < pData.length; i++) {
                pData[i] = (iBeginWith + iRealAddition) / iTypeSize;
            };   
        }

        //remeber addition, that we added to index.
        pIndexData._iAdditionCache[iIndexOffset] = iAddition;
        
        if (!pIndexData.setData(pData, eSemantics)) {
            return false;
        }
    }

    return this._pMap.mapping(iFlow, pIndexData, eSemantics);
};

A_NAMESPACE(RenderDataSubset);
