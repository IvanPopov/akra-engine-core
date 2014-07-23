/// <reference path="../idl/IImgCodec.ts" />
/// <reference path="../idl/EPixelFormats.ts" />
/// <reference path="Codec.ts" />

module akra.pixelUtil {
	export class ImgCodec extends Codec implements IImgCodec {
		getDataType(): string {
			return "ImgData"
		}
	}
}

