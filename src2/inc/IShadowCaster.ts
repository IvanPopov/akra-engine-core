#ifndef ISHADOWCASTER_TS
#define ISHADOWCASTER_TS

module akra {

	IFACE(ILightPoint);
	IFACE(IObjectArray);

	export interface IShadowCaster extends ICamera {
		readonly lightPoint: ILightPoint;
		readonly face: uint;
		readonly affectedObjects: IObjectArray;
	}

	export interface IShadowCasterCube {
		[i: int]: IShadowCaster;
	}
}

#endif