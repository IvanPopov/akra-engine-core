/**
 * @file
 *
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 *
 * TerrainSection класс.
 */

function TerrainSection(pEngine) {
    A_CLASS;
    this._pTerrainSystem = null; //Терреин которому принадлежит секуция
    this._pRenderData = null;
    this._iVertexID;

    this._iHeightMapX; //Ее коорлинаты на карте высот
    this._iHeightMapY;
    this._iSectorX;   //номер сектора по иксу и по игрику
    this._iSectorY;
    this._iXVerts = 0; //Ращмеры сетки вершин
    this._iYVerts = 0;
    this._pWorldRect = new a.Rect3d(); //Положение сетора в мире
    this._pEngine = pEngine;
}
;

EXTENDS(TerrainSection, a.SceneObject, a.RenderableObject);

TerrainSection.prototype.pVertexDescription = [VE_FLOAT3(a.DECLUSAGE.POSITION), VE_FLOAT2(a.DECLUSAGE.TEXCOORD)]

TerrainSection.prototype.setRenderData = function (pData) {
    this._pRenderData = pData;
};

TerrainSection.prototype.sectorX = function () {
    return this._iSectorX;
};
TerrainSection.prototype.sectorY = function () {
    return this._iSectorY;
};
TerrainSection.prototype.getTerrainSystem = function () {
    return this._pTerrainSystem;
};

TerrainSection.prototype.getIndex = function () {
    return this._pIndexList;
};

TerrainSection.prototype.getSectionIndex = function () {
    return (this._iSectorY * this._pTerrainSystem().getSectorCountX()) + this._iSectorX;
};

TerrainSection.prototype.getHeightX = function () {
    return Math.abs(this._pWorldRect.fX1 - this._pWorldRect.fX0);
};

TerrainSection.prototype.getHeightY = function () {
    return Math.abs(this._pWorldRect.fY1 - this._pWorldRect.fY0);
};


TerrainSection.prototype.create =
function (pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect) {
    bResult = TerrainSection.superclass.create.apply(this, arguments);
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

        bResult = this._createRenderDataForVertexAndIndex();
        bResult = bResult && this._buildVertexBuffer();
        bResult = bResult && this._buildIndexBuffer();

        // set the scene object bounds data
        this.accessLocalBounds().set(this._pWorldRect.fX0,
                                     this._pWorldRect.fX1,
                                     this._pWorldRect.fY0,
                                     this._pWorldRect.fY1,
                                     this._pWorldRect.fZ0,
                                     this._pWorldRect.fZ1);
        if (bResult) {
            this.attachToParent(pRootNode);
        }
    }

    return bResult;
};

TerrainSection.prototype._createRenderDataForVertexAndIndex = function () {
    debug_assert(this._pRenderData == null, "У терраин сектиона уже созданы данные");
    this._pRenderData = this.getTerrainSystem().getDataFactory().getEmptyRenderData(a.PRIMTYPE.TRIANGLESTRIP, 0);

    if (!this._pRenderData) {
        return false;
    }
    return true;
}

