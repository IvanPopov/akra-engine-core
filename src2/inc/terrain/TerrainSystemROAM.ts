#ifndef TERRAINROAM_TS
#define TERRAINROAM_TS

#include "ITerrainSystemROAM.ts"

module akra {
	export class TerrainSystemROAM implements ITerrainSystemROAM extends ITerrain{
		private _pRenderData = null;
		private _pDataIndex = null;

		private _iTotalIndices: uint;
		private _iTotalIndicesOld: uint; 
	    private _iTotalIndicesMax: uint;
	    private _pIndexList; 
	    private _pVerts;
	    private _iVertexID: uint;
	    private _pNodePool = null;
	    private _pThistessellationQueue = null;
		private _iTessellationQueueCount: uint = 0;
		private _isCreat: bool = false;
		private _isRenderInThisFrame: bool = false;

		constructor() {
			this._pRenderData = this.getDataFactory().getEmptyRenderData(a.PRIMTYPE.TRIANGLELIST,a.RenderData.ADVANCED_INDEX);
		}

		inline get verts() {
			return this._pVerts;
		}

		inline get index() {
			return this._pIndexList;
		}

		inline get totalIndex(): uint {
			return this._iTotalIndices;
		}

		inline set totalIndex(iTotalIndices: uint) {
			this._iTotalIndices=iTotalIndices;
		}

		inline get vertexId(): uint {
			return this._iVertexID;
		}

		private static _iTessellationQueueCountOld = undefined;
		static nCountRender = 0;
		static fXOld = undefined;
		static fYOld = undefined;

		destroy(): void {
			delete this._pNodePool;
			delete this._pThistessellationQueue;

			this._iTessellationQueueCount = 0;
			this._fScale = 0;
			this._fLimit = 0;
			Terrain.prototype.destroy.call(this);
		}

		allocateSectors(): bool {
			/*this._pSectorArray =
			 new cTerrainSection[
			 this._iSectorCountX*this._iSectorCountY];*/
			this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);


			//Вершинный буфер для всех
			this._pVerts=new Array((this._iSectorCountX*this._iSectorCountY/*количество секции*/)*(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/) * (3/*кординаты вершин*/+2/*текстурные координаты*/));

			for(var i: uint = 0; i < this._pSectorArray.length; i++) {
				this._pSectorArray[i] = new a.TerrainSectionROAM(this._pEngine);
			}

		    this.setRenderMethod(this._pDefaultRenderMethod);

			// create the sector objects themselves
			for (var y: uint = 0; y < this._iSectorCountY; ++y) {
				for (var x: uint = 0; x < this._iSectorCountX; ++x) {
					//cVector2 sectorPos(
					v2fSectorPos = new Vec2();
					v2fSectorPos.set(
						this._pWorldExtents.fX0 + (x * this._v2fSectorSize.x),
						this._pWorldExtents.fY0 + (y * this._v2fSectorSize.y));

					//cRect2d r2fSectorRect(
					r2fSectorRect = new a.Rect2d();
					r2fSectorRect.set(
						v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x,
						v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

					iXPixel = x << this._iSectorShift;
					iYPixel = y << this._iSectorShift;
					iIndex = (y * this._iSectorCountX) + x;

					if (!this._pSectorArray[iIndex].create(
						this._pRootNode,  //Родительские нод
						this,				// Терраин
						x, y,				// Номер секции оп иксу и игрику
						iXPixel, iYPixel,   // Координаты секции в картах нормалей и врешин
						this._iSectorVerts, // Количесвто вершин в секции по иску и игрику
						this._iSectorVerts,
						r2fSectorRect,
						iIndex*(this._iSectorVerts * this._iSectorVerts/*размер секции в вершинах*/))){
						return false;
					}
				}
			}

			var pVertexDescription: Array = [VE_FLOAT3(a.DECLUSAGE.POSITION),VE_FLOAT2(a.DECLUSAGE.TEXCOORD)];
			this._iVertexID=this._pRenderData.allocateData(pVertexDescription,new Float32Array(this._pVerts));


			//Индексны буфер для всех
			this._iTotalIndices=0;
			this._pIndexList = new Float32Array(a.TerrainROAM.MaxTriTreeNodes*3); //Максимальное количество треугольников помноженное на 3 вершины на каждый треугольник
			this._pRenderData.allocateIndex([VE_FLOAT(a.DECLUSAGE.INDEX0)],this._pIndexList);
			this._pRenderData.index(this._iVertexID,a.DECLUSAGE.INDEX0);
			this._pDataIndex=this._pRenderData.getAdvancedIndexData(a.DECLUSAGE.INDEX0);

			return true;
		}

		reset(): void {
			this._isRenderInThisFrame=false;
			if(this._isCreate) {
				Terrain.prototype.reset.call(this);
				// reset internal counters
				this._iTessellationQueueCount = 0;
				this._pThistessellationQueue.length=this._iTessellationQueueSize;

				this._pNodePool.reset();

				// reset each section
				for (var i in this._pSectorArray)
				{
					this._pSectorArray[i].reset();
				}
			}
		}

		requestTriNode() {
			return this._pNodePool.request()
		}

		addToTessellationQueue(pSection: ITerrainSection): bool {
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
			debug_assert(0,	"increase the size of the ROAM tessellation queue");
			return false;
		}

		prepareForRender(): void {

			if(this._isCreate) {
				Terrain.prototype.prepareForRender.call(this);

				if(((TerrainROAM.nCountRender++)%30)==0) {
					var pCamera = this._pEngine.getActiveCamera();
					var v3fCameraPosition=pCamera.worldPosition();
					var fX=(v3fCameraPosition.x-this.worldExtents().fX0)/Math.abs(this.worldExtents().fX1-this.worldExtents().fX0);
					var fY=(v3fCameraPosition.y-this.worldExtents().fY0)/Math.abs(this.worldExtents().fY1-this.worldExtents().fY0);

					if(this._iTessellationQueueCount!=TerrainROAM._iTessellationQueueCountOld) {
						this.processTessellationQueue();
						TerrainROAM._iTessellationQueueCountOld=this._iTessellationQueueCount;
					}
				}
			}

			return;
		}

		render(pWorldMatrix): void {
		    if(this._isRenderInThisFrame==false) {
				this._isRenderInThisFrame=true;

				var pCamera = this._pEngine.getActiveCamera();
		        this._pSectorArray[0].setRenderData(this._pRenderData);
		        TerrainSection.prototype.render.call(this._pSectorArray[0]);
			}
		}

		processTessellationQueue(): void {
			this._pThistessellationQueue.length=this._iTessellationQueueCount;

			function fnSortSection(a, b) {
				return a.getQueueSortValue()- b.getQueueSortValue();
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


			this._pRenderData.setIndexLength(this._iTotalIndices);
			this._pDataIndex.setData(this._pIndexList, 0, a.getTypeSize(a.DTYPE.FLOAT), 0, this._iTotalIndices);
			this._iTotalIndicesOld=this._iTotalIndices;
			this._iTotalIndicesMax=Math.max(this._iTotalIndicesMax,this._iTotalIndices);
		}
	}
}

#endif



