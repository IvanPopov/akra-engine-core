

/// <reference path="IVec3.ts" />
/// <reference path="ICircle.ts" />

module akra {
	interface ISphere {
	
		center: IVec3;
		radius: float;
	
		circle: ICircle;
		z: float;
	
		set(): ISphere;
		set(pSphere: ISphere): ISphere;
		set(v3fCenter: IVec3, fRadius: float): ISphere;
		set(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float): ISphere;
	
		clear(): ISphere;
	
		isEqual(pSphere: ISphere): boolean;
		isClear(): boolean;
		isValid(): boolean;
	
		offset(v3fOffset: IVec3): ISphere;
		expand(fInc: float): ISphere;
		normalize(): ISphere;
	
		transform(m4fMatrix: IMat4): ISphere;
	};
}
