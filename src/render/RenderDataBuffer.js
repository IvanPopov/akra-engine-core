
function RenderDataBuffer (pEngine) {
    A_CLASS;

    Enum([
        VB_READABLE = FLAG(a.VBufferBase.RamBackupBit),
        RD_ADVANCED_INDEX = a.RenderData.ADVANCED_INDEX,
        RD_SINGLE_INDEX = a.RenderData.SINGLE_INDEX,
        RD_RENDERABLE = a.RenderData.RENDERABLE
    ], RenderDataBuffer_OPTIONS, a.RenderDataBuffer);

    //video buffer with all mesh data
    this._pDataBuffer = null;
    this._pEngine = pEngine;
    this._eDataOptions = 0;
    this._pSubsetType = null;
    this._pDataArray = [];
}

EXTENDS(RenderDataBuffer, a.ReferenceCounter);

PROPERTY(RenderDataBuffer, 'buffer',
    function () {
        return this._pDataBuffer;
    });

/**
 * @deprecated
 */
PROPERTY(RenderDataBuffer, 'dataType',
    function () {
        return this._pSubsetType;
    },
    function (pSubsetType) {
        debug_assert(this._pSubsetType === null, 'subset type already set.');
        this._pSubsetType = pSubsetType;
    });

RenderDataBuffer.prototype.getEngine = function() {
    return this._pEngine;
};

RenderDataBuffer.prototype.getOptions = function() {
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
 * @return {VertexData} Data with given semantics or null.
 */
RenderDataBuffer.prototype.getData = function () {
    var pData;

    if (this._pDataBuffer) {
        pData = pData = this._pDataBuffer._pVertexDataArray;
        if (typeof arguments[0] === 'string') {
            for (var i = 0; i < pData.length; i++) {
                if (pData[i].hasSemantics(arguments[0])) {
                    return pData[i];
                }
            };
        }
        else {
            for (var i = 0; i < pData.length; i++) {
                if (pData[i].getOffset() === arguments[0]) {
                    return pData[i];
                }
            };
        }
    }

    return null;
};

/**
 * Положить данные в буфер.
 * @private
 */
RenderDataBuffer.prototype._allocateData = function(pVertexDecl, pData) {
    'use strict';
    
    if (!this._pDataBuffer) {
        this._createDataBuffer();
    }

    pVertexDecl = normalizeVertexDecl(pVertexDecl);
    var pVertexData;
    
    if ((arguments.length < 2) || (typeof arguments[1] === 'number') || pData === null) {
        pVertexData = this._pDataBuffer.getEmptyVertexData(pData || 1, pVertexDecl);
    }
    else {
        pVertexData = this._pDataBuffer.allocateData(pVertexDecl, pData);    
    }

    debug_assert(pVertexData !== null, 'cannot allocate data:\n' + pVertexDecl.toString());
    return pVertexData;
};

//публиный метод, для задания данных сразу для всех сабсетов
/**
 * @property allocateData(pDataDecl, iSize)
 */
RenderDataBuffer.prototype.allocateData = function (pDataDecl, pData) {     
    var pVertexData;

    pDataDecl = normalizeVertexDecl(pDataDecl);

Ifdef (__DEBUG);
    
    for (var i = 0; i < pDataDecl.length; i++) {
        assert(this.getData(pDataDecl[i].eUsage) === null || pDataDecl[i].nCount === 0, 
            "data buffer already contains data with similar vertex decloration.");
    };

Endif ();

    pVertexData = this._allocateData(pDataDecl, pData);

    for (var i = 0; i < this._pDataArray.length; ++ i) {
        this._pDataArray[i]._addData(pVertexData);
    }

    return pVertexData.getOffset();
};

RenderDataBuffer.prototype.getDataLocation = function (sSemantics) {
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

RenderDataBuffer.prototype._createDataBuffer = function () {
    'use strict';
    //TODO: add support for eOptions
    var iVbOption = 0;
    var iOptions = this._eDataOptions;

    if (iOptions & a.RenderDataBuffer.VB_READABLE) {
        SET_BIT(iVbOption, FLAG(a.VBufferBase.ReadableBit));
    }
    
    this._pDataBuffer = this._pEngine.pDisplayManager.videoBufferPool().createResource('render_data_buffer' + '_' + a.sid());
    this._pDataBuffer.create(0, iVbOption);
    this._pDataBuffer.addRef();
    return this._pDataBuffer !== null;
};


RenderDataBuffer.prototype.getRenderData = function (iSubset) {
    'use strict';
    
    return this._pDataArray[iSubset];
};

/**
 * Allocate new data set.
 * @param {Int} ePrimType Type of primitives.
 * @param {Int} eOptions Опции. Определяют можно ли объединять в группы датасеты.
 */
RenderDataBuffer.prototype.getEmptyRenderData = function (ePrimType, eOptions) {
    debug_assert(this._pSubsetType !== null, 'subset type not specified.');

    var iSubsetId = this._pDataArray.length;
    var pDataset = new this._pSubsetType(this._pEngine);

    eOptions |= this._eDataOptions;

    if (!pDataset.setup(this, iSubsetId, ePrimType, eOptions)) {
        debug_error('cannot setup submesh...');
    }
    

    this._pDataArray.push(pDataset);

    return pDataset;
};

Ifdef (__DEBUG);

RenderDataBuffer.prototype.draw = function(iSubset) {
    'use strict';
    

    if (iSubset !== undefined) {
        return this._pDataArray[iSubset].draw();
    }

    for (var i = 0; i < this._pDataArray.length; i++) {
        this._pDataArray[i].draw();
    };

    return true;
};

Endif ();

/**
 * @protected
 */
RenderDataBuffer.prototype.setup = function (eOptions) {
    this._eDataOptions = eOptions;
    if (!this._pSubsetType) {
        this._pSubsetType = a.RenderData;
    }
};

RenderDataBuffer.prototype.destroy = function () {
    'use strict';
    
    safe_delete_array(this._pDataArray);
    
    if (this._pDataBuffer) {
        this._pDataBuffer.relese();
        this._pDataBuffer.destroy();
        this._pDataBuffer = null;
    }

    this._pEngine = null;
    this._eDataOptions = 0;
    this._pSubsetType = null;
};

RenderDataBuffer.prototype.destructor = function () {
    'use strict';
    
    this.destroy();
};

A_NAMESPACE(RenderDataBuffer);