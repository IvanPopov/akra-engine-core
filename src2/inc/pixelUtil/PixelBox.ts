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
		data: Uint8Array;
		format: EPixelFormats;
		rowPitch: uint;
		slicePitch: uint;

		constructor();
		constructor(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: EPixelFormats, pPixelData: any = null);
		constructor (pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array = null);
		constructor (iWidth?: any, iHeight?: any, iDepth?: any, ePixelFormat?: any, pPixelData: Uint8Array = null) {
			if (arguments.length === 0) {
				super();
				this.data = null;
				this.format = EPixelFormats.UNKNOWN;
				this.setConsecutive();
				return;
			}

			if (arguments.length >= 4) {
				super(0, 0, 0, <uint>iWidth, <uint>iHeight, <uint>iDepth);	
				this.data = isDef(arguments[4]) ? (<Uint8Array>arguments[4]) : null;
				this.format = <EPixelFormats>arguments[3];
			}
			else {
				super(<IBox>arguments[0]);
				this.data = <Uint8Array>arguments[2];
				this.format = <EPixelFormats>arguments[1];
			}

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

		getSubBox(pDest: IBox, pDestPixelBox?: IPixelBox = null): PixelBox {
			if(pixelUtil.isCompressed(this.format)) {
				if(pDest.left == this.left && pDest.top == this.top && pDest.front == this.front &&
				   pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back) {
					// Entire buffer is being queried
					return this;
				}

				ERROR("Cannot return subvolume of compressed PixelBuffer", "PixelBox::getSubVolume");
			}

			if(!this.contains(pDest))
			{
				ERROR("Bounds out of range", "PixelBox::getSubVolume");
			}

			var elemSize: uint = pixelUtil.getNumElemBytes(this.format);
			// Calculate new data origin
			// Notice how we do not propagate left/top/front from the incoming box, since
			// the returned pointer is already offset
			
			var rval: PixelBox = null;

			if(isNull(pDestPixelBox)){
				rval = new PixelBox();
			}
			else {
				rval = <PixelBox>pDestPixelBox;
			}

			rval.setPosition(0, 0, pDest.width, pDest.height, 0, pDest.depth);
			rval.format = this.format;
			rval.data =	(<Uint8Array> this.data).subarray(((pDest.left - this.left) * elemSize)
						+ ((pDest.top - this.top) * this.rowPitch * elemSize)
						+ ((pDest.front - this.front) * this.slicePitch * elemSize));

			rval.rowPitch = this.rowPitch;
			rval.slicePitch = this.slicePitch;
			rval.format = this.format;

			return rval;
		}

		getColorAt(pColor: IColor, x: uint, y: uint, z?: uint=0): IColor {
			if (isNull(pColor)) {
				pColor = new Color(0.);
			}

	        var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
	        var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);

	        pixelUtil.unpackColour(pColor, this.format, this.data.subarray(pixelOffset,pixelOffset+pixelSize));

	        return pColor;
		}

		setColorAt(pColor: IColor, x: uint, y: uint, z?: uint=0): void {
			var pixelSize: uint = pixelUtil.getNumElemBytes(this.format);
	        var pixelOffset: uint = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
	        pixelUtil.packColour(pColor, this.format, this.data.subarray(pixelOffset,pixelOffset+pixelSize));
		}

		scale(pDest: IPixelBox, eFilter: EFilters = EFilters.BILINEAR): bool {
			return false;
		}

		refresh(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array): void {
			this.left 	= pExtents.left;
			this.top 	= pExtents.top;
			this.front 	= pExtents.front;

			this.right 	= pExtents.right;
			this.bottom = pExtents.bottom;
			this.back 	= pExtents.back;

			this.data = pPixelData;
			this.format = ePixelFormat;

			this.setConsecutive();
		}

		toString(): string{
			return "|---------------------------|\n" + 
				   super.toString() + "\n" +
				   "length: " + (this.data ? this.data.length : 0) + "\n" +
				   "|---------------------------|";
		}

		ALLOCATE_STORAGE(PixelBox, 20)
	}

	export function pixelBox(): IPixelBox;
	export function pixelBox(iWidth: uint, iHeight: uint, iDepth: uint, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array = null): IPixelBox;
	export function pixelBox(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array = null): IPixelBox;
	export function pixelBox(): IPixelBox {
		var pPixelBox: IPixelBox = PixelBox.stack[PixelBox.stackPosition ++];

        if(PixelBox.stackPosition === PixelBox.stackSize){
            PixelBox.stackPosition = 0;
        }

        var pBox: IBox = null;
        var pPixelData: Uint8Array = null;
        var ePixelFormat: EPixelFormats = EPixelFormats.UNKNOWN;

        switch(arguments.length){
        	case 2:
        	case 3:
        		pBox = arguments[0];
        		ePixelFormat = arguments[1];
        		pPixelData = arguments[2] || null;
        		break;
        	case 4:
        	case 5:
        		pBox = geometry.box(0, 0, 0, arguments[0], arguments[1], arguments[2]);
        		ePixelFormat = arguments[3];
        		pPixelData = arguments[4] || null;
        		break;
        	default:
        		pBox = geometry.box(0, 0, 0, 1, 1, 1);
        		break;
        }

        pPixelBox.refresh(pBox, ePixelFormat, pPixelData);

        return pPixelBox;
	}

}

#endif
