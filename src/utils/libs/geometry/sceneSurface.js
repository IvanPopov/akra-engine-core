function sceneSurface(pEngine, n) {
    n = n || 100;
    var nCellW = nCellW || (n + 1);
    var nCellH = nCellH || (n + 1);

    var nScaleX = nCellW - 1;
    var nScaleY = nCellH - 1;

    var pMesh, pSubMesh;
    var iPos;
    //var nCells = nCellW * nCellH;
    var pVerticesData = new Float32Array((nCellW + nCellH) * 6);

    var fStepX = 1.0 / (nCellW - 1);
    var fStepY = 1.0 / (nCellH - 1);
    var n = 0;

    for (var z = 0; z < nCellH; ++ z) {
        pVerticesData[n]        = (-.5) * nScaleX;
        pVerticesData[n + 2]    = (z * fStepY -.5) * nScaleY;
        n += 3;
        
        pVerticesData[n]        = (.5) * nScaleX;
        pVerticesData[n + 2]    = (z * fStepY -.5) * nScaleY;
        n += 3;
    }

    for (var x = 0; x < nCellW; ++ x) {
        pVerticesData[n]        = (x * fStepX -.5)  * nScaleX;
        pVerticesData[n + 2]    = (-.5) * nScaleY;
        n += 3;

        pVerticesData[n]        = (x * fStepX -.5) * nScaleX;
        pVerticesData[n + 2]    = (.5) * nScaleY;
        n += 3;
    }



    var pVertexIndicesData = new Float32Array((nCellW + nCellH) * 2);

    n = 0;
    for (var z = 0; z < nCellH; ++ z) {            
        pVertexIndicesData[n ++]   = z * 2;
        pVertexIndicesData[n ++]   = z * 2 + 1;
    };

    for (var x = 0; x < nCellW; ++ x) {
        pVertexIndicesData[n ++]   = nCellH * 2 + x * 2;
        pVertexIndicesData[n ++]   = nCellH * 2 + x * 2 + 1; 
    };

    pMesh = new a.Mesh(pEngine, a.Mesh.VB_READABLE, 'scene-surface');
    pSubMesh = pMesh.createSubset('plane::main', a.PRIMTYPE.LINELIST);
    pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], pVertexIndicesData);
    pSubMesh.data.index('POSITION', 'INDEX_POSITION');
    // pSubMesh.applyFlexMaterial('default');

    return pMesh;
}
