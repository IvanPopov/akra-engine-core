#ifndef TERRAINSECTIONROAM_TS
#define TERRAINSECTIONROAM_TS

#include "ITerrainSectionROAM.ts"
#include "terrain/TerrainROAM.ts"

module akra.terrain {
	export class TerrainSectionROAM implements ITerrainSectionROAM extends TerrainSection{
		private _iTotalDetailLevels: uint;
		private _iTotalVariances: uint;
		private _iOffsetInVertexBuffer: uint;

		//два дерева треугольников
		private _pRootTriangleA: ITriTreeNode = new TriTreeNode();
		private _pRootTriangleB: ITriTreeNode = new TriTreeNode();

		//Урове5нь погрещности для двух деревьев
		private _pVarianceTreeA: float[] = null;
		private _pVarianceTreeB: float[] = null;

		//расстояние от камеры до углов секции
		private _v3fDistance0: IVec3 = new Vec3();
		private _v3fDistance1: IVec3 = new Vec3();
		private _v3fDistance2: IVec3 = new Vec3();
		private _v3fDistance3: IVec3 = new Vec3();

		private _fDistance0: float;
		private _fDistance1: float;
		private _fDistance2: float;
		private _fDistance3: float;

		//Нименьшее растояние от камеры до секции, необходимо для очереди
		private _fQueueSortValue: float;


		private _leftNeighborOfA:  ITriTreeNode = null;
		private _rightNeighborOfA: ITriTreeNode = null;
		private _leftNeighborOfB:  ITriTreeNode = null;
		private _rightNeighborOfB: ITriTreeNode = null;

	    private _iStartIndex: uint = undefined;

	    private _pTerrainSystem: ITerrainROAM = null;
	    private _iTempTotalIndices: uint = undefined;
	    private _pTempIndexList: Float32Array = undefined;
	    private _iMaxIndices: uint = undefined;

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.TERRAIN_SECTION_ROAM) {
			super(pScene, eType);
		}

		inline get terrainSystem(): ITerrainROAM{
			return this._pTerrainSystem;
		};

		inline get triangleA(): ITriTreeNode {
			return this._pRootTriangleA;
		}

		inline get triangleB(): ITriTreeNode {
			return this._pRootTriangleB;
		}

		inline get queueSortValue(): float {
			return this._fQueueSortValue;
		}

		_internalCreate(pParentSystem: ITerrainROAM, 
						iSectorX: uint, iSectorY: uint, 
						iHeightMapX: uint, iHeightMapY: uint, 
						iXVerts: uint, iYVerts: uint, 
						pWorldRect: IRect2d, iStartIndex?: uint): bool {

			debug_assert(arguments.length === 9, "Not valid arguments count.");

			var iVerts: uint = math.max(iXVerts, iYVerts)
			this._iStartIndex = iStartIndex;

			var bResult: bool = super._internalCreate(pParentSystem, 
													iSectorX, iSectorY, 
													iHeightMapX, iHeightMapY, 
													iVerts, iVerts, 
													pWorldRect);
			if(!bResult){
				return false;
			}

			this._iTotalDetailLevels = 2*(math.round(math.log(iVerts - 1)/math.LN2));
			this._iTotalVariances = 1<<this._iTotalDetailLevels;

			this._pVarianceTreeA = new Array( this._iTotalVariances);
			// this._pVarianceTreeA.set(0);

			this._pVarianceTreeB = new Array(this._iTotalVariances);
			// this._pVarianceTreeB.set(0);
			for(var i: uint = 0; i < this._iTotalVariances; i++) {
				this._pVarianceTreeA[i] = 0;
				this._pVarianceTreeB[i] = 0;
			}

			var pRoamTerrain: ITerrainROAM = this.terrainSystem;
			var pNorthSection: ITerrainSectionROAM = pRoamTerrain.findSection(iSectorX, iSectorY - 1);
			var pSouthSection: ITerrainSectionROAM = pRoamTerrain.findSection(iSectorX, iSectorY + 1);
			var pEastSection: ITerrainSectionROAM  = pRoamTerrain.findSection(iSectorX + 1, iSectorY);
			var pWestSection: ITerrainSectionROAM  = pRoamTerrain.findSection(iSectorX - 1, iSectorY);

			if (pNorthSection) {
				this._leftNeighborOfA = pNorthSection.triangleB;
			}

			if (pSouthSection) {
				this._leftNeighborOfB = pSouthSection.triangleA;
			}

			if (pEastSection) {
				this._rightNeighborOfB = pEastSection.triangleA;
			}

			if (pWestSection) {
				this._rightNeighborOfA = pWestSection.triangleB;
			}

			// establish basic links
			this.reset();

			// build the variance trees
			this.computeVariance();

			return bResult;
		}

