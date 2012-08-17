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

Define(a.DECLUSAGE.TEXTURE_HEADER, 'TEXTURE_HEADER');

/**
 * @typedef
 * VideoBuffer data type.
 */
Define(a.VideoBufferType, Float32Array);
Define(VIDEOBUFFER_MIN_SIZE, 4096);

function alignBytes(iByteSize, iTypeSize) {
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
function VideoBuffer(pEngine) {
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

    /**
     * Texture Header.
     * @type {VertexData}
     */
    this._pHeader = null;
    this._pSystemVertexData = null;
    this._initSystemStorage(pEngine);
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
           this._numElementsPerPixel * this.typeSize;
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

VideoBuffer.prototype._initSystemStorage = function (pEngine) {
    this._pEngine = pEngine;
    var pBuffer, pData, pMethod, pEffect;
    if (pEngine._pSystemVertexData) {
        this._pSystemVertexData = pEngine._pSystemVertexData;
        this.renderMethod = pEngine.pDisplayManager.renderMethodPool().findResource(".update_video_buffer");
        return true;
    }

    pBuffer = pEngine.pDisplayManager.vertexBufferPool().createResource(".VERTEXBUFFER");
    debug_assert(pBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit)),
                 "Cannot create system vertex buffer");
    pData = pBuffer.getEmptyVertexData(0, [VE_FLOAT('INDEX'), VE_FLOAT('SHIFT'), VE_FLOAT4('VALUE')]);
    pEngine._pSystemVertexData = this._pSystemVertexData = pData;
    pMethod = pEngine.pDisplayManager.renderMethodPool().createResource(".update_video_buffer");
    pEffect = pEngine.pDisplayManager.effectPool().createResource(".update_video_buffer");
    console.log(pEffect);
    pEffect.create();
    pEffect.use("akra.system.update_video_buffer");
    pMethod.effect = pEffect;
    this.renderMethod = pMethod;
    return true;
};
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
    // trace('POT texture size:',
    //     (alignBytes(iByteSize, this.typeSize)) / a.VideoBufferType.BYTES_PER_ELEMENT);
    // creating texture
    pSize = a.calcPOTtextureSize((alignBytes(iByteSize, this.typeSize)) /
                                 a.VideoBufferType.BYTES_PER_ELEMENT, this._numElementsPerPixel);
    //pHeader = this._header(pSize.X, pSize.Y);
    pTextureData = new a.VideoBufferType(pSize.Z);
    //pTextureData.set(pHeader, 0);

    //---------------- TEMP SET DATA BEGIN -------------
    //FIXME: correct set data..
    if (pData) {
        (new Uint8Array(pTextureData.buffer)).set(new Uint8Array(pData.buffer));
    }
    //---------------- TEMP SET DATA END ---------------


    //trace('creating texture: ', pSize.X, 'x', pSize.Y);

    if (!parent(Texture).createTexture.call(this, pSize.X, pSize.Y, 0, a.IFORMAT.RGBA, a.ITYPE.FLOAT, pTextureData)) {
        debug_error('Cannot create video buffer.');
        this.destroy();
        return false;
    }

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

    this._pHeader = this.allocateData([VE_VEC2(a.DECLUSAGE.TEXTURE_HEADER)],
                                      this._header(pSize.X, pSize.Y));

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
    pSize = a.calcPOTtextureSize((iByteSize) /
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

    //trace('resize vb :: from', this._iWidth, 'x', this._iHeight, ' to', pSize.X, 'x', pSize.Y);
    parent(Texture).repack.call(this, pSize.X, pSize.Y);


    //parent(Texture).setPixelRGBA.call(this, 0, 0, 2, 1, this._header(), 0);
    this._pHeader.setData(this._header());

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
VideoBuffer.prototype.setData = function (pData, iOffset, iSize, bUpdateRamCopy) {
    'use strict';

    var iTypeSize = this.typeSize, //размер элемента(обычно это float - 4 байта)
        nElementsPerPix = this.numElementsPerPixel, //число float'ов в пикселе
        iFrom, //номер float'a с которого начинается обновление
        iCount, //исло float'ов для обновления
        pBufferData;                                    //данные для обновления

    var iLeftShift, //смещение внутри первого пикселя
        iRightShift, //смещение внутри последнего пикселя
        iBeginPix, //пиксель с которого начинается обновление
        iEndPix, //пиксель на котором заканчивается обновление
        nPixels, //число пикселей
        nElements;

    bUpdateRamCopy = ifndef(bUpdateRamCopy, true);
    iOffset = iOffset || 0;
    iSize = iSize || pData.byteLength;

    if (this.size < iOffset + iSize) {
        this.resize(iOffset + iSize);
    }

    if (this.isRAMBufferPresent() && bUpdateRamCopy) {
        //trace('update backup copy from', iOffset, '/', this._pBackupCopy.byteLength, 'for', iSize, 'bytes');
        this._pBackupCopy.set(new Uint8Array(pData.slice(0, iSize)), iOffset);
    }

    debug_assert(iOffset % iTypeSize === 0 && iSize % iTypeSize === 0, "Incorrect data size or offset");

    iFrom = iOffset / iTypeSize;
    iCount = iSize / iTypeSize;

    iLeftShift = iFrom % nElementsPerPix;
    iRightShift = ((iFrom + iCount) % nElementsPerPix);
    iBeginPix = Math.floor(iFrom / nElementsPerPix);
    iEndPix = Math.floor((iFrom + iCount) / nElementsPerPix);
    nPixels = Math.ceil((iFrom + iCount) / nElementsPerPix) - Math.floor(iFrom / nElementsPerPix);
    nElements = nPixels * nElementsPerPix;

    pBufferData = new a.VideoBufferType(pData.slice(0, iSize));

    if (iLeftShift === 0 && iRightShift === 0) {
        var iWidth = this.width;
        var iYmin = Math.floor(iBeginPix / iWidth);
        var iYmax = Math.ceil(iEndPix / iWidth);
        var iXbegin = iBeginPix % iWidth;
        var iXend = iEndPix % iWidth;
        var iHeight = iYmax - iYmin;
        var iBeginElement = 0, iEndElement = 0;
        var pParent = parent(Texture);
        var me = this;
        //hack: if iEndPixel is first pixel from next row
        iXend = (iXend === 0 ? iWidth : iXend);

        var fnWriteRect = function (iX, iY, iW, iH) {
            iBeginElement = iEndElement;
            iEndElement = iW * iH * nElementsPerPix + iEndElement;
            pParent.setPixelRGBA.call(me, iX, iY, iW, iH,
                                      new Float32Array(pBufferData.subarray(iBeginElement, iEndElement)));
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
        var iRealOffset = iBeginPix * nElementsPerPix * iTypeSize;
        var iRealSize = nElements * iTypeSize;
        var iTotalSize = iRealOffset + iRealSize;

        return this.setData(
            this._pBackupCopy.buffer.slice(iRealOffset, iTotalSize),
            iRealOffset, iRealSize, false);
    }
    else {

        var pMarkupDataIndex = new Float32Array(nPixels);
        var pMarkupDataShift = new Float32Array(nPixels);
        var pRealData = new Float32Array(nElements);

        pMarkupDataIndex[0] = iBeginPix;
        pMarkupDataShift[0] = iLeftShift;
        pMarkupDataShift[nPixels - 1] = -iRightShift;
        pMarkupDataIndex[nPixels - 1] = iBeginPix + nPixels - 1;

        for (var i = 1; i < nPixels - 1; ++i) {
            pMarkupDataIndex[i] = iBeginPix + i;
        }

        for (var i = 0; i < iCount; i++) {
            pRealData[iLeftShift + i] = pBufferData[i];
        }

        // trace('>>>>>>>>>>>>>>>>>>> offset:', iOffset, ' >>> left shift: ', iLeftShift, ' >>> right shift: ', iRightShift)
        // trace(' >>> begin pixel: ', iBeginPix, ' >>> end pixel: ', iEndPix);
        // trace('writing', iCount, 'elements from', iFrom, 'with data', pBufferData);
        // trace('markup  data:', pMarkupData, pMarkupData.length, 'first element:', pMarkupData.subarray(0, 2), 'end element:', pMarkupData.subarray(pMarkupData.length - 2, pMarkupData.length));
        // trace('buffer data:', pRealData, pRealData.length);
        //console.warn('rendering to vb.:: ', 'writing', iCount, 'elements from', iFrom, 'with data', pBufferData);

        var pDevice = this._pEngine.pDevice;
        var pShaderSource;
        var pProgram;

//        Ifdef(TEXTURE_REDRAW)
//
//        STATIC(_pCopyProgram, a.loadProgram(this._pEngine, '../effects/copy_texture.glsl'));
//
//        var pCopyProgram = statics._pCopyProgram;
//        pCopyProgram.activate();
//
//        // pDevice.disableVertexAttribArray(1);
//        // pDevice.disableVertexAttribArray(2);
//
//        var pCopyData = new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]);
//
//        var pCopyBuffer = pDevice.createBuffer();
//        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pCopyBuffer);
//        pDevice.bufferData(pDevice.ARRAY_BUFFER, pCopyData, pDevice.STREAM_DRAW);
//        pDevice.vertexAttribPointer(pCopyProgram._pAttributesByName['POSITION'].iLocation, 2, pDevice.FLOAT, false, 0,
//                                    0);
//
//        var pCopyTexture = pDevice.createTexture();
//        pDevice.activeTexture(0x84C0 + 1);
//        pDevice.bindTexture(pDevice.TEXTURE_2D, pCopyTexture);
//        pDevice.texImage2D(pDevice.TEXTURE_2D, 0, this._eFormat, this._iWidth, this._iHeight, 0, this._eFormat,
//                           this._eType, null);
//        pDevice.texParameteri(pDevice.TEXTURE_2D, a.TPARAM.WRAP_S, a.TWRAPMODE.REPEAT);
//        pDevice.texParameteri(pDevice.TEXTURE_2D, a.TPARAM.WRAP_T, a.TWRAPMODE.REPEAT);
//        pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MAG_FILTER, pDevice.NEAREST);
//        pDevice.texParameteri(pDevice.TEXTURE_2D, pDevice.TEXTURE_MIN_FILTER, pDevice.NEAREST);
//
//        pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
//                                     pDevice.TEXTURE_2D, pCopyTexture, 0);
//
//        this.activate(0);
//        pCopyProgram.applyInt('src', 0);
//
//        pDevice.drawArrays(a.PRIMTYPE.TRIANGLESTRIP, 0, 4);
//        Endif();
        //STATIC(_pUpdateProgram, a.loadProgram(this._pEngine, '../effects/update_video_buffer.glsl'));

        window['A_TRACER.trace']('begin readraw in videobuffer');

        var pVertexData = this._pSystemVertexData;
        pVertexData.resize(nElements);

        pVertexData.setData(pRealData, 'VALUE');
        pVertexData.setData(pMarkupDataIndex, 'INDEX');
        pVertexData.setData(pMarkupDataShift, 'SHIFT');

        window['A_TRACER.trace']('after set data');

        var pManager = this._pEngine.shaderManager();
        var pSnapshot = this._pActiveSnapshot;
        var pEntry = null;
        console.log(pSnapshot, pManager);
        pManager.activateFrameBuffer(0);
        pManager.applyFrameBufferTexture(this);
        this.startRender();
        for (var i = 0; i < this.totalPasses(); i++) {
            console.log("Pass #"+i);
            this.activatePass(i);
            pSnapshot.applyTextureBySemantic("TEXTURE0", this);
            pSnapshot.applyVertexData(pVertexData);
            pSnapshot.setParameter("size", [this._iWidth, this._iHeight]);
            pEntry = this.renderPass();
            this.deactivatePass();
        }
        this.finishRender();
//        pManager.deactivateFrameBuffer();
        console.log(pEntry);
        pManager.activate(pEntry);
        pDevice.viewport(0, 0, this._iWidth, this._iHeight);
        console.log("Try draw");

        pDevice.drawArrays(0, pEntry.iOffset, pEntry.iLength);
        pDevice.flush();
        window['A_TRACER.trace']('end readraw in videobuffer');
//        pProgram = statics._pUpdateProgram;
//        pProgram.activate();
//
//        // pDevice.enableVertexAttribArray(0);
//        // pDevice.enableVertexAttribArray(1);
//        // pDevice.enableVertexAttribArray(2);
//
//        pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER, pDevice.COLOR_ATTACHMENT0,
//                                     pDevice.TEXTURE_2D, this._pTexture, 0);
//
//        var pValueBuffer = pDevice.createBuffer();
//        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pValueBuffer);
//        pDevice.bufferData(pDevice.ARRAY_BUFFER, pRealData, pDevice.STREAM_DRAW);
//
//        var pMarkupBuffer = pDevice.createBuffer();
//        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pMarkupBuffer);
//        pDevice.bufferData(pDevice.ARRAY_BUFFER, pMarkupData, pDevice.STREAM_DRAW);
//
//        this.activate(0);
//        //pDevice.activeTexture(0x84C0);
//        //pDevice.bindTexture(pDevice.TEXTURE_2D, this._pTexture);
//
//        pProgram.applyVector2('size', this._iWidth, this._iHeight);
//        Ifdef(TEXTURE_REDRAW)
//        pProgram.applyInt('sourceTexture', 1);
//        Elseif();
//        pProgram.applyInt('sourceTexture', 0);
//        Endif();
//        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pValueBuffer);
//        pDevice.vertexAttribPointer(pProgram._pAttributesByName['VALUE'].iLocation, 4, pDevice.FLOAT, false, 0, 0);
//
//        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, pMarkupBuffer);
//        pDevice.vertexAttribPointer(pProgram._pAttributesByName['INDEX'].iLocation, 1, pDevice.FLOAT, false, 8, 0);
//        pDevice.vertexAttribPointer(pProgram._pAttributesByName['SHIFT'].iLocation, 1, pDevice.FLOAT, false, 8, 4);
//
//        pDevice.viewport(0, 0, this._iWidth, this._iHeight);
//
//        pDevice.drawArrays(0, 0, nPixels);
//
//        pDevice.flush();
//
//        pDevice.bindBuffer(pDevice.ARRAY_BUFFER, null);
//        pDevice.deleteBuffer(pValueBuffer);
//        pDevice.deleteBuffer(pMarkupBuffer);
//
//        pDevice.bindFramebuffer(pDevice.FRAMEBUFFER, null);
//        pDevice.deleteFramebuffer(pFramebuffer);

//        Ifdef(TEXTURE_REDRAW)
//        pDevice.deleteTexture(pCopyTexture);
//        Endif();

        //pProgram.deactivate();
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
