#ifndef PIXELBOX_TS
#define PIXELBOX_TS

#include "PixelFormat.ts"
#include "IPixelBox.ts"
#include "util/Color.ts"
#include "pixelUtil.ts"
#include "geometry/Box.ts"
#include "util/Color.ts"
#include "IImg.ts"

module akra.pixelUtil {
	export class PixelBox extends geometry.Box implements IPixelBox {
		data: Uint8Array = null;
		format: EPixelFormats;
		rowPitch: uint;
		slicePitch: uint;

		constructor();
		constructor(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: EPixelFormats, pPixelData: any = null);
		constructor (pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array = null);
		constructor (iWidth?: any, iHeight?: any, iDepth?: any, ePixelFormat?: any, pPixelData: Uint8Array = null) {
			if (arguments.length === 0) {
				return;
			}

			if (arguments.length >= 4) {
				super(0, 0, 0, <uint>iWidth, <uint>iHeight, <uint>iDepth);	
			}
			else {
				super(<IBox>arguments[0]);
			}
			
			
			this.data = <Uint8Array>arguments[2];
			this.format = <EPixelFormats>arguments[1];

			this.setConsecutive();
		}

		setConsecutive(): void {
			this.rowPitch = this.width;
			this.slicePitch = this.width * this.height;
		}

		getRowSkip(): uint { return this.rowPitch - this.width; }
		getSliceSkip(): uint { return this.slicePitch - (this.height * this.rowPitch); }

		isConsecutive(): bool {
			return this.rowPitch == this.width && this.slicePitch == this.width * this.height;
		}

		getConsecutiveSize(): uint {
			return pixelUtil.getMemorySize(this.width, this.height, this.depth, this.format);
		}

		getSubBox(pDest: IBox): PixelBox {
			if(pixelUtil.isCompressed(this.format)) {
				if(pDest.left == this.left && pDest.top == this.top && pDest.front == this.front &&
				   pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back) {
					// Entire buffer is being queried
					return this;
				}

				ERROR("Cannot return subvolume of compressed PixelBuffer", "PixelBox::getSubVolume");
			}

			if(!this.contains(pDest))
				ERROR("Bounds out of range", "PixelBox::getSubVolume");

			var elemSize: uint = pixelUtil.getNumElemBytes(this.format);
			// Calculate new data origin
			// Notice how we do not propagate left/top/front from the incoming box, since
			// the returned pointer is already offset
			var rval: PixelBox = new PixelBox(pDest.width, pDest.height, pDest.depth, this.format, 
				(<Uint8Array> this.data).subarray(((pDest.left - this.left) * elemSize)
				+ ((pDest.top - this.top) * this.rowPitch * elemSize)
				+ ((pDest.front - this.front) * this.slicePitch * elemSize))
			);

			rval.rowPitch = this.rowPitch;
			rval.slicePitch = this.slicePitch;
			rval.format = this.format;

			return rval;
		}

		getColorAt(x: uint, y: uint, z?: uint): IColor {
			var cv: IColor = new Color;

	        var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
	        var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);

	        pixelUtil.unpackColour(cv, this.format, this.data.subarray(pixelOffset));

	        return cv;
		}

		setColorAt(pColor: IColor, x: uint, y: uint, z?: uint): void {
			var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
	        var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
	        pixelUtil.packColour(pColor, this.format, this.data.subarray(pixelOffset));
		}

		scale(pDest: IPixelBox, eFilter: EFilters = EFilters.BILINEAR): bool {
			return false;
		}
	}

}

#endif
