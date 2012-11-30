#ifndef ISPHERE_TS
#define ISPHERE_TS

module akra {

	IFACE(IVec3);
	IFACE(ICircle);

	export interface ISphere {

		center: IVec3;
		radius: float;

		circle: ICircle;
		z: float;

		set(): ISphere;
		set(pSphere: ISphere): ISphere;
		set(v3fCenter: IVec3, fRadius: float): ISphere;
		set(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float): ISphere;

		clear(): ISphere;

		isEqual(pSphere: ISphere): bool;
		isClear(): bool;
		isValid(): bool;

		offset(v3fOffset: IVec3): ISphere;
		expand(fInc: float): ISphere;
		normalize(): ISphere;
	};
};

#endif