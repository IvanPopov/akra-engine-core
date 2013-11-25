/// <reference path="ICodec.ts" />
/// <reference path="EPixelFormats.ts" />

module akra {
	interface IImgCodec extends ICodec{
	}
	
	interface IImgData extends ICodecData{
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
