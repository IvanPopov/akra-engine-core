#ifndef WEBGL_INTERNAL_TEXTURE_TS
#define WEBGL_INTERNAL_TEXTURE_TS


#include "core/pool/resources/Texture.ts"
#include "IPixelBuffer.ts"
#include "webgl/webgl.ts"
#include "IRenderer.ts"
#include "IResourcePool.ts"
#include "math/math.ts"
#include "webgl/WebGLTextureBuffer.ts"
#include "IColor.ts"

module akra.webgl {
	export class WebGLInternalTexture extends core.pool.resources.Texture {
		private _pSurfaceList: WebGLTextureBuffer[] = null;	
		private _pWebGLTexture: WebGLTexture = null;

		constructor () {
            super();
        }

        private _getWebGLTextureTarget(): int {
        	switch(this._eTextureType) {
        		case ETextureTypes.TEXTURE_2D:
        			return GL_TEXTURE_2D;
        		case ETextureTypes.TEXTURE_CUBE_MAP:
        			return GL_TEXTURE_CUBE_MAP;
        		default:
        			return 0;
        	}
        }	

        private _getWebGLTextureParameter(eParam: ETextureParameters):uint
        {
        	switch(eParam) {
        		case ETextureParameters.MAG_FILTER:
        			return GL_TEXTURE_MAG_FILTER;
        		case ETextureParameters.MIN_FILTER:
        			return GL_TEXTURE_MIN_FILTER;
        		case ETextureParameters.WRAP_S:
        			return GL_TEXTURE_WRAP_S;
        		case ETextureParameters.WRAP_T:
        			return GL_TEXTURE_WRAP_T;
        		default:
        			return 0;
        	}
        }


        private _getWebGLTextureParameterValue(eValue: ETextureFilters):uint;
        private _getWebGLTextureParameterValue(eValue: ETextureWrapModes):uint;
        private _getWebGLTextureParameterValue(eValue: any):uint
        {
        	switch(eValue) {
        		case ETextureFilters.NEAREST:
        			return GL_NEAREST;
        		case ETextureFilters.LINEAR:
        			return GL_LINEAR;
        		case ETextureFilters.NEAREST_MIPMAP_NEAREST:
        			return GL_NEAREST_MIPMAP_NEAREST;
        		case ETextureFilters.LINEAR_MIPMAP_NEAREST:
        			return GL_LINEAR_MIPMAP_NEAREST;
        		case ETextureFilters.NEAREST_MIPMAP_LINEAR:
        			return GL_NEAREST_MIPMAP_LINEAR;
        		case ETextureFilters.LINEAR_MIPMAP_LINEAR:
        			return GL_LINEAR_MIPMAP_LINEAR;


        		case ETextureWrapModes.REPEAT:
        			return GL_REPEAT;
        		case ETextureWrapModes.CLAMP_TO_EDGE:
        			return GL_CLAMP_TO_EDGE;
        		case ETextureWrapModes.MIRRORED_REPEAT:
        			return GL_MIRRORED_REPEAT;
        		default:
        			return 0;
        	}
        }




        protected _setFilterInternalTexture(eParam: ETextureParameters, eValue: ETextureFilters): bool{
             if (!this.isValid()) {
                return false;
            }
            var iWebGLTarget: int = this._getWebGLTextureTarget();
            var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
            var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
            pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
            pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(eParam), this._getWebGLTextureParameterValue(eValue));
            return true;         
        }
        protected _setWrapModeInternalTexture(eParam: ETextureParameters, eValue: ETextureWrapModes): bool{
             if (!this.isValid()) {
                return false;
            }
            var iWebGLTarget: int = this._getWebGLTextureTarget();
            var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
            var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
            pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
            pWebGLContext.texParameteri(iWebGLTarget, this._getWebGLTextureParameter(eParam), this._getWebGLTextureParameterValue(eValue));
            return true;           
        }

        protected _getFilterInternalTexture(eParam: ETextureParameters): ETextureFilters{
            if (!this.isValid()) {
                return 0;
            }
            var iWebGLTarget: int = this._getWebGLTextureTarget();
            var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
            var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
            pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
            return pWebGLContext.getTexParameter(iWebGLTarget, this._getWebGLTextureParameter(eParam));           
        }

