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
		
        protected _iHeight:uint;
		protected _iWidth:uint;
		protected _iDepth:uint;
		protected _iSize:uint;
        protected _iCubeFlags:uint;

		protected _nNumMipMaps:uint;
		protected _iFlags:uint;

		protected _eFormat: EPixelFormat;


        constructor ()
        {
            this.height=0;
            this.width=0;
            this.depth=1;
            this.size=0;
            this.numMipMaps=0;
            this.flags=0;
            this.format=UNKNOWN;
        }

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
    		return this._iSize;
    	}
    	inline set size(iSize:uint): {
    		this._iSize=iSize;
    	}

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

        dataType():string:
        {
             return "ImageData"
        }
	}
}
	 

#endif