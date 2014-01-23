
/// <reference path="IVec2.ts" />
/// <reference path="IMat4.ts" />

module akra {
	export interface IVec3Constructor {
	    ();
	    (fValue: float);
	    (v3fVec: IVec3);
	    (pArray: float[]);
	    (fValue: float, v2fVec: IVec2);
	    (v2fVec: IVec2, fValue: float);
	    (fValue1: float, fValue2: float, fValue3: float);
	}
	
	
	export interface IVec3 {
	    x: float;
	    y: float;
	    z: float;
	
	    set(): IVec3;
	    set(fValue: float): IVec3;
	    set(v3fVec: IVec3): IVec3;
	    set(pArray: float[]): IVec3;
	    set(fValue: float, v2fVec: IVec2): IVec3;
	    set(v2fVec: IVec2, fValue: float): IVec3;
	    set(fValue1: float, fValue2: float, fValue3: float): IVec3;
	
	    clear(): IVec3;
	
	    add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
	    subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
	    dot(v3fVec: IVec3): float;
	    cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
	
	    isEqual(v3fVec: IVec3, fEps?: float): boolean;
	    isClear(fEps?: float): boolean;
	
	    negate(v3fDestination?: IVec3): IVec3;
	    scale(fScale: float, v3fDestination?: IVec3): IVec3;
	    scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
	    normalize(v3fDestination?: IVec3): IVec3;
	    length(): float;
	    lengthSquare(): float;
	
	    direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
	
	    mix(v3fVec: IVec3, fA: float, v3fDestination?: IVec3): IVec3;
	
	    toString(): string;
	    toArray(): float[];
	    toTranslationMatrix(m4fDestination?: IMat4);
	
		vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3;

		//clone(sForm: string, pVec2OrVec3?: any): any;
		clone(sForm: "xx", v2fDest?: IVec2): IVec2;
		clone(sForm: "xy", v2fDest?: IVec2): IVec2;
		clone(sForm: "xz", v2fDest?: IVec2): IVec2;
		clone(sForm: "yx", v2fDest?: IVec2): IVec2;
		clone(sForm: "yy", v2fDest?: IVec2): IVec2;
		clone(sForm: "yz", v2fDest?: IVec2): IVec2;
		clone(sForm: "zx", v2fDest?: IVec2): IVec2;
		clone(sForm: "zy", v2fDest?: IVec2): IVec2;
		clone(sForm: "zz", v2fDest?: IVec2): IVec2;

		clone(sForm: "xxx", v3fDest?: IVec3): IVec3;
		clone(sForm: "xxy", v3fDest?: IVec3): IVec3;
		clone(sForm: "xxz", v3fDest?: IVec3): IVec3;
		clone(sForm: "xyx", v3fDest?: IVec3): IVec3;
		clone(sForm: "xyy", v3fDest?: IVec3): IVec3;
		clone(sForm: "xyz", v3fDest?: IVec3): IVec3;
		clone(sForm: "xzx", v3fDest?: IVec3): IVec3;
		clone(sForm: "xzy", v3fDest?: IVec3): IVec3;
		clone(sForm: "xzz", v3fDest?: IVec3): IVec3;
		clone(sForm: "yxx", v3fDest?: IVec3): IVec3;
		clone(sForm: "yxy", v3fDest?: IVec3): IVec3;
		clone(sForm: "yxz", v3fDest?: IVec3): IVec3;
		clone(sForm: "yyx", v3fDest?: IVec3): IVec3;
		clone(sForm: "yyy", v3fDest?: IVec3): IVec3;
		clone(sForm: "yyz", v3fDest?: IVec3): IVec3;
		clone(sForm: "yzx", v3fDest?: IVec3): IVec3;
		clone(sForm: "yzy", v3fDest?: IVec3): IVec3;
		clone(sForm: "yzz", v3fDest?: IVec3): IVec3;
		clone(sForm: "zxx", v3fDest?: IVec3): IVec3;
		clone(sForm: "zxy", v3fDest?: IVec3): IVec3;
		clone(sForm: "zxz", v3fDest?: IVec3): IVec3;
		clone(sForm: "zyx", v3fDest?: IVec3): IVec3;
		clone(sForm: "zyy", v3fDest?: IVec3): IVec3;
		clone(sForm: "zyz", v3fDest?: IVec3): IVec3;
		clone(sForm: "zzx", v3fDest?: IVec3): IVec3;
		clone(sForm: "zzy", v3fDest?: IVec3): IVec3;
		clone(sForm: "zzz", v3fDest?: IVec3): IVec3;

		clone(sForm: string, v2fDest?: IVec2): IVec2;
		clone(sForm: string, v3fDest?: IVec3): IVec3;

