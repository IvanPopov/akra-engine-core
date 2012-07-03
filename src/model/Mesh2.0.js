/**
 * @file
 * @author Ivan Popov
 */

function Mesh(pEngine, eOptions, sName) {
    A_CLASS;
    /**
     * Mesh name.
     * @type {String}
     * @private
     */
    this._sName = sName || null;
    //default material
    this._pMaterials = [];

    this.setup(sName, eOptions);
};

EXTENDS(Mesh, a.RenderDataFactory);

PROPERTY(Mesh, 'flexMaterials',
    function () {
        return this._pMaterials;
    });

PROPERTY(Mesh, 'name',
    function () {
        return this._sName;
    });

Mesh.prototype.allocateSubset = function(sName, ePrimType, eOptions) {
    var pSubset;
    pSubset = parent.allocateSubset(ePrimType, eOptions);
    
    if (!pSubset) {
        return null;
    }

    pSubset.name = sName;
    return pSubset
};

/**
 * @property material(String sName)
 * @param sName Material name.
 * @treturn MaterialBase Material.
 * @memberof Mesh
 */
Mesh.prototype.getFlexMaterial = function () {
    if (typeof arguments[0] === 'number') {
        return this._pMaterials[arguments[0]] || null;
    }
    else {
        for (var i = 0, pMaterials = this._pMaterials; i < pMaterials.length; ++ i) {
            if (pMaterials[i]._sName === arguments[0]) {
                return pMaterials[i];
            }
        }
    }

    return null;
};

Mesh.prototype.addFlexMaterial = function (sName, pMaterialData) {
    'use strict';

    debug_assert(arguments.length < 7, "only base material supported now...");
    debug_assert(this.getFlexMaterial(sName) === null, 'material with name <' + sName + '> already exists');

    sName = sName || 'unknown';
    var pMaterialId = this._pMaterials.length;
    var pMaterial = new a.MeshMaterial(
        sName, 
        this._pDataBuffer.getEmptyVertexData(1, a.MeshMaterial.vertexDeclaration())
    );

    if (!pMaterialData) {
        pMaterialData = new a.Material;
        pMaterialData.toDefault();
    }

    pMaterial.value = pMaterialData;   
    pMaterial.id = pMaterialId;
    this._pMaterials.push(pMaterial);
    return true;
};

Mesh.prototype.setFlexMaterial = function(iMaterial) {
    'use strict';

    var bResult = true;
    for (var i = 0; i < this._pSubsets.length; ++ i) {
        if (!this._pSubsets[i].setFlexMaterial(iMaterial)) {
            warning('cannot set material<' + iMaterial + '> for mesh<' + this.name + 
                '> subset<' + this._pSubsets[i].name + '>');
            bResult = false;
        }
    }

    return bResult;
};

Mesh.prototype.setup = function(sName, eOptions) {
    this.subsetType = a.MeshSubset;

    parent.setup(eOptions);

    this._sName = sName || 'unknown';
};

/**
 * destroy resource.
 */
Mesh.prototype.destroy = function () {
    safe_delete_array(this._pSubsets);
    safe_delete_array(this._pMaterials);
    parent.destroy(this);
};

Mesh.prototype.destructor = function () {
    'use strict';
    
    this.destroy();
};

Mesh.prototype.getSubset = function () {
    'use strict';
    
    if (typeof arguments[0] === 'number') {
        return parent(RenderDataFactory).getSubset.call(this, arguments[0]);
    }
    else {
        for (var i = 0; i < this._pSubsets; ++ i) {
            if (this._pSubsets[i]._sName === arguments[0]) {
                return this._pSubsets[i];
            }
        }
    }
};

A_NAMESPACE(Mesh);