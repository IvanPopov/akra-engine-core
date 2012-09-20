/**
 * @file
 * @author Ivan Popov
 */

function Mesh(pEngine, eOptions, sName, pDataBuffer) {
    //A_CLASS;
    a.ReferenceCounter.call(this);

    Enum([
        VB_READABLE = a.RenderDataBuffer.VB_READABLE,
        RD_ADVANCED_INDEX = a.RenderDataBuffer.RD_ADVANCED_INDEX
        ], MESH_OPTIONS, a.Mesh);

    Enum([
        GEOMETRY_ONLY = 0x00,   //<! copy only geometry
        SHARED_GEOMETRY = 0x01  //<! use shared geometry
        ], MESH_CLONEOPTIONS, a.Mesh);
    /**
     * Mesh name.
     * @type {String}
     * @private
     */
    this._sName = sName || null;
    //default material
    this._pFlexMaterials = null;

    this._pBuffer = null;
    this._pEngine = pEngine;
    this._eOptions = 0;
    this._pSkeleton = null;


	this._pBoundingBox = null;
	this._pBoundingSphere = null;

    this.setup(sName, eOptions, pDataBuffer);
};

EXTENDS(Mesh, Array, a.ReferenceCounter);

PROPERTY(Mesh, 'flexMaterials',
    function () {
        return this._pFlexMaterials;
    });

PROPERTY(Mesh, 'name',
    function () {
        return this._sName;
    });

/**
 * @deprecated
 */
PROPERTY(Mesh, 'data',
    function () {
        return this._pBuffer;
    });

PROPERTY(Mesh, 'buffer',
    function () {
        return this._pBuffer;
    });

PROPERTY(Mesh, 'skeleton',
    function () {
        return this._pSkeleton;
    },
    function (pSkeleton) {
        this._pSkeleton = pSkeleton;
    });

Mesh.prototype.setSkeleton = function(pSkeleton) {
    this.skeleton = pSkeleton;
};

Mesh.prototype.getOptions = function () {
    'use strict';
    
    return this._eOptions;
};

Mesh.prototype.getEngine = function () {
    'use strict';
    
    return this._pEngine;
};

Mesh.prototype.drawSubset = function (iSubset) {
    'use strict';
    
    this._pBuffer.draw(iSubset);
};

Mesh.prototype.draw = function () {
    'use strict';
    
    for (var i = 0; i < this.length; i++) {
        this[i].draw();
    };
};

Mesh.prototype.isReadyForRender = function () {
    'use strict';
    
    for (var i = 0; i < this.length; ++ i) {
        if (!this[i].isReadyForRender()) {
            return false;
        }
    }
    
    return true;
};


Mesh.prototype.setup = function(sName, eOptions, pDataBuffer) {
    debug_assert(this._pBuffer === null, 'mesh already setuped.');

    if (!pDataBuffer) {
        this._pBuffer = new a.RenderDataBuffer(this._pEngine);
        this._pBuffer.setup(eOptions);
    }
    else {
        debug_assert (pDataBuffer.getEngine() === this.getEngine(), 
            'you can not use a buffer with a different context');
        
        this._pBuffer = pDataBuffer;
        eOptions |= pDataBuffer.getOptions();
    }
    
    this._pBuffer.addRef();
    this._eOptions = eOptions || 0;
    this._sName = sName || 'unknown';

    return true;
};


Mesh.prototype.createSubset = function(sName, ePrimType, eOptions) {
    var pSubset, pSubMesh;
    //TODO: modify options and create options for data dactory.
    pSubset = this._pBuffer.getEmptyRenderData(ePrimType, eOptions);
    pSubset.addRef();

    if (!pSubset) {
        return null;
    }

    pSubMesh = new a.MeshSubset(this, pSubset, sName);
    this.push(pSubMesh);
    return pSubMesh;
};


/**
 * @protected
 * Replace materials for this mesh.
 */
Mesh.prototype.replaceFlexMaterials = function (pFlexMaterials) {
    'use strict';
    
    this._pFlexMaterials = pFlexMaterials;
};


Mesh.prototype.freeSubset = function(sName)
{
	debug_error("Метод freeSubset не реализован");
	return false;
}

