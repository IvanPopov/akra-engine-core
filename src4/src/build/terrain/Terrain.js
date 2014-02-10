/// <reference path="../idl/ITerrain.ts" />
/// <reference path="../idl/IEffect.ts" />
/// <reference path="../idl/IRenderTechnique.ts" />
/// <reference path="../idl/IViewport.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../pool/resources/Texture.ts" />
    /// <reference path="../data/RenderDataCollection.ts" />
    /// <reference path="../geometry/Rect3d.ts" />
    /// <reference path="../scene/SceneObject.ts" />
    /// <reference path="../render/Screen.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="MegaTexture.ts" />
    /// <reference path="TerrainSection.ts" />
    (function (terrain) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        var Terrain = (function (_super) {
            __extends(Terrain, _super);
            function Terrain(pScene, eType) {
                if (typeof eType === "undefined") { eType = 66 /* TERRAIN */; }
                _super.call(this, pScene, eType);
                this._pEngine = null;
                // private _pDevice = null;
                this._pWorldExtents = new akra.geometry.Rect3d();
                this._v3fWorldSize = new Vec3();
                this._v3fMapScale = new Vec3();
                //массив подчиненный секций
                this._pSectorArray = null;
                this._pDataFactory = null;
                this._v2fSectorSize = new Vec2();
                //Таблица(карта высот)
                this._pHeightTable = null;
                this._pNormalMapTexture = null;
                this._pNormalMapImage = null;
                this._pBaseNormalTexture = null;
                this._pBaseNormalImage = null;
                this._pHeightMapTexture = null;
                this._pTempNormalColor = new akra.color.Color();
                //отоброжаемые куски текстуры
                this._pMegaTexures = null;
                this._bUseVertexNormal = false;
                this._pDefaultRenderMethod = null;
                this._pRenderMethod = null;
                this._pDefaultScreen = null;
                this._fMaxHeight = 0.;
                this._f2DDiagonal = 0.;
                this._isCreate = false;
                this._bManualMegaTextureInit = false;
                this._bShowMegaTexture = true;
                this._bMegaTextureCreated = false;
                this._sSurfaceTextures = "";
                this._pEngine = pScene.getManager().getEngine();
                this._pDataFactory = akra.data.createRenderDataCollection(this._pEngine, akra.ERenderDataBufferOptions.VB_READABLE);

                if (akra.config.terrain.useMegaTexture) {
                    this._pMegaTexures = new akra.terrain.MegaTexture(this._pEngine);
                }
            }
            Terrain.prototype.getDataFactory = function () {
                return this._pDataFactory;
            };

            Terrain.prototype.getWorldExtents = function () {
                return this._pWorldExtents;
            };

            Terrain.prototype.getWorldSize = function () {
                return this._v3fWorldSize;
            };

            Terrain.prototype.getMapScale = function () {
                return this._v3fMapScale;
            };

            Terrain.prototype.getSectorCountX = function () {
                return this._iSectorCountX;
            };

            Terrain.prototype.getSectorCountY = function () {
                return this._iSectorCountY;
            };

            Terrain.prototype.getSectorSize = function () {
                return this._v2fSectorSize;
            };

            Terrain.prototype.getTableWidth = function () {
                return this._iTableWidth;
            };

            Terrain.prototype.getTableHeight = function () {
                return this._iTableHeight;
            };

            Terrain.prototype.getSectorShift = function () {
                return this._iSectorShift;
            };

            Terrain.prototype.getMaxHeight = function () {
                return this._fMaxHeight;
            };

            Terrain.prototype.getTerrain2DLength = function () {
                return this._f2DDiagonal;
            };

            Terrain.prototype.isCreate = function () {
                return this._isCreate;
            };

            Terrain.prototype.getMegaTexture = function () {
                return this._pMegaTexures;
            };

            Terrain.prototype.getManualMegaTextureInit = function () {
                return this._bManualMegaTextureInit;
            };

            Terrain.prototype.setManualMegaTextureInit = function (bManual) {
                this._bManualMegaTextureInit = bManual;
            };

            Terrain.prototype.getShowMegaTexture = function () {
                return this._bShowMegaTexture;
            };

            Terrain.prototype.setShowMegaTexture = function (bShow) {
                this._bShowMegaTexture = bShow;
            };

            Terrain.prototype._initSystemData = function () {
                var pEngine = this._pEngine, pRmgr = pEngine.getResourceManager();

                if (akra.isNull(this._pDefaultRenderMethod)) {
                    var pMethod = null, pEffect = null;

                    pMethod = pRmgr.getRenderMethodPool().findResource(".terrain_render");

                    if (!akra.isNull(pMethod)) {
                        this._pDefaultRenderMethod = pMethod;
                        return true;
                    }

                    pEffect = pRmgr.createEffect(".terrain_render");
                    pEffect.addComponent("akra.system.terrain");

                    pMethod = pRmgr.createRenderMethod(".terrain_render");
                    pMethod.setEffect(pEffect);
                    pMethod.setSurfaceMaterial(pRmgr.createSurfaceMaterial(".terrain_render"));
                    var pMat = pMethod.getSurfaceMaterial().getMaterial();
                    pMat.name = "terrain";

                    pMat.shininess = 30;
                    pMat.emissive.set(0);
                    pMat.specular.set(1);

                    this._pDefaultRenderMethod = pMethod;
                }

                if (akra.isNull(this._pDefaultScreen)) {
                    this._pDefaultScreen = new akra.render.Screen(pEngine.getRenderer());

                    var pMethod = null, pEffect = null;

                    pMethod = pRmgr.getRenderMethodPool().findResource(".terrain_generate_normal");

                    if (akra.isNull(pMethod)) {
                        pEffect = pRmgr.createEffect(".terrain_generate_normal");
                        pEffect.addComponent("akra.system.generateNormalMapByHeightMap");

                        pMethod = pRmgr.createRenderMethod(".terrain_generate_normal");
                        pMethod.setEffect(pEffect);
                    }

                    this._pDefaultScreen.addRenderMethod(pMethod, ".terrain_generate_normal");

                    this._pDefaultScreen.getTechnique(".terrain_generate_normal").render.connect(this, this._onGenerateNormalRender);
                }

                return true;
            };

            Terrain.prototype.init = function (pMaps, worldExtents, iShift, iShiftX, iShiftY, sSurfaceTextures, pRootNode) {
                if (typeof pRootNode === "undefined") { pRootNode = null; }
                if (!akra.isNull(pRootNode)) {
                    if (!this.attachToParent(pRootNode)) {
                        return false;
                    }
                }

                this._initSystemData();

                //Основные параметры
                this._iSectorShift = iShift;
                this._iSectorUnits = 1 << iShift;
                this._iSectorVerts = this._iSectorUnits + 1;

                this._pWorldExtents = new akra.geometry.Rect3d(worldExtents.x0, worldExtents.x1, worldExtents.y0, worldExtents.y1, worldExtents.z0, worldExtents.z1);
                this._pWorldExtents.normalize();
                this._v3fWorldSize = this._pWorldExtents.size(this._v3fWorldSize);

                //this._iTableWidth >> this._iSectorShift;
                this._iSectorCountX = 1 << iShiftX;

                //this._iTableHeight >> this._iSectorShift;
                this._iSectorCountY = 1 << iShiftY;

                this._iTableWidth = this._iSectorCountX * this._iSectorUnits + 1;
                this._iTableHeight = this._iSectorCountY * this._iSectorUnits + 1;

                this._v2fSectorSize.set(this._v3fWorldSize.x / this._iSectorCountX, this._v3fWorldSize.y / this._iSectorCountY);

                this._v3fMapScale.x = this._v3fWorldSize.x / this._iTableWidth;
                this._v3fMapScale.y = this._v3fWorldSize.y / this._iTableHeight;
                this._v3fMapScale.z = this._v3fWorldSize.z;

                // convert the height map to
                // data stored in local tables
                this._buildHeightAndNormalTables(pMaps.height, pMaps.normal);

                pMaps.height.destroyResource();
                pMaps.normal.destroyResource();

                if (!this._allocateSectors()) {
                    akra.debug.error("Can not alloacte terrain sections");
                    return false;
                }

                this.computeBoundingBox();

                if (akra.config.terrain.useMegaTexture) {
                    this._sSurfaceTextures = sSurfaceTextures;
                    if (!this._bManualMegaTextureInit) {
                        //Мегатекстурные параметры
                        this.initMegaTexture(sSurfaceTextures);
                    }
                }

                this._isCreate = true;

                return true;
            };

            Terrain.prototype.initMegaTexture = function (sSurfaceTextures) {
                if (typeof sSurfaceTextures === "undefined") { sSurfaceTextures = this._sSurfaceTextures; }
                if (akra.config.terrain.useMegaTexture) {
                    this._pMegaTexures.init(this, sSurfaceTextures);
                    this._bMegaTextureCreated = true;
                }
            };

            Terrain.prototype.findSection = function (iX, iY) {
                var pSection = null;

                if (iX >= 0 && iX < this._iSectorCountX && iY >= 0 && iY < this._iSectorCountY) {
                    pSection = this._pSectorArray[(iY * this._iSectorCountX) + iX];
                } else {
                    // if we had additional cRoamTerrain objects,
                    // we could reach out here to link with neighbors
                }

                return pSection;
            };

            Terrain.prototype._allocateSectors = function () {
                this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

                for (var y = 0; y < this._iSectorCountY; ++y) {
                    for (var x = 0; x < this._iSectorCountX; ++x) {
                        var v2fSectorPos = new Vec2();
                        var r2fSectorRect = new akra.geometry.Rect2d();

                        v2fSectorPos.set(this._pWorldExtents.x0 + (x * this._v2fSectorSize.x), this._pWorldExtents.y0 + (y * this._v2fSectorSize.y));

                        r2fSectorRect.set(v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x, v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

                        var iXPixel = x << this._iSectorShift;
                        var iYPixel = y << this._iSectorShift;
                        var iIndex = (y * this._iSectorCountX) + x;

                        this._pSectorArray[iIndex] = this.getScene().createTerrainSection();
                        this._pSectorArray[iIndex]._createRenderable();

                        if (!this._pSectorArray[iIndex]._internalCreate(this, x, y, iXPixel, iYPixel, this._iSectorVerts, this._iSectorVerts, r2fSectorRect)) {
                            return false;
                        }
                    }
                }

                this._setRenderMethod(this._pDefaultRenderMethod);

                return true;
            };

            Terrain.prototype._setRenderMethod = function (pRenderMethod) {
                this._pRenderMethod = pRenderMethod;

                if (this._pRenderMethod) {
                    this._pRenderMethod.addRef();
                }

                var pSection = null;

                for (var i = 0; i < this._pSectorArray.length; i++) {
                    pSection = this._pSectorArray[i];

                    pSection.getRenderable().getTechnique().setMethod(this._pDefaultRenderMethod);
                    pSection.getRenderable().getTechnique().render.connect(this, this._onRender);
                }
            };

            Terrain.prototype._buildHeightAndNormalTables = function (pImageHightMap, pImageNormalMap) {
                var fHeight = 0;
                var iComponents = 4;
                this._pHeightTable = null;

                var iMaxY = this._iTableHeight;
                var iMaxX = this._iTableWidth;

                //var pColorData: Uint8Array = new Uint8Array(4 * iMaxY * iMaxX);
                this._pHeightTable = new Float32Array(iMaxX * iMaxY); /*float*/

                // first, build a table of heights
                if (pImageHightMap.isResourceLoaded()) {
                    if (pImageHightMap.getWidth() !== iMaxX && pImageHightMap.getHeight() !== iMaxY) {
                        akra.logger.warn("Размеры карты высот не совпадают с другими размерами. Нужно: " + iMaxX + "x" + iMaxY + ". Есть: " + pImageHightMap.getWidth() + "x" + pImageHightMap.getHeight());
                        return;
                    }

                    for (var iY = 0; iY < iMaxY; iY++) {
                        for (var iX = 0; iX < iMaxX; iX++) {
                            fHeight = pImageHightMap.getColorAt(this._pTempNormalColor, iX, iY).r;
                            fHeight = (fHeight * this._v3fMapScale.z) + this._pWorldExtents.z0;

                            this._pHeightTable[iY * iMaxX + iX] = fHeight;
                        }
                    }

                    if (this._useVertexNormal()) {
                        this.computeBaseNormal(pImageHightMap);
                    }
                } else {
                    akra.logger.warn("Height map not loaded");
                }

                if (pImageNormalMap.isResourceLoaded()) {
                    this._pNormalMapTexture = this._pEngine.getResourceManager().createTexture(".terrain-normal-texture" + this.guid);
                    this._pNormalMapTexture.loadImage(pImageNormalMap);
                    this._pNormalMapImage = pImageNormalMap;
                } else {
                    akra.logger.warn("Normal map not loaded");
                }
            };

            Terrain.prototype.readWorldHeight = function (iMapX, iMapY) {
                if (arguments.length === 2) {
                    var iFixedMapX = iMapX, iFixedMapY = iMapY;

                    if (iFixedMapX >= this._iTableWidth) {
                        iFixedMapX = this._iTableWidth - 1;
                    }
                    if (iFixedMapY >= this._iTableHeight) {
                        iFixedMapY = this._iTableHeight - 1;
                    }

                    return this._pHeightTable[(iFixedMapY * this._iTableWidth) + iFixedMapX];
                } else {
                    var iMapIndex = iMapX;
                    akra.logger.assert(iMapIndex < this._iTableWidth * this._iTableHeight, "invalid index");
                    return this._pHeightTable[iMapIndex];
                }
            };

            Terrain.prototype.readWorldNormal = function (v3fNormal, iMapX, iMapY) {
                if (iMapX >= this._pBaseNormalImage.getWidth()) {
                    iMapX = this._pBaseNormalImage.getWidth() - 1;
                }
                if (iMapY >= this._pBaseNormalImage.getHeight()) {
                    iMapY = this._pBaseNormalImage.getHeight() - 1;
                }

                this._pBaseNormalImage.getColorAt(this._pTempNormalColor, iMapX, iMapY);
                v3fNormal.set(this._pTempNormalColor.r, this._pTempNormalColor.g, this._pTempNormalColor.b);

                return v3fNormal;
            };

            Terrain.prototype.projectPoint = function (v3fCoord, v3fDestenation) {
                var v4fTerrainCoord = Vec4.temp(v3fCoord, 1.);

                v4fTerrainCoord = this.getInverseWorldMatrix().multiplyVec4(v4fTerrainCoord);

                if (v4fTerrainCoord.x < this.getWorldExtents().x0 || v4fTerrainCoord.x > this.getWorldExtents().x1 || v4fTerrainCoord.y < this.getWorldExtents().y0 || v4fTerrainCoord.y > this.getWorldExtents().y1) {
                    return false;
                }

                var iMapX = akra.math.floor((v4fTerrainCoord.x - this.getWorldExtents().x0) / this.getWorldExtents().sizeX() * this.getTableWidth());
                var iMapY = akra.math.floor((v4fTerrainCoord.y - this.getWorldExtents().y0) / this.getWorldExtents().sizeY() * this.getTableHeight());
                var fHeight = this.readWorldHeight(iMapX, iMapY);

                var v4fTempDestenation = Vec4.temp(v4fTerrainCoord.x, v4fTerrainCoord.y, fHeight, 1.);

                v4fTempDestenation = this.getWorldMatrix().multiplyVec4(v4fTempDestenation);
                v3fDestenation.set(v4fTempDestenation.x, v4fTempDestenation.y, v4fTempDestenation.z);

                return true;
            };

            /**
            * Подготовка терраина к рендерингу.
            */
            Terrain.prototype.prepareForRender = function (pViewport) {
                if (akra.config.terrain.useMegaTexture) {
                    if (this._bMegaTextureCreated && this._bShowMegaTexture) {
                        this._pMegaTexures.prepareForRender(pViewport);
                    }
                }
            };

            /**
            * Сброс параметров.
            */
            Terrain.prototype.reset = function () {
            };

            Terrain.prototype.computeBaseNormal = function (pImageHightMap) {
                var pRmgr = this._pEngine.getResourceManager();

                this._pHeightMapTexture = pRmgr.createTexture(".terrain-hight-texture" + this.guid);
                this._pHeightMapTexture.loadImage(pImageHightMap);

                this._pBaseNormalTexture = pRmgr.createTexture(".terrain-base-normal-texture" + this.guid);
                this._pBaseNormalTexture.create(pImageHightMap.getWidth(), pImageHightMap.getHeight(), 1, null, 512 /* RENDERTARGET */, 0, 0, 3553 /* TEXTURE_2D */, 28 /* R8G8B8A8 */);

                var pTarget = this._pBaseNormalTexture.getBuffer().getRenderTarget();
                pTarget.setAutoUpdated(false);

                var pViewport = pTarget.addViewport(new akra.render.Viewport(null, ".terrain_generate_normal"));
                pViewport.setDepthParams(false, false, 0);
                pViewport.setClearEveryFrame(false);

                pViewport.startFrame();
                pViewport.renderObject(this._pDefaultScreen);
                pViewport.endFrame();

                this._pBaseNormalImage = pRmgr.createImg(".terrain-base-normal-img" + this.guid);
                this._pBaseNormalTexture.convertToImage(this._pBaseNormalImage, false);
            };

            Terrain.prototype._tableIndex = function (iMapX, iMapY) {
                // clamp to the table dimensions
                if (iMapX >= this._iTableWidth) {
                    iMapX = this._iTableWidth - 1;
                }

                if (iMapY >= this._iTableHeight) {
                    iMapY = this._iTableHeight - 1;
                }

                return (iMapY * this._iTableWidth) + iMapX;
            };

            Terrain.prototype._useVertexNormal = function () {
                return this._bUseVertexNormal;
            };

            Terrain.prototype.computeBoundingBox = function () {
                var fX0, fY0, fZ0, fX1, fY1, fZ1;

                fX0 = fY0 = fZ0 = akra.MAX_FLOAT64;
                fX1 = fY1 = fZ1 = akra.MIN_FLOAT64;

                for (var i = 0; i < this._pSectorArray.length; i++) {
                    var pSectionBox = this._pSectorArray[i].getLocalBounds();

                    fX0 = akra.math.min(fX0, pSectionBox.x0);
                    fY0 = akra.math.min(fY0, pSectionBox.y0);
                    fZ0 = akra.math.min(fZ0, pSectionBox.z0);

                    fX1 = akra.math.max(fX1, pSectionBox.x1);
                    fY1 = akra.math.max(fY1, pSectionBox.y1);
                    fZ1 = akra.math.max(fZ1, pSectionBox.z1);
                }

                this.accessLocalBounds().set(fX0, fX1, fY0, fY1, fZ0, fZ1);

                this._fMaxHeight = fZ1 - fZ0;
                this._f2DDiagonal = akra.math.sqrt((fX1 - fX0) * (fX1 - fX0) + (fY1 - fY0) * (fY1 - fY0));
            };

            Terrain.prototype._onRender = function (pTechnique, iPass) {
                var pPass = pTechnique.getPass(iPass);

                pPass.setSamplerTexture("S_NORMAL_MAP", this._pNormalMapTexture);

                if (akra.config.terrain.useMegaTexture) {
                    if (this._bMegaTextureCreated && this._bShowMegaTexture) {
                        this._pMegaTexures.applyForRender(pPass);
                    } else {
                        pPass.setUniform("S_TERRAIN", null);
                        pPass.setForeign("nTotalLevels", 0);
                    }
                } else {
                    pPass.setForeign("nTotalLevels", 0);
                }
            };

            Terrain.prototype._onGenerateNormalRender = function (pTechnique, iPass) {
                var pPass = pTechnique.getPass(iPass);

                pPass.setSamplerTexture("HEIGHT_SAMPLER", this._pHeightMapTexture);
                pPass.setUniform("STEPS", Vec2.temp(1. / this._pHeightMapTexture.getWidth(), 1. / this._pHeightMapTexture.getHeight()));
                pPass.setUniform("SCALE", this._v3fMapScale.z);
                pPass.setUniform("CHANNEL", 0);
            };
            return Terrain;
        })(akra.scene.SceneObject);
        terrain.Terrain = Terrain;
    })(akra.terrain || (akra.terrain = {}));
    var terrain = akra.terrain;
})(akra || (akra = {}));
//# sourceMappingURL=Terrain.js.map
