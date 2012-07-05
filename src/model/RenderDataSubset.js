/**
 * @ctor
 */


function RenderDataSubset() {

    this._eOptions = 0;
    this._pFactory = null;
    this._iId = -1;
    this._pIndexBuffer = null;
    this._pAttribBuffer = null;
    this._pIndexData = null;
    this._pAttribData = null;
    this._pMap = null;
    this._pMaps = [];
}

EXTENDS(RenderDataSubset, a.ReferenceCounter);

PROPERTY(MeshSubset, 'factory',
    function () {
        return this._pFactory;
    });

RenderDataSubset.prototype.setup = function(pFactory, iId, ePrimType, eOptions) {
    if (arguments.length < 4) {
        return false;
    }
    
    this._eOptions = eOptions;
    this._pFactory = pFactory;
    this._iId = iId;
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


RenderDataSubset.prototype.allocateAttribute = function (pAttrDecl, pData) {
    'use strict';
    
    var pIndexData = this._pIndexData;
    var pAttribData = this._pAttribData;
    var pAttribBuffer = this._pAttribBuffer;
    var pFactory = this._pFactory;

    if (!pAttribData) {
        if (!pAttribBuffer) {
            pAttribBuffer = pFactory.getEngine().displayManager()
                .vertexBufferPool().createResource('subset_attrs_' + a.sid());
            pAttribBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
            this._pAttribBuffer = pAttribBuffer;
        }

        this._pAttribData = this._pAttribBuffer.allocateData(pAttrDecl, pData);
        this._pMap.flow(this._pAttribData);
        return this._pAttribData !== null;
    }
    
    if (!pAttribData.extend(pAttrDecl, pData)) {
        trace('invalid data for allocation:', arguments);
        warning('cannot allocate attribute in data subset..');
        return false;
    }

    return true;
};



RenderDataSubset.prototype.allocateIndex = function (pAttrDecl, pData) {
    var pIndexData = this._pIndexData;
    var pIndexBuffer = this._pIndexBuffer;
    var pFactory = this._pFactory;
    
If (__DEBUG)
    for (var i = 0; i < pAttrDecl.length; i++) {
        if (pAttrDecl[i].eType !== a.DTYPE.FLOAT) {
            return false;
        }
    };
Endif ();

    if (!pIndexData) {
        if (!pIndexBuffer) {
            pIndexBuffer = pFactory.getEngine().displayManager()
                .vertexBufferPool().createResource('subset_' + a.sid());
            pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
            this._pIndexBuffer = pIndexBuffer;
        }
        this._pIndexData = pIndexBuffer.allocateData(pAttrDecl, pData);
        this._pIndexData._iAdditionCache = {};
        return this._pIndexData !== null;
    }
    
    if (!pIndexData.extend(pAttrDecl, pData)) {
        trace('invalid data for allocation:', arguments);
        warning('cannot allocate index in data subset..');
        return false;
    }

    return true;
};

RenderDataSubset.prototype.allocateData = function(pDataDecl, pData, hasIndex) {
    hasIndex = ifndef(hasIndex, true);

    if (!hasIndex) {
        return this.allocateAttribute(pDataDecl, pData);
    }

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

    if (usePreviousDataSet) {
        this._pMap = this._pMap.clone(false);
        
        if (!this._pMap) {
            return -1;
        }
    }
    else {
        this._pMap = new a.BufferMap(this._pFactory.getEngine());
    }

    this._pIndexData = null;
    if (this._pAttribData) {
        error('index sets with attribues temprary unavailable...');    
    }
    
    this._pMap.primType = ePrimType || a.PRIMTYPE.TRIANGLELIST;
    this._pMaps.push(this._pMap);

    return this._pMap.length - 1;
};

RenderDataSubset.prototype.getIndices = function () {
    'use strict';
    
    return this._pIndexData;
};

/**
 * @protected
 * @param  {String} sSemantics Declaration semantics.
 */
RenderDataSubset.prototype.getDataFlow = function (sSemantics) {
    'use strict';
    
    return this._pMap.getFlow(a.DECLUSAGE.MATERIAL);
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

RenderDataSubset.prototype.hasSemantics = function (sSemantics) {
    'use strict';

    return this.getDataFlow(sSemantics) !== null;
};

RenderDataSubset.prototype.getDataLocation = function (sSemantics) {
    'use strict';

    var pFlow; 
    
    for (var i = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++ i) {
        pFlow = pFlows[i];

        if (pFlow.pData && pFlow.pData.hasSemantics(sSemantics)) {
            return pFlow.pData.getOffset();
        }
    }

    return -1;
};

RenderDataSubset.prototype.selectIndexSet = function(iSet) {
    if (this._pMaps[iSet]) {
        this._pMap = this._pMaps[iSet];
        this._pIndexData = this._pIndexBuffer? this._pIndexBuffer._pVertexDataArray[iSet]: null;
        this._pAttribData = this._pAttribData? this._pAttribBuffer._pVertexDataArray[iSet]: null;
        return true;
    }

    return false;
};


/**
 * @protected
 */
RenderDataSubset.prototype.getFlow = function (iDataLocation) {
    'use strict';
    
    for (var i = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++ i) {
        var pFlow = pFlows[i];

        if (pFlow.pData && pFlow.pData.getOffset() === iDataLocation) {
            return pFlow;
        }
    }

    return null;
};

/**
 * @protected
 */
RenderDataSubset.prototype.getData = function (iDataLocation) {
    'use strict';
    
    var pFlow = this.getFlow(iDataLocation);
    return pFlow === null ? null: pFlow.pData;
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

    if (typeof iData === 'string') {
        iData = this.getDataLocation(iData);
    }
    
    var iFlow = -1;
    var iAddition, iRealAddition, iPrevAddition;
    var pFlow;
    var pData;
    var iIndexOffset;
    var pIndexData = this._pIndexData;
    
    pFlow = this.getFlow(iData);

    if (pFlow === null) {
        return false;
    }

    iFlow = pFlow.iFlow;
    iIndexOffset = pIndexData._pVertexDeclaration.element(eSemantics).iOffset;
    pData = pIndexData.getTypedData(eSemantics);
    iAddition = iData;

    if (!pData) {
        return false;
    }

    var iTypeSize = 4.0;//a.getTypeSize(a.DTYPE.FLOAT);
    var iStride = pFlow.pData.stride;
    
    if (pIndexData._iAdditionCache[iIndexOffset] !== iAddition) {
        if (!useSame) {
            iPrevAddition = pIndexData._iAdditionCache[iIndexOffset] || 0;
            iRealAddition = iAddition - iPrevAddition;

            for (var i = 0; i < pData.length; i++) {
                pData[i] = (pData[i] * iStride + iRealAddition) / iTypeSize;
            };
        }
        else {
            iRealAddition = iAddition;
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
