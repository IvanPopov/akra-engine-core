

/// <reference path="IRay3d.ts" />

module akra {
	export interface ISegment3d {
		ray: IRay3d;
		distance: float;

		getPoint(): IVec3;
		setPoint(v3fPoint: IVec3): void;

		getNormal(): IVec3;
		setNormal(v3fNormal: IVec3): void;
	};
}
