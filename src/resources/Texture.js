/**
 * @file
 * @author Ivan Popov
 * @author Konstantin Molodyakov
 * @brief Texture class.
 */


Enum([
         NEAREST_MIPMAP_NEAREST = 0x2700,
         LINEAR_MIPMAP_NEAREST,
         NEAREST_MIPMAP_LINEAR,
         LINEAR_MIPMAP_LINEAR
     ], TEXTURE_MIN_FILTER, a.Texture.MinFilter);

/**
 * Texture class.
 * @param pEngine текущий экземпляр движка
 * @ctor
 * Constructor.
 */
function Texture(pEngine) {
    A_CLASS;

    /**
     * @enum eTextureFlags
     * @memberOf Texture
     */
    Enum([
             DynamicTexture = 0,
             CubeMap,
             MipMaps,
             RenderTarget,
             Paletized,
             Dinamic
         ], eTextureFlags, a.Texture);

    /**
     * @enum eForcedFormatFlags
     * @memberOf Texture
     */
    Enum([
             ForceMipLevels = 0,
             ForceFormat,
             ForceSize
         ], eForcedFormatFlags, a.Texture);

    this._pDevice = pEngine.pDevice;

    /**
     * Флаги определяющие тип текстуры, например кубическая
     *
     **/
    this._iFlags = 0;
    /**
     * WebGL texture object.
     * @private
     * @type WebGLTexture
     */
    this._pTexture = null;
    this._pFrameBuffer = null;

    this._pTextureParams = { };
    this._pTextureParams[a.TPARAM.MAG_FILTER] = a.TFILTER.LINEAR;
    this._pTextureParams[a.TPARAM.MIN_FILTER] = a.TFILTER.LINEAR;

    this._iWidth = 0;
    this._iHeight = 0;


    this._eFormat = a.IFORMATSHORT.RGBA;
    this._eType = a.ITYPE.UNSIGNED_BYTE;

    this._iSlot = -1;

    this._pRepackTexture = null;
    this._pSystemVertexDataTexture = null;
    this._isTextureChanged = false;
    this._initSystemStorageTexture(pEngine);
}

a.extend(Texture, a.ResourcePoolItem, a.RenderableObject);


PROPERTY(Texture, 'texture',
         /**
          * Получить текущую, используемую текстуру.
          * @treturn WebGLTexture Оригинальная текстура.
          */
             function () {
             return this._pTexture;
         });


PROPERTY(Texture, 'height',
         /**
          * Высота текстуры.
          * @treturn Int Width.
          */
             function () {
             if (this._pTexture) {
                 return this._iHeight;
             }
             return 0;
         },
         function (iValue) {
             this.resize(this._iWidth, iValue);
         });


PROPERTY(Texture, 'width',
         /**
          * Ширина текстуры.
          * @treturn Int Width.
          */
             function () {
             if (this._pTexture) {
                 return this._iWidth;
             }
             return 0;
         },
         function (iValue) {
             this.resize(iValue, this.height);
         });

PROPERTY(Texture, 'typeSize', function () {
    return a.getTypeSize(this._eType);
});

PROPERTY(Texture, 'numElementsPerPixel', function () {
    return a.getIFormatNumElements(this._eFormat);
});

/**
 * тип текстуры.
 */
PROPERTY(Texture, 'type',
         function () {
             return this._eType;
         },
         function (eValue) {
             if (this._pTexture) {
                 this.repack(this._iWidth, this._iHeight, this.format, eValue);
             }
             this._eType = eValue;
         });

/**
 * формат текстуры.
 */
PROPERTY(Texture, 'format',
         function () {
             return this._eFormat;
         },
         function (eValue) {
             if (this._pTexture) {
                 this.repack(this._iWidth, this._iHeight, eValue, this.type);
             }
             this._eFormat = eValue;
         });


PROPERTY(Texture, 'magFilter',
         function () {
             return this._getParameter(a.TPARAM.MAG_FILTER);
         },
         function (eValue) {
             this.applyParameter(a.TPARAM.MAG_FILTER, eValue);
         });


PROPERTY(Texture, 'minFilter',
         function () {
             return this._getParameter(a.TPARAM.MIN_FILTER);
         },
         function (eValue) {
             this.applyParameter(a.TPARAM.MIN_FILTER, eValue);
         });

