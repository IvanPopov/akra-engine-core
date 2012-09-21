//Лод

Enum([
	MaxTriTreeNodes = (1024*64) //64k triangle nodes
], CONST, a.TerrainROAM);


function TerrainROAM (pEngine)
{
	A_CLASS;

	this._pNodePool=null;
	this._pThistessellationQueue=null;
	this._iTessellationQueueCount = 0;
	this._isCreate=false;
}


EXTENDS(TerrainROAM, a.Terrain);



TerrainROAM.prototype.create = function (pRootNode, pHeightMap,worldExtents, iShift, iShiftX,iShiftY,sSurfaceTextures)
{
	var bResult = Terrain.prototype.create.call(this, pRootNode, pHeightMap,worldExtents, iShift, iShiftX,iShiftY,sSurfaceTextures);
	if (bResult)
	{
		this._iTessellationQueueSize=this.getSectorCountX()*this.getSectorCountY();
		this._pNodePool=new a.TriangleNodePool(a.TerrainROAM.MaxTriTreeNodes);
		this._pThistessellationQueue = new Array(this._iTessellationQueueSize);
		this._iTessellationQueueCount = 0;
		this._isCreate=true;
	}
	return bResult;
}

TerrainROAM.prototype.destroy=function()
{
	delete this._pNodePool;
	delete this._pThistessellationQueue;

	this._iTessellationQueueCount = 0;
	this._fScale = 0;
	this._fLimit = 0;
	Terrain.prototype.destroy.call(this);
}


TerrainROAM.prototype.allocateSectors = function () {
	/*this._pSectorArray =
	 new cTerrainSection[
	 this._iSectorCountX*this._iSectorCountY];*/
	this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);
	for(var i=0;i<this._pSectorArray.length;i++)
	{
		this._pSectorArray[i] = new a.TerrainSectionROAM(this._pEngine);
	}

	// create the sector objects themselves
	for (var y = 0; y < this._iSectorCountY; ++y) {
		for (var x = 0; x < this._iSectorCountX; ++x) {
			//cVector2 sectorPos(
			v2fSectorPos = new Vec2();
			v2fSectorPos.set(
				this._pWorldExtents.fX0 + (x * this._v2fSectorSize.x),
				this._pWorldExtents.fY0 + (y * this._v2fSectorSize.y));

			//cRect2d r2fSectorRect(
			r2fSectorRect = new a.Rect2d();
			r2fSectorRect.set(
				v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x,
				v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

			iXPixel = x << this._iSectorShift;
			iYPixel = y << this._iSectorShift;
			iIndex = (y * this._iSectorCountX) + x;
			if (!this._pSectorArray[iIndex].create(
				this._pRootNode,
				this,
				x, y,
				iXPixel, iYPixel,
				this._iSectorVerts,
				this._iSectorVerts,
				r2fSectorRect)) {
				return false;
			}
		}
	}

	return true;
}

//
// reset is called at the start of each frame
// to return all counters to zero, preparing
// both the triangle node pool and the
// tessellation queue for new entries
//
TerrainROAM.prototype.reset=function()
{

	if(this._isCreate)
	{
		Terrain.prototype.reset.call(this);
		// reset internal counters
		this._iTessellationQueueCount = 0;
		this._pThistessellationQueue.length=this._iTessellationQueueSize;

		this._pNodePool.reset();

		// reset each section
		for (var i in this._pSectorArray)
		{
			this._pSectorArray[i].reset();
		}
	}
}

TerrainROAM.prototype.requestTriNode=function()
{
	return this._pNodePool.request()
}


//
// As sections are pulled from the quad tree,
// they add themselves to the tessellation queue
//
TerrainROAM.prototype.addToTessellationQueue=function(pSection)
{
	if (this._iTessellationQueueCount < this._iTessellationQueueSize)
	{
		this._pThistessellationQueue[this._iTessellationQueueCount] =
			pSection;
		this._iTessellationQueueCount++;
		return true;
	}

	// while we handle this failure gracefully
	// in release builds, we alert ourselves
	// to the situation with an assert in debug
	// builds so we can increase the queue size
	debug_assert(0,	"increase the size of the ROAM tessellation queue");
	return false;
}


STATIC(TerrainROAM,fXOld,undefined);
STATIC(TerrainROAM,fYOld,undefined);
STATIC(TerrainROAM,nCountRender,0);

