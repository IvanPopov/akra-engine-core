function torus (pEngine, eOptions, sName, rings, sides) {
    rings = rings || 50;
    sides = sides || 50;

    var vertices  = [];
    var normals   = [];
    var tex       = [];
    var ind       = [];
    var r1        = 0.3;
    var r2        = 1.5;
    var ringDelta = 2.0 * 3.1415926 / rings;
    var sideDelta = 2.0 * 3.1415926 / sides;
    var invRings  = 1.0 / rings;
    var invSides  = 1.0 / sides;
    var index       = 0;
    var numVertices = 0;
    var numFaces    = 0;
    var i, j;

    for ( i = 0; i <= rings; i++ ) {
        var theta    = i * ringDelta;
        var cosTheta = Math.cos ( theta );
        var sinTheta = Math.sin ( theta );

        for ( j = 0; j <= sides; j++ ) {
            var phi    = j * sideDelta;
            var cosPhi = Math.cos ( phi );
            var sinPhi = Math.sin ( phi );
            var dist   = r2 + r1 * cosPhi;

            vertices.push ( cosTheta * dist);
            vertices.push ( -sinTheta * dist);
            vertices.push ( r1 * sinPhi );
            
            tex.push     ( j * invSides );
            tex.push     ( i * invRings );
            
            normals.push ( cosTheta * cosPhi );
            normals.push ( -sinTheta * cosPhi );
            normals.push ( sinPhi );

            numVertices++;
        }
    }
    
    for ( i = 0; i < rings; i++ ) {
        for ( j = 0; j < sides; j++ ) {
            ind.push ( i*(sides+1) + j );
            ind.push ( (i+1)*(sides+1) + j );
            ind.push ( (i+1)*(sides+1) + j + 1 );
            
            ind.push ( i*(sides+1) + j );
            ind.push ( (i+1)*(sides+1) + j + 1 );
            ind.push ( i*(sides+1) + j + 1 );
            
            numFaces += 2;
        }
    }

    var pMesh, pSubMesh;
    var pMaterial;
    var iPos, iNorm;

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'torus');
    pSubMesh = pMesh.createSubset('torus::main');

    var vertnorm = [];
    for (var i = 0; i < vertices.length; i += 3) {
        vertnorm.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        vertnorm.push(normals[i], normals[i + 1], normals[i + 2]);
    }

    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], new Float32Array(normals));
    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], new Float32Array(vertices));
    // iPosNorm = pSubMesh.data.allocateData([VE_VEC3('POSITION'), VE_VEC3('NORMAL')], 
    //     new Float32Array(vertnorm));

    // pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION'), VE_FLOAT('INDEX_NORMAL', 0)], 
    //     new Float32Array(ind));

    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], new Float32Array(ind));
    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_NORMAL')], new Float32Array(ind));

    //pSubMesh.data.index(iPosNorm, 'INDEX_POSITION');
    pSubMesh.data.index(iPos, 'INDEX_POSITION');
    pSubMesh.data.index(iNorm, 'INDEX_NORMAL');
    pSubMesh.applyFlexMaterial('blue');

    pMaterial = pSubMesh.getFlexMaterial('blue');
    pMaterial.diffuse = new a.Color4f(0.3, 0.3, 1.0, 1.0);
    pMaterial.specular = new a.Color4f(1, 1, 1, 1.);
    pMaterial.shininess = 30;

    return pMesh;
}