PROPERTY(Texture, 'wraps',
         function () {
             return this._getParameter(a.TPARAM.WRAP_S);
         },
         function (eValue) {
             this.applyParameter(a.TPARAM.WRAP_S, eValue);
         });


PROPERTY(Texture, 'wrapt',
         function () {
             return this._getTexParameter(a.TPARAM.WRAP_T);
         },
         function (eValue) {
             this.applyParameter(a.TPARAM.WRAP_T, eValue);
         });

PROPERTY(Texture, 'target', function () {
    return TEST_BIT(this._iFlags, a.Texture.CubeMap) ? a.TTYPE.TEXTURE_CUBE_MAP : a.TTYPE.TEXTURE_2D;
});

Texture.prototype._initSystemStorageTexture = function (pEngine) {
    this._pEngine = pEngine;
    var pBuffer, pData, pMethod;
    if (pEngine._pSystemVertexDataTexture) {
        this._pSystemVertexDataTexture = pEngine._pSystemVertexDataTexture;
        pMethod = pEngine.pDisplayManager.renderMethodPool().findResource(".repack_texture");
        this.addRenderMethod(pMethod, ".repack_texture");
        return true;
    }

    pBuffer = pEngine.pDisplayManager.vertexBufferPool().createResource(".VERTEXBUFFER_TEX");
    debug_assert(pBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit)),
                 "Cannot create system vertex buffer");
    pData = pBuffer.getEmptyVertexData(0, [VE_FLOAT('SERIALNUMBER')]);
    pEngine._pSystemVertexDataTexture = this._pSystemVertexDataTexture = pData;
    pMethod = pEngine.pDisplayManager.renderMethodPool().createResource(".repack_texture");
    this.addRenderMethod(pMethod, ".repack_texture");
    this._setSystemEffect();

    return true;
};

Texture.prototype._setSystemEffect = function () {
    var pEngine = this._pEngine;
    var pEffect;
    if (pEngine.displayManager().componentPool().findResource("akra.system.texture_repack")) {
        // trace("Texture.prototype._setSystemEffect----------------->>>>");
        pEffect = pEngine.pDisplayManager.effectPool().createResource(".repack_texture");
        pEffect.create();
        pEffect.use("akra.system.texture_repack");
        this.switchRenderMethod(".repack_texture");
        this._pActiveSnapshot.method.effect = pEffect;
        return true;
    }
    return false;
};

Texture.prototype.flipY = function (bValue) {
    this._pDevice.pixelStorei(a.WEBGLS.UNPACK_FLIP_Y_WEBGL, bValue === undefined ? true : bValue);
};


Texture.prototype._getParameter = function (eName) {
//    return this._pDevice.getTexParameter(this.target, eName);
    return this._pTextureParams[eName];
};

Texture.prototype.applyParameter = function (eParam, eValue) {
    var pDevice = this._pDevice;
    if (this._pTexture) {
        var eTarget = this.target;
        this._pEngine.shaderManager().bindTexture(this);
        pDevice.texParameteri(eTarget, eParam, eValue);
        this._pTextureParams[eParam] = eValue;
    }
};

Texture.prototype._hasParams = function (pParams) {
    return (
        this._getParameter(a.TPARAM.MAG_FILTER) === pParams[a.TPARAM.MAG_FILTER] &&
        this._getParameter(a.TPARAM.MIN_FILTER) === pParams[a.TPARAM.MIN_FILTER] &&
        this._getParameter(a.TPARAM.WRAP_S) === pParams[a.TPARAM.WRAP_S] &&
        this._getParameter(a.TPARAM.WRAP_T) === pParams[a.TPARAM.WRAP_T]
        );
};

Texture.prototype.isCubeTexture = function () {
    return TEST_BIT(this._iFlags, a.Texture.CubeMap);
};

Texture.prototype.is2DTexture = function () {
    return !TEST_BIT(this._iFlags, a.Texture.CubeMap);
};

Texture.prototype.isCompressed = function () {
    return (this._eFormat >= a.IFORMAT.RGB_DXT1 && this._eFormat <= a.IFORMAT.RGBA_DXT4);
};

///**@type Boolean*/
//Texture.prototype.uploadCubeFace = function (pImage, face, copyAll) {};

/**
 * Мипмап уровни.
 * @treturn Int Mipmap levels.
 */
