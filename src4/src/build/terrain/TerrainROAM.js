/// <reference path="../idl/ITerrainROAM.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
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
    (function (terrain) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        var Mat4 = akra.math.Mat4;

        var VE = akra.data.VertexElement;

        var TerrainROAM = (function (_super) {
            __extends(TerrainROAM, _super);
            function TerrainROAM(pScene, eType) {
                if (typeof eType === "undefined") { eType = 67 /* TERRAIN_ROAM */; }
                _super.call(this, pScene, eType);
                this._pRenderableObject = null;
                this._pRenderData = null;
                this._pDataIndex = null;
                this._pIndexList = null;
                this._pTessellationQueue = null;
                this._iTessellationQueueCount = 0;
                this._isRenderInThisFrame = false;
                this._iMaxTriTreeNodes = (1024 * 64 * 4);
                this._iTessellationQueueSize = 0;
                //массив подчиненный секций
                this._pSectorArray = null;
                this._fScale = 0.0;
                this._fLimit = 0.0;
                this._iTessellationQueueCountOld = 0;
                this._nCountRender = 0;
                this._m4fLastCameraMatrix = new Mat4();
                this._m4fLastTessellationMatrix = new Mat4();
                this._v3fLocalCameraCoord = new Vec3();
                this._isNeedReset = true;
                this._fLastTessellationTime = 0.;
                this._fTessellationSelfInterval = 1. / 25.;
                this._fTessellationThreadInterval = 1. / 60.;
                this._bUseTessellationThread = false;
                this._bIsInitTessellationSelfData = false;
                this._bIsInitTessellationThreadData = false;
                this._pTessellationThread = null;
                this._pTessellationTransferableData = null;
                this._pTmpTransferableArray = null;
                this._bIsReadyForTesseltion = false;
                this._pNodePool = null;
                // private _pTestTerrainInfo: util.TerrainInfo = null;
                this._fAvgTesselateCallsInSec = 0;
                this._iCurrentTesselateCount = 0;
                this._nSec = 0;
                this._fLastTimeStart = 0;
                this._pRenderData = this._pDataFactory.getEmptyRenderData(4 /* TRIANGLELIST */, akra.ERenderDataBufferOptions.RD_ADVANCED_INDEX);
                this._pRenderableObject = new akra.render.RenderableObject();
                this._pRenderableObject._setup(this._pEngine.getRenderer());
                this._pRenderableObject._setRenderData(this._pRenderData);

                if (akra.config.PROFILE_TESSEALLATION) {
                    this._fAvgTesselateCallsInSec = 0;
                    this._iCurrentTesselateCount = 0;
                    this._nSec = 0;
                    this._fLastTimeStart = 0;
                }

                this._pRenderableObject.beforeRender.connect(this, this._onBeforeRender);
            }
            TerrainROAM.prototype.getMaxTriTreeNodes = function () {
                return this._iMaxTriTreeNodes;
            };

            TerrainROAM.prototype.getVerts = function () {
                return this._pVerts;
            };

            TerrainROAM.prototype.getIndex = function () {
                return this._pIndexList;
            };

            TerrainROAM.prototype.getVertexId = function () {
                return this._iVertexID;
            };

            TerrainROAM.prototype.getTotalRenderable = function () {
                return !akra.isNull(this._pRenderableObject) ? 1 : 0;
            };

            TerrainROAM.prototype.getRenderable = function (i) {
                return this._pRenderableObject;
            };

            TerrainROAM.prototype.getLocalCameraCoord = function () {
                return this._v3fLocalCameraCoord;
            };

            TerrainROAM.prototype.getTessellationScale = function () {
                return this._fScale;
            };

            TerrainROAM.prototype.setTessellationScale = function (fScale) {
                this._fScale = fScale;
            };

            TerrainROAM.prototype.getTessellationLimit = function () {
                return this._fLimit;
            };

            TerrainROAM.prototype.setTessellationLimit = function (fLimit) {
                this._fLimit = fLimit;
            };

            TerrainROAM.prototype.getUseTessellationThread = function () {
                return this._bUseTessellationThread;
            };

            TerrainROAM.prototype.setUseTessellationThread = function (bUseThread) {
                this._bUseTessellationThread = bUseThread;

                if (this._isCreate) {
                    if (bUseThread && !this._bIsInitTessellationThreadData) {
                        this.initTessellationThreadData();
                    } else if (!bUseThread && !this._bIsInitTessellationSelfData) {
                        this.initTessellationSelfData();
                    }
                }

                if (akra.config.PROFILE_TESSEALLATION) {
                    this._fAvgTesselateCallsInSec = 0;
                    this._iCurrentTesselateCount = 0;
                    this._nSec = 0;
                    this._fLastTimeStart = 0;
                }
            };

            TerrainROAM.prototype.getTotalIndex = function () {
                return this._iTotalIndices;
            };

            TerrainROAM.prototype.setTotalIndex = function (iTotalIndices) {
                this._iTotalIndices = iTotalIndices;
            };

            TerrainROAM.prototype.init = function (pMaps, worldExtents, iShift, iShiftX, iShiftY, sSurfaceTextures, pRootNode) {
                if (typeof pRootNode === "undefined") { pRootNode = null; }
                var bResult = _super.prototype.init.call(this, pMaps, worldExtents, iShift, iShiftX, iShiftY, sSurfaceTextures, pRootNode);
                if (bResult) {
                    this._iTessellationQueueSize = this.getSectorCountX() * this.getSectorCountY();
                    this._pTessellationQueue = new Array(this._iTessellationQueueSize);
                    this._iTessellationQueueCount = 0;
                    this._isCreate = true;
                    this._iTotalIndicesMax = 0;

                    for (var i = 0; i < this._pTessellationQueue.length; i++) {
                        this._pTessellationQueue[i] = null;
                    }

                    this._pRenderableObject.getTechnique().setMethod(this._pDefaultRenderMethod);
                    this._pRenderableObject.getTechnique().render.connect(this, this._onRender);

                    if (!this._bUseTessellationThread) {
                        this._pNodePool = new akra.terrain.TriangleNodePool(this._iMaxTriTreeNodes);
                    }

                    this._setTessellationParameters(10.0, 0.5);
                    this.reset();

                    if (this._bUseTessellationThread) {
                        this.initTessellationThreadData();
                    } else {
                        this._bIsInitTessellationSelfData = true;
                        this._bIsReadyForTesseltion = true;
                    }

                    this._isCreate = true;
                } else {
                    this._isCreate = false;
                }

                return bResult;
            };

            TerrainROAM.prototype.destroy = function () {
                delete this._pNodePool;
                delete this._pTessellationQueue;

                this._iTessellationQueueCount = 0;
                this._fScale = 0;
                this._fLimit = 0;
                //Terrain.prototype.destroy.call(this); с какого то хуя этого метода не оказалось
            };

            TerrainROAM.prototype.initTessellationSelfData = function () {
                this._bIsReadyForTesseltion = true;

                if (this._bIsInitTessellationSelfData) {
                    return;
                }

                this._pNodePool = new akra.terrain.TriangleNodePool(this._iMaxTriTreeNodes);
                for (var i = 0; i < this._pSectorArray.length; i++) {
                    this._pSectorArray[i]._initTessellationData();
                }

                this._bIsInitTessellationSelfData = true;
            };

            TerrainROAM.prototype.initTessellationThreadData = function () {
                this._bIsReadyForTesseltion = false;

                if (this._bIsInitTessellationThreadData) {
                    return;
                }

                var me = this;
                var pThread = this._pTessellationThread = new Worker(akra.config.terrain.roam.tessellationThread);

                pThread.onmessage = function (event) {
                    if (event.data === "ok") {
                        me.successThreadInit();
                    } else {
                        akra.logger.warn("Cannot inititalize tessellation thread. So we will tessellate terraint in main thread.");
                        me.setUseTessellationThread(false);
                        me.terminateTessellationThread();
                    }
                };

                pThread.onerror = function (event) {
                    akra.logger.warn("Error occured in tessellation thread. So we will tessellate terraint in main thread.");
                    akra.debug.log(event);
                    pThread.onmessage = null;
                    me.setUseTessellationThread(false);
                    me.terminateTessellationThread();
                };

                this._bIsInitTessellationThreadData = true;

                var pHeightTableCopy = new Float32Array(this._pHeightTable.length);
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
            };

            TerrainROAM.prototype.terminateTessellationThread = function () {
                this._pTessellationThread.terminate();
                this._bIsInitTessellationThreadData = false;
            };

            TerrainROAM.prototype.successThreadInit = function () {
                var me = this;
                this._pTessellationTransferableData = new ArrayBuffer(4 * this._iMaxTriTreeNodes * 3 + 4);
                this._pTmpTransferableArray = [null];
                this._bIsReadyForTesseltion = true;

                this._pTessellationThread.onmessage = function (event) {
                    me.prepareIndexData(event.data);
                };
            };

            TerrainROAM.prototype._allocateSectors = function () {
                var nElementSize = 0;
                if (this._useVertexNormal()) {
                    nElementSize = (3 + 3 + 2);
                } else {
                    nElementSize = (3 + 2);
                }

                this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

                //Вершинный буфер для всех
                this._pVerts = new Array((this._iSectorCountX * this._iSectorCountY) * (this._iSectorVerts * this._iSectorVerts) * (nElementSize));

                for (var i = 0; i < this._pSectorArray.length; i++) {
                    this._pSectorArray[i] = this.getScene().createTerrainSectionROAM();
                }

                for (var y = 0; y < this._iSectorCountY; ++y) {
                    for (var x = 0; x < this._iSectorCountX; ++x) {
                        //cVector2 sectorPos(
                        var v2fSectorPos = new Vec2();
                        v2fSectorPos.set(this._pWorldExtents.x0 + (x * this._v2fSectorSize.x), this._pWorldExtents.y0 + (y * this._v2fSectorSize.y));

                        //cRect2d r2fSectorRect(
                        var r2fSectorRect = new akra.geometry.Rect2d();
                        r2fSectorRect.set(v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x, v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

                        var iXPixel = x << this._iSectorShift;
                        var iYPixel = y << this._iSectorShift;
                        var iIndex = (y * this._iSectorCountX) + x;

                        if (!this._pSectorArray[iIndex]._internalCreate(this, x, y, iXPixel, iYPixel, this._iSectorVerts, this._iSectorVerts, r2fSectorRect, iIndex * (this._iSectorVerts * this._iSectorVerts))) {
                            return false;
                        }
                    }
                }

                var pVertexDescription = null;
                if (this._useVertexNormal()) {
                    pVertexDescription = [VE.float3(akra.data.Usages.POSITION), VE.float3(akra.data.Usages.NORMAL), VE.float2(akra.data.Usages.TEXCOORD)];
                } else {
                    pVertexDescription = [VE.float3(akra.data.Usages.POSITION), VE.float2(akra.data.Usages.TEXCOORD)];
                }

                this._iVertexID = this._pRenderData.allocateData(pVertexDescription, new Float32Array(this._pVerts));

                //Индексны буфер для всех
                this._iTotalIndices = 0;

                //Максимальное количество треугольников помноженное на 3 вершины на каждый треугольник
                this._pIndexList = new Float32Array(this._iMaxTriTreeNodes * 3);
                this._pRenderData.allocateIndex([VE.float(akra.data.Usages.INDEX0), VE.float(akra.data.Usages.POSITION, 0)], this._pIndexList);
                this._pRenderData.index(this._iVertexID, akra.data.Usages.INDEX0);
                this._pDataIndex = this._pRenderData.getAdvancedIndexData(akra.data.Usages.INDEX0);

                return true;
            };

            TerrainROAM.prototype.reset = function () {
                this._isRenderInThisFrame = false;

                if (this._isCreate) {
                    _super.prototype.reset.call(this);

                    for (var i = 0; i < this._iTessellationQueueCount; i++) {
                        this._pTessellationQueue[i] = null;
                    }

                    this._iTessellationQueueCount = 0;

                    // this._pTessellationQueue.length = this._iTessellationQueueSize;
                    if (!this._bUseTessellationThread && this._bIsInitTessellationSelfData) {
                        this._pNodePool.reset();

                        for (var i = 0; i < this._pSectorArray.length; i++) {
                            this._pSectorArray[i].reset();
                        }
                    }
                }
            };

            TerrainROAM.prototype.resetWithCamera = function (pCamera) {
                if (this._bIsReadyForTesseltion && !this._isOldCamera(pCamera)) {
                    if (this._isNeedReset) {
                        this.reset();
                        this._isNeedReset = false;

                        var v4fCameraCoord = Vec4.temp(pCamera.getWorldPosition(), 1.);

                        v4fCameraCoord = this.getInverseWorldMatrix().multiplyVec4(v4fCameraCoord);

                        this._v3fLocalCameraCoord.set(v4fCameraCoord.x, v4fCameraCoord.y, v4fCameraCoord.z);
                        // return true;
                    }

                    return true;
                    // return false;
                } else {
                    // return true;
                    return false;
                }
            };

            TerrainROAM.prototype.requestTriNode = function () {
                return this._pNodePool.request();
            };

            TerrainROAM.prototype.addToTessellationQueue = function (pSection) {
                if (this._iTessellationQueueCount < this._iTessellationQueueSize) {
                    this._pTessellationQueue[this._iTessellationQueueCount] = pSection;
                    this._iTessellationQueueCount++;
                    return true;
                }

                // while we handle this failure gracefully
                // in release builds, we alert ourselves
                // to the situation with an assert in debug
                // builds so we can increase the queue size
                akra.logger.warn("increase the size of the ROAM tessellation queue");
                return false;
            };

            TerrainROAM.prototype.processTessellationQueue = function () {
                // this._pTessellationQueue.length = this._iTessellationQueueCount;
                this._pTessellationQueue.sort(TerrainROAM.fnSortSection);

                if (this._bUseTessellationThread) {
                    var pDataView = new DataView(this._pTessellationTransferableData);

                    pDataView.setFloat32(0, this._v3fLocalCameraCoord.x, true);
                    pDataView.setFloat32(4, this._v3fLocalCameraCoord.y, true);
                    pDataView.setFloat32(8, this._v3fLocalCameraCoord.z, true);

                    pDataView.setUint32(12, this._iTessellationQueueCount, true);

                    for (var i = 0; i < this._iTessellationQueueCount; ++i) {
                        pDataView.setUint32(16 + i * 4, this._pTessellationQueue[i].getSectionIndex(), true);
                        // pSectionIndices[i] = this._pTessellationQueue[i].sectionIndex;
                    }

                    this._pTmpTransferableArray[0] = this._pTessellationTransferableData;
                    this._pTessellationThread.postMessage(this._pTessellationTransferableData, this._pTmpTransferableArray);
                    this._bIsReadyForTesseltion = false;
                } else {
                    for (var i = 0; i < this._iTessellationQueueCount; ++i) {
                        // split triangles based on the
                        // scale and limit values
                        this._pTessellationQueue[i].tessellate(this._fScale, this._fLimit);
                    }

                    this._iTotalIndices = 0;

                    for (var i = 0; i < this._iTessellationQueueCount; ++i) {
                        this._pTessellationQueue[i].buildTriangleList();
                    }

                    if (this._iTotalIndicesOld === this._iTotalIndices && this._iTotalIndices !== this._iTotalIndicesMax) {
                        return;
                    }

                    this._pRenderData._setIndexLength(this._iTotalIndices);
                    this._pDataIndex.setData(this._pIndexList, 0, akra.sizeof(5126 /* FLOAT */), 0, this._iTotalIndices);
                    this._iTotalIndicesOld = this._iTotalIndices;
                    this._iTotalIndicesMax = akra.math.max(this._iTotalIndicesMax, this._iTotalIndices);

                    this._pRenderableObject._setRenderData(this._pRenderData);
                }
            };

            TerrainROAM.prototype.prepareIndexData = function (pData) {
                var iTotalIndices = (new Uint32Array(pData, 0, 1))[0];
                var pTmpData = new Float32Array(pData, 4, iTotalIndices);

                this._iTotalIndices = iTotalIndices;
                this._pIndexList.set(pTmpData);

                this._pRenderData._setIndexLength(this._iTotalIndices);
                this._pDataIndex.setData(this._pIndexList, 0, akra.sizeof(5126 /* FLOAT */), 0, this._iTotalIndices);

                this._pRenderableObject._setRenderData(this._pRenderData);

                this._pTessellationTransferableData = pData;

                this._bIsReadyForTesseltion = true;
            };

            TerrainROAM.prototype._setTessellationParameters = function (fScale, fLimit) {
                this._fScale = fScale;
                this._fLimit = fLimit;
            };

            TerrainROAM.prototype._isOldCamera = function (pCamera) {
                return this._m4fLastCameraMatrix.isEqual(pCamera.getWorldMatrix());
            };

            TerrainROAM.prototype._onBeforeRender = function (pRenderableObject, pViewport) {
                if (this._bIsReadyForTesseltion) {
                    var pCamera = pViewport.getCamera();
                    var fCurrentTime = this.getScene().getManager().getEngine().getTime();

                    this._m4fLastCameraMatrix.set(pCamera.getWorldMatrix());

                    if ((this._bUseTessellationThread && fCurrentTime - this._fLastTessellationTime > this._fTessellationThreadInterval) || fCurrentTime - this._fLastTessellationTime > this._fTessellationSelfInterval) {
                        if (akra.config.PROFILE_TESSEALLATION) {
                            if (this._fLastTimeStart === 0) {
                                this._fLastTimeStart = fCurrentTime;
                                this._iCurrentTesselateCount++;
                                this._nSec = 1;
                                this._fAvgTesselateCallsInSec = 0;
                            } else if (this._fLastTimeStart + 1 > fCurrentTime) {
                                this._iCurrentTesselateCount++;
                            } else {
                                this._fAvgTesselateCallsInSec = this._fAvgTesselateCallsInSec * (this._nSec - 1) / this._nSec + this._iCurrentTesselateCount / this._nSec;

                                if (this._nSec % 3 === 0) {
                                    akra.logger.log("Avg:", this._fAvgTesselateCallsInSec.toFixed(2), "Last:", this._iCurrentTesselateCount);
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
            };

            TerrainROAM.fnSortSection = function (pSectionA, pSectionB) {
                if (akra.isNull(pSectionA)) {
                    return 1;
                } else if (akra.isNull(pSectionB)) {
                    return -1;
                } else {
                    return pSectionA.getQueueSortValue() - pSectionB.getQueueSortValue();
                }
            };
            return TerrainROAM;
        })(akra.terrain.Terrain);
        terrain.TerrainROAM = TerrainROAM;
    })(akra.terrain || (akra.terrain = {}));
    var terrain = akra.terrain;
})(akra || (akra = {}));
//# sourceMappingURL=TerrainROAM.js.map
