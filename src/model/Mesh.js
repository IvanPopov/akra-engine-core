/**
 * @file
 * @author Ivan Popov
 */
/**
 * @ctor
 * Описанание зоны отдельной зоны меша, которая должна
 * быть отрисована со своими материалами и эффектами.
 */
function MeshArea (id, iFaceStart, iFaceCount, iVertexStart, iVertexCount) {
    this.id = id || 0;
    this.iFaceStart = iFaceStart || 0;
    this.iFaceCount = iFaceCount || 0;
    this.iVertexStart = iVertexStart || 0;
    this.iVertexCount = iVertexCount || 0;
};

MeshArea.prototype.clone = function () {
    return new a.MeshArea(this.id, this.iFaceStart, this.iFaceCount, this.iVertexStart, this.iVertexCount);
}

a.MeshArea = MeshArea;


/**
 * @enum
 * see D3DXMESHOPT
 */
Enum([
  COMPACT             = 0x01,
  ATTRSORT            = 0x02,
  VERTEXCACHE         = 0x04,
  STRIPREORDER        = 0x08,
  IGNOREVERTS         = 0x10,
  DONOTSPLIT          = 0x20,
  DEVICEINDEPENDENT   = 0x40
], MESH_OPTIONS, a.MESHOPTIONS);

/**
 * @enum
 * see D3DXMESH
 */
Enum([
         VB_SYSTEMMEM            = 0x010,
         VB_MANAGED              = 0x020,
         VB_WRITEONLY            = 0x040,
         VB_DYNAMIC              = 0x080,
         IB_SYSTEMMEM            = 0x100,
         IB_MANAGED              = 0x200,
         IB_WRITEONLY            = 0x400,
         IB_DYNAMIC              = 0x800,
         USEHWONLY               = 0x2000,
         SYSTEMMEM               = 0x110,
         MANAGED                 = 0x220,
         WRITEONLY               = 0x440,
         DYNAMIC                 = 0x880
     ], MESH, a.MESH);

/**
 * @enum
 * see D3DXMESHSIMP
 */
Enum([
    VERTEX   = 1,
    FACE     = 2
], MESH_SIMPLIFICATION, a.MESHSIMP);

/**
 * Mesh Class.
 * @constructor
 * @param Number nFaces
 * @param Number nVertices
 * @param Enumeration(MESHOPTIONS) eOptions
 * @param Object GraphicsStream
 * @param Engine pEngine
 */
function Mesh (pEngine) {
    this._pEngine = pEngine;
    this._nFaces = 0;
    this._nVertices = 0;
    this._eOptions = 0;
    this._pVertexBuffer = null;
    this._pIndexBuffer = null;
    this._pVertexDeclaration = null;
    this._pAreaTable = null;
    this._nBytesPerVertex = 0;
}

Mesh.prototype.renderArea = function (iArea) {
          //console.log('render area:', iArea);
    //var pIndex = this._pIndexBuffer;
    var pArea = this._pAreaTable[iArea];
    var pDevice = this._pEngine.pDevice;
    //console.log(iArea, 'drawElements', pArea.iFaceStart * 3, pArea.iFaceCount * 3);
    //console.log(this._pIndexBuffer.getData().subarray(pArea.iFaceStart * 3, pArea.iFaceStart * 3 + pArea.iFaceCount * 3));
    pDevice.drawElements(a.PRIMTYPE.TRIANGLELIST, pArea.iFaceCount * 3, a.DTYPE.UNSIGNED_SHORT, pArea.iFaceStart * 3 * 2);

};

Mesh.prototype.getNumFaces = function () {
    return this._nVertices;
};

Mesh.prototype.getNumVertices = function () {
    return this._nVertices;
};

Mesh.prototype.getDeclaration = function () {
    return this._pVertexDeclaration;
};

Mesh.prototype.getNumBytesPerVertex = function () {
    return this._nBytesPerVertex;
};

Mesh.prototype.getOptions = function () {

};

Mesh.prototype.getEngine = function () {
    return this._pEngine;
};

Mesh.prototype.cloneMesh = function (pEngine, eOptions, pDeclaration) {
    pEngine = pEngine || this._pEngine;
    eOptions = eOptions || this._eOptions;
    pDeclaration = pDeclaration || this._pVertexDeclaration;

    var pMesh = new a.Mesh(pEngine);

    var sTempName = this._pVertexBuffer.findResourceName() + '(copy)';

    var pVertexBuffer = pEngine.displayManager().vertexBufferPool().createResource(sTempName);
    var pIndexBuffer = pEngine.displayManager().indexBufferPool().createResource(sTempName);

    if (!pVertexBuffer.clone(this._pVertexBuffer) || !pIndexBuffer.clone(this._pIndexBuffer)) {
        return null;
    }

    pMesh._nFaces = this._nFaces;
    pMesh._nVertices = this._nVertices;
    pMesh._eOptions = eOptions;
    pMesh._pVertexBuffer = pVertexBuffer;
    pMesh._pIndexBuffer = pIndexBuffer;
    pMesh._pVertexDeclaration = pDeclaration;

    pMesh._pAreaTable = [];
    var pTable = this._pAreaTable;

    for (var i = 0; i < pTable.length; ++ i) {
        pMesh._pAreaTable.push(pTable[i].clone());
    }

    pMesh._nBytesPerVertex = this._nBytesPerVertex;
    return pMesh;
};

