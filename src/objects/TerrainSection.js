/**
 * @file
 *
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 *
 * TerrainSection класс.
 */

Enum([
	TOTAL_DETAIL_LEVELS = 9,
	TOTAL_VARIANCES = 1<<9
], TERRAIN_CONSTANTS, a.TerrainSection);

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
TerrainSection.prototype.getTerrainSystem = function () {
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

	//Организация ЛОД
	this._pVarianceTreeA = new Array( a.TerrainSection.TOTAL_VARIANCES);
	this._pVarianceTreeB = new Array( a.TerrainSection.TOTAL_VARIANCES);
	this.computeVariance();

	this._fLODLevel=0;

	return bResult;
 };


TerrainSection.prototype._buildVertexAndIndexBuffer=function()
{
	debug_assert(this._pRenderData == null, "У терраин сектиона уже созданы данные");
	this._pRenderData = this.getTerrainSystem().getDataFactory().getEmptyRenderData(a.PRIMTYPE.TRIANGLESTRIP,0);

	if(!this._pRenderData)
	{
		return false;
	}

	this._pWorldRect.fZ0 = MAX_REAL32;
	this._pWorldRect.fZ1 = MIN_REAL32;

	var pCamera = this._pEngine._pDefaultCamera;

	var pVerts = new Array(this._iXVerts * this._iYVerts * (3/*кординаты вершин*/+3/*координаты нормалей*/+2/*текстурные координаты*/));
	var v3fNormal = null;

	var v2fCellSize = new Vec2(); //размер ячейки сектора
	v2fCellSize.set(this.getHeightX() / (this._iXVerts-1),
		this.getHeightY() / (this._iYVerts-1)); //размер сектора/количество ячеек в секторе

	var v2fVert = new Vec2(); //Координаты вершина в секторе
	v2fVert.set(0.0, 0.0);

	//console.log("-->",this._iSectorX,this._iSectorY,"--",this._pWorldRect.fX0,this._pWorldRect.fY0,"--",this._iXVerts,this._iYVerts)
	//console.log("--",v2fCellSize.X,v2fCellSize.Y,this.getHeightX(),this.getHeightY() )

	for (var y = 0; y < this._iYVerts; ++y)
	{
		v2fVert.set(this._pWorldRect.fX0, y * v2fCellSize.y+this._pWorldRect.fY0);
		for (var x = 0; x < this._iXVerts; ++x)
		{

			var fHeight = this.getTerrainSystem().readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

			pVerts[((y * this._iXVerts) + x) * 8 + 0] = v2fVert.x;
			pVerts[((y * this._iXVerts) + x) * 8 + 1] = v2fVert.y;
			pVerts[((y * this._iXVerts) + x) * 8 + 2] = fHeight;

			//console.log(y*this._iXVerts + x,x,y,v2fVert.X,v2fVert.Y,fHeight);
			//	pVerts[((y * this._iXVerts) + x) * 10 + 2],pVerts[((y * this._iXVerts) + x) * 10 + 1]);


			v3fNormal = this.getTerrainSystem().readWorldNormal(this._iHeightMapX + x, this._iHeightMapY + y);
			pVerts[((y * this._iXVerts) + x) * 8 + 3] = v3fNormal.x;
			pVerts[((y * this._iXVerts) + x) * 8 + 4] = v3fNormal.y;
			pVerts[((y * this._iXVerts) + x) * 8 + 5] = v3fNormal.z;

			pVerts[((y * this._iXVerts) + x) * 8 + 6] = (this._iSectorX + x / (this._iXVerts - 1))/this.getTerrainSystem().getSectorCountX();
			pVerts[((y * this._iXVerts) + x) * 8 + 7] = (this._iSectorY+ y / (this._iYVerts - 1))/this.getTerrainSystem().getSectorCountY() ;


			//console.log(this._iSectorX,this.getTerrainSystem().getSectorCountX(), x,this._iXVerts);
			//console.log(this._iSectorX/this.getTerrainSystem().getSectorCountX() + x / (this._iXVerts - 1));

			this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
			this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);

			v2fVert.x += v2fCellSize.x;
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

	//console.log(pIndexes);
	this._pRenderData.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],new Float32Array(pIndexes));
	this._pRenderData.index(iData,a.DECLUSAGE.INDEX0);

	pVerts = null;

	return true;
}


TerrainSection.prototype.render = function ()
{
	this.renderCallback();
}

