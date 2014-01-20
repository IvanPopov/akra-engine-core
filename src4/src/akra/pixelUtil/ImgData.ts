/// <reference path="../idl/IImgCodec.ts" />
/// <reference path="../idl/EPixelFormats.ts" />

/// <reference path="CodecData.ts" />
/// <reference path="../pool/resources/Img.ts" />

module akra.pixelUtil {
	import Img = pool.resources.Img;
	export class ImgData extends CodecData implements IImgData {

		protected _iHeight: uint = 0;
		protected _iWidth: uint = 0;
		protected _iDepth: uint = 1;
		protected _iSize: uint = 0;
		protected _iCubeFlags: uint;

		protected _nMipMaps: uint = 0;
		protected _iFlags: uint = 0;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;


		/**  */ get width(): uint {
			return this._iWidth;
		}
		/**  */ set width(iWidth: uint) {
			this._iWidth = iWidth;
		}


		/**  */ get height(): uint {
			return this._iHeight;
		}
		/**  */ set height(iHeight: uint) {
			this._iHeight = iHeight;
		}

		/**  */ get depth(): uint {
			return this._iDepth;
		}
		/**  */ set depth(iDepth: uint) {
			this._iDepth = iDepth;
		}


		/**  */ get size(): uint {
			return Img.calculateSize(this.numMipMaps, this.numFace, this.width, this.height, this.depth, this.format);
		}

		/**  */ get numMipMaps(): uint {
			return this._nMipMaps;
		}

		/**  */ set numMipMaps(nNumMipMaps: uint) {
			this._nMipMaps = nNumMipMaps;
		}

		/**  */ get format(): EPixelFormats {
			return this._eFormat;
		}

		/**  */ set format(ePixelFormat: EPixelFormats) {
			this._eFormat = ePixelFormat;
		}

		/**  */ get flags(): uint {
			return this._iFlags;
		}

		/**  */ set flags(iFlags: uint) {
			this._iFlags = iFlags;
		}

		/**  */ get cubeFlags(): uint {
			return this._iCubeFlags;
		}

		/**  */ set cubeFlags(iFlags: uint) {
			this._iCubeFlags = iFlags;
		}

		/**  */ get numFace(): uint {
			if (this._iFlags & EImageFlags.CUBEMAP) {
				var nFace: uint = 0;
				for (var i: uint = 0; i < 32; i++) {
					nFace++;
				}
				return nFace;
			}
			else {
				return 1;
			}
		}

		/**  */ get dataType(): string {
			return "ImgData";
		}
	}

}