Mesh.prototype.getVertexBuffer = function () {
    return this._pVertexBuffer;
};

Mesh.prototype.getIndexBuffer = function () {
    return this._pIndexBuffer;
};

Mesh.prototype.getAreaTable = function () {
    return this._pAreaTable;
};

Mesh.prototype.updateDeclaration = function (pDeclaration) {

};

Mesh.prototype.generateAdjacency = function (fEpsilon) {
//    function computeAdjacencyBuffer(pModel){
//        var nVerticesCount = pModel.getVertices().length;
//        var i,j,k;
//        var nVertex0,nVertex1,nVertex2;
//        var arrVerticesAdjacency = [];
//        for(i=0;i<nVerticesCount;i++){
//            arrVerticesAdjacency[i] = [];
//        }
//        var pAdjacencyBuffer = [];
//        var pFaces = pModel.getFaces();
//        for(i=0;i<pFaces.length;i++){
//            var pTriangle = pFaces[i];
//            //по хардкору
//            nVertex0 = pTriangle[0];
//            nVertex1 = pTriangle[1];
//            nVertex2 = pTriangle[2];
//
////        Define(nVertex0,pTriangle[0]);
////        Define(nVertex1,pTriangle[1]);
////        Define(nVertex2,pTriangle[2]);
//
//            if(nVertex0 < nVertex1){
//                if(nVertex1 < nVertex2){
//                    arrVerticesAdjacency[nVertex0].push([i,nVertex1,nVertex2]);
//                    arrVerticesAdjacency[nVertex1].push([i,nVertex2]);
//                }
//                else if(nVertex0 < nVertex2){
//                    arrVerticesAdjacency[nVertex0].push([i,nVertex1,nVertex2]);
//                    arrVerticesAdjacency[nVertex2].push([i,nVertex1]);
//                }
//                else{
//                    arrVerticesAdjacency[nVertex2].push([i,nVertex0,nVertex1]);
//                    arrVerticesAdjacency[nVertex0].push([i,nVertex1]);
//                }
//            }
//            else{
//                if(nVertex0 < nVertex2){
//                    arrVerticesAdjacency[nVertex1].push([i,nVertex0,nVertex2]);
//                    arrVerticesAdjacency[nVertex0].push([i,nVertex2]);
//                }
//                else if(nVertex1 < nVertex2){
//                    arrVerticesAdjacency[nVertex1].push([i,nVertex0,nVertex2]);
//                    arrVerticesAdjacency[nVertex2].push([i,nVertex0]);
//                }
//                else{
//                    arrVerticesAdjacency[nVertex2].push([i,nVertex0,nVertex1]);
//                    arrVerticesAdjacency[nVertex1].push([i,nVertex0]);
//                }
//            }
//            pAdjacencyBuffer[i] = [];
//        }
//        for(i=0;i<arrVerticesAdjacency.length;i++){
//            var pVertexAdjacency = arrVerticesAdjacency[i];
//
//            for(j=0;j<pVertexAdjacency.length;j++){
//                var pData1 = pVertexAdjacency[j];
//
//                for(k=j+1;k<pVertexAdjacency.length;k++){
//                    var pData2 = pVertexAdjacency[k];
//
//                    if(pData1[1] == pData2[1]){
//                        pAdjacencyBuffer[pData1[0]].push(pData2[0]);
//                        pAdjacencyBuffer[pData2[0]].push(pData1[0]);
//                    }
//                    else{
//                        if(pData2.length == 3){
//                            if(pData1[1] == pData2[2]){
//                                pAdjacencyBuffer[pData1[0]].push(pData2[0]);
//                                pAdjacencyBuffer[pData2[0]].push(pData1[0]);
//                            }
//                            else if(pData1.length == 3){
//                                if(pData1[2] == pData2[2]){
//                                    pAdjacencyBuffer[pData1[0]].push(pData2[0]);
//                                    pAdjacencyBuffer[pData2[0]].push(pData1[0]);
//                                }
//                            }
//                        }
//                        else if(pData1.length == 3){
//                            if(pData1[2] == pData2[1]){
//                                pAdjacencyBuffer[pData1[0]].push(pData2[0]);
//                                pAdjacencyBuffer[pData2[0]].push(pData1[0]);
//                            }
//                        }
//                    }
//                }
//            }
//        }
//        return pAdjacencyBuffer;
//    };
};

Mesh.prototype.setAreaTable = function (pAttribTable) {

};

a.Mesh = Mesh;