Texture.prototype.getMipLevels = function () {
    if (TEST_BIT(this._iFlags, a.Texture.MipMaps)) {
        return Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)) + 1;
    }
    else {
        return undefined;
    }
};

Texture.prototype.getPixelRGBA = function (iX, iY, iWidth, iHeight, pPixel, iMipMap, eCubeFlag) {

    var pDevice = this._pEngine.pDevice;

    if ((!TEST_BIT(this._iFlags, a.Texture.MipMaps)) && iMipMap != undefined) {
        debug_error("Запрашивается уровень мип мапа, хотя текстура их не содрежит");
    }
    if (iMipMap == undefined) {
        iMipMap = 0;
    }
    if (TEST_BIT(this._iFlags, a.Texture.MipMaps)) {
        debug_assert(iMipMap < Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)
                                             + 1), "Запрашивается уровень мип мапа, которого нет");
    }


    if (this._pFrameBuffer && this._pTexture) {
        pDevice.bindFramebuffer(a.BTYPE.FRAME_BUFFER, this._pFrameBuffer);

        if (this.isCubeTexture()) {
            debug_assert(eCubeFlag != undefined, "тип текстуры кубическая,а eCubeFlag - undefined")
            pDevice.framebufferTexture2D(a.BTYPE.FRAME_BUFFER, a.ATYPE.COLOR_ATTACHMENT0, eCubeFlag, this._pTexture,
                                         iMipMap);
        }
        else {
            debug_assert(eCubeFlag == undefined, "тип текстуры 2D,а eCubeFlag выставлен");
            pDevice.framebufferTexture2D(a.BTYPE.FRAME_BUFFER, a.ATYPE.COLOR_ATTACHMENT0, a.TTYPE.TEXTURE_2D,
                                         this._pTexture, iMipMap);
        }

        pDevice.readPixels(iX, iY, iWidth, iHeight, a.IFORMATSHORT.RGBA, a.ITYPE.UNSIGNED_BYTE, pPixel);
        pDevice.bindFramebuffer(a.BTYPE.FRAME_BUFFER, null);
        return pPixel;
    }
    else {
        return null;
    }
};

Texture.prototype.setPixelRGBA = function (iX, iY, iWidth, iHeight, pPixel, iMipMap, eCubeFlag) {
    iMipMap = iMipMap || 0;
    eCubeFlag = eCubeFlag || 0;

    var pDevice = this._pEngine.pDevice;
    var pRenderer = this._pEngine.shaderManager();
    debug_assert(!((!TEST_BIT(this._iFlags, a.Texture.MipMaps)) && iMipMap),
                 "Запрашивается уровень мип мапа, хотя текстура их не содрежит");

    if (TEST_BIT(this._iFlags, a.Texture.MipMaps)) {
        debug_assert(iMipMap < Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)
                                             + 1), "Запрашивается уровень мип мапа, которого нет");
    }

    if (this._pTexture === null) {
        return false;
    }

    if (this.isCubeTexture()) {
        debug_assert(eCubeFlag != undefined, "тип текстуры кубическая,а eCubeFlag - undefined");

        pRenderer.bindTexture(this);
        pDevice.texSubImage2D(eCubeFlag, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, this._eType, pPixel);
    }
    else {
//        pDevice.bindTexture(a.TTYPE.TEXTURE_2D, this._pTexture);
        pRenderer.bindTexture(this);
        if (this.isCompressed()) {
            pDevice.compressedTexSubImage2D(a.TTYPE.TEXTURE_2D, iMipMap, iX, iY, iWidth, iHeight, this._eFormat,
                                            pPixel);
        }
        else {
            pDevice.texSubImage2D(a.TTYPE.TEXTURE_2D, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, this._eType,
                                  pPixel);
        }
    }
    return true;
};


/**
 * Создание ресурса.
 * @treturn Boolean result
 */
Texture.prototype.createResource = function () {
    // innitialize the resource (called once)
    debug_assert(!this.isResourceCreated(),
                 "The resource has already been created.");

    // signal that the resource is now created,
    // but has not been enabled
    this.notifyCreated();
    this.notifyDisabled();
    return (true);
};

/**
 * Освобождение памяти, занимаемой текстурой
 * @param __pDevice девайс
 * @treturn Void
 */
