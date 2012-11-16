#ifndef IHARDWARETEXTURE_TS
#define IHARDWARETEXTURE_TS

#include "IHardwareObject.ts"

module akra {

	export enum ETextureFilters {
	    NEAREST = 0x2600,
	    LINEAR = 0x2601,
	    NEAREST_MIPMAP_NEAREST = 0x2700,
	    LINEAR_MIPMAP_NEAREST = 0x2701,
	    NEAREST_MIPMAP_LINEAR = 0x2702,
	    LINEAR_MIPMAP_LINEAR = 0x2703
	};

	export enum ETextureWrapModes {
	    REPEAT = 0x2901,
	    CLAMP_TO_EDGE = 0x812F,
	    MIRRORED_REPEAT = 0x8370
	};

	export enum ETextureParameters {
	    MAG_FILTER = 0x2800,
	    MIN_FILTER,
	    WRAP_S,
	    WRAP_T
	};

	export enum ETextureTypes {
	    TEXTURE_2D = 0x0DE1,
	    TEXTURE = 0x1702,
	    TEXTURE_CUBE_MAP = 0x8513,
	    TEXTURE_BINDING_CUBE_MAP = 0x8514,
	    TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
	    TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
	    TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
	    TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
	    TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
	    TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A,
	    MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C
	};

	export enum ETextureUnits {
	    TEXTURE = 0x84C0
	};

	export interface IHardwareTexture extends IHardwareObject {
		/* similar to: 
		 * void bindTexture(int target, WebGLTexture? texture) 
		 */
		signal activate();
		signal deactivate();

		image2D(target: int, level: int, internalformat: int, width: uint, height: uint, border: int, format: int, type: int, pixels?: ArrayBufferView): void;
		image2D(target: int, level: int, internalformat: int, format: int, type: int, pixels: ImageData): void;
		image2D(target: int, level: int, internalformat: int, format: int, type: int, image: HTMLImageElement): void;
		image2D(target: int, level: int, internalformat: int, format: int, type: int, canvas: HTMLCanvasElement): void;
		image2D(target: int, level: int, internalformat: int, format: int, type: int, video: HTMLVideoElement): void;

		subImage2D(target: int, level: int, xoffset: uint, yoffset: uint, width: uint, height: uint, format: int, type: int, pixels?: ArrayBufferView): void;
		subImage2D(target: int, level: int, xoffset: uint, yoffset: uint, format: int, type: int, pixels?: ImageData): void;
		subImage2D(target: int, level: int, xoffset: uint, yoffset: uint, format: int, type: int, pixels?: HTMLImageElement): void;
		subImage2D(target: int, level: int, xoffset: uint, yoffset: uint, format: int, type: int, pixels?: HTMLCanvasElement): void;
		subImage2D(target: int, level: int, xoffset: uint, yoffset: uint, format: int, type: int, pixels?: HTMLVideoElement): void;


		compressedImage2D(level: int, internalformat: int, width: uint, height: uint, border: int, pixels: ArrayBufferView): void;
		compressedSubImage2D(level: int, xoffset: int, yoffset: int, width: uint, height: uint, format: int, pixels: ArrayBufferView): void;

		generateMipmap(): void;
		
		getParameter(eParam: int): any;
		setParameter(eParam: int, eValue: int): void;
		//setParameter(eParam: int, eValue: float): void;
		
	}

}

#endif