TerrainROAM.prototype.prepareForRender = function()
{

	if(this._isCreate)
	{
		Terrain.prototype.prepareForRender.call(this);

		if(((statics.nCountRender++)%10)==0)
		{
			//#####################################################################################
			var pCanvas=document.getElementById('canvasLOD');
			var p2D=pCanvas.getContext("2d");
			p2D.fillStyle = "#fff"; // цвет фона
			p2D.fillRect(0, 0, pCanvas.width, pCanvas.height);

			//console.log("Total ",pSec._iTotalIndices);


			var pVerts=this.pVertsDebug;

			//#####################################################################################


			var pCamera = this._pEngine.getActiveCamera();
			var v3fCameraPosition=pCamera.worldPosition();
			var fX=(v3fCameraPosition.x-this.worldExtents().fX0)/Math.abs(this.worldExtents().fX1-this.worldExtents().fX0);
			var fY=(v3fCameraPosition.y-this.worldExtents().fY0)/Math.abs(this.worldExtents().fY1-this.worldExtents().fY0);

			//if(fX!=statics.fXOld||fY!=statics.fYOld)
			//{
				this.processTessellationQueue();
				statics.fXOld=fX;
				statics.fYOld=fY;
			//}


			//#####################################################################################
			var pCamera = this._pEngine.getActiveCamera();
			var v3fCameraPosition=pCamera.worldPosition();
			var pData = pCamera.worldMatrix().pData;
			var pDir = new Vec2(-pData._13,-pData._23);
			var fRad = pCamera.fov();
			//var fNear = pCamera.nearPlane();
			var fFar = pCamera.farPlane();
			pDir.normalize();
			pDir.scale(fFar/Math.abs(this.worldExtents().fX1-this.worldExtents().fX0));
			var pDir1= new Vec2(pDir.x*Math.cos( fRad/2)-pDir.y*Math.sin( fRad/2),pDir.x*Math.sin( fRad/2)+pDir.y*Math.cos( fRad/2));
			var pDir2= new Vec2(pDir.x*Math.cos(-fRad/2)-pDir.y*Math.sin(-fRad/2),pDir.x*Math.sin(-fRad/2)+pDir.y*Math.cos(-fRad/2));

			//document.getElementById('setinfo0').innerHTML="fNear " + fNear;
			document.getElementById('setinfo1').innerHTML="fFar "  + fFar;
			//Вычисление текстурных координат над которыми находиться камера
			var fX=(v3fCameraPosition.x-this.worldExtents().fX0)/Math.abs(this.worldExtents().fX1-this.worldExtents().fX0);
			var fY=(v3fCameraPosition.y-this.worldExtents().fY0)/Math.abs(this.worldExtents().fY1-this.worldExtents().fY0);

			//камера
			p2D.beginPath();
			p2D.strokeStyle = "#000"; //цвет линий
			p2D.lineWidth = 3;
			p2D.moveTo(fX*pCanvas.width,fY*pCanvas.height);
			p2D.lineTo((fX+pDir1.x)*pCanvas.width,(fY+pDir1.y)*pCanvas.height);
			p2D.lineTo((fX+pDir2.x)*pCanvas.width,(fY+pDir2.y)*pCanvas.height);
			p2D.lineTo(fX*pCanvas.width,fY*pCanvas.height);
			p2D.stroke();
			p2D.beginPath();
			p2D.arc(fX*pCanvas.width,fY*pCanvas.height, 5, 0, 2*Math.PI, false);
			p2D.fillStyle = "#00f";
			p2D.fill();
			p2D.lineWidth = 1;
			p2D.strokeStyle = "#00f";
			p2D.stroke();
			//секции

//#####################################################################################
		}
	}

	return;
}

//
// This function is called to sort the queue and
// allow each section to tessellate in order
//
TerrainROAM.prototype.processTessellationQueue=function()
{
	this._pThistessellationQueue.length=this._iTessellationQueueCount;

	function fnSortSection(a, b)
	{
		return a.getQueueSortValue()- b.getQueueSortValue();
	}
	this._pThistessellationQueue.sort(fnSortSection);

	for (var i=0; i<this._iTessellationQueueCount; ++i)
	{
		// split triangles based on the
		// scale and limit values
		this._pThistessellationQueue[i].tessellate(
			this._fScale, this._fLimit);
	}

	// gather up all the triangles into
	// a final index buffer per section

for (var i=0; i<this._iTessellationQueueCount; ++i)
	{
		this._pThistessellationQueue[i].buildTriangleList();
	}

}

a.TerrainROAM=TerrainROAM;