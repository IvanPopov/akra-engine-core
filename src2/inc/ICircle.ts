#ifndef ICIRCLE_TS
#define ICIRCLE_TS

module akra {

	IFACE(IVec2);

	export interface ICircle {

		fRadius: float;
		v2fCenter: IVec2;

		set(): ICircle;
		set(pCircle: ICircle): ICircle;
		set(v2fCenter: IVec2, fRadius: float): ICircle;
		set(fCenterX: float, fCenterY: float, fRadius: float): ICircle;

		clear(): ICircle;

		isEqual(pCircle: ICircle): bool;
		isClear(): bool;
		isValid(): bool;

		offset(v2fOffset: IVec2): ICircle;
		expand(fInc: float): ICircle;
		normalize(): ICircle;
	};
};

#endif