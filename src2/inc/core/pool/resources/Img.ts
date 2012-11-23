#ifndef IMG_TS
#define IMG_TS

#include "IImg.ts"
#include "../ResourcePoolItem.ts"

module akra {
	componentsPerPixel = function (eFormat: EImageFormats): uint {
		switch (eFormat) {
	        case RGB8:
	        case BGR8:
	        case RGB565:
	        case BGR565:
	        case RGB_DXT1:
	        case RGB: 
	        	return 3;

	        case RGBA8:
	        case BGRA8:
	        case RGBA4:
	        case BGRA4:
	        case RGBA_DXT1:
	        case RGBA_DXT2:
	        case RGBA_DXT3:
	        case RGBA_DXT4:
	        case RGBA_DXT5:
	        case RGB5_A1:
	        case BGR5_A1:
	        case RGBA: 
	        	return 4;

	        case DEPTH_COMPONENT:
	        case ALPHA:
	        case LUMINANCE:
	        case LUMINANCE_ALPHA:
	        	return 1;
		}

		return 0;
	}

	bitsPerPixel = function (eFormat: EImageFormats): uint {
		switch (eFormat) {
	        case RGB8:
	        case BGR8:
	        case RGB: 
	        	return 24;
	        case RGB565:
	        case BGR565:
	        	return 16;
	        case RGB_DXT1:
	        	return 12;

	        case RGBA: 
	        case RGBA8:
	        case BGRA8:
	        	return 32
	        case RGBA4:
	        case BGRA4:
	        	return 16;
	        case RGBA_DXT1:
	        	return 13;

	        case RGBA_DXT2:
	        	return 32;
	        case RGBA_DXT3:
	        	return 32;
	        case RGBA_DXT4:
	        	return 32;
	        case RGBA_DXT5:
	        	return 32;
	        case RGB5_A1:
	        case BGR5_A1:
	        	return 16;
	        	
	        case DEPTH_COMPONENT:
	        case ALPHA:
	        case LUMINANCE:
	        case LUMINANCE_ALPHA:
	        	return 8;
		}

		return 0;
	}
}

module akra.core.pool.resources {
		
	export class Img extends ResourcePoolItem implements IImg {

	}
}

#endif
