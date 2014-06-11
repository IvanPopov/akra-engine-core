/// <reference path="../idl/IPixelBox.ts" />
/// <reference path="../idl/IImg.ts" />
/// <reference path="../idl/EPixelFormats.ts" />
/// <reference path="../geometry/Box.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../color/Color.ts" />
/// <reference path="../gen/generate.ts" />
/// <reference path="../config/config.ts" />

/// <reference path="pixelUtil.ts" />

module akra.pixelUtil {

	import Box = geometry.Box;
	import Color = color.Color;

	var pBuffer: IPixelBox[];
	var iElement: uint;

	export class PixelBox extends Box implements IPixelBox {
		data: Uint8Array;
		format: EPixelFormats;
		rowPitch: uint;
		slicePitch: uint;

		constructor();
		constructor(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: EPixelFormats, pPixelData?: any);
		constructor(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array);
		constructor(iWidth?: any, iHeight?: any, iDepth?: any, ePixelFormat?: any, pPixelData: Uint8Array = null) {
			super();

			if (arguments.length === 0) {
				this.data = null;
				this.format = EPixelFormats.UNKNOWN;
				this.setConsecutive();
				return;
			}

			if (arguments.length >= 4) {
				this.set(0, 0, 0, <uint>iWidth, <uint>iHeight, <uint>iDepth);
				this.data = isDef(arguments[4]) ? (<Uint8Array>arguments[4]) : null;
				this.format = <EPixelFormats>arguments[3];
			}
			else {
				this.set(<IBox>arguments[0]);
				this.data = <Uint8Array>arguments[2];
				this.format = <EPixelFormats>arguments[1];
			}

			this.setConsecutive();
		}

		setConsecutive(): void {
			this.rowPitch = this.getWidth();
			this.slicePitch = this.getWidth() * this.getHeight();
		}

		getRowSkip(): uint { return this.rowPitch - this.getWidth(); }
		getSliceSkip(): uint { return this.slicePitch - (this.getHeight() * this.rowPitch); }

		isConsecutive(): boolean {
			return this.rowPitch == this.getWidth() && this.slicePitch == this.getWidth() * this.getHeight();
		}

		getConsecutiveSize(): uint {
			return pixelUtil.getMemorySize(this.getWidth(), this.getHeight(), this.getDepth(), this.format);
		}

		getSubBox(pDest: IBox, pDestPixelBox: IPixelBox = null): PixelBox {
			if (pixelUtil.isCompressed(this.format)) {
				if (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front &&
					pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back) {
					// Entire buffer is being queried
					return this;
				}

				logger.error("Cannot return subvolume of compressed PixelBuffer", "PixelBox::getSubVolume");
			}

			if (!this.contains(pDest)) {
				logger.error("Bounds out of range", "PixelBox::getSubVolume");
			}

			var elemSize: uint = pixelUtil.getNumElemBytes(this.format);
			// Calculate new data origin
			// Notice how we do not propagate left/top/front from the incoming box, since
			// the returned pointer is already offset

			var rval: PixelBox = null;

			if (isNull(pDestPixelBox)) {
				rval = new PixelBox();
			}
			else {
				rval = <PixelBox>pDestPixelBox;
			}

			rval.setPosition(0, 0, pDest.getWidth(), pDest.getHeight(), 0, pDest.getDepth());
			rval.format = this.format;
			rval.data = (<Uint8Array> this.data).subarray(((pDest.left - this.left) * elemSize)
				+ ((pDest.top - this.top) * this.rowPitch * elemSize)
				+ ((pDest.front - this.front) * this.slicePitch * elemSize));

			rval.rowPitch = this.rowPitch;
			rval.slicePitch = this.slicePitch;
			rval.format = this.format;

			return rval;
		}

		getColorAt(pColor: IColor, x: uint, y: uint, z: uint = 0): IColor {
			if (isNull(pColor)) {
				pColor = new Color(0.);
			}

			var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
			var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);

			pixelUtil.unpackColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));

			return pColor;
		}

		setColorAt(pColor: IColor, x: uint, y: uint, z: uint = 0): void {
			var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
			var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
			pixelUtil.packColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));
		}

		scale(pDest: IPixelBox, eFilter: EFilters = EFilters.BILINEAR): boolean {
			return false;
		}

		refresh(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array): void {
			this.left = pExtents.left;
			this.top = pExtents.top;
			this.front = pExtents.front;

			this.right = pExtents.right;
			this.bottom = pExtents.bottom;
			this.back = pExtents.back;

			this.data = pPixelData;
			this.format = ePixelFormat;

			this.setConsecutive();
		}

		toString(): string {
			if (config.DEBUG) {
				return "|---------------------------|\n" +
					super.toString() + "\n" +
					"length: " + (this.data ? this.data.length : 0) + "\n" +
					"|---------------------------|";
			}
			return null;
		}
		static temp(): IPixelBox;
		static temp(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array): IPixelBox;
		static temp(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array): IPixelBox;
		static temp(): IPixelBox {
			iElement = (iElement === pBuffer.length - 1 ? 0 : iElement);
			var pPixelBox: IPixelBox = pBuffer[iElement++];

			var pBox: IBox = null;
			var pPixelData: Uint8Array = null;
			var ePixelFormat: EPixelFormats = EPixelFormats.UNKNOWN;

			switch (arguments.length) {
				case 2:
				case 3:
					pBox = arguments[0];
					ePixelFormat = arguments[1];
					pPixelData = arguments[2] || null;
					break;
				case 4:
				case 5:
					pBox = Box.temp(0, 0, 0, arguments[0], arguments[1], arguments[2]);
					ePixelFormat = arguments[3];
					pPixelData = arguments[4] || null;
					break;
				default:
					pBox = Box.temp(0, 0, 0, 1, 1, 1);
					break;
			}

			pPixelBox.refresh(pBox, ePixelFormat, pPixelData);

			return pPixelBox;
		}
	}

	pBuffer = gen.array<IPixelBox>(20, PixelBox);
	iElement = 0;
}