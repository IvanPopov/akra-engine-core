#ifndef ITERRAIN_TS
#define ITERRAIN_TS

module akra {
	IFACE(ITerrainSection);
	IFACE(ISceneObject);
	IFACE(IRect3d);
	export interface IImageMap{
		[index: string]: IImg;
	}

	export interface ITerrainSampleData {
		iColor: uint;
		fScale: float;
	}

	export interface ITerrain {
		scale: float;
		limit: float;
		readonly worldExtents: IRect3d;
		readonly worldSize: IVec3;
		readonly mapScale: IVec3;
		readonly sectorCountX: uint;
		readonly sectorCountY: uint;
		readonly sectorSize: IVec2;
		readonly tableWidth: uint;
		readonly tableHeight: uint;
		readonly sectorShift: uint;
		readonly dataFactory: IRenderDataCollection;

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
		create(pRootNode: ISceneObject, pMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string): bool;
		/**
		 * Ищет секцию по координате
		 */
		findSection(iX: uint, iY: uint);
		/**
		 * Возвращает высоту terrain в заданной точке.
		 */
		readWorldHeight(iIndex: uint): float;
		readWorldHeight(iMapX: uint, iMapY: uint): float;
		/**
		 * Возвращает нормаль terrain в заданной точке.
		 */
		readWorldNormal(v3fNormal: IVec3, iMapX: uint, iMapY: uint): IVec3;
		/**
		 * Возвращает высоту terrain в заданной точке мира.
		 */
		calcWorldHeight(fWorldX: float, fWorldY: float): float;
		/**
		 * Возвращает нормаль terrain в заданной точке мира.
		 */
		calcWorldNormal(v3fNormal: IVec3, fWorldX: float, fWorldY: float): IVec3;
		/**
		 * Подготовка терраина к рендерингу.
		 */
		prepareForRender(): void;
		/**
		 * Применение параметров рендеринга для рендеринга текстуры.
		 */
		applyForRender(): void;
		/**
		 * Сброс параметров.
		 */
		reset(): void;
		/**
		 * Обработка пользовательского ввода.
		 */
		readUserInput(): void;

		_tableIndex(iMapX: uint, iMapY: uint): uint;
	}
}

#endif



