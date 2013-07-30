var pTmpTransferableArray = [null];

var ECommandTypes;
(function (ECommandTypes) {
    ECommandTypes[ECommandTypes["INITTERRAIN"] = 1] = "INITTERRAIN";
    ECommandTypes[ECommandTypes["HEIGHTMAP"] = 2] = "HEIGHTMAP";
    ECommandTypes[ECommandTypes["UPDATEPARAMS"] = 3] = "UPDATEPARAMS";

    ECommandTypes[ECommandTypes["TESSELATE"] = 4] = "TESSELATE";
})(ECommandTypes || (ECommandTypes = {}));

(self).onmessage = function (event) {
    if (event.data instanceof ArrayBuffer) {
        processTesselate(event.data);
    } else {
        var pCommand = event.data;
        switch (pCommand.type) {
            case ECommandTypes.INITTERRAIN:
                processInitTerrain(pCommand.info);
                return;
            case ECommandTypes.UPDATEPARAMS:
                processUpdateParams(pCommand.info);
                return;
        }
    }
};

/*export*/ function createTriTreeNode() {
    return {
        baseNeighbor: null,
        leftNeighbor: null,
        rightNeighbor: null,
        leftChild: null,
        rightChild: null
    };
}

/*export*/ var TriangleNodePool = (function () {
    function TriangleNodePool(iCount) {
        this._iNextTriNode = 0;
        this._iMaxCount = 0;
        this._pPool = null;
        this._iMaxCount = iCount;
        this._pPool = new Array(iCount);

        for (var i = 0; i < this._iMaxCount; i++) {
            this._pPool[i] = createTriTreeNode();
        }
    }
    TriangleNodePool.prototype.request = function () {
        if (this._iNextTriNode >= this._iMaxCount) {
            return null;
        } else {
            var pNode = this._pPool[this._iNextTriNode];
            pNode.baseNeighbor = null;
            pNode.leftNeighbor = null;
            pNode.rightNeighbor = null;
            pNode.leftChild = null;
            pNode.rightChild = null;
            this._iNextTriNode++;
            return pNode;
        }
    };

    TriangleNodePool.prototype.reset = function () {
        this._iNextTriNode = 0;
    };
    return TriangleNodePool;
})();

