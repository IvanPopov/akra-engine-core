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
		toMatrix(): IMat4;
		toMatrixFromMatrix(): IMat4;
		reset(): IAnimationFrame;
		set(pFrame: IAnimationFrame): void;
		add(pFrame: IAnimationFrame, isFirst: bool): IAnimationFrame;
		addMatrix(pFrame: IAnimationFrame): IAnimationFrame;
		mult(fScalar: float): IAnimationFrame;
		normilize(): IAnimationFrame;
		normilizeMatrix(): IAnimationFrame;
		interpolate(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void;
		interpolateMatrix(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void;
	}
}

#endif