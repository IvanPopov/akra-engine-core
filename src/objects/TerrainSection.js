/**
 * @file
 *
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 *
 * TerrainSection класс.
 */

function TerrainSection (pEngine)
{
	A_CLASS;

	this._pTerrainSystem = null; //Терреин которому принадлежит секуция
    this._pSectorVerts = null;
    this._iHeightMapX; //Ее коорлинаты на карте высот
    this._iHeightMapY;
    this._iSectorX;   //номер сектора по иксу и по игрику
    this._iSectorY;
    this._iXVerts = 0; //Ращмеры сетки вершин
    this._iYVerts = 0;
    this._pWorldRect = new a.Rect3d(); //Положение сетора в мире
};

EXTENDS(TerrainSection, a.SceneObject, a.RenderableObject);

TerrainSection.prototype.pVertexDescription =[VE_FLOAT3(a.DECLUSAGE.POSITION),VE_FLOAT3(a.DECLUSAGE.NORMAL),VE_FLOAT2(a.DECLUSAGE.TEXCOORD)]

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

TerrainSection.prototype.getHeightX = function () {
	return Math.abs(this._pWorldRect.fX1-this._pWorldRect.fX0);
};

TerrainSection.prototype.getHeightY = function () {
	return Math.abs(this._pWorldRect.fY1-this._pWorldRect.fY0);
};


TerrainSection.prototype.create =
function (pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect)
{
	bResult = TerrainSection.superclass.create.apply(this, arguments);
	if (bResult)
	{
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

		pResult = this._buildVertexAndIndexBuffer();

		// set the scene object bounds data
		this.accessLocalBounds().set(this._pWorldRect.fX0,
									 this._pWorldRect.fX1,
									 this._pWorldRect.fY0,
									 this._pWorldRect.fY1,
									 this._pWorldRect.fZ0,
									 this._pWorldRect.fZ1);
		if(bResult)
			this.attachToParent(pRootNode);
	}

	return bResult;
 };


TerrainSection.prototype._buildVertexAndIndexBuffer=function()
{
	debug_assert(this._pRenderData == null, "У терраин сектиона уже созданы данные");
	this._pRenderData = this._pTerrainSystem.getDataFactory().getEmptyRenderData(a.PRIMTYPE.TRIANGLESTRIP,0);

	if(!this._pRenderData)
	{
		return false;
	}

	this._pWorldRect.fZ0 = MAX_REAL32;
	this._pWorldRect.fZ1 = MIN_REAL32;

	var pVerts = new Array(this._iXVerts * this._iYVerts * (3/*кординаты вершин*/+3/*координаты нормалей*/+2/*текстурные координаты*/));
	var v3fNormal = null;

	var v2fCellSize = Vec2.create(); //размер ячейки сектора
	Vec2.set(this.getHeightX() / (this._iXVerts-1),
		this.getHeightY() / (this._iYVerts-1),
		v2fCellSize); //размер сектора/количество ячеек в секторе

	var v2fVert = Vec2.create(); //Координаты вершина в секторе
	Vec2.set(0.0, 0.0, v2fVert);

	//console.log("-->",this._iSectorX,this._iSectorY,"--",this._pWorldRect.fX0,this._pWorldRect.fY0,"--",this._iXVerts,this._iYVerts)
	//console.log("--",v2fCellSize.X,v2fCellSize.Y,this.getHeightX(),this.getHeightY() )

	for (var y = 0; y < this._iYVerts; ++y)
	{
		Vec2.set(this._pWorldRect.fX0, y * v2fCellSize.Y+this._pWorldRect.fY0, v2fVert);
		for (var x = 0; x < this._iXVerts; ++x)
		{

			var fHeight = this._pTerrainSystem.readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

			pVerts[((y * this._iXVerts) + x) * 8 + 0] = v2fVert.X;
			pVerts[((y * this._iXVerts) + x) * 8 + 1] = v2fVert.Y;
			pVerts[((y * this._iXVerts) + x) * 8 + 2] = fHeight;
			//console.log(y*this._iXVerts + x,x,y,v2fVert.X,v2fVert.Y,fHeight);
			//console.log( fHeight);
			//	pVerts[((y * this._iXVerts) + x) * 10 + 2],pVerts[((y * this._iXVerts) + x) * 10 + 1]);


			v3fNormal = this._pTerrainSystem.readWorldNormal(this._iHeightMapX + x, this._iHeightMapY + y);
			pVerts[((y * this._iXVerts) + x) * 8 + 3] = v3fNormal.X;
			pVerts[((y * this._iXVerts) + x) * 8 + 4] = v3fNormal.Y;
			pVerts[((y * this._iXVerts) + x) * 8 + 5] = v3fNormal.Z;

			pVerts[((y * this._iXVerts) + x) * 8 + 6] = this._iSectorX/this._pTerrainSystem.getSectorCountX() + x / (this._iXVerts - 1);
			pVerts[((y * this._iXVerts) + x) * 8 + 7] = this._iSectorY/this._pTerrainSystem.getSectorCountY() + y / (this._iYVerts - 1);


			this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
			this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);

			v2fVert.X += v2fCellSize.X;
		}
	}

	var iData=this._pRenderData.allocateData(this.pVertexDescription,new Float32Array(pVerts));

	var pIndexes = a.createSingleStripGrid(
		this._iXVerts, // width of grid
		this._iYVerts, // height of grid
		1, // horz vertex count per cell
		1, // vert vertex count per cell
		this._iYVerts, // horz vertex count in vbuffer
		0);

	this._pRenderData.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],new Float32Array(pIndexes));
	this._pRenderData.index(iData,a.DECLUSAGE.INDEX0);

	pVerts = null;

	return true;
}


TerrainSection.prototype.render = function ()
{
	this.renderCallback();
}

TerrainSection.prototype.renderCallback = function (entry, activationFlags)
{
    //this._pTerrainSystem.renderSection(this, activationFlags, entry);

	var pCamera = this._pEngine._pDefaultCamera;
	this._pEngine.pDrawTerrainProgram.activate();

	this._pEngine.pDrawTerrainProgram.applyMatrix4('model_mat', this.worldMatrix());
	this._pEngine.pDrawTerrainProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
	this._pEngine.pDrawTerrainProgram.applyMatrix4('view_mat', pCamera.viewMatrix());

	this._pRenderData.draw();
}

PROPERTY(TerrainSection,'visible',
	function(){
		'use strict';
		return this._isVisible;
	},
	function(isVisible){
		'use strict';
		this._isVisible = isVisible;
	}
);


a.TerrainSection = TerrainSection;