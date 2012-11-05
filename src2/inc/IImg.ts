#ifndef IIMG_TS
#define IIMG_TS

#include "IResourcePoolItem.ts"

module akra {
	 export enum EImageFormats {
        RGB = 0x1907,
        RGB8 = 0x1907,
        BGR8 = 0x8060,
        RGBA = 0x1908,
        RGBA8 = 0x1908,
        BGRA8 = 0x1909,
        RGBA4 = 0x8056,
        BGRA4 = 0x8059,
        RGB5_A1 = 0x8057,
        BGR5_A1 = 0x8058,
        RGB565 = 0x8D62,
        BGR565 = 0x8D63,
        RGB_DXT1 = 0x83F0,
        RGBA_DXT1 = 0x83F1,
        RGBA_DXT2 = 0x83F4,
        RGBA_DXT3 = 0x83F2,
        RGBA_DXT4 = 0x83F5,
        RGBA_DXT5 = 0x83F3,

        DEPTH_COMPONENT = 0x1902,
        ALPHA = 0x1906,
        LUMINANCE = 0x1909,
        LUMINANCE_ALPHA = 0x190A
    };

    export enum EImageShortFormats {
        RGB = 0x1907,
        RGBA = 0x1908
    };

    export enum EImageTypes {
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT_4_4_4_4 = 0x8033,
        UNSIGNED_SHORT_5_5_5_1 = 0x8034,
        UNSIGNED_SHORT_5_6_5 = 0x8363,
        FLOAT = 0x1406
    };

    export interface IImg extends IResourcePoolItem {
    	
    }

}

#endif