/**
 * @file
 * @author Ivan Popov
 */


function DataFactory (pEngine) {
    //video buffer with all mesh data
    this._pDataBuffer = null;
    this._pEngine = pEngine;
    this._eDataOptions = 0;
    this._pSubsetType = null;
}

PROPERTY(DataFactory, 'subsetType',
    function () {
        return this._pSubsetType;
    },
    function (pSubsetType) {
        debug_assert(this._pSubsetType === null, 'subset type already set.');
        this._pSubsetType = pSubsetType;
    });

DataFactory.prototype.getEngine = function() {
    return this._pEngine;
};

DataFactory.prototype.getDataOptions = function() {
    return this._eDataOptions;
};

// DataFactory.prototype.setDataOptions = function(eOptions) {
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
DataFactory.prototype.getData = function (sSemantics) {
    var pData = pData = this.pDataBuffer._pVertexDataArray;
    for (var i = 0; i < pData.length; i++) {
        if (pData[i].hasSemantics(sSemantics)) {
            return pData[i];
        }
    };

    return null;
};

//публиный метод, для задания данных сразу для всех сабсетов
DataFactory.prototype.setData = function (pDataDecl, pData) {     
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
DataFactory.prototype._allocateData = function(pVertexDecl, pData) {
    return this._pDataBuffer.allocateData(pVertexDecl, pData);
};


/**
 * Allocate new data set.
 * @param {Int} ePrimType Type of primitives.
 * @param {Int} eOptions Опции. Определяют можно ли объединять в группы датасеты.
 */
DataFactory.prototype.allocateSubset = function (ePrimType, eOptions) {
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
DataFactory.prototype.setup = function (eOptions) {
    this._pDataBuffer = this._pEngine.pDisplayManager.videoBufferPool().createResource(sName + '_' + a.sid());
    //TODO: add support for eOptions
    this._pDataBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
};

A_NAMESPACE(DataFactory);

function Mesh(pEngine, eOptions) {
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

EXTENDS(Mesh, a.DataFactory);

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
Mesh.prototype.material = function () {
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
    debug_assert(this.meterial(sName) === null, 'material with name <' + sName + '> already exists');

    sName = sName || 'unknown';

    var pMaterial = new a.MeshMaterial(
        sName, 
        this._pDataBuffer.getEmptyVertexData(1, a.MeshMaterial.vertexDeclaration())
    );

    pMaterial.value = pMaterialData || this.surfaceMaterial.material; 

    this._pMaterials.push(pMaterial);
};

Mesh.prototype.setup = function(sName, eOptions) {
    parent.setup(eOptions);

    this._sName = sName || 'unknown';
};


/**
 * @protected
 */
// Mesh.prototype.setAttributes = function(pMeshSubset, pAttrDecl, pData) {
//     var pSubset = this._pSubsets[pMeshSubset._iId];

//     debug_assert(pSubset === pMeshSubset, 'Subset not from current mesh.');
//     //FIXME: modify index for data
// };


function buildCubeMesh (pEngine, eOptions) {
    var pMesh,
        pSubMesh;
    var iPos, iNorm;

    var pVerticesData = new Float32Array([
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
    ]);

    var pNormalsData = new Float32Array([
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, -1.0
    ]);

    var pVertexIndicesData = new Float32Array([
        0, 2, 3, 0, 3, 1,
        0, 1, 5, 0, 5, 4,
        6, 7, 3, 6, 3, 2,
        0, 4, 6, 0, 6, 2,
        3, 7, 5, 3, 5, 1,
        5, 7, 6, 5, 6, 4
    ]);
    var pNormalIndicesData = new Float32Array([
        4, 4, 4, 4, 4, 4,
        2, 2, 2, 2, 2, 2,
        3, 3, 3, 3, 3, 3,
        1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0,
        5, 5, 5, 5, 5, 5
    ]);
    var pMaterialIndicesData = new Float32Array([
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0
    ]);


    pMesh = new a.Mesh(pEngine, 'cube');
    pMesh.addMaterial('default');

    //iPos = pMesh.setData([VE_VEC3('POSITION')], pVerticesData);
    //iNorm = pMesh.setData([VE_VEC3('NORMAL')], pNormalsData);
    //
    //iIPos = pMesh.setData([VE_FLOAT('INDEX1')], pVertexIndicesData);
    //iINorm = pMesh.setData([VE_FLOAT('INDEX2')], pNormalIndicesData);
    

    pSubMesh = pMesh.allocateSubset();

    iPos = pSubMesh.setData([VE_VEC3('POSITION')], pVerticesData);
    iNorm = pSubMesh.setData([VE_VEC3('NORMAL')], pNormalsData);

    pSubMesh.allocateIndex([VE_FLOAT('INDEX1')], pVertexIndicesData);
    pSubMesh.allocateIndex([VE_FLOAT('INDEX2')], pNormalIndicesData);

    pSubMesh.index(iPos, 'INDEX1');
    pSubMesh.index(iNorm, 'INDEX2');

    return pMesh;
}


//pSerialBuffer = this.displayManager().vertexBufferPool().createResource('cube_indices_' + a.sid());
//pSerialBuffer.create(pIndicesData.byteLength, FLAG(a.VBufferBase.RamBackupBit), pSerials);
//
//pSerials = pSerialBuffer.getVertexData(0, pSerialsData.length, new a.VertexDeclaration([
//    {nCount: 1, eType:a.DTYPE.FLOAT, eUsage: 'POSITION'},
//    {nCount: 1, eType:a.DTYPE.FLOAT, eUsage: 'NORMAL'}
//]));

A_NAMESPACE(Mesh);
A_NAMESPACE(buildCubeMesh);