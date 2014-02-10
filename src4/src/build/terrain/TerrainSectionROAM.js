/// <reference path="../idl/ITerrainSectionROAM.ts" />
/// <reference path="TerrainROAM.ts" />
/// <reference path="TriangleNodePool.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (terrain) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        var TerrainSectionROAM = (function (_super) {
            __extends(TerrainSectionROAM, _super);
            function TerrainSectionROAM(pScene, eType) {
                if (typeof eType === "undefined") { eType = 69 /* TERRAIN_SECTION_ROAM */; }
                _super.call(this, pScene, eType);
                this._pTerrainSystem = null;
                //два дерева треугольников
                this._pRootTriangleA = akra.terrain.TriangleNodePool.createTriTreeNode();
                this._pRootTriangleB = akra.terrain.TriangleNodePool.createTriTreeNode();
                //Урове5нь погрещности для двух деревьев
                this._pVarianceTreeA = null;
                this._pVarianceTreeB = null;
                //расстояние от камеры до углов секции
                this._v3fDistance0 = new Vec3();
                this._v3fDistance1 = new Vec3();
                this._v3fDistance2 = new Vec3();
                this._v3fDistance3 = new Vec3();
                this._leftNeighborOfA = null;
                this._rightNeighborOfA = null;
                this._leftNeighborOfB = null;
                this._rightNeighborOfB = null;
                this._iStartIndex = undefined;
                this._iTempTotalIndices = undefined;
                this._pTempIndexList = undefined;
                this._iMaxIndices = undefined;
            }
            TerrainSectionROAM.prototype.getTerrainSystem = function () {
                return this._pTerrainSystem;
            };

            TerrainSectionROAM.prototype.getTriangleA = function () {
                return this._pRootTriangleA;
            };

            TerrainSectionROAM.prototype.getTriangleB = function () {
                return this._pRootTriangleB;
            };

            TerrainSectionROAM.prototype.getQueueSortValue = function () {
                return this._fQueueSortValue;
            };

            TerrainSectionROAM.prototype._internalCreate = function (pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect, iStartIndex) {
                akra.debug.assert(arguments.length === 9, "Not valid arguments count.");

                var iVerts = akra.math.max(iXVerts, iYVerts);
                this._iStartIndex = iStartIndex;

                var bResult = _super.prototype._internalCreate.call(this, pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iVerts, iVerts, pWorldRect);

                if (!this.getTerrainSystem().getUseTessellationThread()) {
                    this._initTessellationData();
                }

                return bResult;
            };

            TerrainSectionROAM.prototype._initTessellationData = function () {
                var iVerts = akra.math.max(this._iXVerts, this._iYVerts);
                this._iTotalDetailLevels = 2 * (akra.math.round(akra.math.log(iVerts - 1) / akra.math.LN2));
                this._iTotalVariances = 1 << this._iTotalDetailLevels;

                this._pVarianceTreeA = new Array(this._iTotalVariances);

                // this._pVarianceTreeA.set(0);
                this._pVarianceTreeB = new Array(this._iTotalVariances);

                for (var i = 0; i < this._iTotalVariances; i++) {
                    this._pVarianceTreeA[i] = 0;
                    this._pVarianceTreeB[i] = 0;
                }

                var pRoamTerrain = this.getTerrainSystem();
                var pNorthSection = pRoamTerrain.findSection(this._iSectorX, this._iSectorY - 1);
                var pSouthSection = pRoamTerrain.findSection(this._iSectorX, this._iSectorY + 1);
                var pEastSection = pRoamTerrain.findSection(this._iSectorX + 1, this._iSectorY);
                var pWestSection = pRoamTerrain.findSection(this._iSectorX - 1, this._iSectorY);

                if (pNorthSection) {
                    this._leftNeighborOfA = pNorthSection.getTriangleB();
                }

                if (pSouthSection) {
                    this._leftNeighborOfB = pSouthSection.getTriangleA();
                }

                if (pEastSection) {
                    this._rightNeighborOfB = pEastSection.getTriangleA();
                }

                if (pWestSection) {
                    this._rightNeighborOfA = pWestSection.getTriangleB();
                }

                // establish basic links
                this.reset();

                // build the variance trees
                this.computeVariance();
            };

            //private _v3fOldPosition:
            TerrainSectionROAM.prototype.prepareForRender = function (pViewport) {
                _super.prototype.prepareForRender.call(this, pViewport);

                var pCamera = pViewport.getCamera();

                if (!this.getTerrainSystem().resetWithCamera(pCamera)) {
                    return;
                }

                var v3fViewPoint = this.getTerrainSystem().getLocalCameraCoord();

                // compute view distance to our 4 corners
                var fHeight0 = this.getTerrainSystem().readWorldHeight(akra.math.ceil(this._iHeightMapX), akra.math.ceil(this._iHeightMapY));
                var fHeight1 = this.getTerrainSystem().readWorldHeight(akra.math.ceil(this._iHeightMapX), akra.math.ceil(this._iHeightMapY + this._iYVerts));
                var fHeight2 = this.getTerrainSystem().readWorldHeight(akra.math.ceil(this._iHeightMapX + this._iXVerts), akra.math.ceil(this._iHeightMapY + this._iYVerts));
                var fHeight3 = this.getTerrainSystem().readWorldHeight(akra.math.ceil(this._iHeightMapX + this._iXVerts), akra.math.ceil(this._iHeightMapY));

                this._v3fDistance0.set(v3fViewPoint.x - this._pWorldRect.x0, v3fViewPoint.y - this._pWorldRect.y0, v3fViewPoint.z - fHeight0);
                this._v3fDistance1.set(v3fViewPoint.x - this._pWorldRect.x0, v3fViewPoint.y - this._pWorldRect.y1, v3fViewPoint.z - fHeight1);
                this._v3fDistance2.set(v3fViewPoint.x - this._pWorldRect.x1, v3fViewPoint.y - this._pWorldRect.y1, v3fViewPoint.z - fHeight2);
                this._v3fDistance3.set(v3fViewPoint.x - this._pWorldRect.x1, v3fViewPoint.y - this._pWorldRect.y0, v3fViewPoint.z - fHeight3);

                this._fDistance0 = this._v3fDistance0.length();
                this._fDistance1 = this._v3fDistance1.length();
                this._fDistance2 = this._v3fDistance2.length();
                this._fDistance3 = this._v3fDistance3.length();

                // compute min distance as our sort value
                this._fQueueSortValue = akra.math.min(this._fDistance0, this._fDistance1);
                this._fQueueSortValue = akra.math.min(this._fQueueSortValue, this._fDistance2);
                this._fQueueSortValue = akra.math.min(this._fQueueSortValue, this._fDistance3);

                // submit to the tessellation queue of our parent
                this.getTerrainSystem().addToTessellationQueue(this);
            };

            TerrainSectionROAM.prototype.reset = function () {
                if (this.getTerrainSystem().getUseTessellationThread()) {
                    return;
                }

                this._pRootTriangleA.leftChild = null;
                this._pRootTriangleA.rightChild = null;
                this._pRootTriangleB.leftChild = null;
                this._pRootTriangleB.rightChild = null;

                this._pRootTriangleA.baseNeighbor = this._pRootTriangleB;
                this._pRootTriangleB.baseNeighbor = this._pRootTriangleA;

                // link to our neighbors
                this._pRootTriangleA.leftNeighbor = this._leftNeighborOfA;
                this._pRootTriangleA.rightNeighbor = this._rightNeighborOfA;
                this._pRootTriangleB.leftNeighbor = this._leftNeighborOfB;
                this._pRootTriangleB.rightNeighbor = this._rightNeighborOfB;
            };

            TerrainSectionROAM.prototype.tessellate = function (fScale, fLimit) {
                if (this.getTerrainSystem().getUseTessellationThread()) {
                    return;
                }

                var iIndex0 = this.getTerrainSystem()._tableIndex(this._iHeightMapX, this._iHeightMapY);
                var iIndex1 = this.getTerrainSystem()._tableIndex(this._iHeightMapX, this._iHeightMapY + this._iYVerts - 1);
                var iIndex2 = this.getTerrainSystem()._tableIndex(this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY + this._iYVerts - 1);
                var iIndex3 = this.getTerrainSystem()._tableIndex(this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY);

                var fHeight0 = this.getTerrainSystem().readWorldHeight(iIndex0);
                var fHeight1 = this.getTerrainSystem().readWorldHeight(iIndex1);
                var fHeight2 = this.getTerrainSystem().readWorldHeight(iIndex2);
                var fHeight3 = this.getTerrainSystem().readWorldHeight(iIndex3);

                this.recursiveTessellate(this._pRootTriangleA, this._iHeightMapX, this._iHeightMapY + this._iYVerts - 1, fHeight1, this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY + this._iYVerts - 1, fHeight2, this._iHeightMapX, this._iHeightMapY, fHeight0, this._pVarianceTreeA, 1);

                this.recursiveTessellate(this._pRootTriangleB, this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY, fHeight3, this._iHeightMapX, this._iHeightMapY, fHeight0, this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY + this._iYVerts - 1, fHeight2, this._pVarianceTreeB, 1);
            };

            TerrainSectionROAM.prototype.recursiveTessellate = function (pTri, iCornerAX, iCornerAY, fCornerAZ, iCornerBX, iCornerBY, fCornerBZ, iCornerCX, iCornerCY, fCornerCZ, pVTree, iIndex) {
                if ((iIndex << 1) + 1 > this._iTotalVariances) {
                    return;
                }

                var iMidpointX = (iCornerBX + iCornerCX) >> 1;
                var iMidpointY = (iCornerBY + iCornerCY) >> 1;

                if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) && (iMidpointY === iCornerBY || iMidpointY === iCornerCY)) {
                    return;
                }

                var fMidPointZ = (fCornerBZ + fCornerCZ) / 2;
                var fRealMidPointZ = this.getTerrainSystem().readWorldHeight(iMidpointX, iMidpointY);

                var v3fLoaclCameraCoord = this.getTerrainSystem().getLocalCameraCoord();
                var pTerrainExtents = this.getTerrainSystem().getWorldExtents();
                var iHeightMapWidth = this.getTerrainSystem().getTableWidth();
                var iHeightMapHeight = this.getTerrainSystem().getTableHeight();
                var fTerrainSizeZ = this.getTerrainSystem().getMaxHeight();
                var fTerrainDiagonal = this.getTerrainSystem().getTerrain2DLength();

                var fLocalMidX = pTerrainExtents.x0 + iMidpointX * pTerrainExtents.sizeX() / iHeightMapWidth;
                var fLocalMidY = pTerrainExtents.y0 + iMidpointY * pTerrainExtents.sizeY() / iHeightMapHeight;

                var fDistanceSquare = (v3fLoaclCameraCoord.x - fLocalMidX) * (v3fLoaclCameraCoord.x - fLocalMidX) + (v3fLoaclCameraCoord.y - fLocalMidY) * (v3fLoaclCameraCoord.y - fLocalMidY) + (v3fLoaclCameraCoord.z - fMidPointZ) * (v3fLoaclCameraCoord.z - fMidPointZ);

                // Если треугольник не поделен
                if (!pTri.leftChild) {
                    var fScale = this.getTerrainSystem().getTessellationScale();
                    var fLimit = this.getTerrainSystem().getTessellationLimit();

                    var fDistance = akra.math.sqrt(fDistanceSquare + 0.0001);
                    var fRatio = 0.;

                    fRatio = (pVTree[iIndex] / fTerrainSizeZ * fScale) / ((/*1 +*/ fDistance / fTerrainDiagonal) * fLimit);

                    if (fRatio > 1.) {
                        // subdivide this triangle
                        this.split(pTri);
                    }
                }

                // Если треугольник поделен, продолжаем
                if (pTri.leftChild) {
                    this.recursiveTessellate(pTri.leftChild, iMidpointX, iMidpointY, fRealMidPointZ, iCornerAX, iCornerAY, fCornerAZ, iCornerBX, iCornerBY, fCornerBZ, pVTree, iIndex << 1);

                    this.recursiveTessellate(pTri.rightChild, iMidpointX, iMidpointY, fRealMidPointZ, iCornerCX, iCornerCY, fCornerCZ, iCornerAX, iCornerAY, fCornerAZ, pVTree, (iIndex << 1) + 1);
                }
            };

            TerrainSectionROAM.prototype.split = function (pTri) {
                // Если разбит то смысла разбивать еще нет
                if (pTri.leftChild) {
                    return;
                }

                // If this triangle is not in a proper diamond, force split our base neighbor
                if (pTri.baseNeighbor && (pTri.baseNeighbor.baseNeighbor !== pTri)) {
                    this.split(pTri.baseNeighbor);
                }

                // Create children and link into mesh
                pTri.leftChild = this.getTerrainSystem().requestTriNode();
                pTri.rightChild = this.getTerrainSystem().requestTriNode();

                akra.debug.assert(pTri.leftChild != pTri, "recursive link");
                akra.debug.assert(pTri.rightChild != pTri, "recursive link");

                // Если не удалось выделить треугольник, то не разбиваем
                if ((!pTri.leftChild) || (!pTri.rightChild)) {
                    pTri.leftChild = null;
                    pTri.rightChild = null;
                    return;
                }

                // Fill in the information we can get from the parent (neighbor pointers)
                pTri.leftChild.baseNeighbor = pTri.leftNeighbor;
                pTri.leftChild.leftNeighbor = pTri.rightChild;

                pTri.rightChild.baseNeighbor = pTri.rightNeighbor;
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
                        akra.logger.warn("Invalid Left Neighbor!");
                        akra.logger.critical("stop");
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
                        akra.logger.warn("Invalid Right Neighbor!");
                    }
                }

                // Link our Base Neighbor to the new children
                if (pTri.baseNeighbor) {
                    if (pTri.baseNeighbor.leftChild) {
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
            };

            TerrainSectionROAM.prototype._createRenderDataForVertexAndIndex = function () {
                return true;
            };

            TerrainSectionROAM.prototype._buildIndexBuffer = function () {
                // this._iMaxIndices=a.TerrainROAM.MaxTriTreeNodes*3;
                this._iMaxIndices = this.getTerrainSystem().getMaxTriTreeNodes() * 3;
                return true;
            };

            TerrainSectionROAM.prototype._buildVertexBuffer = function () {
                this._pWorldRect.z0 = akra.MAX_FLOAT64;
                this._pWorldRect.z1 = akra.MIN_FLOAT64;

                var nElementSize = 0;
                if (this.getTerrainSystem()._useVertexNormal()) {
                    nElementSize = (3 + 3 + 2);
                } else {
                    nElementSize = (3 + 2);
                }

                var pVerts = this.getTerrainSystem().getVerts();

                var v3fNormal = new Vec3();

                // размер ячейки сектора
                var v2fCellSize = new Vec2();
                v2fCellSize.set(this.getHeightX() / (this._iXVerts - 1), this.getHeightY() / (this._iYVerts - 1)); /*размер сектора/количество ячеек в секторе*/

                //Координаты вершина в секторе
                var v2fVert = new Vec2();
                v2fVert.set(0.0, 0.0);

                for (var y = 0; y < this._iYVerts; ++y) {
                    v2fVert.set(this._pWorldRect.x0, y * v2fCellSize.y + this._pWorldRect.y0);

                    for (var x = 0; x < this._iXVerts; ++x) {
                        var fHeight = this.getTerrainSystem().readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

                        pVerts[((y * this._iXVerts) + x) * nElementSize + 0 + this._iStartIndex * nElementSize] = v2fVert.x;
                        pVerts[((y * this._iXVerts) + x) * nElementSize + 1 + this._iStartIndex * nElementSize] = v2fVert.y;
                        pVerts[((y * this._iXVerts) + x) * nElementSize + 2 + this._iStartIndex * nElementSize] = fHeight;

                        if (this.getTerrainSystem()._useVertexNormal()) {
                            this.getTerrainSystem().readWorldNormal(v3fNormal, this._iHeightMapX + x, this._iHeightMapY + y);

                            pVerts[((y * this._iXVerts) + x) * nElementSize + 3 + this._iStartIndex * nElementSize] = v3fNormal.x;
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 4 + this._iStartIndex * nElementSize] = v3fNormal.y;
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 5 + this._iStartIndex * nElementSize] = v3fNormal.z;

                            pVerts[((y * this._iXVerts) + x) * nElementSize + 6 + this._iStartIndex * nElementSize] = (this._iSectorX + x / (this._iXVerts - 1)) / this.getTerrainSystem().getSectorCountX();
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 7 + this._iStartIndex * nElementSize] = (this._iSectorY + y / (this._iYVerts - 1)) / this.getTerrainSystem().getSectorCountY();
                        } else {
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 3 + this._iStartIndex * nElementSize] = (this._iSectorX + x / (this._iXVerts - 1)) / this.getTerrainSystem().getSectorCountX();
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 4 + this._iStartIndex * nElementSize] = (this._iSectorY + y / (this._iYVerts - 1)) / this.getTerrainSystem().getSectorCountY();
                        }

                        this._pWorldRect.z0 = akra.math.min(this._pWorldRect.z0, fHeight);
                        this._pWorldRect.z1 = akra.math.max(this._pWorldRect.z1, fHeight);

                        v2fVert.x += v2fCellSize.x;
                    }
                }

                return true;
            };

            TerrainSectionROAM.prototype.buildTriangleList = function () {
                if (this.getTerrainSystem().getUseTessellationThread()) {
                    return;
                }

                this._iTempTotalIndices = this.getTerrainSystem().getTotalIndex();

                this._pTempIndexList = this.getTerrainSystem().getIndex();
                this._iVertexID = this.getTerrainSystem().getVertexId();

                // add all the triangles to the roamTerrain
                // in root triangle A
                this.recursiveBuildTriangleList(this._pRootTriangleA, 0, this._iXVerts - 1, (this._iYVerts - 1) * this._iXVerts);

                // add all the triangles to the roamTerrain
                // in root triangle B
                this.recursiveBuildTriangleList(this._pRootTriangleB, (this._iYVerts * this._iXVerts) - 1, (this._iYVerts - 1) * this._iXVerts, this._iXVerts - 1);

                this.getTerrainSystem().setTotalIndex(this._iTempTotalIndices);

                this._iTempTotalIndices = undefined;
                this._iVertexID = undefined;
                this._pTempIndexList = null;
            };

            TerrainSectionROAM.prototype.recursiveBuildTriangleList = function (pTri, iPointBase, iPointLeft, iPointRight) {
                if (pTri.leftChild) {
                    if (!pTri.rightChild) {
                        akra.logger.warn("invalid triangle node");
                    }

                    var iPointMid = (iPointLeft + iPointRight) * 0.5;
                    this.recursiveBuildTriangleList(pTri.leftChild, iPointMid, iPointBase, iPointLeft);
                    this.recursiveBuildTriangleList(pTri.rightChild, iPointMid, iPointRight, iPointBase);
                } else if (this._iTempTotalIndices + 3 < this._iMaxIndices) {
                    var nElementSize = 0;
                    if (this.getTerrainSystem()._useVertexNormal()) {
                        nElementSize = (3 + 3 + 2);
                    } else {
                        nElementSize = (3 + 2);
                    }

                    // add the local triangle to the index list
                    this._pTempIndexList[this._iTempTotalIndices++] = ((iPointRight + this._iStartIndex) * nElementSize * 4 + this._iVertexID) / 4;
                    this._pTempIndexList[this._iTempTotalIndices++] = ((iPointLeft + this._iStartIndex) * nElementSize * 4 + this._iVertexID) / 4;
                    this._pTempIndexList[this._iTempTotalIndices++] = ((iPointBase + this._iStartIndex) * nElementSize * 4 + this._iVertexID) / 4;
                } else {
                    akra.debug.log("else", this._iTempTotalIndices, this._iMaxIndices);
                }
            };

            TerrainSectionROAM.prototype.computeVariance = function () {
                var iTableWidth = this.getTerrainSystem().getTableWidth();
                var iTableHeight = this.getTerrainSystem().getTableHeight();

                var iIndex0 = this.getTerrainSystem()._tableIndex(this._iHeightMapX, this._iHeightMapY);
                var iIndex1 = this.getTerrainSystem()._tableIndex(this._iHeightMapX, this._iHeightMapY + this._iYVerts - 1);
                var iIndex2 = this.getTerrainSystem()._tableIndex(this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY + this._iYVerts - 1);
                var iIndex3 = this.getTerrainSystem()._tableIndex(this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY);

                var fHeight0 = this.getTerrainSystem().readWorldHeight(iIndex0);
                var fHeight1 = this.getTerrainSystem().readWorldHeight(iIndex1);
                var fHeight2 = this.getTerrainSystem().readWorldHeight(iIndex2);
                var fHeight3 = this.getTerrainSystem().readWorldHeight(iIndex3);

                this.recursiveComputeVariance(this._iHeightMapX, this._iHeightMapY + this._iYVerts - 1, this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY + this._iYVerts - 1, this._iHeightMapX, this._iHeightMapY, fHeight1, fHeight2, fHeight0, this._pVarianceTreeA, 1);

                this.recursiveComputeVariance(this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY, this._iHeightMapX, this._iHeightMapY, this._iHeightMapX + this._iXVerts - 1, this._iHeightMapY + this._iYVerts - 1, fHeight3, fHeight0, fHeight2, this._pVarianceTreeB, 1);
            };

            TerrainSectionROAM.prototype.recursiveComputeVariance = function (iCornerAX, iCornerAY, iCornerBX, iCornerBY, iCornerCX, iCornerCY, fHeightA, fHeightB, fHeightC, pVTree, iIndex) {
                if (iIndex < pVTree.length) {
                    var iMidpointX = (iCornerBX + iCornerCX) >> 1;
                    var iMidpointY = (iCornerBY + iCornerCY) >> 1;

                    if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) && (iMidpointY === iCornerBY || iMidpointY === iCornerCY)) {
                        return 0;
                    }

                    var fMidHeight = this.getTerrainSystem().readWorldHeight(iMidpointX, iMidpointY);
                    var fInterpolatedHeight = (fHeightB + fHeightC) * 0.5;
                    var fVariance = akra.math.abs(fMidHeight - fInterpolatedHeight);

                    // find the variance of our children
                    var fLeft = this.recursiveComputeVariance(iMidpointX, iMidpointY, iCornerAX, iCornerAY, iCornerBX, iCornerBY, fMidHeight, fHeightA, fHeightB, pVTree, iIndex << 1);

                    var fRight = this.recursiveComputeVariance(iMidpointX, iMidpointY, iCornerCX, iCornerCY, iCornerAX, iCornerAY, fMidHeight, fHeightC, fHeightA, pVTree, 1 + (iIndex << 1));

                    // local variance is the minimum of all three
                    fVariance = akra.math.max(fVariance, fLeft);
                    fVariance = akra.math.max(fVariance, fRight);

                    // store the variance as 1/(variance+1)
                    pVTree[iIndex] = fVariance;

                    // this.drawVariance(iIndex,
                    // 	this.getTerrainSystem()._tableIndex(iCornerAX, iCornerAY),
                    // 	this.getTerrainSystem()._tableIndex(iCornerBX, iCornerBY),
                    // 	this.getTerrainSystem()._tableIndex(iCornerCX, iCornerCY), pVTree);
                    return fVariance;
                }

                // return a value which will be ignored by the parent
                // (because the minimum function is used with this result)
                return 0;
            };

            TerrainSectionROAM.prototype.maxVariance = function () {
                var fVarianceMaxA = 0;
                var fVarianceMaxB = 0;
                for (var i = 0; i < this._pVarianceTreeA.length; i++) {
                    if (fVarianceMaxA < this._pVarianceTreeA[i]) {
                        fVarianceMaxA = this._pVarianceTreeA[i];
                    }

                    if (fVarianceMaxB < this._pVarianceTreeB[i]) {
                        fVarianceMaxB = this._pVarianceTreeB[i];
                    }
                }

                akra.logger.log("MAX ---> In A: " + fVarianceMaxA + ". In B: " + fVarianceMaxB);
            };

            TerrainSectionROAM.prototype.minVariance = function () {
                var fVarianceMaxA = 0xffffff;
                var fVarianceMaxB = 0xffffff;

                for (var i = 0; i < this._pVarianceTreeA.length; i++) {
                    if (fVarianceMaxA > this._pVarianceTreeA[i] && this._pVarianceTreeA[i] !== 0) {
                        fVarianceMaxA = this._pVarianceTreeA[i];
                    }

                    if (fVarianceMaxB > this._pVarianceTreeB[i] && this._pVarianceTreeB[i] !== 0) {
                        fVarianceMaxB = this._pVarianceTreeB[i];
                    }
                }

                akra.logger.log("MIN ---> In A: " + fVarianceMaxA + ". In B: " + fVarianceMaxB);
            };

            TerrainSectionROAM.prototype.drawVariance = function (iIndex, iCornerA, iCornerB, iCornerC, pVTree) {
                var iLevel = akra.math.floor(akra.math.log(iIndex) / akra.math.LN2);
                var iStart = 3;
                if (iLevel >= iStart && iLevel < iStart + 4) {
                    //#####################################################################################
                    //Получение канваса
                    var pCanvas = document.getElementById("canvasVariance" + (iLevel - iStart));
                    var p2D = pCanvas.getContext("2d");

                    // цвет фона
                    p2D.fillStyle = "rgb(0," + akra.math.floor(pVTree[iIndex]) + ",0)";

                    //#####################################################################################
                    //Рисование треугольников
                    //цвет линий
                    p2D.strokeStyle = "#f00";
                    p2D.lineWidth = 1;
                    p2D.beginPath();
                    var iTW = this.getTerrainSystem().getTableWidth();
                    var iTH = this.getTerrainSystem().getTableHeight();

                    var iXA = iCornerA % iTW;
                    var iYA = akra.math.floor(iCornerA / iTW);
                    var iXB = iCornerB % iTW;
                    var iYB = akra.math.floor(iCornerB / iTW);
                    var iXC = iCornerC % iTW;
                    var iYC = akra.math.floor(iCornerC / iTW);

                    var iXMid = akra.math.floor((iXA + iXB + iXC) / 3);
                    var iYMid = akra.math.floor((iYA + iYB + iYC) / 3);

                    p2D.arc(akra.math.floor(iXMid / iTW * pCanvas.width), akra.math.floor(iYMid / iTH * pCanvas.height), 1, 0, akra.math.PI * 2, false);
                    p2D.fill();
                }
            };
            return TerrainSectionROAM;
        })(akra.terrain.TerrainSection);
        terrain.TerrainSectionROAM = TerrainSectionROAM;
    })(akra.terrain || (akra.terrain = {}));
    var terrain = akra.terrain;
})(akra || (akra = {}));
//# sourceMappingURL=TerrainSectionROAM.js.map
