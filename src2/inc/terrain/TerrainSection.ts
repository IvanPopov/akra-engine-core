#ifndef TERRAINSECTION_TS
#define TERRAINSECTION_TS

#include "ITerrainSection.ts"

module akra {
	export class TerrainSection implements ITerrainSection{
		private _pTerrainSystem: ITerrainSystem = null;
		private _pRenderData: IRenderData = null;

		private _iVertexID: uint;
		//Ее коорлинаты на карте высот
		private _iHeightMapX: uint; 
	    private _iHeightMapY: uint;
	    //номер сектора по иксу и по игрику
	    private _iSectorX: uint;   
	    private _iSectorY: uint;
	    //Ращмеры сетки вершин
	    private _iXVerts: uint = 0; 
	    private _iYVerts: uint = 0;
	    //Положение сетора в мире
	    private _pWorldRect: IRec3d = new geometry.Rect3d(); 
	    private _pEngine: IEngine = null;
	    private _pRenderableObject: IRenderableObject = new render.RenderableObject();

		constructor(pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		inline get sectorX(): float{
			return this._iSectorX;
		};

		inline get sectorY(): float{
			return this._iSectorY;
		};

		inline get terrainSystem(){
			return this._pTerrainSystem;
		};

		inline get sectionIndex(): uint {
			return (this._iSectorY * this._pTerrainSystem().getSectorCountX()) +  this._iSectorX;
		}

		inline get heightX(): float {
			return Math.abs(this._pWorldRect.fX1-this._pWorldRect.fX0);
		};

		inline get heightY(): float {
			return Math.abs(this._pWorldRect.fY1-this._pWorldRect.fY0);
		};

		create(pRootNode: ISceneNode, pParentSystem: ITerrainSystem, iSectorX: uint, iSectorY: uint, iHeightMapX: uint, iHeightMapY: uint, iXVerts: uint, iYVerts: uint, pWorldRect: IRec3d): bool {
			var bResult: bool = TerrainSection.superclass.create.apply(this, arguments);
			if (bResult)
			{
				//
				// Build a vertex buffer to
				// hold the height and surface
				// normal for this area of the terrain
				//
				this._pTerrainSystem = pParentSystem;
				this._iXVerts = iXVerts;
				this._iYVerts = iYVerts;
				this._iSectorX = iSectorX;
				this._iSectorY = iSectorY;
				this._pWorldRect.fX0 = pWorldRect.fX0;
				this._pWorldRect.fX1 = pWorldRect.fX1;
				this._pWorldRect.fY0 = pWorldRect.fY0;
				this._pWorldRect.fY1 = pWorldRect.fY1; //??
				this._iHeightMapX = iHeightMapX;
				this._iHeightMapY = iHeightMapY;

				bResult = this._createRenderDataForVertexAndIndex();
				bResult = bResult && this._buildVertexBuffer();
				bResult = bResult && this._buildIndexBuffer();

				// set the scene object bounds data
				this.accessLocalBounds().set(this._pWorldRect.fX0,
											 this._pWorldRect.fX1,
											 this._pWorldRect.fY0,
											 this._pWorldRect.fY1,
											 this._pWorldRect.fZ0,
											 this._pWorldRect.fZ1);
				if(bResult)
					this.attachToParent(pRootNode);
			}

			return bResult;
		 };



		protected _createRenderDataForVertexAndIndex(): bool {
			ASSERT(this._pRenderData == null, "У терраин сектиона уже созданы данные");
			this._pRenderData = this.terrainSystem.getDataFactory().getEmptyRenderData(EPrimitiveTypes.TRIANGLESTRIP,0);

			if(!this._pRenderData) {
				return false;
			}
			return true;
		}

		protected _buildVertexBuffer(): bool {
			this._pWorldRect.fZ0 = MAX_FLOAT64;
			this._pWorldRect.fZ1 = MIN_FLOAT64;

			var pVerts: float[] = new Array(this._iXVerts * this._iYVerts * (3/*кординаты вершин*/+3/*координаты нормалей*/+2/*текстурные координаты*/));
			var v3fNormal: IVec3 = new Vec3();

			var v2fCellSize: IVec2 = new Vec2(); //размер ячейки сектора
			v2fCellSize.set(this.heightX / (this._iXVerts-1),
				this.heightY / (this._iYVerts-1)); //размер сектора/количество ячеек в секторе

			var v2fVert: IVec2 = new Vec2(); //Координаты вершина в секторе
			v2fVert.set(0.0, 0.0);

			//console.log("-->",this._iSectorX,this._iSectorY,"--",this._pWorldRect.fX0,this._pWorldRect.fY0,"--",this._iXVerts,this._iYVerts)
			//console.log("--",v2fCellSize.X,v2fCellSize.Y,this.getHeightX(),this.getHeightY() )

			for (var y: uint = 0; y < this._iYVerts; ++y) {
				v2fVert.set(this._pWorldRect.fX0, y * v2fCellSize.y+this._pWorldRect.fY0);
				for (var x: uint = 0; x < this._iXVerts; ++x) {

					var fHeight: float = this.terrainSystem.readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

					pVerts[((y * this._iXVerts) + x) * 5 + 0] = v2fVert.x;
					pVerts[((y * this._iXVerts) + x) * 5 + 1] = v2fVert.y;
					pVerts[((y * this._iXVerts) + x) * 5 + 2] = fHeight;

					//console.log(y*this._iXVerts + x,x,y,v2fVert.X,v2fVert.Y,fHeight);
					//	pVerts[((y * this._iXVerts) + x) * 10 + 2],pVerts[((y * this._iXVerts) + x) * 10 + 1]);


					pVerts[((y * this._iXVerts) + x) * 5 + 3] = (this._iSectorX + x / (this._iXVerts - 1))/this.terrainSystem.getSectorCountX();
					pVerts[((y * this._iXVerts) + x) * 5 + 4] = (this._iSectorY+ y / (this._iYVerts - 1))/this.terrainSystem.getSectorCountY() ;


					//console.log(this._iSectorX,this.terrainSystem.getSectorCountX(), x,this._iXVerts);
					//console.log(this._iSectorX/this.terrainSystem.getSectorCountX() + x / (this._iXVerts - 1));

					this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
					this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);

					v2fVert.x += v2fCellSize.x;
				}
			}

			this._iVertexID=this._pRenderData.allocateData(this.pVertexDescription,new Float32Array(pVerts));

			return true;
		}

