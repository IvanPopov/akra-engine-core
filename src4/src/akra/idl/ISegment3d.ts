

/// <reference path="IRay3d.ts" />

module akra {
	interface ISegment3d {
		ray: IRay3d;
		distance: float;
	
		point: IVec3;
		normal: IVec3;
	};
}
