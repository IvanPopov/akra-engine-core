
function RenderDataFactory (pEngine) {
    Enum([
        VB_READABLE = a.VBufferBase.RamBackupBit
    ], RENDERDATA_OPTIONS, a.RenderDataFactory);

    //video buffer with all mesh data
    this._pDataBuffer = null;
    this._pEngine = pEngine;
    this._eDataOptions = 0;
    this._pSubsetType = null;
    this._pSubsets = [];
}

PROPERTY(RenderDataFactory, 'subsetType',
    function () {
        return this._pSubsetType;
    },
    function (pSubsetType) {
        debug_assert(this._pSubsetType === null, 'subset type already set.');
        this._pSubsetType = pSubsetType;
    });

RenderDataFactory.prototype.getEngine = function() {
    return this._pEngine;
};

RenderDataFactory.prototype.getDataOptions = function() {
    return this._eDataOptions;
};


/**
 * @property getData(DECLARATION_USAGE eUsage) 
 * @param eUsage Usage of desired data.
 * @memberOf Mesh
 * @return {VertexData} Data with given semantics or null.
 */

/**
 * Find VertexData with given semantics/usage.
 * @param  {String} sSemantics Data semantics.
 * @return {VertexData} Data with given semantics or null.
 */
RenderDataFactory.prototype.getData = function (sSemantics) {
    var pData;

    if (this._pDataBuffer) {
        pData = pData = this._pDataBuffer._pVertexDataArray;
        for (var i = 0; i < pData.length; i++) {
            if (pData[i].hasSemantics(sSemantics)) {
                return pData[i];
            }
        };
    }

    return null;
};

//публиный метод, для задания данных сразу для всех сабсетов
RenderDataFactory.prototype.allocateData = function (pDataDecl, pData) {     
    var pVertexData;

    pDataDecl = normalizeVertexDecl(pDataDecl);

    for (var i = 0; i < pDataDecl.length; i++) {
        assert(this.getData(pDataDecl[i].eUsage) === null, 
            "data factory already contains data with similar vertex decloration.");
    };

    pVertexData = this._allocateData(pDataDecl, pData);

    for (var i = 0; i < this._pSubsets.length; ++ i) {
        this._pSubsets[i]._addData(pVertexData);
    }

    return pVertexData.getOffset();
};

RenderDataFactory.prototype.getDataLocation = function (sSemantics) {
    'use strict';

    if (this._pDataBuffer) {
        var pDataList = this._pDataBuffer._pVertexDataArray;
        
        for (var i = 0; i < pDataList.length; i++) {
            if (pDataList[i].hasSemantics(sSemantics)) {
                return pDataList[i].getOffset();
            }
        };
    }

    return -1;
};

RenderDataFactory.prototype._createDataBuffer = function () {
    'use strict';
    //TODO: add support for eOptions
    trace('data options ::', this._eDataOptions);
    this._pDataBuffer = this._pEngine.pDisplayManager.videoBufferPool().createResource('data_factory_buffer' + '_' + a.sid());
    this._pDataBuffer.create(0, this._eDataOptions);
    this._pDataBuffer.addRef();
    return this._pDataBuffer !== null;
};

/**
 * Положить данные в буфер.
 * @private
 */
RenderDataFactory.prototype._allocateData = function(pVertexDecl, pData) {
    if (!this._pDataBuffer) {
        this._createDataBuffer();
    }
    if (!pData) {
        return this._pDataBuffer.getEmptyVertexData(1, pVertexDecl);
    }
    return this._pDataBuffer.allocateData(pVertexDecl, pData);
};


/**
 * Allocate new data set.
 * @param {Int} ePrimType Type of primitives.
 * @param {Int} eOptions Опции. Определяют можно ли объединять в группы датасеты.
 */
RenderDataFactory.prototype.allocateSubset = function (ePrimType, eOptions) {
    debug_assert(this._pSubsetType !== null, 'subset type not specified.');

    var iSubsetId = this._pSubsets.length;
    var pDataset = new this._pSubsetType(this._pEngine);

    if (!pDataset.setup(this, iSubsetId, ePrimType, eOptions)) {
        debug_error('cannot setup submesh...');
    }
    

    this._pSubsets.push(pDataset);

    return pDataset;
};

Ifdef (__DEBUG);

RenderDataFactory.prototype.draw = function(iSubset) {
    'use strict';
    var pProgram = this._pEngine.shaderManager().getActiveProgram();

    if (iSubset !== undefined) {
        pProgram.applyBufferMap(this._pSubsets[iSubset]._pMap);
        this._pSubsets[iSubset]._pMap.draw();
        return;
    }

    for (var i = 0; i < this._pSubsets.length; i++) {
        if (this._pSubsets[i]._pIndexData === null) {
            continue;
        }
        pProgram.applyBufferMap(this._pSubsets[i]._pMap);
        this._pSubsets[i]._pMap.draw();
    };
};

Endif ();

RenderDataFactory.prototype.getSubset = function (iSubset) {
    'use strict';
    
    return this._pSubsets[iSubset];
};

/**
 * @protected
 */
RenderDataFactory.prototype.setup = function (eOptions) {
    this._eDataOptions = eOptions;
    if (!this._pSubsetType) {
        this._pSubsetType = a.RenderDataSubset;
    }
};

RenderDataFactory.prototype.destroy = function () {
    'use strict';
    
    safe_delete_array(this._pSubsets);
    
    if (this._pDataBuffer) {
        this._pDataBuffer.relese();
        this._pDataBuffer.destroy();
        this._pDataBuffer = null;
    }

    this._pEngine = null;
    this._eDataOptions = 0;
    this._pSubsetType = null;
};

RenderDataFactory.prototype.destructor = function () {
    'use strict';
    
    this.destroy();
};

A_NAMESPACE(RenderDataFactory);