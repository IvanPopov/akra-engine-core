/// <reference path="IVec3.ts" />

//SLERP <==> slerp for rotation, MATRIX_LINEAR - linear between matrices

module akra {
	export enum EAnimationInterpolations {
		LINEAR,
		SPHERICAL
	}
	
	export interface IFrame {
		type: EAnimationInterpolations;
	
		/** readonly */ time: float;
		/** readonly */ weight: float;
		
		reset(): IFrame;
		set(pFrame: IFrame): IFrame;
		add(pFrame: IFrame, isFirst: boolean): IFrame;
		mult(fScalar: float): IFrame;
		normilize(): IFrame;
	
		interpolate(pStartFrame: IFrame, pEndFrame: IFrame, fBlend: float): IFrame;
	}
	
}
