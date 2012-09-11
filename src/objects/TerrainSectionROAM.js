Enum([
	TOTAL_DETAIL_LEVELS = 4,
	TOTAL_VARIANCES = 1<<4
], TERRAIN_CONSTANTS, a.TerrainSectionROAM);

function TerrainSectionROAM (pEngine)
{
	A_CLASS;
	this._pDataIndex=null;

	//два дерева треугольников
	this._pRootTriangleA=new a.TriTreeNode();
	this._pRootTriangleB=new a.TriTreeNode();

	//Урове5нь погрещности для двух деревьев
	this._pVarianceTreeA = new Array( a.TerrainSectionROAM.TOTAL_VARIANCES);
	this._pVarianceTreeA.set(0);
	this._pVarianceTreeB = new Array( a.TerrainSectionROAM.TOTAL_VARIANCES);
	this._pVarianceTreeB.set(0);

	//расстояние от камеры до углов секции
	this._v3fDistance0=new Vec3();
	this._v3fDistance1=new Vec3();
	this._v3fDistance2=new Vec3();
	this._v3fDistance3=new Vec3();

	this._fDistance0;
	this._fDistance1;
	this._fDistance2;
	this._fDistance3;

	//Нименьшее растояние от камеры до секции, необходимо для очереди
	this._fQueueSortValue;


	this._pLeftNeighborOfA = null;
	this._pRightNeighborOfA = null;
	this._pLeftNeighborOfB = null;
	this._pRightNeighborOfB = null;



}

EXTENDS(TerrainSectionROAM, a.TerrainSection);

TerrainSectionROAM.prototype.getTriangleA = function()
{
	return this._pRootTriangleA;
}
TerrainSectionROAM.prototype.getTriangleB = function()
{
	return this._pRootTriangleB;
}

TerrainSectionROAM.prototype.getQueueSortValue= function()
{
	return this._fQueueSortValue;
}

TerrainSectionROAM.prototype.getTotalIndices= function()
{
	return this._iTotalIndices;
}

TerrainSectionROAM.prototype.create=function(pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect)
{
	var bResult=TerrainSection.prototype.create.call(this, pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect);


	var pRoamTerrain = this.getTerrainSystem();
	var pNorthSection =
		pRoamTerrain.findSection(iSectorX, iSectorY-1);
	var pSouthSection =
		pRoamTerrain.findSection(iSectorX, iSectorY+1);
	var pEastSection =
		pRoamTerrain.findSection(iSectorX+1, iSectorY);
	var pWestSection =
		pRoamTerrain.findSection(iSectorX-1, iSectorY);

	if (pNorthSection)
	{
		this._pLeftNeighborOfA =
			pNorthSection.getTriangleB();
	}
	if (pSouthSection)
	{
		this._pLeftNeighborOfB =
			pSouthSection.getTriangleA();
	}
	if (pEastSection)
	{
		this._pRightNeighborOfB =
			pEastSection.getTriangleA();
	}
	if (pWestSection)
	{
		this._pRightNeighborOfA =
			pWestSection.getTriangleB();
	}

	// establish basic links
	this.reset();

	// build the variance trees
	this.computeVariance();

	return bResult;
}

TerrainSectionROAM.prototype.prepareForRender = function()
{
	TerrainSection.prototype.prepareForRender.call(this);

	var pCamera = this._pEngine.getActiveCamera();

	var v3fViewPoint= pCamera.worldPosition();
	// compute view distance to our 4 corners
	var fHeight0=this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX),					Math.ceil(this._iHeightMapY));
	var fHeight1=this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX), 					Math.ceil(this._iHeightMapY + this._iYVerts));
	var fHeight2=this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX + this._iXVerts), 	Math.ceil(this._iHeightMapY));
	var fHeight3=this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX + this._iXVerts), 	Math.ceil(this._iHeightMapY + this._iYVerts));


	this._v3fDistance0.set(v3fViewPoint.x-this._pWorldRect.fX0,v3fViewPoint.y-this._pWorldRect.fY0,v3fViewPoint.z-fHeight0);
	this._v3fDistance1.set(v3fViewPoint.x-this._pWorldRect.fX0,v3fViewPoint.y-this._pWorldRect.fY1,v3fViewPoint.z-fHeight1);
	this._v3fDistance2.set(v3fViewPoint.x-this._pWorldRect.fX1,v3fViewPoint.y-this._pWorldRect.fY1,v3fViewPoint.z-fHeight2);
	this._v3fDistance3.set(v3fViewPoint.x-this._pWorldRect.fX1,v3fViewPoint.y-this._pWorldRect.fY0,v3fViewPoint.z-fHeight3);

	this._fDistance0=this._v3fDistance0.length();
	this._fDistance1=this._v3fDistance1.length();
	this._fDistance2=this._v3fDistance2.length();
	this._fDistance3=this._v3fDistance3.length();

	// compute min distance as our sort value
	this._fQueueSortValue = Math.min(this._v3fDistance0.length() , this._v3fDistance1.length());
	this._fQueueSortValue = Math.min(this._fQueueSortValue, this._v3fDistance2.length());
	this._fQueueSortValue = Math.min(this._fQueueSortValue, this._v3fDistance3.length());


	// submit to the tessellation queue of our parent
	this.getTerrainSystem().addToTessellationQueue(this);

}



