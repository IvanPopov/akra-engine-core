#ifndef WEBGLTEXTUREBUFFER_TS
#define WEBGLTEXTUREBUFFER_TS

#include "WebGLPixelBuffer.ts"
#include "IRenderTexture.ts"
#include "WebGLRenderer.ts"
#include "pixelUtil/PixelBox.ts"
#include "ITexture.ts"
#include "IResourcePool.ts"
#include "webgl/WebGLRenderer.ts"

module akra.webgl {

	var SQUARE_VERTICES: Float32Array = new Float32Array([ -1.0, -1.0,
									                		1.0, -1.0,
									               		   -1.0,  1.0,
									                		1.0,  1.0 ]);
	var TEXCOORDS: Float32Array = new Float32Array(12);

	export function computeLog(iValue: int): int {
	    var i: int = 0;
	    /* Error! */
	    if (iValue === 0) return -1;

	    for (;;) {
	        if (iValue & 1) {
	            /* Error! */
	            if (iValue !== 1) return -1;
	                return i;
	        }
	        iValue = iValue >> 1;
	        i++;
	    }
	}

	export class WebGLTextureBuffer extends WebGLPixelBuffer implements IPixelBuffer {
		protected _eTarget: int = null;
		protected _eFaceTarget: int = null; 
		protected _pWebGLTexture: WebGLTexture = null;
		protected _iFace: uint = 0;
		protected _iLevel: int = 0;
		protected _bSoftwareMipmap: bool = false;
		protected _pRTTList: IRenderTexture[] = null;

		constructor () {
			super();
		}

		_clearRTT(iZOffset: uint): void {
			this._pRTTList[iZOffset] = null;
		}

		reset(): void;
        reset(iSize: uint): void;
        reset(iWidth: uint, iHeight: uint): void;
        reset(iWidth?: uint = this._iWidth, iHeight?: uint = iWidth): void {
        	//TODO: check format
			iWidth = math.ceilingPowerOfTwo(iWidth);
			iHeight = math.ceilingPowerOfTwo(iHeight);

			this._iWidth = this._iLevel === 0 ? iWidth : iWidth / Math.pow(2.0, this._iLevel);
			this._iHeight = this._iLevel === 0 ? iHeight : iHeight / Math.pow(2.0, this._iLevel);

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			

			//pWebGLRenderer.debug(true, true);

			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

			pWebGLContext.texImage2D(this._eFaceTarget,
                        			 this._iLevel,
                        			 getClosestWebGLInternalFormat(getSupportedAlternative(this._eFormat)),	                            			
                        			 this._iWidth, this._iHeight, 0,
                        			 getWebGLFormat(this._eFormat), getWebGLDataType(this._eFormat),
                        			 null);	

			this.byteLength = pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
			this._pBuffer.setPosition(0, 0, this._iWidth, this._iHeight, 0, this._iDepth);

			pWebGLRenderer.bindWebGLTexture(this._eTarget, null);

			this.notifyResized();

			//pWebGLRenderer.debug(false, false);
		}

		private notifyResized(): void {
			if (!isNull(this._pRTTList)) {
				for (var i: int = 0; i < this._pRTTList.length; ++ i) {
					this._pRTTList[i].resized();
				}
			}
		}

