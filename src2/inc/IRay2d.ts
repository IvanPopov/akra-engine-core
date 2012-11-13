#ifndef IRAY2D_TS
#define IRAY2D_TS

module akra {

	IFACE(IVec2);

	export interface IRay2d {
		v2fPoint: IVec2;
		v2fNormal: IVec2;
	};
}

#endif