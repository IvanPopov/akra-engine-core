
/**
 * @ctor
 */
function MeshSubset (pEngine, sName) {
    A_CLASS;

    this._sName = sName || null;
}

EXTENDS(MeshSubset, a.RenderDataSubset, a.RenderableObject);

PROPERTY(RenderDataSubset, 'name',
    function () {
        return this._sName;
    },
    function (sName) {
        this._sName = sName;
    });

PROPERTY(MeshSubset, 'mesh',
    function () {
        return this.factory;
    });

MeshSubset.prototype.setup = function (pMesh, iId, ePrimType, eOptions) {
    if (arguments.length < 4) {
        return false;
    }
    //TODO: calc options for data set.
    parent.setup(pMesh, iId, ePrimType, 0);

    return true;
};

MeshSubset.prototype.applyMaterial = function(sMaterial, pMaterialData) {
    if (this._pFactory.addMaterial(sMaterial, pMaterialData)) {
        return this.setMaterial(sMaterial);
    }
    return false;
};

MeshSubset.prototype.getMaterial = function(iMaterial) {
    'use strict';
    return this._pFactory.getMaterial(iMaterial);
};

MeshSubset.prototype.setMaterial = function (iMaterial) {
    var pIndexData = this._pIndexData;
    var pMatFlow = this._pMap.getFlow(a.DECLUSAGE.MATERIAL);
    var eSemantics = 'INDEX_MAT';
    var pIndexDecl, pIndexData;
    var iMatFlow;
    var pMaterial = this._pFactory.getMaterial(iMaterial);
    var iMat = pMaterial._pData.getOffset();

    if (!pMaterial) {
        return false;
    }

    
    if (pMatFlow) {
        iMatFlow = pMatFlow.iFlow;
        eSemantics = pMatFlow.pMapper.eSemantics;
        pIndexData = pMatFlow.pMapper.pData;

        this._addData(pMaterial._pData, iMatFlow);
        return this.index(iMat, eSemantics, true);
    }
    else {
        pIndexDecl = new a.VertexDeclaration([VE_FLOAT(eSemantics)]);
        pIndexData = new Float32Array(pIndexData.getCount());    
        iMatFlow = this._addData(pMaterial._pData);

        debug_assert(iMatFlow >= 0, 'cannot add data flow with material for mesh subsset');

        if (!this.allocateIndex(pIndexDecl, pIndexData)) {
            trace('cannot allocate index for material!!!');
            return false;
        }

        return this.index(iMat, eSemantics, true);
    }
    
    return true;
};



A_NAMESPACE(MeshSubset);