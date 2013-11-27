

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
	
	    /*represents two-component vector from original vector*/
	    xx: IVec2;
	    /*represents two-component vector from original vector*/
	    xy: IVec2;
	    /*represents two-component vector from original vector*/
	    yx: IVec2;
	    /*represents two-component vector from original vector*/
	    yy: IVec2;
		
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
	}
	
	
	declare var vec2: IVec2Constructor;
}
