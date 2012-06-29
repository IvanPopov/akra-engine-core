/**
 * @file
 * @brief VideoBuffer class.
 * @author Ivan Popov
 * @email vantuziast@odserve.org
 * VideoBuffer class.
 **/

/**
 * @enum Video Buffer constants.
 */
Enum([
    VIDEOBUFFER_HEADER_TEX_WIDTH, //!< VideoBuffer header: texture width
    VIDEOBUFFER_HEADER_TEX_HEIGHT, //!< VideoBuffer header: texture hight
    VIDEOBUFFER_HEADER_STEP_X, //!< VideoBuffer header: 1 / width
    VIDEOBUFFER_HEADER_STEP_Y, //!< VideoBuffer header: 1 / height
    VIDEOBUFFER_HEADER_NUM_PIXELS, //!< VideoBuffer header: number of pixels in texture
    VIDEOBUFFER_HEADER_NUM_ELEMENTS, //!< VideoBuffer header: number of elements in texture
    VIDEOBUFFER_HEADER_SIZE = 8      //!< VideoBuffer header: header size
], VIDEOBUFFER_HEADER);

/**
 * @typedef
 * VideoBuffer data type.
 */
Define(a.VideoBufferType, Float32Array);
Define(VIDEOBUFFER_MIN_SIZE, 32);

function alignBytes (iByteSize, iTypeSize) {
    var m = iByteSize % iTypeSize;
    return m ? iByteSize + (iTypeSize - iByteSize % iTypeSize) : iByteSize;
}

/**
 * @typedef
 * VideoBuffer data type.
 */
Define(a.VideoBufferType, Float32Array);

/**
 * Video buffer class.
 * @param pEngine Engine instance.
 * @ctor
 */
function VideoBuffer (pEngine) {
    A_CLASS;

    /**
     * Effect for rewriting texture.
     * @type EffectResource
     * @private
     */
    this._pUpdateEffect = null;

    /**
     * Effect for repacking texture.
     * @type EffectResource
     * @private
     */
    this._pRepackEffect = null;


//    debug_assert(a.info.graphics.getExtention(pEngine.pDevice, a.EXTENTIONS.TEXTURE_FLOAT),
//        'для работы видеобуфера необходимо расширение a.EXTENTIONS.TEXTURE_FLOAT');
}

EXTENDS(VideoBuffer, a.VBufferBase, a.Texture);


/**
 * @getter Pointer to harware buffer.
 */
PROPERTY(VideoBuffer, 'buffer', function () {
    return this._pTexture;
});
/**
 * @getter Size of buffer in bytes.
 */
PROPERTY(VideoBuffer, 'size', function () {
    return this._iWidth * this._iHeight * 
        this._numElementsPerPixel * this.typeSize 
        - VIDEOBUFFER_HEADER_SIZE * this.typeSize;
});

/**
 * @getter Number of elements in pixel.
 * @private
 */
PROPERTY(VideoBuffer, '_numElementsPerPixel', function () {
    return LOOKUPGETTER(parent(Texture), numElementsPerPixel);
});


//DISMETHOD(VideoBuffer, releaseTexture);
//DISMETHOD(VideoBuffer, isCubeTexture);
//DISMETHOD(VideoBuffer, is2DTexture);
DISMETHOD(VideoBuffer, getMipLevels);
DISMETHOD(VideoBuffer, getPixelRGBA);
DISMETHOD(VideoBuffer, setPixelRGBA);
DISMETHOD(VideoBuffer, generateNormalMap);
DISMETHOD(VideoBuffer, generateNormalizationCubeMap);
DISMETHOD(VideoBuffer, maskWithImage);
DISMETHOD(VideoBuffer, convertToNormalMap);
DISMETHOD(VideoBuffer, getSurfaceLevel);
DISMETHOD(VideoBuffer, uploadCubeFace);
DISMETHOD(VideoBuffer, uploadImage);
DISMETHOD(VideoBuffer, resize);
DISMETHOD(VideoBuffer, extend);
DISMETHOD(VideoBuffer, repack);
DISMETHOD(VideoBuffer, createTexture);
DISMETHOD(VideoBuffer, createCubeTexture);
DISMETHOD(VideoBuffer, convertToNormalMap);


