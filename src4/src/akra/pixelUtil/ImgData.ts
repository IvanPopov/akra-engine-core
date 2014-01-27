/// <reference path="../idl/IImgCodec.ts" />
/// <reference path="../idl/EPixelFormats.ts" />

/// <reference path="CodecData.ts" />
/// <reference path="../pool/resources/Img.ts" />

module akra.pixelUtil {
	export class ImgData extends CodecData implements IImgData {

		protected _iHeight: uint = 0;
		protected _iWidth: uint = 0;
		protected _iDepth: uint = 1;
		protected _iSize: uint = 0;
		protected _iCubeFlags: uint;

		protected _nMipMaps: uint = 0;
		protected _iFlags: uint = 0;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;


		getWidth(): uint {
			return this._iWidth;
		}

		setWidth(iWidth: uint): void {
			this._iWidth = iWidth;
		}


		getHeight(): uint {
			return this._iHeight;
		}

		setHeight(iHeight: uint): void {
			this._iHeight = iHeight;
		}

		getDepth(): uint {
			return this._iDepth;
		}

		setDepth(iDepth: uint): void {
			this._iDepth = iDepth;
		}

		getNumMipMaps(): uint {
			return this._nMipMaps;
		}

		setNumMipMaps(nNumMipMaps: uint): void {
			this._nMipMaps = nNumMipMaps;
		}

		getFormat(): EPixelFormats {
			return this._eFormat;
		}

		setFormat(ePixelFormat: EPixelFormats): void {
			this._eFormat = ePixelFormat;
		}

		getFlags(): uint {
			return this._iFlags;
		}

		setFlags(iFlags: uint): void {
			this._iFlags = iFlags;
		}

		getCubeFlags(): uint {
			return this._iCubeFlags;
		}

		setCubeFlags(iFlags: uint): void {
			this._iCubeFlags = iFlags;
		}

		getSize(): uint {
			return pool.resources.Img.calculateSize(this.getNumMipMaps(), this.getNumFace(), this.getWidth(), this.getHeight(), this.getDepth(), this.getFormat());
		}

		getNumFace(): uint {
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

		getDataType(): string {
			return "ImgData";
		}
	}

}