//Лод

Enum([
	MaxTriTreeNodes = (1024*64) //64k triangle nodes
], CONST, a.TerrainROAM);


function TerrainROAM (pEngine)
{
	A_CLASS;

	this._pRenderData = this.getDataFactory().getEmptyRenderData(a.PRIMTYPE.TRIANGLELIST,a.RenderData.ADVANCED_INDEX);
	this._pDataIndex;
	this._iTotalIndices;
	this._iTotalIndicesOld;
	this._iTotalIndicesMax;
	this._pIndexList;
	this._pVerts;
	this._iVertexID;

	this._pNodePool=null;
	this._pThistessellationQueue=null;
	this._iTessellationQueueCount = 0;
	this._isCreate=false;
	this._isRenderInThisFrame=false;
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
		this._iTotalIndicesMax=0;
	}
	return bResult;
}

TerrainROAM.prototype.getVerts=function()
{
	return this._pVerts;
}

TerrainROAM.prototype.getIndex=function()
{
	return this._pIndexList;
}
TerrainROAM.prototype.setTotalIndex=function(iTotalIndices)
{
	this._iTotalIndices=iTotalIndices;
}
TerrainROAM.prototype.getTotalIndex=function()
{
	return this._iTotalIndices;
}

TerrainROAM.prototype.getVertexID=function()
{
	return this._iVertexID;
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


	//Вершинный буфер для всех
	this._pVerts=new Array((this._iSectorCountX*this._iSectorCountY/*количество секции*/)*(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/) * (3/*кординаты вершин*/+2/*текстурные координаты*/));

	for(var i=0;i<this._pSectorArray.length;i++)
	{
		this._pSectorArray[i] = new a.TerrainSectionROAM(this._pEngine);
	}

    this.setRenderMethod(this._pDefaultRenderMethod);

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
				this._pRootNode,  //Родительские нод
				this,				// Терраин
				x, y,				// Номер секции оп иксу и игрику
				iXPixel, iYPixel,   // Координаты секции в картах нормалей и врешин
				this._iSectorVerts, // Количесвто вершин в секции по иску и игрику
				this._iSectorVerts,
				r2fSectorRect,
				iIndex*(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/))){
				return false;
			}
		}
	}

	var pVertexDescription = [VE_FLOAT3(a.DECLUSAGE.POSITION),VE_FLOAT2(a.DECLUSAGE.TEXCOORD)];
	this._iVertexID=this._pRenderData.allocateData(pVertexDescription,new Float32Array(this._pVerts));


	//Индексны буфер для всех
	this._iTotalIndices=0;
	this._pIndexList = new Float32Array(a.TerrainROAM.MaxTriTreeNodes*3); //Максимальное количество треугольников помноженное на 3 вершины на каждый треугольник
	this._pRenderData.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],this._pIndexList);
	this._pRenderData.index(this._iVertexID,a.DECLUSAGE.INDEX0);
	this._pDataIndex=this._pRenderData.getAdvancedIndexData(a.DECLUSAGE.INDEX0);

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
	this._isRenderInThisFrame=false;
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


STATIC(TerrainROAM,_iTessellationQueueCountOld,undefined);
STATIC(TerrainROAM,nCountRender,0);

TerrainROAM.prototype.prepareForRender = function()
{

	if(this._isCreate)
	{
		Terrain.prototype.prepareForRender.call(this);

		if(((statics.nCountRender++)%30)==0)
		{
			/*
			//#####################################################################################
			var pCanvas=document.getElementById('canvasLOD');
			var p2D=pCanvas.getContext("2d");
			p2D.fillStyle = "#fff"; // цвет фона
			p2D.fillRect(0, 0, pCanvas.width, pCanvas.height);


			//#####################################################################################*/

			var pCamera = this._pEngine.getActiveCamera();
			var v3fCameraPosition=pCamera.worldPosition();
			var fX=(v3fCameraPosition.x-this.worldExtents().fX0)/Math.abs(this.worldExtents().fX1-this.worldExtents().fX0);
			var fY=(v3fCameraPosition.y-this.worldExtents().fY0)/Math.abs(this.worldExtents().fY1-this.worldExtents().fY0);

			if(this._iTessellationQueueCount!=statics._iTessellationQueueCountOld)
			{
				this.processTessellationQueue();
				statics._iTessellationQueueCountOld=this._iTessellationQueueCount;
			}


			/*//#####################################################################################
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

//#####################################################################################*/
		}
	}

	return;
}

//Применение параметров для рендеринга, коготрые зависят от самого терраина
TerrainROAM.prototype.render = function(pWorldMatrix)
{
//    this._pSectorArray[0].setRenderData(this._pRenderData);
//    TerrainSection.prototype.render.call(this._pSectorArray[0]);
    if(this._isRenderInThisFrame==false)
	{
		this._isRenderInThisFrame=true;

		var pCamera = this._pEngine.getActiveCamera();
//		this._pEngine.pDrawTerrainProgram.activate();
        this._pSectorArray[0].setRenderData(this._pRenderData);
        TerrainSection.prototype.render.call(this._pSectorArray[0]);
//		Terrain.prototype.applyForRender.call(this);
//		this._pEngine.pDrawTerrainProgram.applyMatrix4('model_mat', pWorldMatrix);
//		this._pEngine.pDrawTerrainProgram.applyMatrix4('proj_mat', pCamera.projectionMatrix());
//		this._pEngine.pDrawTerrainProgram.applyMatrix4('view_mat', pCamera.viewMatrix());
//		this._pRenderData.draw();
	}
};

//
// This function is called to sort the queue and
// allow each section to tessellate in order
//
STATIC(TerrainROAM,fXOld,undefined);
STATIC(TerrainROAM,fYOld,undefined);
STATIC(TerrainROAM,nCountRender,0);

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

	this._iTotalIndices = 0;

	// gather up all the triangles into
	// a final index buffer per section

	for (var i=0; i<this._iTessellationQueueCount; ++i)
	{
		this._pThistessellationQueue[i].buildTriangleList();
	}

	if(this._iTotalIndicesOld==this._iTotalIndices && this._iTotalIndices!= this._iTotalIndicesMax)
	{
		//console.log("!!!!_iTotalIndices",this._iTotalIndices);
		return;
	}


	this._pRenderData.setIndexLength(this._iTotalIndices);
	this._pDataIndex.setData(this._pIndexList, 0, a.getTypeSize(a.DTYPE.FLOAT), 0, this._iTotalIndices);
	this._iTotalIndicesOld=this._iTotalIndices;
	this._iTotalIndicesMax=Math.max(this._iTotalIndicesMax,this._iTotalIndices);
}

a.TerrainROAM=TerrainROAM;