		create(iFlags: int): bool;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): bool;
		create(eTarget: int, pTexture: WebGLTexture, iWidth: uint, iHeight: uint, iInternalFormat: int, iFormat: int, 
			   iFace: uint, iLevel: int, iFlags: int, bSoftwareMipmap: bool): bool;
		create(): bool {
			if(arguments.length < 6) {
				CRITICAL("Invalid number of params. For WebGLTextureBuffer");
			}

			var eTarget: int = arguments[0];
			var pTexture: WebGLTexture = arguments[1];
			var iWidth: uint = arguments[2];
			var iHeight: uint = arguments[3];
			var iInternalFormat: int = arguments[4];
			var iFormat: int = arguments[5];
			var iFace: uint = arguments[6];
			var iLevel: int = arguments[7];
			var iFlags: int = arguments[8];
			var bSoftwareMipmap: bool = arguments[9];

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();

			pWebGLRenderer.bindWebGLTexture(eTarget, pTexture);

			this._eTarget = eTarget;
			this._pWebGLTexture = pTexture;
			this._iFace = iFace;
			this._iLevel = iLevel;
			this._iFlags = iFlags;
			this._bSoftwareMipmap = bSoftwareMipmap;

			this._eFaceTarget = eTarget;

			if(eTarget === GL_TEXTURE_CUBE_MAP){
				this._eFaceTarget = GL_TEXTURE_CUBE_MAP_POSITIVE_X + iFace;
			}
			
			this._iWidth = iLevel === 0 ? iWidth : iWidth / Math.pow(2.0, iLevel);
			this._iHeight = iLevel === 0 ? iHeight : iHeight / Math.pow(2.0, iLevel);
			this._iDepth = 1;

			this._iWebGLInternalFormat = iInternalFormat;
			this._eFormat = getClosestAkraFormat(iInternalFormat, iFormat);

			this._iRowPitch = this._iWidth;
			this._iSlicePitch = this._iHeight * this._iWidth;
			this.byteLength = pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

			this._pBuffer = new pixelUtil.PixelBox(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
			
			if(this._iWidth === 0 || this._iHeight === 0 || this._iDepth === 0){
				// We are invalid, do not allocate a buffer
				return false;
			}

			// Is this a render target?
	        if (TEST_ANY(this._iFlags, ETextureFlags.RENDERTARGET)) {
	            // Create render target for each slice
	            this._pRTTList = new WebGLRenderTexture[];
	            for(var iZOffset: uint = 0; iZOffset < this._iDepth; ++iZOffset) {
	                var pRenderTexture: WebGLRenderTexture = new WebGLRenderTexture(pWebGLRenderer, this);
	                this._pRTTList.push(pRenderTexture);
	                pWebGLRenderer.attachRenderTarget(pRenderTexture);
	            }
	        }
	        
	        var pProgram: IShaderProgram = <IShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_blit_texture_buffer"); 
	        
	        if(isNull(pProgram)){
	        	pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource("WEBGL_blit_texture_buffer");
	        	pProgram.create(
	        	"																									\n\
	        	attribute vec2 POSITION;																			\n\
				attribute vec3 TEXCOORD;																			\n\
				                      																				\n\
				varying vec3 texcoord;																				\n\
				                   																					\n\
				void main(void){																					\n\
				    texcoord = TEXCOORD;																			\n\
				    gl_Position = vec4(POSITION, 0., 1.);															\n\
				}																									\n\
				",
				"													\n\
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

	        pProgram = <IShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_decode_depth32_texture");

	        if (isNull(pProgram)) {
	        	pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource("WEBGL_decode_depth32_texture");
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
				",
				"													\n\
				#ifdef GL_ES                        				\n\
				    precision highp float;          				\n\
				#endif												\n\
				varying vec3 texcoord;              				\n\
				uniform sampler2D uSampler;        					\n\
																	\n\
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
					bool ok = true;									\n\
					while (ok) {									\n\
																	\n\
						if(data >= 2.) {							\n\
							data = data * 0.5;						\n\
							power += 1.;							\n\
							if (power == 127.) {					\n\
								ok = false;							\n\
							}										\n\
						}											\n\
						else if(data < 1.) {					\n\
							data = data * 2.;					\n\
							power -= 1.;						\n\
							if (power == -126.) {				\n\
								ok = false;						\n\
							}									\n\
						}										\n\
						else {									\n\
							ok = false;							\n\
						}										\n\
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
				}													\n\
																	\n\
				void main(void) {  									\n\
					vec4 color;										\n\
					color = texture2D(uSampler, vec2(texcoord.x, 1. - texcoord.y));      	\n\
					vec4 t = floatToVec4(color.r);					\n\
				    gl_FragColor = vec4(t.a, t.b, t.g, t.r);		\n\
				}                                   				\n\
				");
	        }

	        pWebGLRenderer.bindWebGLTexture(eTarget, null);

			return true;
		}

		// destroyResource(): bool {
		// 	super.destroyResource();
		// 	this._pWebGLTexture = null;
		// 	this.destroy();
		// 	return true;
		// }

		destroy(): void {  
			if (TEST_ANY(this._iFlags, ETextureFlags.RENDERTARGET)) {
	            // Delete all render targets that are not yet deleted via _clearSliceRTT because the rendertarget
	            // was deleted by the user.
	            var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
	            for (var i: uint = 0; i < this._pRTTList.length; i++) {
	                pWebGLRenderer.destroyRenderTarget(this._pRTTList[i]);
	            }
	        }
    	}

		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
			
			var pDataBox: IPixelBox = null;

			if(pixelUtil.isCompressed(pData.format)) {
				if(pData.format !== this._eFormat || !pData.isConsecutive()){
					CRITICAL("Compressed images must be consecutive, in the source format");
				}

				var iWebGLFormat: int = webgl.getClosestWebGLInternalFormat(this._eFormat);
				// Data must be consecutive and at beginning of buffer as PixelStorei not allowed
            	// for compressed formats
            	if (pDestBox.left === 0 && pDestBox.top === 0) {
	                pWebGLContext.compressedTexImage2D(this._eFaceTarget, this._iLevel,
	                                       			   iWebGLFormat,
	                                       			   pDestBox.width,
	                                       			   pDestBox.height,
	                                       			   0,
	                                       			   pData.data);
	            }
	            else {
	                pWebGLContext.compressedTexSubImage2D(this._eFaceTarget, this._iLevel,
	                                          			  pDestBox.left, pDestBox.top,
	                                          			  pDestBox.width, pDestBox.height,
	                                          			  iWebGLFormat, pData.data);

	            }
			}
			else if(this._bSoftwareMipmap) {

				if (pData.width !== pData.rowPitch ||
					pData.height * pData.width !== pData.slicePitch)
				{
	                pDataBox = this._pBuffer.getSubBox(pDestBox, pixelUtil.pixelBox());
					pDataBox.setConsecutive();
					pixelUtil.bulkPixelConversion(pData, pDataBox);

	            }
	            else
	            {
	            	pDataBox = pData;
	            }

	            pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, 1);
	            this.buildMipmaps(pDataBox); 
			}
			else {
				if (pData.width !== pData.rowPitch ||
					pData.height * pData.width !== pData.slicePitch)
				{
	                pDataBox = this._pBuffer.getSubBox(pDestBox, pixelUtil.pixelBox());
					pDataBox.setConsecutive();
					pixelUtil.bulkPixelConversion(pData, pDataBox);
	            }
	            else {
	            	pDataBox = pData;
	            }

	            if ((pData.width * pixelUtil.getNumElemBytes(pData.format)) & 3) {
	                // Standard alignment of 4 is not right
	                pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, 1);
	            }
	            if (pDestBox.left === 0 && pDestBox.top === 0 && 
	            	pDestBox.width >= this.width && pDestBox.height >= this.height) 
	            {
	            	pWebGLContext.texImage2D(this._eFaceTarget,
                            			this._iLevel,
                            			webgl.getWebGLFormat(pData.format),	                            			
                            			pDestBox.width, pDestBox.height, 0,
                            			webgl.getWebGLFormat(pData.format),
                            			webgl.getWebGLDataType(pData.format),
                            			pDataBox.data);											
	            }
	            else
	            {
            		pWebGLContext.texSubImage2D(this._eFaceTarget,
                            			this._iLevel,
                            			pDestBox.left, pDestBox.top,                            			
                            			pDestBox.width, pDestBox.height,
                            			webgl.getWebGLFormat(pData.format),
                            			webgl.getWebGLDataType(pData.format),
                            			pDataBox.data);
	            }
	        }
	        
	        if (TEST_ANY(this._iFlags, ETextureFlags.AUTOMIPMAP) && !this._bSoftwareMipmap && (this._iLevel === 0)) {
	            pWebGLContext.generateMipmap(this._eFaceTarget);
	        }

	        pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, 4);
	        
