var pTmpTransferableArray: ArrayBuffer[] = [null];

enum ECommandTypes{
	INITTERRAIN = 1,
	HEIGHTMAP = 2,
	UPDATEPARAMS = 3,
	TESSELATE = 4
}

interface ICommand{
	type: ECommandTypes;
	info: any;
}

(<any>self).onmessage = function(event: any){
	if(event.data instanceof ArrayBuffer){
		processTesselate(event.data);
	}
	else {
		var pCommand: ICommand = <ICommand>event.data;
		switch(pCommand.type){
			case ECommandTypes.INITTERRAIN:
				processInitTerrain(<ITerrainInitInfo>pCommand.info);
				return;
			case ECommandTypes.UPDATEPARAMS:
				processUpdateParams(pCommand.info);
				return;

		}
	}
}

interface IRect3d{
	x0: number;
	y0: number;
	z0: number;

	x1: number;
	y1: number;
	z1: number;
}

interface ITriTreeNode {
	baseNeighbor: ITriTreeNode;
	leftNeighbor: ITriTreeNode;
	rightNeighbor: ITriTreeNode;
	leftChild: ITriTreeNode;
	rightChild: ITriTreeNode;
}

interface ITerrainSectionInfo{
	x: number;
	y: number;
	pixelX: number;
	pixelY: number;
				
	varianceTreeA: number[];
	varianceTreeB: number[];

	rootTriangleA: ITriTreeNode;
	rootTriangleB: ITriTreeNode;

	leftNeighborOfA: ITriTreeNode;
	rightNeighborOfA: ITriTreeNode;
	leftNeighborOfB: ITriTreeNode;
	rightNeighborOfB: ITriTreeNode;

	startIndex: number
}

interface ITerrainInitInfo{
	heightMapTable: ArrayBuffer;
	tableWidth: number;
	tableHeight: number;
	sectorUnits: number;
	sectorCountX: number;
	sectorCountY: number;
	isUsedVertexNormal: bool;
	worldExtents: IRect3d;
	maxHeight: number;
	maxTriTreeNodeCount: number;

	tessellationScale: number;
	tessellationLimit: number;

	vertexID: number;
}

function createTriTreeNode(): ITriTreeNode {
	return <ITriTreeNode>{
		baseNeighbor: null,
		leftNeighbor: null,
		rightNeighbor: null,
		leftChild: null,
		rightChild: null
	};
}

class TriangleNodePool {
	private _iNextTriNode: number = 0;
	private _iMaxCount: number = 0;
	private _pPool: ITriTreeNode[] = null;

	constructor(iCount: number){
		this._iMaxCount = iCount;
		this._pPool = new Array(iCount);

		for(var i: number = 0; i < this._iMaxCount; i++){
			this._pPool[i] = createTriTreeNode(); 
		}
	}

	request(): ITriTreeNode {
		if(this._iNextTriNode >= this._iMaxCount){
			return null;
		}
		else {
			var pNode: ITriTreeNode = this._pPool[this._iNextTriNode];
			pNode.baseNeighbor  = null;
			pNode.leftNeighbor  = null;
			pNode.rightNeighbor = null;
			pNode.leftChild     = null;
			pNode.rightChild    = null;
			this._iNextTriNode++;
			return pNode;
		}
	}

	reset(): void {
		this._iNextTriNode = 0;
	}
}


interface ITerrainInfo{
	heightMapTable: Float32Array;

	tableWidth: number;
	tableHeight: number;

	sectorUnits: number;
	sectorCountX: number;
	sectorCountY: number;

	isUsedVertexNormal: bool;

	worldExtents: IRect3d;
	maxHeight: number;
	terrain2DLength: number;

	maxTriTreeNodeCount: number;
	triNodePool: TriangleNodePool;

	sections: ITerrainSectionInfo[];
	sectorTotalDetailLevels: number;
	sectorTotalVariances: number;

	tessellationScale: number;
	tessellationLimit: number;

	cameraCoord: Float32Array;
	tessellationQueue: Uint32Array;
	tessellationQueueSize: number;

	tessellationIndices: Float32Array;
	totalIndices: number;

	vertexID: number;

	processTessellationQueue(): void;
}

class TerrainInfo implements ITerrainInfo {
	heightMapTable: Float32Array;

	tableWidth: number;
	tableHeight: number;

	sectorUnits: number;
	sectorCountX: number;
	sectorCountY: number;

	isUsedVertexNormal: bool;