/**
 * @property material(String sName)
 * @param sName Material name.
 * @treturn MaterialBase Material.
 * @memberof Mesh
 */
Mesh.prototype.getFlexMaterial = function () {
    
    if (!this._pFlexMaterials) {
        return null;
    }

    if (typeof arguments[0] === 'number') {
        return this._pFlexMaterials[arguments[0]] || null;
    }
    else {
        for (var i = 0, pMaterials = this._pFlexMaterials; i < pMaterials.length; ++ i) {
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
    //debug_assert(this.getFlexMaterial(sName) === null, 'material with name <' + sName + '> already exists');

    sName = sName || 'unknown';

    pMaterial = this.getFlexMaterial(sName);
    if (pMaterial) {
        if (pMaterialData) {
           pMaterial.value = pMaterialData; 
        }
        return true;
    }

    if (!this._pFlexMaterials) {
        this._pFlexMaterials = [];
    }

    pMaterialId = this._pFlexMaterials.length;
    pMaterial = new a.MeshMaterial(
        sName, 
        this._pBuffer._allocateData(a.MeshMaterial.vertexDeclaration(), null)
    );

    if (!pMaterialData) {
        pMaterialData = new a.Material;
        pMaterialData.toDefault();
    }

    pMaterial.value = pMaterialData;   
    pMaterial.id = pMaterialId;
    this._pFlexMaterials.push(pMaterial);
    return true;
};

Mesh.prototype.setFlexMaterial = function(iMaterial) {
    'use strict';

    var bResult = true;
    for (var i = 0; i < this.length; ++ i) {
        if (!this[i].setFlexMaterial(iMaterial)) {
            warning('cannot set material<' + iMaterial + '> for mesh<' + this.name + 
                '> subset<' + this[i].name + '>');
            bResult = false;
        }
    }

    return bResult;
};


/**
 * destroy resource.
 */
Mesh.prototype.destroy = function () {
    this._pFlexMaterials = null;
    this._pBuffer.destroy(this);
};

Mesh.prototype.destructor = function () {
    'use strict';
    
    this.destroy();
};

Mesh.prototype.getSubset = function () {
    'use strict';
    
    if (typeof arguments[0] === 'number') {
        return this[arguments[0]];
    }
    else {
        for (var i = 0; i < this.length; ++ i) {
            if (this[i]._sName === arguments[0]) {
                return this[i];
            }
        }
    }
	return null;
};


Mesh.prototype.setSkin = function(pSkin) {
    for (var i = 0; i < this.length; ++ i) {
        this[i].setSkin(pSkin);
    };
};



Mesh.prototype.clone = function (eCloneOptions) {
    'use strict';
    
    var pClone = null;
    var pRenderData;
    var pSubMesh;

    if (eCloneOptions & a.Mesh.SHARED_GEOMETRY) {
        pClone = new a.Mesh(this.getEngine(), this.getOptions(), this.name, this.data);
        
        for (var i = 0; i < this.length; ++ i) {
            pRenderData = this[i].data;
            pRenderData.addRef();
            pSubMesh = new a.MeshSubset(this, pRenderData, this[i].name);
            pClone.push(pSubMesh);
        }

        pClone.replaceFlexMaterials(this.flexMaterials);

        //trace('created clone', pClone);
    }
    else {
        //TODO: clone mesh data.
    }

    if (eCloneOptions & a.Mesh.GEOMETRY_ONLY) {
        return pClone;
    }
    else {
        //TODO: clone mesh shading
    }

    return pClone;
};

Mesh.prototype.createAndShowSubBoundingBox = function()
{
	for(i=0;i<this.length;i++)
	{
		pSubMesh=this.getSubset(i);
		pSubMesh.createBoundingBox();
		pSubMesh.showBoundingBox();
		//console.log("SubMesh" + i);
	}
}

Mesh.prototype.createAndShowSubBoundingSphere = function()
{
	for(i=0;i<this.length;i++)
	{
		pSubMesh=this.getSubset(i);
		pSubMesh.createBoundingSphere();
		pSubMesh.showBoundingSphere();
		//console.log("SubMesh" + i);
	}
}

Mesh.prototype.createBoundingBox = function()
{
	var pVertexData;
	var pSubMesh;
	var pNewBoundingBox;
	var pTempBoundingBox;
	var i;

	pNewBoundingBox = new a.Rect3d();
	pTempBoundingBox = new a.Rect3d();

	pSubMesh=this.getSubset(0);
	pVertexData=pSubMesh.data.getData(a.DECLUSAGE.POSITION);
	
    if(!pVertexData)
		return false;

	if(a.computeBoundingBox(pVertexData, pNewBoundingBox)== false)
		return false;

    if (pSubMesh.isSkinned()) {
        pNewBoundingBox.transform(pSubMesh.skin.getBindMatrix());    
        pNewBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
    }

	for(i = 1; i < this.length; i++) {

		pSubMesh = this.getSubset(i);
		pVertexData = pSubMesh.data.getData(a.DECLUSAGE.POSITION);
        trace(pSubMesh.name);
		
        if(!pVertexData) {
			return false;
        }
		
        if(a.computeBoundingBox(pVertexData, pTempBoundingBox) == false) {
			return false;
        }

        trace('>>> before box >>');
        if (pSubMesh.isSkinned()) {
            trace('calc skinned box');
            pTempBoundingBox.transform(pSubMesh.skin.getBindMatrix());     
            pTempBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName)); 
        }
    trace('<<< after box <<');

		pNewBoundingBox.fX0 = Math.min(pNewBoundingBox.fX0, pTempBoundingBox.fX0);
		pNewBoundingBox.fY0 = Math.min(pNewBoundingBox.fY0, pTempBoundingBox.fY0);
		pNewBoundingBox.fZ0 = Math.min(pNewBoundingBox.fZ0, pTempBoundingBox.fZ0);

		pNewBoundingBox.fX1 = Math.max(pNewBoundingBox.fX1, pTempBoundingBox.fX1);
		pNewBoundingBox.fY1 = Math.max(pNewBoundingBox.fY1, pTempBoundingBox.fY1);
		pNewBoundingBox.fZ1 = Math.max(pNewBoundingBox.fZ1, pTempBoundingBox.fZ1);
	}

	this._pBoundingBox = pNewBoundingBox;
	return true;
}