/*export*/ var TerrainInfo = (function () {
    function TerrainInfo(pInitInfo) {
        this.heightMapTable = new Float32Array(pInitInfo.heightMapTable);

        this.tableWidth = pInitInfo.tableWidth;
        this.tableHeight = pInitInfo.tableHeight;

        this.sectorUnits = pInitInfo.sectorUnits;
        this.sectorTotalDetailLevels = 0;
        this.sectorTotalVariances = 0;
        this.sectorCountX = pInitInfo.sectorCountX;
        this.sectorCountY = pInitInfo.sectorCountY;

        this.isUsedVertexNormal = pInitInfo.isUsedVertexNormal;

        this.worldExtents = pInitInfo.worldExtents;
        this.maxHeight = pInitInfo.maxHeight;
        this.terrain2DLength = 0;

        this.maxTriTreeNodeCount = pInitInfo.maxTriTreeNodeCount;
        this.triNodePool = new TriangleNodePool(pInitInfo.maxTriTreeNodeCount);

        this.sections = null;

        this.tessellationScale = pInitInfo.tessellationScale;
        this.tessellationLimit = pInitInfo.tessellationLimit;

        this.cameraCoord = new Float32Array(3);
        this.tessellationQueue = new Uint32Array(this.sectorCountX * this.sectorCountY);
        this.tessellationQueueSize = 0;

        this.tessellationIndices = null;
        this.vertexID = pInitInfo.vertexID;
        this.totalIndices = 0;

        this.sectorTotalDetailLevels = 2 * (Math.round(Math.log(this.sectorUnits) / Math.LN2));
        this.sectorTotalVariances = 1 << this.sectorTotalDetailLevels;
        this.terrain2DLength = Math.sqrt((this.worldExtents.x1 - this.worldExtents.x0) * (this.worldExtents.x1 - this.worldExtents.x0) + (this.worldExtents.y1 - this.worldExtents.y0) * (this.worldExtents.y1 - this.worldExtents.y0));
        this.sections = new Array(this.sectorCountX * this.sectorCountY);

        this.initSections();
    }
    TerrainInfo.prototype.processTessellationQueue = function () {
        this.totalIndices = 0;
        this.triNodePool.reset();

        for (var i = 0; i < this.tessellationQueueSize; i++) {
            this.tesselateSection(this.sections[this.tessellationQueue[i]]);
        }

        for (var i = 0; i < this.tessellationQueueSize; i++) {
            this.buildTriangleList(this.sections[this.tessellationQueue[i]]);
        }

        for (var i = 0; i < this.sections.length; i++) {
            this.resetSection(this.sections[i]);
        }
    };

    TerrainInfo.prototype.initSections = function () {
        var iShift = (Math.log(this.sectorUnits) / Math.LN2) | 0;
        var iSectorVerts = this.sectorUnits + 1;

        for (var y = 0; y < this.sectorCountY; y++) {
            for (var x = 0; x < this.sectorCountX; x++) {
                var iXPixel = x << iShift;
                var iYPixel = y << iShift;
                var iIndex = (y * this.sectorCountX) + x;

                this.sections[iIndex] = {
                    x: x,
                    y: y,
                    pixelX: iXPixel,
                    pixelY: iYPixel,
                    varianceTreeA: new Array(this.sectorTotalVariances),
                    varianceTreeB: new Array(this.sectorTotalVariances),
                    rootTriangleA: createTriTreeNode(),
                    rootTriangleB: createTriTreeNode(),
                    leftNeighborOfA: null,
                    rightNeighborOfA: null,
                    leftNeighborOfB: null,
                    rightNeighborOfB: null,
                    startIndex: iIndex * (iSectorVerts * iSectorVerts)
                };

                for (var i = 0; i < this.sectorTotalVariances; i++) {
                    this.sections[iIndex].varianceTreeA[i] = 0;
                    this.sections[iIndex].varianceTreeB[i] = 0;
                }
            }
        }

        for (var y = 0; y < this.sectorCountY; y++) {
            for (var x = 0; x < this.sectorCountX; x++) {
                var pSection = this.findSection(x, y);
                var pNorthSection = this.findSection(x, y - 1);
                var pSouthSection = this.findSection(x, y + 1);
                var pEastSection = this.findSection(x + 1, y);
                var pWestSection = this.findSection(x - 1, y);

                if (pNorthSection !== null) {
                    pSection.leftNeighborOfA = pNorthSection.rootTriangleB;
                }

                if (pSouthSection !== null) {
                    pSection.leftNeighborOfB = pSouthSection.rootTriangleA;
                }

                if (pEastSection !== null) {
                    pSection.rightNeighborOfB = pEastSection.rootTriangleA;
                }

                if (pWestSection !== null) {
                    pSection.rightNeighborOfA = pWestSection.rootTriangleB;
                }

                this.resetSection(pSection);
                this.computeVariance(pSection);
            }
        }
    };

    TerrainInfo.prototype.resetSection = function (pSection) {
        pSection.rootTriangleA.leftChild = null;
        pSection.rootTriangleA.rightChild = null;
        pSection.rootTriangleB.leftChild = null;
        pSection.rootTriangleB.rightChild = null;

        pSection.rootTriangleA.baseNeighbor = pSection.rootTriangleB;
        pSection.rootTriangleB.baseNeighbor = pSection.rootTriangleA;

        // link to our neighbors
        pSection.rootTriangleA.leftNeighbor = pSection.leftNeighborOfA;
        pSection.rootTriangleA.rightNeighbor = pSection.rightNeighborOfA;
        pSection.rootTriangleB.leftNeighbor = pSection.leftNeighborOfB;
        pSection.rootTriangleB.rightNeighbor = pSection.rightNeighborOfB;
    };

    TerrainInfo.prototype.findSection = function (iX, iY) {
        var pSection = null;

        if (iX >= 0 && iX < this.sectorCountX && iY >= 0 && iY < this.sectorCountY) {
            pSection = this.sections[(iY * this.sectorCountX) + iX];
        }

        return pSection;
    };

    TerrainInfo.prototype.tableIndex = function (iMapX, iMapY) {
        if (iMapX >= this.tableWidth) {
            iMapX = this.tableWidth - 1;
        }

        if (iMapY >= this.tableHeight) {
            iMapY = this.tableHeight - 1;
        }

        return (iMapY * this.tableWidth) + iMapX;
    };

    TerrainInfo.prototype.readWorldHeight = function (iMapX, iMapY) {
        if (arguments.length === 2) {
            var iFixedMapX = iMapX, iFixedMapY = iMapY;

            if (iFixedMapX >= this.tableWidth) {
                iFixedMapX = this.tableWidth - 1;
            }
            if (iFixedMapY >= this.tableHeight) {
                iFixedMapY = this.tableHeight - 1;
            }

            return this.heightMapTable[(iFixedMapY * this.tableWidth) + iFixedMapX];
        } else {
            var iMapIndex = iMapX;
            return this.heightMapTable[iMapIndex];
        }
    };

    TerrainInfo.prototype.computeVariance = function (pSection) {
        var iTableWidth = this.tableWidth;
        var iTableHeight = this.tableHeight;

        var iIndex0 = this.tableIndex(pSection.pixelX, pSection.pixelY);
        var iIndex1 = this.tableIndex(pSection.pixelX, pSection.pixelY + this.sectorUnits);
        var iIndex2 = this.tableIndex(pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits);
        var iIndex3 = this.tableIndex(pSection.pixelX + this.sectorUnits, pSection.pixelY);

        var fHeight0 = this.heightMapTable[iIndex0];
        var fHeight1 = this.heightMapTable[iIndex1];
        var fHeight2 = this.heightMapTable[iIndex2];
        var fHeight3 = this.heightMapTable[iIndex3];

        this.recursiveComputeVariance(pSection.pixelX, pSection.pixelY + this.sectorUnits, pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits, pSection.pixelX, pSection.pixelY, fHeight1, fHeight2, fHeight0, pSection.varianceTreeA, 1);

        this.recursiveComputeVariance(pSection.pixelX + this.sectorUnits, pSection.pixelY, pSection.pixelX, pSection.pixelY, pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits, fHeight3, fHeight0, fHeight2, pSection.varianceTreeB, 1);
    };

    TerrainInfo.prototype.recursiveComputeVariance = function (iCornerAX, iCornerAY, iCornerBX, iCornerBY, iCornerCX, iCornerCY, fHeightA, fHeightB, fHeightC, pVTree, iIndex) {
        if (iIndex < pVTree.length) {
            var iMidpointX = (iCornerBX + iCornerCX) >> 1;
            var iMidpointY = (iCornerBY + iCornerCY) >> 1;

            if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) && (iMidpointY === iCornerBY || iMidpointY === iCornerCY)) {
                return 0;
            }

            var fMidHeight = this.readWorldHeight(iMidpointX, iMidpointY);
            var fInterpolatedHeight = (fHeightB + fHeightC) * 0.5;
            var fVariance = Math.abs(fMidHeight - fInterpolatedHeight);

            // find the variance of our children
            var fLeft = this.recursiveComputeVariance(iMidpointX, iMidpointY, iCornerAX, iCornerAY, iCornerBX, iCornerBY, fMidHeight, fHeightA, fHeightB, pVTree, iIndex << 1);

            var fRight = this.recursiveComputeVariance(iMidpointX, iMidpointY, iCornerCX, iCornerCY, iCornerAX, iCornerAY, fMidHeight, fHeightC, fHeightA, pVTree, 1 + (iIndex << 1));

            // local variance is the minimum of all three
            fVariance = Math.max(fVariance, fLeft);
            fVariance = Math.max(fVariance, fRight);

            // store the variance as 1/(variance+1)
            pVTree[iIndex] = fVariance;

            // this.drawVariance(iIndex,
            //  this.terrainSystem._tableIndex(iCornerAX, iCornerAY),
            //  this.terrainSystem._tableIndex(iCornerBX, iCornerBY),
            //  this.terrainSystem._tableIndex(iCornerCX, iCornerCY), pVTree);
            return fVariance;
        }

        // return a value which will be ignored by the parent
        // (because the minimum function is used with this result)
        return 0;
    };

    TerrainInfo.prototype.tesselateSection = function (pSection) {
        var iIndex0 = this.tableIndex(pSection.pixelX, pSection.pixelY);
        var iIndex1 = this.tableIndex(pSection.pixelX, pSection.pixelY + this.sectorUnits);
        var iIndex2 = this.tableIndex(pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits);
        var iIndex3 = this.tableIndex(pSection.pixelX + this.sectorUnits, pSection.pixelY);

        var fHeight0 = this.readWorldHeight(iIndex0);
        var fHeight1 = this.readWorldHeight(iIndex1);
        var fHeight2 = this.readWorldHeight(iIndex2);
        var fHeight3 = this.readWorldHeight(iIndex3);

        this.recursiveTessellate(pSection.rootTriangleA, pSection.pixelX, pSection.pixelY + this.sectorUnits, fHeight1, pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits, fHeight2, pSection.pixelX, pSection.pixelY, fHeight0, pSection.varianceTreeA, 1);

        this.recursiveTessellate(pSection.rootTriangleB, pSection.pixelX + this.sectorUnits, pSection.pixelY, fHeight3, pSection.pixelX, pSection.pixelY, fHeight0, pSection.pixelX + this.sectorUnits, pSection.pixelY + this.sectorUnits, fHeight2, pSection.varianceTreeB, 1);
    };

    TerrainInfo.prototype.recursiveTessellate = function (pTri, iCornerAX, iCornerAY, fCornerAZ, iCornerBX, iCornerBY, fCornerBZ, iCornerCX, iCornerCY, fCornerCZ, pVTree, iIndex) {
        if ((iIndex << 1) + 1 > this.sectorTotalVariances) {
            return;
        }

        var iMidpointX = (iCornerBX + iCornerCX) >> 1;
        var iMidpointY = (iCornerBY + iCornerCY) >> 1;

        if ((iMidpointX === iCornerBX || iMidpointX === iCornerCX) && (iMidpointY === iCornerBY || iMidpointY === iCornerCY)) {
            return;
        }

        var fMidPointZ = (fCornerBZ + fCornerCZ) / 2;
        var fRealMidPointZ = this.readWorldHeight(iMidpointX, iMidpointY);

        var pTerrainExtents = this.worldExtents;
        var iHeightMapWidth = this.tableWidth;
        var iHeightMapHeight = this.tableHeight;
        var fTerrainSizeZ = this.maxHeight;
        var fTerrainDiagonal = this.terrain2DLength;

        var fLocalMidX = pTerrainExtents.x0 + iMidpointX * (pTerrainExtents.x1 - pTerrainExtents.x0) / iHeightMapWidth;
        var fLocalMidY = pTerrainExtents.y0 + iMidpointY * (pTerrainExtents.y1 - pTerrainExtents.y0) / iHeightMapHeight;

        var fDistanceSquare = (this.cameraCoord[0] - fLocalMidX) * (this.cameraCoord[0] - fLocalMidX) + (this.cameraCoord[1] - fLocalMidY) * (this.cameraCoord[1] - fLocalMidY) + (this.cameraCoord[2] - fMidPointZ) * (this.cameraCoord[2] - fMidPointZ);

        if (!pTri.leftChild) {
            var fScale = this.tessellationScale;
            var fLimit = this.tessellationLimit;

            var fDistance = Math.sqrt(fDistanceSquare + 0.0001);
            var fRatio = 0.;

            fRatio = (pVTree[iIndex] / fTerrainSizeZ * fScale) / ((fDistance / fTerrainDiagonal) * fLimit);

            if (fRatio > 1.) {
                // subdivide this triangle
                this.split(pTri);
            }
        }

        if (pTri.leftChild) {
            this.recursiveTessellate(pTri.leftChild, iMidpointX, iMidpointY, fRealMidPointZ, iCornerAX, iCornerAY, fCornerAZ, iCornerBX, iCornerBY, fCornerBZ, pVTree, iIndex << 1);

            this.recursiveTessellate(pTri.rightChild, iMidpointX, iMidpointY, fRealMidPointZ, iCornerCX, iCornerCY, fCornerCZ, iCornerAX, iCornerAY, fCornerAZ, pVTree, (iIndex << 1) + 1);
        }
    };

    TerrainInfo.prototype.split = function (pTri) {
        if (pTri.leftChild) {
            return;
        }

        if (pTri.baseNeighbor && (pTri.baseNeighbor.baseNeighbor !== pTri)) {
            this.split(pTri.baseNeighbor);
        }

        // Create children and link into mesh
        pTri.leftChild = this.triNodePool.request();
        pTri.rightChild = this.triNodePool.request();

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

        if (pTri.leftNeighbor) {
            if (pTri.leftNeighbor.baseNeighbor == pTri) {
                pTri.leftNeighbor.baseNeighbor = pTri.leftChild;
            } else if (pTri.leftNeighbor.leftNeighbor == pTri) {
                pTri.leftNeighbor.leftNeighbor = pTri.leftChild;
            } else if (pTri.leftNeighbor.rightNeighbor == pTri) {
                pTri.leftNeighbor.rightNeighbor = pTri.leftChild;
            }
        }

        if (pTri.rightNeighbor) {
            if (pTri.rightNeighbor.baseNeighbor == pTri) {
                pTri.rightNeighbor.baseNeighbor = pTri.rightChild;
            } else if (pTri.rightNeighbor.rightNeighbor == pTri) {
                pTri.rightNeighbor.rightNeighbor = pTri.rightChild;
            } else if (pTri.rightNeighbor.leftNeighbor == pTri) {
                pTri.rightNeighbor.leftNeighbor = pTri.rightChild;
            }
        }

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

    TerrainInfo.prototype.buildTriangleList = function (pSection) {
        var iSectorVerts = this.sectorUnits + 1;

        // add all the triangles to the roamTerrain
        // in root triangle A
        this.recursiveBuildTriangleList(pSection, pSection.rootTriangleA, 0, iSectorVerts - 1, (iSectorVerts - 1) * iSectorVerts);

        // add all the triangles to the roamTerrain
        // in root triangle B
        this.recursiveBuildTriangleList(pSection, pSection.rootTriangleB, (iSectorVerts * iSectorVerts) - 1, (iSectorVerts - 1) * iSectorVerts, iSectorVerts - 1);
    };

    TerrainInfo.prototype.recursiveBuildTriangleList = function (pSection, pTri, iPointBase, iPointLeft, iPointRight) {
        if (pTri.leftChild) {
            var iPointMid = (iPointLeft + iPointRight) * 0.5;
            this.recursiveBuildTriangleList(pSection, pTri.leftChild, iPointMid, iPointBase, iPointLeft);
            this.recursiveBuildTriangleList(pSection, pTri.rightChild, iPointMid, iPointRight, iPointBase);
        } else {
            var nElementSize = 0;
            if (this.isUsedVertexNormal) {
                nElementSize = (3 + 3 + 2);
            } else {
                nElementSize = (3 + 2);
            }

            // add the local triangle to the index list
            this.tessellationIndices[this.totalIndices++] = ((iPointRight + pSection.startIndex) * nElementSize * 4 + this.vertexID) / 4;
            this.tessellationIndices[this.totalIndices++] = ((iPointLeft + pSection.startIndex) * nElementSize * 4 + this.vertexID) / 4;
            this.tessellationIndices[this.totalIndices++] = ((iPointBase + pSection.startIndex) * nElementSize * 4 + this.vertexID) / 4;
        }
    };
    return TerrainInfo;
})();

var pTerrain = null;
function processInitTerrain(pInitInfo) {
    pTerrain = new TerrainInfo(pInitInfo);
    (self).postMessage("ok");
}

/**
* format of pData. pData size in bytes = ( 4 * (pTerrain.maxTriTreeNodeCount * 3) + 4)
* 3 float32 - float camera coords
* 1 uint32 - length of tessellation queue of terrainSection. Define as L.
* L uint32 - index of sections to tesselate
* @type {[type]}
*/
function processTesselate(pData) {
    var pDataView = new DataView(pData, 0, 16);
    var iTesselationQueueSize = pDataView.getUint32(12, true);

    pTerrain.cameraCoord.set(new Float32Array(pData, 0, 3));
    pTerrain.tessellationQueueSize = iTesselationQueueSize;
    pTerrain.tessellationQueue.set(new Uint32Array(pData, 4 * 4, iTesselationQueueSize));
    pTerrain.tessellationIndices = new Float32Array(pData, 4);

    pTerrain.processTessellationQueue();

    pDataView.setUint32(0, pTerrain.totalIndices, true);
    pTmpTransferableArray[0] = pData;

    (self).postMessage(pData, pTmpTransferableArray);
}

function processUpdateParams(pUpdateInfo) {
}
