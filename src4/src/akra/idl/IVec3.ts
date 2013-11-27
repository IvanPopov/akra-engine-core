
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
	
	    /*represents two-component vector from original vector*/
	    xx: IVec2;
	    /*represents two-component vector from original vector*/
	    xy: IVec2;
	    /*represents two-component vector from original vector*/
	    xz: IVec2;
	    /*represents two-component vector from original vector*/
	    yx: IVec2;
	    /*represents two-component vector from original vector*/
	    yy: IVec2;
	    /*represents two-component vector from original vector*/
	    yz: IVec2;
	    /*represents two-component vector from original vector*/
	    zx: IVec2;
	    /*represents two-component vector from original vector*/
	    zy: IVec2;
	    /*represents two-component vector from original vector*/
	    zz: IVec2;
	
	    /*represents three-component vector from original vector*/
	    xxx: IVec3;
	    /*represents three-component vector from original vector*/
	    xxy: IVec3;
	    /*represents three-component vector from original vector*/
	    xxz: IVec3;
	    /*represents three-component vector from original vector*/
	    xyx: IVec3;
	    /*represents three-component vector from original vector*/
	    xyy: IVec3;
	    /*represents three-component vector from original vector*/
	    xyz: IVec3;
	    /*represents three-component vector from original vector*/
	    xzx: IVec3;
	    /*represents three-component vector from original vector*/
	    xzy: IVec3;
	    /*represents three-component vector from original vector*/
	    xzz: IVec3;
	    /*represents three-component vector from original vector*/
	    yxx: IVec3;
	    /*represents three-component vector from original vector*/
	    yxy: IVec3;
	    /*represents three-component vector from original vector*/
	    yxz: IVec3;
	    /*represents three-component vector from original vector*/
	    yyx: IVec3;
	    /*represents three-component vector from original vector*/
	    yyy: IVec3;
	    /*represents three-component vector from original vector*/
	    yyz: IVec3;
	    /*represents three-component vector from original vector*/
	    yzx: IVec3;
	    /*represents three-component vector from original vector*/
	    yzy: IVec3;
	    /*represents three-component vector from original vector*/
	    yzz: IVec3;
	    /*represents three-component vector from original vector*/
	    zxx: IVec3;
	    /*represents three-component vector from original vector*/
	    zxy: IVec3;
	    /*represents three-component vector from original vector*/
	    zxz: IVec3;
	    /*represents three-component vector from original vector*/
	    zyx: IVec3;
	    /*represents three-component vector from original vector*/
	    zyy: IVec3;
	    /*represents three-component vector from original vector*/
	    zyz: IVec3;
	    /*represents three-component vector from original vector*/
	    zzx: IVec3;
	    /*represents three-component vector from original vector*/
	    zzy: IVec3;
	    /*represents three-component vector from original vector*/
	    zzz: IVec3;
	
	
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
	}
	
	
	
	declare var vec3: IVec3Constructor;
}
