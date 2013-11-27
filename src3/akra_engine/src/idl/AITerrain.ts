// AITerrain interface
// [write description here...]

/// <reference path="AIMegaTexture.ts" />
/// <reference path="AITerrainSection.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AIViewport.ts" />
/// <reference path="AISceneNode.ts" />

interface AIImageMap {
	[index: string]: AIImg;
}

interface AITerrainSampleData {
	iColor: uint;
	fScale: float;
}

interface AITerrain extends AISceneObject {
	/** readonly */ worldExtents: AIRect3d;
	/** readonly */ worldSize: AIVec3;
	/** readonly */ mapScale: AIVec3;
	/** readonly */ sectorCountX: uint;
	/** readonly */ sectorCountY: uint;
	/** readonly */ sectorSize: AIVec2;
	/** readonly */ tableWidth: uint;
	/** readonly */ tableHeight: uint;
	/** readonly */ sectorShift: uint;
	/** readonly */ dataFactory: AIRenderDataCollection;
	
	/** readonly */ maxHeight: float;
	/** readonly */ terrain2DLength: float;
	/** readonly */ megaTexture: AIMegaTexture;

	manualMegaTextureInit: boolean;
	showMegaTexture: boolean;
	
	isCreate(): boolean;

	/**
	 * Создаем terrain
	 * @param {AISceneNode} pRootNode Узел на сцене к которому цепляется terrain.
	 * @param {AIImageMap} pMap набор карт для terrain.
	 * @param {AIRect3d} worldExtents Размеры terrain в мире.
	 * @param {uint} iShift Количество векторов в секторе (указывается в степенях двойки).
	 * @param {uint} iShiftX Количество секторов в terrain по оси X (указывается в степенях двойки).
	 * @param {uint} iShiftY Количество секторов в terrain по оси Y (указывается в степенях двойки).
	 * @param {string} sSurfaceTextures Название мега текстуры.
	 */
	init(pMap: AIImageMap, worldExtents: AIRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode?: AISceneNode): boolean;
	initMegaTexture(sSurfaceTextures?: string): void;
	/**
	 * Ищет секцию по координате
	 */
	findSection(iX: uint, iY: uint);
	/**
	 * Возвращает высоту terrain в заданной точке.
	 */
	readWorldHeight(iIndex: uint): float;
	readWorldHeight(iMapX: uint, iMapY: uint): float;

	readWorldNormal(v3fNormal: AIVec3, iMapX: uint, iMapY: uint): AIVec3;

	projectPoint(v3fCoord: AIVec3, v3fDestenation: AIVec3): boolean;
	/**
	 * Destructor
	 */
	destroy(): void;
	/**
	 * Сброс параметров.
	 */
	reset(): void;

	_tableIndex(iMapX: uint, iMapY: uint): uint;
	_useVertexNormal(): boolean;
}