Mesh.prototype.deleteBoundingBox = function()
{
	this._pBoundingBox = null;
	return true;
}

Mesh.prototype.getBoundingBox = function ()
{
    if (!this._pBoundingBox) {
        this.createBoundingBox();
    }

	return this._pBoundingBox;
}

Mesh.prototype.showBoundingBox = function()
{
	var pSubMesh,pMaterial;
	var iData;
	var pPoints,pIndexes;

	if(!this._pBoundingBox)
	{
		return false;
	}

	pPoints = new Array();
	pIndexes = new Array();
	a.computeDataForCascadeBoundingBox(this._pBoundingBox,pPoints,pIndexes,0.1);

	pSubMesh=this.getSubset(".BoundingBox");
	if(!pSubMesh)
	{
		pSubMesh=this.createSubset(".BoundingBox",a.PRIMTYPE.LINELIST,(1<<a.VBufferBase.ManyDrawBit));
		if(!pSubMesh)
			return false;

		iData=pSubMesh.data.allocateData(
			[VE_FLOAT3(a.DECLUSAGE.POSITION)],
			new Float32Array(pPoints));

		pSubMesh.data.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],new Float32Array(pIndexes));

		pSubMesh.data.index(iData,a.DECLUSAGE.INDEX0);

		pSubMesh.applyFlexMaterial(".MaterialBoundingBox");
		pMaterial = pSubMesh.getFlexMaterial(".MaterialBoundingBox");
		pMaterial.emissive = new a.Color4f(1.0, 1.0, 1.0, 1.0);
		pMaterial.diffuse = new a.Color4f(1.0, 1.0, 1.0, 1.0);
		pMaterial.ambient = new a.Color4f(1.0, 1.0, 1.0, 1.0);
		pMaterial.specular = new a.Color4f(1.0, 1.0, 1.0, 1.0);
	}
	else
	{
		pSubMesh.data.getData(a.DECLUSAGE.POSITION).setData(new Float32Array(pPoints),a.DECLUSAGE.POSITION);
	}

	pSubMesh.data.setRenderable();
	return true;
}

