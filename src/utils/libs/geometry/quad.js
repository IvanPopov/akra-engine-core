function quad (pEngine, fSize, eOptions, sName) {
    var pMesh, pSubMesh;
    var iPos, iNorm;
    fSize = fSize || 20.0;

    var pVerticesData = new Float32Array([
                                             -fSize,0,-fSize,
                                             fSize,0,-fSize,
                                             -fSize,0,fSize,
                                             fSize,0,fSize
                                         ]);
    var pNormalsData = new Float32Array([
                                            0,1,0
                                        ]);
    var pVertexIndicesData = new Float32Array([
                                                  0,1,2,3
                                              ]);
    var pNormalIndicesData = new Float32Array([
                                                  0,0,0,0
                                              ]);


    var iNorm, iPos;

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'quad');
    pSubMesh = pMesh.createSubset('quad::main', a.PRIMTYPE.TRIANGLESTRIP);
    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
    pSubMesh.data.index(iPos, 'INDEX0');
    pSubMesh.data.index(iNorm, 'INDEX1');
//    pSubMesh.applyFlexMaterial('default');
//    var pMat = pSubMesh.getFlexMaterial('default');
//    pMat.diffuse = new a.Color4f(0.5, 0., 0., 1.);
//    pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
//    pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
//    pMat.shininess = 30.;
    var pMat = pSubMesh.material;
    pMat.diffuse = new a.Color4f(0.5, 0., 0., 1.);
    pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
    pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
    pMat.shininess = 30.;
    //trace(pSubMesh._pMap.toString());

    return pMesh;
}