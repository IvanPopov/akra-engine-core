
/**
 * @constructor
 */
function MeshSubset (pMesh, pRenderData, sName) {
    A_CLASS;

    this._pRenderData = null;
    this._sName = null;
    this._pMesh = null;

    this.setup(pMesh, pRenderData, sName);
}

EXTENDS(MeshSubset, a.RenderableObject);

PROPERTY(MeshSubset, 'name',
    function () {
        return this._sName;
    },
    function (sName) {
        this._sName = sName;
    });

PROPERTY(MeshSubset, 'mesh',
    function () {
        return this._pMesh;
    });

PROPERTY(MeshSubset, 'data',
    function () {
        return this._pRenderData;
    });

MeshSubset.prototype.setup = function(pMesh, pRenderData, sName) {
    debug_assert(this._pMesh === null, 'mesh subset already prepared');
    debug_assert(pMesh, 'you must specify parent mesh for creation mesh subset');
    debug_assert(pRenderData, 'you must specify render data for creation mesh subset');

    this._pMesh = pMesh;
    this._pRenderData = pRenderData;
    this._sName = sName || null;

    parent.setup(pMesh.getEngine(), sName);
};

MeshSubset.prototype.boundingBox = function () {
    //TODO: calc bounding box
};

MeshSubset.prototype.boundingSphere = function () {
    //TODO: calc bounding sphere
};

MeshSubset.prototype.computeNormals = function () {
    //TODO: calc normals
};

MeshSubset.prototype.computeTangents = function () {
    //TODO: compute normals
};

MeshSubset.prototype.computeBinormals = function () {
    //TODO: calc binormals
};

MeshSubset.prototype.applyFlexMaterial = function(sMaterial, pMaterialData) {
    if (this._pMesh.addFlexMaterial(sMaterial, pMaterialData)) {
        return this.setFlexMaterial(sMaterial);
    }
    return false;
};

MeshSubset.prototype.getFlexMaterial = function(iMaterial) {
    'use strict';
    return this._pMesh.getFlexMaterial(iMaterial);
};

MeshSubset.prototype.hasFlexMaterial = function () {
    'use strict';
    
    return this._pRenderData.hasSemantics(a.DECLUSAGE.MATERIAL);
};

MeshSubset.prototype.setFlexMaterial = function (iMaterial) {
    var pRenderData = this._pRenderData;
    var pIndexData = pRenderData.getIndices();
    var pMatFlow = pRenderData.getFlow(a.DECLUSAGE.MATERIAL);
    var eSemantics = a.DECLUSAGE.INDEX10;
    var pIndexDecl, pIndexData;
    var iMatFlow;
    var pMaterial = this._pMesh.getFlexMaterial(iMaterial);
    var iMat = pMaterial._pData.getOffset();

    if (!pMaterial) {
        return false;
    }

    
    if (pMatFlow) {
        iMatFlow = pMatFlow.iFlow;
        eSemantics = pMatFlow.pMapper.eSemantics;
        pIndexData = pMatFlow.pMapper.pData;

        pRenderData._addData(pMaterial._pData, iMatFlow);
        return pRenderData.index(iMat, eSemantics, true);
    }
    else {
        pIndexDecl = new a.VertexDeclaration([VE_FLOAT(eSemantics)]);
        pIndexData = new Float32Array(pIndexData.getCount());    
        iMatFlow = pRenderData._addData(pMaterial._pData);

        debug_assert(iMatFlow >= 0, 'cannot add data flow with material for mesh subsset');

        if (!pRenderData.allocateIndex(pIndexDecl, pIndexData)) {
            trace('cannot allocate index for material!!!');
            return false;
        }

        return pRenderData.index(iMat, eSemantics, true);
    }
    
    return true;
};



A_NAMESPACE(MeshSubset);