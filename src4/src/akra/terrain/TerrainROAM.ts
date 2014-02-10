/// <reference path="../idl/ITerrainROAM.ts" />

/// <reference path="../scene/objects/Camera.ts" />

/// <reference path="../conv/conv.ts" />

/// <reference path="Terrain.ts" />
/// <reference path="TerrainSectionROAM.ts" />
/// <reference path="TriangleNodePool.ts" />

/*
#ifdef DEBUG

//copy threads from sources to {data} folder and modify path to relative

/// @TESSELLATION_THREAD: {data}/js/TessellationThread.t.js|src(inc/util/TessellationThread.t.js)|data_location({data},DATA)

#define TessellationThread() Worker("@TESSELLATION_THREAD")

#else

//read threads data and insert to code
/// @TESSELLATION_THREAD: |content(inc/util/TessellationThread.t.js)|minify()|stringify()

#define TessellationThread() Worker(util.dataToURL("@TESSELLATION_THREAD", "application/javascript"))

#endif
*/

module akra.terrain {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	import Mat4 = math.Mat4;

	import VE = data.VertexElement;

	export class TerrainROAM extends Terrain implements ITerrainROAM {
		private _pRenderableObject: IRenderableObject = null;
		private _pRenderData: IRenderData = null;
		private _pDataIndex: IVertexData = null;

		private _iTotalIndices: uint;
		private _iTotalIndicesOld: uint;
		private _iTotalIndicesMax: uint;
		private _pIndexList: Float32Array = null;
		private _pVerts: float[];
		private _iVertexID: uint;
		private _pTessellationQueue: ITerrainSectionROAM[] = null;
		private _iTessellationQueueCount: uint = 0;
		private _isRenderInThisFrame: boolean = false;
		private _iMaxTriTreeNodes: uint = (1024 * 64 * 4); /*64k triangle nodes*/
		private _iTessellationQueueSize: uint = 0;
		//массив подчиненный секций 
		protected _pSectorArray: ITerrainSectionROAM[] = null;

		protected _fScale: float = 0.0;
		protected _fLimit: float = 0.0;

		private _iTessellationQueueCountOld: int = 0;
		private _nCountRender: uint = 0;

		private _m4fLastCameraMatrix: IMat4 = new Mat4();
		private _m4fLastTessellationMatrix: IMat4 = new Mat4();
		private _v3fLocalCameraCoord: IVec3 = new Vec3();
		private _isNeedReset: boolean = true;

		private _fLastTessellationTime: float = 0.;
		private _fTessellationSelfInterval: float = 1. / 25.;
		private _fTessellationThreadInterval: float = 1. / 60.;

		private _bUseTessellationThread: boolean = false;
		private _bIsInitTessellationSelfData: boolean = false;
		private _bIsInitTessellationThreadData: boolean = false;

		private _pTessellationThread: Worker = null;
		private _pTessellationTransferableData: ArrayBuffer = null;
		private _pTmpTransferableArray: any[] = null;

		private _bIsReadyForTesseltion: boolean = false;

		private _pNodePool: ITriangleNodePool = null;

		// private _pTestTerrainInfo: util.TerrainInfo = null;

		private _fAvgTesselateCallsInSec: float = 0;
		private _iCurrentTesselateCount: uint = 0;
		private _nSec: uint = 0;
		private _fLastTimeStart: float = 0;

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.TERRAIN_ROAM) {
			super(pScene, eType);
			this._pRenderData = this._pDataFactory.getEmptyRenderData(EPrimitiveTypes.TRIANGLELIST, ERenderDataBufferOptions.RD_ADVANCED_INDEX);
			this._pRenderableObject = new render.RenderableObject();
			this._pRenderableObject._setup(this._pEngine.getRenderer());
			this._pRenderableObject._setRenderData(this._pRenderData);

			if (config.PROFILE_TESSEALLATION) {
				this._fAvgTesselateCallsInSec = 0;
				this._iCurrentTesselateCount = 0;
				this._nSec = 0;
				this._fLastTimeStart = 0;
			}

			this._pRenderableObject.beforeRender.connect(this, this._onBeforeRender/*, EEventTypes.UNICAST*/);
		}

		getMaxTriTreeNodes(): uint {
			return this._iMaxTriTreeNodes;
		}

		getVerts(): float[] {
			return this._pVerts;
		}