DISPROPERTY(VideoBuffer, texture);
DISPROPERTY(VideoBuffer, height);
DISPROPERTY(VideoBuffer, width);
DISPROPERTY(VideoBuffer, numElementsPerPixel);
DISPROPERTY(VideoBuffer, type);
DISPROPERTY(VideoBuffer, format);
DISPROPERTY(VideoBuffer, magFilter);
DISPROPERTY(VideoBuffer, minFilter);


/**
 * @property create(uint iByteSize, uint iFlags, ArrayBuffer pData)
 * @note Minimal buffer size declated as <code>VIDEOBUFFER_MIN_SIZE</code>
 * @param iByteSize Buffer size.
 * @param iFlags Buffer flags. See BUFFER_FLAG_BITS.
 * @param pData Default buffer data.
 * @treturn Boolean
 */
VideoBuffer.prototype.create = function (iByteSize, iFlags, pData) {
    iByteSize = iByteSize || 0;
    iFlags = iFlags || 0;

    var pSize, pTextureData, pHeader;

    debug_assert(this._pBuffer == null, "buffer already allocated");
    debug_assert(this._pBackupCopy == null, "backup buffer already allocated");

    SET_BIT(iFlags, a.VBufferBase.AlignmentBit);

    iByteSize = Math.max(iByteSize, VIDEOBUFFER_MIN_SIZE);

    //no software rendering..
    debug_assert(!TEST_BIT(iFlags, a.VBufferBase.SoftwareBit), "no sftware rendering");

    //local copy == read functionality
    if (TEST_BIT(iFlags, a.VBufferBase.RamBackupBit)) {
        SET_BIT(iFlags, a.VBufferBase.ReadableBit);
    }

    if (TEST_BIT(iFlags, a.VBufferBase.ReadableBit)) {
        SET_BIT(iFlags, a.VBufferBase.RamBackupBit);
    }

    if (pData) {
        debug_assert(pData.byteLength <= iByteSize,
            "The size of the array passed more than passed the size of the buffer.");
    }

    // If you need a local copy, you have to allocate it
    if (TEST_BIT(iFlags, a.VBufferBase.RamBackupBit)) {
        this._pBackupCopy = new Uint8Array(iByteSize);
        if (pData) {
            this._pBackupCopy.set(new Uint8Array(pData.buffer), 0);
        }
    }
    trace('POT texture size:',
        (alignBytes(iByteSize, this.typeSize) + VIDEOBUFFER_HEADER_SIZE) / a.VideoBufferType.BYTES_PER_ELEMENT);
    // creating texture
    pSize = a.calcPOTtextureSize((alignBytes(iByteSize, this.typeSize) + VIDEOBUFFER_HEADER_SIZE) /
        a.VideoBufferType.BYTES_PER_ELEMENT, this._numElementsPerPixel);
    pHeader = this._header(pSize.X, pSize.Y);
    pTextureData = new a.VideoBufferType(pSize.Z);
    pTextureData.set(pHeader, 0);

    //---------------- TEMP SET DATA BEGIN -------------
    //FIXME: correct set data..
    if (pData) {
        (new Uint8Array(pTextureData.buffer)).set(new Uint8Array(pData.buffer),
            (new Uint8Array(pHeader.buffer)).length);
    }
    //---------------- TEMP SET DATA END ---------------


    trace('creating texture: ', pSize.X, 'x', pSize.Y);

    if (!parent(Texture).createTexture.call(this, pSize.X, pSize.Y, 0, a.IFORMAT.RGBA, a.ITYPE.FLOAT, pTextureData)) {
        debug_error('Cannot create video buffer.');
        this.destroy();
        return false;
    }

    this.bind();
    this._pEngine.pDevice.generateMipmap(this.target);
    this.unbind();

    this.wraps = a.TWRAPMODE.CLAMP_TO_EDGE;
    this.wrapt = a.TWRAPMODE.CLAMP_TO_EDGE;

    this.minFilter = a.TFILTER.NEAREST;
    this.magFilter = a.TFILTER.NEAREST;

    //setup..
    this._pBuffer = this._pTexture;
    this._iByteSize = iByteSize;
    this._iTypeFlags = iFlags;

    //updating texture data
//    if (pData) {
//        this.setData(pData);
//    }

    return true;
};

/**
 * @property resize(uint iByteSize)
 * @param iByteSize
 * @treturn Boolean
 */