		copy(sForm: "xx", v2fFrom: IVec2): IVec3;
		copy(sForm: "xx", fValue: float): IVec3;
		copy(sForm: "xy", v2fFrom: IVec2): IVec3;
		copy(sForm: "xy", fValue: float): IVec3;
		copy(sForm: "xz", v2fFrom: IVec2): IVec3;
		copy(sForm: "xz", fValue: float): IVec3;
		copy(sForm: "yx", v2fFrom: IVec2): IVec3;
		copy(sForm: "yx", fValue: float): IVec3;
		copy(sForm: "yy", v2fFrom: IVec2): IVec3;
		copy(sForm: "yy", fValue: float): IVec3;
		copy(sForm: "yz", v2fFrom: IVec2): IVec3;
		copy(sForm: "yz", fValue: float): IVec3;
		copy(sForm: "zx", v2fFrom: IVec2): IVec3;
		copy(sForm: "zx", fValue: float): IVec3;
		copy(sForm: "zy", v2fFrom: IVec2): IVec3;
		copy(sForm: "zy", fValue: float): IVec3;
		copy(sForm: "zz", v2fFrom: IVec2): IVec3;
		copy(sForm: "zz", fValue: float): IVec3;

		copy(sForm: "xxx", v3fFrom: IVec3): IVec3;
		copy(sForm: "xxx", fValue: float): IVec3;
		copy(sForm: "xxy", v3fFrom: IVec3): IVec3;
		copy(sForm: "xxy", fValue: float): IVec3;
		copy(sForm: "xxz", v3fFrom: IVec3): IVec3;
		copy(sForm: "xxz", fValue: float): IVec3;
		copy(sForm: "xyx", v3fFrom: IVec3): IVec3;
		copy(sForm: "xyx", fValue: float): IVec3;
		copy(sForm: "xyy", v3fFrom: IVec3): IVec3;
		copy(sForm: "xyy", fValue: float): IVec3;
		copy(sForm: "xyz", v3fFrom: IVec3): IVec3;
		copy(sForm: "xyz", fValue: float): IVec3;
		copy(sForm: "xzx", v3fFrom: IVec3): IVec3;
		copy(sForm: "xzx", fValue: float): IVec3;
		copy(sForm: "xzy", v3fFrom: IVec3): IVec3;
		copy(sForm: "xzy", fValue: float): IVec3;
		copy(sForm: "xzz", v3fFrom: IVec3): IVec3;
		copy(sForm: "xzz", fValue: float): IVec3;
		copy(sForm: "yxx", v3fFrom: IVec3): IVec3;
		copy(sForm: "yxx", fValue: float): IVec3;
		copy(sForm: "yxy", v3fFrom: IVec3): IVec3;
		copy(sForm: "yxy", fValue: float): IVec3;
		copy(sForm: "yxz", v3fFrom: IVec3): IVec3;
		copy(sForm: "yxz", fValue: float): IVec3;
		copy(sForm: "yyx", v3fFrom: IVec3): IVec3;
		copy(sForm: "yyx", fValue: float): IVec3;
		copy(sForm: "yyy", v3fFrom: IVec3): IVec3;
		copy(sForm: "yyy", fValue: float): IVec3;
		copy(sForm: "yyz", v3fFrom: IVec3): IVec3;
		copy(sForm: "yyz", fValue: float): IVec3;
		copy(sForm: "yzx", v3fFrom: IVec3): IVec3;
		copy(sForm: "yzx", fValue: float): IVec3;
		copy(sForm: "yzy", v3fFrom: IVec3): IVec3;
		copy(sForm: "yzy", fValue: float): IVec3;
		copy(sForm: "yzz", v3fFrom: IVec3): IVec3;
		copy(sForm: "yzz", fValue: float): IVec3;
		copy(sForm: "zxx", v3fFrom: IVec3): IVec3;
		copy(sForm: "zxx", fValue: float): IVec3;
		copy(sForm: "zxy", v3fFrom: IVec3): IVec3;
		copy(sForm: "zxy", fValue: float): IVec3;
		copy(sForm: "zxz", v3fFrom: IVec3): IVec3;
		copy(sForm: "zxz", fValue: float): IVec3;
		copy(sForm: "zyx", v3fFrom: IVec3): IVec3;
		copy(sForm: "zyx", fValue: float): IVec3;
		copy(sForm: "zyy", v3fFrom: IVec3): IVec3;
		copy(sForm: "zyy", fValue: float): IVec3;
		copy(sForm: "zyz", v3fFrom: IVec3): IVec3;
		copy(sForm: "zyz", fValue: float): IVec3;
		copy(sForm: "zzx", v3fFrom: IVec3): IVec3;
		copy(sForm: "zzx", fValue: float): IVec3;
		copy(sForm: "zzy", v3fFrom: IVec3): IVec3;
		copy(sForm: "zzy", fValue: float): IVec3;
		copy(sForm: "zzz", v3fFrom: IVec3): IVec3;
		copy(sForm: "zzz", fValue: float): IVec3;

		copy(sForm: string, fValue: float): IVec3;
		copy(sForm: string, v2fFrom: IVec2): IVec3;
		copy(sForm: string, v3fFrom: IVec3): IVec3;
	}
	
	
	
	declare var vec3: IVec3Constructor;
}
