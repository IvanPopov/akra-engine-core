

/// <reference path="IRay2d.ts" />

module akra {
	export interface ISegment2d {
		ray: IRay2d;
		distance: float;
	
		point: IVec2;
		normal: IVec2;
	};
}
