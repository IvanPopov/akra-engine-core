#ifndef IPIXELBOX_TS
#define IPIXELBOX_TS

module akra {
	export interface IPixelBox extends IBox {
		getSubBox(pDest: IBox): IPixelBox;
		getColorAt(x: uint, y: uint, z?: uint): IColor;
		setColorAt(pColor: IColor, x: uint, y: uint, z?: uint): bool;
	}
}

#endif