	worldExtents: IRect3d;
	maxHeight: number;
	terrain2DLength: number;

	maxTriTreeNodeCount: number;
	triNodePool: TriangleNodePool;

	sections: ITerrainSectionInfo[];

	sectorTotalDetailLevels: number;
	sectorTotalVariances: number;

	tessellationScale: number;
	tessellationLimit: number;

	cameraCoord: Float32Array;
	tessellationQueue: Uint32Array;
	tessellationQueueSize: number;

	tessellationIndices: Float32Array;
	totalIndices: number;
	
	vertexID: number;


	constructor(pInitInfo: ITerrainInitInfo){
		this.heightMapTable = new Float32Array(pInitInfo.heightMapTable);

		this.tableWidth = pInitInfo.tableWidth;
		this.tableHeight = pInitInfo.tableHeight;

		this.sectorUnits = pInitInfo.sectorUnits;
		this.sectorTotalDetailLevels = 0;
		this.sectorTotalVariances = 0;
		this.sectorCountX = pInitInfo.sectorCountX;
		this.sectorCountY = pInitInfo.sectorCountY;

		this.isUsedVertexNormal = pInitInfo.isUsedVertexNormal;

		this.worldExtents = pInitInfo.worldExtents;
		this.maxHeight = pInitInfo.maxHeight;
		this.terrain2DLength = 0;

		this.maxTriTreeNodeCount = pInitInfo.maxTriTreeNodeCount;
		this.triNodePool = new TriangleNodePool(pInitInfo.maxTriTreeNodeCount);

		this.sections = null;

		this.tessellationScale = pInitInfo.tessellationScale;
		this.tessellationLimit = pInitInfo.tessellationLimit;

		this.cameraCoord = null;
		this.tessellationQueue = new Uint32Array(this.sectorCountX * this.sectorCountY);
		this.tessellationQueueSize = 0;

		this.tessellationIndices = null;
		this.vertexID = pInitInfo.vertexID;
		this.totalIndices = 0;


		this.sectorTotalDetailLevels = 2 * (Math.round(Math.log(this.sectorUnits)/Math.LN2));
		this.sectorTotalVariances = 1 << this.sectorTotalDetailLevels;
		this.terrain2DLength = Math.sqrt((this.worldExtents.x1 - this.worldExtents.x0) * (this.worldExtents.x1 - this.worldExtents.x0) +
									     (this.worldExtents.y1 - this.worldExtents.y0) * (this.worldExtents.y1 - this.worldExtents.y0));
		this.sections = new Array(this.sectorCountX * this.sectorCountY);

		this.initSections();
	}

	processTessellationQueue(): void {
		this.totalIndices = 0;
		this.triNodePool.reset();

		for(var i: number = 0; i < this.tessellationQueueSize; i++){
			this.tesselateSection(this.sections[this.tessellationQueue[i]]);
		}

		for(var i: number = 0; i < this.tessellationQueueSize; i++){
			var pSection = this.sections[this.tessellationQueue[i]];
			this.buildTriangleList(pSection);
			this.resetSection(pSection);
		}
	}

	private initSections(): void {
		var iShift: number = (Math.log(this.sectorUnits)/Math.LN2) | 0;
		var iSectorVerts: number = this.sectorUnits + 1;

		for(var y: number = 0; y < this.sectorCountY; y++) {
			for(var x: number = 0; x < this.sectorCountX; x++) {
				var iXPixel: number = x << iShift;
				var iYPixel: number = y << iShift;
				var iIndex: number = (y * this.sectorCountX) + x;

				this.sections[iIndex] = <ITerrainSectionInfo>{
					x: x,
					y: y,
					pixelX: iXPixel,
					pixelY: iYPixel,
					
					varianceTreeA: new Array(this.sectorTotalVariances),
					varianceTreeB: new Array(this.sectorTotalVariances),

					rootTriangleA: createTriTreeNode(),
					rootTriangleB: createTriTreeNode(),
					leftNeighborOfA: null,
					rightNeighborOfA: null,
					leftNeighborOfB: null,
					rightNeighborOfB: null,

					startIndex: iIndex * (iSectorVerts * iSectorVerts)
				};
			}
		}

		//set neighbors for sections
		for(var y: number = 0; y < this.sectorCountY; y++) {
			for(var x: number = 0; x < this.sectorCountX; x++) {
				var pSection: ITerrainSectionInfo = this.findSection(x, y);
				var pNorthSection: ITerrainSectionInfo = this.findSection(x, y - 1);
				var pSouthSection: ITerrainSectionInfo = this.findSection(x, y + 1);
				var pEastSection: ITerrainSectionInfo  = this.findSection(x + 1, y);
				var pWestSection: ITerrainSectionInfo  = this.findSection(x - 1, y);

				if (pNorthSection !== null) {
					pSection.leftNeighborOfA = pNorthSection.rootTriangleB;
				}

				if (pSouthSection !== null) {
					pSection.leftNeighborOfB = pSouthSection.rootTriangleA;
				}

				if (pEastSection !== null) {
					pSection.rightNeighborOfB = pEastSection.rootTriangleA;
				}

				if (pWestSection !== null) {
					pSection.rightNeighborOfA = pWestSection.rootTriangleB;
				}

				this.resetSection(pSection);
			}
		}

		this.computeVariance(pSection);
	}