Texture.prototype.releaseTexture = function () {
    var pDevice = this._pEngine.pDevice;
    if (this._pTexture) {
        pDevice.deleteTexture(this._pTexture);
        // this._isTextureChanged = true;
    }
    if (this._pFrameBuffer) {
        pDevice.deleteFramebuffer(this._pFrameBuffer);
    }
    this._pTexture = null;
    this._pFrameBuffer = null;
}

/**
 * Сгенерировать карту нормалей по картинке
 * @param pHeightMap картинка(new Img()) по которой будет сегнерирована текстура нормалей
 * @param iChannel номер канала из которого брать высоту, например красный 0, зеленый 1, синий 2
 * @treturn Boolean Результат.
 */
Texture.prototype.generateNormalMap = function (pHeightMap, iChannel, fAmplitude) {

    var pDevice = this._pEngine.pDevice;
    var pRenderer = this._pEngine.shaderManager();

    this.releaseTexture();
    this._pTexture = pDevice.createTexture();
    this._pFrameBuffer = pDevice.createFramebuffer();

    this._iWidth = pHeightMap.getWidth();
    this._iHeight = pHeightMap.getHeight();
    pRenderer.bindTexture(this);
    pDevice.texImage2D(a.TTYPE.TEXTURE_2D, 0, a.IFORMATSHORT.RGBA, this._iWidth,
                       this._iHeight, 0, a.IFORMATSHORT.RGBA,
                       a.ITYPE.UNSIGNED_BYTE, null);

    var pColor = new Uint8Array(this._iWidth * this._iHeight * 4);

    var pNormalTable = new Array(this._iWidth * this._iHeight);
    for (var i = 0; i < this._iWidth * this._iHeight; i++) {
        pNormalTable[i] = Vec3.create();
    }

    a.computeNormalMap(pDevice, pHeightMap, pNormalTable, iChannel, fAmplitude, 4);

    var iIndex;
    var iOffset;
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this._iWidth; x++) {
            iIndex = (y * this._iWidth) + x;
            iOffset = iIndex * 4;
            pColor[iOffset + 0] = pNormalTable[iIndex][0]// Red value
            pColor[iOffset + 1] = pNormalTable[iIndex][1]; // Green value
            pColor[iOffset + 2] = pNormalTable[iIndex][2]; // Blue value
            pColor[iOffset + 3] = 255; // Alpha value

        }
    }
    this.setPixelRGBA(0, 0, this._iWidth, this._iHeight, pColor);

    //delete pNormalTable;
};

/**
 * Сгенерировать нормализованный кубемап.
 * @treturn Boolean Результат.
 */
Texture.prototype.generateNormalizationCubeMap = function () {
    TODO('Texture::generateNormalizationCubeMap()');
};

/**
 * @treturn Boolean Результат.
 */
Texture.prototype.maskWithImage = function (pImage) {
    TODO('Texture::maskWithImage()');
};

/**
 * @treturn Boolean Результат.
 */
Texture.prototype.convertToNormalMap = function (iChannel, iFlags, fAmplitude) {
    TODO('Texture::convertToNormalMap()');
};

/**
 * @treturn Boolean Результат.
 */
Texture.prototype.getSurfaceLevel = function (iLevel, ppSurface) {
    TODO('Texture::getSurfaceLevel()');
};

/**
 * @private
 * @treturn Boolean Результат.
 */
Texture.prototype._loadFromResourceFile = function (InputFile) {
    TODO('Texture::_loadFromResourceFile()');
};

/**
 * @private
 * @treturn Boolean Результат.
 */
Texture.prototype._checkCubeTextureRequirements = function () {
    TODO('Texture::_checkCubeTextureRequirements()');
};


/**
 * Уничтожение ресурса
 * @treturn Boolean result
 */
Texture.prototype.destroyResource = function () {
    // destroy the resource
    //
    // we permit redundant calls to destroy, so there are no asserts here
    //
    if (this.isResourceCreated()) {
        // disable the resource
        this.disableResource();

        this.releaseTexture();

        this.notifyUnloaded();
        this.notifyDestroyed();

        return (true);
    }

    return (false);
};


/**
 * Восстановить ресурс.
 * Prepare the resource for use (create any volatile memory objects needed).
 * @treturn Boolean result
 */
Texture.prototype.restoreResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyRestored();
    return (true);
};


