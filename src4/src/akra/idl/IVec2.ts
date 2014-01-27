

module akra {
	export interface IVec2Constructor {
		();
		(fValue: float);
		(v2fVec: IVec2);
		(pArray: float[]);
		(fValue1: float, fValue2: float);
	}
	
	
	export interface IVec2 {
		x: float;
		y: float;
		
		set(): IVec2;
		set(fValue: float): IVec2;
		set(v2fVec: IVec2): IVec2;
		set(pArray: float[]): IVec2;
		set(fValue1: float, fValue2: float): IVec2;
	
		clear(): IVec2;
	
		add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		dot(v2fVec: IVec2): float;
	
		isEqual(v2fVec: IVec2, fEps?: float): boolean;
		isClear(fEps?: float): boolean;
	
		negate(v2fDestination?: IVec2): IVec2;
		scale(fScale: float, v2fDestination?: IVec2): IVec2;
		normalize(v2fDestination?: IVec2): IVec2;
		length(): float;
		lengthSquare(): float;
		
	
		direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
	
		mix(v2fVec: IVec2, fA: float, v2fDestination?: IVec2): IVec2;
	
		toString(): string;

		
		clone(sForm: "xx", v2fDest?: IVec2): IVec2;
		clone(sForm: "xy", v2fDest?: IVec2): IVec2;
		clone(sForm: "yx", v2fDest?: IVec2): IVec2;
		clone(sForm: "yy", v2fDest?: IVec2): IVec2;
		clone(sForm: string, v2fDest?: IVec2): IVec2;
		
		copy(sForm: "xx", v2fFrom: IVec2): IVec2;
		copy(sForm: "xx", fValue: float): IVec2;
		copy(sForm: "xy", v2fFrom: IVec2): IVec2;
		copy(sForm: "xy", fValue: float): IVec2;
		copy(sForm: "yx", v2fFrom: IVec2): IVec2;
		copy(sForm: "yx", fValue: float): IVec2;
		copy(sForm: "yy", v2fFrom: IVec2): IVec2;
		copy(sForm: "yy", fValue: float): IVec2;
		copy(sForm: string, v2fFrom: IVec2): IVec2;
		copy(sForm: string, fValue: float): IVec2;
	}
	
	
	declare var vec2: IVec2Constructor;
}