		getIndex(): Float32Array {
			return this._pIndexList;
		}

		getVertexId(): uint {
			return this._iVertexID;
		}

		getTotalRenderable(): uint {
			return !isNull(this._pRenderableObject) ? 1 : 0;
		}

		getRenderable(i?: uint): IRenderableObject {
			return this._pRenderableObject;
		}

		getLocalCameraCoord(): IVec3 {
			return this._v3fLocalCameraCoord;
		}

		getTessellationScale(): float {
			return this._fScale;
		}

		setTessellationScale(fScale: float): void {
			this._fScale = fScale;
		}

		getTessellationLimit(): float {
			return this._fLimit;
		}

		setTessellationLimit(fLimit: float): void {
			this._fLimit = fLimit;
		}

		getUseTessellationThread(): boolean {
			return this._bUseTessellationThread;
		}

		setUseTessellationThread(bUseThread: boolean): void {
			this._bUseTessellationThread = bUseThread;

			if (this._isCreate) {
				if (bUseThread && !this._bIsInitTessellationThreadData) {
					this.initTessellationThreadData();
				}
				else if (!bUseThread && !this._bIsInitTessellationSelfData) {
					this.initTessellationSelfData();
				}
			}

			if (config.PROFILE_TESSEALLATION) {
				this._fAvgTesselateCallsInSec = 0;
				this._iCurrentTesselateCount = 0;
				this._nSec = 0;
				this._fLastTimeStart = 0;
			}
		}

		getTotalIndex(): uint {
			return this._iTotalIndices;
		}

		setTotalIndex(iTotalIndices: uint): void {
			this._iTotalIndices = iTotalIndices;
		}


		init(pMaps: ITerrainMaps, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode: ISceneObject = null) {
			var bResult: boolean = super.init(pMaps, worldExtents, iShift, iShiftX, iShiftY, sSurfaceTextures, pRootNode);
			if (bResult) {
				this._iTessellationQueueSize = this.getSectorCountX() * this.getSectorCountY();
				this._pTessellationQueue = new Array<ITerrainSectionROAM>(this._iTessellationQueueSize);
				this._iTessellationQueueCount = 0;
				this._iTotalIndicesMax = 0;

				for (var i: uint = 0; i < this._pTessellationQueue.length; i++) {
					this._pTessellationQueue[i] = null;
				}

				this._pRenderableObject.getTechnique().setMethod(this._pDefaultRenderMethod);
				this._pRenderableObject.getTechnique().render.connect(this, this._onRender);

				if (!this._bUseTessellationThread) {
					this._pNodePool = new TriangleNodePool(this._iMaxTriTreeNodes);
				}

				this._setTessellationParameters(10.0, 0.5);
				this.reset();


				if (this._bUseTessellationThread) {
					this.initTessellationThreadData();
				}
				else {
					this._bIsInitTessellationSelfData = true;
					this._bIsReadyForTesseltion = true;
				}
	
				this._isCreate = true;
			}
			else {
				this._isCreate = false;
			}

			return bResult;
		}

		destroy(): void {
			delete this._pNodePool;
			delete this._pTessellationQueue;

			this._iTessellationQueueCount = 0;
			this._fScale = 0;
			this._fLimit = 0;
			//Terrain.prototype.destroy.call(this); с какого то хуя этого метода не оказалось
		}

		protected initTessellationSelfData(): void {
			this._bIsReadyForTesseltion = true;

			if (this._bIsInitTessellationSelfData) {
				return;
			}

			this._pNodePool = new TriangleNodePool(this._iMaxTriTreeNodes);
			for (var i: uint = 0; i < this._pSectorArray.length; i++) {
				this._pSectorArray[i]._initTessellationData();
			}

			this._bIsInitTessellationSelfData = true;
		}