/**
 * Purge the resource from device-dependant memory.
 * @treturn Boolean result
 */
Texture.prototype.disableResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return(true);
};

/**
 * Проверка возможности параметров
 * @treturn Boolean result
 */
Texture.prototype._checkTextureRequirements = function (iWidth, iHeight, iMipLevels, eFormat) {
    return true;
};


/**
 * @private
 * @tparam pMemory
 * @treturn Boolean Результат.
 */
Texture.prototype._loadTextureFromMemory = function (pMemory) {
    TODO('Texture::_loadTextureFromMemory()');
}

/**
 * @private
 * @tparam sFilename Входной файл.
 * @treturn Boolean Результат.
 */
Texture.prototype._loadCubeTextureFromImageFile = function (sFilename) {
    TODO('Texture::_loadCubeTextureFromImageFile()');
};

/**
 * @private
 * @tparam pMemory
 * @treturn Boolean Результат.
 */
Texture.prototype._loadCubeTextureFromMemory = function (pMemory) {
    TODO('Texture::_loadCubeTextureFromMemory()');
};

/**
 * Load the resource from a file.
 * @tpram sFilename Имя текстуры (или NULL, что бы использовать имя ресурса).
 * @treturn Boolean Результат.
 */
// Переписать, херь написана
Texture.prototype.loadResource = function (sFileName) {
    if (!sFileName) {
        var sResourceName = this.findResourceName();
        if (sResourceName) {
            sFileName = sResourceName;
        }
    }

    var me = this;

    if ((sFileName.nodeName) &&
        (sFileName.nodeName.toLowerCase() == "canvas" || sFileName.nodeName.toLowerCase() == "img" ||
         sFileName.nodeName.toLowerCase() == "video")) {
        me.uploadHTMLElement(sFileName);
        return true;
    }
    else if ((sExt = (a.pathinfo(sFileName).ext)) &&
             (sExt == "bmp" || sExt == "jpeg" || sExt == "gif" || sExt == "png")) {
        var pImage = new Image();
        pImage.onload = function () {
            me.uploadHTMLElement(pImage);
        }
        pImage.src = sFileName;
        return true;
    }
    else {
        var pImage = new a.Img(this._pEngine);
        pImage.load(sFileName,
                    function () {
                        me.uploadImage(pImage);
                    }
        );
        return true;
    }
    //unreachable code
    //return false;
};


/**
 * Сохранить текстуру.
 *
 * @tparam
 * @treturn Boolean Результат.
 */
// save the resource to a file (or NULL to use the resource name)
Texture.prototype.saveResource = function (sFilename) {
    var pBaseTexture;
    var isOk;

    if (!sFilename) {
        var pString = this.findResourceName();

        if (pString) {
            sFilename = pString;
        }
    }

    pBaseTexture = this._pTexture;
    isOk = false;
    /* TODO: SaveTextureToFile(...)*/
    TODO('Texture::saveResource()');
    /*
     var isOk = a.SaveTextureToFile(filename,
     D3DXIFF_DDS,
     baseTexture,
     m_pPalette);*/
    return (isOk);
};


/**
 * @treturn Boolean
 */
Texture.prototype.uploadCubeFace = function (pImage, eFace, isCopyAll) {
    isCopyAll = isCopyAll || true;
    TODO('Texture::uploadCubeFace()');
};

Texture.prototype.uploadHTMLElement = function (pElement) {
    var pDevice = this._pEngine.pDevice;
    this.releaseTexture();
    this._pTexture = pDevice.createTexture();
    this._pFrameBuffer = pDevice.createFramebuffer();

    this._iWidth = pElement.width;
    this._iHeight = pElement.height;
    this._eFormat = a.IFORMATSHORT.RGBA;
    this._eType = a.ITYPE.UNSIGNED_BYTE;

    if (pElement.nodeName.toLowerCase() == "video") {
        SET_BIT(this._iFlags, a.Texture.Dinamic);
    }

    this._pEngine.shaderManager().bindTexture(this);
    this.flipY();
    pDevice.texImage2D(a.TTYPE.TEXTURE_2D, 0, this._eFormat, this._eFormat,
                       this._eType, pElement);

    this.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);
    this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.REPEAT);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.REPEAT);

    this.flipY(false);
