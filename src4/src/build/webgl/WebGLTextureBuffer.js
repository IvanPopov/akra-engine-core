/// <reference path="../idl/ITexture.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IRenderTexture.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../pixelUtil/PixelBox.ts" />
    /// <reference path="WebGLPixelBuffer.ts" />
    /// <reference path="WebGLRenderer.ts" />
    (function (webgl) {
        var SQUARE_VERTICES = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0]);
        var TEXCOORDS = new Float32Array(12);

        function computeLog(iValue) {
            var i = 0;

            /* Error! */
            if (iValue === 0)
                return -1;

            for (; ;) {
                if (iValue & 1) {
                    /* Error! */
                    if (iValue !== 1)
                        return -1;
                    return i;
                }
                iValue = iValue >> 1;
                i++;
            }
        }
        webgl.computeLog = computeLog;

        var WebGLTextureBuffer = (function (_super) {
            __extends(WebGLTextureBuffer, _super);
            function WebGLTextureBuffer() {
                _super.call(this);
                this._eTarget = null;
                this._eFaceTarget = null;
                this._pWebGLTexture = null;
                this._iFace = 0;
                this._iLevel = 0;
                this._bSoftwareMipmap = false;
                this._pRTTList = null;
            }
            WebGLTextureBuffer.prototype._clearRTT = function (iZOffset) {
                this._pRTTList[iZOffset] = null;
            };

            WebGLTextureBuffer.prototype.reset = function (iWidth, iHeight) {
                if (typeof iWidth === "undefined") { iWidth = this._iWidth; }
                if (typeof iHeight === "undefined") { iHeight = iWidth; }
                //TODO: check format
                iWidth = akra.math.ceilingPowerOfTwo(iWidth);
                iHeight = akra.math.ceilingPowerOfTwo(iHeight);

                this._iWidth = this._iLevel === 0 ? iWidth : iWidth / Math.pow(2.0, this._iLevel);
                this._iHeight = this._iLevel === 0 ? iHeight : iHeight / Math.pow(2.0, this._iLevel);

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();

                //pWebGLRenderer.debug(true, true);
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

                pWebGLContext.texImage2D(this._eFaceTarget, this._iLevel, akra.webgl.getClosestWebGLInternalFormat(akra.webgl.getSupportedAlternative(this._eFormat)), this._iWidth, this._iHeight, 0, akra.webgl.getWebGLFormat(this._eFormat), akra.webgl.getWebGLDataType(this._eFormat), null);

                this._iByteSize = akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
                this._pBuffer.setPosition(0, 0, this._iWidth, this._iHeight, 0, this._iDepth);

                pWebGLRenderer.bindWebGLTexture(this._eTarget, null);

                this.notifyResized();
                //pWebGLRenderer.debug(false, false);
            };

            WebGLTextureBuffer.prototype.notifyResized = function () {
                if (!akra.isNull(this._pRTTList)) {
                    for (var i = 0; i < this._pRTTList.length; ++i) {
                        var pRTT = this._pRTTList[i];
                        pRTT.resized.emit(pRTT.getWidth(), pRTT.getHeight());
                    }
                }
            };

            WebGLTextureBuffer.prototype.create = function () {
                if (arguments.length < 6) {
                    akra.logger.critical("Invalid number of params. For WebGLTextureBuffer");
                }

                var eTarget = arguments[0];
                var pTexture = arguments[1];
                var iWidth = arguments[2];
                var iHeight = arguments[3];
                var iInternalFormat = arguments[4];
                var iFormat = arguments[5];
                var iFace = arguments[6];
                var iLevel = arguments[7];
                var iFlags = arguments[8];
                var bSoftwareMipmap = arguments[9];

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();

                pWebGLRenderer.bindWebGLTexture(eTarget, pTexture);

                this._eTarget = eTarget;
                this._pWebGLTexture = pTexture;
                this._iFace = iFace;
                this._iLevel = iLevel;
                this._iFlags = iFlags;
                this._bSoftwareMipmap = bSoftwareMipmap;

                this._eFaceTarget = eTarget;

                if (eTarget === 34067 /* TEXTURE_CUBE_MAP */) {
                    this._eFaceTarget = 34069 /* TEXTURE_CUBE_MAP_POSITIVE_X */ + iFace;
                }

                this._iWidth = iLevel === 0 ? iWidth : iWidth / Math.pow(2.0, iLevel);
                this._iHeight = iLevel === 0 ? iHeight : iHeight / Math.pow(2.0, iLevel);
                this._iDepth = 1;

                this._iWebGLInternalFormat = iInternalFormat;
                this._eFormat = akra.webgl.getClosestAkraFormat(iInternalFormat, iFormat);

                this._iRowPitch = this._iWidth;
                this._iSlicePitch = this._iHeight * this._iWidth;
                this._iByteSize = akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

                this._pBuffer = new akra.pixelUtil.PixelBox(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

                if (this._iWidth === 0 || this._iHeight === 0 || this._iDepth === 0) {
                    // We are invalid, do not allocate a buffer
                    return false;
                }

                // Is this a render target?
                if (akra.bf.testAny(this._iFlags, 512 /* RENDERTARGET */)) {
                    // Create render target for each slice
                    this._pRTTList = new Array();
                    for (var iZOffset = 0; iZOffset < this._iDepth; ++iZOffset) {
                        var pRenderTexture = new akra.webgl.WebGLRenderTexture(pWebGLRenderer, this);
                        this._pRTTList.push(pRenderTexture);
                        pWebGLRenderer.attachRenderTarget(pRenderTexture);
                    }
                }

                var pProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.blit_texture_buffer");
                var sFloatToVec4Func = "\
				vec4 floatToVec4(float value){						\n\
					float data = value;								\n\
					vec4 result = vec4(0.);							\n\
																	\n\
					if(data == 0.){									\n\
						float signedZeroTest = 1./value;			\n\
						if(signedZeroTest < 0.){					\n\
							result.x = 128.;						\n\
						}											\n\
						return result/255.;							\n\
					}												\n\
																	\n\
					if(data < 0.){									\n\
						result.x=128.;								\n\
						data = -data;								\n\
					}												\n\
																	\n\
					float power = 0.;								\n\
					bool isFinish = false;							\n\
					for(int i=0;i<128;i++){							\n\
						if(isFinish){								\n\
							break;									\n\
						}											\n\
																	\n\
						if(data >= 2.) {							\n\
							if(!isFinish){							\n\
								data = data * 0.5;					\n\
								power += 1.;						\n\
								if (power == 127.) {				\n\
									isFinish = true;				\n\
								}									\n\
							}										\n\
						}											\n\
						else if(data < 1.) {						\n\
							if(!isFinish){							\n\
								data = data * 2.;					\n\
								power -= 1.;						\n\
								if (power == -126.) {				\n\
									isFinish = true;				\n\
								}									\n\
							}										\n\
						}											\n\
						else {										\n\
							isFinish = true;						\n\
						}											\n\
					}												\n\
																	\n\
					if(power == -126. && data < 1.){				\n\
						power = 0.;									\n\
					}												\n\
					else{											\n\
						power = power+127.;							\n\
						data = data - 1.;							\n\
					}												\n\
																	\n\
					result.x+=floor(power/2.);						\n\
					result.y = mod(power,2.)*128.;					\n\
																	\n\
					data *= 128.;									\n\
																	\n\
					result.y += floor(data);						\n\
																	\n\
					data -= floor(data);							\n\
					data *= 256.;									\n\
																	\n\
					result.z = floor(data);							\n\
																	\n\
					data -= floor(data);							\n\
					data *= 256.;									\n\
																	\n\
					result.w = floor(data);							\n\
																	\n\
					return result/255.;								\n\
				}													\n";

                if (akra.isNull(pProgram)) {
                    pProgram = this.getManager().getShaderProgramPool().createResource("WEBgl.blit_texture_buffer");
                    pProgram.create("																									\n\
				attribute vec2 POSITION;																			\n\
				attribute vec3 TEXCOORD;																			\n\
																													\n\
				varying vec3 texcoord;																				\n\
																													\n\
				void main(void){																					\n\
					texcoord = TEXCOORD;																			\n\
					gl_Position = vec4(POSITION, 0., 1.);															\n\
				}																									\n\
				", "													\n\
				#ifdef GL_ES                        				\n\
					precision highp float;          				\n\
				#endif												\n\
				varying vec3 texcoord;              				\n\
				uniform sampler2D uSampler;        					\n\
																	\n\
				void main(void) {  									\n\
					vec4 color;										\n\
					color = texture2D(uSampler, texcoord.xy);      	\n\
					gl_FragColor = color;           				\n\
				}                                   				\n\
				");
                }

                pProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.decode_depth32_texture");

                if (akra.isNull(pProgram)) {
                    pProgram = this.getManager().getShaderProgramPool().createResource("WEBgl.decode_depth32_texture");
                    pProgram.create("																									\n\
				attribute vec2 POSITION;																			\n\
				attribute vec3 TEXCOORD;																			\n\
																													\n\
				varying vec3 texcoord;																				\n\
																													\n\
				void main(void){																					\n\
					texcoord = TEXCOORD;																			\n\
					gl_Position = vec4(POSITION, 0., 1.);															\n\
				}																									\n\
				", "													\n\
				#ifdef GL_ES                        				\n\
					precision highp float;          				\n\
				#endif												\n\
				varying vec3 texcoord;              				\n\
				uniform sampler2D uSampler;        					\n\
																	\n\
				" + sFloatToVec4Func + "\
																	\n\
				void main(void) {  									\n\
					vec4 color;										\n\
					color = texture2D(uSampler, vec2(texcoord.x, 1. - texcoord.y));      	\n\
					vec4 t = floatToVec4(color.r);					\n\
					gl_FragColor = vec4(t.a, t.b, t.g, t.r);		\n\
				}                                   				\n\
				");
                }

                pProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.decode_float32_texture");

                if (akra.isNull(pProgram)) {
                    pProgram = this.getManager().getShaderProgramPool().createResource("WEBgl.decode_float32_texture");
                    pProgram.create("																									\n\
				attribute vec2 POSITION;																			\n\
				attribute vec3 TEXCOORD;																			\n\
																													\n\
				varying vec3 texcoord;																				\n\
				varying vec2 dest_texcoord;																			\n\
																													\n\
				void main(void){																					\n\
					texcoord = TEXCOORD;																			\n\
					gl_Position = vec4(POSITION, 0., 1.);															\n\
					dest_texcoord.xy = (POSITION.xy + 1.  ) /2.;													\n\
				}																									\n\
				", "													\n\
				#ifdef GL_ES                        				\n\
					precision highp float;          				\n\
				#endif												\n\
																	\n\
				varying vec3 texcoord;              				\n\
				uniform sampler2D uSampler;							\n\
				uniform int dst_width;        						\n\
				uniform int dst_height;        						\n\
				uniform int src_components_num;						\n\
				varying vec2 dest_texcoord;							\n\
				" + sFloatToVec4Func + "\
																	\n\
				void main(void) {  									\n\
																	\n\
					float pixel = dest_texcoord.x * float(dst_width);	\n\
					float value;									\n\
					int comp = int(mod(pixel, float(src_components_num)));	\n\
					vec4 color = texture2D(uSampler, vec2(texcoord.x, 1. - texcoord.y));\n\
																	\n\
					if (comp == 0)									\n\
						value = color.r;							\n\
					if (comp == 1)									\n\
						value = color.g;							\n\
					if (comp == 2)									\n\
						value = color.b;							\n\
					if (comp == 3)									\n\
						value = color.a;	 						\n\
																	\n\
					vec4 t = floatToVec4(value);					\n\
																	\n\
					gl_FragColor = vec4(t.a, t.b, t.g, t.r);		\n\
				}\
				");
                }

                pWebGLRenderer.bindWebGLTexture(eTarget, null);

                return true;
            };

            // destroyResource(): boolean {
            // 	super.destroyResource();
            // 	this._pWebGLTexture = null;
            // 	this.destroy();
            // 	return true;
            // }
            WebGLTextureBuffer.prototype.destroy = function () {
                if (akra.bf.testAny(this._iFlags, 512 /* RENDERTARGET */)) {
                    // Delete all render targets that are not yet deleted via _clearSliceRTT because the rendertarget
                    // was deleted by the user.
                    var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                    for (var i = 0; i < this._pRTTList.length; i++) {
                        pWebGLRenderer.destroyRenderTarget(this._pRTTList[i]);
                    }
                }
            };

            //upload(download) data to(from) videocard.
            WebGLTextureBuffer.prototype.upload = function (pData, pDestBox) {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

                var pDataBox = null;

                if (akra.pixelUtil.isCompressed(pData.format)) {
                    if (pData.format !== this._eFormat || !pData.isConsecutive()) {
                        akra.logger.critical("Compressed images must be consecutive, in the source format");
                    }

                    var iWebGLFormat = akra.webgl.getClosestWebGLInternalFormat(this._eFormat);

                    // Data must be consecutive and at beginning of buffer as PixelStorei not allowed
                    // for compressed formats
                    if (pDestBox.left === 0 && pDestBox.top === 0) {
                        pWebGLContext.compressedTexImage2D(this._eFaceTarget, this._iLevel, iWebGLFormat, pDestBox.getWidth(), pDestBox.getHeight(), 0, pData.data);
                    } else {
                        pWebGLContext.compressedTexSubImage2D(this._eFaceTarget, this._iLevel, pDestBox.left, pDestBox.top, pDestBox.getWidth(), pDestBox.getHeight(), iWebGLFormat, pData.data);
                    }
                } else if (this._bSoftwareMipmap) {
                    if (pData.getWidth() !== pData.rowPitch || pData.getHeight() * pData.getWidth() !== pData.slicePitch) {
                        pDataBox = this._pBuffer.getSubBox(pDestBox, akra.pixelUtil.PixelBox.temp());
                        pDataBox.setConsecutive();
                        akra.pixelUtil.bulkPixelConversion(pData, pDataBox);
                    } else {
                        pDataBox = pData;
                    }

                    pWebGLRenderer.pixelStorei(3317 /* UNPACK_ALIGNMENT */, 1);
                    this.buildMipmaps(pDataBox);
                } else {
                    if (pData.getWidth() !== pData.rowPitch || pData.getHeight() * pData.getWidth() !== pData.slicePitch) {
                        pDataBox = this._pBuffer.getSubBox(pDestBox, akra.pixelUtil.PixelBox.temp());
                        pDataBox.setConsecutive();
                        akra.pixelUtil.bulkPixelConversion(pData, pDataBox);
                    } else {
                        pDataBox = pData;
                    }

                    if ((pData.getWidth() * akra.pixelUtil.getNumElemBytes(pData.format)) & 3) {
                        // Standard alignment of 4 is not right
                        pWebGLRenderer.pixelStorei(3317 /* UNPACK_ALIGNMENT */, 1);
                    }
                    if (pDestBox.left === 0 && pDestBox.top === 0 && pDestBox.getWidth() >= this.getWidth() && pDestBox.getHeight() >= this.getHeight()) {
                        pWebGLContext.texImage2D(this._eFaceTarget, this._iLevel, akra.webgl.getWebGLFormat(pData.format), pDestBox.getWidth(), pDestBox.getHeight(), 0, akra.webgl.getWebGLFormat(pData.format), akra.webgl.getWebGLDataType(pData.format), !akra.pixelUtil.isFloatingPoint(pData.format) ? pDataBox.data : new Float32Array(pDataBox.data.buffer, pDataBox.data.byteOffset, pDataBox.data.byteLength / Float32Array.BYTES_PER_ELEMENT));
                    } else {
                        pWebGLContext.texSubImage2D(this._eFaceTarget, this._iLevel, pDestBox.left, pDestBox.top, pDestBox.getWidth(), pDestBox.getHeight(), akra.webgl.getWebGLFormat(pData.format), akra.webgl.getWebGLDataType(pData.format), pDataBox.data);
                    }
                }

                if (akra.bf.testAny(this._iFlags, 256 /* AUTOMIPMAP */) && !this._bSoftwareMipmap && (this._iLevel === 0)) {
                    pWebGLContext.generateMipmap(this._eFaceTarget);
                }

                pWebGLRenderer.pixelStorei(3317 /* UNPACK_ALIGNMENT */, 4);

                pWebGLRenderer.bindWebGLTexture(this._eTarget, null);

                this.notifyAltered();
            };

            WebGLTextureBuffer.prototype.download = function (pData) {
                akra.logger.assert(!((pData.right > this._iWidth) || (pData.bottom > this._iHeight) || (pData.front != 0) || (pData.back != 1)), "Invalid box " + pData.toString());

                var pSrcBox = null;
                var pWebGLTexture = this._pWebGLTexture;
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                if (!akra.webgl.checkFBOAttachmentFormat(this.getFormat())) {
                    akra.logger.critical("Read from texture this format not support(" + this.getFormat() + ")");
                }

                if (!akra.webgl.checkReadPixelFormat(this.getFormat())) {
                    akra.logger.assert(this.getFormat() === 46 /* DEPTH32 */ || this.getFormat() === 24 /* FLOAT32_RGB */ || this.getFormat() === 25 /* FLOAT32_RGBA */, "TODO: downloading for all formats");

                    var eFormat = this.getFormat();
                    var pDestBox = akra.geometry.Box.temp(0, 0, 0, pData.getWidth() * akra.pixelUtil.getComponentCount(this.getFormat()), pData.getHeight(), pData.getDepth());

                    if (this.getFormat() === 46 /* DEPTH32 */) {
                        eFormat = 29 /* FLOAT32_DEPTH */;
                    }

                    // мы не можем читать из данного формата напрямую, поэтому необходимо перерендерить эту текстура в RGB/RGBA 8.
                    var pProgram = this.getManager().getShaderProgramPool().findResource(this.getFormat() === 46 /* DEPTH32 */ ? "WEBgl.decode_depth32_texture" : "WEBgl.decode_float32_texture");

                    pWebGLTexture = WebGLTextureBuffer.copyTex2DImageByProgram(pProgram, pDestBox, 28 /* R8G8B8A8 */, this, pData);

                    if (pData.format === eFormat) {
                        pSrcBox = pData;
                    } else {
                        pSrcBox = new akra.pixelUtil.PixelBox(pData, eFormat, new Uint8Array(akra.pixelUtil.getMemorySize(pData.getWidth() * akra.pixelUtil.getComponentCount(this.getFormat()), pData.getHeight(), pData.getDepth(), 28 /* R8G8B8A8 */)));
                    }

                    var pOldFramebuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);
                    var pFrameBuffer = pWebGLRenderer.createWebGLFramebuffer();

                    pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pFrameBuffer);
                    pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, pWebGLTexture, 0);
                    pWebGLContext.readPixels(0, 0, pDestBox.getWidth(), pDestBox.getHeight(), 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, pSrcBox.data);
                    pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
                    pWebGLRenderer.deleteWebGLFramebuffer(pFrameBuffer);
                    pWebGLRenderer.deleteWebGLTexture(pWebGLTexture);

                    if (pSrcBox != pData) {
                        console.log("download. convertion....");
                        akra.pixelUtil.bulkPixelConversion(pSrcBox, pData);
                    }

                    return;
                }

                if (akra.webgl.checkReadPixelFormat(pData.format)) {
                    pSrcBox = pData;
                } else {
                    pSrcBox = new akra.pixelUtil.PixelBox(pData, 28 /* BYTE_RGBA */, new Uint8Array(akra.pixelUtil.getMemorySize(pData.getWidth(), pData.getHeight(), pData.getDepth(), 28 /* BYTE_RGBA */)));
                }

                var pOldFramebuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);
                var pFrameBuffer = pWebGLRenderer.createWebGLFramebuffer();

                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pFrameBuffer);

                var eFormat = akra.webgl.getWebGLFormat(pSrcBox.format);
                var eType = akra.webgl.getWebGLDataType(pSrcBox.format);

                pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, this._eFaceTarget, pWebGLTexture, this._iLevel);
                pWebGLContext.readPixels(pSrcBox.left, pSrcBox.top, pSrcBox.getWidth(), pSrcBox.getHeight(), eFormat, eType, pSrcBox.data);

                if (!akra.webgl.checkReadPixelFormat(pData.format)) {
                    console.log("download. convertion....");
                    akra.pixelUtil.bulkPixelConversion(pSrcBox, pData);
                }

                //дективировать его
                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
                pWebGLRenderer.deleteWebGLFramebuffer(pFrameBuffer);
                // if(data.getWidth() != getWidth() ||
                //     data.getHeight() != getHeight() ||
                //     data.getDepth() != getDepth())
                //     OGRE_EXCEPT(Exception::ERR_INVALIDPARAMS, "only download of entire buffer is supported by GL",
                //         "GLTextureBuffer::download");
                // glBindTexture( mTarget, mTextureID );
                // if(PixelUtil::isCompressed(data.format))
                // {
                //     if(data.format != mFormat || !data.isConsecutive())
                //         OGRE_EXCEPT(Exception::ERR_INVALIDPARAMS,
                //         "Compressed images must be consecutive, in the source format",
                //         "GLTextureBuffer::download");
                //     // Data must be consecutive and at beginning of buffer as PixelStorei not allowed
                //     // for compressed formate
                //     glGetCompressedTexImageNV(mFaceTarget, mLevel, data.data);
                // }
                // else
                // {
                //     if((data.getWidth()*PixelUtil::getNumElemBytes(data.format)) & 3) {
                //         // Standard alignment of 4 is not right
                //         glPixelStorei(gl.PACK_ALIGNMENT, 1);
                //     }
                //     // We can only get the entire texture
                //     glGetTexImageNV(mFaceTarget, mLevel,
                //         GLES2PixelUtil::getGLOriginFormat(data.format), GLES2PixelUtil::getGLOriginDataType(data.format),
                //         data.data);
                //     // Restore defaults
                //     glPixelStorei(gl.PACK_ALIGNMENT, 4);
                // }
                //logger.critical("Downloading texture buffers is not supported by OpenGL ES");
            };

            WebGLTextureBuffer.prototype.buildMipmaps = function (pData) {
                var iWidth = 0;
                var iHeight = 0;
                var iLogW = 0;
                var iLogH = 0;
                var iLevel = 0;
                var pScaled = new akra.pixelUtil.PixelBox();

                pScaled.data = pData.data;
                pScaled.left = pData.left;
                pScaled.right = pData.right;
                pScaled.top = pData.top;
                pScaled.bottom = pData.bottom;
                pScaled.front = pData.front;
                pScaled.back = pData.back;

                iWidth = pData.getWidth();
                iHeight = pData.getHeight();

                iLogW = computeLog(iWidth);
                iLogH = computeLog(iHeight);
                iLevel = (iLogW > iLogH ? iLogW : iLogH);

                var mip = 0;
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                for (mip = 0; mip <= iLevel; mip++) {
                    var iWebGLFormat = akra.webgl.getWebGLFormat(pScaled.format);
                    var iWebGLDataType = akra.webgl.getWebGLDataType(pScaled.format);

                    pWebGLContext.texImage2D(this._eFaceTarget, mip, iWebGLFormat, iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, pScaled.data);

                    if (mip !== 0) {
                        pScaled.data = null;
                    }

                    if (iWidth > 1) {
                        iWidth = iWidth / 2;
                    }

                    if (iHeight > 1) {
                        iHeight = iHeight / 2;
                    }

                    var iSizeInBytes = akra.pixelUtil.getMemorySize(iWidth, iHeight, 1, pData.format);
                    pScaled = new akra.pixelUtil.PixelBox(iWidth, iHeight, 1, pData.format);
                    pScaled.data = new Uint8Array(iSizeInBytes);
                    pData.scale(pScaled, 1 /* LINEAR */);
                }

                // Delete the scaled data for the last level
                if (iLevel > 0) {
                    pScaled.data = null;
                }
            };

            WebGLTextureBuffer.prototype._bindToFramebuffer = function (iAttachment, iZOffset) {
                akra.logger.assert(iZOffset < this._iDepth);
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();
                pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, iAttachment, this._eFaceTarget, this._pWebGLTexture, this._iLevel);
            };

            WebGLTextureBuffer.prototype._copyFromFramebuffer = function (iZOffset) {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
                pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, 0, 0, 0, 0, this._iWidth, this._iHeight);
                pWebGLRenderer.bindWebGLTexture(this._eTarget, null);
            };

            WebGLTextureBuffer.prototype._getTarget = function () {
                return this._eTarget;
            };

            WebGLTextureBuffer.prototype._getWebGLTexture = function () {
                return this._pWebGLTexture;
            };

            WebGLTextureBuffer.prototype._getFaceTarget = function () {
                return this._eFaceTarget;
            };

            WebGLTextureBuffer.prototype.blit = function (pSource, pSrcBox, pDestBox) {
                if (arguments.length === 1) {
                    return this.blit(pSource, new akra.geometry.Box(0, 0, 0, pSource.getWidth(), pSource.getHeight(), pSource.getDepth()), new akra.geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth));
                } else {
                    var pSourceTexture = pSource;

                    // TODO: Check for FBO support first
                    // Destination texture must be 2D or Cube
                    // Source texture must be 2D
                    if (!akra.bf.testAny(pSourceTexture.getFlags(), 512 /* RENDERTARGET */) && pSourceTexture._getTarget() === 3553 /* TEXTURE_2D */) {
                        return this.blitFromTexture(pSourceTexture, pSrcBox, pDestBox);
                    } else {
                        return _super.prototype.blit.call(this, pSource, pSrcBox, pDestBox);
                    }
                }
            };

            WebGLTextureBuffer.copyTex2DImageByProgram = function (pProgram, pDestBox, eFormat, pSource, pSrcBox) {
                if (typeof pSrcBox === "undefined") { pSrcBox = null; }
                var pWebGLRenderer = pSource.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer._disableTextureUnitsFrom(0);
                pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);

                // Disable alpha, depth and scissor testing, disable blending,
                // and disable culling
                pWebGLRenderer.disable(2929 /* DEPTH_TEST */);
                pWebGLRenderer.disable(3089 /* SCISSOR_TEST */);
                pWebGLRenderer.disable(3042 /* BLEND */);
                pWebGLRenderer.disable(2884 /* CULL_FACE */);

                // Set up source texture
                pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), pSource._getWebGLTexture());
                var iOldMagFilter = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10240 /* TEXTURE_MAG_FILTER */), iOldMinFilter = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10241 /* TEXTURE_MIN_FILTER */), iOldWrapS = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10242 /* TEXTURE_WRAP_S */), iOldWrapT = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10243 /* TEXTURE_WRAP_T */);

                if (akra.isNull(pSrcBox)) {
                    pSrcBox = pDestBox;
                }

                // Set filtering modes depending on the dimensions and source
                if (pSrcBox.getWidth() === pDestBox.getWidth() && pSrcBox.getHeight() === pDestBox.getHeight() && pSrcBox.getDepth() === pDestBox.getDepth()) {
                    // Dimensions match -- use nearest filtering (fastest and pixel correct)
                    pWebGLContext.texParameteri(pSource._getFaceTarget(), 10241 /* TEXTURE_MIN_FILTER */, 9728 /* NEAREST */);
                    pWebGLContext.texParameteri(pSource._getFaceTarget(), 10240 /* TEXTURE_MAG_FILTER */, 9728 /* NEAREST */);
                } else {
                    pWebGLContext.texParameteri(pSource._getFaceTarget(), 10241 /* TEXTURE_MIN_FILTER */, 9729 /* LINEAR */);
                    pWebGLContext.texParameteri(pSource._getFaceTarget(), 10240 /* TEXTURE_MAG_FILTER */, 9729 /* LINEAR */);
                }

                // Clamp to edge (fastest)
                pWebGLContext.texParameteri(pSource._getFaceTarget(), 10242 /* TEXTURE_WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                pWebGLContext.texParameteri(pSource._getFaceTarget(), 10243 /* TEXTURE_WRAP_T */, 33071 /* CLAMP_TO_EDGE */);

                //Store old binding so it can be restored later
                var pOldFramebuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);
                var pFramebuffer = pWebGLRenderer.createWebGLFramebuffer();

                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pFramebuffer);

                var pTempWebGLTexture = null;

                // If target format not directly supported, create intermediate texture
                var iGLTempFormat = akra.webgl.getClosestWebGLInternalFormat(akra.webgl.getSupportedAlternative(eFormat));

                pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();
                pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pTempWebGLTexture);

                // Allocate temporary texture of the size of the destination area
                pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, iGLTempFormat, (pDestBox.getWidth()), (pDestBox.getHeight()), 0, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, null);

                pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, pTempWebGLTexture, 0);

                // Set viewport to size of destination slice
                pWebGLContext.viewport(0, 0, pDestBox.getWidth(), pDestBox.getHeight());

                //Get WebGL program
                var pWebGLShaderProgram = pProgram;
                pWebGLRenderer.disableAllWebGLVertexAttribs();
                pWebGLRenderer.useWebGLProgram(pWebGLShaderProgram.getWebGLProgram());

                var iPosAttrIndex = 0;
                var iTexAttrIndex = 0;

                iPosAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("POSITION");
                iTexAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("TEXCOORD");

                pWebGLContext.enableVertexAttribArray(iPosAttrIndex);
                pWebGLContext.enableVertexAttribArray(iTexAttrIndex);

                var pSquareVertices = SQUARE_VERTICES;
                var pTexCoords = TEXCOORDS;

                var pPositionBuffer = pWebGLRenderer.createWebGLBuffer();
                var pTexCoordsBuffer = pWebGLRenderer.createWebGLBuffer();

                pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pPositionBuffer);
                pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pSquareVertices, 35040 /* STREAM_DRAW */);
                pWebGLContext.vertexAttribPointer(iPosAttrIndex, 2, 5126 /* FLOAT */, false, 0, 0);

                pWebGLShaderProgram.setInt("uSampler", 0);
                pWebGLShaderProgram.setInt("src_components_num", akra.pixelUtil.getComponentCount(pSource.getFormat()));
                pWebGLShaderProgram.setInt("dst_width", pDestBox.getWidth());
                pWebGLShaderProgram.setInt("dst_height", pDestBox.getHeight());

                // LOG("dest size: ", pDestBox.width, "x", pDestBox.height, "cn: ", pixelUtil.getComponentCount(pSource.format));
                // Process each destination slice
                var iSlice = 0;
                for (iSlice = pDestBox.front; iSlice < pDestBox.back; ++iSlice) {
                    /// Calculate source texture coordinates
                    var u1 = pSrcBox.left / pSource.getWidth();
                    var v1 = pSrcBox.top / pSource.getHeight();
                    var u2 = pSrcBox.right / pSource.getWidth();
                    var v2 = pSrcBox.bottom / pSource.getHeight();

                    /// Calculate source slice for this destination slice
                    var w = (iSlice - pDestBox.front) / pDestBox.getDepth();

                    /// Get slice # in source
                    w = w * pSrcBox.getDepth() + pSrcBox.front;

                    /// Normalise to texture coordinate in 0.0 .. 1.0
                    w = (w + 0.5) / pSource.getDepth();

                    pTexCoords[0] = u1;
                    pTexCoords[1] = v1;
                    pTexCoords[2] = w;

                    pTexCoords[3] = u2;
                    pTexCoords[4] = v1;
                    pTexCoords[5] = w;

                    pTexCoords[6] = u2;
                    pTexCoords[7] = v2;
                    pTexCoords[8] = w;

                    pTexCoords[9] = u1;
                    pTexCoords[10] = v2;
                    pTexCoords[11] = w;

                    /// Finally we're ready to rumble
                    pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), pSource._getWebGLTexture());

                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pTexCoordsBuffer);
                    pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pTexCoords, 35040 /* STREAM_DRAW */);
                    pWebGLContext.vertexAttribPointer(iTexAttrIndex, 3, 5126 /* FLOAT */, false, 0, 0);

                    pWebGLContext.drawArrays(5 /* TRIANGLE_STRIP */, 0, 4);
                }

                pWebGLContext.disableVertexAttribArray(iPosAttrIndex);
                pWebGLContext.disableVertexAttribArray(iTexAttrIndex);

                pWebGLRenderer.deleteWebGLBuffer(pPositionBuffer);
                pWebGLRenderer.deleteWebGLBuffer(pTexCoordsBuffer);

                // Reset source texture to sane state
                pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), pSource._getWebGLTexture());
                pWebGLContext.texParameteri(pSource._getFaceTarget(), 10241 /* TEXTURE_MIN_FILTER */, iOldMinFilter);
                pWebGLContext.texParameteri(pSource._getFaceTarget(), 10240 /* TEXTURE_MAG_FILTER */, iOldMagFilter);
                pWebGLContext.texParameteri(pSource._getFaceTarget(), 10242 /* TEXTURE_WRAP_S */, iOldWrapS);
                pWebGLContext.texParameteri(pSource._getFaceTarget(), 10243 /* TEXTURE_WRAP_T */, iOldWrapT);
                pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), null);

                // Detach texture from temporary framebuffer
                pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 36161 /* RENDERBUFFER */, null);

                // Restore old framebuffer
                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
                pWebGLRenderer.deleteWebGLFramebuffer(pFramebuffer);

                return pTempWebGLTexture;
            };

            //-----------------------------------------------------------------------------
            // Very fast texture-to-texture blitter and hardware bi/trilinear scaling implementation using FBO
            // Destination texture must be 1D, 2D, 3D, or Cube
            // Source texture must be 1D, 2D or 3D
            // Supports compressed formats as both source and destination format, it will use the hardware DXT compressor
            // if available.
            WebGLTextureBuffer.prototype.blitFromTexture = function (pSource, pSrcBox, pDestBox) {
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                if (this.getFormat() === pSource.getFormat() && akra.webgl.checkCopyTexImage(this.getFormat()) && this._pBuffer.contains(pDestBox) && pSrcBox.getWidth() === pDestBox.getWidth() && pSrcBox.getHeight() === pDestBox.getHeight() && pSrcBox.getDepth() === pDestBox.getDepth()) {
                    var pOldFramebuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);
                    var pFramebuffer = pWebGLRenderer.createWebGLFramebuffer();

                    pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pFramebuffer);

                    pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, pSource._getTarget(), pSource._getWebGLTexture(), 0);

                    pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

                    if (pDestBox.getWidth() === this.getWidth() && pDestBox.getHeight() === this.getHeight()) {
                        pWebGLContext.copyTexImage2D(this._eFaceTarget, this._iLevel, akra.webgl.getWebGLFormat(this._eFormat), pSrcBox.left, pSrcBox.top, pSrcBox.getWidth(), pSrcBox.getHeight(), 0);
                    } else {
                        pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, pDestBox.left, pDestBox.top, pSrcBox.left, pSrcBox.top, pSrcBox.getWidth(), pSrcBox.getHeight());
                    }

                    pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
                    pWebGLRenderer.bindWebGLTexture(this._eTarget, null);
                    pWebGLRenderer.deleteWebGLFramebuffer(pFramebuffer);

                    this.notifyAltered();

                    return true;
                }
                pWebGLRenderer._disableTextureUnitsFrom(0);
                pWebGLRenderer.activateWebGLTexture(33984 /* TEXTURE0 */);

                // Disable alpha, depth and scissor testing, disable blending,
                // and disable culling
                pWebGLRenderer.disable(2929 /* DEPTH_TEST */);
                pWebGLRenderer.disable(3089 /* SCISSOR_TEST */);
                pWebGLRenderer.disable(3042 /* BLEND */);
                pWebGLRenderer.disable(2884 /* CULL_FACE */);

                // Set up source texture
                pWebGLRenderer.bindWebGLTexture(pSource._getTarget(), pSource._getWebGLTexture());
                var iOldMagFilter = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10240 /* TEXTURE_MAG_FILTER */), iOldMinFilter = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10241 /* TEXTURE_MIN_FILTER */), iOldWrapS = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10242 /* TEXTURE_WRAP_S */), iOldWrapT = pWebGLContext.getTexParameter(pSource._getFaceTarget(), 10243 /* TEXTURE_WRAP_T */);

                // Set filtering modes depending on the dimensions and source
                if (pSrcBox.getWidth() === pDestBox.getWidth() && pSrcBox.getHeight() === pDestBox.getHeight() && pSrcBox.getDepth() === pDestBox.getDepth()) {
                    // Dimensions match -- use nearest filtering (fastest and pixel correct)
                    pWebGLContext.texParameteri(pSource._getTarget(), 10241 /* TEXTURE_MIN_FILTER */, 9728 /* NEAREST */);
                    pWebGLContext.texParameteri(pSource._getTarget(), 10240 /* TEXTURE_MAG_FILTER */, 9728 /* NEAREST */);
                } else {
                    // Dimensions don't match -- use bi or trilinear filtering depending on the
                    // source texture.
                    if (akra.bf.testAny(pSource.getFlags(), 256 /* AUTOMIPMAP */)) {
                        // Automatic mipmaps, we can safely use trilinear filter which
                        // brings greatly improved quality for minimisation.
                        pWebGLContext.texParameteri(pSource._getTarget(), 10241 /* TEXTURE_MIN_FILTER */, 9987 /* LINEAR_MIPMAP_LINEAR */);
                        pWebGLContext.texParameteri(pSource._getTarget(), 10240 /* TEXTURE_MAG_FILTER */, 9729 /* LINEAR */);
                    } else {
                        // Manual mipmaps, stay safe with bilinear filtering so that no
                        // intermipmap leakage occurs.
                        pWebGLContext.texParameteri(pSource._getTarget(), 10241 /* TEXTURE_MIN_FILTER */, 9729 /* LINEAR */);
                        pWebGLContext.texParameteri(pSource._getTarget(), 10240 /* TEXTURE_MAG_FILTER */, 9729 /* LINEAR */);
                    }
                }

                // Clamp to edge (fastest)
                pWebGLContext.texParameteri(pSource._getTarget(), 10242 /* TEXTURE_WRAP_S */, 33071 /* CLAMP_TO_EDGE */);
                pWebGLContext.texParameteri(pSource._getTarget(), 10243 /* TEXTURE_WRAP_T */, 33071 /* CLAMP_TO_EDGE */);

                //Store old binding so it can be restored later
                var pOldFramebuffer = pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);

                var pFramebuffer = pWebGLRenderer.createWebGLFramebuffer();

                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pFramebuffer);

                var pTempWebGLTexture = null;

                if (!akra.webgl.checkFBOAttachmentFormat(this._eFormat) || pSource._getWebGLTexture() === this._getWebGLTexture()) {
                    // If target format not directly supported, create intermediate texture
                    var iGLTempFormat = akra.webgl.getClosestWebGLInternalFormat(akra.webgl.getSupportedAlternative(this._eFormat));

                    pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();
                    pWebGLRenderer.bindWebGLTexture(3553 /* TEXTURE_2D */, pTempWebGLTexture);

                    // Allocate temporary texture of the size of the destination area
                    pWebGLContext.texImage2D(3553 /* TEXTURE_2D */, 0, iGLTempFormat, akra.math.ceilingPowerOfTwo(pDestBox.getWidth()), akra.math.ceilingPowerOfTwo(pDestBox.getHeight()), 0, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, null);

                    pWebGLContext.framebufferTexture2D(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 3553 /* TEXTURE_2D */, pTempWebGLTexture, 0);

                    // Set viewport to size of destination slice
                    pWebGLContext.viewport(0, 0, pDestBox.getWidth(), pDestBox.getHeight());
                } else {
                    // We are going to bind directly, so set viewport to size and position of destination slice
                    pWebGLContext.viewport(pDestBox.left, pDestBox.top, pDestBox.getWidth(), pDestBox.getHeight());
                }

                //Get WebGL program
                var pWebGLShaderProgram = this.getManager().getShaderProgramPool().findResource("WEBgl.blit_texture_buffer");
                pWebGLRenderer.disableAllWebGLVertexAttribs();
                pWebGLRenderer.useWebGLProgram(pWebGLShaderProgram.getWebGLProgram());

                var iPosAttrIndex = 0;
                var iTexAttrIndex = 0;

                iPosAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("POSITION");
                iTexAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("TEXCOORD");

                pWebGLContext.enableVertexAttribArray(iPosAttrIndex);
                pWebGLContext.enableVertexAttribArray(iTexAttrIndex);

                var pSquareVertices = SQUARE_VERTICES;
                var pTexCoords = TEXCOORDS;

                var pPositionBuffer = pWebGLRenderer.createWebGLBuffer();
                var pTexCoordsBuffer = pWebGLRenderer.createWebGLBuffer();

                pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pPositionBuffer);
                pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pSquareVertices, 35040 /* STREAM_DRAW */);
                pWebGLContext.vertexAttribPointer(iPosAttrIndex, 2, 5126 /* FLOAT */, false, 0, 0);

                pWebGLShaderProgram.setInt("uSampler", 0);

                // Process each destination slice
                var iSlice = 0;
                for (iSlice = pDestBox.front; iSlice < pDestBox.back; ++iSlice) {
                    if (akra.isNull(pTempWebGLTexture)) {
                        // Bind directly
                        this._bindToFramebuffer(36064 /* COLOR_ATTACHMENT0 */, iSlice);
                    }

                    /// Calculate source texture coordinates
                    var u1 = pSrcBox.left / pSource.getWidth();
                    var v1 = pSrcBox.top / pSource.getHeight();
                    var u2 = pSrcBox.right / pSource.getWidth();
                    var v2 = pSrcBox.bottom / pSource.getHeight();

                    /// Calculate source slice for this destination slice
                    var w = (iSlice - pDestBox.front) / pDestBox.getDepth();

                    /// Get slice # in source
                    w = w * pSrcBox.getDepth() + pSrcBox.front;

                    /// Normalise to texture coordinate in 0.0 .. 1.0
                    w = (w + 0.5) / pSource.getDepth();

                    pTexCoords[0] = u1;
                    pTexCoords[1] = v1;
                    pTexCoords[2] = w;

                    pTexCoords[3] = u2;
                    pTexCoords[4] = v1;
                    pTexCoords[5] = w;

                    pTexCoords[6] = u2;
                    pTexCoords[7] = v2;
                    pTexCoords[8] = w;

                    pTexCoords[9] = u1;
                    pTexCoords[10] = v2;
                    pTexCoords[11] = w;

                    /// Finally we're ready to rumble
                    pWebGLRenderer.bindWebGLTexture(pSource._getTarget(), pSource._getWebGLTexture());

                    // pWebGLContext.enable(pSource._getTarget());
                    pWebGLRenderer.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pTexCoordsBuffer);
                    pWebGLContext.bufferData(34962 /* ARRAY_BUFFER */, pTexCoords, 35040 /* STREAM_DRAW */);
                    pWebGLContext.vertexAttribPointer(iTexAttrIndex, 3, 5126 /* FLOAT */, false, 0, 0);

                    pWebGLContext.drawArrays(5 /* TRIANGLE_STRIP */, 0, 4);

                    // pWebGLContext.disable(pSource._getTarget());
                    if (!akra.isNull(pTempWebGLTexture)) {
                        if (pSource === this) {
                            //set width, height and _pWebGLTexture
                            pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);

                            this._pWebGLTexture = pTempWebGLTexture;
                            this._iWidth = akra.math.ceilingPowerOfTwo(pDestBox.getWidth());
                            this._iHeight = akra.math.ceilingPowerOfTwo(pDestBox.getHeight());
                        } else {
                            // Copy temporary texture
                            pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

                            switch (this._eTarget) {
                                case 3553 /* TEXTURE_2D */:
                                case 34067 /* TEXTURE_CUBE_MAP */:
                                    pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, pDestBox.left, pDestBox.top, 0, 0, pDestBox.getWidth(), pDestBox.getHeight());
                                    break;
                            }
                        }
                    }
                }

                pWebGLContext.disableVertexAttribArray(iPosAttrIndex);
                pWebGLContext.disableVertexAttribArray(iTexAttrIndex);

                pWebGLRenderer.deleteWebGLBuffer(pPositionBuffer);
                pWebGLRenderer.deleteWebGLBuffer(pTexCoordsBuffer);

                // Finish up
                if (!akra.isNull(pTempWebGLTexture)) {
                    // Generate mipmaps
                    if (akra.bf.testAny(this._iFlags, 256 /* AUTOMIPMAP */)) {
                        pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
                        pWebGLContext.generateMipmap(this._eTarget);
                    }
                }

                // Reset source texture to sane state
                pWebGLRenderer.bindWebGLTexture(pSource._getTarget(), pSource._getWebGLTexture());
                pWebGLContext.texParameteri(pSource._getTarget(), 10241 /* TEXTURE_MIN_FILTER */, iOldMinFilter);
                pWebGLContext.texParameteri(pSource._getTarget(), 10240 /* TEXTURE_MAG_FILTER */, iOldMagFilter);
                pWebGLContext.texParameteri(pSource._getTarget(), 10242 /* TEXTURE_WRAP_S */, iOldWrapS);
                pWebGLContext.texParameteri(pSource._getTarget(), 10243 /* TEXTURE_WRAP_T */, iOldWrapT);
                pWebGLRenderer.bindWebGLTexture(pSource._getTarget(), null);

                // Detach texture from temporary framebuffer
                pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, 36064 /* COLOR_ATTACHMENT0 */, 36161 /* RENDERBUFFER */, null);

                // Restore old framebuffer
                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
                if (pSource !== this) {
                    pWebGLRenderer.deleteWebGLTexture(pTempWebGLTexture);
                }
                pWebGLRenderer.deleteWebGLFramebuffer(pFramebuffer);

                pTempWebGLTexture = null;
                this.notifyAltered();

                return true;
            };

            WebGLTextureBuffer.prototype.blitFromMemory = function () {
                if (arguments.length === 1) {
                    return _super.prototype.blitFromMemory.call(this, arguments[0]);
                }

                // Fall back to normal GLHardwarePixelBuffer::blitFromMemory in case
                // - FBO is not supported
                // - Either source or target is luminance due doesn't looks like supported by hardware
                // - the source dimensions match the destination ones, in which case no scaling is needed
                // TODO: Check that extension is NOT available
                var pSourceOrigin = arguments[0];
                var pDestBox = arguments[1];

                if (akra.pixelUtil.isLuminance(pSourceOrigin.format) || akra.pixelUtil.isLuminance(this._eFormat) || (pSourceOrigin.getWidth() === pDestBox.getWidth() && pSourceOrigin.getHeight() === pDestBox.getHeight() && pSourceOrigin.getDepth() === pDestBox.getDepth())) {
                    return _super.prototype.blitFromMemory.call(this, pSourceOrigin, pDestBox);
                }

                if (!this._pBuffer.contains(pDestBox)) {
                    akra.logger.critical("Destination box out of range");
                }

                var pSource;

                // First, convert the srcbox to a OpenGL compatible pixel format
                if (akra.webgl.getWebGLFormat(pSourceOrigin.format) === 0) {
                    // Convert to buffer internal format
                    var iSizeInBytes = akra.pixelUtil.getMemorySize(pSourceOrigin.getWidth(), pSourceOrigin.getHeight(), pSourceOrigin.getDepth(), this._eFormat);
                    pSource = new akra.pixelUtil.PixelBox(pSourceOrigin.getWidth(), pSourceOrigin.getHeight(), pSourceOrigin.getDepth(), this._eFormat, new Uint8Array(iSizeInBytes));

                    akra.pixelUtil.bulkPixelConversion(pSourceOrigin, pSource);
                } else {
                    // No conversion needed
                    pSource = pSourceOrigin;
                }

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                // Create temporary texture to store source data
                var pTempWebGLTexture = null;
                var eTarget = 3553 /* TEXTURE_2D */;
                var iWidth = akra.math.ceilingPowerOfTwo(pSource.getWidth());
                var iHeight = akra.math.ceilingPowerOfTwo(pSource.getHeight());
                var iWebGLFormat = akra.webgl.getClosestWebGLInternalFormat(pSource.format);
                var iWebGLDataType = akra.webgl.getWebGLDataType(pSource.format);

                pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();

                if (akra.isNull(pTempWebGLTexture)) {
                    akra.logger.error("Can not create WebGL texture");
                    return false;
                }

                pWebGLRenderer.bindWebGLTexture(eTarget, pTempWebGLTexture);
                pWebGLContext.texImage2D(eTarget, 0, iWebGLFormat, iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
                pWebGLRenderer.bindWebGLTexture(eTarget, null);

                var pTextureBufferPool = this.getManager().getTextureBufferPool();
                var pTempTexBuffer = pTextureBufferPool.createResource(".temp");

                // var pTempTexBuffer: WebGLTextureBuffer = <WebGLTextureBuffer>pTextureBufferPool.findResource(".temp");
                // if(isNull(pTextureBufferPool)){
                // 	pTempTexBuffer = <WebGLTextureBuffer>pTextureBufferPool.createResource(".temp");
                // }
                pTempTexBuffer.create(eTarget, pTempWebGLTexture, iWidth, iHeight, iWebGLFormat, pSource.format, 0, 0, 256 /* AUTOMIPMAP */ | 1 /* STATIC */, false);

                // Upload data to 0,0,0 in temporary texture
                var pTempBoxTarget = new akra.geometry.Box(0, 0, 0, pSource.getWidth(), pSource.getHeight(), pSource.getDepth());
                pTempTexBuffer.upload(pSource, pTempBoxTarget);

                //Blit
                this.blitFromTexture(pTempTexBuffer, pTempBoxTarget, pDestBox);

                //Delete temp data
                pTempTexBuffer.release();
                pTextureBufferPool.destroyResource(pTempTexBuffer);

                pWebGLRenderer.deleteWebGLTexture(pTempWebGLTexture);
                pTempWebGLTexture = null;
                pTempBoxTarget = null;

                return true;
            };

            WebGLTextureBuffer.prototype.getRenderTarget = function (iZOffest) {
                if (typeof iZOffest === "undefined") { iZOffest = 0; }
                akra.logger.assert(akra.bf.testAny(this._iFlags, 512 /* RENDERTARGET */));
                akra.logger.assert(iZOffest < this._iDepth, "iZOffest: " + iZOffest + ", iDepth: " + this._iDepth);
                return this._pRTTList[iZOffest];
            };

            WebGLTextureBuffer.prototype.resize = function (iWidth, iHeight) {
                if (typeof iHeight === "undefined") { iHeight = iWidth; }
                if (arguments.length === 1) {
                    akra.logger.critical("resize with one parametr not available for WebGLTextureBuffer");
                    return false;
                }
                var pSrcBox = akra.geometry.Box.temp(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
                var pDestBox = akra.geometry.Box.temp(0, 0, 0, iWidth, iHeight, this._iDepth);

                return this.blitFromTexture(this, pSrcBox, pDestBox);
            };
            return WebGLTextureBuffer;
        })(akra.webgl.WebGLPixelBuffer);
        webgl.WebGLTextureBuffer = WebGLTextureBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLTextureBuffer.js.map