		//private _v3fOldPosition: 
		prepareForRender(pViewport: IViewport): void {
			super.prepareForRender(pViewport);

			var pCamera: ICamera = pViewport.getCamera();

			if(!this.terrainSystem.resetWithCamera(pCamera)){
				return;
			}

			var v3fViewPoint: IVec3 = this.terrainSystem.localCameraCoord;

			// compute view distance to our 4 corners
			var fHeight0: float = this.terrainSystem.readWorldHeight(math.ceil(this._iHeightMapX), math.ceil(this._iHeightMapY));
			var fHeight1: float = this.terrainSystem.readWorldHeight(math.ceil(this._iHeightMapX), math.ceil(this._iHeightMapY + this._iYVerts));
			var fHeight2: float = this.terrainSystem.readWorldHeight(math.ceil(this._iHeightMapX + this._iXVerts), math.ceil(this._iHeightMapY + this._iYVerts));
			var fHeight3: float = this.terrainSystem.readWorldHeight(math.ceil(this._iHeightMapX + this._iXVerts), math.ceil(this._iHeightMapY));

			this._v3fDistance0.set(v3fViewPoint.x-this._pWorldRect.x0, v3fViewPoint.y-this._pWorldRect.y0,v3fViewPoint.z-fHeight0);
			this._v3fDistance1.set(v3fViewPoint.x-this._pWorldRect.x0, v3fViewPoint.y-this._pWorldRect.y1,v3fViewPoint.z-fHeight1);
			this._v3fDistance2.set(v3fViewPoint.x-this._pWorldRect.x1, v3fViewPoint.y-this._pWorldRect.y1,v3fViewPoint.z-fHeight2);
			this._v3fDistance3.set(v3fViewPoint.x-this._pWorldRect.x1, v3fViewPoint.y-this._pWorldRect.y0,v3fViewPoint.z-fHeight3);

			this._fDistance0 = this._v3fDistance0.length();
			this._fDistance1 = this._v3fDistance1.length();
			this._fDistance2 = this._v3fDistance2.length();
			this._fDistance3 = this._v3fDistance3.length();

			// compute min distance as our sort value
			this._fQueueSortValue = math.min(this._fDistance0 , this._fDistance1);
			this._fQueueSortValue = math.min(this._fQueueSortValue, this._fDistance2);
			this._fQueueSortValue = math.min(this._fQueueSortValue, this._fDistance3);


			// submit to the tessellation queue of our parent
			this.terrainSystem.addToTessellationQueue(this);
		}

		reset(): void {
			this._pRootTriangleA.leftChild  = null;
			this._pRootTriangleA.rightChild = null;
			this._pRootTriangleB.leftChild  = null;
			this._pRootTriangleB.rightChild = null;

			this._pRootTriangleA.baseNeighbor = this._pRootTriangleB;
			this._pRootTriangleB.baseNeighbor = this._pRootTriangleA;

			// link to our neighbors
			this._pRootTriangleA.leftNeighbor  = this._leftNeighborOfA;
			this._pRootTriangleA.rightNeighbor = this._rightNeighborOfA;
			this._pRootTriangleB.leftNeighbor  = this._leftNeighborOfB;
			this._pRootTriangleB.rightNeighbor = this._rightNeighborOfB;
		}

