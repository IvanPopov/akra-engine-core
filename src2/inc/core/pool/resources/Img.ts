#ifndef IMG_TS
#define IMG_TS

#include "IImg.ts"


#include "io/files.ts"
#include "pixelUtil/ImgCodec.ts"
#include "util/Pathinfo.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
		
	export class Img extends ResourcePoolItem implements IImg {
		protected _iWidth:        uint          = 0;
		protected _iHeight:       uint          = 0;
		protected _iDepth:        uint          = 0;

		protected _nMipMaps:      uint          = 0;
		protected _iFlags:        uint          = 0;
        protected _iCubeFlags:    uint          = 0;

		protected _eFormat:       EPixelFormats = EPixelFormats.UNKNOWN;

		protected _pBuffer:       Uint8Array    = null;

        inline get byteLength(): uint {
			return this._pBuffer.buffer.byteLength;
		}
    	
    	inline get width(): uint {
    		return this._iWidth;
    	}

    	inline get height(): uint {
    		return this._iHeight;
    	}

    	inline get depth(): uint {
    		return this._iDepth;
    	}

    	inline get numFaces():uint{
            if (this._iFlags&EImageFlags.CUBEMAP)
            {
                var nFace:uint=0;
                for(var i:uint=0;i<6;i++)
                {
                    if(this._iCubeFlags&(1<<i))
                    {
                        nFace++;
                        
                    }

                }
                return nFace;
            }
            else
            {
                return 1;
            }
        }

    	inline get numMipMaps(): uint {
    		return this._nMipMaps;
    	}

    	inline get format(): EPixelFormats {
    		return this._eFormat;
    	}

         inline get flags(): uint {
            return this._iFlags;
        }

        inline get cubeFlags(): uint {
            return this._iCubeFlags;
        }

		constructor () {
			super();
		}

		createResource(): bool {
			// innitialize the resource (called once)
		    debug_assert(!this.isResourceCreated(),
		                 "The resource has already been created.");

		    // signal that the resource is now created,
		    // but has not been enabled
		    this.notifyCreated();
		    this.notifyDisabled();

		    return true;
		}

		destroyResource(): bool {
			// destroy the resource
		    //
		    // we permit redundant calls to destroy, so there are no asserts here
		    //
		    if (this.isResourceCreated()) {
		        // disable the resource
		        this.disableResource();

		        this.freeMemory();

		        this.notifyUnloaded();
		        this.notifyDestroyed();

		        return (true);
		    }

		    return (false);
		}

		restoreResource(): bool {
			debug_assert(this.isResourceCreated(),
		                 "The resource has not been created.");

		    this.notifyRestored();
		    return true;
		}

		disableResource(): bool {
			debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

		    this.notifyDisabled();
		    return true;
		}

		loadResource(sFilename?: string): bool {
			return !isNull(this.load(sFilename));
		}

		saveResource(sFilename?: string): bool {
			return false;
		}


		create(iWidth: uint, iHeight: uint, iDepth?: uint = 1, eFormat?: EPixelFormats = EPixelFormats.BYTE_RGBA, 
                         nFaces?: uint = 1, nMipMaps?: uint = 0): IImg 
        {
            var iSize : uint= Img.calculateSize(nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat);            
            var pBuffer : Uint8Array = new Uint8Array(iSize);
            return this.loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
        }
    	


    	freeMemory(): void {
    		this._iWidth = 0;
    		this._iHeight = 0;
    		this._iDepth = 0;
    		this._pBuffer = null;
    	}

    	set(pSrc: IImg): IImg {
    		this.freeMemory();

    		this._iWidth = pSrc.width;
    		this._iHeight = pSrc.height;
    		this._iDepth = pSrc.depth;
    		this._eFormat = pSrc.format;

    		this._iFlags = pSrc.flags;

    		this._nMipMaps = pSrc.numMipMaps;

    		this._pBuffer = new Uint8Array(pSrc.getData());

    		return this;
    	} 


    	flipY(pDest?: IImg): IImg {
    		return this;
    	}

    	flipX(pDest?: IImg): IImg {
    		return this;
    	}

        load(sFileName: string,  fnCallBack?: Function): IImg;
        load(pData: Uint8Array, sType:string,  fnCallBack?: Function): IImg;
        load(pCanvas: HTMLCanvasElement, fnCallBack?: Function): IImg;


    	load(pData: any, sType?: any, fnCallBack?: Function): IImg 
        {
            var pMe:IImg=this;

            if (pData instanceof HTMLCanvasElement) 
            {
                var pTempContext : CanvasRenderingContext2D = pData.getContext('2d');
                if (!pTempContext) 
                {
                    if (isDefAndNotNull(sType)) 
                    {
                        sType(false);
                    }
                    return this;
                }

                var pImageData : ImageData = pTempContext.getImageData(0, 0, pData.width, pData.height);               
                
                this.loadDynamicImage(new Uint8Array(pImageData.data.buffer.slice(0, pImageData.data.buffer.byteLength)),pData.width,pData.height);
            
                if (isDefAndNotNull(sType)) 
                {
                    sType(true);
                }
                return this;
            }
            else if (isString(pData))
            {
                var sExt : string = (new Pathinfo(pData)).ext;

                if(sExt=="png" || sExt=="jpg" || sExt=="jpeg" || sExt=="gif" || sExt=="bmp")
                {
                    var pImg:HTMLImageElement=new Image();

                    pImg.onload = function()
                    {
                        var pTempCanvas: HTMLCanvasElement=<HTMLCanvasElement>document.createElement("canvas");
                        pTempCanvas.width=pImg.width;
                        pTempCanvas.height=pImg.height;
                        var pTempContext : CanvasRenderingContext2D=<CanvasRenderingContext2D>((<any>pTempCanvas).getContext("2d"));                        
                        pTempContext.drawImage(pImg,0,0);
                        var pImageData : ImageData = pTempContext.getImageData(0, 0, pImg.width, pImg.height);               
                
                        pMe.loadDynamicImage(new Uint8Array(pImageData.data.buffer.slice(0, pImageData.data.buffer.byteLength)),pImg.width, pImg.height,1,EPixelFormats.BYTE_RGBA);

                        if (isDefAndNotNull(sType)) 
                        {
                            sType(true);
                        }

                    }
                    pImg.onerror=function()
                    {
                        if (isDefAndNotNull(sType)) 
                        {
                            sType(false);
                        }
                    }
                    pImg.onabort=function()
                    {
                        if (isDefAndNotNull(sType)) 
                        {
                            sType(false);
                        }
                    }
                    pImg.src = pData; 

                }
                else
                {
                    
                    io.fopen(pData,"rb").onread=function(pError:Error,pDataInFile:ArrayBuffer)
                    {
                        pMe.load(new Uint8Array(pDataInFile),sExt,sType);
                    }
                }

                return this;
            }
            else
            {
                var pCodec:ICodec=undefined;

                if(sType)
                {
                    pCodec=Codec.getCodec(sType);
                }



                if(!pCodec)
                {
                    var iMagicLen:uint=Math.min(32,pData.buffer.byteLength);
                    pCodec=Codec.getCodec(pData.subarray(0, iMagicLen));
                }

                if(!pCodec)
                {
                    CRITICAL_ERROR("Unable to load image: Image format is unknown. Unable to identify codec. Check it or specify format explicitly.\n"+"Img.load");
                    if (fnCallBack)
                    {
                        fnCallBack(false);
                    }
                    return this;
                }

                

                var pImgData:IImgData=new ImgData();

             
                this._pBuffer=pCodec.decode(pData,pImgData);


                this._iWidth=pImgData.width;
                this._iHeight=pImgData.height;
                this._iDepth=pImgData.depth;
                this._nMipMaps=pImgData.numMipMaps;
                this._iFlags=pImgData.flags;
                this._iCubeFlags=pImgData.cubeFlags;

                //console.log(this._iCubeFlags.toString(16),this._iFlags.toString(16));

                this._eFormat=pImgData.format;

                this.notifyLoaded();
                
                if (fnCallBack)
                {
                    fnCallBack(true);
                }

                return this;
            }

    		
    	}

    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_RGB,
                         nFaces?: uint = 1, nMipMaps?: uint = 0): IImg 
    	{
            var iSize : uint= Img.calculateSize(nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat);
            
            if (iSize != pData.buffer.byteLength)
            {
                CRITICAL_ERROR("Stream size does not match calculated image size\n"+"Img.loadRawData");
            }

            var pBuffer : Uint8Array = new Uint8Array(iSize);

            pBuffer.set(pData);

            return this.loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
     	}

        loadDynamicImage(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth?: uint = 1,
                         eFormat?: EPixelFormats = EPixelFormats.BYTE_RGB, nFaces?: uint = 1, nMipMaps?: uint = 0): IImg 
        {
            //size
            this._iWidth=iWidth;
            this._iHeight=iHeight;
            this._iDepth=iDepth;

            this._eFormat=eFormat;
            this._nMipMaps=nMipMaps;
            this._iFlags=0;

            if (pixelUtil.isCompressed(this._eFormat))
            {
                this._iFlags |= EImageFlags.COMPRESSED;
            }
            if (this._iDepth != 1)
            {
                this._iFlags |= EImageFlags.TEXTURE_3D;
            }

            if(nFaces == 6)
            {
                this._iFlags |= EImageFlags.CUBEMAP;
            }

            if(nFaces != 6 && nFaces != 1)
            {
                CRITICAL_ERROR("Number of faces currently must be 6 or 1.\n"+"Img.loadDynamicImage");
            }

            this._pBuffer=pData;
            this.notifyLoaded();
            return this;
        }

    	convert(eFormat: EPixelFormats): bool {
    		return false;
    	}

    	//Gets the physical width in bytes of each row of pixels.
    	getRawSpan(): uint {
    		return this._iWidth*this.getPixelSize();
    	}

    	getBPP(): uint {
    		return this.getPixelSize()* 8;
    	}

        getPixelSize(): uint{
            return pixelUtil.getNumElemBytes(this._eFormat);
        }



    	getData(): Uint8Array {
    		return this._pBuffer;
    	}

    	hasFlag(eFlag: EImageFlags): bool
        {
    		if(this._iFlags & eFlag)
            {
                return true;
            }
            else
            {
                return false;
            }
    	}

    	hasAlpha(): bool {
    		return pixelUtil.hasAlpha(this._eFormat);
    	}

    	isCompressed(): bool {
    		return  pixelUtil.isCompressed(this._eFormat);
    	}

    	isLuminance(): bool {
    		return pixelUtil.isLuminance(this._eFormat);
    	}



    	getColorAt(pColor:IColor, x:uint, y: uint, z?:uint=0): IColor
        {
            var iStart:uint=this.getPixelSize()* (z * this._iWidth * this._iHeight + this._iWidth * y + x);
    		pixelUtil.unpackColour(pColor, this._eFormat, this._pBuffer.subarray(iStart,iStart+this.getPixelSize()));
            return pColor;
    	}

    	setColorAt(pColor: IColor, x: uint, y: uint, z?: uint=0): void 
        {
            var iStart:uint=this.getPixelSize()* (z * this._iWidth * this._iHeight + this._iWidth * y + x);
            pixelUtil.packColour(pColor, this._eFormat,this._pBuffer.subarray(iStart,iStart+this.getPixelSize()));
    	}

    	getPixels(iFace?: uint, iMipMap?: uint): IPixelBox 
        {

    		// Image data is arranged as:
            // face 0, top level (mip 0)
            // face 0, mip 1
            // face 0, mip 2
            // face 1, top level (mip 0)
            // face 1, mip 1
            // face 1, mip 2
            // etc

            if(iMipMap > this.numMipMaps){
                WARNING("Mipmap index out of range",iMipMap,this.numMipMaps);
                return null;
            }

            if(iFace >= this.numFaces){
                WARNING("Face index out of range",iFace,this.numFaces);
                return null;
            }
                
            // Calculate mipmap offset and size
            var pData:Uint8Array = this.getData();


            // Base offset is number of full faces
            var iWidth: uint = this._iWidth;
            var iHeight: uint = this._iHeight;
            var iDepth: uint = this._iDepth;


            // Figure out the offsets 
            var iFullFaceSize: uint = 0;
            var iFinalFaceSize: uint = 0;
            var iFinalWidth: uint = 0;
            var iFinalHeight: uint = 0 ;
            var iFinalDepth: uint = 0;
            var iMipSize:uint=0;
            var iOffset:uint = 0;

            for(var iMip:uint=0; iMip <= this.numMipMaps; ++iMip)
            {
                if (iMip == iMipMap)
                {
                    iFinalFaceSize = iFullFaceSize;
                    iFinalWidth = iWidth;
                    iFinalHeight = iHeight;
                    iFinalDepth = iDepth;
                    iMipSize = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this.format);
                }
                iFullFaceSize += pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this.format);

                /// Half size in each dimension
                if(iWidth!=1) iWidth /= 2;
                if(iHeight!=1) iHeight /= 2;
                if(iDepth!=1) iDepth /= 2;
            }
            // Advance pointer by number of full faces, plus mip offset into
            iOffset += iFace * iFullFaceSize;
            iOffset += iFinalFaceSize;

            // Return subface as pixelbox
            var pSrc:IPixelBox=new pixelUtil.PixelBox(iFinalWidth, iFinalHeight, iFinalDepth, this.format, pData.subarray(iOffset,iOffset+iMipSize));
            return pSrc;
    	}

    	scale(pDest: IPixelBox, eFilter?: EFilters): bool {
    		return null;
    	}

    	resize(iWidth: uint, iHeight: uint, eFilter?: EFilters): bool {
    		return null;
    	}

    	generatePerlinNoise(fScale: float, iOctaves: int, fFalloff: float): void {

    	}

    	randomChannelNoise(iChannel: int, iMinRange: int, iMaxRange: int): void {

    	}

        static calculateSize(nMipMaps: uint, nFaces: uint, iWidth: uint, iHeight: uint, iDepth: uint , eFormat: EPixelFormats): uint
        {
            var iSize:uint = 0;
            var iMip:uint = 0;

            for(iMip=0; iMip<=nMipMaps; iMip++)
            {
                iSize += pixelUtil.getMemorySize(iWidth, iHeight, iDepth, eFormat)*nFaces; 
                if(iWidth!=1) iWidth = Math.floor(iWidth/2);
                if(iHeight!=1) iHeight = Math.floor(iHeight/2);
                if(iDepth!=1) iDepth = Math.floor(iDepth/2);
            }
            return iSize;
        }

        static getMaxMipmaps(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats) : int 
        {
            var iCount: int = 0;
            if((iWidth > 0) && (iHeight > 0)) 
            {
                do {
                    if(iWidth>1)        
                    {
                        iWidth = iWidth>>>1;
                    }
                    if(iHeight>1)       
                    {
                        iHeight = iHeight>>>1;
                    }
                    if(iDepth>1)        
                    {
                        iDepth = iDepth>>>1;
                    }
                    /*
                     NOT needed, compressed formats will have mipmaps up to 1x1
                     if(PixelUtil::isValidExtent(width, height, depth, format))
                     count ++;
                     else
                     break;
                     */
                    
                    iCount ++;
                } while(!(iWidth === 1 && iHeight === 1 && iDepth === 1));
            }       
            return iCount;
        }
	}
}

#endif
