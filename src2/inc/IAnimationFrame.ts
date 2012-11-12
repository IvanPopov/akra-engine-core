#ifndef IANIMATIONFRAME_TS
#define IANIMATIONFRAME_TS

module akra {
	IFACE(IMat4);
	IFACE(IQuat4);
	IFACE(IVec3);
	IFACE(IAnimationFrame);
	export enum EAnimationInterpolations {
		MATRIX_LINEAR,
		LINEAR
	}
	
	export interface IAnimationFrame {
		time: float;
		weight: float;
		matrix: IMat4;
		rotation: IQuat4;
		scale: IVec3;
		translation: IVec3;
		set(pFrame: IAnimationFrame): void;
		interpolate(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void;
		toMatrix(): IMat4;
	}
}

#endif