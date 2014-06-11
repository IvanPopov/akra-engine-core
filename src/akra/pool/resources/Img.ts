/// <reference path="../../idl/IImg.ts" />
/// <reference path="../../idl/EPixelFormats.ts" />


/// <reference path="../../io/io.ts" />
/// <reference path="../../pixelUtil/ImgCodec.ts" />
/// <reference path="../../pixelUtil/ImgData.ts" />
/// <reference path="../../path/path.ts" />
/// <reference path="../ResourcePoolItem.ts" />

module akra.pool.resources {

	import Codec = pixelUtil.Codec;
	import ImgCodec = pixelUtil.ImgCodec;
	import ImgData = pixelUtil.ImgData;

	export class Img extends ResourcePoolItem implements IImg {
		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;
		protected _iDepth: uint = 0;

		protected _nMipMaps: uint = 0;
		protected _iFlags: uint = 0;
		protected _iCubeFlags: uint = 0;

		protected _eFormat: EPixelFormats = EPixelFormats.UNKNOWN;

		protected _pBuffer: Uint8Array = null;

		getByteLength(): uint {
			return this._pBuffer.buffer.byteLength;
		}

		getWidth(): uint {
			return this._iWidth;
		}

		getHeight(): uint {
			return this._iHeight;
		}

		getDepth(): uint {
			return this._iDepth;
		}

		getNumFaces(): uint {
			if (this._iFlags & EImageFlags.CUBEMAP) {
				var nFace: uint = 0;
				for (var i: uint = 0; i < 6; i++) {
					if (this._iCubeFlags & (1 << i)) {
						nFace++;

					}

				}
				return nFace;
			}
			else {
				return 1;
			}
		}

		getNumMipMaps(): uint {
			return this._nMipMaps;
		}

		getFormat(): EPixelFormats {
			return this._eFormat;
		}

		getFlags(): uint {
			return this._iFlags;
		}

		getCubeFlags(): uint {
			return this._iCubeFlags;
		}

		constructor() {
			super();
		}

		createResource(): boolean {
			// innitialize the resource (called once)
			debug.assert(!this.isResourceCreated(),
				"The resource has already been created.");

			// signal that the resource is now created,
			// but has not been enabled
			this.notifyCreated();
			this.notifyDisabled();

			return true;
		}

		destroyResource(): boolean {
			// destroy the resource
			//
			// we permit redundant calls to destroy, so there are no asserts here
			//
			if (this.isResourceCreated()) {
				// disable the resource
				this.disableResource();

				this.freeMemory();

				this.notifyUnloaded();
				this.notifyDestroyed();

				return (true);
			}

			return (false);
		}

		restoreResource(): boolean {
			debug.assert(this.isResourceCreated(),
				"The resource has not been created.");

			this.notifyRestored();
			return true;
		}

		disableResource(): boolean {
			debug.assert(this.isResourceCreated(),
				"The resource has not been created.");

			this.notifyDisabled();
			return true;
		}

		loadResource(sFilename?: string): boolean {
			return !isNull(this.load(sFilename));
		}

		saveResource(sFilename?: string): boolean {
			return false;
		}


		create(iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_RGBA,
			nFaces: uint = 1, nMipMaps: uint = 0): IImg {
			var iSize: uint = Img.calculateSize(nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat);
			var pBuffer: Uint8Array = new Uint8Array(iSize);
			return this.loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
		}



		freeMemory(): void {
			this._iWidth = 0;
			this._iHeight = 0;
			this._iDepth = 0;
			this._pBuffer = null;
		}

		set(pSrc: IImg): IImg {
			this.freeMemory();

			this._iWidth = pSrc.getWidth();
			this._iHeight = pSrc.getHeight();
			this._iDepth = pSrc.getDepth();
			this._eFormat = pSrc.getFormat();

			this._iFlags = pSrc.getFlags();

			this._nMipMaps = pSrc.getNumMipMaps();

			this._pBuffer = new Uint8Array(pSrc.getData());

			return this;
		}

		private loadImageWithInternalFormatFromURL(sPath: string, sExt: string, cb?: (e: Error) => void): void {
			Img.decodeImageWithInternalFormatFromURL(sPath, sExt,
				(e, pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats) => {
					if (e) {
						cb && cb(new Error("Could not decode image with internal format."));
						return;
					}

					this.loadDynamicImage(pData, iWidth, iHeight, 1, eFormat);

					cb && cb(null);
				})
		}

		//private loadCubemap(sPath: string, cb?: (e: Error) => void): void {
		//	io.fopen(sPath, EIO.JSON | EIO.IN).read((e: Error, pCubemap: ICubemap) => {
		//		var pSides: Uint8Array[] = new Array<Uint8Array>(6);