		tessellate(fScale: float, fLimit: float): void {
			var iIndex0: uint =  this.terrainSystem._tableIndex(this._iHeightMapX,						this._iHeightMapY);
			var iIndex1: uint =  this.terrainSystem._tableIndex(this._iHeightMapX,						this._iHeightMapY + this._iYVerts-1);
			var iIndex2: uint =  this.terrainSystem._tableIndex(this._iHeightMapX + this._iXVerts-1,	this._iHeightMapY + this._iYVerts-1);
			var iIndex3: uint =  this.terrainSystem._tableIndex(this._iHeightMapX + this._iXVerts-1,	this._iHeightMapY);

			var fHeight0: float = this.terrainSystem.readWorldHeight(iIndex0);
			var fHeight1: float = this.terrainSystem.readWorldHeight(iIndex1);
			var fHeight2: float = this.terrainSystem.readWorldHeight(iIndex2);
			var fHeight3: float = this.terrainSystem.readWorldHeight(iIndex3);

			this.recursiveTessellate(
				this._pRootTriangleA,
				this._iHeightMapX, 					 this._iHeightMapY + this._iYVerts-1, fHeight1,
				this._iHeightMapX + this._iXVerts-1, this._iHeightMapY + this._iYVerts-1, fHeight2,
				this._iHeightMapX,					 this._iHeightMapY, 				  fHeight0,
				this._pVarianceTreeA, 1);

			this.recursiveTessellate(
				this._pRootTriangleA,
				this._iHeightMapX + this._iXVerts-1, this._iHeightMapY,					  fHeight3,
				this._iHeightMapX,					 this._iHeightMapY,					  fHeight0,
				this._iHeightMapX + this._iXVerts-1, this._iHeightMapY + this._iYVerts-1, fHeight2,
				this._pVarianceTreeB, 1);
		}

