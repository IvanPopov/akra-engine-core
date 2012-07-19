
/**
 * @constructor
 */
function MeshSubset (pMesh, pRenderData, sName) {
    A_CLASS;

    this._pRenderData = null;
    this._sName = null;
    this._pMesh = null;
    this._pSkin = null;

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

PROPERTY(MeshSubset, 'skin',
    function () {
        return this._pSkin;
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

MeshSubset.prototype.isSkinned = function() {
    return this._pSkin !== null;
};

MeshSubset.prototype.hasSkin = MeshSubset.prototype.isSkinned;

MeshSubset.prototype.getSkin = function() {
    return this._pSkin;
};

//исходим из того, что данные скина 1:1 соотносятся с вершинами.
MeshSubset.prototype.setSkin = function(pSkin) {
    'use strict';

    var pPosData;
    var pPositionFlow;
    var pMetaData;

    var pInfMetaData;       //мета данные разметки
    var iInfMetaDataLoc;    //адресс мета данных во флотах
    var iInfMetaDataStride; //шаг мета данных во флотах

    /*
     Получаем данные вершин, чтобы проложить в {W} компоненту адерсс мета информации,
     о влиянии на данную вершины.
     */

    //получаем поток данных с вершиными
    pPositionFlow = this.data.getFlow(a.DECLUSAGE.POSITION);
    debug_assert(pPositionFlow, 'skin require position with indices in mesh subset');
    
    pPosData = pPositionFlow.pData;

    //проверяем, что данные еще не подвязаны к другому Skin'у
    if (pPosData.hasSemantics(a.DECLUSAGE.BLENDMETA)) {
        //тоже самый skin?
        if (pSkin.isAffect(pPosData)) {
            this._pSkin = pSkin;
            return true;
        }

        debug_assert(0, 'mesh subset already has another skin');
        return false;
    }

    //проверяем, что текущий подмеш пренадлежит мешу, на который натягивается skin,
    //или его клону.
    debug_assert(this.data.buffer == pSkin.data, 
        'can not bind to skin mesh subset that does not belong skin\'s mesh.')

    //подвязывем скин, к данным с вершинами текущего подмеша.
    //т.е. добавляем разметку в конец каждого пикселя
    pSkin.bind(pPosData);

    //получаем данные разметки
    pMetaData = pPosData.getTypedData(a.DECLUSAGE.BLENDMETA);

    //если по каким то причинам нет разметки...
    debug_assert(pMetaData, 'you must specify location for storage blending data');

    //выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
    pInfMetaData = pSkin.getInfluenceMetaData();
    iInfMetaDataLoc = pInfMetaData.getOffset() / a.DTYPE.BYTES_PER_FLOAT;
    iInfMetaDataStride = pInfMetaData.stride / a.DTYPE.BYTES_PER_FLOAT;

    for (var i = 0; i < pMetaData.length; ++ i) {
        pMetaData[i] = iInfMetaDataLoc + i * iInfMetaDataStride;
    }

    //обновляем адресса мета данных вершин
    pPosData.setData(pMetaData, a.DECLUSAGE.BLENDMETA);

    //trace(this.data.toString());
    this._pSkin = pSkin;

    return true;
};

MeshSubset.prototype.applyFlexMaterial = function(sMaterial, pMaterialData) {
    if (this._pMesh.addFlexMaterial(sMaterial, pMaterialData)) {
        return this.setFlexMaterial(sMaterial);
    }
    return null;
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

MeshSubset.prototype.draw = function () {
    'use strict';
    
    this._pRenderData.draw();
};

A_NAMESPACE(MeshSubset);