	private resetSection(pSection: ITerrainSectionInfo): void {
		pSection.rootTriangleA.leftChild  = null;
		pSection.rootTriangleA.rightChild = null;
		pSection.rootTriangleB.leftChild  = null;
		pSection.rootTriangleB.rightChild = null;

		pSection.rootTriangleA.baseNeighbor = pSection.rootTriangleB;
		pSection.rootTriangleB.baseNeighbor = pSection.rootTriangleA;

		// link to our neighbors
		pSection.rootTriangleA.leftNeighbor  = pSection.leftNeighborOfA;
		pSection.rootTriangleA.rightNeighbor = pSection.rightNeighborOfA;
		pSection.rootTriangleB.leftNeighbor  = pSection.leftNeighborOfB;
		pSection.rootTriangleB.rightNeighbor = pSection.rightNeighborOfB;
	}

	private findSection(iX: number, iY: number): ITerrainSectionInfo {
		var pSection: ITerrainSectionInfo = null;

		if (iX >= 0 && iX < this.sectorCountX
		    && iY >= 0 && iY < this.sectorCountY) {
		    pSection = this.sections[(iY * this.sectorCountX) + iX];
		}

		return pSection;
	}

	private tableIndex(iMapX: number, iMapY: number): number {
		// clamp to the table dimensions
		if (iMapX >= this.tableWidth) {
		    iMapX = this.tableWidth - 1;
		}
		
		if (iMapY >= this.tableHeight) {
		    iMapY = this.tableHeight - 1;
		}

		return (iMapY * this.tableWidth) + iMapX;
	}

	private readWorldHeight(iIndex: number): number;
	private readWorldHeight(iMapX: number, iMapY: number): number;
	private readWorldHeight(iMapX: any, iMapY?: number): number {
		if (arguments.length === 2) {
			var iFixedMapX: number = iMapX, iFixedMapY: number = iMapY;
			
		    if (iFixedMapX >= this.tableWidth) {
		        iFixedMapX = this.tableWidth - 1;
		    }
		    if (iFixedMapY >= this.tableHeight) {
		        iFixedMapY = this.tableHeight - 1;
		    }

		    return this.heightMapTable[(iFixedMapY * this.tableWidth) + iFixedMapX];
		}
		else {
		    var iMapIndex: number = iMapX;
		    return this.heightMapTable[iMapIndex];
		}
	}

	private computeVariance(pSection: ITerrainSectionInfo): void {
		var iTableWidth: number = this.tableWidth;
		var iTableHeight: number = this.tableHeight;

		var iIndex0: number = this.tableIndex(pSection.pixelX,						pSection.pixelY);
		var iIndex1: number = this.tableIndex(pSection.pixelX,						pSection.pixelY + this.sectorUnits);
		var iIndex2: number = this.tableIndex(pSection.pixelX + this.sectorUnits,	pSection.pixelY + this.sectorUnits);
		var iIndex3: number = this.tableIndex(pSection.pixelX + this.sectorUnits,	pSection.pixelY);

		var fHeight0: number = this.heightMapTable[iIndex0];
		var fHeight1: number = this.heightMapTable[iIndex1];
		var fHeight2: number = this.heightMapTable[iIndex2];
		var fHeight3: number = this.heightMapTable[iIndex3];

		this.recursiveComputeVariance(
			pSection.pixelX, 					pSection.pixelY + this.sectorUnits,
			pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits,
			pSection.pixelX,					pSection.pixelY,
			fHeight1, fHeight2, fHeight0,
			pSection.varianceTreeA, 1);

		this.recursiveComputeVariance(
			pSection.pixelX + this.sectorUnits, pSection.pixelY,
			pSection.pixelX,					pSection.pixelY,
			pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits,
			fHeight3, fHeight0, fHeight2,
			pSection.varianceTreeB, 1);
	}

