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

interface IRect3d{
	x0: number;
	y0: number;
	z0: number;

	x1: number;
	y1: number;
	z1: number;
}

interface ITerrainSectionInfo{

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

	sectors: ITerrainSectionInfo[];

	tesselationScale: number;
	tesselationLimit: number;

	cameraCoord: Float32Array;
	tesselationQueue: UInt32Array;
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

	// var pHeader: IHeader = readHeader(event.data);
	// var pData: Uint8Array = readData(event.data, pHeader);

	// switch(pHeader.command){
	// 	case ECommandTypes.HEIGHTMAP:
	// 		processUpdateHeightMap(pData);
	// 		break;
	// 	case ECommandTypes.TESSELATE:
	// 		processTesselate(pData);
	// 		break;
	// }
}

// var pTmpHeader: IHeader = {command: 0};
// readHeader(pData: ArrayBuffer): IHeader {
// 	pTmpHeader.command = (new Uint8Array(pData, 0, 1))[0];
// 	return pTmpHeader;
// }

// readData(pData: ArrayBuffer, pHeader: IHeader): Uint8Array {
// 	return new Uint8Array(pData, 1);
// }

var pTerrain: ITerrainInfo = null;
processInitTerrain(pInitInfo: ITerrainInitInfo): void {
	pTerrain = {
		heightMapTable: pInitInfo.heightMapTable;

		tableWidth: pInitInfo.tableWidth;
		tableHeight: pInitInfo.tableHeight;

		sectorUnits: pInitInfo.sectorUnits;
		sectorCountX: pInitInfo.sectorCountX;
		sectorCountY: pInitInfo.sectorCountY;

		worldExtets: pInitInfo.worldExtets;
		maxHeight: pInitInfo.maxHeight;
		terrain2DLength: 0;

		maxTriTreeNodeCount: pInitInfo.maxTriTreeNodeCount;

		sectors: null;

		tesselationScale: pInitInfo.tesselationScale;
		tesselationLimit: pInitInfo.tesselationLimit;

		cameraCoord: null;
		tesselationQueue: null;
	};


	pTerrain.terrain2DLength = Math.sqrt((worldExtets.x1 - worldExtets.x0) * (worldExtets.x1 - worldExtets.x0) +
										 (worldExtets.y1 - worldExtets.y0) * (worldExtets.y1 - worldExtets.y0));
	pTerrain.sectors = new Array(pTerrain.sectorCountX * sectorCountY);

	var iShift: number = (Math.log(pTerrain.sectorUnits)/Math.LN2) | 0;

	for(var y: number = 0; y < pTerrain.sectorCountY; y++) {
		for(var x: number = 0; x < pTerrain.sectorCountX; x++) {
			var iXPixel: number = x << iShift;
			var iYPixel: number = y << iShift;
			var iIndex: number = (y * pTerrain.sectorCountX) + x;

			// pTerrain.sectors[iIndex] = {
				
			// }

		}
	}

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