		//		Object.keys(pCubemap).forEach((sSidename: string) => {
		//			var pSide: IImg = this.getManager().loadImage(uri.resolve(pCubemap[sSidename], sPath));

		//			pSide.loaded.connect((pSide: IImg) => {

		//			});
		//		});
		//	});
		//}

		load(sFileName: string, cb?: (e: Error) => void): IImg;
		load(pData: Uint8Array, sType?: string, cb?: (e: Error) => void): IImg;
		load(pCanvas: HTMLCanvasElement, cb?: (e: Error) => void): IImg;
		load(): IImg {
			var cb: (e: Error) => void = null;
			var sFilename: string;
			var sExt: string;
			var pCanvas: HTMLCanvasElement;
			var pData: Uint8Array;

			//load from HTMLCanvasElement
			if (arguments[0] instanceof HTMLCanvasElement) {
				pCanvas = arguments[0];
				cb = arguments[1];

				var pTempContext: CanvasRenderingContext2D = pCanvas.getContext('2d');

				if (!pTempContext) {
					if (isDefAndNotNull(cb)) {
						cb(new Error("Could not create canvas rendering context 2D."));
					}

					return this;
				}

				var pImageData: ImageData = pTempContext.getImageData(0, 0, pCanvas.width, pCanvas.height);

				this.loadDynamicImage(new Uint8Array((<any>pImageData.data).buffer.slice(0, (<any>pImageData.data).buffer.byteLength)), pCanvas.width, pCanvas.height);

				if (isDefAndNotNull(cb)) {
					cb(null);
				}

				return this;
			}
			//load from URL
			else if (isString(arguments[0])) {
				sFilename = arguments[0];
				cb = arguments[1];
				sExt = path.parse(sFilename).getExt();

				if (!sExt) {
					//FIXME: move determImageExtension to Image codec

					//could not determ extension fron path
					info.determImageExtension(sFilename, (e: Error, pData: Uint8Array, sExt: string) => {
						if (e) return cb(e);
						this.load(pData, sExt, cb);
					});
				}
				else {
					if (Img.isInternalImageFormat(sExt)) {
						this.loadImageWithInternalFormatFromURL(sFilename, sExt, cb);
					}
					else {
						io.fopen(sFilename, "rb").read((e: Error, pData: ArrayBuffer): void => {
							if (e) return cb(e);
							this.load(new Uint8Array(pData), sExt, cb);
						});
					}
				}

				return this;
			}

			//load from data

			pData = arguments[0];
			sExt = arguments[1];
			cb = arguments[2];

			var pCodec: ICodec = null;

			if (Img.isInternalImageFormat(sExt)) {
				var sURL = conv.toURL(pData, 'image\/' + sExt);
				this.loadImageWithInternalFormatFromURL(sURL, sExt, cb);
				return this;
			}

			//check codec, if can
			if (sExt) {
				pCodec = Codec.getCodec(sExt);
			}

			//determ code from data
			if (!pCodec) {
				var iMagicLen: uint = Math.min(32, pData./*buffer.*/byteLength);
				pCodec = Codec.getCodec(pData.subarray(pData.byteOffset, iMagicLen));
			}

			if (!pCodec) {
				var e: Error = new Error("Unable to load image: Image format is unknown. Unable to identify codec. Check it or specify format explicitly.\n" + "Img.load")

					debug.critical(e);

				if (cb) {
					cb(e);
				}

				return this;
			}

			var pImgData: IImgData = new ImgData();

			this._pBuffer = pCodec.decode(pData, pImgData);

			this._iWidth = pImgData.getWidth();
			this._iHeight = pImgData.getHeight();
			this._iDepth = pImgData.getDepth();
			this._nMipMaps = pImgData.getNumMipMaps();
			this._iFlags = pImgData.getFlags();
			this._iCubeFlags = pImgData.getCubeFlags();

			this._eFormat = pImgData.getFormat();

			this.notifyLoaded();

			if (cb) {
				cb(null);
			}

			return this;
		}

		loadRawData(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1, eFormat: EPixelFormats = EPixelFormats.BYTE_RGB,
			nFaces: uint = 1, nMipMaps: uint = 0): IImg {
			var iSize: uint = Img.calculateSize(nMipMaps, nFaces, iWidth, iHeight, iDepth, eFormat);

			if (iSize != pData.buffer.byteLength) {
				logger.critical("Stream size does not match calculated image size\n" + "Img.loadRawData");
			}

			var pBuffer: Uint8Array = new Uint8Array(iSize);

			pBuffer.set(pData);

			return this.loadDynamicImage(pBuffer, iWidth, iHeight, iDepth, eFormat, nFaces, nMipMaps);
		}