	        pWebGLRenderer.bindWebGLTexture(this._eTarget, null);

	        this.notifyAltered();
		}



		protected download(pData: IPixelBox): void 
		{


			if ((pData.right > this._iWidth) || (pData.bottom > this._iHeight) || (pData.front != 0) || (pData.back != 1)) {
				CRITICAL("Invalid box");
			}

			var pSrcBox:IPixelBox = null;
			var pWebGLTexture: WebGLTexture = this._pWebGLTexture;
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			if(!checkFBOAttachmentFormat(this.format)) {
				CRITICAL("Read from texture this format not support(" + this.format + ")");
			}

			if (!checkReadPixelFormat(this.format)) {
				ASSERT (this.format === EPixelFormats.DEPTH32, "TODO: downloading for all formats");
				var pDestBox: IBox = geometry.box(0, 0, 0, pData.width, pData.height, pData.depth);

				// мы не можем читать из данного формата напрямую, поэтому необходимо перерендерить эту текстура в RGB/RGBA 8.
				var pProgram: WebGLShaderProgram = <WebGLShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_decode_depth32_texture");

				pWebGLTexture = WebGLTextureBuffer.copyTex2DImageByProgram(pProgram, pDestBox, EPixelFormats.R8G8B8A8, this, pData);

				if (pData.format === EPixelFormats.FLOAT32_DEPTH) {
					pSrcBox = pData;
				}
				else {
					pSrcBox = new pixelUtil.PixelBox(pData, EPixelFormats.FLOAT32_DEPTH, new Uint8Array(pixelUtil.getMemorySize(pData.width, pData.height, pData.depth, EPixelFormats.R8G8B8A8)));
				}

				var pOldFramebuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);
				var pFrameBuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
				
				pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pFrameBuffer);
				pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, pWebGLTexture, 0);
				pWebGLContext.readPixels(0, 0, pDestBox.width, pDestBox.height, GL_RGBA, GL_UNSIGNED_BYTE, pSrcBox.data);
				pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
				pWebGLRenderer.deleteWebGLFramebuffer(pFrameBuffer);

				// var fRes: float = pSrcBox.data[0]/255. + pSrcBox.data[1]/255./255. 
				// 					+ pSrcBox.data[2]/255./255./255. + pSrcBox.data[3]/255/255/255/255;
				// (new Float32Array(pSrcBox.data.buffer))[0] = fRes;
				if (pSrcBox != pData) {
					console.log("download. convertion....");
					pixelUtil.bulkPixelConversion(pSrcBox, pData);
				}

				return;
			}
		

			if(checkReadPixelFormat(pData.format))
			{
				pSrcBox = pData;
			}
			else
			{
				pSrcBox = new pixelUtil.PixelBox(pData, EPixelFormats.BYTE_RGBA, 
												 new Uint8Array(pixelUtil.getMemorySize(pData.width, pData.height, pData.depth, EPixelFormats.BYTE_RGBA)));
			}			

			

			var pOldFramebuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);
			var pFrameBuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
			
			pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pFrameBuffer);

			var eFormat: int = getWebGLFormat(pSrcBox.format);
			var eType: int = getWebGLDataType(pSrcBox.format);

			pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, this._eFaceTarget, pWebGLTexture, this._iLevel);
			pWebGLContext.readPixels(pSrcBox.left, pSrcBox.top, pSrcBox.width, pSrcBox.height, eFormat, eType, pSrcBox.data);
			

			if(!checkReadPixelFormat(pData.format))
			{
				console.log("download. convertion....");
				pixelUtil.bulkPixelConversion(pSrcBox, pData);
			}

			//дективировать его
			pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
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
	        //         glPixelStorei(GL_PACK_ALIGNMENT, 1);
	        //     }
	        //     // We can only get the entire texture
	        //     glGetTexImageNV(mFaceTarget, mLevel, 
	        //         GLES2PixelUtil::getGLOriginFormat(data.format), GLES2PixelUtil::getGLOriginDataType(data.format),
	        //         data.data);
	        //     // Restore defaults
	        //     glPixelStorei(GL_PACK_ALIGNMENT, 4);
	        // }
			//CRITICAL("Downloading texture buffers is not supported by OpenGL ES");
		}

		protected buildMipmaps(pData: IPixelBox): void {
			var iWidth: int = 0;
	        var iHeight: int = 0;
	        var iLogW: int = 0;
	        var iLogH: int = 0;
	        var iLevel: int = 0;
	        var pScaled: IPixelBox = new pixelUtil.PixelBox();

	        pScaled.data = pData.data;
	        pScaled.left = pData.left;
	        pScaled.right = pData.right;
	        pScaled.top = pData.top;
	        pScaled.bottom = pData.bottom;
	        pScaled.front = pData.front;
	        pScaled.back = pData.back;

	        iWidth = pData.width;
	        iHeight = pData.height;

	        iLogW = computeLog(iWidth);
	        iLogH = computeLog(iHeight);
	        iLevel = (iLogW > iLogH ? iLogW : iLogH);

	        var mip: int = 0;
	        var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

	        for (mip = 0; mip <= iLevel; mip++) {
	           	var iWebGLFormat: int = webgl.getWebGLFormat(pScaled.format);
	            var iWebGLDataType: int = webgl.getWebGLDataType(pScaled.format);

	            pWebGLContext.texImage2D(this._eFaceTarget,
	            						 mip,
	            						 iWebGLFormat,
	            						 iWidth, iHeight,
                         				 0,
	                         			 iWebGLFormat,
	                        			 iWebGLDataType,
	                        			 pScaled.data);

	            if (mip !== 0) {
	                pScaled.data = null;
	            }

	            if (iWidth > 1) {
	                iWidth = iWidth / 2;
	            }

	            if (iHeight > 1) {
	                iHeight = iHeight / 2;
	            }

	            var iSizeInBytes: int = pixelUtil.getMemorySize(iWidth, iHeight, 1, pData.format);
	            pScaled = new pixelUtil.PixelBox(iWidth, iHeight, 1, pData.format);
	            pScaled.data = new Uint8Array(iSizeInBytes);
	            pData.scale(pScaled, EFilters.LINEAR);
        	}

        	// Delete the scaled data for the last level
        	
	        if (iLevel > 0) {
	            pScaled.data = null;
	        }
		}

		_bindToFramebuffer(iAttachment: int, iZOffset: uint): void {
			ASSERT(iZOffset < this._iDepth);
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, iAttachment, this._eFaceTarget, this._pWebGLTexture, this._iLevel);
		}

		_copyFromFramebuffer(iZOffset: uint): void {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
			pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
			pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, 0, 0, 0, 0, this._iWidth, this._iHeight);
			pWebGLRenderer.bindWebGLTexture(this._eTarget, null);
		}

		inline _getTarget(): int {
			return this._eTarget;
		}

		inline _getWebGLTexture(): WebGLTexture {
			return this._pWebGLTexture;
		}

		inline _getFaceTarget(): int {
			return this._eFaceTarget;
		}

		blit(pSource: IPixelBuffer): bool;
		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer, pSrcBox?: IBox, pDestBox?: IBox): bool {
			if (arguments.length === 1) {
				return this.blit(pSource, 
		            new geometry.Box(0, 0, 0, pSource.width, pSource.height, pSource.depth), 
		            new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth)
		        );
			}
			else {
				var pSourceTexture: WebGLTextureBuffer = <WebGLTextureBuffer>pSource;
				// TODO: Check for FBO support first
		        // Destination texture must be 2D or Cube
		        // Source texture must be 2D
				if (!TEST_ANY(pSourceTexture.getFlags(), ETextureFlags.RENDERTARGET) && 
					pSourceTexture._getTarget() === GL_TEXTURE_2D) {

					return this.blitFromTexture(pSourceTexture, pSrcBox, pDestBox);
				}
				else {
					return super.blit(pSource, pSrcBox, pDestBox);
				}				
			}
		}

		private static copyTex2DImageByProgram(pProgram: WebGLShaderProgram, pDestBox: IBox, eFormat: int, pSource: WebGLTextureBuffer, pSrcBox: IBox = null): WebGLTexture {
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>pSource.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer._disableTextureUnitsFrom(0);
			pWebGLRenderer.activateWebGLTexture(GL_TEXTURE0);

			// Disable alpha, depth and scissor testing, disable blending, 
        	// and disable culling
        	pWebGLContext.disable(GL_DEPTH_TEST);
	        pWebGLContext.disable(GL_SCISSOR_TEST);
	        pWebGLContext.disable(GL_BLEND);
	        pWebGLContext.disable(GL_CULL_FACE);

	        // Set up source texture
        	pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), pSource._getWebGLTexture());

        	if (isNull(pSrcBox)) {
        		pSrcBox = pDestBox;
        	}

        	// Set filtering modes depending on the dimensions and source
	        if(pSrcBox.width === pDestBox.width &&
	           pSrcBox.height === pDestBox.height &&
	           pSrcBox.depth === pDestBox.depth) {
	            // Dimensions match -- use nearest filtering (fastest and pixel correct)
	            pWebGLContext.texParameteri(pSource._getFaceTarget(), GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	            pWebGLContext.texParameteri(pSource._getFaceTarget(), GL_TEXTURE_MAG_FILTER, GL_NEAREST);
	        }
	        else {
                pWebGLContext.texParameteri(pSource._getFaceTarget(), GL_TEXTURE_MIN_FILTER, GL_LINEAR);
                pWebGLContext.texParameteri(pSource._getFaceTarget(), GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	        }
	        // Clamp to edge (fastest)
	        pWebGLContext.texParameteri(pSource._getFaceTarget(), GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	        pWebGLContext.texParameteri(pSource._getFaceTarget(), GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	        //Store old binding so it can be restored later
	        var pOldFramebuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);
	        var pFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();

	        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pFramebuffer);

	        var pTempWebGLTexture: WebGLTexture = null;


        	// If target format not directly supported, create intermediate texture
        	var iGLTempFormat: int = webgl.getClosestWebGLInternalFormat(webgl.getSupportedAlternative(eFormat));
        	
        	pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();
        	pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, pTempWebGLTexture);
        	// Allocate temporary texture of the size of the destination area
        	pWebGLContext.texImage2D(GL_TEXTURE_2D, 0, iGLTempFormat, 
                     				 math.ceilingPowerOfTwo(pDestBox.width), 
                     				 math.ceilingPowerOfTwo(pDestBox.height), 
         				             0, GL_RGBA, GL_UNSIGNED_BYTE, null);

        	pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
                                  			   GL_TEXTURE_2D, pTempWebGLTexture, 0);
        	// Set viewport to size of destination slice
        	pWebGLContext.viewport(0, 0, pDestBox.width, pDestBox.height);
	

	        //Get WebGL program
	        var pWebGLShaderProgram: WebGLShaderProgram = <WebGLShaderProgram>pProgram; 
	        pWebGLRenderer.disableAllWebGLVertexAttribs();
	        pWebGLRenderer.useWebGLProgram(pWebGLShaderProgram.getWebGLProgram());

	        var iPosAttrIndex: int = 0;
	        var iTexAttrIndex: int = 0;

	        iPosAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("POSITION");
	        iTexAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("TEXCOORD");

	        pWebGLContext.enableVertexAttribArray(iPosAttrIndex);
	        pWebGLContext.enableVertexAttribArray(iTexAttrIndex);

	        var pSquareVertices: Float32Array = SQUARE_VERTICES;
	        var pTexCoords: Float32Array = TEXCOORDS;

	        var pPositionBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer();
	        var pTexCoordsBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer(); 

	        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pPositionBuffer);
	        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pSquareVertices, GL_STREAM_DRAW);
            pWebGLContext.vertexAttribPointer(iPosAttrIndex, 2, GL_FLOAT, false, 0, 0);

            pWebGLShaderProgram.setInt("uSampler", 0);
	        // Process each destination slice
	        var iSlice: int = 0;
	        for(iSlice = pDestBox.front; iSlice < pDestBox.back; ++iSlice) {
	            /// Calculate source texture coordinates
	            var u1: float = <float>pSrcBox.left / <float>pSource.width;
	            var v1: float = <float>pSrcBox.top / <float>pSource.height;
	            var u2: float = <float>pSrcBox.right / <float>pSource.width;
	            var v2: float = <float>pSrcBox.bottom / <float>pSource.height;
	            /// Calculate source slice for this destination slice
	            var w: float = <float>(iSlice - pDestBox.front) / <float>pDestBox.depth;
	            /// Get slice # in source
	            w = w * <float>pSrcBox.depth + pSrcBox.front;
	            /// Normalise to texture coordinate in 0.0 .. 1.0
	            w = (w + 0.5) / <float>pSource.depth;
	            
	            pTexCoords[0] = u1;
	            pTexCoords[1] = v1;
	            pTexCoords[2] = w;
	            
	            pTexCoords[3] = u2;
	            pTexCoords[4] = v1;
	            pTexCoords[5] = w;
	            
	            pTexCoords[6] = u2;
	            pTexCoords[7] = v2;
	            pTexCoords[8] = w;

  	            pTexCoords[9]  = u1;
	            pTexCoords[10] = v2;
	            pTexCoords[11] = w;
	            
	            /// Finally we're ready to rumble	
	            pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), pSource._getWebGLTexture());
	            
	            pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pTexCoordsBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pTexCoords, GL_STREAM_DRAW);
	            pWebGLContext.vertexAttribPointer(iTexAttrIndex, 3, GL_FLOAT, false, 0, 0);

	            pWebGLContext.drawArrays(GL_TRIANGLE_STRIP, 0, 4);
	        }

	        pWebGLContext.disableVertexAttribArray(iPosAttrIndex);
	        pWebGLContext.disableVertexAttribArray(iTexAttrIndex);

	        pWebGLRenderer.deleteWebGLBuffer(pPositionBuffer);
	        pWebGLRenderer.deleteWebGLBuffer(pTexCoordsBuffer);

	        // Reset source texture to sane state
	        pWebGLRenderer.bindWebGLTexture(pSource._getFaceTarget(), null);
	        
	        // Detach texture from temporary framebuffer
	        pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
	                                  			  GL_RENDERBUFFER, null);
	        // Restore old framebuffer
	        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
	        pWebGLRenderer.deleteWebGLFramebuffer(pFramebuffer);

	    	return pTempWebGLTexture;
		}

		//-----------------------------------------------------------------------------  
	    // Very fast texture-to-texture blitter and hardware bi/trilinear scaling implementation using FBO
	    // Destination texture must be 1D, 2D, 3D, or Cube
	    // Source texture must be 1D, 2D or 3D
	    // Supports compressed formats as both source and destination format, it will use the hardware DXT compressor
	    // if available.
	    blitFromTexture(pSource: WebGLTextureBuffer, pSrcBox: IBox, pDestBox: IBox): bool {
	    	var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			if (this.format === pSource.format && 
				checkCopyTexImage(this.format) &&
				this._pBuffer.contains(pDestBox) &&
				pSrcBox.width === pDestBox.width &&
	        	pSrcBox.height === pDestBox.height &&
	        	pSrcBox.depth === pDestBox.depth) 
			{
				var pOldFramebuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);
	        	var pFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
	        	
	        	pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pFramebuffer);

	        	pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
                                      			   pSource._getTarget(), pSource._getWebGLTexture(), 0);

	        	pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

	        	if(pDestBox.width === this.width && pDestBox.height === this.height){
	        		pWebGLContext.copyTexImage2D(this._eFaceTarget, this._iLevel, 
	        									 getWebGLFormat(this._eFormat),
	        									 pSrcBox.left, pSrcBox.top,
	        									 pSrcBox.width, pSrcBox.height, 0);
	        	}
	        	else {
	        		pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, 
	        									 	pDestBox.left, pDestBox.top,
	        										pSrcBox.left, pSrcBox.top,
	        										pSrcBox.width, pSrcBox.height);
	        	}

	        	pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
	        	pWebGLRenderer.bindWebGLTexture(this._eTarget, null);
				pWebGLRenderer.deleteWebGLFramebuffer(pFramebuffer);

				this.notifyAltered();

				return true;
			}
			pWebGLRenderer._disableTextureUnitsFrom(0);
			pWebGLRenderer.activateWebGLTexture(GL_TEXTURE0);

			// Disable alpha, depth and scissor testing, disable blending, 
        	// and disable culling
        	pWebGLContext.disable(GL_DEPTH_TEST);
	        pWebGLContext.disable(GL_SCISSOR_TEST);
	        pWebGLContext.disable(GL_BLEND);
	        pWebGLContext.disable(GL_CULL_FACE);

	        // Set up source texture
        	pWebGLRenderer.bindWebGLTexture(pSource._getTarget(), pSource._getWebGLTexture());

        	// Set filtering modes depending on the dimensions and source
	        if(pSrcBox.width === pDestBox.width &&
	           pSrcBox.height === pDestBox.height &&
	           pSrcBox.depth === pDestBox.depth) {
	            // Dimensions match -- use nearest filtering (fastest and pixel correct)
	            pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	            pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_MAG_FILTER, GL_NEAREST);
	        }
	        else {
	            // Dimensions don't match -- use bi or trilinear filtering depending on the
	            // source texture.
	            if(TEST_ANY(pSource.getFlags(), ETextureFlags.AUTOMIPMAP)) {
	                // Automatic mipmaps, we can safely use trilinear filter which
	                // brings greatly improved quality for minimisation.
	                pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	                pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_MAG_FILTER, GL_LINEAR);    
	            }
	            else {
	                // Manual mipmaps, stay safe with bilinear filtering so that no
	                // intermipmap leakage occurs.
	                pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	                pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	            }
	        }
	        // Clamp to edge (fastest)
	        pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	        pWebGLContext.texParameteri(pSource._getTarget(), GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	        //Store old binding so it can be restored later
	        var pOldFramebuffer: WebGLFramebuffer = pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);
	        
	        var pFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();

	        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pFramebuffer);

	        var pTempWebGLTexture: WebGLTexture = null;

	        if(!webgl.checkFBOAttachmentFormat(this._eFormat) || pSource._getWebGLTexture() === this._getWebGLTexture()){
	        	// If target format not directly supported, create intermediate texture
	        	var iGLTempFormat: int = webgl.getClosestWebGLInternalFormat(webgl.getSupportedAlternative(this._eFormat));
	        	
	        	pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();
	        	pWebGLRenderer.bindWebGLTexture(GL_TEXTURE_2D, pTempWebGLTexture);
	        	// Allocate temporary texture of the size of the destination area
	        	pWebGLContext.texImage2D(GL_TEXTURE_2D, 0, iGLTempFormat, 
                         				 math.ceilingPowerOfTwo(pDestBox.width), 
                         				 math.ceilingPowerOfTwo(pDestBox.height), 
             				             0, GL_RGBA, GL_UNSIGNED_BYTE, null);

	        	pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
                                      			   GL_TEXTURE_2D, pTempWebGLTexture, 0);
	        	// Set viewport to size of destination slice
	        	pWebGLContext.viewport(0, 0, pDestBox.width, pDestBox.height);
	        }
	        else {
	        	// We are going to bind directly, so set viewport to size and position of destination slice
	        	pWebGLContext.viewport(pDestBox.left, pDestBox.top, pDestBox.width, pDestBox.height);	
	        }

	        //Get WebGL program
	        var pWebGLShaderProgram: WebGLShaderProgram = <WebGLShaderProgram>this.getManager().shaderProgramPool.findResource("WEBGL_blit_texture_buffer"); 
	        pWebGLRenderer.disableAllWebGLVertexAttribs();
	        pWebGLRenderer.useWebGLProgram(pWebGLShaderProgram.getWebGLProgram());

	        var iPosAttrIndex: int = 0;
	        var iTexAttrIndex: int = 0;

	        iPosAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("POSITION");
	        iTexAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("TEXCOORD");

	        pWebGLContext.enableVertexAttribArray(iPosAttrIndex);
	        pWebGLContext.enableVertexAttribArray(iTexAttrIndex);

	        var pSquareVertices: Float32Array = SQUARE_VERTICES;
	        var pTexCoords: Float32Array = TEXCOORDS;

	        var pPositionBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer();
	        var pTexCoordsBuffer: WebGLBuffer = pWebGLRenderer.createWebGLBuffer(); 

	        pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pPositionBuffer);
	        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pSquareVertices, GL_STREAM_DRAW);
            pWebGLContext.vertexAttribPointer(iPosAttrIndex, 2, GL_FLOAT, false, 0, 0);

            pWebGLShaderProgram.setInt("uSampler", 0);

	        // Process each destination slice
	        var iSlice: int = 0;
	        for(iSlice = pDestBox.front; iSlice < pDestBox.back; ++iSlice) {
	            if(isNull(pTempWebGLTexture)) {
	                // Bind directly
	                this._bindToFramebuffer(GL_COLOR_ATTACHMENT0, iSlice);
	            }

	            /// Calculate source texture coordinates
	            var u1: float = <float>pSrcBox.left / <float>pSource.width;
	            var v1: float = <float>pSrcBox.top / <float>pSource.height;
	            var u2: float = <float>pSrcBox.right / <float>pSource.width;
	            var v2: float = <float>pSrcBox.bottom / <float>pSource.height;
	            /// Calculate source slice for this destination slice
	            var w: float = <float>(iSlice - pDestBox.front) / <float>pDestBox.depth;
	            /// Get slice # in source
	            w = w * <float>pSrcBox.depth + pSrcBox.front;
	            /// Normalise to texture coordinate in 0.0 .. 1.0
	            w = (w + 0.5) / <float>pSource.depth;
	            
	            pTexCoords[0] = u1;
	            pTexCoords[1] = v1;
	            pTexCoords[2] = w;
	            
	            pTexCoords[3] = u2;
	            pTexCoords[4] = v1;
	            pTexCoords[5] = w;
	            
	            pTexCoords[6] = u2;
	            pTexCoords[7] = v2;
	            pTexCoords[8] = w;

  	            pTexCoords[9]  = u1;
	            pTexCoords[10] = v2;
	            pTexCoords[11] = w;

	            /// Finally we're ready to rumble	
	            pWebGLRenderer.bindWebGLTexture(pSource._getTarget(), pSource._getWebGLTexture());
	         	
	            // pWebGLContext.enable(pSource._getTarget());
	            
	            pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pTexCoordsBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pTexCoords, GL_STREAM_DRAW);
	            pWebGLContext.vertexAttribPointer(iTexAttrIndex, 3, GL_FLOAT, false, 0, 0);

	            pWebGLContext.drawArrays(GL_TRIANGLE_STRIP, 0, 4);
	            // pWebGLContext.disable(pSource._getTarget());


	            if(!isNull(pTempWebGLTexture)) {
	            	if(pSource === this) {
	            		//set width, height and _pWebGLTexture
	            		pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);
	            		
	            		this._pWebGLTexture = pTempWebGLTexture;
	            		this._iWidth = math.ceilingPowerOfTwo(pDestBox.width);
	            		this._iHeight = math.ceilingPowerOfTwo(pDestBox.height);
	            	}
	            	else {
		                // Copy temporary texture
		                pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
		                
		                switch(this._eTarget) {
		                    case GL_TEXTURE_2D:
		                    case GL_TEXTURE_CUBE_MAP:
		                        pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, 
		                                            			pDestBox.left, pDestBox.top, 
		                                           				0, 0, pDestBox.width, pDestBox.height);
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
	        if(!isNull(pTempWebGLTexture)) {
	            // Generate mipmaps
	            if(TEST_ANY(this._iFlags, ETextureFlags.AUTOMIPMAP)) {
	                pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
	                pWebGLContext.generateMipmap(this._eTarget);
	            }
	        }
	        
	        // Reset source texture to sane state
	        pWebGLRenderer.bindWebGLTexture(this._eTarget, null);
	        
	        // Detach texture from temporary framebuffer
	        pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
	                                  			  GL_RENDERBUFFER, null);
	        // Restore old framebuffer
	        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
	        if(pSource !== this) {
	        	pWebGLRenderer.deleteWebGLTexture(pTempWebGLTexture);
	    	}
	        pWebGLRenderer.deleteWebGLFramebuffer(pFramebuffer);

	        pTempWebGLTexture = null;
	        this.notifyAltered();

	    	return true;
	    } 
	    
		blitFromMemory(pSource: IPixelBox): bool;
		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool;
		blitFromMemory(): bool {
			if(arguments.length === 1){
				return super.blitFromMemory(arguments[0]);
			}

			// Fall back to normal GLHardwarePixelBuffer::blitFromMemory in case 
	        // - FBO is not supported
	        // - Either source or target is luminance due doesn't looks like supported by hardware
	        // - the source dimensions match the destination ones, in which case no scaling is needed
	        // TODO: Check that extension is NOT available

			var pSourceOrigin: IPixelBox = arguments[0];
			var pDestBox: IBox = arguments[1];

			if(pixelUtil.isLuminance(pSourceOrigin.format) ||
	           pixelUtil.isLuminance(this._eFormat) ||
	           (pSourceOrigin.width === pDestBox.width &&
	            pSourceOrigin.height === pDestBox.height &&
	            pSourceOrigin.depth === pDestBox.depth)) {

	            return super.blitFromMemory(pSourceOrigin, pDestBox);	            
	        }

	        if(!this._pBuffer.contains(pDestBox)) {
	            CRITICAL("Destination box out of range");
	        }

		    var pSource: IPixelBox;
		    // First, convert the srcbox to a OpenGL compatible pixel format
	        if(getWebGLFormat(pSourceOrigin.format) === 0){
	        	// Convert to buffer internal format
	        	var iSizeInBytes: int = pixelUtil.getMemorySize(pSourceOrigin.width, pSourceOrigin.height,
	        													pSourceOrigin.depth, this._eFormat);
	        	pSource = new pixelUtil.PixelBox(pSourceOrigin.width, pSourceOrigin.height,
	        									 pSourceOrigin.depth, this._eFormat, new Uint8Array(iSizeInBytes));

	        	pixelUtil.bulkPixelConversion(pSourceOrigin, pSource);
	        }
	        else {
	        	// No conversion needed
	        	pSource = pSourceOrigin;
	        }

	        var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
	        // Create temporary texture to store source data
	        var pTempWebGLTexture: WebGLTexture = null;
	        var eTarget: int = GL_TEXTURE_2D;
	        var iWidth: int = math.ceilingPowerOfTwo(pSource.width);
	        var iHeight: int = math.ceilingPowerOfTwo(pSource.height);
	        var iWebGLFormat:int = getClosestWebGLInternalFormat(pSource.format);
	        var iWebGLDataType: int = getWebGLDataType(pSource.format);

	        pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();

	        if(isNull(pTempWebGLTexture)){
	        	ERROR("Can not create WebGL texture");
	        	return false;
	        }

	        pWebGLRenderer.bindWebGLTexture(eTarget, pTempWebGLTexture);
	        pWebGLContext.texImage2D(eTarget, 0, iWebGLFormat, iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
			pWebGLRenderer.bindWebGLTexture(eTarget, null);
	        
	        var pTextureBufferPool: IResourcePool = this.getManager().textureBufferPool;
	        var pTempTexBuffer: WebGLTextureBuffer = <WebGLTextureBuffer>pTextureBufferPool.createResource(".temp");
	        // var pTempTexBuffer: WebGLTextureBuffer = <WebGLTextureBuffer>pTextureBufferPool.findResource(".temp");
	        
	        // if(isNull(pTextureBufferPool)){
	        // 	pTempTexBuffer = <WebGLTextureBuffer>pTextureBufferPool.createResource(".temp");
	        // }

	        pTempTexBuffer.create(eTarget, pTempWebGLTexture, iWidth, iHeight, 
								  iWebGLFormat, pSource.format, 0, 0,
								  ETextureFlags.AUTOMIPMAP | EHardwareBufferFlags.STATIC,
								  false);

	        // Upload data to 0,0,0 in temporary texture
	        var pTempBoxTarget: IBox = new geometry.Box(0, 0, 0, pSource.width, pSource.height, pSource.depth);
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
		}

		getRenderTarget(): IRenderTarget;
		getRenderTarget(iZOffest: int): IRenderTarget;
		getRenderTarget(iZOffest?: int = 0): IRenderTarget {
			ASSERT(TEST_ANY(this._iFlags, ETextureFlags.RENDERTARGET));
        	ASSERT(iZOffest < this._iDepth, "iZOffest: " + iZOffest + ", iDepth: " + this._iDepth);
        	return this._pRTTList[iZOffest];
		}

		resize(iSize: uint): bool;
		resize(iWidth: uint, iHeight?: uint = iWidth): bool {
			if(arguments.length === 1){
				CRITICAL("resize with one parametr not available for WebGLTextureBuffer");
				return false;
			}
			var pSrcBox: IBox = geometry.box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
			var pDestBox: IBox = geometry.box(0, 0, 0, iWidth, iHeight, this._iDepth);
			
			return this.blitFromTexture(this, pSrcBox, pDestBox);
		}

	}
}

#endif
