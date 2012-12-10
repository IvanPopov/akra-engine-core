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
		protected _pTRTList: IRenderTexture[];


		constructor () {
			super();
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

		_getTarget(): int {
			return this._eTarget;
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
	    blitFromTexture(pSource: WebGLTextureBuffer, pSrcBox?: IBox, pDestBox?: IBox): bool {

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

	        pTempWebGLTexture = pWebGLContext.createTexture();

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

	        pWebGLContext.deleteTexture(pTempWebGLTexture);
	        pTempWebGLTexture = null;
	        pTempBoxTarget = null;

			return true;
		}

		getRenderTarget(): IRenderTarget;
		getRenderTarget(iZOffest: int): IRenderTarget;
		getRenderTarget(iZOffest?: int = 0): IRenderTarget {
			ASSERT(TEST_ANY(this._iFlags, ETextureFlags.RENDERTARGET));
        	ASSERT(iZOffest < this._iDepth);
        	return this._pTRTList[iZOffest];
		}

	}
}

#endif
