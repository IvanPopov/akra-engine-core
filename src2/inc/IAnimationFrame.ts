#ifndef IANIMATIONFRAME_TS
#define IANIMATIONFRAME_TS

module akra {
	export enum EAnimationInterpolations {
		MATRIX_LINEAR,
		LINEAR
	}
	
	export interface IAnimationFrame {
		toMatrix(): IMat4;
	}
}

#endif