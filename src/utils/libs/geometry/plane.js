function plane (pEngine, eOptions, sName, nCellW, nCellH) {
    nCellW = nCellW || 25;
    nCellH = nCellH || 25;

    var pMesh, pSubMesh;
    var iPos, iNorm;
    var nCells = nCellW * nCellH;

    var pVerticesData = new Float32Array(nCells * 3);
    var pNormalsData = new Float32Array([0.0, 0.0, 1.0]);

    var fStepX = 1.0 / (nCellW - 1);
    var fStepY = 1.0 / (nCellH - 1);
    var n = 0;

    for (var z = 0; z < nCellH; ++ z) {
        for (var x = 0; x < nCellW; ++ x) {
            pVerticesData[n]        = x * fStepX -.5;
            pVerticesData[n + 2]    = z * fStepY -.5;
            n += 3;
        }
    };

    var pVertexIndicesData = new Float32Array(nCells * 6);
    var pNormalIndicesData = new Float32Array(nCells * 6);

    n = 0;
    for (var z = 0; z < nCellH - 1; ++ z) {
        for (var x = 0; x < nCellW - 1; ++ x) {
            pVertexIndicesData[n]       = (z + 1) * nCellW + x;
            pVertexIndicesData[n + 1]   = (z + 0) * nCellW + x + 1;
            pVertexIndicesData[n + 2]   = (z + 0) * nCellW + x;
            pVertexIndicesData[n + 3]   = pVertexIndicesData[n];
            pVertexIndicesData[n + 4]   = pVertexIndicesData[n] + 1;
            pVertexIndicesData[n + 5]   = pVertexIndicesData[n + 1];
        }
        n += 6;
    };

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'plane');
    pSubMesh = pMesh.createSubset('plane::main', a.PRIMTYPE.TRIANGLELIST);
    
    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);

    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_NORMAL')], pNormalIndicesData);

    pSubMesh.data.index(iPos, 'INDEX_POSITION');
    pSubMesh.data.index(iNorm, 'INDEX_NORMAL');
    pSubMesh.applyFlexMaterial('default');

    return pMesh;
}