#ifndef IIMGCODEC_TS
#define IIMGCODEC_TS

#include "ICodec.ts"
#include "PixelFormat.ts"

module akra {


	export interface IImgCodec extends ICodec{
	}

	export interface IImgData extends ICodecData{
		height: uint;
		width:uint;
		depth:uint;
		size:uint;

		numMipMaps:uint;
		flags: uint;
		cubeFlags:uint;

		format: EPixelFormats;
		numFace: uint;

	}
}
	 

#endif