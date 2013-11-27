/// <reference path="../idl/AIImgCodec.ts" />
/// <reference path="../idl/AEPixelFormats.ts" />

import Codec = require("pixelUtil/Codec");

class ImgCodec extends Codec implements AIImgCodec {
    getDataType(): string {
		return "ImgData"
	}
}

export = ImgCodec;