	private recursiveComputeVariance(iCornerAX: number, iCornerAY: number,
											iCornerBX: number, iCornerBY: number,
											iCornerCX: number, iCornerCY: number,
											fHeightA: number, fHeightB: number, fHeightC: number, 
											pVTree: number[], iIndex: number): number {
		if (iIndex < pVTree.length) {

			var iMidpointX: number = (iCornerBX + iCornerCX) >> 1;
			var iMidpointY: number = (iCornerBY + iCornerCY) >> 1;

			if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) &&
				(iMidpointY === iCornerBY || iMidpointY === iCornerCY)){
				return 0;
			}

			var fMidHeight: number = this.readWorldHeight(iMidpointX, iMidpointY);
			var fInterpolatedHeight: number = (fHeightB + fHeightC)*0.5;
			var fVariance: number = Math.abs(fMidHeight - fInterpolatedHeight);

			// find the variance of our children
			var fLeft: number = this.recursiveComputeVariance(
				iMidpointX, iMidpointY,
				iCornerAX,  iCornerAY,
				iCornerBX,  iCornerBY,
				fMidHeight, fHeightA, fHeightB,
				pVTree, iIndex<<1);

			var fRight: number = this.recursiveComputeVariance(
				iMidpointX, iMidpointY,
				iCornerCX,  iCornerCY,
				iCornerAX,  iCornerAY,
				fMidHeight, fHeightC, fHeightA,
				pVTree, 1+(iIndex<<1));

			// local variance is the minimum of all three
			fVariance = Math.max(fVariance, fLeft);
			fVariance = Math.max(fVariance, fRight);

			// store the variance as 1/(variance+1)
			pVTree[iIndex] = fVariance;


			// this.drawVariance(iIndex,
			// 	this.terrainSystem._tableIndex(iCornerAX, iCornerAY),
			// 	this.terrainSystem._tableIndex(iCornerBX, iCornerBY), 
			// 	this.terrainSystem._tableIndex(iCornerCX, iCornerCY), pVTree);