TerrainSectionROAM.prototype.reset=function()
{
	this._iTotalIndices=0;
	this._pRootTriangleA.pLeftChild = null;
	this._pRootTriangleA.pRightChild = null;
	this._pRootTriangleB.pLeftChild = null;
	this._pRootTriangleB.pRightChild = null;

	this._pRootTriangleA.pBaseNeighbor = this._pRootTriangleB;
	this._pRootTriangleB.pBaseNeighbor = this._pRootTriangleA;

	// link to our neighbors
	this._pRootTriangleA.pLeftNeighbor =  this._pLeftNeighborOfA;
	this._pRootTriangleA.pRightNeighbor = this._pRightNeighborOfA;
	this._pRootTriangleB.pLeftNeighbor =  this._pLeftNeighborOfB;
	this._pRootTriangleB.pRightNeighbor = this._pRightNeighborOfB;
}

TerrainSectionROAM.prototype.tessellate=function(fScale, fLimit)
{
	this.recursiveTessellate(
		this._pRootTriangleA,
		this._fDistance1, this._fDistance2, this._fDistance0, //
		this._pVarianceTreeA, 1,
		fScale, fLimit);

	this.recursiveTessellate(
	    this._pRootTriangleB,
		this._fDistance3, this._fDistance0, this._fDistance2,
	    this._pVarianceTreeB, 1,
	    fScale, fLimit);

}

TerrainSectionROAM.prototype.recursiveTessellate=function(pTri, //вершина дерева треугольников
											   distA, distB, distC, //растояния до углов треугольников, центр, лево, право
											   pVTree, iIndex, //массив погрешности по высоте
											   fScale, fLimit)
{
	if ((iIndex<<1)+1 < a.TerrainSectionROAM.TOTAL_VARIANCES)
	{
		//console.log("vIndex",vIndex,"totalVariances",this._totalVariances)
		var fMidDist = (distB+distC)* 0.5;


		// Если треугольник не поделен
		if (!pTri.pLeftChild)
		{

			var fRatio = (pVTree[iIndex]*fScale)/(fMidDist+0.0001);
			if (fRatio > fLimit)
			{
				// subdivide this triangle
				//console.log("split");
				this.split(pTri);
			}
		}

		// Если треугольник поделен, продолжаем
		if (pTri.pLeftChild)
		{
			//debug_assert(tri->leftChild, "invalid triangle node");
			//debug_assert(tri->rightChild, "invalid triangle node");

			this.recursiveTessellate(pTri.pLeftChild,
				fMidDist, distA,distB,
				pVTree, iIndex<<1,
				fScale, fLimit);

			this.recursiveTessellate(pTri.pRightChild,
				fMidDist,distC,distA,
				pVTree, (iIndex<<1)+1,
				fScale, fLimit);
		}
	}
}

