#ifndef WEBGLINTERNALTEXTURE_TS
#define WEBGLINTERNALTEXTURE_TS

#include "core/pool/resources/Texture.ts"
#include "IPixelBuffer.ts"
#include "webgl/webgl.ts"
#include "IRenderer.ts"
#include "math/math.ts"

module akra.webgl {
	export class WebGLInternalTexture extends core.pool.resources.Texture {
		private _pSurfaceList: IPixelBuffer[] = null;	
		private _pWebGLTexture: WebGLTexture = null;

		constructor () {
            super();
        }

        getWebGLTextureTarget(): int {
        	switch(this._eTextureType){
        		case ETextureTypes.TEXTURE:
        		case ETextureTypes.TEXTURE_2D:
        			return GL_TEXTURE_2D;
        		case ETextureTypes.TEXTURE_CUBE_MAP:
        			return GL_TEXTURE_CUBE_MAP;
        		default:
        			return 0;
        	}
        }	

        protected createInternalTextureImpl(): bool {
        	var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

        	// Convert to nearest power-of-two size if required
	        this._iWidth = math.ceilingPowerOfTwo(this._iWidth);
	        this._iHeight = math.ceilingPowerOfTwo(this._iHeight);
	        this._iDepth = math.ceilingPowerOfTwo(this._iDepth);

			// Adjust format if required
	        this._eFormat = this.getNativeFormat(this._eTextureType, this._eFormat, this._iFlags);

			// Check requested number of mipmaps
	        var nMaxMips = webgl.getMaxMipmaps(this._iWidth, this._iHeight, this._iDepth, this._eFormat);

	        if(pixelUtil.isCompressed(this._eFormat) && (this._nMipLevels === 0)){
	            this._nRequestedMipLevels = 0;
	        }

	        this._nMipLevels = this._nRequestedMipLevels;

	        if (this._nMipLevels > nMaxMips) {
	            this._nMipLevels = nMaxMips;
	        }

	        var iWebGLTarget: int = this.getWebGLTextureTarget();

	        this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();
	        pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);

	        this._isMipmapsHardwareGenerated = pWebGLRenderer.hasCapability(ERenderCapabilities.AUTOMIPMAP);

	        // Set some misc default parameters, these can of course be changed later
	        pWebGLContext.texParameteri(iWebGLTarget,
	                        GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	        pWebGLContext.texParameteri(iWebGLTarget,
	                        GL_TEXTURE_MAG_FILTER, GL_NEAREST);
	        pWebGLContext.texParameteri(iWebGLTarget,
	                        GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	        pWebGLContext.texParameteri(iWebGLTarget,
	                        GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	        var iWebGLFormat: int = webgl.getClosestWebGLInternalFormat(this._eFormat);
	        var iWebGLDataType: int = webgl.getWebGLOriginDataType(this._eFormat);
	        var iWidth: uint = this._iWidth;
	        var iHeight: uint = this._iHeight;
	        var iDepth: uint = this._iDepth;

	        if (pixelUtil.isCompressed(this._eFormat)){
	            // Compressed formats
	            var iSize: uint = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);

	            // Provide temporary buffer filled with zeroes as glCompressedTexImageXD does not
	            // accept a 0 pointer like normal glTexImageXD
	            // Run through this process for every mipmap to pregenerate mipmap pyramid
 	
 				//TODO: можем мы можем подать просто null, надо проверить
	            var pTmpData: Uint8Array = new Uint8Array(iSize);
	            var pEmptyData: Uint8Array;
	            var mip: uint = 0;

	            for (mip = 0; mip <= this._nMipLevels; mip++) {
	                iSize = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);

	                pEmptyData = pTmpData.subarray(0, iSize);

					switch(this._eTextureType){
						case ETextureTypes.TEXTURE:
						case ETextureTypes.TEXTURE_2D:
	                        pWebGLContext.compressedTexImage2D(GL_TEXTURE_2D, mip, iWebGLFormat,
	                        								   iWidth, iHeight, 0, pTmpData);
	                        break;
						case ETextureTypes.TEXTURE_CUBE_MAP:
							var iFace: uint = 0;
							for(iFace = 0; iFace < 6; iFace++) {
								pWebGLContext.compressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + iFace, mip, iWebGLFormat,
																   iWidth, iHeight, 0, pTmpData);
							}
							break;
	                    default:
	                        break;
	                };

	                if(iWidth > 1) iWidth = iWidth / 2;
	                if(iHeight > 1) iHeight = iHeight / 2;
	                if(iDepth > 1) iDepth = iDepth / 2;

	            }
	            pTmpData = null;
	            pEmptyData = null;
	        }
	        else {
	        	var mip: uint = 0;
	            // Run through this process to pregenerate mipmap pyramid
	            for (mip = 0; mip <= this._nMipLevels; mip++) {
					// Normal formats
					switch(this._eTextureType){
						case ETextureTypes.TEXTURE:
						case ETextureTypes.TEXTURE_2D:
	                        pWebGLContext.texImage2D(GL_TEXTURE_2D, mip, iWebGLFormat,
	                                     			 iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
	                        break;
						case ETextureTypes.TEXTURE_CUBE_MAP:
							var iFace: uint = 0;
							for(iFace = 0; iFace < 6; iFace++) {
								pWebGLContext.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + iFace, mip, iWebGLFormat,
	                                     			 	 iWidth, iHeight, 0, iWebGLFormat, iWebGLDataType, null);
							}
							break;
	                    default:
	                        break;
	                }

	                if(iWidth > 1) iWidth = iWidth / 2;
	                if(iHeight > 1) iHeight = iHeight / 2;
	                if(iDepth > 1) iDepth = iDepth / 2;
	            }
	        }

	        this._createSurfaceList();

	        // Get final internal format
        	this._eFormat = this.getBuffer(0,0).format;

            return false;
        }

        _createSurfaceList(): void {

        }

        getNativeFormat(eTextureType?: ETextureTypes = this._eTextureType,
                        eFormat?: EPixelFormats = this._eFormat, 
                        iFlags?: int = this._iFlags): EPixelFormats {

        	var pRenderer: IRenderer = this.getManager().getEngine().getRenderer();

			if (pixelUtil.isCompressed(eFormat) &&
            	!pRenderer.hasCapability(ERenderCapabilities.TEXTURE_COMPRESSION_DXT) && 
            	!pRenderer.hasCapability(ERenderCapabilities.TEXTURE_COMPRESSION_PVRTC)) {

	            return EPixelFormats.A8R8G8B8;
	        }
	        // if floating point textures not supported, revert to PF_A8R8G8B8
	        if (pixelUtil.isFloatingPoint(eFormat) &&
	            pRenderer.hasCapability(ERenderCapabilities.TEXTURE_FLOAT)) {

	            return EPixelFormats.A8R8G8B8;
	        }

	        // Check if this is a valid rendertarget format
	        if (TEST_ANY(iFlags, ETextureFlags.RENDERTARGET)) {
	            /// Get closest supported alternative
	            /// If mFormat is supported it's returned
	            return webgl.getSupportedAlternative(eFormat);
	        }

	        // Supported
	        return eFormat;
        }

	}
}

#endif