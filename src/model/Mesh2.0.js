/**
 * @file
 * @author Ivan Popov
 */

function Mesh(pEngine, eOptions, sName, pDataFactory) {
    A_CLASS;

    Enum([
        VB_READABLE = a.VBufferBase.RamBackupBit
        ], MESH_OPTIONS, a.Mesh);
    /**
     * Mesh name.
     * @type {String}
     * @private
     */
    this._sName = sName || null;
    //default material
    this._pMaterials = [];

    this._pFactory = null;
    this._pSubMeshes = [];
    this._pEngine = pEngine;

    this.setup(sName, pDataFactory, eOptions);
};

EXTENDS(Mesh, a.ReferenceCounter);

PROPERTY(Mesh, 'flexMaterials',
    function () {
        return this._pMaterials;
    });

PROPERTY(Mesh, 'name',
    function () {
        return this._sName;
    });

PROPERTY(Mesh, 'data',
    function () {
        return this._pFactory;
    });

Mesh.prototype.getEngine = function () {
    'use strict';
    
    return this._pEngine;
};

Mesh.prototype.draw = function (iSubset) {
    'use strict';
    
    this._pFactory.draw(iSubset);
};

Mesh.prototype.createSubset = function(sName, ePrimType, eOptions) {
    var pSubset, pSubMesh;
    //TODO: modify options and create options for data dactory.
    pSubset = this._pFactory.allocateSubset(ePrimType, eOptions);
    pSubset.addRef();

    if (!pSubset) {
        return null;
    }

    pSubMesh = new a.MeshSubset(this, pSubset, sName);
    this._pSubMeshes.push(pSubMesh);

    return pSubMesh;
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
    var pMaterial;
    var pMaterialId;

    debug_assert(arguments.length < 7, "only base material supported now...");
    debug_assert(this.getFlexMaterial(sName) === null, 'material with name <' + sName + '> already exists');

    sName = sName || 'unknown';

    pMaterial = this.getFlexMaterial(sName);
    if (pMaterial) {
        pMaterial.value = pMaterialData;
        return true;
    }

    pMaterialId = this._pMaterials.length;
    pMaterial = new a.MeshMaterial(
        sName, 
        this._pFactory._allocateData(a.MeshMaterial.vertexDeclaration(), null)
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
    for (var i = 0; i < this._pSubMeshes.length; ++ i) {
        if (!this._pSubMeshes[i].setFlexMaterial(iMaterial)) {
            warning('cannot set material<' + iMaterial + '> for mesh<' + this.name + 
                '> subset<' + this._pSubMeshes[i].name + '>');
            bResult = false;
        }
    }

    return bResult;
};

Mesh.prototype.setup = function(sName, pDataFactory, eOptions) {
    if (!pDataFactory) {
        this._pFactory = new a.RenderDataFactory(this._pEngine);
        //TODO: calc normal options
        this._pFactory.setup(eOptions);
    }
    this._pFactory.setup(eOptions);
    this._sName = sName || 'unknown';
};

/**
 * destroy resource.
 */
Mesh.prototype.destroy = function () {
    safe_delete_array(this._pMaterials);
    safe_delete_array(this._pSubMeshes);
    this._pFactory.destroy(this);
};

Mesh.prototype.destructor = function () {
    'use strict';
    
    this.destroy();
};

Mesh.prototype.getSubset = function () {
    'use strict';
    
    if (typeof arguments[0] === 'number') {
        return this._pSubMeshes[arguments[0]];
    }
    else {
        for (var i = 0; i < this._pSubMeshes; ++ i) {
            if (this._pSubMeshes[i]._sName === arguments[0]) {
                return this._pSubMeshes[i];
            }
        }
    }
};

A_NAMESPACE(Mesh);