		loadDynamicImage(pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint = 1,
			eFormat: EPixelFormats = EPixelFormats.BYTE_RGB, nFaces: uint = 1, nMipMaps: uint = 0): IImg {

			//size
			this._iWidth = iWidth;
			this._iHeight = iHeight;
			this._iDepth = iDepth;

			this._eFormat = eFormat;
			this._nMipMaps = nMipMaps;
			this._iFlags = 0;

			if (pixelUtil.isCompressed(this._eFormat)) {
				this._iFlags |= EImageFlags.COMPRESSED;
			}
			if (this._iDepth != 1) {
				this._iFlags |= EImageFlags.TEXTURE_3D;
			}

			if (nFaces == 6) {
				this._iFlags |= EImageFlags.CUBEMAP;
			}

			if (nFaces != 6 && nFaces != 1) {
				logger.critical("Number of faces currently must be 6 or 1.\n" + "Img.loadDynamicImage");
			}

			this._pBuffer = pData;
			this.notifyLoaded();
			return this;
		}

		convert(eFormat: EPixelFormats): boolean {
			return this.getFormat() == eFormat;
		}

		//Gets the physical width in bytes of each row of pixels.
		getRawSpan(): uint {
			return this._iWidth * this.getPixelSize();
		}

		getBPP(): uint {
			return this.getPixelSize() * 8;
		}

		getPixelSize(): uint {
			return pixelUtil.getNumElemBytes(this._eFormat);
		}



		getData(): Uint8Array {
			return this._pBuffer;
		}

		hasFlag(eFlag: EImageFlags): boolean {
			if (this._iFlags & eFlag) {
				return true;
			}
			else {
				return false;
			}
		}

		hasAlpha(): boolean {
			return pixelUtil.hasAlpha(this._eFormat);
		}

		isCompressed(): boolean {
			return pixelUtil.isCompressed(this._eFormat);
		}

		isLuminance(): boolean {
			return pixelUtil.isLuminance(this._eFormat);
		}



		getColorAt(pColor: IColor, x: uint, y: uint, z: uint= 0): IColor {
			var iStart: uint = this.getPixelSize() * (z * this._iWidth * this._iHeight + this._iWidth * y + x);
			pixelUtil.unpackColour(pColor, this._eFormat, this._pBuffer.subarray(iStart, iStart + this.getPixelSize()));
			return pColor;
		}

		setColorAt(pColor: IColor, x: uint, y: uint, z: uint= 0): void {
			var iStart: uint = this.getPixelSize() * (z * this._iWidth * this._iHeight + this._iWidth * y + x);
			pixelUtil.packColour(pColor, this._eFormat, this._pBuffer.subarray(iStart, iStart + this.getPixelSize()));
		}

		getPixels(iFace?: uint, iMipMap?: uint): IPixelBox {

			// Image data is arranged as:
			// face 0, top level (mip 0)
			// face 0, mip 1
			// face 0, mip 2
			// face 1, top level (mip 0)
			// face 1, mip 1
			// face 1, mip 2
			// etc

			if (iMipMap > this.getNumMipMaps()) {
				logger.warn("Mipmap index out of range", iMipMap, this.getNumMipMaps());
				return null;
			}

			if (iFace >= this.getNumFaces()) {
				logger.warn("Face index out of range", iFace, this.getNumFaces());
				return null;
			}

			// Calculate mipmap offset and size
			var pData: Uint8Array = this.getData();


			// Base offset is number of full faces
			var iWidth: uint = this._iWidth;
			var iHeight: uint = this._iHeight;
			var iDepth: uint = this._iDepth;


			// Figure out the offsets 
			var iFullFaceSize: uint = 0;
			var iFinalFaceSize: uint = 0;
			var iFinalWidth: uint = 0;
			var iFinalHeight: uint = 0;
			var iFinalDepth: uint = 0;
			var iMipSize: uint = 0;
			var iOffset: uint = 0;

			for (var iMip: uint = 0; iMip <= this.getNumMipMaps(); ++iMip) {
				if (iMip == iMipMap) {
					iFinalFaceSize = iFullFaceSize;
					iFinalWidth = iWidth;
					iFinalHeight = iHeight;
					iFinalDepth = iDepth;
					iMipSize = pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this.getFormat());
				}

				iFullFaceSize += pixelUtil.getMemorySize(iWidth, iHeight, iDepth, this.getFormat());

				/// Half size in each dimension
				if (iWidth != 1) iWidth /= 2;
				if (iHeight != 1) iHeight /= 2;
				if (iDepth != 1) iDepth /= 2;
			}

			// Advance pointer by number of full faces, plus mip offset into
			iOffset += iFace * iFullFaceSize;
			iOffset += iFinalFaceSize;

