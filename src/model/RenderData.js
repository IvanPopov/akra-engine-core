/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 * @brief RenderData class.
 */

/**
 * RenderData class.
 * Represents some independent set of data, that can be rendered.
 * @constructor
 * @system
 */
function RenderData() {
    /**
     * @enum
     * @private
     * Type of data, that can be allocated with render data.
     */
    Enum([
        DT_ISOLATED = 0,   //<! положить данные в текстуру, и больше ничего не делать.
        DT_INDEXED,        //<! обычные даннае из текстуры, доступные по индексу.
        DT_I2I,            //<! данные по 2йному индексу.
        DT_DIRECT          //<! непосредственно данные для атрибута.
    ], RENDERDATA_DATA_TYPES, a.RenderData);

    Enum([
        ADVANCED_INDEX = FLAG(0x10),    //<! использовать индекс на индекс упаковку данных
        SINGLE_INDEX = FLAG(0x11)       //<! создать RenderData как классические данные, с данными только в аттрибутах, без использования видео буфферов.
        ], RENDERDATA_OPTIONS, a.RenderData);

    /**
     * Options.
     * @type {Number}
     * @private
     */
    this._eOptions = 0;

    /**
     * Factory, that create this class. 
     * @private
     * @type {RenderDataFactory}
     */
    this._pFactory = null;

    /**
     * ID of this data.
     * @private
     * @type {Number}
     */
    this._iId = -1;

    /**
     * Buffer with indices.
     * If the data is the simplest mesh, with no more 
     * than one index, the type will be IndexBuffer,
     * otherwise VertexBuffer.
     * @type {VertexBuffer|IndexBuffer}
     */
    this._pIndexBuffer = null;

    /**
     * Buffer with attributes.
     * @type {VertexBuffer}
     */
    this._pAttribBuffer = null;

    /**
     * Data with indices.
     * If _pIndexBuffer has type IndexBuffer, indices data
     * has type IndexData, otherwise VertexData.
     * @type {VertexData|IndexData}
     */
    this._pIndexData = null;

    /**
     * Data with attributes.
     * @type {VertexData}
     */
    this._pAttribData = null;

    /**
     * Buffer map for current index set.
     * @type {[type]}
     */
    this._pMap = null;

    /**
     * Buffer maps of all index sets.
     * @type {Array}
     */
    this._pMaps = [];
}

EXTENDS(RenderData, a.ReferenceCounter);

/**
 * Get factory of this data.
 */
PROPERTY(RenderData, 'factory',
    function () {
        return this._pFactory;
    });

/**
 * @protected
 * Setup.
 * @param  {RenderDataFactory}  pFactory  Factory of this data.
 * @param  {Number}             iId       Identifier.
 * @param  {PRIMITIVE_TYPE=TRIANGLELIST}     ePrimType Base type of primitives for rendering this data.
 * @param  {RENDERDATA_OPTIONS}                eOptions  Options.
 * @return {Boolean} Result.
 */
RenderData.prototype.setup = function(pFactory, iId, ePrimType, eOptions) {
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

    debug_assert(this.useSingleIndex() === false, 'single indexed data not implimented');

    return true;
};

/**
 * @private
 * @param  {VertexDeclaration} pDataDecl Declaration.
 * @param  {TypedArray|ArrayBuffer} pData     Data.
 * @param  {RENDERDATA_DATA_TYPES} eType     Data type.
 * @return {Int}    Data location or -1, if allocation failed.
 */
