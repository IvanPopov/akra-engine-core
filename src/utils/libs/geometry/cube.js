
function cube (pEngine, eOptions, sName, fSize) {
    var pMesh, pSubMesh;
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
    fSize = fSize || 1.0;

    for (var i = 0; i < pVerticesData.length; ++ i) {
      pVerticesData[i] *= fSize;
    }

    var pMapData = new Float32Array([
                                        0, 0, 0,
                                        1, 0, 0,
                                        0, 1, 0,
                                        1, 1, 0
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
                                                  0, 2, 3, 0, 3, 1,//front
                                                  0, 1, 5, 0, 5, 4,//top
                                                  6, 7, 3, 6, 3, 2,//bottom
                                                  0, 4, 6, 0, 6, 2,//left
                                                  3, 7, 5, 3, 5, 1,//right
                                                  5, 7, 6, 5, 6, 4 //back
                                              ]);
    var pNormalIndicesData = new Float32Array([
                                                  4, 4, 4, 4, 4, 4,
                                                  2, 2, 2, 2, 2, 2,
                                                  3, 3, 3, 3, 3, 3,
                                                  1, 1, 1, 1, 1, 1,
                                                  0, 0, 0, 0, 0, 0,
                                                  5, 5, 5, 5, 5, 5
                                              ]);

    var pMapIndices = new Float32Array([
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1,
                                           0, 2, 3, 0, 3, 1
                                       ]);

    var pSerialData = new Float32Array(pNormalIndicesData.length);
    for (var i = 0; i < pSerialData.length; i++) {
        pSerialData[i] = i % 3;
    };

    var iNorm, iPos, iMap;

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'cube');
    pSubMesh = pMesh.createSubset('cube::main');

    iPos  = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
    iMap  = pSubMesh.data.allocateData([VE_VEC3('TEXCOORD0')], pMapData);

    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX2')], pMapIndices);

    pSubMesh.data.index(iPos,  'INDEX0');
    pSubMesh.data.index(iNorm, 'INDEX1');
    pSubMesh.data.index(iMap,  'INDEX2');

    // pSubMesh.applyFlexMaterial('default');
    var pMat = pSubMesh.material;
    pMat.diffuse = new a.Color4f(0.5, 0., 0., 1.);
    pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
    pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
    pMat.shininess = 30.;

    //trace(pSubMesh._pMap.toString());

    return pMesh;
}
