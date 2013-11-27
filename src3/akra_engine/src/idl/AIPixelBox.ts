// AIPixelBox interface
// [write description here...]


/// <reference path="AIBox.ts" />
/// <reference path="AIColor.ts" />
/// <reference path="AEPixelFormats.ts" />

interface AIPixelBox extends AIBox {
	format: AEPixelFormats;
	data: Uint8Array;
	rowPitch: uint;
	slicePitch: uint;

	setConsecutive(): void;

	getRowSkip(): uint;
	getSliceSkip(): uint;

	isConsecutive(): boolean;
	getConsecutiveSize(): uint;

	getSubBox(pDest: AIBox, pDestPixelBox?: AIPixelBox): AIPixelBox;
	getColorAt(pColor: AIColor, x: uint, y: uint, z?: uint): AIColor;
	setColorAt(pColor: AIColor, x: uint, y: uint, z?: uint): void;

	scale(pDest: AIPixelBox, eFilter?: AEFilters): boolean;

	refresh(pExtents: AIBox, ePixelFormat: AEPixelFormats, pPixelData: Uint8Array): void;
}