Mesh.prototype.hideBoundingBox = function()
{
	var pSubMesh;
	pSubMesh=this.getSubset(".BoundingBox");
	if(!pSubMesh)
	{
		return false;
	}

	return pSubMeshs.data.setRenderable(this.data.getIndexSet(),false);
}


Mesh.prototype.createBoundingSphere = function()
{
	var pVertexData;
	var pSubMesh;
	var pNewBoundingSphere,pTempBoundingSphere;
	var i;

	pNewBoundingSphere = new a.Sphere();
	pTempBoundingSphere = new a.Sphere();


	pSubMesh=this.getSubset(0);
	pVertexData=pSubMesh.data.getData(a.DECLUSAGE.POSITION);
	if(!pVertexData)
	{
		return false;
	}


	if(a.computeBoundingSphere(pVertexData,pNewBoundingSphere)== false)
	{
		return false;
	}

    if (pSubMesh.isSkinned()) {
        pNewBoundingSphere.transform(pSubMesh.skin.getBindMatrix());    
        pNewBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
    }

	for(i=1;i<this.length;i++)
	{

		pSubMesh=this.getSubset(i);
		pVertexData=pSubMesh.data.getData(a.DECLUSAGE.POSITION);
		
        if(!pVertexData)
			return false;

		if(a.computeBoundingSphere(pVertexData,pTempBoundingSphere)== false)
			return false;

        trace('here >>');
        if (pSubMesh.isSkinned()) {
            pTempBoundingSphere.transform(pSubMesh.skin.getBindMatrix());    
            pTempBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
            trace(pTempBoundingSphere.fRadius, '<<<');
        }
        trace('here <<< ');


		a.computeGeneralizingSphere(pNewBoundingSphere,pTempBoundingSphere)
	}
    trace(pNewBoundingSphere, '<<<<<<<<<<<<<<<<<<<<<<<<<')
	this._pBoundingSphere = pNewBoundingSphere;
	return true;
}

Mesh.prototype.deleteBoundingSphere = function()
{
	this._pBoundingSphere = null;
	return true;
}

Mesh.prototype.getBoundingSphere = function ()
{
	return this._pBoundingSphere;
}

Mesh.prototype.showBoundingSphere = function()
{
	var pSubMesh,pMaterial;
	var iData;
	var pPoints,pIndexes;

	if(!this._pBoundingSphere)
	{
		return false;
	}

	pPoints = new Array();
	pIndexes = new Array();
	a.computeDataForCascadeBoundingSphere(this._pBoundingSphere,pPoints,pIndexes);

	pSubMesh=this.getSubset(".BoundingSphere");
	if(!pSubMesh)
	{
		pSubMesh=this.createSubset(".BoundingSphere",a.PRIMTYPE.LINELIST,(1<<a.VBufferBase.ManyDrawBit));
		if(!pSubMesh)
			return false;

		iData=pSubMesh.data.allocateData(
			[VE_FLOAT3(a.DECLUSAGE.POSITION)],
			new Float32Array(pPoints));

		pSubMesh.data.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],new Float32Array(pIndexes));

		pSubMesh.data.index(iData,a.DECLUSAGE.INDEX0);

		pSubMesh.applyFlexMaterial(".MaterialBoundingSphere");
		pMaterial = pSubMesh.getFlexMaterial(".MaterialBoundingSphere");
		pMaterial.emissive = new a.Color4f(1.0, 0.0, 0.0, 1.0);
		pMaterial.diffuse  = new a.Color4f(1.0, 0.0, 0.0, 1.0);
		pMaterial.ambient  = new a.Color4f(1.0, 0.0, 0.0, 1.0);
		pMaterial.specular = new a.Color4f(1.0, 0.0, 0.0, 1.0);
	}
	else
	{
		pSubMesh.data.getData(a.DECLUSAGE.POSITION).setData(new Float32Array(pPoints),a.DECLUSAGE.POSITION);
	}

	pSubMesh.data.setRenderable();
	return true;
}

Mesh.prototype.hideBoundingSphere= function()
{
	var pSubMesh;
	pSubMesh=this.getSubset(".BoundingSphere");
	if(!pSubMesh)
	{
		return false;
	}

	return pSubMeshs.data.setRenderable(this.data.getIndexSet(),false);
}

A_NAMESPACE(Mesh);