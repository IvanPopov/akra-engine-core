

/// <reference path="IRay2d.ts" />

module akra {
	export interface ISegment2d {
		ray: IRay2d;
		distance: float;

		getPoint(): IVec2;
		setPoint(v2fPoint: IVec2): void;

		getNormal(): IVec2;
		setNormal(v2fNormal: IVec2): void;
	};
}
