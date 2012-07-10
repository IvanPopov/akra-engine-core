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
function Texture (pEngine) {
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
        Paletized
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

    this._iWidth = 0;
    this._iHeight = 0;


    this._eFormat = a.IFORMATSHORT.RGBA;
    this._eType = a.ITYPE.UNSIGNED_BYTE;
}

a.extend(Texture, a.ResourcePoolItem);


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

Texture.prototype.flipY = function (bValue) {
    this._pDevice.pixelStorei(a.WEBGLS.UNPACK_FLIP_Y_WEBGL, bValue === undefined ? true : bValue);
};


Texture.prototype._getParameter = function (eName) {
    return this._pDevice.getTexParameter(this.target, eName);
};

Texture.prototype.applyParameter = function (eParam, eValue) {
    var pDevice = this._pDevice;
    if (this._pTexture) {
        var eTarget = this.target;
        pDevice.bindTexture(eTarget, this._pTexture);
        pDevice.texParameteri(eTarget, eParam, eValue);
        pDevice.bindTexture(eTarget, null);
    }
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

        pDevice.bindTexture(a.TTYPE.TEXTURE_CUBE_MAP, this._pTexture);
        pDevice.texSubImage2D(eCubeFlag, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, this._eType, pPixel);
        pDevice.bindTexture(a.TTYPE.TEXTURE_CUBE_MAP, null);
    }
    else {
        pDevice.bindTexture(a.TTYPE.TEXTURE_2D, this._pTexture);
        if(this.isCompressed()) {
            pDevice.compressedTexSubImage2D(a.TTYPE.TEXTURE_2D, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, pPixel);
        }
        else {
            pDevice.texSubImage2D(a.TTYPE.TEXTURE_2D, iMipMap, iX, iY, iWidth, iHeight, this._eFormat, this._eType, pPixel);
        }
        pDevice.bindTexture(a.TTYPE.TEXTURE_2D, null);
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
    if (pDevice.isTexture(this._pTexture)) {
        pDevice.deleteTexture(this._pTexture);
    }
    if (pDevice.isFramebuffer(this._pFrameBuffer)) {
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

    this.releaseTexture();
    this._pTexture = pDevice.createTexture();
    this._pFrameBuffer = pDevice.createFramebuffer();

    this._iWidth = pHeightMap.getWidth();
    this._iHeight = pHeightMap.getHeight();
    pDevice.bindTexture(a.TTYPE.TEXTURE_2D, this._pTexture);
    pDevice.texImage2D(a.TTYPE.TEXTURE_2D, 0, a.IFORMATSHORT.RGBA, this._iWidth,
        this._iHeight, 0, a.IFORMATSHORT.RGBA,
        a.ITYPE.UNSIGNED_BYTE, null);
    pDevice.bindTexture(a.TTYPE.TEXTURE_2D, null);

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

    delete pNormalTable;

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

    var pImage = new a.Img(this._pEngine);
    var me = this;

    pImage.load(sFileName,
        function () {
            me.uploadImage(pImage);
        }
    );

    return true;
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


Texture.prototype.uploadImage = function (pImage) {
    var pDevice = this._pEngine.pDevice;
    var nMipMaps;
    var iCubeFlags;

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
        FLAG(a.Img.POSITIVEY) | FLAG(a.Img.NEGATIVEY) | FLAG(a.Img.POSITIVEZ) | FLAG(a.Img.NEGATIVEZ))) {
        CLEAR_BIT(this._iFlags, a.Texture.CubeMap);

        this.bind();
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

        this.bind();
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
        this.applyParameter(a.TPARAM.MIN_FILTER,
            Math.floor(this.minFilter - a.TFILTER.NEAREST_MIPMAP_NEAREST) / 2 + a.TFILTER.NEAREST);
        //pDevice.generateMipmap(a.TTYPE.TEXTURE_2D);
    }

    this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.REPEAT);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.REPEAT);
    this.unbind();

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

    if (!statics._pRepackProgram) {
        statics._pRepackProgram = this._pEngine.displayManager().shaderProgramPool().createResource('A_repackTexture');
        statics._pRepackProgram.create(
            "                                   \n\
            attribute float SERIALNUMBER;       \n\
            uniform vec2 sourceTextureSize;     \n\
            uniform vec2 destinationTextureSize;\n\
            uniform sampler2D sourceTexture;    \n\
                                                \n\
            varying vec4 vData;                 \n\
                                                \n\
            void main(void){                    \n\
                vData = texture2D(sourceTexture,\
                vec2((mod(SERIALNUMBER,sourceTextureSize.x) + .5)/sourceTextureSize.x,\
                (floor(SERIALNUMBER/sourceTextureSize.x) + .5)/sourceTextureSize.y));\n\
                                                \n\
                gl_Position = vec4(2.*\
                (mod(SERIALNUMBER,destinationTextureSize.x) + .5)/destinationTextureSize.x - 1.,\n\
                2. * (floor(SERIALNUMBER/destinationTextureSize.x) + .5)/destinationTextureSize.y \
                - 1.,0.,1.);\n\
            }                                   \n\
            ",
            "                                   \n\
            #ifdef GL_ES                        \n\
                precision highp float;          \n\
            #endif                              \n\
                                                \n\
            varying vec4 vData;                 \n\
                                                \n\
            void main(void){                    \n\
                gl_FragColor = vData;           \n\
            }                                   \n\
    ", true);
    }

    var pProgram = statics._pRepackProgram;
    pProgram.activate();

    var pDestinationTexture = pDevice.createTexture();
    pDevice.activeTexture(pDevice.TEXTURE1);
   // pDevice.pixelStorei(a.WEBGLS.UNPACK_FLIP_Y_WEBGL, true);
    pDevice.bindTexture(pDevice.TEXTURE_2D, pDestinationTexture);
    pDevice.texImage2D(pDevice.TEXTURE_2D, 0, eFormat, iWidth, iHeight, 0, eFormat, eType, null);
    pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MAG_FILTER, pDevice.NEAREST);
    pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MIN_FILTER, pDevice.NEAREST);
    pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_S, pDevice.CLAMP_TO_EDGE);
    pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_WRAP_T, pDevice.CLAMP_TO_EDGE);


    var pDestinationFrameBuffer = pDevice.createFramebuffer();
    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pDestinationFrameBuffer);
    pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
        pDevice.TEXTURE_2D, pDestinationTexture, 0);

    var pRenderIndexData = new Float32Array(this._iWidth * this._iHeight);

    for (var i = 0; i < pRenderIndexData.length; i++) {
        pRenderIndexData[i] = i;
    }

    var pRenderIndexBuffer = pDevice.createBuffer();
    pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pRenderIndexBuffer);
    pDevice.bufferData(pDevice.ARRAY_BUFFER, pRenderIndexData, pDevice.STREAM_DRAW);

    pDevice.activeTexture(pDevice.TEXTURE0);
    pDevice.bindTexture(pDevice.TEXTURE_2D, this._pTexture);


    pProgram.applyVector2("sourceTextureSize", this._iWidth, this._iHeight);
    pProgram.applyVector2("destinationTextureSize", iWidth, iHeight);
    pProgram.applyInt("sourceTexture", 0);

    pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pRenderIndexBuffer);
    pDevice.vertexAttribPointer(pProgram._pAttributesByName['SERIALNUMBER'].iLocation, 1, pDevice.FLOAT, false, 0, 0);
    // pDevice.disableVertexAttribArray(1);
    // pDevice.disableVertexAttribArray(2);

    pDevice.viewport(0, 0, iWidth, iHeight);
    pDevice.drawArrays(0, 0, pRenderIndexData.length);
    pDevice.flush();

    pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
    pDevice.deleteBuffer(pRenderIndexBuffer);
    pDevice.deleteTexture(this._pTexture);
    pDevice.deleteFramebuffer(pDestinationFrameBuffer);

    pProgram.deactivate();

    this._pTexture = pDestinationTexture;
    this._eFormat = eFormat;
    this._eType = eType;
    this._iWidth = iWidth;
    this._iHeight = iHeight;

    return false;
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
    var nMipMaps = 1;

    this._iWidth = iWidth;
    this._iHeight = iHeight;

    if (eFlags == undefined) {
        eFlags = 0;
    }

    this.releaseTexture();
    this._pTexture = pDevice.createTexture();
    this._pFrameBuffer = pDevice.createFramebuffer();
    this._iFlags = eFlags;
    this._eFormat = eFormat || this._eFormat;
    this._eType = eType || this._eType;

    if (!(pData instanceof Array)) {
        pData = [pData];
    }

    this.bind();
    pDevice.pixelStorei(pDevice.UNPACK_ALIGNMENT, 1);
    //this.flipY()

    if (TEST_BIT(eFlags, a.Texture.MipMaps)) {
        nMipMaps = Math.ceil(Math.max(Math.log(this._iWidth) / Math.LN2, Math.log(this._iHeight) / Math.LN2)) + 1;
    }

    if (TEST_BIT(eFlags, a.Texture.CubeMap)) {
        for (var k = 0; k < 6; k++) {
            for (var i = 0; i < nMipMaps; i++) {
                pDevice.texImage2D(a.TTYPE.TEXTURE_CUBE_MAP_POSITIVE_X + k, i, this._eFormat, this._iWidth,
                    this._iHeight, 0, this._eFormat, this._eType, pData[i] ? pData[i] : null);
            }
        }
    }
    else {
        if (this.isCompressed()) {
            for (var i = 0; i < nMipMaps; i++) {
                pDevice.compressedTexImage2D(a.TTYPE.TEXTURE_2D, i, this._eFormat, this._iWidth,
                    this._iHeight, 0, pData[i] ? pData[i] : null);
            }
        }
        else {
            for (var i = 0; i < nMipMaps; i++) {
                //trace('Texture:: creating texture miplevel:', i);
                pDevice.texImage2D(a.TTYPE.TEXTURE_2D, i, this._eFormat, this._iWidth,
                    this._iHeight, 0, this._eFormat, this._eType, pData[i] ? pData[i] : null);
            }
        }
    }

    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.REPEAT);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.REPEAT);
    this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.LINEAR);
    this.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.LINEAR);
    this.unbind();

    this.notifyLoaded();
    this.notifyRestored();

    return true;
};


Texture.prototype.bind = function () {
    this._pEngine.pDevice.bindTexture(this.target, this._pTexture);
};

Texture.prototype.unbind = function () {
    this._pEngine.pDevice.bindTexture(this.target, null);
};

Texture.prototype.activate = function (iSlot) {
    var pManager = this._pEngine.pShaderManager;
    //if (pManager.activeTextures[iSlot] !== this) {
        this._pEngine.pDevice.activeTexture(a.TEXTUREUNIT.TEXTURE + (iSlot || 0));
        this.bind();
        //pManager.activeTextures[iSlot] = this;
    //}
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