VideoBuffer.prototype.resize = function (iByteSize) {
    var pSize, pBackupCopy;

    //trace('resize request for', iByteSize, 'bytes');

    iByteSize = alignBytes(iByteSize, this.typeSize);
    pSize = a.calcPOTtextureSize((iByteSize + VIDEOBUFFER_HEADER_SIZE) /
        a.VideoBufferType.BYTES_PER_ELEMENT, this._numElementsPerPixel);

    if (TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit)) {
        pBackupCopy = new Uint8Array(pSize.X * pSize.Y * this._numElementsPerPixel * this.typeSize);
        pBackupCopy.set(this._pBackupCopy);
        this._pBackupCopy = pBackupCopy;
        //trace('backup copy size', pBackupCopy.byteLength, 'bytes');
    }

    if (pSize.X <= this._iWidth && pSize.Y <= this._iHeight) {
        return true;
    }

    //trace('resize buffer from', this._iWidth, 'x', this._iHeight, ' to', pSize.X, 'x', pSize.Y);

    parent(Texture).repack.call(this, pSize.X, pSize.Y);
    parent(Texture).setPixelRGBA.call(this, 0, 0, 2, 1, this._header(), 0);

    return true;
};

/**
 * Repack buffer.
 * @private
 */
VideoBuffer.prototype.repack = function (iWidth, iHeight) {

};

/**
 * VideoBuffer header.
 * @return a.VideoBufferType
 * @private
 */
VideoBuffer.prototype._header = function (iWidth, iHeight) {
    iWidth = iWidth || this._iWidth;
    iHeight = iHeight || this._iHeight;

    var pHeader = new a.VideoBufferType(VIDEOBUFFER_HEADER_SIZE);

    pHeader[VIDEOBUFFER_HEADER_TEX_WIDTH] = iWidth;
    pHeader[VIDEOBUFFER_HEADER_TEX_HEIGHT] = iHeight;
    pHeader[VIDEOBUFFER_HEADER_STEP_X] = 1. / iWidth;
    pHeader[VIDEOBUFFER_HEADER_STEP_Y] = 1. / iHeight;
    pHeader[VIDEOBUFFER_HEADER_NUM_PIXELS] = iWidth * iHeight;
    pHeader[VIDEOBUFFER_HEADER_NUM_ELEMENTS] = pHeader[VIDEOBUFFER_HEADER_NUM_PIXELS] * this._numElementsPerPixel;

    return pHeader;
};

/**
 * Write data to buffer.
 * @tparam ArrayBufferView pData Data.
 * @tparam Int iOffset Offset from beginning of the buffer.
 * @tparam Int iSize Element's count.
 * @treturn Boolean
 * @protected
 */