TerrainSection.prototype.prepareForRender = function()
{

	//Вычисление необходимого уровня лода
	var pCamera = this._pEngine._pDefaultCamera;
	var fHeightCenter=this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX + this._iXVerts/2), Math.ceil(this._iHeightMapY + this._iYVerts/2));

	var v3fCameraPosition=pCamera.worldPosition();
	var fMidDist = Math.sqrt(
		(v3fCameraPosition.x-(this._pWorldRect.fX0+this.getHeightX()/2))*(v3fCameraPosition.x-(this._pWorldRect.fX0+this.getHeightX()/2))+
		(v3fCameraPosition.y-(this._pWorldRect.fY0+this.getHeightY()/2))*(v3fCameraPosition.y-(this._pWorldRect.fY0+this.getHeightY()/2))+
		(v3fCameraPosition.z-fHeightCenter)*(v3fCameraPosition.z-fHeightCenter));

	this._fLODLevel = fMidDist;
		//(Math.max(this._pVarianceTreeA[1],this._pVarianceTreeB[1])*this.terrainSystem().lodErrorScale())/(fMidDist+0.0001);

}

TerrainSection.prototype.renderCallback = function (entry, activationFlags)
{
    //this._pTerrainSystem.renderSection(this, activationFlags, entry);

	var pCamera = this._pEngine._pDefaultCamera;
	this._pEngine.pDrawTerrainProgram.activate();
	this.getTerrainSystem().applyForRender();
	this._pEngine.pDrawTerrainProgram.applyMatrix4('model_mat', this.worldMatrix());
	this._pEngine.pDrawTerrainProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
	this._pEngine.pDrawTerrainProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
	this._pEngine.pDrawTerrainProgram.applyFloat('LOD', this._fLODLevel);

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


TerrainSection.prototype.computeVariance = function()
{
	var iTableWidth = this.getTerrainSystem().tableWidth();
	var iTableHeight = this.getTerrainSystem().tableHeight();

	var iIndex0 =  this.getTerrainSystem().tableIndex(this._iHeightMapX,					this._iHeightMapY);
	var iIndex1 =  this.getTerrainSystem().tableIndex(this._iHeightMapX,					this._iHeightMapY+this._iYVerts-1);
	var iIndex2 =  this.getTerrainSystem().tableIndex(this._iHeightMapX+this._iXVerts-1,	this._iHeightMapY+this._iYVerts-1);
	var iIndex3 =  this.getTerrainSystem().tableIndex(this._iHeightMapX+this._iXVerts-1,	this._iHeightMapY);

	var fHeight0 = this.getTerrainSystem().readWorldHeight(iIndex0);
	var fHeight1 = this.getTerrainSystem().readWorldHeight(iIndex1);
	var fHeight2 = this.getTerrainSystem().readWorldHeight(iIndex2);
	var fHeight3 = this.getTerrainSystem().readWorldHeight(iIndex3);

	this.recursiveComputeVariance(
		iIndex1, iIndex2, iIndex0,
		fHeight1, fHeight2, fHeight0,
		this._pVarianceTreeA, 1);

	this.recursiveComputeVariance(
		iIndex3, iIndex0, iIndex2,
		fHeight3, fHeight0, fHeight2,
		this._pVarianceTreeB, 1);
}

TerrainSection.prototype.recursiveComputeVariance= function(iCornerA, iCornerB, iCornerC,
													fHeightA, fHeightB, fHeightC,pVTree, iIndex)
{
	if (iIndex < a.TerrainSection.TOTAL_VARIANCES)
	{
		var iMidpoint = (iCornerB+iCornerC)>>1;
		var fMidHeight = this.getTerrainSystem().readWorldHeight(iMidpoint);
		var fInterpolatedHeight = (fHeightB+fHeightC)*0.5;
		var fVariance = Math.abs(fMidHeight - fInterpolatedHeight);

		// find the variance of our children
		var fLeft = this.recursiveComputeVariance(
		iMidpoint, iCornerA, iCornerB,
		fMidHeight, fHeightA, fHeightB,
		pVTree, iIndex<<1);

		var fRight = this.recursiveComputeVariance(
		iMidpoint, iCornerC, iCornerA,
		fMidHeight, fHeightC, fHeightA,
		pVTree, 1+(iIndex<<1));

		// local variance is the minimum of all three
		fVariance = Math.max(fVariance, fLeft);
		fVariance = Math.max(fVariance, fRight);

		// store the variance as 1/(variance+1)
		pVTree[iIndex] = fVariance;

		return fVariance;
	}
	// return a value which will be ignored by the parent
	// (because the minimum function is used with this result)
	return 0;
}


a.TerrainSection = TerrainSection;