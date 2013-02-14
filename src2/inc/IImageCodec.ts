#ifndef IIMAGECODEC_TS
#define IIMAGECODEC_TS

#include "ICodec.ts"
#include "IPixelFormat"

module akra {


	export interface IImageCodec extends Codec{
		getDataType(): String;

	}

	export interface IImageData extends CodecData{
		height: uint;
		width:uint;
		depth:uint;
		size:uint;

		numMipMaps:ushort;
		flags: uint;
		cubeFlags:uint;

		format: ePixelFormat;
		numFace: uint;

	}
}
	 

#endif