#ifndef ISHADOWCASTER
#define ISHADOWCASTER

module akra {
	export interface IShadowCaster extends ICamera {
		lightPoint: ILightPoint;
		face: uint;
	}

	export interface IShadowCasterCube {
		[i: int]: IShadowCaster;
	}
}

#endif