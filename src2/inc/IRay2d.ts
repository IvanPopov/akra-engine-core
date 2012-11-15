#ifndef IRAY2D_TS
#define IRAY2D_TS

module akra {

	IFACE(IVec2);

	export interface IRay2d {
		point: IVec2;
		normal: IVec2;
	};
}

#endif