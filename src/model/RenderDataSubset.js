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
    this._pMap._pI2IDataCache = {};
    return true;
};

Enum([
    DT_ISOLATED = 0,   //положить данные в текстуру, и больше ничего не делать.
    DT_INDEXED,        //обычные даннае из текстуры, доступные по индексу.
    DT_I2I,            //данные по 2йному индексу.
    DT_DIRECT          //непосредственно данные для атрибута.
    ], RENDERDATASUBSET_DATA_TYPES, a.RenderDataSubset);

RenderDataSubset.prototype._allocateData = function (pDataDecl, pData, eType) {
    'use strict';

    if (eType === a.RenderDataSubset.DT_DIRECT) {
        return this.allocateAttribute(pDataDecl, pData);
    }

    var iFlow;
    var pVertexData = this._pFactory._allocateData(pDataDecl, pData);
    var iOffset = pVertexData.getOffset();

    iFlow = this._addData(pVertexData, undefined, eType);
    
    if (iFlow < 0) {
        trace('invalid data', pDataDecl, pData);
        debug_assert('cannot allocate data for submesh');
        return -1;
    }

    return iOffset;
};

//добавляем сабмешу ссылку на его данные.
RenderDataSubset.prototype._addData = function (pVertexData, iFlow, eType) {
    'use strict';

    if ((arguments.length < 3 && this.useAdvancedIndex()) || 
        arguments[2] === a.RenderDataSubset.DT_I2I) {
        return this._registerData(pVertexData);
    }

    return (iFlow === undefined? this._pMap.flow(pVertexData): 
        this._pMap.flow(iFlow, pVertexData));
};

RenderDataSubset.prototype._registerData = function (pVertexData) {
    'use strict';
    var iOffset = pVertexData.getOffset();
    var pDataDecl = pVertexData.getVertexDeclaration();
    for (var i = 0; i < pDataDecl.length; i++) {
        this._pMap._pI2IDataCache[pDataDecl[i].eUsage] = iOffset;
    };

    return 0;
};

RenderDataSubset.prototype.allocateData = function(pDataDecl, pData, hasIndex) {
    'use strict';
    
    var eType = a.RenderDataSubset.DT_INDEXED;
    
    hasIndex = ifndef(hasIndex, true);
    if (!hasIndex) {
        eType = a.RenderDataSubset.DT_DIRECT;
    }
    else if (this.useAdvancedIndex()) {
        eType = a.RenderDataSubset.DT_I2I;
    }

    return this._allocateData(pDataDecl, pData, eType);
};

RenderDataSubset.prototype.useAdvancedIndex = function () {
    'use strict';
    return (this._eOptions & a.RenderDataFactory.RDS_ADVANCED_INDEX) != 0;
};