TerrainSection.prototype._buildVertexBuffer = function () {


    this._pWorldRect.fZ0 = MAX_REAL32;
    this._pWorldRect.fZ1 = MIN_REAL32;

    var pVerts = new Array(this._iXVerts * this._iYVerts *
                           (3/*кординаты вершин*/ + 3/*координаты нормалей*/ + 2/*текстурные координаты*/));
    var v3fNormal = new Vec3();

    var v2fCellSize = new Vec2(); //размер ячейки сектора
    v2fCellSize.set(this.getHeightX() / (this._iXVerts - 1),
                    this.getHeightY() / (this._iYVerts - 1)); //размер сектора/количество ячеек в секторе

    var v2fVert = new Vec2(); //Координаты вершина в секторе
    v2fVert.set(0.0, 0.0);

    //console.log("-->",this._iSectorX,this._iSectorY,"--",this._pWorldRect.fX0,this._pWorldRect.fY0,"--",this._iXVerts,this._iYVerts)
    //console.log("--",v2fCellSize.X,v2fCellSize.Y,this.getHeightX(),this.getHeightY() )

    for (var y = 0; y < this._iYVerts; ++y) {
        v2fVert.set(this._pWorldRect.fX0, y * v2fCellSize.y + this._pWorldRect.fY0);
        for (var x = 0; x < this._iXVerts; ++x) {

            var fHeight = this.getTerrainSystem().readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

            pVerts[((y * this._iXVerts) + x) * 5 + 0] = v2fVert.x;
            pVerts[((y * this._iXVerts) + x) * 5 + 1] = v2fVert.y;
            pVerts[((y * this._iXVerts) + x) * 5 + 2] = fHeight;

            //console.log(y*this._iXVerts + x,x,y,v2fVert.X,v2fVert.Y,fHeight);
            //	pVerts[((y * this._iXVerts) + x) * 10 + 2],pVerts[((y * this._iXVerts) + x) * 10 + 1]);


            pVerts[((y * this._iXVerts) + x) * 5 + 3] = (this._iSectorX + x / (this._iXVerts - 1)) /
                                                        this.getTerrainSystem().getSectorCountX();
            pVerts[((y * this._iXVerts) + x) * 5 + 4] = (this._iSectorY + y / (this._iYVerts - 1)) /
                                                        this.getTerrainSystem().getSectorCountY();


            //console.log(this._iSectorX,this.getTerrainSystem().getSectorCountX(), x,this._iXVerts);
            //console.log(this._iSectorX/this.getTerrainSystem().getSectorCountX() + x / (this._iXVerts - 1));

            this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
            this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);

            v2fVert.x += v2fCellSize.x;
        }
    }

    this._iVertexID = this._pRenderData.allocateData(this.pVertexDescription, new Float32Array(pVerts));

    return true;
}

TerrainSection.prototype._buildIndexBuffer = function () {
    var pIndexList = new Float32Array(a.getCountIndexForStripGrid(this._iXVerts, this._iYVerts));

    a.createSingleStripGrid(this._pIndexList,
                            this._iXVerts, // width of grid
                            this._iYVerts, // height of grid
                            1, // horz vertex count per cell
                            1, // vert vertex count per cell
                            this._iYVerts, // horz vertex count in vbuffer
                            0);

    //

    this._pRenderData.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)], pIndexList);
    this._pRenderData.index(this._iVertexID, a.DECLUSAGE.INDEX0);

    return true;
}


TerrainSection.prototype.render = function () {
//	this.getTerrainSystem().applyForRender();
    var pRenderer = this._pEngine.shaderManager(),
        pLightManager = this._pEngine.lightManager(),
        pTerrain = this.getTerrainSystem();
    var i;
    var pSnapshot;

    pRenderer.activateSceneObject(this);
    pRenderer.setViewport(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);

    this.switchRenderMethod(".default-render");
    this.startRender();

    pSnapshot = this._pActiveSnapshot;

    for (i = 0; i < 1/*this.totalPasses()*/; i++) {
        this.activatePass(i);

        pRenderer.activateFrameBuffer(pLightManager.deferredFrameBuffers[i]);

        pTerrain.applyForRender(pSnapshot);

        this.applyRenderData(this._pRenderData);
        this.renderPass();
        this.deactivatePass();
        pRenderer.activateFrameBuffer(null);
    }
    this.finishRender();
    pRenderer.deactivateSceneObject();
    return true;
}

TerrainSection.prototype.prepareForRender = function () {
    return;
}

//TerrainSection.prototype.renderCallback = function (entry, activationFlags)
//{
//	var pCamera = this._pEngine._pDefaultCamera;
//	this._pEngine.pDrawTerrainProgram.activate();
//	this.getTerrainSystem().applyForRender();
//	this._pEngine.pDrawTerrainProgram.applyMatrix4('model_mat', this.worldMatrix());
//	this._pEngine.pDrawTerrainProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
//	this._pEngine.pDrawTerrainProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
//	this._pRenderData.draw();
//}

PROPERTY(TerrainSection, 'visible',
         function () {
             'use strict';
             return this._isVisible;
         },
         function (isVisible) {
             'use strict';
             this._isVisible = isVisible;
         }
);


a.TerrainSection = TerrainSection;