VideoBuffer.prototype.setData = function (pData, iOffset, iSize) {
    'use strict';

    var iTypeSize       = this.typeSize,                //размер элемента(обычно это float - 4 байта)
        nElementsPerPix = this.numElementsPerPixel,     //число float'ов в пикселе
        iFrom,                                          //номер float'a с которого начинается обновление
        iCount,                                         //исло float'ов для обновления
        pBufferData;                                    //данные для обновления

    var iLeftShift,                                     //смещение внутри первого пикселя
        iRightShift,                                    //смещение внутри последнего пикселя
        iBeginPix,                                      //пиксель с которого начинается обновление
        iEndPix,                                        //пиксель на котором заканчивается обновление
        nPixels,                                        //число пикселей
        nElements;

    iOffset = iOffset || 0;
    iSize = iSize || pData.byteLength;

    if (this.size < iOffset + iSize) {
        this.resize(iOffset + iSize);
    }
   
    if (this.isRAMBufferPresent()) {
        //trace('update backup copy from', iOffset, '/', this._pBackupCopy.byteLength, 'for', iSize, 'bytes');
        this._pBackupCopy.set(new Uint8Array(pData.slice(0, iSize)), iOffset);
    }

    debug_assert(iOffset % iTypeSize === 0 && iSize % iTypeSize === 0, "Incorrect data size or offset");

    iFrom       = iOffset / iTypeSize + VIDEOBUFFER_HEADER_SIZE;
    iCount      = iSize / iTypeSize;

    iLeftShift  = iFrom % nElementsPerPix;
    iRightShift = ((iFrom + iCount) % nElementsPerPix);
    iBeginPix   = Math.floor(iFrom / nElementsPerPix);
    iEndPix     = Math.floor((iFrom + iCount) / nElementsPerPix);
    nPixels     = iEndPix - iBeginPix;
    nElements   = nPixels * nElementsPerPix;

    pBufferData = new a.VideoBufferType(pData.slice(0, iSize));

    if (iLeftShift === 0 && iRightShift === 0) {

        var iWidth  = this.width;
        var iYmin   = Math.floor(iBeginPix / iWidth);
        var iYmax   = Math.ceil(iEndPix / iWidth);
        var iXbegin = iBeginPix % iWidth;
        var iXend   = iEndPix % iWidth;
        var iHeight = iYmax - iYmin;
        var iBeginElement = 0, iEndElement = 0;
        var pParent = parent(Texture);
        var me = this;
        //hack: if iEndPixel is first pixel from next row
        iXend = (iXend === 0? iWidth: iXend);

        var fnWriteRect = function (iX, iY, iW, iH) {

            iBeginElement = iEndElement;
            iEndElement = iW * iH * nElementsPerPix + iEndElement;
            pParent.setPixelRGBA.call(me, iX, iY, iW, iH, new Float32Array(pBufferData.subarray(iBeginElement, iEndElement)));
        };

        if (iHeight === 1) {
            fnWriteRect(iXbegin, iYmin, iXend - iXbegin, 1);
        }
        else {
            fnWriteRect(iXbegin, iYmin, iWidth - iXbegin, 1);
            if (iHeight > 2) {
                fnWriteRect(0, iYmin + 1, iWidth, iHeight - 2);
            }
            fnWriteRect(0, iYmax - 1, iXend, 1);
        }
    }
    else if (this.isReadable()) {
        var iBackShift = ((iOffset / iTypeSize) % nElementsPerPix) * iTypeSize;
        var iRealOffset = iOffset - iBackShift;
        var iRealSize = iSize + iBackShift;
        var iFrontShift = (iRealSize / iTypeSize) % nElementsPerPix;

        if (iFrontShift > 0) {
            iRealSize += (nElementsPerPix - iFrontShift) * iTypeSize;
        }

        if(this._pBackupCopy.byteLength < iRealOffset + iRealSize){
            this.resize(iRealOffset + iRealSize);
        }
        return this.setData(this._pBackupCopy.buffer.slice(iRealOffset, iRealOffset + 
            iRealSize), iRealOffset, iRealSize);
    }
    else {
        trace('update via rendering...');

        var pMarkupData = new Float32Array(nPixels * 2);
        var pRealData = new Float32Array(nElements);

        for (var i = 0, n = 0, f, t, u = 0; i < nPixels; ++i) {
            n = 2 * i;
            if (i === 0) {
                //set shift for fisrt pixel
                pMarkupData[n + 1] = iLeftShift;
            }
            else if (i === nPixels - 1 && iLeftShift) {
                //negative shift for ending pixel
                pMarkupData[n + 1] = -iRightShift;
            }
            else {
                pMarkupData[n + 1] = 0;
            }

            if (pMarkupData[n + 1] >= 0) {
                f = i * nElementsPerPix;
                if (n == 0) {
                    f += iLeftShift;
                }
                t = Math.min((i + 1) * nElementsPerPix - f, pBufferData.length);
            }
            else {
                f = i * nElementsPerPix;
                t = Math.min(Math.abs(pMarkupData[n + 1]), pBufferData.length - u);
            }

            for (var e = 0; e < t; ++e) {
                pRealData[f + e] = pBufferData[u++];
            }

            pMarkupData[n] = iBeginPix + i;
        }


        trace('writing', iCount, 'elements from', iFrom, 'with data', pBufferData);
        trace('markup  data:', pMarkupData, pMarkupData.length, 'first element:', pMarkupData.subarray(0, 2), 'end element:', pMarkupData.subarray(pMarkupData.length - 2, pMarkupData.length));
        trace('buffer data:', pRealData, pRealData.length);


        /*
         var pUpdateEffect = this._pUpdateEffect;
         //var iMarkupBuffer = pUpdateEffect.createBuffer(a.BTYPE.ARRAY_BUFFER, a.BUSAGE.STREAM_DRAW, 0, pMarkupData);
         //var iDataBuffer = pUpdateEffect.createBuffer(a.BTYPE.ARRAY_BUFFER, a.BUSAGE.STREAM_DRAW, 0, pBufferData);

         pUpdateEffect.begin();
         pUpdateEffect.activatePass(0);

         //pUpdateEffect.setParameter('sourceTexture', this);
         //pUpdateEffect.setParameter('size', Vec2.create(this._iWidth, this._iHeight));
         //pUpdateEffect.applyBuffer(iMarkupBuffer, statics.pMarkupDeclaration);
         //pUpdateEffect.applyBuffer(iDataBuffer, statics.pDataDeclaration);
         //pUpdateEffect.applyDrawRange(0, iCount);
         //pUpdateEffect.setup(SM_RENDER_TO_TEXTUE | SM_CLONE_TEXTURE, this);

         //pUpdateEffect.render(); //TODO RENDER!!!

         pUpdateEffect.deactivatePass();
         pUpdateEffect.end();

         //pUpdateEffect.deleteBuffer(iMarkupBuffer);
         //pUpdateEffect.deleteBuffer(iDataBuffer);
         */

        var pDevice = this._pEngine.pDevice;

        if (!this._pUpdateProgram) {
            this._pUpdateProgram = this._pEngine.displayManager().shaderProgramPool().createResource('A_updateVideoBuffer');
            this._pUpdateProgram.create(
                " \
                uniform sampler2D sourceTexture;                                                \n\
                attribute vec4  VALUE;                                                          \n\
                attribute float INDEX;                                                          \n\
                attribute float SHIFT;                                                          \n\
                                                                                                \n\
                uniform vec2 size;                                                              \n\
                                                                                                \n\
                varying vec4 color;                                                            \n\
                                                                                                \n\
                void main(void){                                                                \n\
                    vec4 value = VALUE;                                                         \n\
                    float  serial = float(INDEX);                                               \n\
                                                                                                \n\
                    int shift = int(SHIFT);                                                     \n\
                    if (shift != 0) { \
                        color = texture2D(sourceTexture, vec2(mod(serial, size.x) /            \n\
                            size.x + .5 / size.x, floor(serial / size.x) / size.y + .5 / size.y));                              \n\
                        if (shift == 1) {               \n\
                            color = vec4(color.r, value.gba);      \n\
                        }                               \n\
                        else if (shift == 2) {          \n\
                            color = vec4(color.rg, value.ba);        \n\
                        }                               \n\
                        else if (shift == 3) {          \n\
                            color = vec4(color.rgb, value.a);          \n\
                        }                               \n\
                        else if (shift == -1) {         \n\
                            color = vec4(value.r, color.gba);      \n\
                        }                               \n\
                        else if (shift == -2) {         \n\
                            color = vec4(value.rg, color.ba);        \n\
                        }                               \n\
                        else {                          \n\
                            color = vec4(value.rgb, color.a);          \n\
                        }                                                                       \n\
                    }\
                    else                                                                                               \n\
                        color = value;                                                              \n\
                    gl_Position = vec4(2. * mod(serial, size.x) / size.x - 1. + .5 / size.x,                  \n\
                                    2. * floor(serial / size.x) / size.y - 1. + .5 / size.y, 0., 1.);        \n\
                }                                                                               \n\
                ",
                "                                   \n\
                #ifdef GL_ES                        \n\
                    precision highp float;          \n\
                #endif                              \n\
                                                    \n\
                varying vec4 color;                 \n\
                                                    \n\
                void main(void){                    \n\
                    gl_FragColor = color;           \n\
                }                                   \n\
            ", true);
        }

        var pProgram = this._pUpdateProgram;
        pProgram.activate();

        //var pDestinationTexture = pDevice.createTexture();
        //pDevice.activeTexture(pDevice.TEXTURE1);
        //pDevice.bindTexture(pDevice.TEXTURE_2D, pDestinationTexture);
        //pDevice.texImage2D(pDevice.TEXTURE_2D, 0, eFormat, iWidth, iHeight, 0, eFormat, eType, null);
        //pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MAG_FILTER, pDevice.NEAREST);
        //pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MIN_FILTER, pDevice.NEAREST);

        var pFramebuffer = pDevice.createFramebuffer();
        pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, pFramebuffer);
        pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
            pDevice.TEXTURE_2D, this._pTexture, 0);

        var pValueBuffer = pDevice.createBuffer();
        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pValueBuffer);
        pDevice.bufferData(pDevice.ARRAY_BUFFER, pRealData, pDevice.STREAM_DRAW);

        var pMarkupBuffer = pDevice.createBuffer();
        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pMarkupBuffer);
        pDevice.bufferData(pDevice.ARRAY_BUFFER, pMarkupData, pDevice.STREAM_DRAW);

        this.activate(0);
        //pDevice.pixelStorei(a.WEBGLS.UNPACK_FLIP_Y_WEBGL, false);

        pProgram.applyVector2('size', this._iWidth, this._iHeight);
        pProgram.applyInt('sourceTexture', 0);

        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pValueBuffer);
        pDevice.vertexAttribPointer(pProgram._pAttributesByName['VALUE'].iLocation, 4, pDevice.FLOAT, false, 0, 0);

        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pMarkupBuffer);
        pDevice.vertexAttribPointer(pProgram._pAttributesByName['INDEX'].iLocation, 1, pDevice.FLOAT, false, 8, 0);
        pDevice.vertexAttribPointer(pProgram._pAttributesByName['SHIFT'].iLocation, 1, pDevice.FLOAT, false, 8, 4);

        pDevice.viewport(0, 0, this._iWidth, this._iHeight);

        pDevice.drawArrays(0, 0, nPixels);
        pDevice.flush();

        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, null);
        pDevice.deleteBuffer(pValueBuffer);
        pDevice.deleteBuffer(pMarkupBuffer);

        pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
        pDevice.deleteFramebuffer(pFramebuffer);

        //pDevice.bindTexture(pDevice.TEXTURE_2D, this._pTexture);
        //pDevice.pixelStorei(a.WEBGLS.UNPACK_FLIP_Y_WEBGL, true);
        //pDevice.bindTexture(pDevice.TEXTURE_2D, null);

        //pProgram.detach();
        pProgram.deactivate();

    }

    return true;
};

