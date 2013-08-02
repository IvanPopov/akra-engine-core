#ifndef TERRAINROAM_TS
#define TERRAINROAM_TS

#include "ITerrainROAM.ts"
#include "terrain/Terrain.ts"
#include "terrain/TerrainSectionROAM.ts"
#include "terrain/TriTreeNode.ts"
#include "scene/objects/Camera.ts"

// #include "util/TessellationThread.ts"

/// @TESSELLATION_THREAD: {data}/js/TessellationThread.t.js|src(inc/util/TessellationThread.t.js)|data_location({data},DATA)

module akra.terrain {
	export class TerrainROAM implements ITerrainROAM extends Terrain {
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
		private _isRenderInThisFrame: bool = false;
		private _iMaxTriTreeNodes: uint = (1024*64*4); /*64k triangle nodes*/
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
		private _isNeedReset: bool = true;

		private _fLastTessellationTime: float = 0.;
		private _fTessellationSelfInterval: float = 1./25.;
		private _fTessellationThreadInterval: float = 1./60.;

		private _bUseTessellationThread: bool = false;
		private _bIsInitTessellationSelfData: bool = false;
		private _bIsInitTessellationThreadData: bool = false;

		private _pTessellationThread: Worker = null;
		private _pTessellationTransferableData: ArrayBuffer = null;
		private _pTmpTransferableArray: any[] = null;

		private _bIsReadyForTesseltion: bool = false;

		private _pNodePool: ITriangleNodePool = null;

		// private _pTestTerrainInfo: util.TerrainInfo = null;


		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.TERRAIN_ROAM) {
			super(pScene, eType);
			this._pRenderData = this._pDataFactory.getEmptyRenderData(EPrimitiveTypes.TRIANGLELIST,ERenderDataBufferOptions.RD_ADVANCED_INDEX);
			this._pRenderableObject = new render.RenderableObject();
			this._pRenderableObject._setup(this._pEngine.getRenderer());
			this._pRenderableObject._setRenderData(this._pRenderData);

			this.connect(this._pRenderableObject, SIGNAL(beforeRender), SLOT(_onBeforeRender), EEventTypes.UNICAST);
		}

		inline get tessellationScale(): float{
			return this._fScale;
		};

		inline set tessellationScale(fScale: float){
			this._fScale = fScale;
		};

		inline get tessellationLimit(): float{
			return this._fLimit;
		};

		inline set tessellationLimit(fLimit: float){
			this._fLimit = fLimit;
		};

		inline get useTessellationThread(): bool {
			return this._bUseTessellationThread;
		}

		inline set useTessellationThread(bUseThread: bool) {
			this._bUseTessellationThread = bUseThread;

			if(this._isCreate){
				if(bUseThread && !this._bIsInitTessellationThreadData){
					this.initTessellationThreadData();
				}
				else if(!bUseThread && !this._bIsInitTessellationSelfData){
					this.initTessellationSelfData();
				}
			}

			this._fAvgTesselateCallsInSec = 0;
			this._iCurrentTesselateCount = 0;
			this._nSec = 0;
			this._fLastTimeStart = 0;

		}

		inline get maxTriTreeNodes(): uint {
			return this._iMaxTriTreeNodes;
		}

		inline get verts(): float[] {
			return this._pVerts;
		}

		inline get index(): Float32Array {
			return this._pIndexList;
		}

		inline get totalIndex(): uint {
			return this._iTotalIndices;
		}

		inline set totalIndex(iTotalIndices: uint) {
			this._iTotalIndices = iTotalIndices;
		}

		inline get vertexId(): uint {
			return this._iVertexID;
		}

		inline get totalRenderable(): uint {
			return !isNull(this._pRenderableObject) ? 1 : 0;
		}

		inline getRenderable(i?: uint): IRenderableObject {
			return this._pRenderableObject;
		}

		inline get localCameraCoord(): IVec3 {
			return this._v3fLocalCameraCoord;
		}


