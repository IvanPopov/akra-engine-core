#ifndef IPIXELBOX_TS
#define IPIXELBOX_TS

#include "PixelFormat.ts"
#include "IBox.ts"

module akra {
	IFACE(IColor);
	
	export interface IPixelBox extends IBox {
		format: EPixelFormats;
		data: Uint8Array;
		rowPitch: uint;
		slicePitch: uint;

		setConsecutive(): void;

		getRowSkip(): uint;
		getSliceSkip(): uint;

		isConsecutive(): bool;
		getConsecutiveSize(): uint;

		getSubBox(pDest: IBox, pDestPixelBox?: IPixelBox): IPixelBox;
		getColorAt(pColor: IColor, x: uint, y: uint, z?: uint): IColor;
		setColorAt(pColor: IColor, x: uint, y: uint, z?: uint): void;

		scale(pDest: IPixelBox, eFilter?: EFilters): bool;

		refresh(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array): void;
	}
}

#endif

