#ifndef ISHADOWCASTER_TS
#define ISHADOWCASTER_TS

module akra {

	IFACE(ILightPoint);
	IFACE(IObjectArray);
	IFACE(IMat4);
	IFACE(IFrustum);

	export interface IShadowCaster extends ICamera {
		readonly lightPoint: ILightPoint;
		readonly face: uint;
		readonly affectedObjects: IObjectArray;
		readonly optimizedProjection: IMat4;
		//casted shadows in the last frame
		isShadowCasted: bool;

		_optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void;
	}
}

#endif