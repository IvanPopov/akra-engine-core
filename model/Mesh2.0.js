/**
 * @file
 * @author Ivan Popov
 */




function Mesh(pEngine, sName, eOptions) {
    Enum([
        ADVANCED_INDEX = 0x01 //!< Save indicies into buffer (for ex. geometry shader simulation)
        ], MESH_OPTIONS, a.Mesh);

    /**
     * Mesh name.
     * @type {String}
     * @private
     */
    this._sName = sName || null;

    //video buffer with all mesh data
    this._pDataBuffer = null;

    //mesh Subsets
    this._pSubsets = [];

    //default material
    this._pMaterials = [];

    this._eOptions = 0;

    this._pEngine = pEngine;

    this.setup(sName, eOptions);
};

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

// /**
//  * Is this mesh use advanced index?
//  * @return {Boolean} 
//  */
// Mesh.prototype.useAdvancedIndex = function() {
//     return TEST_BIT(this._eOptions, a.Mesh.ADVANCED_INDEX);
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
Mesh.prototype.getData = function (sSemantics) {
    var pData = pData = this.pDataBuffer._pVertexDataArray;
    for (var i = 0; i < pData.length; i++) {
        if (pData[i].hasSemantics(sSemantics)) {
            return pData[i];
        }
    };

    return null;
};

//публиный метод, для задания данных сразу для всех сабсетов
Mesh.prototype.setData = function (pDataDecl, pData) {     
    var pVertexData;

    pDataDecl = normalizeVertexDecl(pDataDecl);

    for (var i = 0; i < pDataDecl.length; i++) {
        assert(this.getData(pDataDecl[i]) === null, "mesh already contains data with similar  vertex decloration.");
    };

    pVertexData = this._allocateData(pDataDecl, pData);

    for (var i = 0; i < this._pSubsets.length; ++ i) {
        this._pSubsets[i]._addData(pVertexData);
    }

    return pVertexData;
};

/**
 * Положить данные в буфер.
 */
Mesh.prototype._allocateData = function(pVertexDecl, pData) {
    return this._pDataBuffer.allocateData(pVertexDecl, pData);
};


/**
 * @param {String} Subset name.
 * @param {PRIMITIVE_TYPE} ePrimType Type of Subset primitive.
 * @param {TypedArray} pIndices Indices.
 */
Mesh.prototype.allocateSubset = function (ePrimType, sName) {
    var sName = sName || 'Subset_' + this._pSubsets.length;
    var iSubsetId = this._pSubsets.length;
    var pMeshSubset = new a.MeshSubset(this._pEngine);

    debug_assert(pMeshSubset.setup(this, iSubsetId, sName, ePrimType), 
        'cannot setup submesh...');

    this._pSubsets.push(pMeshSubset);
};


/**
 * @protected
 */
Mesh.prototype.setup = function (sName, eOptions) {
    this._sName = sName || 'unknown';
    this._pDataBuffer = PR_DISPLAYMNGR.videoBufferPool().createResource(sName + '_' + a.sid());
    //TODO: add support for eOptions
    this._pDataBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
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