			// Return subface as pixelbox
			var pSrc: IPixelBox = new pixelUtil.PixelBox(iFinalWidth, iFinalHeight, iFinalDepth, this.getFormat(), pData.subarray(iOffset, iOffset + iMipSize));

			return pSrc;
		}

		scale(pDest: IPixelBox, eFilter?: EFilters): boolean {
			return null;
		}

		resize(iWidth: uint, iHeight: uint, eFilter?: EFilters): boolean {
			return null;
		}

		generatePerlinNoise(fScale: float, iOctaves: int, fFalloff: float): void {

		}

		randomChannelNoise(iChannel: int, iMinRange: int, iMaxRange: int): void {

		}

		static calculateSize(nMipMaps: uint, nFaces: uint, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats): uint {
			var iSize: uint = 0;
			var iMip: uint = 0;

			for (iMip = 0; iMip <= nMipMaps; iMip++) {
				iSize += pixelUtil.getMemorySize(iWidth, iHeight, iDepth, eFormat) * nFaces;
				if (iWidth != 1) iWidth = Math.floor(iWidth / 2);
				if (iHeight != 1) iHeight = Math.floor(iHeight / 2);
				if (iDepth != 1) iDepth = Math.floor(iDepth / 2);
			}
			return iSize;
		}

		static isInternalImageFormat(sExt: string): boolean {
			if (isString(sExt)) {
				sExt = sExt.toUpperCase();
				return sExt === "PNG" || sExt === "JPG" || sExt === "JPEG" || sExt === "GIF" || sExt === "BMP";
			}

			return false;
		}

		static decodeImageWithInternalFormatFromURL(sPath: string, sExt: string, cb: (e: Error, pData: Uint8Array, iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats) => void) {

			var pImg: HTMLImageElement = new Image();

			if (isDefAndNotNull(sExt)) {
				sExt = sExt.toUpperCase();
			}

			pImg.onload = () => {
				var pTempCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");
				pTempCanvas.width = pImg.width;
				pTempCanvas.height = pImg.height;

				var pTempContext: CanvasRenderingContext2D = <CanvasRenderingContext2D>((<any>pTempCanvas).getContext("2d"));
				pTempContext.drawImage(pImg, 0, 0);

				var pImageData: ImageData = pTempContext.getImageData(0, 0, pImg.width, pImg.height);
				var pRGBAData: Uint8Array = new Uint8Array((<any>pImageData.data).buffer.slice(0, (<any>pImageData.data).buffer.byteLength));

				var pData: Uint8Array = null;
				var eFormat: EPixelFormats = EPixelFormats.UNKNOWN;
				var bNoAlpha: boolean = true;

				if (sExt === "PNG" || sExt === "GIF") {
					for (var i = 0; i < pRGBAData.length; i += 4) {
						if (pRGBAData[i + 3] !== 0xff) {
							bNoAlpha = false;
							break;
						}
					}
				}

				if (sExt === "JPG" || sExt === "JPEG" || bNoAlpha) {
					var pRGBData: Uint8Array = new Uint8Array(pRGBAData.length / 4 * 3);
					for (var i = 0, j = 0; i < pRGBAData.length; i += 4, j += 3) {
						pRGBData[j] = pRGBAData[i];
						pRGBData[j + 1] = pRGBAData[i + 1];
						pRGBData[j + 2] = pRGBAData[i + 2];
					}

					pData = pRGBData;
					eFormat = EPixelFormats.BYTE_RGB;
				}
				else {
					pData = pRGBAData;
					eFormat = EPixelFormats.BYTE_RGBA;
				}

				cb(null, pData, pImg.width, pImg.height, 1, eFormat);
			};

			pImg.onerror = () => {
				cb(new Error("HTML Image element loading error."), null, 0, 0, 0, EPixelFormats.UNKNOWN);
			};

			pImg.onabort = () => {
				cb(new Error("HTML Image element loading aborted."), null, 0, 0, 0, EPixelFormats.UNKNOWN);
			};

			pImg.src = sPath;
		}

		static getMaxMipmaps(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats): int {
			var iCount: int = 0;
			if ((iWidth > 0) && (iHeight > 0)) {
				do {
					if (iWidth > 1) {
						iWidth = iWidth >>> 1;
					}
					if (iHeight > 1) {
						iHeight = iHeight >>> 1;
					}
					if (iDepth > 1) {
						iDepth = iDepth >>> 1;
					}
					/*
					 NOT needed, compressed formats will have mipmaps up to 1x1
					 if(PixelUtil::isValidExtent(width, height, depth, format))
					 count ++;
					 else
					 break;
					 */

					iCount++;
				} while (!(iWidth === 1 && iHeight === 1 && iDepth === 1));
			}
			return iCount;
		}
	}
}
