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

onmessage = function(event: any){
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
	tableWidth: number;
	sectorUnits: number;
	sectorCountX: number;
	sectorCountY: number;
	worldExtets: IRect3d;
	maxHeight: number;
	maxTriTreeNodeCount: number;

	tesselationScale: number;
	tesselationLimit: number;
}

interface ITerrainInfo{
	heightMapTable: Float32Array;

	tableWidth: number;
	tableHeight: number;

	sectorUnits: number;
	sectorCountX: number;
	sectorCountY: number;

	worldExtets: IRect3d;
	maxHeight: number;
	terrain2DLength: number;

	maxTriTreeNodeCount: number;

	sections: ITerrainSectionInfo[];

	tesselationScale: number;
	tesselationLimit: number;

	cameraCoord: Float32Array;
	tesselationQueue: UInt32Array;
}

createTriTreeNode(): ITriTreeNode {
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

		for(var i: uint = 0; i < this._iMaxCount; i++){
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




var pTerrain: ITerrainInfo = null;
processInitTerrain(pInitInfo: ITerrainInitInfo): void {
	pTerrain = {
		heightMapTable: pInitInfo.heightMapTable,

		tableWidth: pInitInfo.tableWidth,
		tableHeight: pInitInfo.tableHeight,

		sectorUnits: pInitInfo.sectorUnits,
		sectorTotalDetailLevels: 0,
		sectorTotalVariances: 0,
		sectorCountX: pInitInfo.sectorCountX,
		sectorCountY: pInitInfo.sectorCountY,

		worldExtets: pInitInfo.worldExtets,
		maxHeight: pInitInfo.maxHeight,
		terrain2DLength: 0,

		maxTriTreeNodeCount: pInitInfo.maxTriTreeNodeCount,
		triNodePool: new TriangleNodePool(pInitInfo.maxTriTreeNodeCount),

		sections: null,

		tesselationScale: pInitInfo.tesselationScale,
		tesselationLimit: pInitInfo.tesselationLimit,

		cameraCoord: null,
		tesselationQueue: null
	};

	pTerrain.sectorTotalDetailLevels = 2 * (Math.round(Math.log(pTerrain.sectorUnits)/Math.LN2));
	pTerrain.sectorTotalVariances = 1 << pTerrain.sectorTotalDetailLevels;
	pTerrain.terrain2DLength = Math.sqrt((worldExtets.x1 - worldExtets.x0) * (worldExtets.x1 - worldExtets.x0) +
										 (worldExtets.y1 - worldExtets.y0) * (worldExtets.y1 - worldExtets.y0));
	pTerrain.sections = new Array(pTerrain.sectorCountX * sectorCountY);

	var iShift: number = (Math.log(pTerrain.sectorUnits)/Math.LN2) | 0;
	var iSectorVerts: number = pTerrain.sectorUnits + 1;

	for(var y: number = 0; y < pTerrain.sectorCountY; y++) {
		for(var x: number = 0; x < pTerrain.sectorCountX; x++) {
			var iXPixel: number = x << iShift;
			var iYPixel: number = y << iShift;
			var iIndex: number = (y * pTerrain.sectorCountX) + x;

			pTerrain.sections[iIndex] = <ITerrainSectionInfo>{
				x: x,
				y: y,
				pixelX: iXPixel,
				pixelY: iYPixel,
				
				varianceTreeA: new Array(pTerrain.sectorTotalVariances),
				varianceTreeB: new Array(pTerrain.sectorTotalVariances),

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
	for(var y: number = 0; y < pTerrain.sectorCountY; y++) {
		for(var x: number = 0; x < pTerrain.sectorCountX; x++) {
			var pSection: ITerrainSectionInfo = pTerrain.findSection(x, y);
			var pNorthSection: ITerrainSectionInfo = pTerrain.findSection(x, y - 1);
			var pSouthSection: ITerrainSectionInfo = pTerrain.findSection(x, y + 1);
			var pEastSection: ITerrainSectionInfo  = pTerrain.findSection(x + 1, y);
			var pWestSection: ITerrainSectionInfo  = pTerrain.findSection(x - 1, y);

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

			reset(pSection);
		}
	}

	computeVariance(pSection);
}

findTerrainScetion(iX: number, iY: number): ITerrainSectionInfo {
	var pSection: ITerrainSectionInfo = null;

	if (iX >= 0 && iX < pTerrain.sectorCountX
	    && iY >= 0 && iY < pTerrain.sectorCountY) {
	    pSection = pTerrain.sections[(iY * pTerrain.sectorCountX) + iX];
	}

	return pSection;
}

resetSection(pSection: ITerrainSectionInfo): void {
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

tableIndex(iMapX: number, iMapY: number): number {
	// clamp to the table dimensions
	if (iMapX >= pTerrain.tableWidth) {
	    iMapX = pTerrain.tableWidth - 1;
	}
	
	if (iMapY >= pTerrain.tableHeight) {
	    iMapY = pTerrain.tableHeight - 1;
	}

	return (iMapY * pTerrain.tableWidth) + iMapX;
}

readWorldHeight(iIndex: number): number;
readWorldHeight(iMapX: number, iMapY: number): number;
readWorldHeight(iMapX: any, iMapY?: number): number {
	if (arguments.length === 2) {
		var iFixedMapX: number = iMapX, iFixedMapY: number = iMapY;
		
	    if (iFixedMapX >= pTerrain.tableWidth) {
	        iFixedMapX = pTerrain.tableWidth - 1;
	    }
	    if (iFixedMapY >= pTerrain.tableHeight) {
	        iFixedMapY = pTerrain.tableHeight - 1;
	    }

	    return pTerrain.heightTable[(iFixedMapY * pTerrain.tableWidth) + iFixedMapX];
	}
	else {
	    var iMapIndex: number = iMapX;
	    return pTerrain.heightTable[iMapIndex];
	}
}

computeVariance(pSection: ITerrainSectionInfo): void {
	var iTableWidth: number = pTerrain.tableWidth;
	var iTableHeight: number = pTerrain.tableHeight;

	var iIndex0: number =  tableIndex(pSection.pixelX,							pSection.pixelY);
	var iIndex1: number =  tableIndex(pSection.pixelX,							pSection.pixelY + pTerrain.sectorUnits);
	var iIndex2: number =  tableIndex(pSection.pixelX + pTerrain.sectorUnits,	pSection.pixelY + pTerrain.sectorUnits);
	var iIndex3: number =  tableIndex(pSection.pixelX + pTerrain.sectorUnits,	pSection.pixelY);

	var fHeight0: number = pTerrain.heightMapTable[iIndex0];
	var fHeight1: number = pTerrain.heightMapTable[iIndex1];
	var fHeight2: number = pTerrain.heightMapTable[iIndex2];
	var fHeight3: number = pTerrain.heightMapTable[iIndex3];

	recursiveComputeVariance(
		pSection.pixelX, 					 	pSection.pixelY + pTerrain.sectorUnits,
		pSection.pixelX + pTerrain.sectorUnits, pSection.pixelY + pTerrain.sectorUnits,
		pSection.pixelX,					 	pSection.pixelY,
		fHeight1, fHeight2, fHeight0,
		pSection.varianceTreeA, 1);

	recursiveComputeVariance(
		pSection.pixelX + pTerrain.sectorUnits, pSection.pixelY,
		pSection.pixelX,					 	pSection.pixelY,
		pSection.pixelX + pTerrain.sectorUnits, pSection.pixelY + pTerrain.sectorUnits,
		fHeight3, fHeight0, fHeight2,
		pSection.varianceTreeB, 1);
}

recursiveComputeVariance(iCornerAX: number, iCornerAY: number,
						 iCornerBX: number, iCornerBY: number,
						 iCornerCX: number, iCornerCY: number,
						 fHeightA: number, fHeightB: number, fHeightC: number, pVTree: number[], iIndex: number): number {
	if (iIndex < pVTree.length) {

		var iMidpointX: number = (iCornerBX + iCornerCX) >> 1;
		var iMidpointY: number = (iCornerBY + iCornerCY) >> 1;

		if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) &&
			(iMidpointY === iCornerBY || iMidpointY === iCornerCY)){
			return 0;
		}

		var fMidHeight: number = readWorldHeight(iMidpointX, iMidpointY);
		var fInterpolatedHeight: number = (fHeightB + fHeightC)*0.5;
		var fVariance: number = Math.abs(fMidHeight - fInterpolatedHeight);

		// find the variance of our children
		var fLeft: number = recursiveComputeVariance(
			iMidpointX, iMidpointY,
			iCornerAX,  iCornerAY,
			iCornerBX,  iCornerBY,
			fMidHeight, fHeightA, fHeightB,
			pVTree, iIndex<<1);

		var fRight: number = recursiveComputeVariance(
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


processUpdateParams(pUpdateInfo: any): void{

}

var v3fCameraCoord: Float32Array = new Float32Array(3);
var pTesselationQueue: UInt32Array = null;
var pHeightTable: Float32Array = null;



processUpdateHeightMap(pData: Uint8Array): void {
	pHeightTable = new Float32Array(pData.buffer, pData.byteOffset);
	postMessage({command: ECommandTypes.HEIGHTMAP, status: 1});
}



processTesselate(pData: Uint8Array): void {

}
