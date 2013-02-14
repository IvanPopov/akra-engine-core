#ifndef IMG_TS
#define IMG_TS

#include "IImg.ts"
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

    	inline get numFace():uint{
            if (this._iFlags&CUBEMAP){
                var nFace:uint=0;
                for(var i:uint=0;i<32;i++)
                {
                    nFace++;
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
			return false;
		}

		saveResource(sFilename?: string): bool {
			return false;
		}


		create(iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_RGBA, bAutoDelete?: bool = false, 
                         nFaces?: uint = 1, nMipMaps?: uint = 0): IImg 
        {
            var iSize : uint= this.calculateSize(nNumMipMaps, nNumFaces, iWidth, iHeight, iDepth, eFormat);            
            var pBuffer : Uint8Array = new Uint8Array(iSize);
            return loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, true, nFaces, nMipMaps);
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

    		this._iFlags = pSrc.getFlags();
    		this._iPixelSize = math.ceil(pSrc.getBPP() / 8);

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

        load(pCanvas: HTMLCanvasElement, fnCallBack: function): IImg;
        load(sFileName: string, fnCallBack: function): IImg;
        load(pData: Uint8Array, sType:string,  fnCallBack: function): IImg;

    	load(pData: any, sType: any, fnCallBack: function): IImg 
        {
            var pMe:IImg=this;
            if (pData instanceof HTMLCanvasElement) 
            {
                var pTempContext : CanvasRenderingContext2D = pData.getContext('2d');
                if (!pTempContext) 
                {
                    if (sType) 
                    {
                        sType(false);
                    }
                    return this;
                }

                var pImageData : ImageData = pTempContext.getImageData(0, 0, pData.heigh, pData.heigh);               
                
                this.loadDynamicImage(pImageData.data.buffer.slice(0, pImageData.data.buffer.byteLength),sFileName.width,sFileName.height,1,sFileName.height,EPixelFormats.BYTE_RGBA);
            
                if (sType) 
                {
                    sType(true);
                }
                return this;
            }
            else if (isString(pData))
            {

                var sExt : string = pathinfo(pData).ext
                fopen(pData,"rb").onread=function(pData)
                {
                    pMe.load(pData,sExt,sType)
                }

                return this;
            }
            else
            {
                var pCodec:Codec;

                if(sType)
                {
                    pCodec=Codec.getCodec(sType)
                }

                if(!pCodec)
                {
                    var iMagicLen:uint=Math.min(32,pData.buffer.byteLength)
                    pCodec=Codec.getCodec(pData.buffer.slice(0,iMagicLen)
                }

                if(!pCodec)
                {
                    CRITICAL_ERROR(,"Unable to load image: Image format is unknown. Unable to identify codec. Check it or specify format explicitly.\n"+"Img.load");
                    if (fnCallBack)
                    {
                        fnCallBack(false);
                    }
                    return this;
                }

                var pResult:DecodeResult=pCodec.decode(pData)

                var pImageData:IImageData=pResult.second.getPointer()

                this._iWidth=pImageData.width;
                this._iHeight=pImageData.height;
                this._iDepth=pImageData.depth;
                this._nMipMaps=pImageData.numMipMaps;
                this._iFlags=pImageData.flags;
                this._iCubeFlags=pImageData.cubeFlags;

                this._eFormat=pImageData.format;
                this._pBuffer=pImageData.first.getPtr()

                if (fnCallBack)
                {
                    fnCallBack(true);
                }

                return this;
            }

    		
    	}

    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_RGBA, bAutoDelete?: bool = false, 
                         nFaces?: uint = 1, nMipMaps?: uint = 0): IImg 
    	{
            var iSize : uint= this.calculateSize(nNumMipMaps, nNumFaces, iWidth, iHeight, iDepth, eFormat);
            
            if (iSize != pData.buffer.byteLength)
            {
                CRITICAL_ERROR(,"Stream size does not match calculated image size\n"+"Img.loadRawData");
            }

            var pBuffer : Uint8Array = new Uint8Array(iSize);
            pBuffer.set(pData);

            return loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, true, nFaces, nMipMaps);
     	}

        loadDynamicImage(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1,
                         eFormat: EPixelFormats = EPixelFormats.BYTE_RGBA, bAutoDelete?: bool = false, 
                         nNumFaces?: uint = 1, nNumMipMaps?: uint = 0): IImg 
        {
            //size
            this._iWidth=iWidth;
            this._iHeight=iHeight;
            this._iDepth=iDepth;

            this._eFormat=eFormat;
            this._nMipMaps=nNumMipMaps;
            this._iFlags=0;

            if (PixelUtil.isCompressed(this._eFormat))
            {
                this._iFlags |= EImageFlags.COMPRESSED;
            }
            if (this._iDepth != 1)
            {
                this._iFlags |= EImageFlags.TEXTURE_3D;
            }

            if(nNumFaces == 6)
            {
                this._iFlags |= EImageFlags.CUBEMAP;
            }
            else if(nNumFaces != 6 && numFaces != 1)
            {
                CRITICAL_ERROR(, "Number of faces currently must be 6 or 1.\n"+"Img.loadDynamicImage");
            }

            this._pBuffer=pData;
            this._bAutoDelete=bAutoDelete

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

        getPixelSize: uint{
            return PixelUtil.getNumElemBytes(this._eFormat);
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
    		return PixelUtil.hasAlpha(this._eFormat);
    	}

    	isCompressed(): bool {
    		return return PixelUtil.isCompressed(this._eFormat);
    	}

    	isLumiance(): bool {
    		return return PixelUtil.isLumiance(this._eFormat);
    	}


    	getColorAt(x: uint, y: uint, z?:uint): IColor
        {
    		var pRval: ColourValue;
            PixelUtil.unpackColour(pRval, this._eFormat, this._pBuffer.subarray(this.getPixelSize()* (z * this.iWidth * this.iHeight + this.iWidth * y + x),this.getPixelSize());
            return pRval;
    	}

    	setColorAt(pColor: IColorValue, x: uint, y: uint, z: uint): void 
        {
             PixelUtil.packColour(pColor, this._eFormat,this._pBuffer.subarray(this.getPixelSize()* (z * this.iWidth * this.iHeight + this.iWidth * y + x),this.getPixelSize()))
    	}

    	getPixels(nFace?: uint, iMipMap?: uint): IPixelBox {
    		return null;
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

        static calculatedSize(nMipMaps: uint, nFaces: uint, iWidth: uint, iHeight: uint, iDepth: uint , eFormat: EPixelFormats): uint
        {
            var iSize:uint = 0;
            var iMip:uint = 0;

            for(iMip=0; iMip<=nMipMaps; iMip++)
            {
                iSize += PixelUtil.getMemorySize(iWidth, iHeight, iDepth, EPixelFormats)*nFaces; 
                if(iWidth!=1) iWidth = Math.floor(iWidth/2);
                if(iHeight!=1) iHeight = Math.floor(iHeight/2);
                if(iDepth!=1) iDepth = Math.floor(iDepth/2);
            }
            return iSize;
        }
	}
}

#endif