		init(pImgMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode?: ISceneObject = null)
		{
			var bResult: bool = super.init(pImgMap,worldExtents, iShift, iShiftX, iShiftY, sSurfaceTextures, pRootNode);
			if (bResult)
			{
				this._iTessellationQueueSize = this.sectorCountX * this.sectorCountY;
				this._pTessellationQueue = new Array(this._iTessellationQueueSize);
				this._iTessellationQueueCount = 0;
				this._isCreate = true;
				this._iTotalIndicesMax=0;

				for(var i: uint = 0; i < this._pTessellationQueue.length; i++){
					this._pTessellationQueue[i] = null;
				}

				this._pRenderableObject.getTechnique().setMethod(this._pDefaultRenderMethod);
				this.connect(this._pRenderableObject.getTechnique(), SIGNAL(render), SLOT(_onRender));

				if(!this._bUseTessellationThread){
					this._pNodePool = new TriangleNodePool(this._iMaxTriTreeNodes);
				}

				this._setTessellationParameters(10.0, 0.5);
				this.reset();


				if(this._bUseTessellationThread){
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

			if(this._bIsInitTessellationSelfData){
				return;
			}
			
			this._pNodePool = new TriangleNodePool(this._iMaxTriTreeNodes);
			for(var i: uint = 0; i < this._pSectorArray.length; i++){
				this._pSectorArray[i]._initTessellationData();
			}

			this._bIsInitTessellationSelfData = true;			
		}

		protected initTessellationThreadData(): void {
			this._bIsReadyForTesseltion = false;

			if(this._bIsInitTessellationThreadData){
				return;
			}

			var me: TerrainROAM = this;
			var pThread: Worker = this._pTessellationThread = new Worker("@TESSELLATION_THREAD");

			pThread.onmessage = function(event: any){
				if(event.data === "ok"){
					me.successThreadInit();
				}
				else {
					WARNING("Cannot inititalize tessellation thread. So we will tessellate terraint in main thread.");
					me.useTessellationThread = false;
					me.terminateTessellationThread();
				}
			};

			pThread.onerror = function (event: any){
				WARNING("Error occured in tessellation thread. So we will tessellate terraint in main thread.");
				LOG(event);
				pThread.onmessage = null;
				me.useTessellationThread = false;
				me.terminateTessellationThread();
			};

			this._bIsInitTessellationThreadData = true;

			var pHeightTableCopy: Float32Array = new Float32Array(this._pHeightTable.length);
			pHeightTableCopy.set(this._pHeightTable);

			pThread.postMessage({
				type: 1,
				info: {
					heightMapTable: pHeightTableCopy.buffer,
					tableWidth: this.tableWidth,
					tableHeight: this.tableHeight,
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
					maxHeight: this.maxHeight,
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

		inline successThreadInit(): void {
			var me: TerrainROAM = this;
			this._pTessellationTransferableData = new ArrayBuffer(4 * this._iMaxTriTreeNodes * 3 + 4);
			this._pTmpTransferableArray = [null];
			this._bIsReadyForTesseltion = true;

			this._pTessellationThread.onmessage = function(event: any){
				me.prepareIndexData(<ArrayBuffer>event.data);
			};
		}

		protected _allocateSectors(): bool {
			var nElementSize: uint = 0;
			if(this._useVertexNormal()){
				nElementSize = (3/*кординаты вершин*/ + 3/*нормаль*/ + 2/*текстурные координаты*/);
			}
			else {
				nElementSize =  (3/*кординаты вершин*/ + 2/*текстурные координаты*/);
			}

			this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

			//Вершинный буфер для всех
			this._pVerts = new Array((this._iSectorCountX*this._iSectorCountY/*количество секции*/) *
									 (this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/) * 
									 (nElementSize));

			for(var i: uint = 0; i < this._pSectorArray.length; i++) {
				this._pSectorArray[i] = this.scene.createTerrainSectionROAM();
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
						iIndex*(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/))){
						return false;
					}
				}
			}

			var pVertexDescription: IVertexElementInterface[] = null;
			if(this._useVertexNormal()){
				pVertexDescription = [VE_FLOAT3(DeclarationUsages.POSITION), VE_FLOAT3(DeclarationUsages.NORMAL), VE_FLOAT2(DeclarationUsages.TEXCOORD)];
			}
			else {
				pVertexDescription = [VE_FLOAT3(DeclarationUsages.POSITION), VE_FLOAT2(DeclarationUsages.TEXCOORD)];
			}

			this._iVertexID = this._pRenderData.allocateData(pVertexDescription, new Float32Array(this._pVerts));

			
			//Индексны буфер для всех
			this._iTotalIndices = 0;
			//Максимальное количество треугольников помноженное на 3 вершины на каждый треугольник
			this._pIndexList = new Float32Array(this._iMaxTriTreeNodes*3); 
			this._pRenderData.allocateIndex([VE_FLOAT(DeclarationUsages.INDEX0), VE_FLOAT(DeclarationUsages.POSITION, 0)],this._pIndexList);
			this._pRenderData.index(this._iVertexID, DeclarationUsages.INDEX0);
			this._pDataIndex = this._pRenderData.getAdvancedIndexData(DeclarationUsages.INDEX0);
			
			return true;
		}

		reset(): void {
			this._isRenderInThisFrame = false;

			if(this._isCreate) {
				super.reset();
				// reset internal counters
				for(var i: uint = 0; i < this._iTessellationQueueCount; i++){
					this._pTessellationQueue[i] = null;
				}

				this._iTessellationQueueCount = 0;
				// this._pTessellationQueue.length = this._iTessellationQueueSize;

				if(!this._bUseTessellationThread && this._bIsInitTessellationSelfData){
					this._pNodePool.reset();

					// reset each section
					for (var i: uint = 0; i < this._pSectorArray.length; i++) {
						this._pSectorArray[i].reset();
					}
				}
			}
		}

		resetWithCamera(pCamera: ICamera): bool {
			if(this._bIsReadyForTesseltion && !this._isOldCamera(pCamera)){
				if(this._isNeedReset){

					this.reset();
					this._isNeedReset = false;

					var v4fCameraCoord: IVec4 = vec4(pCamera.worldPosition, 1.);

		    		v4fCameraCoord = this.inverseWorldMatrix.multiplyVec4(v4fCameraCoord);

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

		addToTessellationQueue(pSection: ITerrainSectionROAM): bool {
			if (this._iTessellationQueueCount < this._iTessellationQueueSize) {
				this._pTessellationQueue[this._iTessellationQueueCount] = pSection;
				this._iTessellationQueueCount++;
				return true;
			}

			// while we handle this failure gracefully
			// in release builds, we alert ourselves
			// to the situation with an assert in debug
			// builds so we can increase the queue size
			WARNING("increase the size of the ROAM tessellation queue");
			return false;
		}

		protected processTessellationQueue(): void {
			// this._pTessellationQueue.length = this._iTessellationQueueCount;
			this._pTessellationQueue.sort(TerrainROAM.fnSortSection);

			if(this._bUseTessellationThread){
				var pDataView: DataView = new DataView(this._pTessellationTransferableData);

				pDataView.setFloat32(0, this._v3fLocalCameraCoord.x, true);
				pDataView.setFloat32(4, this._v3fLocalCameraCoord.y, true);
				pDataView.setFloat32(8, this._v3fLocalCameraCoord.z, true);

				pDataView.setUint32(12, this._iTessellationQueueCount, true);

				// var pSectionIndices: Uint32Array = new Uint32Array(this._pTessellationTransferableData, 16);
				for (var i: uint = 0; i < this._iTessellationQueueCount; ++i) {
					pDataView.setUint32(16 + i * 4, this._pTessellationQueue[i].sectionIndex, true);
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

				if(this._iTotalIndicesOld === this._iTotalIndices && this._iTotalIndices !== this._iTotalIndicesMax) {
					return;
				}


				this._pRenderData._setIndexLength(this._iTotalIndices);
				this._pDataIndex.setData(this._pIndexList, 0, getTypeSize(EDataTypes.FLOAT), 0, this._iTotalIndices);
				this._iTotalIndicesOld = this._iTotalIndices;
				this._iTotalIndicesMax = math.max(this._iTotalIndicesMax,this._iTotalIndices);

				this._pRenderableObject._setRenderData(this._pRenderData);
			}
		}

		protected prepareIndexData(pData: ArrayBuffer): void {
			var iTotalIndices: uint = (new Uint32Array(pData, 0, 1))[0];
			var pTmpData: Float32Array =  new Float32Array(pData, 4, iTotalIndices);

			this._iTotalIndices = iTotalIndices;
			this._pIndexList.set(pTmpData);

			this._pRenderData._setIndexLength(this._iTotalIndices);
			this._pDataIndex.setData(this._pIndexList, 0, getTypeSize(EDataTypes.FLOAT), 0, this._iTotalIndices);
				
			this._pRenderableObject._setRenderData(this._pRenderData);

			this._pTessellationTransferableData = pData;

			this._bIsReadyForTesseltion = true;
		}


		protected _setTessellationParameters(fScale: float, fLimit: float): void {
		    this._fScale = fScale;
		    this._fLimit = fLimit;
		}

		inline _isOldCamera(pCamera: ICamera): bool {
			return this._m4fLastCameraMatrix.isEqual(pCamera.worldMatrix);
		} 

		private _fAvgTesselateCallsInSec: float = 0;
		private _iCurrentTesselateCount: uint = 0;
		private _nSec: uint = 0;
		private _fLastTimeStart: float = 0;

		_onBeforeRender(pRenderableObject: IRenderableObject, pViewport: IViewport): void {
			if(this._bIsReadyForTesseltion) {

				var pCamera: ICamera = pViewport.getCamera();
				var fCurrentTime: float = this.scene.getManager().getEngine().time;

				this._m4fLastCameraMatrix.set(pCamera.worldMatrix);

				if ((this._bUseTessellationThread && 
					fCurrentTime - this._fLastTessellationTime > this._fTessellationThreadInterval) || 
					fCurrentTime - this._fLastTessellationTime > this._fTessellationSelfInterval) {

					if(this._fLastTimeStart === 0){
						this._fLastTimeStart = fCurrentTime;
						this._iCurrentTesselateCount++;
						this._nSec = 1;
						this._fAvgTesselateCallsInSec = 0;
					}
					else if(this._fLastTimeStart + 1 > fCurrentTime){
						this._iCurrentTesselateCount++;
					}
					else {
						this._fAvgTesselateCallsInSec = this._fAvgTesselateCallsInSec * (this._nSec - 1)/this._nSec + this._iCurrentTesselateCount/this._nSec;
						

						if(this._nSec % 3 === 0){
							LOG("Avg:", this._fAvgTesselateCallsInSec.toFixed(2), "Last:", this._iCurrentTesselateCount);
						}

						this._nSec++;
						this._fLastTimeStart = fCurrentTime;
						this._iCurrentTesselateCount = 0;
					}

					if(!this._m4fLastCameraMatrix.isEqual(this._m4fLastTessellationMatrix)) {
						this.processTessellationQueue();
						this._m4fLastTessellationMatrix.set(this._m4fLastCameraMatrix);
						//this._iTessellationQueueCountOld = this._iTessellationQueueCount;
					}

					this._fLastTessellationTime = fCurrentTime;
				}				
			}

			this._isNeedReset = true;
		}

		static private fnSortSection(pSectionA: ITerrainSectionROAM, pSectionB: ITerrainSectionROAM): uint {
			if(isNull(pSectionA)){
				return 1;
			} 
			else if(isNull(pSectionB)){
				return -1;
			}
			else {
				return pSectionA.queueSortValue - pSectionB.queueSortValue;	
			}
		}
	}
}

#endif