TerrainSectionROAM.prototype.split = function(pTri)
{
	// Если разбит то смысла разбивать еще нет
	if (pTri.pLeftChild)
		return;

	// If this triangle is not in a proper diamond, force split our base neighbor
	if (pTri.pBaseNeighbor && (pTri.pBaseNeighbor.pBaseNeighbor!=pTri))
		this.split(pTri.pBaseNeighbor);

	// Create children and link into mesh
	pTri.pLeftChild  = this.getTerrainSystem().requestTriNode();
	pTri.pRightChild = this.getTerrainSystem().requestTriNode();

	//debug_assert(pTri.leftChild != pTri, "recursive link");
	//debug_assert(pTri.rightChild != pTri, "recursive link");

	// Если не удалось выделить треугольник, то не разбиваем
	if ( (!pTri.pLeftChild) || (!pTri.pRightChild))
	{
		//wconsole.log("не удалось выделить треугольник!");
		pTri.pLeftChild  = null;
		pTri.pRightChild = null;
		return;
	}

	// Fill in the information we can get from the parent (neighbor pointers)
	pTri.pLeftChild.pBaseNeighbor  = pTri.pLeftNeighbor;
	pTri.pLeftChild.pLeftNeighbor  = pTri.pRightChild;

	pTri.pRightChild.pBaseNeighbor  = pTri.pRightNeighbor;
	pTri.pRightChild.pRightNeighbor = pTri.pLeftChild;

	// Link our Left Neighbor to the new children
	if (pTri.pLeftNeighbor)
	{
		if (pTri.pLeftNeighbor.pBaseNeighbor == pTri)
			pTri.pLeftNeighbor.pBaseNeighbor = pTri.pLeftChild;
		else if (pTri.pLeftNeighbor.pLeftNeighbor == pTri)
			pTri.pLeftNeighbor.pLeftNeighbor = pTri.pLeftChild;
		else if (pTri.pLeftNeighbor.pRightNeighbor == pTri)
			pTri.pLeftNeighbor.pRightNeighbor = pTri.pLeftChild;
		else
		{
			console.log(pTri);
			debug_assert(0, "Invalid Left Neighbor!");
			debugger;
		}
	}

	// Link our Right Neighbor to the new children
	if (pTri.pRightNeighbor)
	{
		if (pTri.pRightNeighbor.pBaseNeighbor == pTri)
			pTri.pRightNeighbor.pBaseNeighbor = pTri.pRightChild;
		else if (pTri.pRightNeighbor.pRightNeighbor == pTri)
			pTri.pRightNeighbor.pRightNeighbor = pTri.pRightChild;
		else if (pTri.pRightNeighbor.pLeftNeighbor == pTri)
			pTri.pRightNeighbor.pLeftNeighbor = pTri.pRightChild;
		else
		{
			debug_assert(0, "Invalid Right Neighbor!");
		}
	}

	// Link our Base Neighbor to the new children
	if (pTri.pBaseNeighbor)
	{
		if ( pTri.pBaseNeighbor.pLeftChild )
		{
			pTri.pBaseNeighbor.pLeftChild.pRightNeighbor = pTri.pRightChild;
			pTri.pBaseNeighbor.pRightChild.pLeftNeighbor = pTri.pLeftChild;
			pTri.pLeftChild.pRightNeighbor = pTri.pBaseNeighbor.pRightChild;
			pTri.pRightChild.pLeftNeighbor = pTri.pBaseNeighbor.pLeftChild;
		}
		else
		{
			this.split( pTri.pBaseNeighbor);  // Base Neighbor (in a diamond with us) was not split yet, so do that now.
		}
	}
	else
	{
		// An edge triangle, trivial case.
		pTri.pLeftChild.pRightNeighbor = null;
		pTri.pRightChild.pLeftNeighbor = null;
	}
}


TerrainSectionROAM.prototype._createRenderDataForVertexAndIndex=function()
{
	debug_assert(this._pRenderData == null, "У терраин сектиона уже созданы данные");
	this._pRenderData = this.getTerrainSystem().getDataFactory().getEmptyRenderData(a.PRIMTYPE.TRIANGLELIST, a.RenderData.ADVANCED_INDEX);

	if(!this._pRenderData)
	{
		return false;
	}
	return true;
}

TerrainSectionROAM.prototype._buildIndexBuffer=function()
{
	this._iMaxIndices = this._iXVerts*this._iYVerts*2*3;
	this._iTotalIndices = 0;
	this._pIndexList = new Float32Array(this._iMaxIndices);

	this._pRenderData.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],this._pIndexList);
	this._pRenderData.index(this._iVertexID,a.DECLUSAGE.INDEX0);
	this._pDataIndex=this._pRenderData.getAdvancedIndexData(a.DECLUSAGE.INDEX0);

	return true;
}