			return fVariance;
		}
		// return a value which will be ignored by the parent
		// (because the minimum function is used with this result)

		return 0;
	}

	private tesselateSection(pSection: ITerrainSectionInfo): void {
		var iIndex0: number =  this.tableIndex(pSection.pixelX,						pSection.pixelY);
		var iIndex1: number =  this.tableIndex(pSection.pixelX,						pSection.pixelY + this.sectorUnits);
		var iIndex2: number =  this.tableIndex(pSection.pixelX + this.sectorUnits,	pSection.pixelY + this.sectorUnits);
		var iIndex3: number =  this.tableIndex(pSection.pixelX + this.sectorUnits,	pSection.pixelY);

		var fHeight0: number = this.readWorldHeight(iIndex0);
		var fHeight1: number = this.readWorldHeight(iIndex1);
		var fHeight2: number = this.readWorldHeight(iIndex2);
		var fHeight3: number = this.readWorldHeight(iIndex3);

		this.recursiveTessellate(
			pSection.rootTriangleA,
			pSection.pixelX, 					pSection.pixelY + this.sectorUnits, fHeight1,
			pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits, fHeight2,
			pSection.pixelX,					pSection.pixelY, 				  	fHeight0,
			pSection.varianceTreeA, 1);

		this.recursiveTessellate(
			pSection.rootTriangleA,
			pSection.pixelX + this.sectorUnits, pSection.pixelY,					fHeight3,
			pSection.pixelX,					pSection.pixelY,					fHeight0,
			pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits, fHeight2,
			pSection.varianceTreeB, 1);
	}

	private recursiveTessellate(pTri: ITriTreeNode,
								iCornerAX: number, iCornerAY: number, fCornerAZ: number,
								iCornerBX: number, iCornerBY: number, fCornerBZ: number,
								iCornerCX: number, iCornerCY: number, fCornerCZ: number,
								pVTree: number[], iIndex: number): void {
		if((iIndex<<1)+1 > this.sectorTotalVariances){
			return;
		}

		var iMidpointX: number = (iCornerBX + iCornerCX) >> 1;
		var iMidpointY: number = (iCornerBY + iCornerCY) >> 1;

		if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) &&
			(iMidpointY === iCornerBY || iMidpointY === iCornerCY)){
			return;
		}
		
		var fMidPointZ: number = (fCornerBZ + fCornerCZ)/2;
		var fRealMidPointZ: number = this.readWorldHeight(iMidpointX, iMidpointY);

		var pTerrainExtents: IRect3d = this.worldExtents;
		var iHeightMapWidth: number = this.tableWidth;
		var iHeightMapHeight: number = this.tableHeight;
		var fTerrainSizeZ: number = this.maxHeight;
		var fTerrainDiagonal: number = this.terrain2DLength;
		
		var fLocalMidX: number = pTerrainExtents.x0 + iMidpointX * (pTerrainExtents.x1 - pTerrainExtents.x0) / iHeightMapWidth;
		var fLocalMidY: number = pTerrainExtents.y0 + iMidpointY * (pTerrainExtents.y1 - pTerrainExtents.y0) / iHeightMapHeight;

		var fDistanceSquare: number = (this.cameraCoord[0] - fLocalMidX) * (this.cameraCoord[0] - fLocalMidX) +
									  (this.cameraCoord[1] - fLocalMidY) * (this.cameraCoord[1] - fLocalMidY) +
									  (this.cameraCoord[2] - fMidPointZ) * (this.cameraCoord[2] - fMidPointZ);

		// Если треугольник не поделен
		if (!pTri.leftChild) {
			var fScale: number = this.tessellationScale;
			var fLimit: number = this.tessellationLimit;

			var fDistance: number = Math.sqrt(fDistanceSquare+0.0001);
			var fRatio: number = 0.;
			
			fRatio = (pVTree[iIndex] / fTerrainSizeZ * fScale) /((/*1 +*/ fDistance/fTerrainDiagonal) * fLimit);

			if (fRatio > 1.) {
				// subdivide this triangle
				this.split(pTri);
			}
		}

		// Если треугольник поделен, продолжаем
		if (pTri.leftChild) {
			this.recursiveTessellate(pTri.leftChild,
				iMidpointX, iMidpointY, fRealMidPointZ,
				iCornerAX, iCornerAY, fCornerAZ,
				iCornerBX, iCornerBY, fCornerBZ,
				pVTree, iIndex<<1);

			this.recursiveTessellate(pTri.rightChild,
				iMidpointX, iMidpointY, fRealMidPointZ,
				iCornerCX, iCornerCY, fCornerCZ,
				iCornerAX, iCornerAY, fCornerAZ,
				pVTree, (iIndex<<1)+1);
		}
	}

	private split(pTri: ITriTreeNode): void {
		// Если разбит то смысла разбивать еще нет
		if (pTri.leftChild){
			return;
		}

		// If this triangle is not in a proper diamond, force split our base neighbor
		if (pTri.baseNeighbor && (pTri.baseNeighbor.baseNeighbor !== pTri)){
			this.split(pTri.baseNeighbor);
		}
		// Create children and link into mesh
		pTri.leftChild  = this.triNodePool.request();
		pTri.rightChild = this.triNodePool.request();

		// Если не удалось выделить треугольник, то не разбиваем
		if ( (!pTri.leftChild) || (!pTri.rightChild)) {
			pTri.leftChild  = null;
			pTri.rightChild = null;
			return;
		}

		// Fill in the information we can get from the parent (neighbor pointers)
		pTri.leftChild.baseNeighbor  = pTri.leftNeighbor;
		pTri.leftChild.leftNeighbor  = pTri.rightChild;

		pTri.rightChild.baseNeighbor  = pTri.rightNeighbor;
		pTri.rightChild.rightNeighbor = pTri.leftChild;

		// Link our Left Neighbor to the new children
		if (pTri.leftNeighbor) {
			if (pTri.leftNeighbor.baseNeighbor == pTri) {
				pTri.leftNeighbor.baseNeighbor = pTri.leftChild;
			} 
			else if (pTri.leftNeighbor.leftNeighbor == pTri) {
				pTri.leftNeighbor.leftNeighbor = pTri.leftChild;
			} 
			else if (pTri.leftNeighbor.rightNeighbor == pTri) {
				pTri.leftNeighbor.rightNeighbor = pTri.leftChild;
			}
		}

		// Link our Right Neighbor to the new children
		if (pTri.rightNeighbor) {
			if (pTri.rightNeighbor.baseNeighbor == pTri) {
				pTri.rightNeighbor.baseNeighbor = pTri.rightChild;
			} 
			else if (pTri.rightNeighbor.rightNeighbor == pTri) {
				pTri.rightNeighbor.rightNeighbor = pTri.rightChild;
			} 
			else if (pTri.rightNeighbor.leftNeighbor == pTri) {
				pTri.rightNeighbor.leftNeighbor = pTri.rightChild;
			}
		}

		// Link our Base Neighbor to the new children
		if (pTri.baseNeighbor) {
			if ( pTri.baseNeighbor.leftChild ) {
				pTri.baseNeighbor.leftChild.rightNeighbor = pTri.rightChild;
				pTri.baseNeighbor.rightChild.leftNeighbor = pTri.leftChild;
				pTri.leftChild.rightNeighbor = pTri.baseNeighbor.rightChild;
				pTri.rightChild.leftNeighbor = pTri.baseNeighbor.leftChild;
			} 
			else {
				// Base Neighbor (in a diamond with us) was not split yet, so do that now.
				this.split(pTri.baseNeighbor);  
			}
		} 
		else {
			// An edge triangle, trivial case.
			pTri.leftChild.rightNeighbor = null;
			pTri.rightChild.leftNeighbor = null;
		}
	}

	private buildTriangleList(pSection: ITerrainSectionInfo): void {
		var iSectorVerts: number = this.sectorUnits + 1;
		// add all the triangles to the roamTerrain
		// in root triangle A

		this.recursiveBuildTriangleList(pSection, pSection.rootTriangleA,
			0, iSectorVerts - 1, (iSectorVerts - 1) * iSectorVerts);

		// add all the triangles to the roamTerrain
		// in root triangle B
		this.recursiveBuildTriangleList(pSection, pSection.rootTriangleB,
			(iSectorVerts * iSectorVerts) - 1, (iSectorVerts - 1) * iSectorVerts, iSectorVerts - 1);
	}

	private recursiveBuildTriangleList(pSection: ITerrainSectionInfo, pTri: ITriTreeNode, 
									   iPointBase: number, iPointLeft: number, iPointRight: number): void {
		if (pTri.leftChild) {

			var iPointMid: number = (iPointLeft + iPointRight) * 0.5;
			this.recursiveBuildTriangleList(
				pSection,
				pTri.leftChild,
				iPointMid, iPointBase, iPointLeft);
			this.recursiveBuildTriangleList(
				pSection,
				pTri.rightChild,
				iPointMid, iPointRight, iPointBase);

		} 
		else {
			var nElementSize: number = 0;
			if(this.isUsedVertexNormal){
				nElementSize = (3/*кординаты вершин*/ + 3/*нормаль*/ + 2/*текстурные координаты*/);
			}
			else {
				nElementSize =  (3/*кординаты вершин*/ + 2/*текстурные координаты*/);
			}
			
			// add the local triangle to the index list

			this.tessellationIndices[this.totalIndices++] = ((iPointRight + pSection.startIndex) * nElementSize * 4 + this.vertexID)/4;
			this.tessellationIndices[this.totalIndices++] = ((iPointLeft  + pSection.startIndex) * nElementSize * 4 + this.vertexID)/4;
			this.tessellationIndices[this.totalIndices++] = ((iPointBase  + pSection.startIndex) * nElementSize * 4 + this.vertexID)/4;
		} 
	}
}






