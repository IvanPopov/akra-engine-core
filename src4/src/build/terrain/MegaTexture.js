/// <reference path="../idl/IMegaTexture.ts" />
/// <reference path="../idl/IViewport.ts" />
/// <reference path="../idl/IRenderPass.ts" />
/// <reference path="../idl/IRPC.ts" />
var akra;
(function (akra) {
    /// <reference path="../net/RPC.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="../pool/resources/Texture.ts" />
    /// <reference path="../pixelUtil/PixelBox.ts" />
    /// <reference path="../events.ts" />
    (function (terrain) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        var MegaTexture = (function () {
            function MegaTexture(pEngine) {
                this.guid = akra.guid();
                this._pEngine = null;
                // private _pDevice = null;
                this._pObject = null;
                this._pWorldExtents = null;
                //Координаты камеры на объекте
                this._v2fCameraCoord = new Vec2(0, 0);
                //Путь откуда запрашиваются куски текстуры
                this._sSurfaceTextures = "";
                //Маскимальный размер стороны текстуры
                this._v2iOriginalTextreMaxSize = new Vec2(1024 * 32.);
                this._v2iOriginalTextreMinSize = new Vec2(1024 * 4.);
                this._v2iTextureLevelSize = new Vec2(1024);
                this._iMinLevel = 0;
                this._iMaxLevel = 0;
                //Тип хранимых тектсур
                this._eTextureFormat = 10 /* BYTE_RGB */;
                //Размер блока текстуры(минимальный размер выгружаемого куска текстуры)
                this._iBlockSize = 32;
                this._iBufferWidth = 0;
                this._iBufferHeight = 0;
                this._pTextures = null;
                this._pTextureForSwap = null;
                //Карта с разметкой буфера, чтобы знать какой части буффер уже отсылалось задание на заполнение
                this._pSectorLoadInfo = null;
                this._pXY = null;
                //Всякие темповые буферы
                this._pLoadInfoForSwap = null;
                this._pDefaultSectorLoadInfo = null;
                this._pRPC = null;
                this._fTexCourdXOld = 0xFFFFFFFF;
                this._fTexCourdYOld = 0xFFFFFFFF;
                this._nCountRender = 0;
                this._iSectorLifeTime = 60000;
                this._pSamplerUniforms = null;
                this._pLoadStatusUniforms = null;
                this._pTexcoordOffsetUniforms = null;
                this._bManualMinLevelLoad = false;
                this._bStreaming = false;
                this._tLastUpdateTime = 0;
                this._fThresHold = 0.1;
                this._bColored = false;
                this._iTryCount = 0;
                this._iTrafficCounter = 0;
                this._iResponseCount = 0;
                this._iQueryCount = 0;
                this._fnPRCCallBack = null;
                this.pDataList = new Array(8);
                this.setupSignals();
                this._pEngine = pEngine;
            }
            MegaTexture.prototype.setupSignals = function () {
                this.minLevelLoaded = this.minLevelLoaded || new akra.Signal(this);
            };

            MegaTexture.prototype.getManualMinLevelLoad = function () {
                return this._bManualMinLevelLoad;
            };

            MegaTexture.prototype.setManualMinLevelLoad = function (bManual) {
                this._bManualMinLevelLoad = bManual;
            };

            MegaTexture.prototype.init = function (pObject, sSurfaceTextures) {
                this._pObject = pObject;
                this._pWorldExtents = pObject.getLocalBounds();
                this._sSurfaceTextures = sSurfaceTextures;

                if (!this.checkTextureSizeSettings()) {
                    akra.logger.critical("Wrong texture size settings for MegaTexture");
                }

                var iCountTex = this._iMaxLevel - this._iMinLevel + 1;

                this._pTextures = new Array(iCountTex);
                this._pSectorLoadInfo = new Array(iCountTex);
                this._pXY = new Array(iCountTex);

                this._iBufferWidth = this._v2iTextureLevelSize.x * 1;
                this._iBufferHeight = this._v2iTextureLevelSize.y * 1;

                this._pLoadInfoForSwap = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x / (this._iBlockSize * this._iBlockSize));
                this._pDefaultSectorLoadInfo = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x / (this._iBlockSize * this._iBlockSize));

                for (var i = 0; i < this._pDefaultSectorLoadInfo.length; i++) {
                    this._pDefaultSectorLoadInfo[i] = 0;
                }

                this.setSectorLoadInfoToDefault(this._pLoadInfoForSwap);

                //Создаем куски мегатекстуры
                var pRmgr = this._pEngine.getResourceManager();

                this._pTextureForSwap = pRmgr.createTexture(".texture-for-mega-swap_" + akra.guid());
                this._pTextureForSwap.create(this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y, 1, null, akra.ETextureFlags.DYNAMIC, 0, 1, 3553 /* TEXTURE_2D */, this._eTextureFormat);
                this._pTextureForSwap.setWrapMode(10242 /* WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                this._pTextureForSwap.setWrapMode(10243 /* WRAP_T */, 33071 /* CLAMP_TO_EDGE */);

                for (var i = 0; i < this._pTextures.length; i++) {
                    this._pTextures[i] = pRmgr.createTexture(".texture-for-mega-" + i + "_" + akra.guid());
                    if (i === 0) {
                        this._pTextures[i].create(this._v2iOriginalTextreMinSize.x, this._v2iOriginalTextreMinSize.y, 1, null, akra.ETextureFlags.DYNAMIC, 0, 1, 3553 /* TEXTURE_2D */, 10 /* BYTE_RGB */);

                        this._pSectorLoadInfo[i] = new Uint32Array(this._v2iOriginalTextreMinSize.y * this._v2iOriginalTextreMinSize.x / (this._iBlockSize * this._iBlockSize));
                        this._pXY[i] = {
                            iX: 0, iY: 0,
                            iTexX: 0, iTexY: 0,
                            width: this._v2iOriginalTextreMinSize.x,
                            height: this._v2iOriginalTextreMinSize.y,
                            isUpdated: true, isLoaded: false
                        };
                    } else {
                        this._pTextures[i].create(this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y, 1, null, akra.ETextureFlags.DYNAMIC, 0, 1, 3553 /* TEXTURE_2D */, this._eTextureFormat);

                        this._pSectorLoadInfo[i] = new Uint32Array(this._v2iTextureLevelSize.y * this._v2iTextureLevelSize.x / (this._iBlockSize * this._iBlockSize));

                        this.setSectorLoadInfoToDefault(this._pSectorLoadInfo[i]);

                        this._pTextures[i].setWrapMode(10242 /* WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                        this._pTextures[i].setWrapMode(10243 /* WRAP_T */, 33071 /* CLAMP_TO_EDGE */);

                        this._pXY[i] = {
                            iX: 0, iY: 0,
                            iTexX: 0, iTexY: 0,
                            width: this._pTextures[i].getWidth(),
                            height: this._pTextures[i].getHeight(),
                            isUpdated: true, isLoaded: false };
                    }
                }

                this.createUniforms();

                this.testDataInit();

                this._pRPC = akra.net.createRpc();

                if (!this._bManualMinLevelLoad) {
                    this._pRPC.joined.connect(this, this.loadMinTextureLevel, 1 /* BROADCAST */);
                    this._pRPC.error.connect(this, this.rpcErrorOccured, 1 /* BROADCAST */);
                }

                this._pRPC.setProcedureOption("getMegaTexture", "lifeTime", 60000);
                this._pRPC.setProcedureOption("getMegaTexture", "priority", 1);

                this._pRPC.setProcedureOption("loadMegaTexture", "lifeTime", 60000);
                this._pRPC.setProcedureOption("loadMegaTexture", "priority", 1);
            };

            MegaTexture.prototype.enableStreaming = function (bEnable) {
                if (typeof bEnable === "undefined") { bEnable = true; }
                if (bEnable) {
                    this.connectToServer();
                } else {
                    this.disconnectFromServer();
                }
            };

            MegaTexture.prototype.connectToServer = function (sURL /*"ws://23.21.68.208:6112"*/ ) {
                if (typeof sURL === "undefined") { sURL = "ws://192.168.88.53:6112"; }
                this._pRPC.join(sURL);

                // this._pRPC.join("ws://localhost:6112");
                this._bStreaming = true;

                for (var i = 1; i < this._pSectorLoadInfo.length; i++) {
                    this.setSectorLoadInfoToDefault(this._pSectorLoadInfo[i]);
                }
            };

            MegaTexture.prototype.disconnectFromServer = function () {
                this._pRPC.detach();
                this._bStreaming = false;
            };

            MegaTexture.prototype.prepareForRender = function (pViewport) {
                if (!this._bStreaming) {
                    return;
                }

                if (!this._pXY[0].isLoaded) {
                    return;
                }

                var tCurrentTime = (this._pEngine.getTimer().getAbsoluteTime() * 1000) >>> 0;

                if (tCurrentTime - this._tLastUpdateTime < 30) {
                    return;
                }

                this._tLastUpdateTime = tCurrentTime;

                var pCamera = pViewport.getCamera();
                var v4fCameraCoord = Vec4.temp(pCamera.getWorldPosition(), 1.);
                var m4fTransposeInverse = this._pObject.getInverseWorldMatrix();

                v4fCameraCoord = m4fTransposeInverse.multiplyVec4(v4fCameraCoord);

                //Вычисление текстурных координат над которыми находиться камера
                var fTexCourdX = (v4fCameraCoord.x - this._pWorldExtents.x0) / akra.math.abs(this._pWorldExtents.x1 - this._pWorldExtents.x0);
                var fTexCourdY = (v4fCameraCoord.y - this._pWorldExtents.y0) / akra.math.abs(this._pWorldExtents.y1 - this._pWorldExtents.y0);

                this._v2fCameraCoord.set(fTexCourdX, fTexCourdY);

                var iX = 0, iX1 = 0, iX2 = 0;
                var iY = 0, iY1 = 0, iY2 = 0;
                var iWidth = 0, iHeight = 0;

                //Нужно ли перекладвывать, отсавим на запас 8 блоков
                //Опираемся на текстуру самого хорошего разрешения
                //Координаты квадрата this._v2iTextureLevelSize.x Х this._v2iTextureLevelSize.y с центром в камере на текстуре самого большого разрешения.
                iX = akra.math.round(fTexCourdX * (this.getWidthOrig(this._pTextures.length - 1)) - this._v2iTextureLevelSize.x / 2);
                iY = akra.math.round(fTexCourdY * (this.getHeightOrig(this._pTextures.length - 1)) - this._v2iTextureLevelSize.y / 2);

                iWidth = this._v2iTextureLevelSize.x;
                iHeight = this._v2iTextureLevelSize.y;

                // Перемещаем данные из одного пиксель буффера в другой
                if ((this._fTexCourdXOld !== fTexCourdX || this._fTexCourdYOld !== fTexCourdY)) {
                    for (i = 1; i < this._pTextures.length; i++) {
                        // logger.log("Уровень", i)
                        //Вычисляем новые координаты буфера в текстуре
                        var iXnew = akra.math.round(fTexCourdX * this.getWidthOrig(i) - this._v2iTextureLevelSize.x / 2);
                        var iYnew = akra.math.round(fTexCourdY * this.getHeightOrig(i) - this._v2iTextureLevelSize.y / 2);

                        // iXnew -= (this._iBufferWidth - this._v2iTextureLevelSize.x) / 2;
                        // iYnew -= (this._iBufferHeight - this._v2iTextureLevelSize.y) / 2;
                        //Округлили на размер блока
                        iXnew = akra.math.round((iXnew / this._iBlockSize)) * this._iBlockSize;
                        iYnew = akra.math.round((iYnew / this._iBlockSize)) * this._iBlockSize;

                        //Копирование совпадающего куска
                        var iXOverlappingBlockInOldBuf = iXnew - this._pXY[i].iX;
                        var iYOverlappingBlockInOldBuf = iYnew - this._pXY[i].iY;
                        var iXOverlappingBlockInNewBuf = -iXOverlappingBlockInOldBuf;
                        var iYOverlappingBlockInNewBuf = -iYOverlappingBlockInOldBuf;

                        iXOverlappingBlockInOldBuf = akra.math.max(0, iXOverlappingBlockInOldBuf);
                        iYOverlappingBlockInOldBuf = akra.math.max(0, iYOverlappingBlockInOldBuf);
                        iXOverlappingBlockInNewBuf = akra.math.max(0, iXOverlappingBlockInNewBuf);
                        iYOverlappingBlockInNewBuf = akra.math.max(0, iYOverlappingBlockInNewBuf);

                        if (iXOverlappingBlockInOldBuf < this._iBufferWidth && iYOverlappingBlockInOldBuf < this._iBufferHeight && iXOverlappingBlockInNewBuf < this._iBufferWidth && iYOverlappingBlockInNewBuf < this._iBufferHeight) {
                            //произошло совпадение кусков
                            var iOverlappingBlockWidth = this._iBufferWidth - akra.math.abs(iXnew - this._pXY[i].iX);
                            var iOverlappingBlockHeight = this._iBufferHeight - akra.math.abs(iYnew - this._pXY[i].iY);

                            //копируем данные
                            var pSwapBuffer = this._pTextureForSwap.getBuffer(0, 0);
                            var pTextureBuffer = this._pTextures[i].getBuffer(0, 0);

                            var pTmpBox1 = akra.geometry.Box.temp(iXOverlappingBlockInNewBuf, iYOverlappingBlockInNewBuf, iOverlappingBlockWidth + iXOverlappingBlockInNewBuf, iOverlappingBlockHeight + iYOverlappingBlockInNewBuf);
                            var pTmpBox2 = akra.geometry.Box.temp(iXOverlappingBlockInOldBuf, iYOverlappingBlockInOldBuf, iOverlappingBlockWidth + iXOverlappingBlockInOldBuf, iOverlappingBlockHeight + iYOverlappingBlockInOldBuf);

                            var pTmpBox3 = akra.geometry.Box.temp(0, 0, this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y);

                            var pTempPixelBox = akra.pixelUtil.PixelBox.temp(pTmpBox3, this._eTextureFormat);
                            pTempPixelBox.data = null;

                            pSwapBuffer.blit(pTextureBuffer, pTmpBox2, pTmpBox2); /* Save overlapped data */

                            pTextureBuffer.blitFromMemory(pTempPixelBox, pTmpBox3); /* Clear texture */

                            pTextureBuffer.blit(pSwapBuffer, pTmpBox2, pTmpBox1); /* Put overlapperd data */

                            this.setSectorLoadInfoToDefault(this._pLoadInfoForSwap);

                            // logger.log(iXOverlappingBlockInOldBuf + " ---> " + iXOverlappingBlockInNewBuf,
                            // 	iYOverlappingBlockInOldBuf + " ---> " + iYOverlappingBlockInNewBuf);
                            this._setDataBetweenBufferMap(this._pLoadInfoForSwap, iXOverlappingBlockInNewBuf / this._iBlockSize, iYOverlappingBlockInNewBuf / this._iBlockSize, this._pSectorLoadInfo[i], iXOverlappingBlockInOldBuf / this._iBlockSize, iYOverlappingBlockInOldBuf / this._iBlockSize, iOverlappingBlockWidth / this._iBlockSize, iOverlappingBlockHeight / this._iBlockSize);

                            var s = this._pSectorLoadInfo[i];
                            this._pSectorLoadInfo[i] = this._pLoadInfoForSwap;
                            this._pLoadInfoForSwap = s;
                        } else {
                            var pTextureBuffer = this._pTextures[i].getBuffer(0, 0);
                            var pTmpBox3 = akra.geometry.Box.temp(0, 0, this._v2iTextureLevelSize.x, this._v2iTextureLevelSize.y);

                            var pTempPixelBox = akra.pixelUtil.PixelBox.temp(pTmpBox3, this._eTextureFormat);
                            pTempPixelBox.data = null;

                            pTextureBuffer.blitFromMemory(pTempPixelBox, pTmpBox3);

                            this.setSectorLoadInfoToDefault(this._pSectorLoadInfo[i]);
                        }

                        this._pXY[i].iX = iXnew;
                        this._pXY[i].iY = iYnew;
                    }
                }

                for (var i = 1; i < this._pTextures.length; i++) {
                    // for (var i: uint = this._pTextures.length - 1; i >= 1; i--) {
                    iX = akra.math.round(fTexCourdX * this.getWidthOrig(i) - this._v2iTextureLevelSize.x / 2);
                    iY = akra.math.round(fTexCourdY * this.getHeightOrig(i) - this._v2iTextureLevelSize.y / 2);

                    iX = akra.math.round((iX / this._iBlockSize)) * this._iBlockSize;
                    iY = akra.math.round((iY / this._iBlockSize)) * this._iBlockSize;

                    this._pXY[i].iTexX = iX / this.getWidthOrig(i);
                    this._pXY[i].iTexY = iY / this.getHeightOrig(i);

                    iWidth = this._v2iTextureLevelSize.x;
                    iHeight = this._v2iTextureLevelSize.y;

                    //На данный момент нужен кусок текстуры таких размеров iX1,iY1,iWidth,iHeight,
                    var iAreaX1 = iX;
                    var iAreaY1 = iY;
                    var iAreaX2 = iX + iWidth;
                    var iAreaY2 = iY + iHeight;

                    //Смотрим попадаем ли мы в текущий буфер
                    //Типа попали
                    //Значит нужно загрузить необходимые куски
                    //Обрезаемся чтобы не вылезти за пределы
                    // iX -= this._iBlockSize * 8;
                    // iY -= this._iBlockSize * 8;
                    // iWidth += this._iBlockSize * 16;
                    // iHeight += this._iBlockSize * 16;
                    iX1 = akra.math.clamp(iX, 0, this.getWidthOrig(i));
                    iY1 = akra.math.clamp(iY, 0, this.getHeightOrig(i));
                    iX2 = akra.math.clamp(iX + iWidth, 0, this.getWidthOrig(i));
                    iY2 = akra.math.clamp(iY + iHeight, 0, this.getHeightOrig(i));

                    var iAreaX1 = akra.math.clamp(iAreaX1, 0, this.getWidthOrig(i));
                    var iAreaY1 = akra.math.clamp(iAreaY1, 0, this.getHeightOrig(i));
                    var iAreaX2 = akra.math.clamp(iAreaX2, 0, this.getWidthOrig(i));
                    var iAreaY2 = akra.math.clamp(iAreaY2, 0, this.getHeightOrig(i));

                    if (this._pXY[i - 1].isLoaded) {
                        this.getDataFromServer(i, iX1, iY1, iX2 - iX1, iY2 - iY1, iAreaX1, iAreaY1, iAreaX2 - iAreaX1, iAreaY2 - iAreaY1);
                    } else {
                        this._pXY[i].isLoaded = false;
                    }
                    // this.getDataFromServer(i, iX1, iY1, iX2 - iX1, iY2 - iY1, /*Остальные область проверки*/iAreaX1,
                    //                        iAreaY1, iAreaX2 - iAreaX1, iAreaY2 - iAreaY1);
                }

                this._fTexCourdXOld = fTexCourdX;
                this._fTexCourdYOld = fTexCourdY;
            };

            MegaTexture.prototype.applyForRender = function (pRenderPass) {
                pRenderPass.setForeign("nTotalLevels", this._iMaxLevel - this._iMinLevel + 1);
                pRenderPass.setUniform("MIN_MEGATEXTURE_LEVEL", this._iMinLevel);
                pRenderPass.setUniform("threshold", this._fThresHold);
                pRenderPass.setUniform("bColored", this._bColored);

                for (var i = 0; i < this._pTextures.length; i++) {
                    this._pLoadStatusUniforms[i] = this._pXY[i].isLoaded ? 1 : 0;
                    this._pTexcoordOffsetUniforms[i].set(this._pXY[i].iTexX, this._pXY[i].iTexY);
                    this._pSamplerUniforms[i].texture = this._pTextures[i];
                }

                pRenderPass.setUniform("S_TERRAIN", this._pSamplerUniforms);
                pRenderPass.setUniform("TEXTURE_LOAD_STATUS", this._pLoadStatusUniforms);
                pRenderPass.setUniform("TEXTURE_LEVEL_OFFSET", this._pTexcoordOffsetUniforms);
            };

            MegaTexture.prototype.getWidthOrig = function (iLevel) {
                return this._v2iTextureLevelSize.x << (this._iMinLevel + iLevel);
            };

            MegaTexture.prototype.getHeightOrig = function (iLevel) {
                return this._v2iTextureLevelSize.y << (this._iMinLevel + iLevel);
            };

            MegaTexture.prototype.setMinLevelTexture = function (pImg) {
                this._pTextures[0].destroyResource();
                this._pTextures[0].loadImage(pImg);
                this._pXY[0].isLoaded = true;

                this.minLevelLoaded.emit();
            };

            MegaTexture.prototype.checkTextureSizeSettings = function () {
                var v2iCountTexMin = Vec2.temp();
                var v2iCountTexMax = Vec2.temp();

                v2iCountTexMin.x = akra.math.log2(this._v2iOriginalTextreMinSize.x / this._v2iTextureLevelSize.x);
                v2iCountTexMin.y = akra.math.log2(this._v2iOriginalTextreMinSize.y / this._v2iTextureLevelSize.y);

                v2iCountTexMax.x = akra.math.log2(this._v2iOriginalTextreMaxSize.x / this._v2iTextureLevelSize.x);
                v2iCountTexMax.y = akra.math.log2(this._v2iOriginalTextreMaxSize.y / this._v2iTextureLevelSize.y);

                if (v2iCountTexMin.x !== v2iCountTexMin.y || v2iCountTexMax.x !== v2iCountTexMax.y) {
                    return false;
                }

                if (v2iCountTexMax.x < v2iCountTexMin.x) {
                    return false;
                }

                this._iMinLevel = v2iCountTexMin.x;
                this._iMaxLevel = v2iCountTexMax.x;

                return true;
            };

            MegaTexture.prototype.createUniforms = function () {
                var iCountTex = this._iMaxLevel - this._iMinLevel + 1;

                this._pSamplerUniforms = new Array(iCountTex);
                this._pLoadStatusUniforms = new Array(iCountTex);
                this._pTexcoordOffsetUniforms = new Array(iCountTex);

                for (var i = 0; i < iCountTex; i++) {
                    this._pSamplerUniforms[i] = {
                        textureName: "",
                        texture: this._pTextures[i],
                        wrap_s: 33071 /* CLAMP_TO_EDGE */,
                        wrap_t: 33071 /* CLAMP_TO_EDGE */,
                        mag_filter: 9729 /* LINEAR */,
                        min_filter: 9729 /* LINEAR */
                    };

                    this._pLoadStatusUniforms[i] = 0;
                    this._pTexcoordOffsetUniforms[i] = new Vec2();
                }
            };

            MegaTexture.prototype.rpcErrorOccured = function (pRPC, pError) {
                this._pRPC.error.disconnect(this.rpcErrorOccured, 1 /* BROADCAST */);

                akra.logger.warn("Server for MeagTexture not response. Connection can not be established. Report us please.");
            };

            MegaTexture.prototype.loadMinTextureLevel = function () {
                var me = this;
                var sExt = "dds";

                this._pSectorLoadInfo[0][0] = (this._pEngine.getTimer().getAbsoluteTime() * 1000) >>> 0;
                this._iTryCount++;

                if (this._iTryCount > 5) {
                    akra.logger.critical("Server for MegaTexture not response. Wait time out exceeded. Report us please.");
                }

                this._pRPC.proc('loadMegaTexture', me._sSurfaceTextures, sExt, me._v2iOriginalTextreMinSize.x, me._v2iOriginalTextreMinSize.x, function (pError, pData) {
                    if (me._pXY[0].isLoaded) {
                        return;
                    }

                    if (!akra.isNull(pError)) {
                        if (pError.code === 1 /* CALLBACK_LIFETIME_EXPIRED */) {
                            me.loadMinTextureLevel();
                        } else {
                            akra.logger.critical("Server for MegaTexture not response correctly. Report us please.");
                        }
                        return;
                    }

                    var pTempImg = me._pEngine.getResourceManager().getImagePool().findResource(".megatexture.temp_image");

                    if (akra.isNull(pTempImg)) {
                        pTempImg = me._pEngine.getResourceManager().getImagePool().createResource(".megatexture.temp_image");
                    }

                    pTempImg.load(pData, sExt, function (isLoaded) {
                        me._pTextures[0].destroyResource();
                        me._pTextures[0].loadImage(pTempImg);
                        me._pXY[0].isLoaded = true;
                        pTempImg.destroyResource();

                        me._pRPC.joined.disconnect(me.loadMinTextureLevel, 1 /* BROADCAST */);
                        me._pRPC.error.disconnect(me.rpcErrorOccured, 1 /* BROADCAST */);

                        me.minLevelLoaded.emit();
                    });
                });
                // this.getDataFromServer(0, 0, 0, this._v2iOriginalTextreMinSize.x, this._v2iOriginalTextreMinSize.y);
            };

            MegaTexture.prototype.getDataFromServer = function (iLevelTex, iOrigTexX, iOrigTexY, iWidth, iHeight, iAreaX, iAreaY, iAreaWidth, iAreaHeight) {
                var iBlockSize = this._iBlockSize;

                var iOrigTexEndX = akra.math.ceil((iOrigTexX + iWidth) / iBlockSize) * iBlockSize;
                var iOrigTexEndY = akra.math.ceil((iOrigTexY + iHeight) / iBlockSize) * iBlockSize;
                iOrigTexX = akra.math.max(0, iOrigTexX);
                iOrigTexY = akra.math.max(0, iOrigTexY);

                // iOrigTexX = math.floor(iOrigTexX / iBlockSize) * iBlockSize;
                // iOrigTexY = math.floor(iOrigTexY / iBlockSize) * iBlockSize;
                iOrigTexEndX = akra.math.min(iOrigTexEndX, this.getWidthOrig(iLevelTex));
                iOrigTexEndY = akra.math.min(iOrigTexEndY, this.getHeightOrig(iLevelTex));

                var iAreaEndX = iAreaX + iAreaWidth;
                var iAreaEndY = iAreaY + iAreaHeight;
                iAreaX = akra.math.max(0, iAreaX);
                iAreaY = akra.math.max(0, iAreaY);
                iAreaEndX = akra.math.min(iAreaEndX, this.getWidthOrig(iLevelTex));
                iAreaEndY = akra.math.min(iAreaEndY, this.getHeightOrig(iLevelTex));

                var isLoaded = true;
                var tCurrentTime = (this._pEngine.getTimer().getAbsoluteTime() * 1000) >>> 0;

                for (var i = iOrigTexY; i < iOrigTexEndY; i += iBlockSize) {
                    for (var j = iOrigTexX; j < iOrigTexEndX; j += iBlockSize) {
                        var iSectorInfoCoord = (i - this._pXY[iLevelTex].iY) / iBlockSize * (this._pXY[iLevelTex].width / iBlockSize) + (j - this._pXY[iLevelTex].iX) / iBlockSize;

                        if (this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] !== 0xFFFFFFFF) {
                            isLoaded = false;
                        }

                        if (tCurrentTime - this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] < this._iSectorLifeTime) {
                            continue;
                        }
                        if (this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] === 0xFFFFFFFF) {
                            continue;
                        }

                        this._pSectorLoadInfo[iLevelTex][iSectorInfoCoord] = tCurrentTime;

                        var iLev = iLevelTex;
                        var iX = j, iY = i;

                        var iXBuf = j - this._pXY[iLevelTex].iX;
                        var iYBuf = i - this._pXY[iLevelTex].iY;

                        if (iXBuf < 0 || iXBuf > this._pXY[iLevelTex].width - iBlockSize || iYBuf < 0 || iYBuf > this._pXY[iLevelTex].height - iBlockSize) {
                            return;
                        }

                        this._iQueryCount++;

                        this.getDataByRPC(iLevelTex, j, i, iBlockSize);
                    }
                }
                this._pXY[iLevelTex].isLoaded = isLoaded;
            };

            MegaTexture.prototype._printTraffic = function () {
                akra.logger.log(this._iTrafficCounter / 1000000 + "Mb", this._iQueryCount + "/" + this._iResponseCount);
            };

            MegaTexture.prototype.getDataByRPC = function (iLev, iX, iY, iBlockSize) {
                if (!this._bStreaming) {
                    return;
                }

                var me = this;

                if (akra.isNull(this._fnPRCCallBack)) {
                    this._fnPRCCallBack = function (pError, pData) {
                        //var pError = null;
                        //var pData = this.pDataList[this._iMinLevel + iLev];
                        //var pTextureData = pData;
                        if (!akra.isNull(pError)) {
                            // debug_print(pError.message);
                            return;
                        }

                        me._iTrafficCounter += pData.length;
                        var pHeaderData = new Uint16Array(pData.buffer, pData.byteOffset, 4);
                        var pTextureData = pData.subarray(8);
                        var iLev = akra.math.log2(pHeaderData[0] / me._v2iTextureLevelSize.x) - me._iMinLevel;
                        var iBlockSize = pHeaderData[1];
                        var iX = pHeaderData[2];
                        var iY = pHeaderData[3];

                        var iXBuf = iX - me._pXY[iLev].iX;
                        var iYBuf = iY - me._pXY[iLev].iY;

                        if (iXBuf < 0 || iXBuf > me._pXY[iLev].width - iBlockSize || iYBuf < 0 || iYBuf > me._pXY[iLev].height - iBlockSize) {
                            return;
                        }

                        var iSectorInfoCoord = iYBuf / iBlockSize * (me._pXY[iLev].width / iBlockSize) + iXBuf / iBlockSize;

                        if (me._pSectorLoadInfo[iLev][iSectorInfoCoord] === 0xFFFFFFFF) {
                            return;
                        }

                        me._iResponseCount++;
                        me._pSectorLoadInfo[iLev][iSectorInfoCoord] = 0xFFFFFFFF;

                        var pTmpBox1 = akra.geometry.Box.temp(0, 0, iBlockSize, iBlockSize);
                        var pTmpBox2 = akra.geometry.Box.temp(iXBuf, iYBuf, iBlockSize + iXBuf, iBlockSize + iYBuf);

                        var pSourceBox = akra.pixelUtil.PixelBox.temp(pTmpBox1, me._eTextureFormat, pTextureData);

                        me._pTextures[iLev].getBuffer(0, 0).blitFromMemory(pSourceBox, pTmpBox2);
                        pSourceBox.data = null;
                    };
                }

                this._pRPC.proc('getMegaTexture', me._sSurfaceTextures, me.getWidthOrig(iLev), me.getHeightOrig(iLev), iX, iY, iBlockSize, iBlockSize, me._eTextureFormat, this._fnPRCCallBack);
            };

            MegaTexture.prototype.setDataT = function (pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth, iBlockHeight, iComponents) {
                iBlockHeight = akra.math.max(0, iBlockHeight);
                iBlockWidth = akra.math.max(0, iBlockWidth);
                iBlockHeight = akra.math.min(iBlockHeight, iHeight - iY, iInHeight - iInY);
                iBlockWidth = akra.math.min(iBlockWidth, iWidth - iX, iInWidth - iInX);

                if (pBuffer.length < ((iY + iBlockHeight - 1) * iWidth + iX + iBlockWidth) * iComponents) {
                    akra.debug.error("Выход за предел массива 1");
                }
                if (pBufferIn.length < ((iInY + iBlockHeight - 1) * iInWidth + iInX + iBlockWidth) * iComponents) {
                    akra.debug.error("Выход за предел массива 2");
                }

                var iLenStr = iBlockWidth * iComponents;
                var iStartIn = 0;
                var iStartOut = 0;
                for (var i = 0; i < iBlockHeight; i++) {
                    iStartIn = ((iInY + i) * iInWidth + iInX) * iComponents;
                    iStartOut = ((iY + i) * iWidth + iX) * iComponents;

                    if (pBufferIn.BYTES_PER_ELEMENT == 8) {
                        pBuffer.set(new Float64Array(pBufferIn.buffer.slice(iStartIn * 8, (iStartIn + iLenStr) * 8)), iStartOut);
                    } else if (pBufferIn.BYTES_PER_ELEMENT == 4) {
                        pBuffer.set(new Uint32Array(pBufferIn.buffer.slice(iStartIn * 4, (iStartIn + iLenStr) * 4)), iStartOut);
                    } else if (pBufferIn.BYTES_PER_ELEMENT == 2) {
                        pBuffer.set(new Uint16Array(pBufferIn.buffer.slice(iStartIn * 2, (iStartIn + iLenStr) * 2)), iStartOut);
                    } else {
                        pBuffer.set(new Uint8Array(pBufferIn.buffer.slice(iStartIn, iStartIn + iLenStr)), iStartOut);
                    }
                }
            };

            MegaTexture.prototype._setDataBetweenBufferMap = function (pBuffer, iX, iY, pBufferIn, iInX, iInY, iBlockWidth, iBlockHeight) {
                var iInWidth = this._iBufferWidth / this._iBlockSize;
                var iInHeight = this._iBufferHeight / this._iBlockSize;
                var iComponents = 1;
                var iWidth = this._iBufferWidth / this._iBlockSize;
                var iHeight = this._iBufferHeight / this._iBlockSize;
                this.setDataT(pBuffer, iX, iY, iWidth, iHeight, pBufferIn, iInX, iInY, iInWidth, iInHeight, iBlockWidth, iBlockHeight, iComponents);
            };

            MegaTexture.prototype.setSectorLoadInfoToDefault = function (pBuffer) {
                pBuffer.set(this._pDefaultSectorLoadInfo, 0);
            };

            MegaTexture.prototype.testDataInit = function () {
                for (var i = 0; i < this.pDataList.length; i++) {
                    this.pDataList[i] = new Uint8Array(this._iBlockSize * this._iBlockSize * 3);

                    var iLev = i;
                    var pData = this.pDataList[i];

                    for (var k = 0; k < pData.length; k += 3) {
                        if (iLev === 0) {
                            pData[k] = 0;
                            pData[k + 1] = 255;
                            pData[k + 2] = 0;
                        } else if (iLev === 1) {
                            pData[k] = 255;
                            pData[k + 1] = 0;
                            pData[k + 2] = 0;
                        } else if (iLev === 2) {
                            pData[k] = 0;
                            pData[k + 1] = 0;
                            pData[k + 2] = 255;
                        } else if (iLev === 3) {
                            pData[k] = 255;
                            pData[k + 1] = 0;
                            pData[k + 2] = 255;
                        } else if (iLev === 4) {
                            pData[k] = 255;
                            pData[k + 1] = 255;
                            pData[k + 2] = 0;
                        } else if (iLev === 5) {
                            pData[k] = 0;
                            pData[k + 1] = 255;
                            pData[k + 2] = 255;
                        } else {
                            pData[k] = 170;
                            pData[k + 1] = 50;
                            pData[k + 2] = 170;
                        }
                    }
                }
            };
            return MegaTexture;
        })();
        terrain.MegaTexture = MegaTexture;
    })(akra.terrain || (akra.terrain = {}));
    var terrain = akra.terrain;
})(akra || (akra = {}));
//# sourceMappingURL=MegaTexture.js.map
