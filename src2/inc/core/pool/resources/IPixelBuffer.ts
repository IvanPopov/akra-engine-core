#ifndef IPIXELBUFFER_TS
#define IPIXELBUFFER_TS

#include "IHardwareBuffer.ts"

module akra {

	export enum EPixelFormats {
        UNKNOWN = 0,
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

    export enum EPixelShortFormats {
        RGB = 0x1907,
        RGBA = 0x1908
    };

    export enum EPixelDataTypes {
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT_4_4_4_4 = 0x8033,
        UNSIGNED_SHORT_5_5_5_1 = 0x8034,
        UNSIGNED_SHORT_5_6_5 = 0x8363,
        FLOAT = 0x1406
    };

    export var componentsPerPixel: (eFormat: EPixelFormats) => uint;
    export var bitsPerPixel: (eFormat: EPixelFormats) => uint;

	export interface IPixelBuffer extends IHardwareBuffer {
		readonly width: uint;
		readonly height: uint;
		readonly depth: uint;

		readonly format: EPixelFormats;

		blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): bool;
		blit(pSource: IPixelBuffer);

		blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): bool;
		blitToMemory(pSrcBox: IBox, pDest?: IPixelBuffer): bool;

		getRenderTarget(): IRenderTarget;

		getPixels(pDstBox: IBox): IPixelBox;
	}
}

#endif