RenderDataSubset.prototype.releaseData = function (iDataLocation) {
    'use strict';
        
    //TODO: release data.
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


RenderDataSubset.prototype._allocateAdvancedIndex = function (pAttrDecl, pData) {
    'use strict';
    
    var pDecl = a.normalizeVertexDecl(pAttrDecl);
    var nCount = pData.byteLength / pDecl.iStride;
    //TODO: remove index dublicates
    var iIndLoc = this._allocateData(pAttrDecl, pData, a.RenderDataSubset.DT_INDEXED);

    var sI2ISemantics = 'INDEX_' + pDecl[0].eUsage;
    var pI2IDecl = VE_FLOAT(sI2ISemantics);
    var pI2IData = new Float32Array(nCount);

    for (var i = 0; i < pI2IData.length; i++) {
        pI2IData[i] = i;
    };

    if (!this._allocateIndex(pI2IDecl, pI2IData)) {
        this.releaseData(iIndLoc);
        pI2IData = null;
        pI2IDecl = null;
        warning('cannot allocate index for index in render data subset');
        return false;
    }

    return true;
};

RenderDataSubset.prototype._createIndex = function (pAttrDecl, pData) {
    'use strict';

    if (!this._pIndexBuffer) {
        this._pIndexBuffer = this._pFactory.getEngine().displayManager()
            .vertexBufferPool().createResource('subset_' + a.sid());
        this._pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
    }

    this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
    this._pIndexData._iAdditionCache = {};

    return this._pIndexData !== null;
};

RenderDataSubset.prototype._allocateIndex = function (pAttrDecl, pData) {
    'use strict';
    
    var pIndexData = this._pIndexData;
    var pIndexBuffer = this._pIndexBuffer;
    var pFactory = this._pFactory;
    'use strict';
    
Ifdef (__DEBUG)
    for (var i = 0; i < pAttrDecl.length; i++) {
        if (pAttrDecl[i].eType !== a.DTYPE.FLOAT) {
            return false;
        }
    };
Endif ();

    if (!this._pIndexData) {
        return this._createIndex(pAttrDecl, pData);
    }
    
    if (!this._pIndexData.extend(pAttrDecl, pData)) {
        trace('invalid data for allocation:', arguments);
        warning('cannot allocate index in data subset..');
        return false;
    }

    return true;
};

RenderDataSubset.prototype.allocateIndex = function (pAttrDecl, pData) {
    if (this.useAdvancedIndex()) {
        return this._allocateAdvancedIndex(pAttrDecl, pData);
    }
    return this._allocateIndex(pAttrDecl, pData);
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

    return this.getFlow(sSemantics) !== null;
};

RenderDataSubset.prototype.getDataLocation = function (sSemantics) {
    'use strict';
    var pData = this.getData(sSemantics);
    return pData? pData.getOffset(): -1;
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
RenderDataSubset.prototype.getFlow = function () {
    'use strict';
    
    if (typeof arguments[0] === 'string') {
        return this._pMap.getFlow(arguments[0]);
    }

    for (var i = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++ i) {
        var pFlow = pFlows[i];

        if (pFlow.pData && pFlow.pData.getOffset() === arguments[0]) {
            return pFlow;
        }
    }

    return null;
};

/**
 * @protected
 */
RenderDataSubset.prototype.getData = function () {
    'use strict';
    
    var pFlow;

    if (this.useAdvancedIndex() && arguments.length < 2) {
        if (typeof arguments[0] === 'string') {
            return this.getData(this._pMap._pI2IDataCache[arguments[0]]);    
        }
        
        return this._pFactory.getData(arguments[0]);
    }

    if (typeof arguments[0] === 'string') {
        for (var i = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++ i) {
            pFlow = pFlows[i];

            if (pFlow.pData && pFlow.pData.hasSemantics(arguments[0])) {
                return pFlow.pData;
            }
        }

        return null;
    }

    pFlow = this.getFlow(arguments[0]);
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

    var iFlow = -1;
    var iAddition, iRealAddition, iPrevAddition;
    var pFlow;
    var pData, pRealData;
    var iIndexOffset;
    var pIndexData = this._pIndexData;
    var sData;
    var iStride;
    var iTypeSize = 4.0;//a.getTypeSize(a.DTYPE.FLOAT);

    if (this.useAdvancedIndex()) {
        pRealData = this.getData(iData);

            trace(this._pMap._pI2IDataCache);

        
        iAddition = pRealData.getOffset();
        iStride = pRealData.stride;
        
        
        trace('recalc indices<', eSemantics,'> values for data<', this.getData(iData).getVertexDeclaration()[0].eUsage,'> with addition', iAddition);
        

        pData = this.getData(eSemantics, true); //индекс, который подал юзер
        

        pData.applyModifier(eSemantics, function (pTypedData) {
            for (var i = 0; i < pTypedData.length; i++) {
                pTypedData[i] = (pTypedData[i] * iStride + iAddition) / iTypeSize;
            };
        });
        
        iData = pData.getOffset();
        eSemantics = 'INDEX_' + eSemantics;
    }
    else if (typeof arguments[0] === 'string') {
        iData = this.getDataLocation(iData);
    }
    
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

    
    iStride = pFlow.pData.stride;
    
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

RenderDataSubset.prototype.getPrimitiveCount = function () {
    'use strict';
    
    return this._pMap.primCount;
};

Ifdef (__DEBUG);

RenderDataSubset.prototype.toString = function () {
    'use strict';
    
    var s; 
    s  = 'RENDER DATA SUBSET: #' + this._iId + '\n';
    s += '        ATTRIBUTES: ' + (this._pAttribData? 'TRUE': 'FALSE') + '\n';
    s += '----------------------------------------------------------------\n';
    s += this._pMap.toString();

    return s;
};

Endif ();

A_NAMESPACE(RenderDataSubset);
