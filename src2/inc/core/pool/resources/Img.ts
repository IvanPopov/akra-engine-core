#ifndef IMG_TS
#define IMG_TS

#include "IImg.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
		
	export class Img extends ResourcePoolItem implements IImg {
		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;
		protected _iDepth: uint = 0;

		protected _nMipMaps: uint = 0;
		protected _iFlags: int = 0;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;

		protected _iPixelSize: uint;
		protected _pBuffer: Uint8Array = null;

		inline get byteLength(): uint {
			return 0;
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

    	inline get numFaces(): uint {
    		if (this.hasFlag(EImageFlags.CUBEMAP)) {
    			return 6;
    		}

    		return 1;
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

		create(iWidth: uint, iHeight: uint, eFormat: EPixelFormats, iFlags: int): bool;
    	create(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, iFlags: int): bool;
    	create(iWidth: uint, iHeight: uint, iDepth?: any, eFormat?: any, iFlags?: any): bool {
    		return false;
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

    	loadFromMemory(pData: Uint8Array, iWidth: uint, iHeight: uint, eFormat: EPixelFormats): bool;
    	loadFromMemory(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats): bool;
    	loadFromMemory(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: any, eFormat?: any): bool {
    		return false;
    	}

    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, eFormat: EPixelFormats, nFaces?: uint, nMipMaps?: uint): bool;
    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats, nFaces?: uint, nMipMaps?: uint): bool;
    	loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: any, eFormat?: any, nFaces?: any, nMipMaps?: any): bool {
    		return false;
    	}

        loadDynamicImage(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint,
                         eFormat: EPixelFormats, bAutoDelete?: bool = false, 
                         iNumFaces?: uint = 1, iNumMipMaps?: uint = 0): IImg {
            return null;
        }

    	load(sFilename: string): bool {
    		return false;
    	}

    	convert(eFormat: EPixelFormats): bool {
    		return false;
    	}

    	//Gets the physical width in bytes of each row of pixels.
    	getRawSpan(): uint {
    		return 0;
    	}

    	getBPP(): uint {
    		return 0;
    	}

    	getFlags(): int {
    		return 0;
    	}

    	getData(): Uint8Array {
    		return null;
    	}

    	hasFlag(eFlag: EImageFlags): bool {
    		return false;
    	}

    	hasAlpha(): bool {
    		return false;
    	}

    	isCompressed(): bool {
    		return false;
    	}

    	isLumiance(): bool {
    		return false;
    	}


    	getColorAt(pColor: IColor, x: uint, y: uint, z?:uint): IColor {
    		return null;
    	}

    	setColorAt(pColor: IColorValue, x: uint, y: uint, z: uint): void {

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
	}
}

#endif