		protected recursiveTessellate(pTri: ITriTreeNode,
									  iCornerAX: float, iCornerAY: float, fCornerAZ: float,
									  iCornerBX: float, iCornerBY: float, fCornerBZ: float,
									  iCornerCX: float, iCornerCY: float, fCornerCZ: float,
									  pVTree: float[], iIndex: uint): void {
			if((iIndex<<1)+1 > this._iTotalVariances){
				return;
			}

			var iMidpointX: uint = (iCornerBX + iCornerCX) >> 1;
			var iMidpointY: uint = (iCornerBY + iCornerCY) >> 1;

			if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) &&
				(iMidpointY === iCornerBY || iMidpointY === iCornerCY)){
				return;
			}
			
			var fMidPointZ: float = (fCornerBZ + fCornerCZ)/2;
			var fRealMidPointZ: float = this.terrainSystem.readWorldHeight(iMidpointX, iMidpointY);

			var v3fLoaclCameraCoord: IVec3 = this.terrainSystem.localCameraCoord;
			var pTerrainExtents: IRect3d = this.terrainSystem.worldExtents;
			var iHeightMapWidth: uint = this.terrainSystem.tableWidth;
			var iHeightMapHeight: uint = this.terrainSystem.tableHeight;
			var fTerrainSizeZ: float = this.terrainSystem.maxHeight;
			var fTerrainDiagonal: float = this.terrainSystem.terrain2DLength;
			
			var fLocalMidX: float = pTerrainExtents.x0 + iMidpointX * pTerrainExtents.sizeX() / iHeightMapWidth;
			var fLocalMidY: float = pTerrainExtents.y0 + iMidpointY * pTerrainExtents.sizeY() / iHeightMapHeight;

			var fDistanceSquare: float = (v3fLoaclCameraCoord.x - fLocalMidX) * (v3fLoaclCameraCoord.x - fLocalMidX) +
										 (v3fLoaclCameraCoord.y - fLocalMidY) * (v3fLoaclCameraCoord.y - fLocalMidY) +
										 (v3fLoaclCameraCoord.z - fMidPointZ) * (v3fLoaclCameraCoord.z - fMidPointZ);

			// Если треугольник не поделен
			if (!pTri.leftChild) {
				var fScale: float = this.terrainSystem.tessellationScale;
				var fLimit: float = this.terrainSystem.tessellationLimit;

				var fDistance: float = math.sqrt(fDistanceSquare+0.0001);
				var fRatio: float = 0.;
				
				fRatio = (pVTree[iIndex] / fTerrainSizeZ * fScale) /((/*1 +*/ fDistance/fTerrainDiagonal) * fLimit);

				if (fRatio > 1.) {
					// subdivide this triangle
					this.split(pTri);
				}
			}

			// Если треугольник поделен, продолжаем
			if (pTri.leftChild) {
				this.recursiveTessellate(pTri.leftChild,
					iMidpointX, iMidpointY, fRealMidPointZ,
					iCornerAX, iCornerAY, fCornerAZ,
					iCornerBX, iCornerBY, fCornerBZ,
					pVTree, iIndex<<1);

				this.recursiveTessellate(pTri.rightChild,
					iMidpointX, iMidpointY, fRealMidPointZ,
					iCornerCX, iCornerCY, fCornerCZ,
					iCornerAX, iCornerAY, fCornerAZ,
					pVTree, (iIndex<<1)+1);
			}
		}

		protected split(pTri: ITriTreeNode): void {
			// Если разбит то смысла разбивать еще нет
			if (pTri.leftChild){
				return;
			}

			// If this triangle is not in a proper diamond, force split our base neighbor
			if (pTri.baseNeighbor && (pTri.baseNeighbor.baseNeighbor !== pTri)){
				this.split(pTri.baseNeighbor);
			}
			// Create children and link into mesh
			pTri.leftChild  = this.terrainSystem.requestTriNode();
			pTri.rightChild = this.terrainSystem.requestTriNode();

			debug_assert(pTri.leftChild != pTri, "recursive link");
			debug_assert(pTri.rightChild != pTri, "recursive link");

			// Если не удалось выделить треугольник, то не разбиваем
			if ( (!pTri.leftChild) || (!pTri.rightChild)) {
				pTri.leftChild  = null;
				pTri.rightChild = null;
				return;
			}

			// Fill in the information we can get from the parent (neighbor pointers)
			pTri.leftChild.baseNeighbor  = pTri.leftNeighbor;
			pTri.leftChild.leftNeighbor  = pTri.rightChild;

			pTri.rightChild.baseNeighbor  = pTri.rightNeighbor;
			pTri.rightChild.rightNeighbor = pTri.leftChild;

			// Link our Left Neighbor to the new children
			if (pTri.leftNeighbor) {
				if (pTri.leftNeighbor.baseNeighbor == pTri) {
					pTri.leftNeighbor.baseNeighbor = pTri.leftChild;
				} else if (pTri.leftNeighbor.leftNeighbor == pTri) {
					pTri.leftNeighbor.leftNeighbor = pTri.leftChild;
				} else if (pTri.leftNeighbor.rightNeighbor == pTri) {
					pTri.leftNeighbor.rightNeighbor = pTri.leftChild;
				} else {
					console.log(pTri);
					WARNING("Invalid Left Neighbor!");
					CRITICAL("stop");
					// debugger;
				}
			}

			// Link our Right Neighbor to the new children
			if (pTri.rightNeighbor) {
				if (pTri.rightNeighbor.baseNeighbor == pTri) {
					pTri.rightNeighbor.baseNeighbor = pTri.rightChild;
				} else if (pTri.rightNeighbor.rightNeighbor == pTri) {
					pTri.rightNeighbor.rightNeighbor = pTri.rightChild;
				} else if (pTri.rightNeighbor.leftNeighbor == pTri) {
					pTri.rightNeighbor.leftNeighbor = pTri.rightChild;
				} else {
					WARNING("Invalid Right Neighbor!");
				}
			}

			// Link our Base Neighbor to the new children
			if (pTri.baseNeighbor) {
				if ( pTri.baseNeighbor.leftChild ) {
					pTri.baseNeighbor.leftChild.rightNeighbor = pTri.rightChild;
					pTri.baseNeighbor.rightChild.leftNeighbor = pTri.leftChild;
					pTri.leftChild.rightNeighbor = pTri.baseNeighbor.rightChild;
					pTri.rightChild.leftNeighbor = pTri.baseNeighbor.leftChild;
				} else {
					// Base Neighbor (in a diamond with us) was not split yet, so do that now.
					this.split(pTri.baseNeighbor);  
				}
			} else {
				// An edge triangle, trivial case.
				pTri.leftChild.rightNeighbor = null;
				pTri.rightChild.leftNeighbor = null;
			}
		}

		private _createRenderDataForVertexAndIndex(): bool {
			return true;
		}

		private _buildIndexBuffer(): bool {
			// this._iMaxIndices=a.TerrainROAM.MaxTriTreeNodes*3;
			this._iMaxIndices = this.terrainSystem.maxTriTreeNodes * 3;
			return true;
		}

		private _buildVertexBuffer(): bool {
			this._pWorldRect.z0 = MAX_FLOAT64;
			this._pWorldRect.z1 = MIN_FLOAT64;

			var nElementSize: uint = 0;
			if(this.terrainSystem._useVertexNormal()){
				nElementSize = (3/*кординаты вершин*/ + 3/*нормаль*/ + 2/*текстурные координаты*/);
			}
			else {
				nElementSize =  (3/*кординаты вершин*/ + 2/*текстурные координаты*/);
			}

			var pVerts: float[] = this.terrainSystem.verts;

			var v3fNormal: IVec3 = new Vec3();

			// размер ячейки сектора
			var v2fCellSize: IVec2 = new Vec2();
			v2fCellSize.set(this.heightX / (this._iXVerts-1),
				this.heightY / (this._iYVerts-1)); /*размер сектора/количество ячеек в секторе*/

			//Координаты вершина в секторе
			var v2fVert: IVec2 = new Vec2(); 
			v2fVert.set(0.0, 0.0);

			for (var y: uint = 0; y < this._iYVerts; ++y) {
				
				v2fVert.set(this._pWorldRect.x0, y * v2fCellSize.y+this._pWorldRect.y0);

				for (var x: uint = 0; x < this._iXVerts; ++x) {

					var fHeight: float = this.terrainSystem.readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

					pVerts[((y * this._iXVerts) + x) * nElementSize + 0 + this._iStartIndex * nElementSize] = v2fVert.x;
					pVerts[((y * this._iXVerts) + x) * nElementSize + 1 + this._iStartIndex * nElementSize] = v2fVert.y;
					pVerts[((y * this._iXVerts) + x) * nElementSize + 2 + this._iStartIndex * nElementSize] = fHeight;

					if(this.terrainSystem._useVertexNormal()){
						this.terrainSystem.readWorldNormal(v3fNormal, this._iHeightMapX + x, this._iHeightMapY + y);

						pVerts[((y * this._iXVerts) + x) * nElementSize + 3 + this._iStartIndex * nElementSize] = v3fNormal.x;
						pVerts[((y * this._iXVerts) + x) * nElementSize + 4 + this._iStartIndex * nElementSize] = v3fNormal.y;
						pVerts[((y * this._iXVerts) + x) * nElementSize + 5 + this._iStartIndex * nElementSize] = v3fNormal.z;

						pVerts[((y * this._iXVerts) + x) * nElementSize + 6 + this._iStartIndex * nElementSize] = (this._iSectorX + x / (this._iXVerts - 1))/this.terrainSystem.sectorCountX;
						pVerts[((y * this._iXVerts) + x) * nElementSize + 7 + this._iStartIndex * nElementSize] = (this._iSectorY + y / (this._iYVerts - 1))/this.terrainSystem.sectorCountY;
					}
					else {
						pVerts[((y * this._iXVerts) + x) * nElementSize + 3 + this._iStartIndex * nElementSize] = (this._iSectorX + x / (this._iXVerts - 1))/this.terrainSystem.sectorCountX;
						pVerts[((y * this._iXVerts) + x) * nElementSize + 4 + this._iStartIndex * nElementSize] = (this._iSectorY + y / (this._iYVerts - 1))/this.terrainSystem.sectorCountY;	
					}

					this._pWorldRect.z0 = math.min(this._pWorldRect.z0, fHeight);
					this._pWorldRect.z1 = math.max(this._pWorldRect.z1, fHeight);

					v2fVert.x += v2fCellSize.x;
				}
			}

			return true;
		}

		buildTriangleList(): void {
			this._iTempTotalIndices = this.terrainSystem.totalIndex;

			this._pTempIndexList = this.terrainSystem.index;
			this._iVertexID = this.terrainSystem.vertexId;
			// add all the triangles to the roamTerrain
			// in root triangle A


			this.recursiveBuildTriangleList(
				this._pRootTriangleA,
				0,this._iXVerts-1,(this._iYVerts-1)*this._iXVerts);

			// add all the triangles to the roamTerrain
			// in root triangle B
			this.recursiveBuildTriangleList(
				this._pRootTriangleB,
				(this._iYVerts*this._iXVerts)-1, (this._iYVerts-1)*this._iXVerts, this._iXVerts-1);

			this.terrainSystem.totalIndex = this._iTempTotalIndices;


			this._iTempTotalIndices = undefined;
			this._iVertexID = undefined;
			this._pTempIndexList = null;

		}

		protected recursiveBuildTriangleList(pTri: ITriTreeNode, iPointBase: uint, iPointLeft: uint, iPointRight: uint): void {
			if (pTri.leftChild) {

				if(!pTri.rightChild) {
					WARNING("invalid triangle node");
				}

				var iPointMid: uint = (iPointLeft + iPointRight) * 0.5;
				this.recursiveBuildTriangleList(
					pTri.leftChild,
					iPointMid, iPointBase, iPointLeft);
				this.recursiveBuildTriangleList(
					pTri.rightChild,
					iPointMid, iPointRight, iPointBase);

			} else if (this._iTempTotalIndices + 3 < this._iMaxIndices) {
				var nElementSize: uint = 0;
				if(this.terrainSystem._useVertexNormal()){
					nElementSize = (3/*кординаты вершин*/ + 3/*нормаль*/ + 2/*текстурные координаты*/);
				}
				else {
					nElementSize =  (3/*кординаты вершин*/ + 2/*текстурные координаты*/);
				}
				
				// add the local triangle to the index list

				this._pTempIndexList[this._iTempTotalIndices++]=((iPointRight+this._iStartIndex) * nElementSize * 4 + this._iVertexID)/4;
				this._pTempIndexList[this._iTempTotalIndices++]=((iPointLeft+this._iStartIndex) * nElementSize * 4 + this._iVertexID)/4;
				this._pTempIndexList[this._iTempTotalIndices++]=((iPointBase+this._iStartIndex) * nElementSize * 4 + this._iVertexID)/4;
			} else {
				debug_print("else", this._iTempTotalIndices, this._iMaxIndices)
			}
		}

		protected computeVariance(): void {
			var iTableWidth: uint = this.terrainSystem.tableWidth;
			var iTableHeight: uint = this.terrainSystem.tableHeight;

			var iIndex0: uint =  this.terrainSystem._tableIndex(this._iHeightMapX,						this._iHeightMapY);
			var iIndex1: uint =  this.terrainSystem._tableIndex(this._iHeightMapX,						this._iHeightMapY + this._iYVerts-1);
			var iIndex2: uint =  this.terrainSystem._tableIndex(this._iHeightMapX + this._iXVerts-1,	this._iHeightMapY + this._iYVerts-1);
			var iIndex3: uint =  this.terrainSystem._tableIndex(this._iHeightMapX + this._iXVerts-1,	this._iHeightMapY);

			var fHeight0: float = this.terrainSystem.readWorldHeight(iIndex0);
			var fHeight1: float = this.terrainSystem.readWorldHeight(iIndex1);
			var fHeight2: float = this.terrainSystem.readWorldHeight(iIndex2);
			var fHeight3: float = this.terrainSystem.readWorldHeight(iIndex3);

			this.recursiveComputeVariance(
				this._iHeightMapX, 					 this._iHeightMapY + this._iYVerts-1,
				this._iHeightMapX + this._iXVerts-1, this._iHeightMapY + this._iYVerts-1,
				this._iHeightMapX,					 this._iHeightMapY,
				fHeight1, fHeight2, fHeight0,
				this._pVarianceTreeA, 1);

			this.recursiveComputeVariance(
				this._iHeightMapX + this._iXVerts-1, this._iHeightMapY,
				this._iHeightMapX,					 this._iHeightMapY,
				this._iHeightMapX + this._iXVerts-1, this._iHeightMapY + this._iYVerts-1,
				fHeight3, fHeight0, fHeight2,
				this._pVarianceTreeB, 1);
		}

		protected recursiveComputeVariance(iCornerAX: uint, iCornerAY: uint,
										   iCornerBX: uint, iCornerBY: uint,
										   iCornerCX: uint, iCornerCY: uint,
										   fHeightA: float, fHeightB: float, fHeightC: float, pVTree: float[], iIndex: uint): float {
			if (iIndex < pVTree.length) {

				var iMidpointX: uint = (iCornerBX + iCornerCX) >> 1;
				var iMidpointY: uint = (iCornerBY + iCornerCY) >> 1;

				if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) &&
					(iMidpointY === iCornerBY || iMidpointY === iCornerCY)){
					return 0;
				}

				var fMidHeight: float = this.terrainSystem.readWorldHeight(iMidpointX, iMidpointY);
				var fInterpolatedHeight: float = (fHeightB + fHeightC)*0.5;
				var fVariance: float = math.abs(fMidHeight - fInterpolatedHeight);

				// find the variance of our children
				var fLeft: float = this.recursiveComputeVariance(
					iMidpointX, iMidpointY,
					iCornerAX,  iCornerAY,
					iCornerBX,  iCornerBY,
					fMidHeight, fHeightA, fHeightB,
					pVTree, iIndex<<1);

				var fRight: float = this.recursiveComputeVariance(
					iMidpointX, iMidpointY,
					iCornerCX,  iCornerCY,
					iCornerAX,  iCornerAY,
					fMidHeight, fHeightC, fHeightA,
					pVTree, 1+(iIndex<<1));

				// local variance is the minimum of all three
				fVariance = math.max(fVariance, fLeft);
				fVariance = math.max(fVariance, fRight);

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

		protected maxVariance(): void {
			var fVarianceMaxA: uint = 0;
			var fVarianceMaxB: uint = 0;
			for(var i: uint = 0; i < this._pVarianceTreeA.length; i++){
				if(fVarianceMaxA < this._pVarianceTreeA[i]){
					fVarianceMaxA = this._pVarianceTreeA[i];
				}

				if(fVarianceMaxB < this._pVarianceTreeB[i]){
					fVarianceMaxB = this._pVarianceTreeB[i];
				}
			}

			LOG("MAX ---> In A: " + fVarianceMaxA + ". In B: " + fVarianceMaxB);
		}

		protected minVariance(): void {
			var fVarianceMaxA: uint = 0xffffff;
			var fVarianceMaxB: uint = 0xffffff;

			for(var i: uint = 0; i < this._pVarianceTreeA.length; i++){
				if(fVarianceMaxA > this._pVarianceTreeA[i]  && this._pVarianceTreeA[i] !== 0){
					fVarianceMaxA = this._pVarianceTreeA[i];
				}

				if(fVarianceMaxB > this._pVarianceTreeB[i] && this._pVarianceTreeB[i] !== 0){
					fVarianceMaxB = this._pVarianceTreeB[i];
				}
			}

			LOG("MIN ---> In A: " + fVarianceMaxA + ". In B: " + fVarianceMaxB);
		}
		
		protected drawVariance(iIndex: uint, iCornerA: uint, iCornerB: uint, iCornerC: uint, pVTree: float[]): void {

			var iLevel: uint = math.floor(math.log(iIndex)/math.LN2);
			var iStart: uint = 3;
			if(iLevel >= iStart && iLevel < iStart + 4) {
				//#####################################################################################
				//Получение канваса
				var pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvasVariance"+(iLevel-iStart));
				var p2D = pCanvas.getContext("2d");
				// цвет фона

				p2D.fillStyle = "rgb(0,"+math.floor(pVTree[iIndex])+",0)"; 

				//#####################################################################################
				//Рисование треугольников

				//цвет линий
				p2D.strokeStyle = "#f00"; 
				p2D.lineWidth = 1;
				p2D.beginPath();
				var iTW: uint = this.terrainSystem.tableWidth;
				var iTH: uint = this.terrainSystem.tableHeight;

				var iXA: uint = iCornerA%iTW;
				var iYA: uint = math.floor(iCornerA/iTW);
				var iXB: uint = iCornerB%iTW;
				var iYB: uint = math.floor(iCornerB/iTW);
				var iXC: uint = iCornerC%iTW;
				var iYC: uint = math.floor(iCornerC/iTW);

				var iXMid: uint = math.floor((iXA+iXB+iXC)/3);
				var iYMid: uint = math.floor((iYA+iYB+iYC)/3);

				p2D.arc(math.floor(iXMid/iTW*pCanvas.width), math.floor(iYMid/iTH*pCanvas.height), 1, 0, math.PI*2, false);
				p2D.fill();
			}
		}
	}
}

#endif