var pTerrain: ITerrainInfo = null;
function processInitTerrain(pInitInfo: ITerrainInitInfo): void {
	pTerrain = new TerrainInfo(pInitInfo);
	(<any>self).postMessage("ok");
}

/** 
 * format of pData. pData size in bytes = ( 4 * (pTerrain.maxTriTreeNodeCount * 3) + 4) 
 * 3 float32 - float camera coords
 * 1 uint32 - length of tessellation queue of terrainSection. Define as L.
 * L uint32 - index of sections to tesselate
 * @type {[type]}
 */
function processTesselate(pData: ArrayBuffer): void {
	var pDataView: DataView = new DataView(pData, 0, 16);
	var iTesselationQueueSize: number = pDataView.getUint32(12, true);
	
	pTerrain.cameraCoord = new Float32Array(pData, 0, 3);
	pTerrain.tessellationQueueSize = iTesselationQueueSize;
	pTerrain.tessellationQueue.set(new Uint32Array(pData, 4*4, iTesselationQueueSize));
	pTerrain.tessellationIndices = new Float32Array(pData, 4);

	pTerrain.processTessellationQueue();

	pDataView.setUint32(0, pTerrain.totalIndices, true);

	(<any>self).postMessage(pData, [pData]);
}


function processUpdateParams(pUpdateInfo: any): void{

}

