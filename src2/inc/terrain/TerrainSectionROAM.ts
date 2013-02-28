#ifndef TERRAINROAM_TS
#define TERRAINROAM_TS

#include "ITerrainSystemROAM.ts"

module akra {
	export class TerrainSystemROAM implements ITerrainSystemROAM extends ITerrain{
		private _iTotalDetailLevels: uint;
		private _iTotalVariances: uint;
		private _iOffsetInVertexBuffer: uint;

		//два дерева треугольников
		private _pRootTriangleA: ITriTreeNode = new TriTreeNode();
		private _pRootTriangleB: ITriTreeNode = new TriTreeNode();

		//Урове5нь погрещности для двух деревьев
		private _pVarianceTreeA: Array = null
		private _pVarianceTreeB: Array = null

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


		private _pLeftNeighborOfA = null;
		private _pRightNeighborOfA = null;
		private _pLeftNeighborOfB = null;
		private _pRightNeighborOfB = null;

	    private _pEngine: IEngine = pEngine;

		constructor(pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		inline get triangleA(): ITriTreeNode {
			return this._pRootTriangleA;
		}

		inline get triangleB(): ITriTreeNode {
			return this._pRootTriangleA;
		}

		inline get queueSortValue(): float {
			return this._fQueueSortValue;
		}

		create(pRootNode: ISceneNode, pParentSystem, iSectorX: uint, iSectorY: uint, iHeightMapX: uint, iHeightMapY: uint, iXVerts: uint, iYVerts: uint, pWorldRect: IRec3d, iStartIndex: uint): bool {
			iVerts=Math.max(iXVerts,iYVerts)
			this._iStartIndex=iStartIndex;

			var bResult: bool = TerrainSection.prototype.create.call(this, pRootNode, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iVerts, iVerts, pWorldRect);

			this._iTotalDetailLevels=Math.ceil(Math.log(iVerts)/Math.LN2)*2-1;
			this._iTotalVariances=1<<this._iTotalDetailLevels;


			this._pVarianceTreeA = new Array( this._iTotalVariances);
			this._pVarianceTreeA.set(0);

			this._pVarianceTreeB = new Array(this._iTotalVariances);
			this._pVarianceTreeB.set(0);

			var pRoamTerrain: ITerrainSystem = this.getTerrainSystem();
			var pNorthSection = pRoamTerrain.findSection(iSectorX, iSectorY-1);
			var pSouthSection = pRoamTerrain.findSection(iSectorX, iSectorY+1);
			var pEastSection  = pRoamTerrain.findSection(iSectorX+1, iSectorY);
			var pWestSection  = pRoamTerrain.findSection(iSectorX-1, iSectorY);

			if (pNorthSection) {
				this._pLeftNeighborOfA = pNorthSection.getTriangleB();
			}

			if (pSouthSection) {
				this._pLeftNeighborOfB = pSouthSection.getTriangleA();
			}

			if (pEastSection) {
				this._pRightNeighborOfB = pEastSection.getTriangleA();
			}

			if (pWestSection) {
				this._pRightNeighborOfA = pWestSection.getTriangleB();
			}

			// establish basic links
			this.reset();

			// build the variance trees
			this.computeVariance();

			return bResult;
		}

		prepareForRender(): void {
			TerrainSection.prototype.prepareForRender.call(this);

			var pCamera: ICamera = this._pEngine.getActiveCamera();

			var v3fViewPoint: IVec3 = pCamera.worldPosition();
			// compute view distance to our 4 corners
			var fHeight0: float = this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX),					Math.ceil(this._iHeightMapY));
			var fHeight1: float = this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX), 				Math.ceil(this._iHeightMapY + this._iYVerts));
			var fHeight2: float = this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX + this._iXVerts), Math.ceil(this._iHeightMapY));
			var fHeight3: float = this.getTerrainSystem().readWorldHeight(Math.ceil(this._iHeightMapX + this._iXVerts), Math.ceil(this._iHeightMapY + this._iYVerts));


			this._v3fDistance0.set(v3fViewPoint.x-this._pWorldRect.fX0,v3fViewPoint.y-this._pWorldRect.fY0,v3fViewPoint.z-fHeight0);
			this._v3fDistance1.set(v3fViewPoint.x-this._pWorldRect.fX0,v3fViewPoint.y-this._pWorldRect.fY1,v3fViewPoint.z-fHeight1);
			this._v3fDistance2.set(v3fViewPoint.x-this._pWorldRect.fX1,v3fViewPoint.y-this._pWorldRect.fY1,v3fViewPoint.z-fHeight2);
			this._v3fDistance3.set(v3fViewPoint.x-this._pWorldRect.fX1,v3fViewPoint.y-this._pWorldRect.fY0,v3fViewPoint.z-fHeight3);

			this._fDistance0=this._v3fDistance0.length();
			this._fDistance1=this._v3fDistance1.length();
			this._fDistance2=this._v3fDistance2.length();
			this._fDistance3=this._v3fDistance3.length();

			// compute min distance as our sort value
			this._fQueueSortValue = Math.min(this._v3fDistance0.length() , this._v3fDistance1.length());
			this._fQueueSortValue = Math.min(this._fQueueSortValue, this._v3fDistance2.length());
			this._fQueueSortValue = Math.min(this._fQueueSortValue, this._v3fDistance3.length());


			// submit to the tessellation queue of our parent
			this.getTerrainSystem().addToTessellationQueue(this);
		}

		reset(): void {
			this._pRootTriangleA.pLeftChild  = null;
			this._pRootTriangleA.pRightChild = null;
			this._pRootTriangleB.pLeftChild  = null;
			this._pRootTriangleB.pRightChild = null;

			this._pRootTriangleA.pBaseNeighbor = this._pRootTriangleB;
			this._pRootTriangleB.pBaseNeighbor = this._pRootTriangleA;

			// link to our neighbors
			this._pRootTriangleA.pLeftNeighbor  = this._pLeftNeighborOfA;
			this._pRootTriangleA.pRightNeighbor = this._pRightNeighborOfA;
			this._pRootTriangleB.pLeftNeighbor  = this._pLeftNeighborOfB;
			this._pRootTriangleB.pRightNeighbor = this._pRightNeighborOfB;
		}

		tessellate(fScale: float, fLimit: float): void {
			this.recursiveTessellate(
				this._pRootTriangleA,
				this._fDistance1, this._fDistance2, this._fDistance0, //
				this._pVarianceTreeA, 1,
				fScale, fLimit);

			this.recursiveTessellate(
			    this._pRootTriangleB,
				this._fDistance3, this._fDistance0, this._fDistance2,
			    this._pVarianceTreeB, 1,
			    fScale, fLimit);
		}

		recursiveTessellate(pTri: ITriTreeNode, fDistA: float, fDistB: float, fDistC: float, pVTree, iIndex: uint, fScale: float, fLimit: float): void {
			if ((iIndex<<1)+1 < this._iTotalVariances) {
				//console.log("vIndex",vIndex,"totalVariances",this._totalVariances)
				var fMidDist = (distB+distC)* 0.5;


				// Если треугольник не поделен
				if (!pTri.pLeftChild) {

					var fRatio = (pVTree[iIndex]*fScale)/(fMidDist+0.0001);// Math.pow(fMidDist+0.0001,fLimit);
					if (fRatio > 1) {
						// subdivide this triangle
						//console.log("split");
						this.split(pTri);
					}
				}

				// Если треугольник поделен, продолжаем
				if (pTri.pLeftChild) {
					//debug_assert(tri->leftChild, "invalid triangle node");
					//debug_assert(tri->rightChild, "invalid triangle node");

					this.recursiveTessellate(pTri.pLeftChild,
						fMidDist, distA,distB,
						pVTree, iIndex<<1,
						fScale, fLimit);

					this.recursiveTessellate(pTri.pRightChild,
						fMidDist,distC,distA,
						pVTree, (iIndex<<1)+1,
						fScale, fLimit);
				}
			}
		}

		split(pTri: ITriTreeNode): void {
			// Если разбит то смысла разбивать еще нет
			if (pTri.pLeftChild){
				return;
			}

			// If this triangle is not in a proper diamond, force split our base neighbor
			if (pTri.pBaseNeighbor && (pTri.pBaseNeighbor.pBaseNeighbor!=pTri)){
				this.split(pTri.pBaseNeighbor);
			}
			// Create children and link into mesh
			pTri.pLeftChild  = this.getTerrainSystem().requestTriNode();
			pTri.pRightChild = this.getTerrainSystem().requestTriNode();

			//debug_assert(pTri.leftChild != pTri, "recursive link");
			//debug_assert(pTri.rightChild != pTri, "recursive link");

			// Если не удалось выделить треугольник, то не разбиваем
			if ( (!pTri.pLeftChild) || (!pTri.pRightChild)) {
				pTri.pLeftChild  = null;
				pTri.pRightChild = null;
				return;
			}

			// Fill in the information we can get from the parent (neighbor pointers)
			pTri.pLeftChild.pBaseNeighbor  = pTri.pLeftNeighbor;
			pTri.pLeftChild.pLeftNeighbor  = pTri.pRightChild;

			pTri.pRightChild.pBaseNeighbor  = pTri.pRightNeighbor;
			pTri.pRightChild.pRightNeighbor = pTri.pLeftChild;

			// Link our Left Neighbor to the new children
			if (pTri.pLeftNeighbor) {
				if (pTri.pLeftNeighbor.pBaseNeighbor == pTri) {
					pTri.pLeftNeighbor.pBaseNeighbor = pTri.pLeftChild;
				} else if (pTri.pLeftNeighbor.pLeftNeighbor == pTri) {
					pTri.pLeftNeighbor.pLeftNeighbor = pTri.pLeftChild;
				} else if (pTri.pLeftNeighbor.pRightNeighbor == pTri) {
					pTri.pLeftNeighbor.pRightNeighbor = pTri.pLeftChild;
				} else {
					console.log(pTri);
					debug_assert(0, "Invalid Left Neighbor!");
					debugger;
				}
			}

			// Link our Right Neighbor to the new children
			if (pTri.pRightNeighbor) {
				if (pTri.pRightNeighbor.pBaseNeighbor == pTri) {
					pTri.pRightNeighbor.pBaseNeighbor = pTri.pRightChild;
				} else if (pTri.pRightNeighbor.pRightNeighbor == pTri) {
					pTri.pRightNeighbor.pRightNeighbor = pTri.pRightChild;
				} else if (pTri.pRightNeighbor.pLeftNeighbor == pTri) {
					pTri.pRightNeighbor.pLeftNeighbor = pTri.pRightChild;
				} else {
					debug_assert(0, "Invalid Right Neighbor!");
				}
			}

			// Link our Base Neighbor to the new children
			if (pTri.pBaseNeighbor) {
				if ( pTri.pBaseNeighbor.pLeftChild ) {
					pTri.pBaseNeighbor.pLeftChild.pRightNeighbor = pTri.pRightChild;
					pTri.pBaseNeighbor.pRightChild.pLeftNeighbor = pTri.pLeftChild;
					pTri.pLeftChild.pRightNeighbor = pTri.pBaseNeighbor.pRightChild;
					pTri.pRightChild.pLeftNeighbor = pTri.pBaseNeighbor.pLeftChild;
				} else {
					this.split( pTri.pBaseNeighbor);  // Base Neighbor (in a diamond with us) was not split yet, so do that now.
				}
			} else {
				// An edge triangle, trivial case.
				pTri.pLeftChild.pRightNeighbor = null;
				pTri.pRightChild.pLeftNeighbor = null;
			}
		}

		private _createRenderDataForVertexAndIndex(): bool {
			return true;
		}

		private _buildIndexBuffer(): bool {
			this._iMaxIndices=a.TerrainROAM.MaxTriTreeNodes*3;
			return true;
		}

		private _buildVertexBuffer(): bool {
			this._pWorldRect.fZ0 = MAX_REAL32;
			this._pWorldRect.fZ1 = MIN_REAL32;

			var pVerts = this.getTerrainSystem().getVerts();

			var v3fNormal: IVec3 = new Vec3();

			// размер ячейки сектора
			var v2fCellSize: IVec2 = new Vec2();
			v2fCellSize.set(this.heightX / (this._iXVerts-1),
				this.heightY / (this._iYVerts-1)); /*размер сектора/количество ячеек в секторе*/

			//Координаты вершина в секторе
			var v2fVert: IVec2 = new Vec2(); 
			v2fVert.set(0.0, 0.0);

			//console.log("-->",this._iSectorX,this._iSectorY,"--",this._pWorldRect.fX0,this._pWorldRect.fY0,"--",this._iXVerts,this._iYVerts)
			//console.log("--",v2fCellSize.X,v2fCellSize.Y,this.getHeightX(),this.getHeightY() )


			for (var y: uint = 0; y < this._iYVerts; ++y) {
				v2fVert.set(this._pWorldRect.fX0, y * v2fCellSize.y+this._pWorldRect.fY0);
				for (var x: uint = 0; x < this._iXVerts; ++x) {

					var fHeight: float = this.getTerrainSystem().readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

					pVerts[((y * this._iXVerts) + x) * 5 + 0+this._iStartIndex*5] = v2fVert.x;
					pVerts[((y * this._iXVerts) + x) * 5 + 1+this._iStartIndex*5] = v2fVert.y;
					pVerts[((y * this._iXVerts) + x) * 5 + 2+this._iStartIndex*5] = fHeight;

					//console.log(y*this._iXVerts + x,x,y,v2fVert.X,v2fVert.Y,fHeight);
					//	pVerts[((y * this._iXVerts) + x) * 10 + 2],pVerts[((y * this._iXVerts) + x) * 10 + 1]);

					pVerts[((y * this._iXVerts) + x) * 5 + 3+this._iStartIndex*5] = (this._iSectorX + x / (this._iXVerts - 1))/this.getTerrainSystem().getSectorCountX();
					pVerts[((y * this._iXVerts) + x) * 5 + 4+this._iStartIndex*5] = (this._iSectorY+ y / (this._iYVerts - 1))/this.getTerrainSystem().getSectorCountY() ;


					//console.log(this._iSectorX,this.getTerrainSystem().getSectorCountX(), x,this._iXVerts);
					//console.log(this._iSectorX/this.getTerrainSystem().getSectorCountX() + x / (this._iXVerts - 1));

					this._pWorldRect.fZ0 = Math.min(this._pWorldRect.fZ0, fHeight);
					this._pWorldRect.fZ1 = Math.max(this._pWorldRect.fZ1, fHeight);

					v2fVert.x += v2fCellSize.x;
				}
			}

			return true;
		}

		buildTriangleList(): void {
			this._iTempTotalIndices=this.getTerrainSystem().getTotalIndex();

			this._pTempIndexList=this.getTerrainSystem().getIndex();
			this._iVertexID=this.getTerrainSystem().getVertexID();
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

			this.getTerrainSystem().setTotalIndex(this._iTempTotalIndices);
			this._iTempTotalIndices=undefined;
			this._iVertexID=undefined;
			this._pTempIndexList=null;
		}

		render(): void {
			this.getTerrainSystem().render(this.worldMatrix());
		}

		recursiveBuildTriangleList(pTri: ITriTreeNode, iPointBase: uint, iPointLeft: uint, iPointRight: uint): void {
			if (pTri.pLeftChild) {

				if(!pTri.pRightChild) {
					warning("invalid triangle node");
				}

				var iPointMid: uint = (iPointLeft + iPointRight) * 0.5;
				this.recursiveBuildTriangleList(
					pTri.pLeftChild,
					iPointMid, iPointBase, iPointLeft);
				this.recursiveBuildTriangleList(
					pTri.pRightChild,
					iPointMid, iPointRight, iPointBase);

			} else if (this._iTempTotalIndices + 3 < this._iMaxIndices) {
				// add the local triangle to the index list
				//20 = 5(элементов) * 4(бита)
				this._pTempIndexList[this._iTempTotalIndices++]=((iPointRight+this._iStartIndex)*20+ this._iVertexID)/4;
				this._pTempIndexList[this._iTempTotalIndices++]=((iPointLeft+this._iStartIndex)*20 + this._iVertexID)/4;
				this._pTempIndexList[this._iTempTotalIndices++]=((iPointBase+this._iStartIndex)*20 + this._iVertexID)/4;
			} else {
				console.log("else",this._iTempTotalIndices, this._iMaxIndices)
			}
		}

		computeVariance(): void {
			var iTableWidth: uint = this.getTerrainSystem().tableWidth();
			var iTableHeight: uint = this.getTerrainSystem().tableHeight();

			var iIndex0: uint =  this.getTerrainSystem().tableIndex(this._iHeightMapX,					this._iHeightMapY);
			var iIndex1: uint =  this.getTerrainSystem().tableIndex(this._iHeightMapX,					this._iHeightMapY+this._iYVerts-1);
			var iIndex2: uint =  this.getTerrainSystem().tableIndex(this._iHeightMapX+this._iXVerts-1,	this._iHeightMapY+this._iYVerts-1);
			var iIndex3: uint =  this.getTerrainSystem().tableIndex(this._iHeightMapX+this._iXVerts-1,	this._iHeightMapY);

			var fHeight0: float = this.getTerrainSystem().readWorldHeight(iIndex0);
			var fHeight1: float = this.getTerrainSystem().readWorldHeight(iIndex1);
			var fHeight2: float = this.getTerrainSystem().readWorldHeight(iIndex2);
			var fHeight3: float = this.getTerrainSystem().readWorldHeight(iIndex3);

			//console.error(iIndex0, iIndex1, iIndex2, iIndex3);

			this.recursiveComputeVariance(
				iIndex1, iIndex2, iIndex0,
				fHeight1, fHeight2, fHeight0,
				this._pVarianceTreeA, 1);

			this.recursiveComputeVariance(
				iIndex3, iIndex0, iIndex2,
				fHeight3, fHeight0, fHeight2,
				this._pVarianceTreeB, 1);
		}

		recursiveComputeVariance(iCornerA: uint, iCornerB: uint, iCornerC: uint, fHeightA: float, fHeightB: float, fHeightC: float, pVTree, iIndex: uint): float {
			if (iIndex < pVTree.length) {
				var iMidpoint: uint = (iCornerB+iCornerC)>>1;
				//console.log(iCornerA, iCornerB, iCornerC,'mid point --->', iMidpoint);
				var fMidHeight: float = this.getTerrainSystem().readWorldHeight(iMidpoint);


				var iTW: uint = this.getTerrainSystem()._iTableWidth;
				var iTH: uint = this.getTerrainSystem()._iTableHeight;
				var iXB: uint = iCornerB%iTW;
				var iYB: uint = Math.floor(iCornerB/iTW);
				var iXC: uint = iCornerC%iTW;
				var iYC: uint = Math.floor(iCornerC/iTW);
				var pWorldSize = this.getTerrainSystem().worldSize();
				var fLX: float = Math.abs(iXB-iXC)/iTW*pWorldSize.x;
				var fLY: float = Math.abs(iYB-iYC)/iTH*pWorldSize.y;
				var fX: float = Math.sqrt(fLY*fLY+fLX*fLX);
				var fY: float = Math.abs(fHeightB-fHeightC);

				var fInterpolatedHeight: float = (fHeightB+fHeightC)*0.5;
				var fVariance: float = Math.abs(fMidHeight - fInterpolatedHeight);

				if(fX < fY) {
					fVariance = fInterpolatedHeight*fX/fY
				}

				// find the variance of our children
				var fLeft: float = this.recursiveComputeVariance(
					iMidpoint, iCornerA, iCornerB,
					fMidHeight, fHeightA, fHeightB,
					pVTree, iIndex<<1);

				var fRight: float = this.recursiveComputeVariance(
					iMidpoint, iCornerC, iCornerA,
					fMidHeight, fHeightC, fHeightA,
					pVTree, 1+(iIndex<<1));

				// local variance is the minimum of all three
				fVariance = Math.max(fVariance, fLeft);
				fVariance = Math.max(fVariance, fRight);

				// store the variance as 1/(variance+1)
				pVTree[iIndex] = fVariance;


				//this.drawVariance(iIndex,iCornerA, iCornerB, iCornerC,pVTree);

				return fVariance;
			}
			// return a value which will be ignored by the parent
			// (because the minimum function is used with this result)
			return 0;
		}
		
		drawVariance(iIndex: uint, iCornerA: uint, iCornerB: uint, iCornerC: uint, pVTree): void {
			var iLevel: uint = Math.floor(Math.log(iIndex)/Math.LN2)
			var iStart: uint = 0
			if(iLevel >= iStart && iLevel < iStart + 4) {
				//#####################################################################################
				//Получение канваса
				var pCanvas = document.getElementById("variance"+(iLevel-iStart));
				var p2D = pCanvas.getContext("2d");
				p2D.fillStyle = "rgb(0,"+Math.floor(pVTree[iIndex])+",0)"; // цвет фона

				//p2D.fillRect(0, 0, pCanvas.width, pCanvas.height);


				//#####################################################################################
				//Рисование треугольников

				p2D.strokeStyle = "#f00"; //цвет линий
				p2D.lineWidth = 1;
				p2D.beginPath();
				var iTW: uint = this.getTerrainSystem()._iTableWidth;
				var iTH: uint = this.getTerrainSystem()._iTableHeight;

				var iXA: uint = iCornerA%iTW;
				var iYA: uint = Math.floor(iCornerA/iTW);
				var iXB: uint = iCornerB%iTW;
				var iYB: uint = Math.floor(iCornerB/iTW);
				var iXC: uint = iCornerC%iTW;
				var iYC: uint = Math.floor(iCornerC/iTW);

				var iXMid: uint = Math.floor((iXA+iXB+iXC)/3);
				var iYMid: uint = Math.floor((iYA+iYB+iYC)/3);

				//console.log(iXMid/iTW*pCanvas.width,iYMid/iTH*pCanvas.height, Math.floor(iXMid/iTW*pCanvas.width),Math.floor(iYMid/iTH*pCanvas.height));
				//console.warn(iXMid,iYMid)
				p2D.arc(Math.floor(iXMid/iTW*pCanvas.width),Math.floor(iYMid/iTH*pCanvas.height),5, 0, Math.PI*2, false);
				p2D.fill();
				//console.log("Total ",pSec._iTotalIndices);
				//console.log(this);
			}
		}
	}
}

#endif



