/// <reference path="../idl/ITerrainSection.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../scene/SceneObject.ts" />
    /// <reference path="../data/RenderData.ts" />
    /// <reference path="../render/RenderableObject.ts" />
    /// <reference path="Terrain.ts" />
    (function (terrain) {
        var VE = akra.data.VertexElement;
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        var TerrainSection = (function (_super) {
            __extends(TerrainSection, _super);
            function TerrainSection(pScene, eType) {
                if (typeof eType === "undefined") { eType = 68 /* TERRAIN_SECTION */; }
                _super.call(this, pScene, eType);
                this._pTerrainSystem = null;
                this._iVertexID = 0;
                //Ее коорлинаты на карте высот
                this._iHeightMapX = 0;
                this._iHeightMapY = 0;
                //номер сектора по иксу и по игрику
                this._iSectorX = 0;
                this._iSectorY = 0;
                this._iSectorIndex = 0;
                //Ращмеры сетки вершин
                this._iXVerts = 0;
                this._iYVerts = 0;
                //Положение сетора в мире
                this._pWorldRect = new akra.geometry.Rect3d();
                this._pRenderableObject = null;
                this._pVertexDescription = null;
            }
            TerrainSection.prototype.getSectorX = function () {
                return this._iSectorX;
            };

            TerrainSection.prototype.getSectorY = function () {
                return this._iSectorY;
            };

            TerrainSection.prototype.getTerrainSystem = function () {
                return this._pTerrainSystem;
            };

            TerrainSection.prototype.getSectionIndex = function () {
                return this._iSectorIndex;
            };

            TerrainSection.prototype.getHeightX = function () {
                return akra.math.abs(this._pWorldRect.x1 - this._pWorldRect.x0);
            };

            TerrainSection.prototype.getHeightY = function () {
                return akra.math.abs(this._pWorldRect.y1 - this._pWorldRect.y0);
            };

            TerrainSection.prototype.getVertexDescription = function () {
                return this._pVertexDescription;
            };

            TerrainSection.prototype.getTotalRenderable = function () {
                return !akra.isNull(this._pRenderableObject) ? 1 : 0;
            };

            TerrainSection.prototype.getRenderable = function (i) {
                return this._pRenderableObject;
            };

            TerrainSection.prototype._internalCreate = function (pParentSystem, iSectorX, iSectorY, iHeightMapX, iHeightMapY, iXVerts, iYVerts, pWorldRect) {
                var bResult = false;

                this._pTerrainSystem = pParentSystem;
                this._iXVerts = iXVerts;
                this._iYVerts = iYVerts;
                this._iSectorX = iSectorX;
                this._iSectorY = iSectorY;
                this._iSectorIndex = (this._iSectorY * this._pTerrainSystem.getSectorCountX() + this._iSectorX);
                this._pWorldRect.x0 = pWorldRect.x0;
                this._pWorldRect.x1 = pWorldRect.x1;
                this._pWorldRect.y0 = pWorldRect.y0;

                //??
                this._pWorldRect.y1 = pWorldRect.y1;
                this._iHeightMapX = iHeightMapX;
                this._iHeightMapY = iHeightMapY;

                if (this.getTerrainSystem()._useVertexNormal()) {
                    this._pVertexDescription = [VE.float3(akra.data.Usages.POSITION), VE.float3(akra.data.Usages.NORMAL), VE.float2(akra.data.Usages.TEXCOORD)];
                } else {
                    this._pVertexDescription = [VE.float3(akra.data.Usages.POSITION), VE.float2(akra.data.Usages.TEXCOORD)];
                }

                bResult = this._createRenderDataForVertexAndIndex();
                bResult = bResult && this._buildVertexBuffer();
                bResult = bResult && this._buildIndexBuffer();

                // set the scene object bounds data
                this.accessLocalBounds().set(this._pWorldRect.x0, this._pWorldRect.x1, this._pWorldRect.y0, this._pWorldRect.y1, this._pWorldRect.z0, this._pWorldRect.z1);

                if (bResult) {
                    this.attachToParent(this._pTerrainSystem);
                    this.setInheritance(4 /* ALL */);

                    return true;
                } else {
                    return false;
                }
            };

            TerrainSection.prototype._createRenderable = function () {
                if (akra.isNull(this._pRenderableObject)) {
                    this._pRenderableObject = new akra.render.RenderableObject();
                    this._pRenderableObject._setup(this.getScene().getManager().getEngine().getRenderer());
                }
            };

            TerrainSection.prototype._createRenderDataForVertexAndIndex = function () {
                var pRenderable = this.getRenderable();

                if (akra.isNull(pRenderable)) {
                    return true;
                }

                akra.debug.assert(akra.isNull(pRenderable.getData()), "У терраин сектиона уже созданы данные");

                pRenderable._setRenderData(this.getTerrainSystem().getDataFactory().getEmptyRenderData(5 /* TRIANGLESTRIP */, 0));

                if (akra.isNull(pRenderable.getData())) {
                    return false;
                }

                return true;
            };

            TerrainSection.prototype._buildVertexBuffer = function () {
                this._pWorldRect.z0 = akra.MAX_FLOAT64;
                this._pWorldRect.z1 = akra.MIN_FLOAT64;

                if (!akra.isNull(this.getRenderable())) {
                    var nElementSize = 0;
                    if (this.getTerrainSystem()._useVertexNormal()) {
                        nElementSize = (3 + 3 + 2);
                    } else {
                        nElementSize = (3 + 2);
                    }

                    var pVerts = new Array(this._iXVerts * this._iYVerts * nElementSize);
                    var v3fNormal = new Vec3();

                    //размер ячейки сектора
                    var v2fCellSize = new Vec2();
                    v2fCellSize.set(this.getHeightX() / (this._iXVerts - 1), this.getHeightY() / (this._iYVerts - 1));

                    //Координаты вершина в секторе
                    var v2fVert = new Vec2();
                    v2fVert.set(0.0, 0.0);

                    for (var y = 0; y < this._iYVerts; ++y) {
                        v2fVert.set(this._pWorldRect.x0, y * v2fCellSize.y + this._pWorldRect.y0);

                        for (var x = 0; x < this._iXVerts; ++x) {
                            var fHeight = this.getTerrainSystem().readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

                            pVerts[((y * this._iXVerts) + x) * nElementSize + 0] = v2fVert.x;
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 1] = v2fVert.y;
                            pVerts[((y * this._iXVerts) + x) * nElementSize + 2] = fHeight;

                            if (this.getTerrainSystem()._useVertexNormal()) {
                                this.getTerrainSystem().readWorldNormal(v3fNormal, this._iHeightMapX + x, this._iHeightMapY + y);

                                pVerts[((y * this._iXVerts) + x) * nElementSize + 3] = v3fNormal.x;
                                pVerts[((y * this._iXVerts) + x) * nElementSize + 4] = v3fNormal.y;
                                pVerts[((y * this._iXVerts) + x) * nElementSize + 5] = v3fNormal.z;

                                pVerts[((y * this._iXVerts) + x) * nElementSize + 6] = (this._iSectorX + x / (this._iXVerts - 1)) / this.getTerrainSystem().getSectorCountX();
                                pVerts[((y * this._iXVerts) + x) * nElementSize + 7] = (this._iSectorY + y / (this._iYVerts - 1)) / this.getTerrainSystem().getSectorCountY();
                            } else {
                                pVerts[((y * this._iXVerts) + x) * nElementSize + 3] = (this._iSectorX + x / (this._iXVerts - 1)) / this.getTerrainSystem().getSectorCountX();
                                pVerts[((y * this._iXVerts) + x) * nElementSize + 4] = (this._iSectorY + y / (this._iYVerts - 1)) / this.getTerrainSystem().getSectorCountY();
                            }

                            this._pWorldRect.z0 = akra.math.min(this._pWorldRect.z0, fHeight);
                            this._pWorldRect.z1 = akra.math.max(this._pWorldRect.z1, fHeight);

                            v2fVert.x += v2fCellSize.x;
                        }
                    }

                    this._iVertexID = this.getRenderable().getData().allocateData(this.getVertexDescription(), new Float32Array(pVerts));
                } else {
                    for (var y = 0; y < this._iYVerts; ++y) {
                        for (var x = 0; x < this._iXVerts; ++x) {
                            var fHeight = this.getTerrainSystem().readWorldHeight(this._iHeightMapX + x, this._iHeightMapY + y);

                            this._pWorldRect.z0 = akra.math.min(this._pWorldRect.z0, fHeight);
                            this._pWorldRect.z1 = akra.math.max(this._pWorldRect.z1, fHeight);
                        }
                    }
                }

                return true;
            };

            TerrainSection.prototype._buildIndexBuffer = function () {
                if (!akra.isNull(this.getRenderable())) {
                    var pIndexList = new Float32Array(TerrainSection.getCountIndexForStripGrid(this._iXVerts, this._iYVerts));

                    TerrainSection.createSingleStripGrid(pIndexList, this._iXVerts, this._iYVerts, 1, 1, this._iYVerts, 0);

                    this.getRenderable().getData().allocateIndex([VE.float(akra.data.Usages.INDEX0)], pIndexList);
                    this.getRenderable().getData().index(this._iVertexID, akra.data.Usages.INDEX0);
                }
                return true;
            };

            TerrainSection.createSingleStripGrid = function (pIndexValues, iXVerts, iYVerts, iXStep, iYStep, iSride, iFlags) {
                //TRIANGLESTRIP
                var iTotalStrips = iYVerts - 1;
                var iTotalIndexesPerStrip = iXVerts << 1;

                // the total number of indices is equal
                // to the number of strips times the
                // indices used per strip plus one
                // degenerate triangle between each strip
                //общее количество идексов равно количесву линий умноженному на колчесвто идексов в линии + вырожденный треуголник между полосами
                var iTotalIndexes = (iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1) - 2;

                if (pIndexValues.length < iTotalIndexes) {
                    return 0;
                }

                var iIndex = 0;
                var iStartVert = 0;
                var iLineStep = iYStep * iSride;

                for (var j = 0; j < iTotalStrips; ++j) {
                    var k = 0;
                    var iVert = iStartVert;

                    for (k = 0; k < iXVerts; ++k) {
                        pIndexValues[iIndex++] = iVert;
                        pIndexValues[iIndex++] = iVert + iLineStep;
                        iVert += iXStep;
                    }
                    iStartVert += iLineStep;

                    if (j + 1 < iTotalStrips) {
                        // add a degenerate to attach to
                        // the next row
                        pIndexValues[iIndex++] = (iVert - iXStep) + iLineStep;
                        pIndexValues[iIndex++] = iStartVert;
                    }
                }

                // return
                return iTotalIndexes;
            };

            TerrainSection.getCountIndexForStripGrid = function (iXVerts, iYVerts) {
                //TRIANGLESTRIP
                var iTotalStrips = iYVerts - 1;
                var iTotalIndexesPerStrip = iXVerts << 1;
                var iTotalIndexes = (iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1) - 2;
                return iTotalIndexes;
            };
            return TerrainSection;
        })(akra.scene.SceneObject);
        terrain.TerrainSection = TerrainSection;
    })(akra.terrain || (akra.terrain = {}));
    var terrain = akra.terrain;
})(akra || (akra = {}));
//# sourceMappingURL=TerrainSection.js.map
