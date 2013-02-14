#ifndef IIMAGECODEC_TS
#define IIMAGECODEC_TS

#include "IImageCodec.ts"
#include "IImageData.ts"

module akra {


	export interface ImageCodec implements IImageCodec{
		getDataType(): String
        {
            return "ImageData"
        }

	}

	export interface ImageData implements IImageData{
		
        protected _iHeight:uint=0;
		protected _iWidth:uint=0;
		protected _iDepth:uint=1;
		protected _iSize:uint=0;
        protected _iCubeFlags:uint;

		protected _nNumMipMaps:uint=0;
		protected _iFlags:uint=0;

		protected _eFormat: EPixelFormat=UNKNOWN;


		inline get width(): uint {
			return this._iWidth;
		}
    	inline set width(iWidth:uint):{
			this._iWidth=iWidth;
		}


    	inline get height(): uint {
    		return this._iHeight;
    	}
    	inline set height(iHeight:uint):{
			this._iHeight=iHeight;
		}

    	inline get depth(): uint {
    		return this._iDepth;
    	}
    	inline set depth(iDepth:uint):{
			this._iDepth=iDepth;
		}


    	inline get size(): uint {
    		return = Img.calculateSize(this.numMipMaps, this.numFace, this.width, 
                this.height, this.depth, this.format);

    	inline get numMipMaps(): uint 
    	{
    		return this._nMipMaps;
    	}

    	inline set numMipMaps(nNumMipMaps:uint): {
    		this._nMipMaps=nNumMipMaps;
    	}

    	inline get format(): EPixelFormats {
    		return this._eFormat;
    	}

    	inline set format(ePixelFormat:EPixelFormats): {
    		this._eFormat=ePixelFormat;
    	}

        inline get flags(): uint {
            return this._iFlags;
        }

        inline set flags(iFlags:uint){
            this._iFlags=iFlags;
        }

        inline get cubeFlags(): uint {
            return this._iCubeFlags;
        }

        inline set cubeFlags(iFlags:uint){
            this._iCubeFlags=iFlags;
        }

        inline get numFace():uint{
            if (this._iFlags&CUBEMAP)
            {
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
        dataType():string:
        {
             return "ImageData"
        }
	}
}
	 

#endif