        protected _getWrapModeInternalTexture(eParam: ETextureParameters): ETextureWrapModes{
            if (!this.isValid()) {
                return 0;
            }
            var iWebGLTarget: int = this._getWebGLTextureTarget();
            var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
            var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
            pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);
            return pWebGLContext.getTexParameter(iWebGLTarget, this._getWebGLTextureParameter(eParam));         
        }
      

        protected _createInternalTextureImpl(cFillColor?: IColor = null): bool 
        {
        	if(!isNull(cFillColor))
        	{
        		WARNING("Texture can create with filled only by default(black) color");
        		//TODO: must implement filling by color
        	}

            
        	var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>this.getManager().getEngine().getRenderer();
            
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

            
            if(this._eTextureType==ETextureTypes.TEXTURE_2D)
            {
                if(this._iWidth>webgl.maxTextureSize)
                {
                	WARNING("Заданная ширина не поддерживается("+this._iWidth+")");
                	this._iWidth=webgl.maxTextureSize;
                }   
                if(this._iHeight>webgl.maxTextureSize)            
                {
                    WARNING("Заданная высота не поддерживается("+this._iHeight+")");
                    this._iHeight=webgl.maxTextureSize;

                }
            }
            else if( this._eTextureType==ETextureTypes.TEXTURE_CUBE_MAP)
            {
                if(this._iWidth>webgl.maxCubeMapTextureSize)
                {
                	WARNING("Заданная ширина не поддерживается("+this._iWidth+")");
                	this._iWidth=webgl.maxCubeMapTextureSize;
                }   
                if(this._iHeight>webgl.maxCubeMapTextureSize)            
                {
                    WARNING("Заданная высота не поддерживается("+this._iHeight+")");
                    this._iHeight=webgl.maxCubeMapTextureSize;

                }
            }
           
            if(this._iWidth==0)
            {
            	WARNING("Заданная ширина не поддерживается("+this._iWidth+")");
                this._iWidth=1;
  
            }
            if(this._iHeight==0)            
            {
                WARNING("Заданная высота не поддерживается("+this._iHeight+")");
                this._iHeight=1;
            }            
            if(this._iDepth!=1)
            {
            	this._iDepth=1;
                WARNING("Трехмерные текстуры не поддерживаются, сброс глубины в 1");
            }
            if(this._nMipLevels!=0 && !webgl.hasExtension(EXT_TEXTURE_NPOT_2D_MIPMAP) &&(!math.isPowerOfTwo(this._iDepth)||!math.isPowerOfTwo(this._iHeight)||!math.isPowerOfTwo(this._iWidth)))
            {
                WARNING("Мип мапы у текстуры не стпени двойки не поддерживаются, сброс мипмапов в 0");
                this._nMipLevels=0;
                CLEAR_ALL(this._iFlags, ETextureFlags.AUTOMIPMAP);
            }
            
            if(!webgl.isWebGLFormatSupport(this._eFormat))
            {
                WARNING("Данный тип текстуры не поддерживается");
                this._eFormat=EPixelFormats.A8B8G8R8;
            }

            
            if (this._nMipLevels!=0 && this._nMipLevels!=akra.core.pool.resources.Img.getMaxMipmaps(this._iWidth, this._iHeight, this._iDepth, this._eFormat)) 
            {
                WARNING("Нехватает мипмапов, сброс в 0");
                this._nMipLevels=0;
            }

            
        	// Convert to nearest power-of-two size if required
	        //this._iWidth = math.ceilingPowerOfTwo(this._iWidth);
	        //this._iHeight = math.ceilingPowerOfTwo(this._iHeight);
	        //this._iDepth = math.ceilingPowerOfTwo(this._iDepth);

			
            var iWebGLTarget: int = this._getWebGLTextureTarget();

	        this._pWebGLTexture = pWebGLRenderer.createWebGLTexture();
            
	        pWebGLRenderer.bindWebGLTexture(iWebGLTarget, this._pWebGLTexture);

	        this._isMipmapsHardwareGenerated = pWebGLRenderer.hasCapability(ERenderCapabilities.AUTOMIPMAP);

	        // Set some misc default parameters, these can of course be changed later
	        this.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.NEAREST);
	        this.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.NEAREST);
	        this.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
	        this.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);

	        var iWebGLFormat: int = webgl.getWebGLFormat(this._eFormat);
	        var iWebGLDataType: int = webgl.getWebGLDataType(this._eFormat);
	        var iWidth: uint = this._iWidth;
	        var iHeight: uint = this._iHeight;
	        var iDepth: uint = this._iDepth;

	        if (pixelUtil.isCompressed(this._eFormat)) 
	        {
	            // Compressed formats
	            var iSize: uint = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);

	            // Provide temporary buffer filled with zeroes as glCompressedTexImageXD does not
	            // accept a 0 pointer like normal glTexImageXD
	            // Run through this process for every mipmap to pregenerate mipmap pyramid
 	
 				
	            var pTmpData: Uint8Array = new Uint8Array(iSize);
	            var pEmptyData: Uint8Array;
	            var mip: uint = 0;

	            for (mip = 0; mip <= this._nMipLevels; mip++) {

	                iSize = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this._eFormat);
                    //console.log(iSize,iWidth, iHeight, iDepth, this._eFormat);
	                pEmptyData = pTmpData.subarray(0, iSize);
					switch(this._eTextureType)
                    {
                        
						case ETextureTypes.TEXTURE_2D:
	                        pWebGLContext.compressedTexImage2D(GL_TEXTURE_2D, mip, iWebGLFormat,
	                        								   iWidth, iHeight, 0, pEmptyData);
	                        break;
						case ETextureTypes.TEXTURE_CUBE_MAP:
							var iFace: uint = 0;
							for(iFace = 0; iFace < 6; iFace++) {
								pWebGLContext.compressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + iFace, mip, iWebGLFormat,
																   iWidth, iHeight, 0, pEmptyData);
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
						case ETextureTypes.TEXTURE_2D:
                            //console.log(mip,iWidth, iHeight);
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

	                if(iWidth > 1) iWidth = iWidth >>> 1;
	                if(iHeight > 1) iHeight = iHeight >>> 1;
	                if(iDepth > 1) iDepth = iDepth >>> 1;
	            }
	        }
	        this._createSurfaceList();

            return true;
        }

        protected freeInternalTextureImpl(): bool {
        	var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer.deleteWebGLTexture(this._pWebGLTexture);
			this._pWebGLTexture = null;

			for(var i: uint = 0; i < this._pSurfaceList.length; i++) {
				this._pSurfaceList[i].release();
			}

			this._pSurfaceList = null;

            return true;
        }

        private _createSurfaceList(): void {
        	this._pSurfaceList = new Array();

        	// For all faces and mipmaps, store surfaces as IPixelBuffer
        	var bWantGeneratedMips: bool = TEST_ANY(this._iFlags, ETextureFlags.AUTOMIPMAP);

        	// Do mipmapping in software? (uses GLU) For some cards, this is still needed. Of course,
        	// only when mipmap generation is desired.
        	var bDoSoftware: bool = bWantGeneratedMips && !this._isMipmapsHardwareGenerated && this._nMipLevels !== 0;

        	var iFace: uint = 0;
        	var mip: uint = 0;
        	var pTextureBufferPool: IResourcePool = this.getManager().textureBufferPool;
        	var sResourceName: string = this.findResourceName();

        	for(iFace = 0; iFace < this.getNumFaces(); iFace++) {
        		var iWidth: uint = this._iWidth;
        		var iHeight: uint = this._iHeight;



        		for(mip = 0; mip <= this._nMipLevels; mip++) {
        			var pBuf: WebGLTextureBuffer = <WebGLTextureBuffer>pTextureBufferPool.createResource(sResourceName + "_" + iFace + "_" + mip);
        			
                   
                    pBuf.create(this._getWebGLTextureTarget(),
        						this._pWebGLTexture,
        						iWidth, iHeight,
        						webgl.getClosestWebGLInternalFormat(this._eFormat),
        						webgl.getWebGLDataType(this._eFormat),
        						iFace,
        						mip,
        						this._iFlags,
        						bDoSoftware && mip === 0);	

        			this._pSurfaceList.push(pBuf);

        			//check error
        			if(pBuf.width === 0 ||
        			   pBuf.height === 0 ||
        			   pBuf.depth === 0) {
        				CRITICAL("Zero sized texture surface on texture " + sResourceName +
                            	 " face " + iFace +
                            	 " mipmap " + mip +
                            	 ". The GL driver probably refused to create the texture.");
        			}

        		}
        	}
        }

        getBuffer(iFace?: uint = 0, iMipmap?: uint = 0): IPixelBuffer {
            if (iFace >= this.getNumFaces()) {
	            CRITICAL("Face index out of range", iFace, this.getNumFaces());
	        }

	        if (iMipmap > this._nMipLevels) {
	            CRITICAL("Mipmap index out of range", iMipmap, this._nMipLevels);
	        }

	        var idx: uint = iFace * (this._nMipLevels + 1) + iMipmap;
	        ASSERT(idx < this._pSurfaceList.length,"smth");
	        
	        return this._pSurfaceList[idx];
        }


        createRenderTexture(): bool {
            // Create the GL texture
            // This already does everything necessary
            return this.createInternalTexture();
        }

	}
}

#endif
