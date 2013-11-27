

/// <reference path="IVec2.ts" />

module akra {
	export interface ICircle {
	
		radius: float;
		center: IVec2;
	
		set(): ICircle;
		set(pCircle: ICircle): ICircle;
		set(v2fCenter: IVec2, fRadius: float): ICircle;
		set(fCenterX: float, fCenterY: float, fRadius: float): ICircle;
	
		clear(): ICircle;
	
		isEqual(pCircle: ICircle): boolean;
		isClear(): boolean;
		isValid(): boolean;
	
		offset(v2fOffset: IVec2): ICircle;
		expand(fInc: float): ICircle;
		normalize(): ICircle;
	};
}