//    this.unbind();

    this.notifyLoaded();
    this.notifyRestored();
}


Texture.prototype.uploadImage = function (pImage) {
    var pDevice = this._pEngine.pDevice;
    var nMipMaps;
    var iCubeFlags;
    var pRenderer = this._pEngine.shaderManager();

    this.releaseTexture();

    this._pTexture = pDevice.createTexture();
    this._pFrameBuffer = pDevice.createFramebuffer();

    if (!a.info.graphics.checkFormat(pDevice, pImage.getFormat())) {
        debug_print("Формат не поддерживается, происходит переконвертация");
        pImage.convert(a.IFORMAT.RGBA8);
    }

    this._iWidth = pImage.getWidth();
    this._iHeight = pImage.getHeight();
    this._eFormat = pImage.getFormatShort();
    this._eType = pImage.getType();

    nMipMaps = pImage.getMipLevels();

    if (nMipMaps == undefined || nMipMaps != (Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2,
                                                                 Math.log(this._iHeight) / Math.LN2)) + 1)) {
        CLEAR_BIT(this._iFlags, a.Texture.MipMaps);
        nMipMaps = 1;
    }
    else {
        SET_BIT(this._iFlags, a.Texture.MipMaps);
    }

    iCubeFlags = pImage.getCubeFlags();

    if (iCubeFlags == undefined || iCubeFlags != (FLAG(a.Img.POSITIVEX) | FLAG(a.Img.NEGATIVEX) |
                                                  FLAG(a.Img.POSITIVEY) | FLAG(a.Img.NEGATIVEY) |
                                                  FLAG(a.Img.POSITIVEZ) | FLAG(a.Img.NEGATIVEZ))) {
        CLEAR_BIT(this._iFlags, a.Texture.CubeMap);

        pRenderer.bindTexture(this);
        this.flipY();

        for (var i = 0; i < nMipMaps; i++) {
            if (!pImage.isCompressed()) {
                pDevice.texImage2D(a.TTYPE.TEXTURE_2D, i, this._eFormat, pImage.getWidth(i),
                                   pImage.getHeight(i), 0, this._eFormat,
                                   this._eType, new Uint8Array(pImage.getData(i)));
            }
            else {
                pDevice.compressedTexImage2D(a.TTYPE.TEXTURE_2D, i,
                                             this._eFormat, pImage.getWidth(i),
                                             pImage.getHeight(i), 0, new Uint8Array(pImage.getData(i)));
            }
        }
    }
    else {
        SET_BIT(this._iFlags, a.Texture.CubeMap);

        pRenderer.bindTexture(this);
        this.flipY();

        for (var k = 0; k < 6; k++) {
            for (var i = 0; i < nMipMaps; i++) {
                if (!pImage.isCompressed()) {
                    pDevice.texImage2D(a.TTYPE.TEXTURE_CUBE_MAP_POSITIVE_X + k, i, this._eFormat,
                                       pImage.getWidth(i),
                                       pImage.getHeight(i), 0, this._eFormat,
                                       this._eType, new Uint8Array(pImage.getData(i, k)));
                }
                else {
                    pDevice.compressedTexImage2D(a.TTYPE.TEXTURE_CUBE_MAP_POSITIVE_X + k, i,
                                                 this._eFormat, pImage.getWidth(i),
                                                 pImage.getHeight(i), 0, new Uint8Array(pImage.getData(i, k)));
                }

            }
        }
    }

    if (TEST_BIT(this._iFlags, a.Texture.MipMaps) && (this.minFilter == a.TFILTER.LINEAR || this.minFilter
        == a.TFILTER.NEAREST)) {
        //this.minFilter = (this.minFilter - a.TFILTER.NEAREST) * 2 + a.TFILTER.NEAREST_MIPMAP_NEAREST;
        this.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR_MIPMAP_LINEAR);
    }
    else if (!TEST_BIT(this._iFlags, a.Texture.MipMaps) && this.minFilter != a.TFILTER.LINEAR && this.minFilter
        != a.TFILTER.NEAREST) {
        console.log(this.minFilter, Math.floor(this.minFilter - a.TFILTER.NEAREST_MIPMAP_NEAREST) / 2 + a.TFILTER.NEAREST);
        this.applyParameter(a.TPARAM.MIN_FILTER,
                            Math.floor(this.minFilter - a.TFILTER.NEAREST_MIPMAP_NEAREST) / 2 + a.TFILTER.NEAREST);
        //pDevice.generateMipmap(a.TTYPE.TEXTURE_2D);
    }
    //trace('uploaded image to texture: ', this._iWidth, 'x', this._iHeight);
    this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.REPEAT);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.REPEAT);
