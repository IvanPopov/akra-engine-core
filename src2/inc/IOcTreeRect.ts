#ifndef IOCTREERECT_TS
#define IOCTREERECT_TS

module akra {
	
	IFACE (IVec3);
	IFACE (IRect3d);

	export interface IOcTreeRect {
		convert(pWorldRect: IRect3d, v3fOffset: IVec3, v3fScale: IVec3): void;
	}
}

#endif
