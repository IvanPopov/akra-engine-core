#ifndef TERRAINROAM_TS
#define TERRAINROAM_TS

#include "ITerrainROAM.ts"
#include "terrain/Terrain.ts"
#include "terrain/TerrainSectionROAM.ts"
#include "terrain/TriTreeNode.ts"
#include "scene/objects/Camera.ts"

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
	    private _pNodePool: ITriangleNodePool = null;
	    private _pThistessellationQueue: ITerrainSectionROAM[] = null;
		private _iTessellationQueueCount: uint = 0;
		private _isCreat: bool = false;
		private _isRenderInThisFrame: bool = false;
		private _iMaxTriTreeNodes: uint = (1024*64); /*64k triangle nodes*/
		private _iTessellationQueueSize: uint = undefined;
		private _isCreate: bool = false;
		//массив подчиненный секций 
		protected _pSectorArray: ITerrainSectionROAM[] = null; 


		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.TERRAIN_ROAM) {
			super(pScene, eType);
			this._pRenderData = this._pDataFactory.getEmptyRenderData(EPrimitiveTypes.TRIANGLELIST,ERenderDataBufferOptions.RD_ADVANCED_INDEX);
			this._pRenderableObject = new render.RenderableObject();
			this._pRenderableObject._setup(this._pEngine.getRenderer());
			this._pRenderableObject._setRenderData(this._pRenderData);

			this.connect(this._pRenderableObject, SIGNAL(beforeRender), SLOT(_onBeforeRender), EEventTypes.UNICAST);
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


		private _iTessellationQueueCountOld: int = 0;
		private _nCountRender: uint = 0;

		init(pImgMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode?: ISceneObject = null)
		{
			var bResult: bool = super.init(pImgMap,worldExtents, iShift, iShiftX, iShiftY, sSurfaceTextures, pRootNode);
			if (bResult)
			{
				this._iTessellationQueueSize=this.sectorCountX * this.sectorCountY;
				this._pNodePool= new TriangleNodePool(this._iMaxTriTreeNodes);
				this._pThistessellationQueue = new Array(this._iTessellationQueueSize);
				this._iTessellationQueueCount = 0;
				this._isCreate=true;
				this._iTotalIndicesMax=0;

				this._pRenderableObject.getTechnique().setMethod(this._pDefaultRenderMethod);
				this.connect(this._pRenderableObject.getTechnique(), SIGNAL(render), SLOT(_onRender), EEventTypes.UNICAST);

				this._setTessellationParameters(0.5, 1.);
				this.reset();
			}
			return bResult;
		}

		destroy(): void {
			delete this._pNodePool;
			delete this._pThistessellationQueue;

			this._iTessellationQueueCount = 0;
			this._fScale = 0;
			this._fLimit = 0;
			//Terrain.prototype.destroy.call(this); с какого то хуя этого метода не оказалось
		}

		protected _allocateSectors(): bool {
			/*this._pSectorArray =
			 new cTerrainSection[
			 this._iSectorCountX*this._iSectorCountY];*/
			this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);


			//Вершинный буфер для всех
			this._pVerts = new Array((this._iSectorCountX*this._iSectorCountY/*количество секции*/)*(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/) * (3/*кординаты вершин*/+2/*текстурные координаты*/));

			for(var i: uint = 0; i < this._pSectorArray.length; i++) {
				this._pSectorArray[i] = this.scene.createTerrainSectionROAM();
			}

			// this._setRenderMethod(this._pDefaultRenderMethod);

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

			var pVertexDescription: IVertexElementInterface[] = [VE_FLOAT3(DeclarationUsages.POSITION), VE_FLOAT2(DeclarationUsages.TEXCOORD)];
			this._iVertexID = this._pRenderData.allocateData(pVertexDescription, new Float32Array(this._pVerts));


			//Индексны буфер для всех
			this._iTotalIndices=0;
			//Максимальное количество треугольников помноженное на 3 вершины на каждый треугольник
			this._pIndexList = new Float32Array(this._iMaxTriTreeNodes*3); 
			this._pRenderData.allocateIndex([VE_FLOAT(DeclarationUsages.INDEX0)],this._pIndexList);
			this._pRenderData.index(this._iVertexID, DeclarationUsages.INDEX0);
			this._pDataIndex = this._pRenderData.getAdvancedIndexData(DeclarationUsages.INDEX0);

			return true;
		}

		reset(): void {
			this._isRenderInThisFrame = false;
			if(this._isCreate) {
				super.reset();
				// reset internal counters
				this._iTessellationQueueCount = 0;
				this._pThistessellationQueue.length = this._iTessellationQueueSize;

				this._pNodePool.reset();

				// reset each section
				for (var i in this._pSectorArray)
				{
					this._pSectorArray[i].reset();
				}
			}
		}

		requestTriNode(): ITriTreeNode {
			return this._pNodePool.request();
		}

		addToTessellationQueue(pSection: ITerrainSectionROAM): bool {
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
			WARNING("increase the size of the ROAM tessellation queue");
			return false;
		}

		processTessellationQueue(): void {
			this._pThistessellationQueue.length = this._iTessellationQueueCount;

			function fnSortSection(a, b) {
				return a.queueSortValue - b.queueSortValue;
			}

			this._pThistessellationQueue.sort(fnSortSection);

			for (var i: uint = 0; i < this._iTessellationQueueCount; ++i) {
				// split triangles based on the
				// scale and limit values
				this._pThistessellationQueue[i].tessellate(
					this._fScale, this._fLimit);
			}

			this._iTotalIndices = 0;

			// gather up all the triangles into
			// a final index buffer per section

			for (var i: uint = 0; i < this._iTessellationQueueCount; ++i) {
				this._pThistessellationQueue[i].buildTriangleList();
			}

			if(this._iTotalIndicesOld==this._iTotalIndices && this._iTotalIndices!= this._iTotalIndicesMax) {
				//console.log("!!!!_iTotalIndices",this._iTotalIndices);
				return;
			}


			this._pRenderData._setIndexLength(this._iTotalIndices);
			this._pDataIndex.setData(this._pIndexList, 0, getTypeSize(EDataTypes.FLOAT), 0, this._iTotalIndices);
			this._iTotalIndicesOld = this._iTotalIndices;
			this._iTotalIndicesMax = math.max(this._iTotalIndicesMax,this._iTotalIndices);

			this._pRenderableObject._setRenderData(this._pRenderData);
		}


		_onBeforeRender(pRenderableObject: IRenderableObject, pViewport: IViewport): void {
			if(this._isCreate) {
				// LOG("i`m must be here");
				if(((this._nCountRender++) % 30) === 0) {
					// LOG("-->i`m must be here too");
					
					// var pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvasLOD');
					// var p2D = pCanvas.getContext("2d");
					// p2D.clearRect(0, 0, pCanvas.width, pCanvas.height);


					if(this._iTessellationQueueCount !== this._iTessellationQueueCountOld) {
						LOG("-->-->i`m must be here too", this._iTessellationQueueCount, this._iTessellationQueueCountOld);						

						this.processTessellationQueue();
						this._iTessellationQueueCountOld = this._iTessellationQueueCount;
					}



					// var pCamera: ICamera = pViewport.getCamera();
					// var v3fCameraPosition: IVec3 = pCamera.worldPosition;
					// var pData: Float32Array = pCamera.worldMatrix.data;
					// var pDir: IVec2 = new Vec2(-pData[__13], -pData[__23]);
					// var fRad: float = pCamera.fov;
					// var fFar: float = pCamera.farPlane;
					// //var fNear = pCamera.nearPlane();
					// pDir.normalize();
					// pDir.scale(fFar / Math.abs(this.worldExtents.x1 - this.worldExtents.x0));

					// var pDir1: IVec2 = new Vec2(pDir.x * Math.cos( fRad / 2) - pDir.y * Math.sin( fRad / 2), pDir.x * Math.sin( fRad / 2) + pDir.y * Math.cos( fRad / 2));
					// var pDir2: IVec2 = new Vec2(pDir.x * Math.cos(-fRad / 2) - pDir.y * Math.sin(-fRad / 2), pDir.x * Math.sin(-fRad / 2) + pDir.y * Math.cos(-fRad / 2));

					// //document.getElementById('setinfo0').innerHTML="fNear " + fNear;
					// // document.getElementById('setinfo1').innerHTML="fFar "  + fFar;
					// //Вычисление текстурных координат над которыми находиться камера
					// var fX: float = (v3fCameraPosition.x - this.worldExtents.x0) / Math.abs(this.worldExtents.x1 - this.worldExtents.x0);
					// var fY: float = (v3fCameraPosition.y - this.worldExtents.y0) / Math.abs(this.worldExtents.y1 - this.worldExtents.y0);

					// //камера
					// p2D.beginPath();
					// p2D.strokeStyle = "#0f0"; //цвет линий
					// p2D.lineWidth = 3;
					// p2D.moveTo(fX * pCanvas.width, fY * pCanvas.height);
					// p2D.lineTo((fX + pDir1.x) * pCanvas.width, (fY+pDir1.y) * pCanvas.height);
					// p2D.lineTo((fX + pDir2.x) * pCanvas.width, (fY+pDir2.y) * pCanvas.height);
					// p2D.lineTo(fX * pCanvas.width, fY * pCanvas.height);
					// p2D.stroke();
					// p2D.beginPath();
					// p2D.arc(fX * pCanvas.width, fY * pCanvas.height, 5, 0, 2 * Math.PI, false);
					// // p2D.fillStyle = "#00f";
					// // p2D.fill();
					// p2D.lineWidth = 1;
					// p2D.strokeStyle = "#f0f";
					// p2D.stroke();



				}

				this.reset();
			}
		}
	}
}

#endif



