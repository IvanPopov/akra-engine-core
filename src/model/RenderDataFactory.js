
function RenderDataFactory (pEngine) {
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
    var pData = pData = this._pDataBuffer._pVertexDataArray;
    for (var i = 0; i < pData.length; i++) {
        if (pData[i].hasSemantics(sSemantics)) {
            return pData[i];
        }
    };

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

/**
 * Положить данные в буфер.
 * @private
 */
RenderDataFactory.prototype._allocateData = function(pVertexDecl, pData) {
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

RenderDataFactory.prototype.draw = function() {
    'use strict';
    var pProgram = this._pEngine.shaderManager().getActiveProgram();
    for (var i = 0; i < this._pSubsets.length; i++) {
        pProgram.applyBufferMap(this._pSubsets[i]._pMap);
        this._pSubsets[i]._pMap.draw();
    };
};


/**
 * @protected
 */
RenderDataFactory.prototype.setup = function (eOptions) {
    this._pDataBuffer = this._pEngine.pDisplayManager.videoBufferPool().createResource('data_factory_buffer' + '_' + a.sid());
    //TODO: add support for eOptions
    this._pDataBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
};

RenderDataFactory.prototype.destroy = function () {
    'use strict';
    
    TODO('destroy this!');
};

RenderDataFactory.prototype.destructor = function () {
    'use strict';
    
    this.destroy();
};

A_NAMESPACE(RenderDataFactory);