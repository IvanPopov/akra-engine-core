/**
 * MeshMaterial class. 
 * @ctor
 * @param {String} sName       Name of material.
 * @param {VertexData} pVertexData Material storage.
 */
function MeshMaterial (sName, pVertexData) {
    A_CLASS;

    this._pData = pVertexData;
}

EXTENDS(MeshMaterial, a.MaterialBase);

/**
 * Declaration of material data.
 * @return {VertexDeclaration} 
 */
MeshMaterial.vertexDeclaration = function () {
    return new a.VertexDeclaration([
            {nCount: 17, eType: a.DTYPE.FLOAT, eUsage: 'MATERIAL'},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'DIFFUSE', iOffset: 0},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'AMBIENT'},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'SPECULAR'},
            {nCount: 4, eType: a.DTYPE.FLOAT, eUsage: 'EMISSIVE'},
            {nCount: 1, eType: a.DTYPE.FLOAT, eUsage: 'SHININESS'}
        ]);
};

MeshMaterial.prototype.getProperty = function(eProperty) {
  switch (eProperty) {
    case a.Material.DIFFUSE:    return this._pData.getTypedData(a.DECLUSAGE.DIFFUSE,   0, 1);
    case a.Material.AMBIENT:    return this._pData.getTypedData(a.DECLUSAGE.AMBIENT,   0, 1);
    case a.Material.SPECULAR:   return this._pData.getTypedData(a.DECLUSAGE.SPECULAR,  0, 1);
    case a.Material.EMISSIVE:   return this._pData.getTypedData(a.DECLUSAGE.EMISSIVE,  0, 1);
    case a.Material.SHININESS:  return this._pData.getTypedData(a.DECLUSAGE.SHININESS, 0, 1)[0];
  }

  return null;
};

MeshMaterial.prototype.setProperty = function(eProperty, pValue) {
  switch (eProperty) {
    case a.Material.DIFFUSE:    return this._pData.setData(pValue, a.DECLUSAGE.DIFFUSE);
    case a.Material.AMBIENT:    return this._pData.setData(pValue, a.DECLUSAGE.AMBIENT);
    case a.Material.SPECULAR:   return this._pData.setData(pValue, a.DECLUSAGE.SPECULAR);
    case a.Material.EMISSIVE:   return this._pData.setData(pValue, a.DECLUSAGE.EMISSIVE);
    case a.Material.SHININESS:  return this._pData.setData(new Float32(pValue), a.DECLUSAGE.SHININESS);
  }
  
  return null;
};

PROPERTY(MeshMaterial, 'data',
    function () {
        return this._pData.getTypedData(a.DECLUSAGE.MATERIAL, 0, 1);
    },
    function (pData) {
        this._pData.setData(pData, a.DECLUSAGE.MATERIAL);
    });

A_NAMESPACE(MeshMaterial);

