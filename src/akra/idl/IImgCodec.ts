/// <reference path="ICodec.ts" />
/// <reference path="EPixelFormats.ts" />

module akra {
	export interface IImgCodec extends ICodec {
	}

	export interface IImgData extends ICodecData {
		getHeight(): uint;
		setHeight(iHeight: uint): void;

		getWidth(): uint;
		setWidth(iWidth: uint): void;

		getDepth(): uint;
		setDepth(iDepth: uint): void;

		getNumMipMaps(): uint;
		setNumMipMaps(nMipMaps: uint): void;

		getFlags(): uint;
		setFlags(iFlags: uint): void;

		getCubeFlags(): uint;
		setCubeFlags(iFlags: uint): void;

		getFormat(): EPixelFormats;
		setFormat(eFormat: EPixelFormats): void;

		getSize(): uint;
		getNumFace(): uint;
	}

}