		protected initTessellationThreadData(): void {
			this._bIsReadyForTesseltion = false;

			if (this._bIsInitTessellationThreadData) {
				return;
			}

			var me: TerrainROAM = this;
			var pThread: Worker = this._pTessellationThread = new Worker(config.terrain.roam.tessellationThread);

			pThread.onmessage = function (event: any) {
				if (event.data === "ok") {
					me.successThreadInit();
				}
				else {
					logger.warn("Cannot inititalize tessellation thread. So we will tessellate terraint in main thread.");
					me.setUseTessellationThread(false);
					me.terminateTessellationThread();
				}
			};

			pThread.onerror = function (event: any) {
				logger.warn("Error occured in tessellation thread. So we will tessellate terraint in main thread.");
				debug.log(event);
				pThread.onmessage = null;
				me.setUseTessellationThread(false);
				me.terminateTessellationThread();
			};

			this._bIsInitTessellationThreadData = true;

			var pHeightTableCopy: Float32Array = new Float32Array(this._pHeightTable.length);
			pHeightTableCopy.set(this._pHeightTable);

			pThread.postMessage({
				type: 1,
				info: {
					heightMapTable: pHeightTableCopy.buffer,
					tableWidth: this.getTableWidth(),
					tableHeight: this.getTableHeight(),
					sectorUnits: this._iSectorUnits,
					sectorCountX: this._iSectorCountX,
					sectorCountY: this._iSectorCountY,
					isUsedVertexNormal: this._bUseVertexNormal,
					worldExtents: {
						x0: this._pWorldExtents.x0,
						x1: this._pWorldExtents.x1,
						y0: this._pWorldExtents.y0,
						y1: this._pWorldExtents.y1,
						z0: this._pWorldExtents.z0,
						z1: this._pWorldExtents.z1
					},
					maxHeight: this.getMaxHeight(),
					maxTriTreeNodeCount: this._iMaxTriTreeNodes,

					tessellationScale: this._fScale,
					tessellationLimit: this._fLimit,

					vertexID: this._iVertexID
				}
			}, [pHeightTableCopy.buffer]);

		}

		protected terminateTessellationThread(): void {
			this._pTessellationThread.terminate();
			this._bIsInitTessellationThreadData = false;
		}

		successThreadInit(): void {
			var me: TerrainROAM = this;
			this._pTessellationTransferableData = new ArrayBuffer(4 * this._iMaxTriTreeNodes * 3 + 4);
			this._pTmpTransferableArray = [null];
			this._bIsReadyForTesseltion = true;

			this._pTessellationThread.onmessage = function (event: any) {
				me.prepareIndexData(<ArrayBuffer>event.data);
			};
		}

