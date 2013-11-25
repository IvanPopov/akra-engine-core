

/// <reference path="IBox.ts" />
/// <reference path="IColor.ts" />
/// <reference path="EPixelFormats.ts" />

module akra {
	interface IPixelBox extends IBox {
		format: EPixelFormats;
		data: Uint8Array;
		rowPitch: uint;
		slicePitch: uint;
	
		setConsecutive(): void;
	
		getRowSkip(): uint;
		getSliceSkip(): uint;
	
		isConsecutive(): boolean;
		getConsecutiveSize(): uint;
	
		getSubBox(pDest: IBox, pDestPixelBox?: IPixelBox): IPixelBox;
		getColorAt(pColor: IColor, x: uint, y: uint, z?: uint): IColor;
		setColorAt(pColor: IColor, x: uint, y: uint, z?: uint): void;
	
		scale(pDest: IPixelBox, eFilter?: EFilters): boolean;
	
		refresh(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array): void;
	}
	
}
