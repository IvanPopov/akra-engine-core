#ifndef IBOX_TS
#define IBOX_TS

module akra {
	export interface IBox {
		width: uint;
		height: uint;
		depth: uint;

		left: uint;
		top: uint;
		right: uint;
		bottom: uint;
		front: uint;
		back: uint;

		contains(pDest: IBox): bool;
		isEqual(pDest: IBox): bool;
		setPosition(iLeft: uint, iTop: uint, iWidth: uint, iHeight: uint): void;
	}
}

#endif

