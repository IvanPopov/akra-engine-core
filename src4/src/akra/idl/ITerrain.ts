
/// <reference path="IMegaTexture.ts" />
/// <reference path="ITerrainSection.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="IViewport.ts" />
/// <reference path="ISceneNode.ts" />

module akra {
	interface IImageMap {
		[index: string]: IImg;
	}
	
	interface ITerrainSampleData {
		iColor: uint;
		fScale: float;
	}
	
	interface ITerrain extends ISceneObject {
		/** readonly */ worldExtents: IRect3d;
		/** readonly */ worldSize: IVec3;
		/** readonly */ mapScale: IVec3;
		/** readonly */ sectorCountX: uint;
		/** readonly */ sectorCountY: uint;
		/** readonly */ sectorSize: IVec2;
		/** readonly */ tableWidth: uint;
		/** readonly */ tableHeight: uint;
		/** readonly */ sectorShift: uint;
		/** readonly */ dataFactory: IRenderDataCollection;
		
		/** readonly */ maxHeight: float;
		/** readonly */ terrain2DLength: float;
		/** readonly */ megaTexture: IMegaTexture;
	
		manualMegaTextureInit: boolean;
		showMegaTexture: boolean;
		
		isCreate(): boolean;
	
		/**
		 * Создаем terrain
		 * @param {ISceneNode} pRootNode Узел на сцене к которому цепляется terrain.
		 * @param {IImageMap} pMap набор карт для terrain.
		 * @param {IRect3d} worldExtents Размеры terrain в мире.
		 * @param {uint} iShift Количество векторов в секторе (указывается в степенях двойки).
		 * @param {uint} iShiftX Количество секторов в terrain по оси X (указывается в степенях двойки).
		 * @param {uint} iShiftY Количество секторов в terrain по оси Y (указывается в степенях двойки).
		 * @param {string} sSurfaceTextures Название мега текстуры.
		 */
		init(pMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode?: ISceneNode): boolean;
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
	
		readWorldNormal(v3fNormal: IVec3, iMapX: uint, iMapY: uint): IVec3;
	
		projectPoint(v3fCoord: IVec3, v3fDestenation: IVec3): boolean;
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
	
}
