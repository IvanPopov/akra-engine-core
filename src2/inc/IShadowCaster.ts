#ifndef ISHADOWCASTER
#define ISHADOWCASTER

module akra {
	export interface IShadowCaster extends ICamera {
		lightPoint: ILightPoint;
	}
}

#endif