		protected _buildIndexBuffer(): bool {
			var pIndexList: Float32Array = new Float32Array(getCountIndexForStripGrid(this._iXVerts, this._iYVerts));

			createSingleStripGrid(this._pIndexList,
				this._iXVerts, // width of grid
				this._iYVerts, // height of grid
				1, // horz vertex count per cell
				1, // vert vertex count per cell
				this._iYVerts, // horz vertex count in vbuffer
				0);

			//

			this._pRenderData.allocateIndex(<IVertexDeclaration[]>[VE_FLOAT(DeclarationUsages.INDEX0)],pIndexList);
			this._pRenderData.index(this._iVertexID,DeclarationUsages.INDEX0);

			return true;
		}

		render(): bool {
			CRITICAL_ERROR(,"Ваня, WTF?");
			/*//	this.terrainSystem.applyForRender();
		    var pRenderer = this._pEngine.shaderManager();
		    var pLightManager = this._pEngine.lightManager();
		    var pTerrain: ITerrainSystem = this.terrainSystem;
		    var pSnapshot;

		    pRenderer.activateSceneObject(this);
		    pRenderer.setViewport(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);

		    this.switchRenderMethod(".default-render");
		    this.startRender();

		    pSnapshot = this._pActiveSnapshot;
			//    console.log(this, pSnapshot);

		    for (var i: uint = 0; i < this.totalPasses(); i++) {
		        this.activatePass(i);

		        pRenderer.activateFrameBuffer(pLightManager.deferredFrameBuffers[i]);

		        pTerrain.applyForRender(pSnapshot);

		        this.applyRenderData(this._pRenderData);
		        var pEntry = this.renderPass();
				//        console.log(pEntry.pTextures, pEntry.pUniforms, pEntry.pProgram);
		        this.deactivatePass();
		        pRenderer.activateFrameBuffer(null);
		    }
		    this.finishRender();
		    pRenderer.deactivateSceneObject();
		    return true;*/
		}

		prepareForRender(): void {
			return;
		}
	}
}

#endif