		protected _allocateSectors(): boolean {
			var nElementSize: uint = 0;
			if (this._useVertexNormal()) {
				nElementSize = (3/*кординаты вершин*/ + 3/*нормаль*/ + 2/*текстурные координаты*/);
			}
			else {
				nElementSize = (3/*кординаты вершин*/ + 2/*текстурные координаты*/);
			}

			this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

			//Вершинный буфер для всех
			this._pVerts = new Array((this._iSectorCountX * this._iSectorCountY/*количество секции*/) *
				(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/) *
				(nElementSize));

			for (var i: uint = 0; i < this._pSectorArray.length; i++) {
				this._pSectorArray[i] = this.getScene().createTerrainSectionROAM();
			}

			// create the sector objects themselves
			for (var y: uint = 0; y < this._iSectorCountY; ++y) {
				for (var x: uint = 0; x < this._iSectorCountX; ++x) {
					//cVector2 sectorPos(
					var v2fSectorPos: IVec2 = new Vec2();
					v2fSectorPos.set(
						this._pWorldExtents.x0 + (x * this._v2fSectorSize.x),
						this._pWorldExtents.y0 + (y * this._v2fSectorSize.y));

					//cRect2d r2fSectorRect(
					var r2fSectorRect: IRect2d = new geometry.Rect2d();
					r2fSectorRect.set(
						v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x,
						v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

					var iXPixel: uint = x << this._iSectorShift;
					var iYPixel: uint = y << this._iSectorShift;
					var iIndex: uint = (y * this._iSectorCountX) + x;

					if (!this._pSectorArray[iIndex]._internalCreate(
						this,				/*Терраин*/
						x, y,				/*Номер секции оп иксу и игрику*/
						iXPixel, iYPixel,   /*Координаты секции в картах нормалей и врешин*/
						this._iSectorVerts, /*Количесвто вершин в секции по иску и игрику*/
						this._iSectorVerts,
						r2fSectorRect,
						iIndex * (this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/))) {
						return false;
					}
				}
			}

			var pVertexDescription: IVertexElementInterface[] = null;
			if (this._useVertexNormal()) {
				pVertexDescription = [VE.float3(data.Usages.POSITION), VE.float3(data.Usages.NORMAL), VE.float2(data.Usages.TEXCOORD)];
			}
			else {
				pVertexDescription = [VE.float3(data.Usages.POSITION), VE.float2(data.Usages.TEXCOORD)];
			}

			this._iVertexID = this._pRenderData.allocateData(pVertexDescription, new Float32Array(this._pVerts));


			//Индексны буфер для всех
			this._iTotalIndices = 0;
			//Максимальное количество треугольников помноженное на 3 вершины на каждый треугольник
			this._pIndexList = new Float32Array(this._iMaxTriTreeNodes * 3);
			this._pRenderData.allocateIndex([VE.float(data.Usages.INDEX0), VE.float(data.Usages.POSITION, 0)], this._pIndexList);
			this._pRenderData.index(this._iVertexID, data.Usages.INDEX0);
			this._pDataIndex = this._pRenderData.getAdvancedIndexData(data.Usages.INDEX0);

			return true;
		}

		reset(): void {
			this._isRenderInThisFrame = false;

			if (this._isCreate) {
				super.reset();
				// reset internal counters
				for (var i: uint = 0; i < this._iTessellationQueueCount; i++) {
					this._pTessellationQueue[i] = null;
				}

				this._iTessellationQueueCount = 0;
				// this._pTessellationQueue.length = this._iTessellationQueueSize;

				if (!this._bUseTessellationThread && this._bIsInitTessellationSelfData) {
					this._pNodePool.reset();

					// reset each section
					for (var i: uint = 0; i < this._pSectorArray.length; i++) {
						this._pSectorArray[i].reset();
					}
				}
			}
		}

		resetWithCamera(pCamera: ICamera): boolean {
			if (this._bIsReadyForTesseltion && !this._isOldCamera(pCamera)) {
				if (this._isNeedReset) {

					this.reset();
					this._isNeedReset = false;

					var v4fCameraCoord: IVec4 = Vec4.temp(pCamera.getWorldPosition(), 1.);

					v4fCameraCoord = this.getInverseWorldMatrix().multiplyVec4(v4fCameraCoord);

					this._v3fLocalCameraCoord.set(v4fCameraCoord.x, v4fCameraCoord.y, v4fCameraCoord.z);

					// return true;
				}

				return true;
				// return false;
			}
			else {
				// return true;
				return false;
			}
		}

		requestTriNode(): ITriTreeNode {
			return this._pNodePool.request();
		}

		addToTessellationQueue(pSection: ITerrainSectionROAM): boolean {
			if (this._iTessellationQueueCount < this._iTessellationQueueSize) {
				this._pTessellationQueue[this._iTessellationQueueCount] = pSection;
				this._iTessellationQueueCount++;
				return true;
			}

			// while we handle this failure gracefully
			// in release builds, we alert ourselves
			// to the situation with an assert in debug
			// builds so we can increase the queue size
			logger.warn("increase the size of the ROAM tessellation queue");
			return false;
		}

		protected processTessellationQueue(): void {
			// this._pTessellationQueue.length = this._iTessellationQueueCount;
			this._pTessellationQueue.sort(TerrainROAM.fnSortSection);

			if (this._bUseTessellationThread) {
				var pDataView: DataView = new DataView(this._pTessellationTransferableData);

				pDataView.setFloat32(0, this._v3fLocalCameraCoord.x, true);
				pDataView.setFloat32(4, this._v3fLocalCameraCoord.y, true);
				pDataView.setFloat32(8, this._v3fLocalCameraCoord.z, true);

				pDataView.setUint32(12, this._iTessellationQueueCount, true);

				// var pSectionIndices: Uint32Array = new Uint32Array(this._pTessellationTransferableData, 16);
				for (var i: uint = 0; i < this._iTessellationQueueCount; ++i) {
					pDataView.setUint32(16 + i * 4, this._pTessellationQueue[i].getSectionIndex(), true);
					// pSectionIndices[i] = this._pTessellationQueue[i].sectionIndex;
				}

				this._pTmpTransferableArray[0] = this._pTessellationTransferableData;
				this._pTessellationThread.postMessage(this._pTessellationTransferableData, this._pTmpTransferableArray);
				this._bIsReadyForTesseltion = false;
			}
			else {
				for (var i: uint = 0; i < this._iTessellationQueueCount; ++i) {
					// split triangles based on the
					// scale and limit values
					this._pTessellationQueue[i].tessellate(
						this._fScale, this._fLimit);
				}

				this._iTotalIndices = 0;

				// gather up all the triangles into
				// a final index buffer per section

				for (var i: uint = 0; i < this._iTessellationQueueCount; ++i) {
					this._pTessellationQueue[i].buildTriangleList();
				}

				if (this._iTotalIndicesOld === this._iTotalIndices && this._iTotalIndices !== this._iTotalIndicesMax) {
					return;
				}


				this._pRenderData._setIndexLength(this._iTotalIndices);
				this._pDataIndex.setData(this._pIndexList, 0, sizeof(EDataTypes.FLOAT), 0, this._iTotalIndices);
				this._iTotalIndicesOld = this._iTotalIndices;
				this._iTotalIndicesMax = math.max(this._iTotalIndicesMax, this._iTotalIndices);

				this._pRenderableObject._setRenderData(this._pRenderData);
			}
		}

		protected prepareIndexData(pData: ArrayBuffer): void {
			var iTotalIndices: uint = (new Uint32Array(pData, 0, 1))[0];
			var pTmpData: Float32Array = new Float32Array(pData, 4, iTotalIndices);

			this._iTotalIndices = iTotalIndices;
			this._pIndexList.set(pTmpData);

			this._pRenderData._setIndexLength(this._iTotalIndices);
			this._pDataIndex.setData(this._pIndexList, 0, sizeof(EDataTypes.FLOAT), 0, this._iTotalIndices);

			this._pRenderableObject._setRenderData(this._pRenderData);

			this._pTessellationTransferableData = pData;

			this._bIsReadyForTesseltion = true;
		}


		protected _setTessellationParameters(fScale: float, fLimit: float): void {
			this._fScale = fScale;
			this._fLimit = fLimit;
		}

		_isOldCamera(pCamera: ICamera): boolean {
			return this._m4fLastCameraMatrix.isEqual(pCamera.getWorldMatrix());
		}

		_onBeforeRender(pRenderableObject: IRenderableObject, pViewport: IViewport): void {
			if (this._bIsReadyForTesseltion) {

				var pCamera: ICamera = pViewport.getCamera();
				var fCurrentTime: float = this.getScene().getManager().getEngine().getTime();

				this._m4fLastCameraMatrix.set(pCamera.getWorldMatrix());

				if ((this._bUseTessellationThread &&
					fCurrentTime - this._fLastTessellationTime > this._fTessellationThreadInterval) ||
					fCurrentTime - this._fLastTessellationTime > this._fTessellationSelfInterval) {

					if (config.PROFILE_TESSEALLATION) {
						if (this._fLastTimeStart === 0) {
							this._fLastTimeStart = fCurrentTime;
							this._iCurrentTesselateCount++;
							this._nSec = 1;
							this._fAvgTesselateCallsInSec = 0;
						}
						else if (this._fLastTimeStart + 1 > fCurrentTime) {
							this._iCurrentTesselateCount++;
						}
						else {
							this._fAvgTesselateCallsInSec = this._fAvgTesselateCallsInSec * (this._nSec - 1) / this._nSec + this._iCurrentTesselateCount / this._nSec;


							if (this._nSec % 3 === 0) {
								logger.log("Avg:", this._fAvgTesselateCallsInSec.toFixed(2), "Last:", this._iCurrentTesselateCount);
							}

							this._nSec++;
							this._fLastTimeStart = fCurrentTime;
							this._iCurrentTesselateCount = 0;
						}
					}

					if (!this._m4fLastCameraMatrix.isEqual(this._m4fLastTessellationMatrix)) {
						this.processTessellationQueue();
						this._m4fLastTessellationMatrix.set(this._m4fLastCameraMatrix);
						//this._iTessellationQueueCountOld = this._iTessellationQueueCount;
					}

					this._fLastTessellationTime = fCurrentTime;
				}
			}

			this._isNeedReset = true;
		}

		private static fnSortSection(pSectionA: ITerrainSectionROAM, pSectionB: ITerrainSectionROAM): uint {
			if (isNull(pSectionA)) {
				return 1;
			}
			else if (isNull(pSectionB)) {
				return -1;
			}
			else {
				return pSectionA.getQueueSortValue() - pSectionB.getQueueSortValue();
			}
		}
	}
}