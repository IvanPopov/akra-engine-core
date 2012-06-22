/**
 * @file
 *
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 *
 * TerrainSection класс.
 */

function TerrainSection (pEngine) {
    this._pTerrainSystem = null;
    this._pSectorVerts = null;
    this._iHeightMapX;
    this._iHeightMapY;
    this._iSectorX;
    this._iSectorY;
    this._iXVerts = 0;
    this._iYVerts = 0;
    this._pWorldRect = new a.Rect3d();

    TerrainSection.superclass.constructor.apply(this, arguments);
}
;

a.extend(TerrainSection, a.SceneObject);

TerrainSection.prototype.pVertexDescription = new Array(2);
TerrainSection.prototype.pVertexDescription[0] = new VertexDeclaration(1, "POSITION1", a.DTYPE.FLOAT, a.DECLUSAGE.POSITION);
TerrainSection.prototype.pVertexDescription[1] = new VertexDeclaration(3, "NORMAL", a.DTYPE.FLOAT, a.DECLUSAGE.NORMAL);

TerrainSection.prototype.sectorX = function () {
    return this._iSectorX;
};
TerrainSection.prototype.sectorY = function () {
    return this._iSectorY;
};
TerrainSection.prototype.terrainSystem = function () {
    return this._pTerrainSystem;
};
TerrainSection.prototype.sectorVertices = function () {
    return this._pSectorVerts;
};


TerrainSection.prototype.create =
    function (pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect) {
        bResult = TerrainSection.superclass.create.apply(this, arguments);

        this.attachToParent(pRootNode);

        if (bResult) {
            //
            // Build a vertex buffer to
            // hold the height and surface
            // normal for this area of the terrain
            //
            this._pTerrainSystem = pParentSystem;
            this._iXVerts = iXVerts;
            this._iYVerts = iYVerts;
            this._iSectorX = iSectorX;
            this._iSectorY = iSectorY;
            this._pWorldRect.fX0 = pWorldRect.fX0;
            this._pWorldRect.fX1 = pWorldRect.fX1;
            this._pWorldRect.fY0 = pWorldRect.fY0;
            this._pWorldRect.fY1 = pWorldRect.fY1; //??
            this._iHeightMapX = iHeightMapX;
            this._iHeightMapY = iHeightMapY;

            bResult = this.buildVertexBuffer();

            // set the scene object bounds data
            this.accessLocalBounds().set(this._pWorldRect.fX0,
                                         this._pWorldRect.fX1,
                                         this._pWorldRect.fY0,
                                         this._pWorldRect.fY1,
                                         this._pWorldRect.fZ0,
                                         this._pWorldRect.fZ1);

        }

        return bResult;
    };

TerrainSection.prototype.buildVertexBuffer = function () {
    var bResult = true;
    //
    // Build a vertex buffer and determine
    // the min\max size of the sector
    //
    var sTempName;
    sTempName = "terrain_section_" + this._iSectorX + "_" + this._iSectorY;
    /*sTempName.format(
     "terrain_section_%i_%i",
     this._iSectorX,
     this._iSectorY);*/

    this._pSectorVerts =
        this._pEngine.pDisplayManager.
            vertexBufferPool().createResource(sTempName);

    this._pWorldRect.fZ0 = MAX_REAL32;
    this._pWorldRect.fZ1 = MIN_REAL32;

    if (this._pSectorVerts) {
        // read in the height and normal for each vertex
        var pVerts = new Array(this._iXVerts * this._iYVerts * 4);
        var v3fNormal = null;

        for (var y = 0; y < this._iYVerts; ++y) {
            for (var x = 0; x < this._iXVerts; ++x) {

                fHeight = this._pTerrainSystem.readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);
                pVerts[((y * this._iXVerts) + x) * 4 + 0] = fHeight;

                v3fNormal = this._pTerrainSystem.readWorldNormal(this._iHeightMapX + x, this._iHeightMapY + y);
                pVerts[((y * this._iXVerts) + x) * 4 + 1] = v3fNormal.X;
                pVerts[((y * this._iXVerts) + x) * 4 + 2] = v3fNormal.Y;
                pVerts[((y * this._iXVerts) + x) * 4 + 3] = v3fNormal.Z;

                this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
                this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);
            }
        }

        bResult =
            this._pSectorVerts.create(this._iXVerts * this._iYVerts, 16, FLAG(a.VertexBuffer.RamBackupBit), new Float32Array(pVerts));
        pVerts = null;
    }
    else {
        bResult = false;
    }

    return bResult;
}

TerrainSection.prototype.render = function () {
    this._pTerrainSystem.submitSection(this);
}

TerrainSection.prototype.renderCallback = function (entry, activationFlags) {
    this._pTerrainSystem.renderSection(this, activationFlags, entry);
}



TerrainSection.prototype.setVertexDescription = function () {    
    // create the vertex declaration
    // and add it to the vertex
    // buffer containing our basic grid
    bSuccess = this._pSectorVerts.setVertexDescription(a.TerrainSection.prototype.pVertexDescription,
                                                       a.TerrainSection.prototype.pVertexDescription.length);
    debug_assert(bSuccess == true, "TerrainSection.setVertexDescription _pVertexGrid.setVertexDescription is false");
    return bSuccess;
}


a.TerrainSection = TerrainSection;