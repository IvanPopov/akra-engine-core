#ifndef WEBGLTEXTUREBUFFER_TS
#define WEBGLTEXTUREBUFFER_TS

#include "WebGLPixelBuffer.ts"
#include "IRenderTexture.ts"
#include "IWebGLRenderer.ts"
#include "pixelUtil/PixelBox.ts"
#include "ITexture.ts"
#include "IResourcePool.ts"

module akra.webgl {

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
		protected _eTarget: int;
		protected _eFaceTarget: int; 
		protected _pWebGLTexture: WebGLTexture;
		protected _iFace: uint;
		protected _iLevel: int;
		protected _bSoftwareMipmap: bool;
		protected _pRTTList: IRenderTexture[];


		constructor () {
			super();
		}

		_clearRTT(iZOffset: uint): void {
			this._pRTTList[iZOffset] = null;
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

			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();

			pWebGLRenderer.bindWebGLTexture(eTarget, pTexture);

			this._eTarget = eTarget;
			this._pWebGLTexture = pTexture;
			this._iFace = iFace;
			this._iLevel = iLevel;
			this._bSoftwareMipmap = bSoftwareMipmap;

			this._eFaceTarget = eTarget;

			if(eTarget === GL_TEXTURE_CUBE_MAP){
				this._eFaceTarget = GL_TEXTURE_CUBE_MAP_POSITIVE_X + iFace;
			}
			
			this._iWidth = iLevel === 0 ? iWidth : iWidth / Math.pow(2.0, iLevel);
			this._iHeight = iLevel === 0 ? iHeight : iHeight / Math.pow(2.0, iLevel);
			this._iDepth = 1;

			this._iWebGLInternalFormat = iInternalFormat;
			this._eFormat = webgl.getClosestAkraFormat(iInternalFormat, iFormat);

			this._iRowPitch = this._iWidth;
			this._iSlicePitch = this._iHeight * this._iWidth;
			this.byteLength = pixelUtil.getMemorySize(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

			this._pBuffer = new pixelUtil.PixelBox(this._iWidth, this._iHeight, this._iDepth, this._eFormat);
			
			if(this._iWidth === 0 || this._iHeight === 0 || this._iDepth === 0){
				// We are invalid, do not allocate a buffer
				return false;
			}

			// Is this a render target?
	        // if (TEST_ANY(this._iFlags, ETextureFlags.RENDERTARGET)) {
	        //     // Create render target for each slice
	        //     mSliceTRT.reserve(mDepth);
	        //     for(size_t zoffset=0; zoffset<mDepth; ++zoffset) {
	        //         String name;
	        //         name = "rtt/" + StringConverter::toString((size_t)this) + "/" + baseName;
	        //         GLES2SurfaceDesc surface;
	        //         surface.buffer = this;
	        //         surface.zoffset = zoffset;
	        //         RenderTexture *trt = GLES2RTTManager::getSingleton().createRenderTexture(name, surface, writeGamma, fsaa);
	        //         mSliceTRT.push_back(trt);
	        //         Root::getSingleton().getRenderSystem()->attachRenderTarget(*mSliceTRT[zoffset]);
	        //     }
	        // }
	        
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

			return true;
		}

		destroy(): void {  
			// if (TEST_ANY(this._iFlags, ETextureFlags.RENDERTARGET))
	        // {
	        //     // Delete all render targets that are not yet deleted via _clearSliceRTT because the rendertarget
	        //     // was deleted by the user.
	        //     for (SliceTRT::const_iterator it = mSliceTRT.begin(); it != mSliceTRT.end(); ++it)
	        //     {
	        //         Root::getSingleton().getRenderSystem()->destroyRenderTarget((*it)->getName());
	        //     }
	        // }
    	}

		//upload(download) data to(from) videocard.
		protected upload(pData: IPixelBox, pDestBox: IBox): void {
			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);

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
				if (pData.width !== pData.rowPitch) {
	                // TODO
	                CRITICAL("Unsupported texture format");
	            }

	            if (pData.height * pData.width !== pData.slicePitch) {
	                // TODO
	                CRITICAL("Unsupported texture format");
	            }

	            pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, 1);
	            this.buildMipmaps(pData); 
			}
			else {
				if(pData.width !== pData.rowPitch) {
	                // TODO
	                CRITICAL("Unsupported texture format");
	            }

	            if(pData.height * pData.width !== pData.slicePitch) {
	                // TODO
	                CRITICAL("Unsupported texture format");
	            }

	            if ((pData.width * pixelUtil.getNumElemBytes(pData.format)) & 3) {
	                // Standard alignment of 4 is not right
	                pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, 1);
	            }

	            pWebGLContext.texSubImage2D(this._eFaceTarget,
	                            			this._iLevel,
	                            			pDestBox.left, pDestBox.top,
	                            			pDestBox.width, pDestBox.height,
	                            			webgl.getWebGLOriginFormat(pData.format),
	                            			webgl.getWebGLOriginDataType(pData.format),
	                            			pData.data);
	        }
	        
	        if (TEST_ANY(this._iFlags, ETextureFlags.AUTOMIPMAP) && !this._bSoftwareMipmap && (this._iLevel === 0)) {
	            pWebGLContext.generateMipmap(this._eFaceTarget);
	        }

	        pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, 4);

	        this.notifyAltered();
		}

		protected download(pData: IPixelBox): void {
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
			CRITICAL("Downloading texture buffers is not supported by OpenGL ES");
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
	        var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

	        for (mip = 0; mip <= iLevel; mip++) {
	           	var iWebGLFormat: int = webgl.getWebGLOriginFormat(pScaled.format);
	            var iWebGLDataType: int = webgl.getWebGLOriginDataType(pScaled.format);

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
			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			pWebGLContext.framebufferTexture2D(GL_FRAMEBUFFER, iAttachment, this._eFaceTarget, this._pWebGLTexture, this._iLevel);
		}

		_copyFromFramebuffer(iZOffset: uint): void {
			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
			pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
			pWebGLContext.copyTexSubImage2D(this._eFaceTarget, this._iLevel, 0, 0, 0, 0, this._iWidth, this._iHeight);
		}

		inline _getTarget(): int {
			return this._eTarget;
		}

		inline _getWebGLTexture(): WebGLTexture {
			return this._pWebGLTexture;
		}

		blit(pSource: IPixelBuffer): bool;
		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer, pSrcBox?: IBox, pDestBox?: IBox): bool {
			if (arguments.length == 1) {
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

		//-----------------------------------------------------------------------------  
	    // Very fast texture-to-texture blitter and hardware bi/trilinear scaling implementation using FBO
	    // Destination texture must be 1D, 2D, 3D, or Cube
	    // Source texture must be 1D, 2D or 3D
	    // Supports compressed formats as both source and destination format, it will use the hardware DXT compressor
	    // if available.
	    blitFromTexture(pSource: WebGLTextureBuffer, pSrcBox: IBox, pDestBox: IBox): bool {
	    	var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
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
	        var pOldFramebuffer: WebGLFramebuffer = pWebGLContext.getParameter(GL_FRAMEBUFFER_BINDING);
	        
	        var pFramebuffer: WebGLFramebuffer = pWebGLRenderer.createWebGLFramebuffer();
	        pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pFramebuffer);

	        var pTempWebGLTexture: WebGLTexture = null;

	        if(!webgl.checkFBOAttachmentFormat(this._eFormat) || pSource === this){
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
	        pWebGLRenderer.useWebGLProgram(pWebGLShaderProgram);

	        var iPosAttrIndex: int = 0;
	        var iTexAttrIndex: int = 0;

	        iPosAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("POSITION");
	        iTexAttrIndex = pWebGLShaderProgram.getWebGLAttributeLocation("TEXCOORD");

	        pWebGLContext.enableVertexAttribArray(iPosAttrIndex);
	        pWebGLContext.enableVertexAttribArray(iTexAttrIndex);

	        var pSquareVertices: Float32Array = new Float32Array([ -1.0, -1.0,
											                		1.0, -1.0,
											               		   -1.0,  1.0,
											                		1.0,  1.0 ]);
	        var pTexCoords: Float32Array = new Float32Array(12);

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
	         	
	            pWebGLContext.enable(pSource._getTarget());
	            
	            pWebGLRenderer.bindWebGLBuffer(GL_ARRAY_BUFFER, pTexCoordsBuffer);
		        pWebGLContext.bufferData(GL_ARRAY_BUFFER, pTexCoords, GL_STREAM_DRAW);
	            pWebGLContext.vertexAttribPointer(iTexAttrIndex, 3, GL_FLOAT, false, 0, 0);

	            pWebGLContext.drawArrays(GL_TRIANGLE_STRIP, 0, 4);
	            pWebGLContext.disable(pSource._getTarget());


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
	        pWebGLRenderer.bindWebGLTexture(this._eTarget, this._pWebGLTexture);
	        
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
	        if(getWebGLOriginFormat(pSourceOrigin.format) === 0){
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

	        var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
	        // Create temporary texture to store source data
	        var pTempWebGLTexture: WebGLTexture = null;
	        var eTarget: int = GL_TEXTURE_2D;
	        var iWidth: int = math.ceilingPowerOfTwo(pSource.width);
	        var iHeight: int = math.ceilingPowerOfTwo(pSource.height);
	        var iWebGLFormat:int = getClosestWebGLInternalFormat(pSource.format);
	        var iWebGLDataType: int = getWebGLOriginDataType(pSource.format);

	        pTempWebGLTexture = pWebGLRenderer.createWebGLTexture();

	        if(isNull(pTempWebGLTexture)){
	        	ERROR("Can not create WebGL texture");
	        	return false;
	        }

	        pWebGLRenderer.bindWebGLTexture(eTarget, pTempWebGLTexture);
	        pWebGLContext.texImage2D(eTarget, 0, iWebGLFormat, iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);

	        var pTextureBufferPool: IResourcePool = this.getManager().textureBufferPool;
	        var pTempTexBuffer: WebGLTextureBuffer = <WebGLTextureBuffer>pTextureBufferPool.createResource(".temp");

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
        	ASSERT(iZOffest < this._iDepth);
        	return this._pRTTList[iZOffest];
		}

		resize(iSize: uint): bool;
		resize(iWidth: uint, iHeight?: uint): bool {
			if(arguments.length === 1){
				CRITICAL("resize with one parametr not available for WebGLTextureBuffer");
				return false;
			}
			var pSrcBox: IBox = new geometry.Box(0, 0, 0, this._iWidth, this._iHeight, this._iDepth);
			var pDestBox: IBox = new geometry.Box(0, 0, 0, iWidth, iHeight, this._iDepth);
			
			return this.blitFromTexture(this, pSrcBox, pDestBox);
		}

	}
}

#endif