//    this.unbind();
    this.flipY(false);

    this.notifyLoaded();
    this.notifyRestored();
};

/**
 * Изменить размеры текстуры и переложить данные в ней.
 * @param iWidth
 * @param iHeight
 * @return Boolean
 */
Texture.prototype.resize = function (iWidth, iHeight) {
    TODO('Texture:: resize with scale');
    return false;
};

/**
 * Расширить текстуру, не изменяя расположения пикселей в ней.
 * @param iWidth
 * @param iHeight
 */
Texture.prototype.extend = function (iWidth, iHeight) {
    TODO('extend texture');
    return false;
};

/**
 * Перепаковка текстуры.
 * @tparam Int iWidth Новая ширина текстуры.
 * @tparam Int iHeight Новая высота текстуры.
 * @tparam Enumeration(IMAGE_FORMAT) eFormat Новый формат текстуры.
 * @tparam Enumeration(IMAGE_TYPE) eType Новый тип текстуры.
 */
Texture.prototype.repack = function (iWidth, iHeight, eFormat, eType) {
    debug_assert(this._pTexture, 'Cannot repack, because texture not created.');

    eFormat = eFormat || this._eFormat;
    eType = eType || this._eType;

    var pDevice = this._pEngine.pDevice;
    var pRenderer = this._pEngine.shaderManager();

    if (!this._pRepackTexture) {
        this._pRepackTexture = this._pEngine.displayManager().texturePool().createResource(".DuplicateTexture" +
                                                                                           a.sid());
    }

    var pDestinationTexture = this._pRepackTexture;
    pDestinationTexture.createTexture(iWidth, iHeight, 0, eFormat, eType, [null]);

    // pDestinationTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    // pDestinationTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
    // pDestinationTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
    // pDestinationTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);

    this.switchRenderMethod(".repack_texture");

    var pVertexData = this._pSystemVertexDataTexture;
    var nCount = this._iWidth * this._iHeight;
    var pRenderIndexData = new Float32Array(nCount);
    
    for (var i = 0; i < nCount; i++) {
        pRenderIndexData[i] = i;
    }

    pVertexData.resize(nCount);
    pVertexData.setData(pRenderIndexData, 'SERIALNUMBER');

    var pSnapshot = this._pActiveSnapshot;
    var pEntry = null;

    pRenderer.switchRenderStage(a.RenderStage.DEFAULT);
    pRenderer.setViewport(0, 0, iWidth, iHeight);
    pRenderer.activateFrameBuffer();

    pRenderer.applyFrameBufferTexture(pDestinationTexture);
    this.startRender();

    for (var i = 0; i < this.totalPasses(); i++) {
        // trace("Pass #" + i);
        this.activatePass(i);
        pSnapshot.applyTextureBySemantic("TEXTURE0", this);
        pSnapshot.applyVertexData(pVertexData, a.PRIMTYPE.POINTLIST);
        pSnapshot.setParameter("sourceTextureSize", [this._iWidth, this._iHeight]);
        pSnapshot.setParameter("destinationTextureSize", [iWidth, iHeight]);
        this.renderPass();
        this.deactivatePass();
    }

    this.finishRender();
    // console.log(this.findResourceName());
    pRenderer.deactivateFrameBuffer();
    pRenderer.processRenderStage();

    pDevice.flush();

    this.releaseTexture();
    this._pTexture = pDestinationTexture._pTexture;
    pDestinationTexture._pTexture = null;
    this._isTextureChanged = true;
    pDestinationTexture._isTextureChanged = true;
    this._eFormat = eFormat;
    this._eType = eType;
    this._iWidth = iWidth;
    this._iHeight = iHeight;

    A_TRACER.MESG("END REPACK TEXTURE #" + this.toNumber())

    return true;
};

