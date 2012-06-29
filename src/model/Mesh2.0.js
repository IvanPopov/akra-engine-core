/**
 * @file
 * @author Ivan Popov
 */


function RenderDataFactory (pEngine) {
    //video buffer with all mesh data
    this._pDataBuffer = null;
    this._pEngine = pEngine;
    this._eDataOptions = 0;
    this._pSubsetType = null;
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

// RenderDataFactory.prototype.setDataOptions = function(eOptions) {
//     this._eDataOptions = eOptions;
// };

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
    var pData = pData = this.pDataBuffer._pVertexDataArray;
    for (var i = 0; i < pData.length; i++) {
        if (pData[i].hasSemantics(sSemantics)) {
            return pData[i];
        }
    };

    return null;
};

//публиный метод, для задания данных сразу для всех сабсетов
RenderDataFactory.prototype.setData = function (pDataDecl, pData) {     
    var pVertexData;

    pDataDecl = normalizeVertexDecl(pDataDecl);

    for (var i = 0; i < pDataDecl.length; i++) {
        assert(this.getData(pDataDecl[i]) === null, 
            "data factory already contains data with similar vertex decloration.");
    };

    pVertexData = this._allocateData(pDataDecl, pData);

    for (var i = 0; i < this._pSubsets.length; ++ i) {
        this._pSubsets[i]._addData(pVertexData);
    }

    return pVertexData;
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

    debug_assert(pDataset.setup(this, iSubsetId, ePrimType, eOptions), 
        'cannot setup submesh...');

    this._pSubsets.push(pDataset);

    return pDataset;
};


/**
 * @protected
 */
RenderDataFactory.prototype.setup = function (eOptions) {
    this._pDataBuffer = this._pEngine.pDisplayManager.videoBufferPool().createResource('data_factory_buffer' + '_' + a.sid());
    //TODO: add support for eOptions
    this._pDataBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
};

A_NAMESPACE(RenderDataFactory);

function Mesh(pEngine, eOptions, sName) {
    A_CLASS;
    /**
     * Mesh name.
     * @type {String}
     * @private
     */
    this._sName = sName || null;

    //mesh Subsets
    this._pSubsets = [];

    //default material
    this._pMaterials = [];

    this.setup(sName, eOptions);
};

EXTENDS(Mesh, a.RenderDataFactory);

PROPERTY(Mesh, 'materials',
    function () {
        return this._pMaterials;
    });

/**
 * @property material(String sName)
 * @param sName Material name.
 * @treturn MaterialBase Material.
 * @memberof Mesh
 */
Mesh.prototype.getMaterial = function () {
    if (typeof arguments[0] === 'number') {
        return this._pMaterials[arguments[0]] || null;
    }
    else {
        for (var i = 0, pMaterials = this._pMaterials; i < pMaterials.length; ++ i) {
            if (pMaterials[i]._sName === arguments[0]) {
                return pMaterials[i];
            }
        }
    }

    return null;
};

Mesh.prototype.addMaterial = function (sName, pMaterialData) {
    debug_assert(arguments.length < 7, "only base material supported now...");
    debug_assert(this.getMaterial(sName) === null, 'material with name <' + sName + '> already exists');

    sName = sName || 'unknown';

    var pMaterial = new a.MeshMaterial(
        sName, 
        this._pDataBuffer.getEmptyVertexData(1, a.MeshMaterial.vertexDeclaration())
    );

    if (!pMaterialData) {
        pMaterialData = new a.Material;
    }

    pMaterial.value = pMaterialData;   

    this._pMaterials.push(pMaterial);
};

Mesh.prototype.setup = function(sName, eOptions) {
    this.subsetType = a.MeshSubset;

    parent.setup(eOptions);

    this._sName = sName || 'unknown';
};


A_NAMESPACE(Mesh);
A_NAMESPACE(buildCubeMesh);