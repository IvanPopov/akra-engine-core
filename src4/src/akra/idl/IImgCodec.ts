/// <reference path="ICodec.ts" />
/// <reference path="EPixelFormats.ts" />

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
