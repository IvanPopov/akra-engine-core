



function basisSolid(pEngine, eOptions) {
    var pMesh, pSubMesh, pMaterial;
    var iPos, iNorm;

    var pVerticesData = new Float32Array([
                                             0,0,0,
                                             1,0,0,
                                             0,1,0,
                                             0,0,1
                                         ]);

    var pNormalsData = new Float32Array([0, 0, 0]);
    
    var pVertexIndicesData = new Float32Array([0,1,0,2,0,3]);
    var pNormalIndicesData = new Float32Array([0,0,0,0,0,0]);

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, 'basis-solid');
    pSubMesh = pMesh.createSubset('axis', a.PRIMTYPE.LINELIST);
        
    iPos    = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    iNorm   = pSubMesh.data.allocateData([VE_VEC3('NORMAL')],   pNormalsData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')],   pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')],     pNormalIndicesData);
    pSubMesh.data.index(iPos, 'INDEX0');
    pSubMesh.data.index(iNorm, 'INDEX1');

    pSubMesh.applyFlexMaterial('default');
    pMaterial = pSubMesh.getFlexMaterial('default');
    pMaterial.diffuse = new a.Color4f(1, 0, 0, 1);
    pMaterial.emissive = new a.Color4f(1, 0, 0, 1.);
    pMaterial.shininess = 100.;

    return pMesh;
}