TerrainSectionROAM.prototype.buildTriangleList=function()
{
	this._iTotalIndices = 0;
	// add all the triangles to the roamTerrain
	// in root triangle A
	this.recursiveBuildTriangleList(
		this._pRootTriangleA,
		0,this._iXVerts-1,(this._iYVerts-1)*this._iXVerts);

	// add all the triangles to the roamTerrain
	// in root triangle B
	this.recursiveBuildTriangleList(
		this._pRootTriangleB,
		(this._iYVerts*this._iXVerts)-1, (this._iYVerts-1)*this._iXVerts, this._iXVerts-1);

	if(this._iTotalIndicesOld==this._iTotalIndices)
	{
		return;
	}
	//###########################################################################

	var pCanvas=document.getElementById('canvasLOD');
	var p2D=pCanvas.getContext("2d");
	p2D.strokeStyle = "#f00"; //цвет линий
	p2D.lineWidth = 1;
	p2D.beginPath();
	//console.log("Total ",pSec._iTotalIndices);

	//console.log(this);
	var pVerts=this.pVertsDebug;
	var rect=this.getTerrainSystem().worldExtents();
	var size=this.getTerrainSystem().worldSize();
	for(var i=0;i<this._iTotalIndices;i+=3)
	{


		p2D.moveTo(	((pVerts[(this._pIndexList[i+0]*4-this._iVertexID)/32
			*8+0]-rect.fX0)/size.x)*pCanvas.width,
			((pVerts[(this._pIndexList[i+0]*4-this._iVertexID)/32
				*8+1]-rect.fY0)/size.y)*pCanvas.height);
		p2D.lineTo(	((pVerts[(this._pIndexList[i+1]*4-this._iVertexID)/32
			*8+0]-rect.fX0)/size.x)*pCanvas.width,
			((pVerts[(this._pIndexList[i+1]*4-this._iVertexID)/32
				*8+1]-rect.fY0)/size.y)*pCanvas.height);
		p2D.lineTo(	((pVerts[(this._pIndexList[i+2]*4-this._iVertexID)/32
			*8+0]-rect.fX0)/size.x)*pCanvas.width,
			((pVerts[(this._pIndexList[i+2]*4-this._iVertexID)/32
				*8+1]-rect.fY0)/size.y)*pCanvas.height);
		p2D.lineTo(	((pVerts[(this._pIndexList[i+0]*4-this._iVertexID)/32
			*8+0]-rect.fX0)/size.x)*pCanvas.width,
			((pVerts[(this._pIndexList[i+0]*4-this._iVertexID)/32
				*8+1]-rect.fY0)/size.y)*pCanvas.height);
	}
	p2D.stroke();

	//###########################################################################

	this._pRenderData.setIndexLength(this._iTotalIndices);
	this._pDataIndex.setData(this._pIndexList, 0,  a.getTypeSize(a.DTYPE.FLOAT), 0, this._iTotalIndices);
	this._iTotalIndicesOld=this._iTotalIndices;
}

TerrainSectionROAM.prototype.recursiveBuildTriangleList=function(pTri,iPointBase,iPointLeft,iPointRight)
{
	//console.log("recursiveBuildTriangleList",pTri.leftChild)
	if (pTri.pLeftChild)
	{
		if(!pTri.pRightChild)
			warning("invalid triangle node");

		var iPointMid =(iPointLeft+iPointRight)* 0.5;
		this.recursiveBuildTriangleList(
			pTri.pLeftChild,
			iPointMid, iPointBase, iPointLeft);
		this.recursiveBuildTriangleList(
			pTri.pRightChild,
			iPointMid, iPointRight, iPointBase);

	}
	else if (this._iTotalIndices + 3 < this._iMaxIndices)
	{
		// add the local triangle to the index list
		this._pIndexList[this._iTotalIndices++]=(iPointRight*32 + this._iVertexID)/4;
		this._pIndexList[this._iTotalIndices++]=(iPointLeft*32 + this._iVertexID)/4;
		this._pIndexList[this._iTotalIndices++]=(iPointBase*32 + this._iVertexID)/4;
	}

}


TerrainSectionROAM.prototype.computeVariance = function()
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

TerrainSectionROAM.prototype.recursiveComputeVariance= function(iCornerA, iCornerB, iCornerC,
															fHeightA, fHeightB, fHeightC,pVTree, iIndex)
{
	if (iIndex < pVTree.length)
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

a.TerrainSectionROAM=TerrainSectionROAM;
