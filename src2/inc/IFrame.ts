#ifndef IANIMATIONFRAME_TS
#define IANIMATIONFRAME_TS

module akra {
	IFACE(IMat4);
	IFACE(IQuat4);
	IFACE(IVec3);
	
	//SLERP <==> slerp for rotation, MATRIX_LINEAR - linear between matrices

	export enum EAnimationInterpolations {
		LINEAR,
		SPHERICAL
	}

	export interface IFrame {
		type: EAnimationInterpolations;

		readonly time: float;
		readonly weight: float;
		
		reset(): IFrame;
		set(pFrame: IFrame): IFrame;
		add(pFrame: IFrame, isFirst: bool): IFrame;
		mult(fScalar: float): IFrame;
		normilize(): IFrame;

		interpolate(pStartFrame: IFrame, pEndFrame: IFrame, fBlend: float): IFrame;
	}
}

#endif