/**
 * Создание текстуры.
 * @tparam uint iWidth
 * @tparam uint iHeight
 * @tparam uint eFlags
 * @tparam Enumeration(a.IFORMAT) eFormat
 * @tparam Enumeration(a.ITYPE) eType
 * @tparam Float32Array/Array/null pData Данные. Можно подавать массив, содержащий все
 * данные для каждого миплевела или подать TypedArray с данными только для нулевого мипмапа.
 *
 * @treturn Boolean
 */
Texture.prototype.createTexture = function (iWidth, iHeight, eFlags, eFormat, eType, pData) {

    var pDevice = this._pEngine.pDevice;
    var pRenderer = this._pEngine.shaderManager();
    var nMipMaps = 1;

    this._iWidth = iWidth;
    this._iHeight = iHeight;

    if (eFlags == undefined) {
        eFlags = 0;
    }
    if (pDevice.getError()) {
        throw new Error();
    }

    this.releaseTexture();
    this._pTexture = pDevice.createTexture();
//    this._pFrameBuffer = pDevice.createFramebuffer();
    this._iFlags = eFlags;
    this._eFormat = eFormat || this._eFormat;
    this._eType = eType || this._eType;
    // this._iSlot = -1;

    if (!(pData instanceof Array)) {
        pData = [pData];
    }
 
    pRenderer.bindTexture(this);
    pDevice.pixelStorei(pDevice.UNPACK_ALIGNMENT, 1);
    //this.flipY();

    if (TEST_BIT(eFlags, a.Texture.MipMaps)) {
        nMipMaps = Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)) + 1;
    }

    if (TEST_BIT(eFlags, a.Texture.CubeMap)) {
        for (var k = 0; k < 6; k++) {
            for (var i = 0; i < nMipMaps; i++) {
                // console.log("texture size: ", this._iWidth, this._iHeight);
                pDevice.texImage2D(a.TTYPE.TEXTURE_CUBE_MAP_POSITIVE_X + k, i, this._eFormat, this._iWidth,
                                   this._iHeight, 0, this._eFormat, this._eType, pData[i] ? pData[i] : null);
            }
        }
    }
    else {
        if (this.isCompressed()) {
            for (var i = 0; i < nMipMaps; i++) {
                // console.log("texture size: ", this._iWidth, this._iHeight);
                pDevice.compressedTexImage2D(a.TTYPE.TEXTURE_2D, i, this._eFormat, this._iWidth,
                                             this._iHeight, 0, pData[i] ? pData[i] : null);
            }
        }
        else {
            for (var i = 0; i < nMipMaps; i++) {
                //trace('Texture:: creating texture miplevel:', i);
                // console.log("texture size: ", this._iWidth, this._iHeight);
                //console.log((new Error).stack)
                pDevice.texImage2D(a.TTYPE.TEXTURE_2D, i, this._eFormat, this._iWidth,
                                   this._iHeight, 0, this._eFormat, this._eType, pData[i] ? pData[i] : null);
            }
        }
    }

    if (this._eType !== a.ITYPE.FLOAT) {
        this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.REPEAT);
        this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.REPEAT);
        this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
        this.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);
    }
    else {
        this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
        this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
        this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
        this.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);
    }

    this.notifyLoaded();
    this.notifyRestored();
    
    return true;
};

Texture.prototype.bind = function () {
    A_TRACER.MESG("Bind texture with #" + this.toNumber());
    this._pEngine.pDevice.bindTexture(this.target, this._pTexture);
    return true;
};

Texture.prototype.unbind = function () {
    this._pEngine.pDevice.bindTexture(this.target, null);
};

Texture.prototype.activate = function () {
    var pManager = this._pEngine.pShaderManager;
    pManager.activateTexture(this);
};

Texture.prototype.setSlot = function (iSlot) {
    this._iSlot = iSlot;
};

Texture.prototype.getSlot = function () {
    return this._iSlot;
};

/**
 * @treturn Boolean Результат.
 */
Texture.prototype.createCubeTexture = function (iSize, iMipLevels, eFormat) {
    TODO('Texture::createCubeTexture()');
};

/**
 * @treturn Boolean Результат.
 */
Texture.prototype.convertToNormalMap = function (iChannel, iFlags, fAmplitude) {
    TODO('Texture::convertToNormalMap()');
};

Texture.prototype.useAlignment = function () {

};

Define(a.TextureManager(pEngine), function () {
    a.ResourcePool(pEngine, a.Texture);
});

a.Texture = Texture;