RenderData.prototype._allocateData = function (pDataDecl, pData, eType) {
    'use strict';

    if (eType === a.RenderData.DT_DIRECT) {
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
/**
 * Add vertex data to this render data.
 * @private
 * @param {VertexData}              pVertexData     Vertex data for this render data.
 * @param {Int=}                    iFlow           Number of flow for this data.
 * @param {RENDERDATA_DATA_TYPES}   eType           Data type.
 */
RenderData.prototype._addData = function (pVertexData, iFlow, eType) {
    'use strict';

    if ((arguments.length < 3 && this.useAdvancedIndex()) || 
        arguments[2] === a.RenderData.DT_I2I) {
        return this._registerData(pVertexData);
    }

    return (iFlow === undefined? this._pMap.flow(pVertexData): 
        this._pMap.flow(iFlow, pVertexData));
};


/**
 * Register data in this render.
 * Necessary for index to index mode, when data realy 
 * not using in this render data for building final buffer map.
 * @param  {VertexData} pVertexData Data.
 * @return {Int} Always return 0.
 */
RenderData.prototype._registerData = function (pVertexData) {
    'use strict';
    var iOffset = pVertexData.getOffset();
    var pDataDecl = pVertexData.getVertexDeclaration();

    //необходимо запоминать расположение данных, которые подаются,
    //т.к. иначе их потом нельзя будет найти среди других данных
    for (var i = 0; i < pDataDecl.length; i++) {
        this._pMap._pI2IDataCache[pDataDecl[i].eUsage] = iOffset;
    };

    return 0;
};

/**
 * Allocate data for rendering.
 * @param  {VertexDeclaration}  pDataDecl Data declaration.
 * @param  {TypedArray|ArrayBuffer}  pData     Data.
 * @param  {Boolean=true} hasIndex Specifies whether the data is indexed.
 * @return {Int} Data location.
 */
RenderData.prototype.allocateData = function(pDataDecl, pData, hasIndex) {
    'use strict';
    
    var eType = a.RenderData.DT_INDEXED;
    
    hasIndex = ifndef(hasIndex, true);

    if (!hasIndex || this.useSingleIndex()) {
        eType = a.RenderData.DT_DIRECT;
    }
    else if (this.useAdvancedIndex()) {
        eType = a.RenderData.DT_I2I;
    }

    return this._allocateData(pDataDecl, pData, eType);
};


/**
 * Specifies uses advanced index.
 * @return {Boolean} True, if uses. 
 */
RenderData.prototype.useAdvancedIndex = function () {
    'use strict';
    return (this._eOptions & a.RenderData.ADVANCED_INDEX) != 0;
};


RenderData.prototype.useSingleIndex = function () {
    'use strict';
    
    return (this._eOptions & a.RenderData.SINGLE_INDEX) != 0;
};

RenderData.prototype.useMultiIndex = function () {
    'use strict';
    
    return (this._eOptions & a.RenderData.SINGLE_INDEX) == 0;
};

/**
 * Remove data from this render data.
 * @param  {Int} iDataLocation Data location.
 * @return {Boolean} Result.
 */
RenderData.prototype.releaseData = function (iDataLocation) {
    'use strict';
        
    //TODO: release data.
};


/**
 * Allocate attribute. 
 * Attribute - data without index.
 * @param  {VertexDeclaration} pAttrDecl Data declaration.
 * @param  {TypedArray|ArrayBuffer} pData     Data.
 * @return {Boolean}           Result.
 */
RenderData.prototype.allocateAttribute = function (pAttrDecl, pData) {
    'use strict';
    
    var pIndexData = this._pIndexData;
    var pAttribData = this._pAttribData;
    var pAttribBuffer = this._pAttribBuffer;
    var pFactory = this._pFactory;

    if (!pAttribData) {
        if (!pAttribBuffer) {
            pAttribBuffer = pFactory.getEngine().displayManager()
                .vertexBufferPool().createResource('render_data_attrs_' + a.sid());
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


/**
 * Allocate advanced index. 
 * @private
 * @param  {VertexDeclaration} pAttrDecl Data declaration.
 * @param  {TypedArray|ArrayBuffer} pData     Data.
 * @return {Boolean}           Result
 */
RenderData.prototype._allocateAdvancedIndex = function (pAttrDecl, pData) {
    'use strict';
    
    var pDecl = a.normalizeVertexDecl(pAttrDecl);
    var nCount = pData.byteLength / pDecl.iStride;
    //TODO: remove index dublicates
    var iIndLoc = this._allocateData(pAttrDecl, pData, a.RenderData.DT_INDEXED);
    var pI2IData = new Float32Array(nCount);
    var pI2IDecl = [];

    for (var i = 0; i < pDecl.length; i++) {
        pI2IDecl.push(VE_FLOAT('INDEX_' + pDecl[i].eUsage, 0));
    };
    
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

/**
 * Create IndexBuffer/IndexData for storage indices.    
 * @private
 * @param  {VertexDeclaration} pAttrDecl Data declaration.
 * @param  {TypedArray|ArrayBuffer} pData     Data with index, that will 
 * be allocated in created buffer.
 * @return {Boolean}           Result.
 */
RenderData.prototype._createIndex = function (pAttrDecl, pData) {
    'use strict';

    if (!this._pIndexBuffer) {
        if (this.useMultiIndex()) {
            this._pIndexBuffer = this._pFactory.getEngine().displayManager()
                .vertexBufferPool().createResource('subset_' + a.sid());
            this._pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
        }
        else {
            //TODO: add support for sinle indexed mesh.
        }
    }

    this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
    this._pIndexData._iAdditionCache = {};

    return this._pIndexData !== null;
};


/**
 * Allocate index.
 * @private
 * @param  {VertexDeclaration} pAttrDecl Index declaration.
 * @param  {TypedArray|ArrayBuffer} pData     Index data.
 * @return {Boolean}           Result.
 */
RenderData.prototype._allocateIndex = function (pAttrDecl, pData) {
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


/**
 * Allocate index.
 * @param  {VertexDeclaration} pAttrDecl Index data declaration.
 * @param  {TypedArray|ArrayBuffer} pData     Index data.
 * @return {Boolean}           Result.
 */
RenderData.prototype.allocateIndex = function (pAttrDecl, pData) {
    if (this.useAdvancedIndex()) {
        return this._allocateAdvancedIndex(pAttrDecl, pData);
    }
    return this._allocateIndex(pAttrDecl, pData);
};

/**
 * Add new set of indices.
 * @param {Boolean=true} usePreviousDataSet Set TRUE, if you want to use
 * all data, that was be added previously.
 * @param {PRIMITIVE_TYPE} ePrimType    Type of primitives.
 */
RenderData.prototype.addIndexSet = function(usePreviousDataSet, ePrimType) {
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

/**
 * Select set of indices.
 * @param  {Int} iSet Set number.
 * @return {Boolean}      Result.
 */
RenderData.prototype.selectIndexSet = function(iSet) {
    if (this._pMaps[iSet]) {
        this._pMap = this._pMaps[iSet];
        this._pIndexData = this._pIndexBuffer? this._pIndexBuffer._pVertexDataArray[iSet]: null;
        this._pAttribData = this._pAttribData? this._pAttribBuffer._pVertexDataArray[iSet]: null;
        return true;
    }

    return false;
};


/**
 * Get number of current index set.
 * @return {Int} Number of inde set or -1.
 */
RenderData.prototype.getIndexSet = function() {
    'use strict';

    for (var i = 0; i < this._pMaps.length; ++ i) {
        if (this._pMaps[i] === this._pMap) {
            return i;
        }
    }

    return -1;
};

/**
 * Check whether the semantics used in this data set.
 * @param  {DECLARATION_USAGE|String}  sSemantics Data semantics.
 * @return {Boolean}        Result.
 */
RenderData.prototype.hasSemantics = function (sSemantics) {
    'use strict';

    return this.getFlow(sSemantics) !== null;
};


/**
 * Get data location.
 * @param  {DECLARATION_USAGE|String} sSemantics Any semantics from data.
 * @return {Int} Data location or -1, if data not founded.
 */
RenderData.prototype.getDataLocation = function (sSemantics) {
    'use strict';
    var pData = this.getData(sSemantics);
    return pData? pData.getOffset(): -1;
};


/**
 * Get indices that uses in current index set.
 * @return {IndexData|VertexData} Index data.
 */
RenderData.prototype.getIndices = function () {
    'use strict';
    
    return this._pIndexData;
};

/**
 * @protected
 * Get data flow by semantics or data location.
 * @property getFlow(Int iDataLocation)
 * @property getFlow(String sSemantics)
 * @property getFlow(DECLARATION_USAGE eSemantics)
 * @return {Object} Data flow.
 */
RenderData.prototype.getFlow = function () {
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
 * Get data by semantics or location.
 * @property getData(Int iDataLocation, bSearchOnlyInCurrentMap=false)
 * @property getData(String sSemanticsn, bSearchOnlyInCurrentMap=false)
 * @return {VertexData} Data.
 */
RenderData.prototype.getData = function () {
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
 * Get number of primitives for rendering.
 * @return {Uint} Number of primitives.
 */
RenderData.prototype.getPrimitiveCount = function () {
    'use strict';
    
    return this._pMap.primCount;
};

/**
 * Setup index.
 * @param  {Int} iData      Data identifier.
 * @param  {String} eSemantics Index semantics.
 * @param  {Boolean} useSame    Use same anywere?
 * @param  {Int} iBeginWith Begin index from...
 * @return {Boolean}          
 */
RenderData.prototype.index = function (iData, eSemantics, useSame, iBeginWith) { 
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
        iAddition = pRealData.getOffset();
        iStride = pRealData.stride;
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

/**
 * Draw this data.
 * @return {Boolean} Result of call.
 */
RenderData.prototype.draw = function () {
    'use strict';

    var pProgram;

    if (this._pIndexData === null) {
            return;
    }

    this._pFactory._pEngine.shaderManager().getActiveProgram().applyBufferMap(this._pMap);
    return this._pMap.draw();
};

Ifdef (__DEBUG);

RenderData.prototype.toString = function () {
    'use strict';
    
    var s; 
    s  = 'RENDER DATA SUBSET: #' + this._iId + '\n';
    s += '        ATTRIBUTES: ' + (this._pAttribData? 'TRUE': 'FALSE') + '\n';
    s += '----------------------------------------------------------------\n';
    s += this._pMap.toString();

    return s;
};

Endif ();

A_NAMESPACE(RenderData);
