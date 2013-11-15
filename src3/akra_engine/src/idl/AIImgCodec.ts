// AIImgCodec interface
// [write description here...]

/// <reference path="AICodec.ts" />


module akra {


interface AIImgCodec extends AICodec{
}

interface IImgData extends AICodecData{
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
 
