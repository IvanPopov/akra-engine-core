#ifndef ISHADOWCASTER
#define ISHADOWCASTER

module akra {
	export interface IShadowCaster extends ICamera {
		readonly lightPoint: ILightPoint;
		readonly face: uint;
	}

	export interface IShadowCasterCube {
		[i: int]: IShadowCaster;
	}
}

#endif