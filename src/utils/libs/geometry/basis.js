function basis(pEngine, eOptions) {
    var pMesh, pSubMesh, pMaterial;
    var iPos, iNorm;

    pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, 'basis');
    iNorm   = pMesh.data.allocateData([VE_VEC3('NORMAL')],     new Float32Array([1,0,0]));
    
    function createAxis(sName, pCoords, pColor) {
        pSubMesh = pMesh.createSubset(sName, a.PRIMTYPE.LINELIST);
        
        iPos    = pSubMesh.data.allocateData([VE_VEC3('POSITION')],    pCoords);
        pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')],   new Float32Array([0,1]));
        pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')],     new Float32Array([0,0]));
        pSubMesh.data.index(iPos, 'INDEX0');
        pSubMesh.data.index(iNorm, 'INDEX1');

        pSubMesh.applyFlexMaterial(sName + '-color');
        pMaterial = pSubMesh.getFlexMaterial(sName + '-color');
        pMaterial.emissive = pColor;
        pMaterial.ambient = pColor;
        pMaterial.diffuse = pColor;
        pMaterial.shininess = 100.;
    }

    createAxis('basis::X-axis', new Float32Array([0,0,0, 1,0,0]), new a.Color4f(1, 0, 0, 1.));
    createAxis('basis::Y-axis', new Float32Array([0,0,0, 0,1,0]), new a.Color4f(0, 1, 0, 1.));
    createAxis('basis::Z-axis', new Float32Array([0,0,0, 0,0,1]), new a.Color4f(0, 0, 1, 1.));

    return pMesh;
}