// AIImgCodec interface

/// <reference path="AICodec.ts" />
/// <reference path="AEPixelFormats.ts" />

interface AIImgCodec extends AICodec{
}

interface AIImgData extends AICodecData{
	height: uint;
	width:uint;
	depth:uint;
	size:uint;

	numMipMaps:uint;
	flags: uint;
	cubeFlags:uint;

	format: AEPixelFormats;
	numFace: uint;

}
