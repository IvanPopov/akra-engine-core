/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../idl/IRenderResource.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../pool/resources/VertexBuffer.ts" />
    /// <reference path="../pixelUtil/pixelUtil.ts" />
    /// <reference path="webgl.ts" />
    /// <reference path="WebGLShaderProgram.ts"  />
    /// <reference path="WebGLRenderer.ts" />
    (function (webgl) {
        var VE = akra.data.VertexElement;

        /** @const */ var VIDEOBUFFER_HEADER_WIDTH = 0;
        /** @const */ var VIDEOBUFFER_HEADER_HEIGHT = 1;
        /** @const */ var VIDEOBUFFER_HEADER_STEP_X = 2;
        /** @const */ var VIDEOBUFFER_HEADER_STEP_Y = 3;
        /** @const */ var VIDEOBUFFER_HEADER_NUM_PIXELS = 4;
        /** @const */ var VIDEOBUFFER_HEADER_NUM_ELEMENTS = 5;

        var WebGLVertexTexture = (function (_super) {
            __extends(WebGLVertexTexture, _super);
            function WebGLVertexTexture() {
                _super.call(this);
                this._iWidth = 0;
                this._iHeight = 0;
                this._pWebGLTexture = null;
                this._ePixelFormat = 25 /* FLOAT32_RGBA */;
                //переменная нужна, чтобы проигнорировать обновление копии, обычно, это не требуется
                this._bForceUpdateBackupCopy = true;
                /*vertex data for header updating*/
                this._pHeader = null;
                this._pLockData = null;
            }
            WebGLVertexTexture.prototype.getType = function () {
                return 2 /* TBO */;
            };

            WebGLVertexTexture.prototype.getByteLength = function () {
                return akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, this._ePixelFormat);
            };

            WebGLVertexTexture.prototype.getWebGLTexture = function () {
                return this._pWebGLTexture;
            };

            WebGLVertexTexture.prototype._getWidth = function () {
                return this._iWidth;
            };

            WebGLVertexTexture.prototype._getHeight = function () {
                return this._iHeight;
            };

            WebGLVertexTexture.prototype.create = function (iByteSize, iFlags, pData) {
                if (typeof iFlags === "undefined") { iFlags = 1 /* STATIC */; }
                if (typeof pData === "undefined") { pData = null; }
                var iMinWidth = akra.config.webgl.vertexTextureMinSize;
                var iWidth, iHeight;
                var pTextureData = null;
                var pDataU8 = pData;

                var iAdditionalHeaderSize = (akra.isDefAndNotNull(pData)) ? 32 : 0;

                iByteSize = akra.math.max(iByteSize + iAdditionalHeaderSize, akra.pixelUtil.getMemorySize(iMinWidth, iMinWidth, 1, this._ePixelFormat));

                if (akra.bf.testAny(iFlags, 4 /* READABLE */)) {
                    iFlags = akra.bf.setAll(iFlags, 8 /* BACKUP_COPY */);
                }

                _super.prototype.create.call(this, iByteSize, iFlags, pData);

                var pPOTSize = akra.math.calcPOTtextureSize(akra.math.ceil(iByteSize / akra.pixelUtil.getNumElemBytes(this._ePixelFormat)));
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                var i;

                iWidth = pPOTSize[0];
                iHeight = pPOTSize[1];

                akra.debug.assert(this._pWebGLTexture == null, "webgl texture already allocated");

                this._iWidth = iWidth;
                this._iHeight = iHeight;
                this._iFlags = iFlags;

                akra.debug.assert(pWebGLContext !== null, "cannot grab webgl context");

                //Софтварного рендеринга буфера у нас нет
                akra.debug.assert(!this.isSoftware(), "no software rendering");

                //Если есть локальная копия то буфер можно читать
                if (this.isBackupPresent()) {
                    this._iFlags = akra.bf.setAll(this._iFlags, 4 /* READABLE */);
                }

                akra.debug.assert(!pData || pData.byteLength <= iByteSize, "Размер переданного массива больше переданного размера буфера");

                akra.logger.assert(akra.webgl.loadExtension(pWebGLContext, "OES_texture_float"), "OES_texture_float extension is necessary for correct work.");

                this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();
                this._eWebGLFormat = akra.webgl.getWebGLFormat(this._ePixelFormat);
                this._eWebGLType = akra.webgl.getWebGLDataType(this._ePixelFormat);

                if (!this._pWebGLTexture) {
                    akra.logger.critical("Не удалось создать буфер");

                    this.destroy();
                    return false;
                }

                if (akra.isDefAndNotNull(pData)) {
                    if (pData.BYTES_PER_ELEMENT > 1) {
                        pDataU8 = new Uint8Array(pData, pData.byteOffset, pData.byteLength);
                    }

                    pTextureData = new Uint8Array(this.getByteLength());
                    pTextureData.set(pDataU8);
                }

                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, this._pWebGLTexture);
                pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, this._eWebGLFormat, this._iWidth, this._iHeight, 0, this._eWebGLFormat, this._eWebGLType, pTextureData);

                pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MAG_FILTER, pWebGLContext.NEAREST);
                pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MIN_FILTER, pWebGLContext.NEAREST);
                pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_S, pWebGLContext.CLAMP_TO_EDGE);
                pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_T, pWebGLContext.CLAMP_TO_EDGE);

                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);

                //create header
                this._pHeader = this.allocateData([VE.float2(akra.data.Usages.TEXTURE_HEADER)], this._header());

                /**
                * update program
                **/
                var pProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.vertex_texture_update");

                if (akra.isNull(pProgram)) {
                    pProgram = this.getManager().getShaderProgramPool().createResource("WEBgl.vertex_texture_update");
                    pProgram.create("																									\n\
				uniform sampler2D sourceTexture;																	\n\
				attribute vec4  VALUE;																				\n\
				attribute float INDEX;																				\n\
				attribute float SHIFT;																				\n\
																													\n\
				uniform vec2 size;																					\n\
				varying vec4 color;																					\n\
																													\n\
				void main(void){																					\n\
					vec4 value = VALUE;																				\n\
					float  serial = INDEX;																			\n\
																													\n\
					int shift = int(SHIFT);																			\n\
					if (shift != 0) {																				\n\
						color = texture2D(sourceTexture,                                        					\n\
							vec2((mod(serial, size.x) +.5 ) / size.x, (floor(serial / size.x) + .5) / size.y)		\n\
							);																						\n\
																													\n\
																													\n\
						if (shift == 1) {																			\n\
							color = vec4(color.r, value.gba);														\n\
						}																							\n\
						else if (shift == 2) {																		\n\
							color = vec4(color.rg, value.ba);														\n\
						}																							\n\
						else if (shift == 3) {																		\n\
							color = vec4(color.rgb, value.a);														\n\
						}																							\n\
						else if (shift == -1) {																		\n\
							color = vec4(value.r, color.gba);														\n\
						}																							\n\
						else if (shift == -2) {																		\n\
							color = vec4(value.rg, color.ba);														\n\
						}																							\n\
						else {																						\n\
							color = vec4(value.rgb, color.a);														\n\
						}																							\n\
					}																								\n\
					else {																							\n\
						color = value;																				\n\
					}																								\n\
					gl_PointSize = 1.;																				\n\
					gl_Position = vec4(2. * (mod(serial, size.x) + .5) / size.x - 1.,								\n\
									2. * (floor(serial / size.x)  + .5) / size.y - 1., 0., 1.);						\n\
				}																									\n\
				", "									\n\
				#ifdef GL_ES                        \n\
					precision highp float;          \n\
				#endif								\n\
				varying vec4 color;                 \n\
													\n\
				void main(void) {                   \n\
					gl_FragColor = color;           \n\
				}                                   \n\
				");
                }

                /**
                * resize program
                **/
                pProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.vertex_texture_resize");

                if (akra.isNull(pProgram)) {
                    pProgram = this.getManager().getShaderProgramPool().createResource("WEBgl.vertex_texture_resize");
                    pProgram.create("																									\n\
				attribute float INDEX;																				\n\
																													\n\
				uniform sampler2D sourceTexture;																	\n\
																													\n\
				uniform vec2 v2fSrcTexSize;																			\n\
				uniform vec2 v2fDstTexSize;																			\n\
																													\n\
				varying vec4 v4fValue;																				\n\
																													\n\
				void main(void){																					\n\
																													\n\
					vec2 v2fSrcPosition = vec2((mod(INDEX, v2fSrcTexSize.x) + 0.5)/v2fSrcTexSize.x,					\n\
											   (floor(INDEX/v2fSrcTexSize.x) + 0.5)/v2fSrcTexSize.y);				\n\
																													\n\
					vec2 v2fDstPosition = vec2((mod(INDEX, v2fDstTexSize.x) + 0.5)/v2fDstTexSize.x,					\n\
											   (floor(INDEX/v2fDstTexSize.x) + 0.5)/v2fDstTexSize.y);				\n\
																													\n\
					v4fValue = texture2D(sourceTexture, v2fSrcPosition);											\n\
																													\n\
					gl_PointSize = 1.;																				\n\
					gl_Position = vec4(v2fDstPosition*2. - 1., 0., 1.);												\n\
				}																									\n\
				", "									\n\
				#ifdef GL_ES                        \n\
					precision highp float;          \n\
				#endif								\n\
				varying vec4 v4fValue;              \n\
													\n\
				void main(void) {                   \n\
					gl_FragColor = v4fValue;        \n\
				}                                   \n\
				");
                }

                if (akra.isNull(WebGLVertexTexture._pWebGLBuffer1)) {
                    WebGLVertexTexture._pWebGLBuffer1 = pWebGLRenderer.createWebGLBuffer();
                }
                if (akra.isNull(WebGLVertexTexture._pWebGLBuffer2)) {
                    WebGLVertexTexture._pWebGLBuffer2 = pWebGLRenderer.createWebGLBuffer();
                }
                if (akra.isNull(WebGLVertexTexture._pWebGLBuffer3)) {
                    WebGLVertexTexture._pWebGLBuffer3 = pWebGLRenderer.createWebGLBuffer();
                }

                return true;
            };

            WebGLVertexTexture.prototype.destroy = function () {
                _super.prototype.destroy.call(this);

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);

                this._pWebGLTexture = null;
            };

            WebGLVertexTexture.prototype.readData = function (iOffset, iSize, ppDest) {
                akra.debug.assert(!akra.isNull(this._pWebGLTexture), "Буффер еще не создан");

                if (!this.isBackupPresent()) {
                    return false;
                }

                if (arguments.length === 1) {
                    this._pBackupCopy.readData(arguments[0]);
                } else {
                    this._pBackupCopy.readData(iOffset, iSize, ppDest);
                }

                return true;
            };

            WebGLVertexTexture.prototype.writeData = function (pData, iOffset, iSize, bDiscardWholeBuffer) {
                if (typeof bDiscardWholeBuffer === "undefined") { bDiscardWholeBuffer = false; }
                var iTypeSize = akra.pixelUtil.getComponentTypeBits(this._ePixelFormat) / 8, nElementsPerPix = akra.pixelUtil.getComponentCount(this._ePixelFormat), iFrom, iCount;
                var pBufferData;

                var iLeftShift, iRightShift, iBeginPix, iEndPix, nPixels, nElements;

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                var pDataU8 = pData;

                akra.logger.assert(bDiscardWholeBuffer === false, "Discard option temporary unsupported.");

                if (pData.BYTES_PER_ELEMENT > 1) {
                    pDataU8 = new Uint8Array(pData.buffer, pData.byteOffset, pData.byteLength);
                }

                iOffset = iOffset || 0;
                iSize = iSize || pData.byteLength;

                pDataU8 = pDataU8.subarray(0, iSize);

                if (this.getByteLength() < iOffset + iSize) {
                    this.resize(iOffset + iSize);
                }

                if (this.isBackupPresent() && this._bForceUpdateBackupCopy) {
                    this._pBackupCopy.writeData(pDataU8, iOffset);
                }

                this._bForceUpdateBackupCopy = true;

                akra.debug.assert(iOffset % iTypeSize === 0 && iSize % iTypeSize === 0, "Incorrect data size or offset");

                iFrom = iOffset / iTypeSize;
                iCount = iSize / iTypeSize;

                iLeftShift = iFrom % nElementsPerPix;
                iRightShift = ((iFrom + iCount) % nElementsPerPix);
                iBeginPix = Math.floor(iFrom / nElementsPerPix);
                iEndPix = Math.floor((iFrom + iCount) / nElementsPerPix);
                nPixels = Math.ceil((iFrom + iCount) / nElementsPerPix) - Math.floor(iFrom / nElementsPerPix);
                nElements = nPixels * nElementsPerPix;

                pBufferData = new Float32Array(pDataU8.buffer, pDataU8.byteOffset);

                if (iLeftShift === 0 && iRightShift === 0) {
                    var iWidth = this._iWidth;
                    var iYmin = Math.floor(iBeginPix / iWidth);
                    var iYmax = Math.ceil(iEndPix / iWidth);
                    var iXbegin = iBeginPix % iWidth;
                    var iXend = iEndPix % iWidth;
                    var iHeight = iYmax - iYmin;

                    var iBeginElement = 0, iEndElement = 0;

                    //hack: if iEndPixel is first pixel from next row
                    iXend = (iXend === 0 ? iWidth : iXend);

                    //FIX THIS, move this function from here...
                    var me = this;
                    function updatePixelRect(iX, iY, iW, iH) {
                        iBeginElement = iEndElement;
                        iEndElement = iW * iH * nElementsPerPix + iEndElement;

                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, me._pWebGLTexture);

                        pWebGLContext.texSubImage2D(3553 /* TEXTURE_2D */, 0, iX, iY, iW, iH, me._eWebGLFormat, me._eWebGLType, pBufferData.subarray(iBeginElement, iEndElement));

                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);
                    }
                    ;

                    if (iHeight === 1) {
                        updatePixelRect(iXbegin, iYmin, iXend - iXbegin, 1);
                    } else {
                        updatePixelRect(iXbegin, iYmin, iWidth - iXbegin, 1);

                        if (iHeight > 2) {
                            updatePixelRect(0, iYmin + 1, iWidth, iHeight - 2);
                        }

                        updatePixelRect(0, iYmax - 1, iXend, 1);
                    }
                } else if (this.isBackupPresent()) {
                    var iRealOffset = iBeginPix * nElementsPerPix * iTypeSize;
                    var iRealSize = nElements * iTypeSize;
                    var pTempData = this._pBackupCopy.lock(iRealOffset, iRealSize);

                    //var iTotalSize: uint 	= iRealOffset + iRealSize;
                    //FIX ME:
                    this._pBackupCopy.unlock();

                    this._bForceUpdateBackupCopy = false;

                    return this.writeData(pTempData, iRealOffset, iRealSize);
                } else {
                    //console.error(this);
                    var pMarkupDataIndex = new Float32Array(nPixels);
                    var pMarkupDataShift = new Float32Array(nPixels);
                    var pRealData = new Float32Array(nElements);

                    pMarkupDataIndex[0] = iBeginPix;
                    pMarkupDataShift[0] = iLeftShift;

                    pMarkupDataIndex[nPixels - 1] = iBeginPix + nPixels - 1;
                    pMarkupDataShift[nPixels - 1] = -iRightShift;

                    for (var i = 1; i < nPixels - 1; ++i) {
                        pMarkupDataIndex[i] = iBeginPix + i;
                    }

                    for (var i = 0; i < iCount; i++) {
                        pRealData[iLeftShift + i] = pBufferData[i];
                    }

                    var pOldFrameBuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);

                    var pWebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
                    var pWebGLProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.vertex_texture_update");

                    var pValueBuffer = WebGLVertexTexture._pWebGLBuffer1;
                    var pMarkupIndexBuffer = WebGLVertexTexture._pWebGLBuffer2;
                    var pMarkupShiftBuffer = WebGLVertexTexture._pWebGLBuffer3;

                    akra.debug.assert(akra.isDef(pWebGLProgram), "cound not find WEBgl.vertex_texture_update program");

                    pWebGLRenderer.disableAllWebGLVertexAttribs();

                    pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pWebGLFramebuffer);
                    pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

                    pWebGLRenderer.disable(2929 /* DEPTH_TEST */);
                    pWebGLRenderer.disable(3089 /* SCISSOR_TEST */);
                    pWebGLRenderer.disable(3042 /* BLEND */);
                    pWebGLRenderer.disable(2884 /* CULL_FACE */);

                    var iValueAttribLocation = pWebGLProgram.getWebGLAttributeLocation("VALUE");
                    var iIndexAttribLocation = pWebGLProgram.getWebGLAttributeLocation("INDEX");
                    var iShiftAttribLocation = pWebGLProgram.getWebGLAttributeLocation("SHIFT");

                    pWebGLContext.enableVertexAttribArray(iValueAttribLocation);
                    pWebGLContext.enableVertexAttribArray(iIndexAttribLocation);
                    pWebGLContext.enableVertexAttribArray(iShiftAttribLocation);

                    pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, this._pWebGLTexture, 0);

                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pValueBuffer);
                    pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pRealData, 35040 /* STREAM_DRAW */);
                    pWebGLContext.vertexAttribPointer(iValueAttribLocation, 4, 5126 /* FLOAT */, false, 0, 0);

                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pMarkupIndexBuffer);
                    pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pMarkupDataIndex, 35040 /* STREAM_DRAW */);
                    pWebGLContext.vertexAttribPointer(iIndexAttribLocation, 1, 5126 /* FLOAT */, false, 0, 0);

                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pMarkupShiftBuffer);
                    pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pMarkupDataShift, 35040 /* STREAM_DRAW */);
                    pWebGLContext.vertexAttribPointer(iShiftAttribLocation, 1, 5126 /* FLOAT */, false, 0, 0);

                    pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);
                    pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, this._pWebGLTexture);

                    pWebGLProgram.setInt("sourceTexture", 0);
                    pWebGLProgram.setVec2("size", akra.math.Vec2.temp(this._iWidth, this._iHeight));

                    pWebGLContext.viewport(0, 0, this._iWidth, this._iHeight);
                    pWebGLContext.drawArrays(0 /* POINTS */, 0, nPixels);
                    pWebGLContext.flush();

                    pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, null, 0);

                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, null);
                    pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);

                    pWebGLContext.disableVertexAttribArray(iValueAttribLocation);
                    pWebGLContext.disableVertexAttribArray(iIndexAttribLocation);
                    pWebGLContext.disableVertexAttribArray(iShiftAttribLocation);

                    //pWebGLRenderer.deleteWebGLBuffer(pValueBuffer);
                    //pWebGLRenderer.deleteWebGLBuffer(pMarkupShiftBuffer);
                    //pWebGLRenderer.deleteWebGLBuffer(pMarkupIndexBuffer);
                    pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFrameBuffer);
                    pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);
                }

                return true;
            };

            WebGLVertexTexture.prototype.resize = function (iSize) {
                var pWebGLRenderer = this.getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                var iMax = 0;
                if (iSize < this.getByteLength()) {
                    for (var k = 0; k < this._pVertexDataArray.length; ++k) {
                        var pVertexData = this._pVertexDataArray[k];

                        if (pVertexData.getByteOffset() + pVertexData.getByteLength() > iMax) {
                            iMax = pVertexData.getByteOffset() + pVertexData.getByteLength();
                        }
                    }

                    if (iMax > iSize) {
                        akra.debug.assert(false, "Уменьшение невозможно. Страая разметка не укладывается в новый размер");
                        return false;
                    }
                }

                var pPOTSize = akra.math.calcPOTtextureSize(akra.math.ceil(iSize / akra.pixelUtil.getNumElemBytes(this._ePixelFormat)));

                pPOTSize[0] = (pPOTSize[0] < akra.config.webgl.vertexTextureMinSize) ? akra.config.webgl.vertexTextureMinSize : pPOTSize[0];
                pPOTSize[1] = (pPOTSize[1] < akra.config.webgl.vertexTextureMinSize) ? akra.config.webgl.vertexTextureMinSize : pPOTSize[1];

                if (pPOTSize[0] !== this._iWidth || pPOTSize[1] !== this._iHeight) {
                    if (this.isBackupPresent()) {
                        this._iWidth = pPOTSize[0];
                        this._iHeight = pPOTSize[1];

                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, this._pWebGLTexture);
                        pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, this._eWebGLFormat, this._iWidth, this._iHeight, 0, this._eWebGLFormat, this._eWebGLType, null);

                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);

                        var iByteLength = this.getByteLength();

                        /*resing backup copy don't cause data loss*/
                        this._pBackupCopy.resize(iByteLength);

                        var pData = new Uint8Array(iByteLength);

                        if (!this.readData(pData)) {
                            akra.debug.warn("cannot read data from buffer");
                            return false;
                        }

                        this.writeData(pData, 0, iByteLength);
                    } else {
                        var pWebGLProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.vertex_texture_resize");

                        akra.debug.assert(akra.isDef(pWebGLProgram), "cound not find WEBgl.vertex_texture_resize program");

                        pWebGLRenderer.useWebGLProgram(pWebGLProgram.getWebGLProgram());

                        //create new texture for resize
                        var pTexture = pWebGLRenderer.createWebGLTexture();
                        pWebGLRenderer.activateWebGLTexture(33985 /* TEXTURE1 */);
                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pTexture);
                        pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, this._eWebGLFormat, pPOTSize[0], pPOTSize[1], 0, this._eWebGLFormat, this._eWebGLType, null);

                        pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MAG_FILTER, pWebGLContext.NEAREST);
                        pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_MIN_FILTER, pWebGLContext.NEAREST);
                        pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_S, pWebGLContext.CLAMP_TO_EDGE);
                        pWebGLContext.texParameterf(pWebGLContext.TEXTURE_2D, pWebGLContext.TEXTURE_WRAP_T, pWebGLContext.CLAMP_TO_EDGE);

                        var pOldFrameBuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);

                        var pWebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
                        pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pWebGLFramebuffer);
                        pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, pTexture, 0);

                        if (iSize >= this.getByteLength()) {
                            for (var k = 0; k < this._pVertexDataArray.length; ++k) {
                                var pVertexData = this._pVertexDataArray[k];

                                if (pVertexData.getByteOffset() + pVertexData.getByteLength() > iMax) {
                                    iMax = pVertexData.getByteOffset() + pVertexData.getByteLength();
                                }
                            }
                        }

                        var iTypeSize = akra.pixelUtil.getComponentTypeBits(this._ePixelFormat) / 8;
                        var nElementsPerPix = akra.pixelUtil.getComponentCount(this._ePixelFormat);
                        var nPixels = akra.math.ceil(iMax / iTypeSize / nElementsPerPix);

                        var pIndexBufferData = new Float32Array(nPixels);
                        for (var i = 0; i < nPixels; i++) {
                            pIndexBufferData[i] = i;
                        }

                        pWebGLRenderer.disableAllWebGLVertexAttribs();

                        var iIndexAttribLocation = pWebGLProgram.getWebGLAttributeLocation("INDEX");

                        pWebGLContext.enableVertexAttribArray(iIndexAttribLocation);

                        if (akra.isNull(WebGLVertexTexture._pWebGLBuffer1)) {
                            WebGLVertexTexture._pWebGLBuffer1 = pWebGLRenderer.createWebGLBuffer();
                        }

                        var pIndexBuffer = WebGLVertexTexture._pWebGLBuffer1;

                        pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pIndexBuffer);
                        pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pIndexBufferData, 35040 /* STREAM_DRAW */);
                        pWebGLContext.vertexAttribPointer(iIndexAttribLocation, 1, 5126 /* FLOAT */, false, 0, 0);

                        pWebGLRenderer.disable(2929 /* DEPTH_TEST */);
                        pWebGLRenderer.disable(3089 /* SCISSOR_TEST */);
                        pWebGLRenderer.disable(3042 /* BLEND */);
                        pWebGLRenderer.disable(2884 /* CULL_FACE */);

                        pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);
                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, this._pWebGLTexture);

                        pWebGLProgram.setInt("sourceTexture", 0);
                        pWebGLProgram.setVec2("v2fSrcTexSize", akra.math.Vec2.temp(this._iWidth, this._iHeight));
                        pWebGLProgram.setVec2("v2fDstTexSize", akra.math.Vec2.temp(pPOTSize[0], pPOTSize[1]));

                        pWebGLContext.viewport(0, 0, pPOTSize[0], pPOTSize[1]);
                        pWebGLContext.drawArrays(0 /* POINTS */, 0, nPixels);
                        pWebGLContext.flush();

                        pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, null, 0);

                        pWebGLContext.disableVertexAttribArray(iIndexAttribLocation);
                        pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, null);
                        pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, null);

                        //pWebGLRenderer.deleteWebGLBuffer(pIndexBuffer);
                        pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFrameBuffer);
                        pWebGLRenderer.deleteWebGLFramebuffer(pWebGLFramebuffer);

                        pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);

                        this._pWebGLTexture = pTexture;
                        this._iWidth = pPOTSize[0];
                        this._iHeight = pPOTSize[1];
                    }
                }

                this._pHeader.setData(this._header());

                this.notifyAltered();

                return true;
            };

            WebGLVertexTexture.prototype.lockImpl = function (iOffset, iSize, iLockFlags) {
                var pRetData = new Uint8Array(iSize);

                this.readData(iOffset, iSize, pRetData);

                this._pLockData = pRetData;

                return pRetData;
            };

            WebGLVertexTexture.prototype.unlockImpl = function () {
                this.writeData(this._pLockData, this._iLockStart, this._iLockSize);
            };

            WebGLVertexTexture.prototype.copyBackupToRealImpl = function (pRealData, pBackupData, iLockFlags) {
                pRealData.set(pBackupData);
            };

            WebGLVertexTexture.prototype._header = function (iTextureSizeX, iTextureSizeY) {
                if (typeof iTextureSizeX === "undefined") { iTextureSizeX = this._iWidth; }
                if (typeof iTextureSizeY === "undefined") { iTextureSizeY = this._iHeight; }
                var pHeader = new Float32Array(8);

                pHeader[VIDEOBUFFER_HEADER_WIDTH] = iTextureSizeX;
                pHeader[VIDEOBUFFER_HEADER_HEIGHT] = iTextureSizeY;
                pHeader[VIDEOBUFFER_HEADER_STEP_X] = 1 / iTextureSizeX;
                pHeader[VIDEOBUFFER_HEADER_STEP_Y] = 1 / iTextureSizeY;
                pHeader[VIDEOBUFFER_HEADER_NUM_PIXELS] = iTextureSizeX * iTextureSizeY;
                pHeader[VIDEOBUFFER_HEADER_NUM_ELEMENTS] = pHeader[VIDEOBUFFER_HEADER_NUM_PIXELS] * akra.pixelUtil.getNumElemBytes(this._ePixelFormat);

                return pHeader;
            };

            WebGLVertexTexture._pWebGLBuffer1 = null;
            WebGLVertexTexture._pWebGLBuffer2 = null;
            WebGLVertexTexture._pWebGLBuffer3 = null;
            return WebGLVertexTexture;
        })(akra.pool.resources.VertexBuffer);
        webgl.WebGLVertexTexture = WebGLVertexTexture;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLVertexTexture.js.map
