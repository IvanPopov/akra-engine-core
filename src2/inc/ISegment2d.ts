#ifndef ISEGMENT2D_TS
#define ISEGMENT2D_TS

module akra {

	IFACE(IRay2d);

	export interface ISegment2d{
		ray: IRay2d;
		distance: float;

		point: IVec2;
		normal: IVec2;
	};
}

#endif