/**
 * @property getData(uint iOffset, uint iSize)
 * @param iOffset
 * @param iSize
 * @protected
 */
VideoBuffer.prototype.getData = function (iOffset, iSize) {
    debug_assert(this._pBuffer, "Buffer not created.");
    debug_assert(TEST_BIT(this._iTypeFlags, a.VBufferBase.RamBackupBit) == true,
        "You can not give data unless they are stored locally.");

    if (arguments.length === 0) {
        return this._pBackupCopy.buffer;
    }

    return this._pBackupCopy.buffer.slice(iOffset, iOffset + iSize);
};

/**
 * Destroy buffer.
 * @treturn void
 */
VideoBuffer.prototype.destroy = function () {
    parent(Texture).destroyResource.call(this);
    this.freeVertexData();

    this._pBuffer = null;
    this._pBackupCopy = null;
    this._pUpdateEffect = null;
    this._iByteSize = undefined;
    this._iTypeFlags = undefined;
};

/**
 * Destroy resource.
 * @treturn Boolean
 */
VideoBuffer.prototype.destroyResource = function () {
    this.destroy();
    return true;
};

/**
 * Disable resource.
 * @treturn Boolean
 */
VideoBuffer.prototype.disableResource = function () {
    parent(Texture).disableResource.call(this);
    this.notifyDisabled();
    //TODO

    return true;
};

/**
 * Restore  resource.
 * @treturn Boolean
 */
VideoBuffer.prototype.restoreResource = function () {
    parent(Texture).restoreResource.call(this);
    this.notifyRestored();
    return true;
};

/**
 * Load  resource.
 * @treturn Boolean
 */
VideoBuffer.prototype.loadResource = function () {
    return false;
};

/**
 * Save resource.
 * @treturn Boolean
 */
VideoBuffer.prototype.saveResource = function () {
    return false;
};

/**
 * Create resource.
 * @treturn Boolean
 */
VideoBuffer.prototype.createResource = function () {
    this._pUpdateEffect = this._pEngine.pShaderManager.findEffect('akra:updateTexture');
    this._pRepackEffect = this._pEngine.pShaderManager.findEffect('akra:repackTextureWithHeader');
    //setup type before creation, else we can obtain invalid typeSize :(
    this._eType = a.ITYPE.FLOAT;

    this.notifyCreated();
    this.notifyLoaded();

    return true;
};

/**
 * @typedef
 */
Define(a.VideoBufferManager(pEngine), function () {
    a.ResourcePool(pEngine, a.VideoBuffer)
});


a.VideoBuffer = VideoBuffer;
